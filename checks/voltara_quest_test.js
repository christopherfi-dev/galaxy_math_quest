// Plays the whole Voltara quest in prototypes/kis_station_sketch.html, on an iPad and on a phone.   [Proposal]
//
// It walks all nine places by typed commands, does every piece of maths, finds all 7 Voltara secrets,
// and finishes with the real-life step and the teacher's code.
// Answers are worked out from the words and numbers on the screen, not from the game's own answer.
// It also checks that the maths is what opens the way:
//   - you cannot cross the river, open the tower, use the plan table, or pass the dark tunnel too early
//   - a plan that uses too much, or leaves energy unused, is refused
//   - the streets really change with the student's own plan
//
// Run:  node checks/voltara_quest_test.js [folder for screenshots]
// Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
const CHOICE_CODE = 728;      // the teacher's code for the last step. It is in the Voltara guide, not in the page.
(async () => {
  const out = process.argv[2], b = await chromium.launch(), errs = [], bad = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    // the teacher shortcuts: from a station bay, a real tap on the bar at the top lands in the meadow. Nothing is lost. And back again.
    await p.evaluate(() => skipIntro()); await p.fill('#cmd', 'go to shield'); await p.press('#cmd', 'Enter'); await p.waitForTimeout(2600);
    const before = await p.evaluate(() => ({ cards: S.cards.length, room: S.room })); await p.locator('#t_volt').tap(); await p.waitForTimeout(900);
    let cut = await p.evaluate(() => { const d = cx.getImageData(Math.round(cv.width * .5), Math.round(cv.height * .1), 1, 1).data; return { mode: S.mode, sc: S.v.sc, toy: !$('toy').hidden, cards: S.cards.length, now: $('t_now').textContent, sky: d[0] > 150, text: lines[lines.length - 1].text }; });
    if (cut.mode !== 'planet' || cut.sc !== 'meadow' || cut.toy || cut.cards !== before.cards || !cut.sky || !/Landing Meadow/.test(cut.now) || !/Teacher shortcut/.test(cut.text)) bad.push(name + ': teacher shortcut to Voltara ' + JSON.stringify(cut));
    await p.locator('#t_stn').tap(); await p.waitForTimeout(700); cut = await p.evaluate(() => ({ mode: S.mode, room: S.room, now: $('t_now').textContent, ended: S.ended }));
    if (cut.mode !== 'station' || cut.room !== before.room || cut.ended || !/Shield Bay/.test(cut.now)) bad.push(name + ': teacher shortcut back to the station ' + JSON.stringify(cut));
    await p.fill('#cmd', 'teacher voltara'); await p.press('#cmd', 'Enter'); await p.waitForTimeout(300); if ((await p.evaluate(() => S.mode)) !== 'planet') bad.push(name + ': typing "teacher voltara" did not work');
    await p.evaluate(() => restart()); await p.waitForTimeout(200);
    // start from a finished station, in space beside Galaxy Numerix
    await p.evaluate(() => { skipIntro(); TASKS.forEach(t => S.done[t[0]] = true); syncParts(); S.course = true; S.ended = true; S.mode = 'space'; S.at = 'numerix'; SP.x = GAL.numerix.x; SP.y = GAL.numerix.y; SP.zoom = 1; save(); drawStatus(); }); await p.waitForTimeout(300);
    const idle = async () => { for (let i = 0; i < 200; i++) { if (await p.evaluate(() => PL.to == null && !PL.then)) return; await p.waitForTimeout(100); } bad.push(name + ': still walking'); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(120); await idle(); await p.waitForTimeout(90); return last(); };
    const expect = (got, re, what) => { if (!re.test(got)) bad.push(`${name}: ${what}: got "${got}"`); };
    const shot = async n => { if (out) { await p.waitForTimeout(550); await p.screenshot({ path: path.join(out, `vq_${name}_${n}.png`) }); } };
    const q = async () => (await p.textContent('#toy .q')).trim(), msg = () => p.textContent('#msg'), at = () => p.evaluate(() => V().sc);
    const nums = t => (t.match(/\d[\d,]*/g) || []).map(x => +x.replace(/,/g, ''));
    const fill = async (vals) => { const ins = p.locator('#toy input'); for (let i = 0; i < vals.length; i++) await ins.nth(i).fill(String(vals[i])); await p.click('#try'); await p.waitForTimeout(140); };
    const walk = async (dir, n) => { for (let i = 0; i < n; i++) await say('go ' + dir); };

    expect(await say('land'), /city across the river is dark/, 'landing');
    await shot('1_meadow');
    // ---- the meadow and the river: a hungry fish, then rounding to cross
    expect(await say('talk butterfly'), /dig by the tall tree/, 'butterfly');
    expect(await say('eat fruit'), /tastes like/, 'eat a FlavorBurst'); expect(await say('take fruit'), /pick a FlavorBurst/, 'take a FlavorBurst');
    expect(await say('hint'), /Give the FlavorBurst to the Gumblefish/, 'hint with the fruit');
    await say('go east'); expect(await at(), /river/, 'reach the river');
    expect(await say('go east'), /too wide|need a way/, 'the river blocks you');
    expect(await say('talk fish'), /hungry/, 'the Gumblefish is hungry');
    expect(await say('give fruit to fish'), /stones rise/, 'feed the Gumblefish');
    await say('talk fish'); expect(await p.textContent('#toy .eyebrow'), /See it first/, 'the idea is shown before the question'); await shot('2_river_demo'); await p.click('#try');
    for (let i = 0; i < 4; i++) { const n = nums(await q())[0], lo = Math.floor(n / 100) * 100, ans = n - lo >= 50 ? lo + 100 : lo;
      if (i === 0) { await p.click(`#toy .opt[data-n="${ans === lo ? lo + 100 : lo}"]`); expect(await msg(), /Splash/, 'a wrong stone'); await shot('3_river_stone'); }
      if (i === 3 && n % 100 !== 50) bad.push(name + ': the last stone should be a halfway number');
      await p.click(`#toy .opt[data-n="${ans}"]`); await p.waitForTimeout(150); }
    await idle(); expect(await last(), /far bank/, 'crossing the river');
    // ---- the plaza and the hall: the tower is locked until you meet the Council
    await say('go east'); expect(await at(), /plaza/, 'reach the plaza'); await shot('4_plaza');
    expect(await say('read notice'), /SOS/, 'the notice'); expect(await say('open tower'), /locked/, 'the tower is locked first');
    await say('enter hall'); expect(await at(), /hall/, 'enter the hall'); expect(await say('use table'), /Talk to the Council first/, 'the table before the Council');
    expect(await say('talk council'), /crystal key/, 'meet the Council'); expect(await say('use table'), /needs two things/, 'the table before the numbers'); await shot('5_hall');
    await say('leave'); expect(await at(), /plaza/, 'leave the hall');
    // ---- count the tower: 150 sparks, 70 rods and 8 big crystals, regrouped
    await say('open tower'); expect(await p.textContent('#toy .eyebrow'), /See it first/, 'bundling is shown first'); await p.click('#try'); await p.click('#try');
    let t = await q(); await fill([nums(t)[0] / 10]); t = await q(); const rods = nums(t).find(x => x === 85) || nums(t)[2]; await fill([Math.floor(rods / 10), rods % 10 + 1]); expect(await msg(), /Not yet/, 'a wrong regroup'); await shot('6_tower'); await fill([Math.floor(rods / 10), rods % 10]);
    t = await q(); const m3 = t.match(/= (\d+) big crystals, and (\d+) rods/); await fill([m3[1] * 100 + m3[2] * 10]); expect(await last(), /1,650/, 'the tower total');
    // ---- the three streets: read each board and add
    const totals = {};
    for (const street of ['Home Street', 'Market Street', 'Factory Row']) { await say('go east'); await say('use board'); const needs = (await p.locator('#toy .chips .chip').allTextContents()).map(c => nums(c).pop()), sum = needs.reduce((a, c) => a + c, 0); totals[street] = sum;
      if (street === 'Home Street') { await p.click('#leave'); expect(await say('look zoo'), /needs 30 energy.*dark/, 'a dark place'); await say('use board'); await fill([sum + 10]); expect(await msg(), /Not yet/, 'a wrong street total'); await shot('7_street_board'); } await fill([sum]); expect(await last(), new RegExp(`needs ${sum}`), street + ' total'); }
    // ---- back to the hall: estimate, then the exact shortage
    await walk('west', 3); await say('enter hall'); await say('use table');
    const round100 = n => Math.floor((n + 50) / 100) * 100; let labels = await p.locator('#toy .code .note').allTextContents(); await fill(labels.map(l => round100(nums(l)[0])));
    for (let i = 0; i < 4; i++) { const ex = (await q()).match(/([\d,]+(?: [+−] [\d,]+)+) =/)[1], parts = ex.split(' '); let v = +parts[0].replace(/,/g, ''); for (let k = 1; k < parts.length; k += 2) v += (parts[k] === '+' ? 1 : -1) * +parts[k + 1].replace(/,/g, ''); if (i === 1) await shot('8_estimate'); await fill([v]); }
    expect(await last(), /570 short/, 'the shortage'); if (totals['Home Street'] + totals['Market Street'] + totals['Factory Row'] - 1650 !== 570) bad.push(name + ': the board numbers do not make 570');
    // ---- the plan: too much is refused, unused energy is refused
    expect(await say('use table'), /21 places/, 'the plan table');
    const spots = await p.evaluate(() => SPOTS.map(s => ({ i: s.i, name: s.name, need: s.need })));
    for (const s of spots) await p.click(`#toy .wire[data-p="${s.i}"]`); await p.click('#try'); expect(await msg(), /Too much/, 'a plan that uses too much'); for (const s of spots) await p.click(`#toy .wire[data-p="${s.i}"]`);
    await p.click(`#toy .wire[data-p="${spots.find(s => s.name === 'Hospital').i}"]`); await p.click('#try'); expect(await msg(), /spare/, 'a plan that leaves energy unused');
    const want = ['Hospital', 'Amusement Park', 'Zoo', 'Schools', 'Neighborhood 1', 'Neighborhood 2', 'Supermarket', 'Factory', 'Solar Power Plant', 'Restaurants', 'Parks', 'Bus Stop', 'Swimming Pool', 'Recycling Plant', 'Warehouse', 'Gas Station', 'Arts Theater', 'Sports Arena', 'Hotels', 'Office Buildings', 'Shopping Mall'];
    let total = 50; const lit = ['Hospital']; for (const nm of want.slice(1)) { const s = spots.find(x => x.name === nm); if (total + s.need <= 1650) { total += s.need; lit.push(nm); await p.click(`#toy .wire[data-p="${s.i}"]`); } }
    await shot('9_plan'); await p.click('#try'); await p.waitForTimeout(200); expect(await last(), /Lights come on/, 'the plan'); if (total > 1650 || spots.some(s => !lit.includes(s.name) && 1650 - total >= s.need)) bad.push(name + ': the test plan is not a full plan');
    // ---- the night log: the tower sends 30 more than the city uses
    expect(await say('talk council'), /log/, 'the Council points to the log'); await say('use log'); const row = [0].concat((await p.locator('#toy tbody tr').first().locator('td').allTextContents()).slice(1).map(c => nums(c)[0])); if (row[1] !== total) bad.push(name + `: the log does not use the student's own plan (${row[1]} against ${total})`);
    await shot('10_log'); await fill([row[2] - row[1]]); await fill([8 * (row[2] - row[1])]); expect(await last(), /240/, 'the night log');
    // ---- the streets changed with the plan
    await say('leave'); expect(await say('take coin'), /lucky Voltara coin/, 'the fountain runs after the plan'); await say('go east'); await shot('11_homes_lit');
    expect(await say('look zoo'), /lights are on/, 'a lit place'); expect(await say('look ' + spots.find(s => !lit.includes(s.name)).name.toLowerCase()), /./, 'a dark place still answers');
    await walk('east', 2); expect(await at(), /works/, 'Factory Row'); expect(await say('open hatch'), /pitch dark/, 'the tunnel without a light'); expect(await say('go east'), /pitch dark|need a light/, 'the dark stops you');
    expect(await say('hint'), /glow stone/, 'the hint sends you for a light');
    // ---- all the way back to the meadow for the glow stone. The world stays walkable.
    await say('go west'); await walk('west', 5); expect(await at(), /meadow/, 'back at the meadow'); await say('look tree'); expect(await say('dig'), /glow stone/, 'dig up the glow stone'); expect(await say('push rock'), /tiny door/, 'the rock'); expect(await say('open door'), /tiny voices/, 'the tiny door'); await say('take fruit');
    await walk('east', 3); expect(await say('give fruit to zebra'), /happy dance/, 'feed the zebra'); await say('go east'); expect(await say('ride wheel'), /ride the big wheel/, 'ride the wheel, lit by the plan');
    await say('go east'); await say('open hatch'); expect(await at(), /tunnel/, 'the tunnel'); await shot('12_tunnel'); await say('go east'); expect(await at(), /hollow/, 'the hidden town'); await p.waitForTimeout(400); await shot('13_hollow');
    await say('talk elder'); await fill([29]); expect(await msg(), /Count one row/, 'a wrong count'); await fill([5 * 6]); await fill([30 * 1]); expect(await last(), /missing energy/, 'the mystery solved');
    // ---- the Council's choice: a real-life step with the teacher's code
    await walk('west', 5); await say('enter hall'); await say('talk council'); expect(await p.textContent('#toy .eyebrow'), /real-life task/, 'the last step is a real-life task'); await shot('14_choice');
    await fill([111]); expect(await msg(), /not the code/, 'a wrong code'); await fill([CHOICE_CODE]); expect(await last(), /GOLD card/, 'the gold card');
    await say('leave'); await walk('west', 2); expect(await say('fly'), /lift off/, 'fly away');
    const st = await p.evaluate(() => ({ steps: STEPS.filter(s => vDone(s[0])).length, secrets: S.secrets.filter(s => ['fruit', 'stone', 'door', 'hollow', 'coin', 'zebra', 'wheel'].includes(s)).length, gold: S.cards.filter(c => c.r === 'gold').length, cards: S.cards.length, mode: S.mode, side: document.documentElement.scrollWidth > innerWidth + 1, mission: $('mission').innerText.includes('9 of 9') }));
    if (st.steps !== 9 || st.secrets !== 7 || st.gold < 1 || st.mode !== 'space' || st.side || !st.mission) bad.push(name + ': end state ' + JSON.stringify(st));
    console.log(`${name}: ${st.steps} of 9 mission steps, ${st.secrets} of 7 Voltara secrets, ${st.cards} cards, gold: ${st.gold > 0}, flew away: ${st.mode === 'space'}`);
    await ctx.close();
  }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none');
  console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL');
  await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0]); process.exit(1); });
