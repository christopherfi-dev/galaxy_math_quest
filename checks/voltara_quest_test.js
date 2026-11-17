// Plays the whole Voltara quest in prototypes/kis_station_sketch.html, on an iPad and on a phone.   [Proposal]
//
// It walks all nine places by typed commands, does every piece of maths, finds all 7 Voltara secrets,
// and finishes with the real-life step and the teacher's code.
// Answers are worked out from the words and numbers on the screen, not from the game's own answer.
// It also checks that the maths is what opens the way:
//   - you cannot cross the river, open the tower, use the plan table, or pass the dark tunnel too early
//   - a plan that uses too much is refused. Unused energy is saved.
//   - a plan lasts a day. The morning report, the next day's energy and the look of the planet all follow the plan (four days are played)
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
    // ---- the plan, day 1. The Council names what people need first. Too much is refused. Unused energy is allowed: it is saved.
    expect(await say('talk council'), /what do people need most/, 'the Council names the needs before the plan'); expect(await say('use log'), /do not see/, 'the tower log is not there before a plan');
    expect(await say('use table'), /21 places/, 'the plan table');
    const spots = await p.evaluate(() => SPOTS.map(s => ({ i: s.i, name: s.name, need: s.need }))), id = n => n === 'Nomad Hollow' ? 21 : spots.find(s => s.name === n).i, cost = n => n === 'Nomad Hollow' ? 240 : spots.find(s => s.name === n).need, fmt = n => n.toLocaleString('en-US');
    const FUN = ['Parks', 'Zoo', 'Swimming Pool', 'Sports Arena', 'Arts Theater', 'Amusement Park', 'Shopping Mall', 'Restaurants'];
    const metOf = (names, kin) => { const on = n => names.includes(n); return [on('Neighborhood 1') && on('Neighborhood 2'), on('Hospital'), on('Supermarket'), on('Schools'), on('Factory') || on('Office Buildings'), on('Bus Stop') || on('Gas Station'), on('Recycling Plant'), FUN.filter(on).length >= 2, on('Solar Power Plant')].concat(kin ? [on('Nomad Hollow')] : []); };
    const needRow = () => p.evaluate(() => [...document.querySelectorAll('#needs .need')].map(e => e.textContent.trim()));
    const setPlan = async names => { const on = await p.evaluate(() => [...widget.on]), want = names.map(id); for (const i of on) if (!want.includes(i)) await p.click(`#toy .wire[data-p="${i}"]`); for (const i of want) if (!on.includes(i)) await p.click(`#toy .wire[data-p="${i}"]`); };
    let supply = 1650, day = 1, kin = false;
    // one whole day: set the plan, switch on, sleep, and answer the morning report from the rules, not from the page
    const switchOn = async names => { await setPlan(names); const total = names.reduce((a, n) => a + cost(n), 0), m = metOf(names, kin), row = await needRow(); if (row.length !== m.length || row.some((r, i) => r[0] !== (m[i] ? '✓' : '✗'))) bad.push(`${name}: day ${day}: the needs row is wrong: ${row.join(' | ')}`);
      const spare = await p.textContent('#spare'); if (!spare.includes(fmt(supply - total) + ' saved')) bad.push(`${name}: day ${day}: the saved energy shows "${spare}", not ${supply - total}`);
      await p.click('#try'); await p.waitForTimeout(200); expect(await last(), new RegExp(`Lights come on in ${names.length} places\\. ${m.filter(Boolean).length} of ${m.length} needs`), `the plan, day ${day}`); return { total, m }; };
    const morning = async (names, pl) => { const first = day === 1, exp = 1350 + (names.includes('Solar Power Plant') ? 300 : 0) + (names.includes('Nomad Hollow') ? 100 : 0) + (supply - pl.total), theft = kin ? 0 : 240;
      await say('use log'); expect(await p.textContent('#toy .eyebrow'), /Morning report/, 'the morning report'); const no = await p.locator('#toy .report2 li.no').count(), ok = await p.locator('#toy .report2 li.ok').count(); if (no !== pl.m.filter(x => !x).length || ok !== pl.m.filter(Boolean).length) bad.push(`${name}: day ${day}: the report lists ${ok} met and ${no} not met`);
      if (first) { await fill([exp + 10]); expect(await msg(), /Not yet/, 'a wrong morning total'); } await fill([exp]);
      if (theft) { const t = await q(); if (!t.includes(fmt(exp)) || !t.includes(fmt(exp - 240))) bad.push(`${name}: day ${day}: the missing-energy question has the wrong numbers: ${t}`); await fill([240]); if (first) { expect(await q(), /8 hours/, 'the hourly question'); await fill([30]); } }
      supply = exp - theft; day++; const got = await last(); expect(got, new RegExp(`Day ${day}\\. The tower holds ${fmt(supply)}\\. Yesterday ${pl.m.filter(Boolean).length} of ${pl.m.length} needs`), `the morning after day ${day - 1}`); const st = await p.evaluate(() => ({ day: V().day, supply: V().supply })); if (st.day !== day || st.supply !== supply) bad.push(`${name}: the world is on day ${st.day} with ${st.supply}, expected day ${day} with ${supply}`); return got; };
    for (const s of spots) await p.click(`#toy .wire[data-p="${s.i}"]`); await p.click('#try'); expect(await msg(), /Too much/, 'a plan that uses too much'); for (const s of spots) await p.click(`#toy .wire[data-p="${s.i}"]`);
    if ((await needRow()).some(r => r[0] !== '✗')) bad.push(name + ': an empty plan should meet no needs'); await p.click('#try'); expect(await msg(), /Tap some places/, 'an empty plan');
    await p.click(`#toy .wire[data-p="${id('Hospital')}"]`); await p.waitForTimeout(300); if (!(await needRow()).includes('✓ Health')) bad.push(name + ': lighting the Hospital should meet Health');
    { const look = await p.evaluate(i => { const on = document.querySelector(`#toy .wire[data-p="${i}"]`), off = document.querySelector('#toy .wire:not(.on)'), c = e => getComputedStyle(e).backgroundColor; return { on: c(on), off: c(off), tick: getComputedStyle(on, '::before').content, pressed: on.getAttribute('aria-pressed') }; }, id('Hospital'));
      if (look.on === look.off || !/255, 178, 62/.test(look.on) || !/✓/.test(look.tick) || look.pressed !== 'true') bad.push(name + ': a tapped place does not look lit ' + JSON.stringify(look)); }
    { const fit = await p.evaluate(() => { const t = $('toy').getBoundingClientRect(), b = $('try').getBoundingClientRect(); return b.bottom <= t.bottom + 1 && b.top >= t.top; }); if (!fit && name === 'ipad') bad.push(name + ': the Switch on button is cut off'); }
    // DAY 1, a careless plan: fun first. No solar plant, no recycling, no school, no bus. It is allowed. It has a price.
    const careless = ['Hospital', 'Shopping Mall', 'Amusement Park', 'Hotels', 'Restaurants', 'Sports Arena', 'Arts Theater', 'Zoo', 'Swimming Pool', 'Parks', 'Office Buildings', 'Neighborhood 1', 'Neighborhood 2', 'Supermarket'];
    const cardsA = await p.evaluate(() => S.cards.length); await setPlan(careless); await shot('9_plan'); let pl = await switchOn(careless); if (pl.m.filter(Boolean).length !== 5) bad.push(name + ': the careless plan should meet 5 of 9 needs');
    expect(await say('talk council'), /In the morning, read the tower log/, 'the Council points to the log'); expect(await say('ride wheel'), /./, 'still in the hall');
    await say('use log'); await shot('10_morning'); await p.click('#leave'); expect(await morning(careless, pl), /240 energy vanished/, 'the mystery comes out of the morning sum'); if (supply !== 1250) bad.push(name + ': after the careless day the tower should hold 1,250, not ' + supply);
    if ((await p.evaluate(() => S.cards.length)) !== cardsA + 2) bad.push(name + ': the first plan and the first report should give one card each');
    // ---- the planet is worse off, and you can see it and read it
    { const m = await p.evaluate(() => $('mission').innerText); if (!/Voltara, day 2/.test(m) || !/getting by: 5 of 9/.test(m) || !/weaker/.test(m)) bad.push(name + ': the mission box does not say the planet is worse off: ' + m.slice(-220)); }
    expect(await say('use log'), /Make today's plan/, 'one report a day'); expect(await say('look map'), /weaker/, 'the wall map tells how the planet is');
    await say('leave'); expect(await say('take coin'), /lucky Voltara coin/, 'the fountain runs after the plan'); await say('go east'); await shot('11_homes_rubbish');
    { const heap = await p.evaluate(() => lastDay().bad.join(' ')); if (!/clean/.test(heap) || !/learn/.test(heap) || !/travel/.test(heap) || !/power/.test(heap)) bad.push(name + ': the night should have left four needs unmet: ' + heap); }
    expect(await say('look zoo'), /lights are on/, 'a lit place'); expect(await say('look schools'), /Last night: The schools stayed shut/, 'a dark place tells what happened');
    await walk('east', 2); expect(await at(), /works/, 'Factory Row'); expect(await say('look solar'), /Last night: The solar plant slept/, 'the dark solar plant'); expect(await say('open hatch'), /pitch dark/, 'the tunnel without a light'); expect(await say('go east'), /pitch dark|need a light/, 'the dark stops you');
    expect(await say('hint'), /glow stone/, 'the hint sends you for a light');
    // ---- all the way back to the meadow for the glow stone. The world stays walkable.
    await say('go west'); await walk('west', 5); expect(await at(), /meadow/, 'back at the meadow'); await say('look tree'); expect(await say('dig'), /glow stone/, 'dig up the glow stone'); expect(await say('push rock'), /tiny door/, 'the rock'); expect(await say('open door'), /tiny voices/, 'the tiny door'); await say('take fruit');
    await walk('east', 3); expect(await say('give fruit to zebra'), /happy dance/, 'feed the zebra'); await say('go east'); expect(await say('ride wheel'), /ride the big wheel/, 'ride the wheel, lit by the plan');
    await say('go east'); await say('open hatch'); expect(await at(), /tunnel/, 'the tunnel'); await shot('12_tunnel'); await say('go east'); expect(await at(), /hollow/, 'the hidden town'); await p.waitForTimeout(400); await shot('13_hollow');
    await say('talk elder'); await fill([29]); expect(await msg(), /Count one row/, 'a wrong count'); await fill([5 * 6]); await fill([30 * 1]); expect(await last(), /missing energy/, 'the mystery solved');
    // DAY 2: yesterday's plan no longer fits. Mend the city: all nine needs cost 1,220 and the tower holds 1,250.
    await walk('west', 5); await say('enter hall'); await say('use table'); await p.click('#try'); expect(await msg(), /Too much.*only 1,250/, 'yesterday\'s plan no longer fits the weaker tower');
    const nine = ['Neighborhood 1', 'Neighborhood 2', 'Hospital', 'Supermarket', 'Schools', 'Factory', 'Bus Stop', 'Recycling Plant', 'Zoo', 'Swimming Pool', 'Solar Power Plant'];
    const cardsB = await p.evaluate(() => S.cards.length); pl = await switchOn(nine); if (pl.total !== 1220 || pl.m.some(x => !x)) bad.push(name + ': the mending plan should cost 1,220 and meet all nine needs');
    expect(await morning(nine, pl), /240 went missing again/, 'the second morning'); if (supply !== 1440) bad.push(name + ': after the mending day the tower should hold 1,440, not ' + supply);
    if ((await p.evaluate(() => S.cards.length)) !== cardsB) bad.push(name + ': later days should not give cards');
    // ---- the Council's choice: a real-life step with the teacher's code
    await say('talk council'); expect(await p.textContent('#toy .eyebrow'), /real-life task/, 'the last step is a real-life task'); await shot('14_choice');
    await fill([111]); expect(await msg(), /not the code/, 'a wrong code'); await fill([CHOICE_CODE]); expect(await last(), /GOLD card.*Nomad Hollow is on the plan table/, 'the gold card'); kin = true;
    // ---- after the choice, the Nomads are in the plan. Dark, their town is dark. Lit, they are neighbours and mend a panel.
    { const dark = await p.evaluate(() => [VDO.houses.look(), VDO.elder.talk(), V().final && !powered(21)]); if (!/lights are out/.test(dark[0]) || !/very dark/.test(dark[1]) || !dark[2]) bad.push(name + ': the hollow should be dark until it is in a plan: ' + dark.join(' | ')); }
    // DAY 3: 1,440 cannot pay for all ten needs (1,460). Something has to give. Here it is joy.
    expect(await say('use table'), /Nomad Hollow is among them/, 'Nomad Hollow joins the table'); if ((await p.locator('#toy .wire').count()) !== 22 || (await needRow()).length !== 10) bad.push(name + ': the table should show 22 places and ten needs after the choice');
    const ten = nine.concat(['Nomad Hollow']); await setPlan(ten); await p.click('#try'); expect(await msg(), /Too much/, 'all ten needs do not fit on a weak day');
    const noJoy = ten.filter(n => n !== 'Zoo' && n !== 'Swimming Pool'); await shot('15_day3_plan'); pl = await switchOn(noJoy); if (pl.m.filter(Boolean).length !== 9) bad.push(name + ': day 3 should meet 9 of 10');
    { const lit = await p.evaluate(() => [VDO.houses.look(), VDO.elder.talk()]); if (!/one tiny light/.test(lit[0]) || !/mended one of your panels/.test(lit[1])) bad.push(name + ': the lit hollow: ' + lit.join(' | ')); }
    const d3 = await morning(noJoy, pl); if (/missing/.test(d3) || supply !== 1780) bad.push(name + ": day 3 should end with no theft and 1,780, got " + supply + ": " + d3);
    // DAY 4: the tower is strong again. All ten needs fit, with energy to spare.
    await say('use table'); pl = await switchOn(ten); await say('use log'); await shot('16_morning4'); await p.click('#leave'); await morning(ten, pl); if (supply !== 2070) bad.push(name + ': day 4 should end with 2,070, not ' + supply);
    { const m = await p.evaluate(() => $('mission').innerText); if (!/doing well: 10 of 10/.test(m) || !/stronger/.test(m)) bad.push(name + ': the mission box should say the planet is better off: ' + m.slice(-220)); }
    await say('leave'); await walk('west', 2); const bye = await say('fly'); expect(bye, /lift off.*doing well: 10 of 10/, 'fly away, and hear how you left the planet'); if (/do better/.test(bye)) bad.push(name + ': a good ending should not ask you to do better');
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
