// Plays the whole Voltara quest in prototypes/kis_station_sketch.html, on an iPad and on a phone.   [Proposal]
//
// It walks all nine places by typed commands, does every piece of maths, finds all 7 Voltara secrets,
// and finishes with the real-life step and the teacher's code.
// Answers are worked out from the words and numbers on the screen, not from the game's own answer.
// It also checks that the maths is what opens the way:
//   - you cannot cross the river, open the tower, use the plan table, or pass the dark tunnel too early
//   - a plan that uses too much is refused. Unused energy is saved.
//   - a plan lasts a day. Every place has values. The morning report, the next day's energy, the smoke and the ending all follow the plans.
//     Five days are played, and they reach all four endings: worse off, power but not happy, shining, happy but short of power.
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
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} }); /* reading cards have their own test: reading_card_test.js */ await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    // the teacher shortcuts: from a station bay, a real tap on the bar at the top lands in the meadow. Nothing is lost. And back again.
    await p.evaluate(() => skipIntro()); await p.fill('#cmd', 'go to shield'); await p.press('#cmd', 'Enter'); await p.waitForTimeout(2600);
    const before = await p.evaluate(() => ({ cards: S.cards.length, room: S.room })); await p.evaluate(() => menuOpen('teacher')); await p.waitForTimeout(120); await p.locator('#t_volt').tap(); await p.waitForTimeout(900);
    let cut = await p.evaluate(() => { const d = cx.getImageData(Math.round(cv.width * .5), Math.round(cv.height * .1), 1, 1).data; return { mode: S.mode, sc: S.v.sc, toy: !$('toy').hidden, cards: S.cards.length, now: $('t_now').textContent, sky: d[0] > 150, text: lines[lines.length - 1].text }; });
    if (cut.mode !== 'planet' || cut.sc !== 'meadow' || cut.toy || cut.cards !== before.cards || !cut.sky || !/Landing Meadow/.test(cut.now) || !/Teacher shortcut/.test(cut.text)) bad.push(name + ': teacher shortcut to Voltara ' + JSON.stringify(cut));
    await p.evaluate(() => menuOpen('teacher')); await p.waitForTimeout(120); await p.locator('#t_stn').tap(); await p.waitForTimeout(700); cut = await p.evaluate(() => ({ mode: S.mode, room: S.room, now: $('t_now').textContent, ended: S.ended }));
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
      if (street === 'Home Street') { await p.click('#leave'); expect(await say('look zoo'), /uses 30 energy.*dark/, 'a dark place'); await say('use board'); await fill([sum + 10]); expect(await msg(), /Not yet/, 'a wrong street total'); await shot('7_street_board'); } await fill([sum]); expect(await last(), new RegExp(`needs ${sum}`), street + ' total'); }
    // ---- back to the hall: estimate, then the exact shortage
    await walk('west', 3); await say('enter hall'); await say('use table');
    const round100 = n => Math.floor((n + 50) / 100) * 100; let labels = await p.locator('#toy .code .note').allTextContents(); await fill(labels.map(l => round100(nums(l)[0])));
    for (let i = 0; i < 4; i++) { const ex = (await q()).match(/([\d,]+(?: [+−] [\d,]+)+) =/)[1], parts = ex.split(' '); let v = +parts[0].replace(/,/g, ''); for (let k = 1; k < parts.length; k += 2) v += (parts[k] === '+' ? 1 : -1) * +parts[k + 1].replace(/,/g, ''); if (i === 1) await shot('8_estimate'); await fill([v]); }
    expect(await last(), /570 short/, 'the shortage'); if (totals['Home Street'] + totals['Market Street'] + totals['Factory Row'] - 1650 !== 570) bad.push(name + ': the board numbers do not make 570');
    // ---- the plan, day 1. The Council sets two goals first. Too much is refused. Unused energy is allowed: it is saved.
    expect(await say('talk council'), /600 more happy people than unhappy.*1,650 or more in the tower/, 'the Council sets the two goals before the plan'); expect(await say('use log'), /do not see/, 'the tower log is not there before a plan');
    expect(await say('use table'), /21 places/, 'the plan table');
    const spots = await p.evaluate(() => SPOTS.map(s => ({ i: s.i, name: s.name, need: s.need }))), id = n => n === 'Nomad Hollow' ? 21 : spots.find(s => s.name === n).i, cost = n => n === 'Nomad Hollow' ? 240 : spots.find(s => s.name === n).need, fmt = n => n.toLocaleString('en-US');
    // the rules, written out again here so the page is checked against them and not against itself.  place: [happy if lit, unhappy if dark]
    const VALS = { 'Round Houses': [80, 250], 'Stilt Houses': [80, 250], 'Schools': [60, 60], 'Hospital': [40, 300], 'Parks': [40, 0], 'Zoo': [30, 0], 'Swimming Pool': [20, 0], 'Supermarket': [60, 250], 'Shopping Mall': [80, 0], 'Office Buildings': [50, 20], 'Hotels': [30, 0], 'Restaurants': [60, 0],
      'Sports Arena': [40, 0], 'Arts Theater': [30, 0], 'Bus Stop': [30, 40], 'Amusement Park': [70, 0], 'Factory': [40, 0], 'Solar Power Plant': [0, 0], 'Warehouse': [20, 0], 'Recycling Plant': [20, 40], 'Gas Station': [20, 20], 'Nomad Hollow': [40, 40] };
    const GIVES = { 'Solar Power Plant': 600, 'Factory': 500, 'Nomad Hollow': 100 }, VITAL = Object.keys(VALS).filter(n => VALS[n][1] && n !== 'Nomad Hollow');
    let supply = 1650, day = 1, kin = false, smoke = 0; const record = [];
    const people = names => { const all = spots.map(s => s.name).concat(kin ? ['Nomad Hollow'] : []), sm = names.includes('Factory') ? smoke + 50 : Math.max(0, smoke - 20); return { happy: names.reduce((a, n) => a + VALS[n][0], 0), unhappy: all.filter(n => !names.includes(n)).reduce((a, n) => a + VALS[n][1], 0) + sm, harms: all.filter(n => !names.includes(n) && VALS[n][1]).length + (sm ? 1 : 0), sm }; };
    const setPlan = async names => { const on = await p.evaluate(() => [...widget.on]), want = names.map(id); for (const i of on) if (!want.includes(i)) await p.click(`#toy .wire[data-p="${i}"]`); for (const i of want) if (!on.includes(i)) await p.click(`#toy .wire[data-p="${i}"]`); };
    // one whole day: set the plan, switch on, sleep, and answer the morning report from the rules
    const switchOn = async names => { await setPlan(names); const total = names.reduce((a, n) => a + cost(n), 0), pp = people(names), hap = await p.textContent('#hap'), unh = await p.textContent('#unh'), spare = await p.textContent('#spare');
      if (!hap.includes(fmt(pp.happy) + ' happy') || !unh.includes(fmt(pp.unhappy) + ' unhappy')) bad.push(`${name}: day ${day}: the table shows "${hap}" and "${unh}", expected ${pp.happy} and ${pp.unhappy}`);
      if (!spare.includes(fmt(supply - total) + ' saved')) bad.push(`${name}: day ${day}: the saved energy shows "${spare}", not ${supply - total}`);
      await p.click('#try'); await p.waitForTimeout(200); expect(await last(), new RegExp(`Lights come on in ${names.length} places\\. ${fmt(pp.happy)} people are happy\\. ${fmt(pp.unhappy)} are unhappy`), `the plan, day ${day}`); return { total, pp }; };
    const morning = async (names, pl) => { const first = day === 1, pp = pl.pp, exp = 1050 + names.reduce((a, n) => a + (GIVES[n] || 0), 0) + (supply - pl.total), theft = kin ? 0 : 240, mood = pp.happy - pp.unhappy, act = Math.min(2000, exp - theft);
      await say('use log'); expect(await p.textContent('#toy .eyebrow'), /Morning report/, 'the morning report'); const no = await p.locator('#toy .report2 li.no').count(); if (no !== pp.harms) bad.push(`${name}: day ${day}: the report lists ${no} harms, expected ${pp.harms}`);
      if (pp.happy && pp.unhappy && mood) { const t = await q(); if (!t.includes(fmt(pp.happy) + ' people were happy') || !t.includes(mood > 0 ? 'happy than unhappy' : 'unhappy than happy')) bad.push(`${name}: day ${day}: the people question is wrong: ${t}`); if (first) { await fill([Math.abs(mood) + 10]); expect(await msg(), /Not yet/, 'a wrong difference'); } await fill([Math.abs(mood)]); }
      if (first) { await fill([exp + 10]); expect(await msg(), /Not yet/, 'a wrong morning total'); } await fill([exp]);
      if (theft) { const t = await q(); if (!t.includes(fmt(exp)) || !t.includes(fmt(exp - 240))) bad.push(`${name}: day ${day}: the missing-energy question has the wrong numbers: ${t}`); await fill([240]); if (first) { expect(await q(), /8 hours/, 'the hourly question'); await fill([30]); } }
      const okP = mood >= 600, okE = act >= 1650; record.push([okP, okE]); supply = act; smoke = pp.sm; day++; const got = await last();
      expect(got, new RegExp(`Day ${day}\\. The people are ${okP ? 'happy' : 'not happy'}: ${fmt(Math.abs(mood))} more ${mood >= 0 ? 'happy than unhappy' : 'unhappy than happy'}\\. The goal is 600\\..*The tower holds ${fmt(act)}${okE ? '\\.' : ', less'}`), `the morning after day ${day - 1}`);
      const st = await p.evaluate(() => ({ day: V().day, supply: V().supply, smoke: V().smoke, e: verdict(lastDay()) })); if (st.day !== day || st.supply !== supply || st.smoke !== smoke || st.e !== (okP ? 2 : 0) + (okE ? 1 : 0)) bad.push(`${name}: the world is ${JSON.stringify(st)}, expected day ${day}, tower ${supply}, smoke ${smoke}`); return got; };
    for (const s of spots) await p.click(`#toy .wire[data-p="${s.i}"]`); await p.click('#try'); expect(await msg(), /Too much/, 'a plan that uses too much'); for (const s of spots) await p.click(`#toy .wire[data-p="${s.i}"]`);
    expect(await p.textContent('#unh'), /1,230 unhappy/, 'an empty plan: everyone who needs something is unhappy'); await p.click('#try'); expect(await msg(), /Tap some places/, 'an empty plan');
    await p.click(`#toy .wire[data-p="${id('Hospital')}"]`); await p.waitForTimeout(300); expect(await p.textContent('#unh'), /930 unhappy/, 'lighting the Hospital takes 300 off the unhappy people'); expect(await p.textContent('#info'), /Hospital: It uses 50 energy\. Lit, it makes 40 people happy\. Dark, it makes 300 people unhappy\. It makes no power/, 'a tapped place tells its values');
    await p.click(`#toy .wire[data-p="${id('Factory')}"]`); expect(await p.textContent('#info'), /gives 500 energy tomorrow\. But its smoke makes 50 more people unhappy each day/, 'the Factory tells its trade-off'); expect(await p.textContent('#tmw'), /tower makes 1,050 · Factory \+500/, 'the line for tomorrow'); await p.click(`#toy .wire[data-p="${id('Factory')}"]`);
    { const look = await p.evaluate(i => { const on = document.querySelector(`#toy .wire[data-p="${i}"]`), off = document.querySelector('#toy .wire:not(.on)'), c = e => getComputedStyle(e).backgroundColor; return { on: c(on), off: c(off), tick: getComputedStyle(on, '::before').content, pressed: on.getAttribute('aria-pressed') }; }, id('Hospital'));
      if (look.on === look.off || !/255, 178, 62/.test(look.on) || !/✓/.test(look.tick) || look.pressed !== 'true') bad.push(name + ': a tapped place does not look lit ' + JSON.stringify(look)); }
    { const fit = await p.evaluate(() => { const t = $('toy').getBoundingClientRect(), b = $('try').getBoundingClientRect(); return b.bottom <= t.bottom + 1 && b.top >= t.top; }); if (!fit && name === 'ipad') bad.push(name + ': the Switch on button is cut off'); }
    // DAY 1, a careless plan: fun first. No power place, no school, no bus, no recycling. It is allowed. It has a price.
    const careless = ['Hospital', 'Shopping Mall', 'Amusement Park', 'Hotels', 'Restaurants', 'Sports Arena', 'Arts Theater', 'Zoo', 'Swimming Pool', 'Parks', 'Office Buildings', 'Round Houses', 'Stilt Houses', 'Supermarket'];
    const cardsA = await p.evaluate(() => S.cards.length); await setPlan(careless); await shot('9_plan'); let pl = await switchOn(careless);
    expect(await say('talk council'), /In the morning, read the tower log/, 'the Council points to the log');
    await say('use log'); await shot('10_morning'); await p.click('#leave'); expect(await morning(careless, pl), /240 energy vanished/, 'the mystery comes out of the morning sum'); if (supply !== 950) bad.push(name + ': after the careless day the tower should hold 950, not ' + supply);
    if ((await p.evaluate(() => S.cards.length)) !== cardsA + 2) bad.push(name + ': the first plan and the first report should give one card each');
    // ---- the planet is worse off, and you can see it and read it
    { const m = await p.evaluate(() => $('mission').innerText); if (!/Voltara, day 2/.test(m) || !/Voltara is worse off/.test(m) || !/550 more happy than unhappy/.test(m)) bad.push(name + ': the mission box does not say the planet is worse off: ' + m.slice(-260)); }
    expect(await say('use log'), /Make today's plan/, 'one report a day'); expect(await say('look map'), /worse off/, 'the wall map tells how the planet is');
    await say('leave'); expect(await say('take coin'), /lucky Voltara coin/, 'the fountain runs after the plan'); await say('go east'); await shot('11_homes_rubbish');
    { const dk = await p.evaluate(() => lastDay().dark.join(', ')); if (dk !== 'Schools, Bus Stop, Recycling Plant, Gas Station') bad.push(name + ': the night should have left four harms: ' + dk); }
    expect(await say('look zoo'), /uses 30 energy\. Lit, it makes 30 people happy\..*lights are on/, 'a lit place tells its values'); expect(await say('look schools'), /Dark, it makes 60 people unhappy.*Last night: The schools stayed shut/, 'a dark place tells what happened');
    await walk('east', 2); expect(await at(), /works/, 'Factory Row'); expect(await say('look solar'), /uses 250 energy.*gives 600 energy tomorrow/, 'the solar plant tells what it gives'); expect(await say('look factory'), /gives 500 energy tomorrow\. But its smoke/, 'the Factory tells its trade-off');
    expect(await say('open hatch'), /pitch dark/, 'the tunnel without a light'); expect(await say('go east'), /pitch dark|need a light/, 'the dark stops you');
    expect(await say('hint'), /glow stone/, 'the hint sends you for a light');
    // ---- all the way back to the meadow for the glow stone. The world stays walkable.
    await say('go west'); await walk('west', 5); expect(await at(), /meadow/, 'back at the meadow'); await say('look tree'); expect(await say('dig'), /glow stone/, 'dig up the glow stone'); expect(await say('push rock'), /tiny door/, 'the rock'); expect(await say('open door'), /tiny voices/, 'the tiny door'); await say('take fruit');
    await walk('east', 3); expect(await say('give fruit to zebra'), /happy dance/, 'feed the zebra'); await say('go east'); expect(await say('ride wheel'), /ride the big wheel/, 'ride the wheel, lit by the plan');
    await say('go east'); await say('open hatch'); expect(await at(), /tunnel/, 'the tunnel'); await shot('12_tunnel'); await say('go east'); expect(await at(), /hollow/, 'the hidden town'); await p.waitForTimeout(400); await shot('13_hollow');
    await say('talk elder'); await fill([29]); expect(await msg(), /Count one row/, 'a wrong count'); await fill([5 * 6]); await fill([30 * 1]); expect(await last(), /missing energy/, 'the mystery solved');
    // DAY 2: yesterday's plan no longer fits the weaker tower. The quick fix: run the Factory. It gives power, and smoke.
    await walk('west', 5); await say('enter hall'); await say('use table'); await p.click('#try'); expect(await msg(), /Too much.*only 950/, 'yesterday\'s plan no longer fits the weaker tower');
    const quick = ['Factory', 'Round Houses', 'Stilt Houses', 'Hospital', 'Supermarket', 'Schools', 'Bus Stop', 'Recycling Plant', 'Swimming Pool'];
    const cardsB = await p.evaluate(() => S.cards.length); pl = await switchOn(quick); expect(await morning(quick, pl), /240 went missing again/, 'the second morning'); if (supply !== 1320 || smoke !== 50) bad.push(name + `: after day 2 expected tower 1,320 and smoke 50, got ${supply} and ${smoke}`);
    if ((await p.evaluate(() => S.cards.length)) !== cardsB) bad.push(name + ': later days should not give cards');
    // ---- the Council's choice: a real-life step with the teacher's code
    await say('talk council'); expect(await p.textContent('#toy .eyebrow'), /real-life task/, 'the last step is a real-life task'); await shot('14_choice');
    await fill([111]); expect(await msg(), /not the code/, 'a wrong code'); await fill([CHOICE_CODE]); expect(await last(), /GOLD card.*Nomad Hollow is on the plan table/, 'the gold card'); kin = true;
    { const dark = await p.evaluate(() => [VDO.houses.look(), VDO.elder.talk(), V().final && !powered(21)]); if (!/lights are out/.test(dark[0]) || !/very dark/.test(dark[1]) || !dark[2]) bad.push(name + ': the hollow should be dark until it is in a plan: ' + dark.join(' | ')); }
    // DAY 3: both power places, and the Factory for a second day. The tower fills to its limit. The sky is brown. POWER, BUT NOT HAPPY.
    expect(await say('use table'), /Nomad Hollow is among them/, 'Nomad Hollow joins the table'); if ((await p.locator('#toy .wire').count()) !== 22) bad.push(name + ': the table should show 22 places after the choice');
    const power = ['Factory', 'Solar Power Plant', 'Round Houses', 'Stilt Houses', 'Hospital', 'Supermarket', 'Schools', 'Bus Stop', 'Recycling Plant', 'Gas Station', 'Amusement Park', 'Swimming Pool'];
    pl = await switchOn(power); const d3 = await morning(power, pl); expect(d3, /full at 2,000\. 160 energy was lost/, 'the tower is full at 2,000'); if (/missing/.test(d3) || supply !== 2000 || smoke !== 100) bad.push(name + `: day 3 should end with no theft, a full tower and smoke 100, got ${supply}, ${smoke}: ${d3}`);
    { const m = await p.evaluate(() => $('mission').innerText); if (!/enough power\. But the people are not happy/.test(m) || !/Smoke hangs/.test(m)) bad.push(name + ': the mission box should say power but not happy, with smoke: ' + m.slice(-260)); }
    // DAY 4: the clean way. Every place people need, the solar plant, the Nomads, and the best-value fun. VOLTARA SHINES, though the smoke is still clearing.
    const shine = VITAL.concat(['Solar Power Plant', 'Nomad Hollow', 'Amusement Park', 'Parks', 'Sports Arena', 'Restaurants', 'Zoo', 'Swimming Pool', 'Arts Theater', 'Warehouse']);
    await say('use table'); await setPlan(shine); await shot('15_day4_plan'); pl = await switchOn(shine);
    { const lit = await p.evaluate(() => [VDO.houses.look(), VDO.elder.talk()]); if (!/one tiny light/.test(lit[0]) || !/mended one of your panels/.test(lit[1])) bad.push(name + ': the lit hollow: ' + lit.join(' | ')); }
    await morning(shine, pl); if (supply !== 1890 || smoke !== 80) bad.push(name + `: day 4 should end with 1,890 and smoke 80, got ${supply}, ${smoke}`);
    { const m = await p.evaluate(() => $('mission').innerText); if (!/Voltara shines/.test(m)) bad.push(name + ': the mission box should say Voltara shines: ' + m.slice(-260)); }
    // DAY 5: everything for the people, nothing for tomorrow. HAPPY, BUT SHORT OF POWER.
    const spend = spots.map(s => s.name).filter(n => n !== 'Factory' && n !== 'Solar Power Plant'); await say('use table'); pl = await switchOn(spend); await say('use log'); await shot('16_morning5'); await p.click('#leave'); await morning(spend, pl); if (supply !== 1170 || smoke !== 60) bad.push(name + `: day 5 should end with 1,170 and smoke 60, got ${supply}, ${smoke}`);
    // ---- flying away shows your effect on the planet. You can stay. You can come back.
    await say('leave'); await walk('west', 2); expect(await say('fly'), /look back at what you did/, 'flying away shows the summary first'); await p.waitForTimeout(300); await shot('17_ending');
    { const t = await p.evaluate(() => $('toy').innerText.replace(/\s+/g, ' ')), both = record.filter(r => r[0] && r[1]).length;
      if (!/Your effect on Voltara · 5 days/i.test(t) || !/Happy, but short of power/.test(t) || !/Tower 1,650 1,170/.test(t) || !/860 happy, 100 unhappy/.test(t) || !/Sky clear smoky/.test(t) || !/found, but left dark/.test(t) || !new RegExp(`both goals met: ${both} of 5`).test(t) || both !== 1) bad.push(name + ': the ending summary: ' + t); }
    await p.click('#leave'); expect(await last(), /You stay/, 'you can stay'); if ((await p.evaluate(() => S.mode)) !== 'planet') bad.push(name + ': staying should keep you on the planet');
    await say('fly'); await p.click('#try'); await p.waitForTimeout(300); expect(await last(), /lift off.*The people are happy\. But the tower holds less power than they are used to/, 'fly away, and hear how you left the planet');
    // ---- come back: Voltara is as you left it
    await say('land'); { const back = await p.evaluate(() => ({ mode: S.mode, day: V().day, supply: V().supply, smoke: V().smoke, hist: V().hist.length })); if (back.mode !== 'planet' || back.day !== 6 || back.supply !== 1170 || back.smoke !== 60 || back.hist !== 5) bad.push(name + ': coming back should find Voltara as you left it: ' + JSON.stringify(back)); }
    await say('fly'); await p.click('#try'); await p.waitForTimeout(300);
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
