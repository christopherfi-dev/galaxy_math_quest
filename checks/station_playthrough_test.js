// Plays the whole KIS Station in prototypes/kis_station_sketch.html, on an iPad and on a phone.   [Proposal]
//
// It types the short commands a student would type, and taps the pictures with real taps.
// It does all 15 station tasks (three for each ship part), finds all 18 station secrets, and launches.
// Four tasks are real-life ones: the test types the teacher's code, after first trying a wrong one.
// Along the way it checks the things a stuck child needs:
//   - a number typed on its own opens the locker
//   - on a phone the camera follows, so the locker and every other thing can be seen
//   - the Hint always names a next step
//   - the ship will not launch with parts missing
//   - a rude ship name is refused
// Answers are worked out from what is on the screen (the question, the picture), not from the game's own answer.
//
// Run:  node checks/station_playthrough_test.js [folder for screenshots]
// Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
const CODES = { calib: 805, starmap: 314, target: 936, alloc: 446 };   // the teacher's codes. They are in the station guide, not in the page.
(async () => {
  const out = process.argv[2], b = await chromium.launch(), errs = [], bad = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { window.GMQ_NO_PV = true; /* the ship-part choice has its own test */ try { localStorage.setItem('gmq-real', 'on'); /* the real-life tasks and their codes; the on-screen ones have station_online_test.js */ localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} }); /* reading cards have their own test: reading_card_test.js */ await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); }); await p.waitForTimeout(700);
    const idle = async () => { for (let i = 0; i < 120; i++) { if (await p.evaluate(() => P.route.length === 0 && !P.then)) return; await p.waitForTimeout(100); } bad.push(name + ': still walking'); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(120); await idle(); await p.waitForTimeout(80); return last(); };
    const ok2 = (c, what) => { if (!c) bad.push(what); }; const expect = (got, re, what) => { if (!re.test(got)) bad.push(`${name}: ${what}: got "${got}"`); };
    const shot = async n => { if (out) await p.screenshot({ path: path.join(out, `st_${name}_${n}.png`) }); };
    const onScreen = id => p.evaluate(id => { const t = objTiles(id)[0], X = sx(t[0]) + ts / 2, Y = sy(t[1]) + ts / 2; return X > 4 && X < vw - 4 && Y > 4 && Y < vh - 4; }, id);
    const q = async () => (await p.textContent('#toy .q')).trim();
    const type = async v => { await p.fill('#ans', String(v)); await p.click('#try'); await p.waitForTimeout(130); };
    const pic = async sel => { const el = p.locator('#pic ' + sel); await el.scrollIntoViewIfNeeded(); await el.tap(); };
    const slip = async (cmd, id) => { await say(cmd); expect(await p.textContent('#toy .eyebrow'), /real-life task/, id + ' is a real-life task'); await type(111); expect(await p.textContent('#msg'), /not the code/, id + ' wrong code'); await type(CODES[id]); expect(await last(), /passed/, id + ' with the code'); };

    // ---- Arrival Dock: the sign, the locker, a number typed on its own
    expect(await say('hint'), /ship|hatch/i, 'first hint');
    expect(await say('name ship shit'), /will not stick|Kind words only/, 'rude name');
    expect(await say('open hatch'), /wrench/i, 'hatch');
    expect(await say('read sign'), /open locker/, 'the sign says what to do');
    const m = (await say('look crates')).match(/(\d+) rows\. (\d+) crates/), code = m[1] * m[2];
    expect(await say(String(code + 1)), /stays shut/, 'wrong locker code typed alone');
    expect(await say(String(code)), /magnet/i, 'locker code typed alone'); if (!(await onScreen('locker'))) bad.push(name + ': the locker is off the screen when you stand at it');
    await shot('1_locker');
    // the hidden section is dark until the switch behind the poster is found (Marc: the lights should matter)
    await say('push crate'); await say('use wrench on vent'); expect(await say('go gap'), /You crawl into the dark/, 'crawling into the dark'); await say('east');
    ok2(await p.evaluate(() => S.room === 'store' && roomDark() && !hereWords().length), name + ': in the dark Old Store nothing should be listed'); expect(await say('look'), /It is dark\. You can see only a step or two\. The lights are off/, 'look, in the dark'); expect(await say('open chest'), /It is too dark to see that\. The lights are off in here/, 'the chest in the dark'); expect(await say('hint'), /It is dark in here\. The lights are off\. A switch must be somewhere else/, 'the hint in the dark');
    ok2(await p.evaluate(() => !S.chest && !S.inv.includes('badge')), name + ': the chest must not open in the dark'); await say('go to dock');
    expect(await say('launch'), /Launch Bay/, 'launch from the dock');
    // ---- Shield Bay: 3-1 Asteroid Field, 3-2 Energy Grid, 3-3 Shield Calibration (real life)
    await say('go to shield'); await p.waitForTimeout(300);
    for (let i = 0; i < 4; i++) { const r = (await q()).match(/(\d+) rows\. (\d+) rocks/); await type(r[1] * r[2]); } expect(await last(), /1 of 3 Shield tasks/, 'asteroid field');
    await say('use magnet on grate'); expect(await say('fix robot'), /wakes/i, 'robot'); expect(await say('push poster'), /A switch! Click\. Lights hum far away/, 'the switch behind the poster');
    await say('go to dock'); expect(await say('go gap'), /The lights are on in here\. They hum/, 'the lights are on in the tunnel now'); await say('east'); ok2(await p.evaluate(() => S.room === 'store' && !roomDark() && hereWords().some(w => w[0] === 'chest')), name + ': with the lights on the chest can be seen'); expect(await say('open chest'), /badge/i, 'chest'); await say('go to dock'); await say('go to shield'); await p.waitForTimeout(300);
    expect(await say('talk robot'), /beeps: .*energy grid/i, 'the robot gives the next step'); if (await p.evaluate(() => !!widget)) bad.push(name + ': the robot opened a quiz');
    await say('use grid'); let t = await q(), g = t.match(/(\d+) sections\. Each section holds (\d+)/); await type(g[1] * g[2]); t = await q(); g = t.match(/Share the (\d+) cells equally over (\d+)/); await type(g[1] / g[2]);
    t = await q(); g = t.match(/it held (\d+) cells\. Now it holds (\d+) cells/); await shot('2_grid');
    // step 3 must ask about ONE section. A child could also think of the cells that moved (Marc typed 8), or of the whole grid (0 more). Both get kind words, and neither is marked right.
    if (!g || !/^Look at one section\./.test(t) || !/than before\?$/.test(t)) bad.push(name + ': grid step 3 does not ask about one section: "' + t + '"');
    if (!(await p.$('#toy .art svg[aria-label^="One section before: ' + g[1] + ' dots. One section now: ' + g[2] + ' dots"]'))) bad.push(name + ': grid step 3 has no before-and-now picture');
    await type(g[1]); expect(await p.textContent('#msg'), new RegExp('one section only\\. How many more is ' + g[2] + ' than ' + g[1] + '\\?'), 'grid: the cells that moved');
    { const see = await p.evaluate(() => { const m = document.getElementById('msg').getBoundingClientRect(), t = document.getElementById('toy').getBoundingClientRect(), a = document.querySelector('#toy .art').getBoundingClientRect(), y = document.getElementById('try').getBoundingClientRect(); return { msg: m.bottom <= Math.min(t.bottom, innerHeight) + 1 && m.top >= t.top - 1, pic: a.top >= t.top - 1, btn: y.bottom <= Math.min(t.bottom, innerHeight) + 1 }; });
      if (!see.msg) bad.push(name + ': grid: the words after a wrong answer are out of sight'); if (!see.pic) bad.push(name + ': grid: the picture is cut off when the words show'); if (!see.btn) bad.push(name + ': grid: the Check button is out of sight when the words show'); }
    await type(0); expect(await p.textContent('#msg'), /grid still has \d+ cells\. But one section holds more/, 'grid: 0 more');
    await type(g[2] - g[1]); expect(await last(), /2 of 3 Shield tasks/, 'energy grid');
    await slip('use mat', 'calib'); expect(await last(), /Shield part is fitted/, 'shield part after three tasks');
    // ---- Engine Bay: 1-1 Alien Artifacts, 1-2 Alien Species, 1-3 Star Map (real life)
    await say('go to engine'); await p.waitForTimeout(200); await shot('3_engine');
    expect(await say('look artifacts'), /Count each kind/, 'artifacts'); expect(await say('push valve'), /FUSES/, 'valve'); expect(await say('open toolbox'), /oil/i, 'toolbox');
    await say('open cage'); const counts = await p.evaluate(() => GEMC.map((_, c) => S.gems.filter(g => g[2] === c).length));
    if (new Set(counts).size !== 4) bad.push(name + ': artifact counts are not all different: ' + counts);
    for (let i = 0; i < 4; i++) await p.fill('#g' + i, String(i === 2 ? (counts[i] % 9) + 1 : counts[i])); await p.click('#try'); expect(await p.textContent('#msg'), /3 of 4/, 'wrong artifact count');
    await p.click('#leave'); await say('open cage'); if ((await p.inputValue('#g0')) !== String(counts[0])) bad.push(name + ': the dials forgot the numbers');
    await p.fill('#g2', String(counts[2])); await p.click('#try'); await p.waitForTimeout(150); expect(await last(), /Engine Core hums/, 'alien artifacts');
    await say('use scanner'); const kinds = await p.evaluate(() => { const svg = document.querySelector('#toy .pic svg').innerHTML; return COLS.slice(0, 4).map(c => (svg.match(new RegExp(`fill="${c}" stroke="#0e1626"`, 'g')) || []).length); });   // count the aliens as drawn
    await pic(`[data-t="b:0,${kinds[0]}"]`); await p.click('#try'); expect(await p.textContent('#msg'), /1 of 4 bars/, 'graph with one bar');
    for (let i = 1; i < 4; i++) await pic(`[data-t="b:${i},${kinds[i]}"]`); await shot('4_species'); await p.click('#try'); await p.waitForTimeout(150); expect(await last(), /saves your graph/, 'alien species');
    await slip('use easel', 'starmap'); expect(await last(), /Engine Core part is fitted/, 'engine core part');
    // ---- Weapons Bay: 4-1 Weapons Coding (drones), 4-2 Ammo Count, 4-3 Target Practice (real life)
    await say('go to weapons'); await p.waitForTimeout(200); expect(await say('open ammo'), /fuse/i, 'ammo box'); expect(await say('use oil on rusty drone'), /lifts off/, 'rusty drone');
    await say('use cannon'); await p.waitForTimeout(1500);
    for (let round = 0; round < 2; round++) {
      const ds = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return widget.d.map((d, i) => ({ n: d.n, want: (d.n % 2 === 1) === (widget.want === 'odd'), x: r.left + sx(DSLOT[i][0]) + ts / 2, y: r.top + sy(DSLOT[i][1]) + ts * .42 })); });
      if (ds.some(d => d.x < 2 || d.x > w - 2)) bad.push(name + ': a drone is off the screen');
      if (round === 0) { await shot('5_drones'); const no = ds.find(d => !d.want); await p.touchscreen.tap(no.x, no.y); await p.waitForTimeout(80); expect(await p.textContent('#msg'), /will not fire/, 'tapping a wrong drone'); }
      for (const d of ds.filter(d => d.want)) { await p.touchscreen.tap(d.x, d.y); await p.waitForTimeout(90); }
    }
    await p.waitForTimeout(150); expect(await last(), /cannon light turns green/, 'weapons coding');
    await say('use racks'); const racks = await p.evaluate(() => { const svg = $('pic').innerHTML; return RACKC.map(c => (svg.match(new RegExp(`fill="${c[1]}"`, 'g')) || []).length); });   // count the counters as drawn
    await p.click('#try'); expect(await p.textContent('#msg'), /That is odd/, 'racks left odd');
    for (let i = 0; i < 5; i++) if (racks[i] % 2) await pic(`[data-r="${i}"]`); await shot('6_racks'); await p.click('#try'); await p.waitForTimeout(150); expect(await last(), /Every rack is even/, 'ammo count');
    await slip('use wall', 'target'); expect(await last(), /Weapons part is fitted/, 'weapons part');
    // ---- Navigation Bay: 2-1 Fuel Calculation, 2-2 Coordinate Plotting, 2-3 Cargo Load
    await say('go to navigation'); expect(await say('go to power'), /cargo pile/, 'power bay before the cargo');
    await say('use card on drawer'); await say('push chair'); await say('take bolt');
    await say('use gauge'); let fuel = null; for (let i = 0; i < 3; i++) { const f = (await q()).match(/have (\d+) units of fuel\. The leg to stop \w uses (\d+)/); if (fuel !== null && +f[1] !== fuel) bad.push(name + ': the fuel did not carry forward'); fuel = f[1] - f[2]; if (i === 1) await shot('7_fuel'); await type(fuel); }
    expect(await last(), /fuel to spare/, 'fuel calculation');
    await say('use map'); for (let i = 0; i < 3; i++) { const c = (await q()).match(/along (\d+) \+ (\d+)\. Then go up (\d+) − (\d+)/), x = +c[1] + +c[2], y = c[3] - c[4];
      if (i === 0) { await pic(`[data-t="c:${y},${x}"]`); await p.click('#try'); expect(await p.textContent('#msg'), /nothing here/, 'a wrong hop'); }
      await pic(`[data-t="c:${x},${y}"]`); if (i === 2) await shot('8_hop'); await p.click('#try'); await p.waitForTimeout(150); }
    expect(await last(), /key part/, 'coordinate plotting');
    await say('use scale'); for (const i of [1, 3, 2, 4, 0, 9, 6]) await p.evaluate(i => cargoToggle(i), i); await p.click('#try'); await p.waitForTimeout(200); expect(await last(), /Navigation part is fitted.*Launch Bay door/, 'cargo and the navigation part');
    // ---- Power Bay: 5-1 Circuit Connection, 5-2 Power Allocation (real life), 5-3 Emergency Power
    expect(await say('go to power'), /Power Bay/, 'power bay after the cargo'); await p.waitForTimeout(200);
    expect(await say('use fuse on fusebox'), /lights come on/, 'fuse box'); expect(await say('open plate'), /star chip/, 'loose plate');
    expect(await say('launch'), /Launch Bay/, 'launch from the wrong room'); expect(await say('hint'), /circuit board/, 'hint for the next task');
    await say('use board');
    for (let round = 0; round < 2; round++) { const n = +(await q()).match(/shows (\d+)/)[1], want = [`${Math.floor(n / 100)} hundred`, `${Math.floor(n / 10) % 10} ten`, `${n % 10} one`];
      if (round === 0) { await p.click('#toy .wire >> nth=0'); await p.click('#try'); expect(await p.textContent('#msg'), /Connect 3/, 'one wire only'); await p.click('#toy .wire >> nth=0'); }
      for (const t of want) await p.locator('#toy .wire', { hasText: new RegExp('^' + t + 's?$') }).click(); await p.click('#try'); await p.waitForTimeout(150); }
    expect(await last(), /1 of 3 Power tasks/, 'circuit connection');
    await slip('use bench', 'alloc');
    await say('use cells'); for (let i = 0; i < 3; i++) { const n = await p.evaluate(() => { const svg = document.querySelector('#toy .art svg').innerHTML, c = re => (svg.match(re) || []).length; return c(/width="40" height="40"/g) * 100 + c(/width="5" height="40"/g) * 10 + c(/width="6" height="6"/g); });   // read the blocks as drawn
      if (i === 1) { await shot('9_blocks'); if (Math.floor(n / 10) % 10 !== 0) bad.push(name + ': the second reading should have no tens'); } await type(n); }
    expect(await last(), /Power part is fitted.*all five parts/, 'emergency power and the whole ship');
    // ---- launch: needs a course
    await say('go to launch'); expect(await say('launch'), /No course/, 'launch without a course'); await say('use chart on console'); expect(await say('launch'), /Lift off/, 'launch'); await p.waitForTimeout(300);
    const st = await p.evaluate(() => ({ parts: S.parts.length, tasks: tasksDone(), cards: S.cards.length, secrets: S.secrets.length, mode: S.mode, rooms: S.seen.length, side: document.documentElement.scrollWidth > innerWidth + 1, box: $('partsbox').innerText.includes('5 of 5 parts') }));
    if (st.parts !== 5 || st.tasks !== 15 || st.cards < 15 || st.secrets !== 18 || st.mode !== 'space' || st.rooms !== 9 || st.side || !st.box) bad.push(name + ': end state ' + JSON.stringify(st));
    console.log(`${name}: ${st.tasks} of 15 tasks, ${st.parts} of 5 parts, ${st.cards} cards (15 from tasks, ${st.cards - 15} from secrets), ${st.secrets} of 18 station secrets, launched: ${st.mode === 'space'}`);
    await ctx.close();
  }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none');
  console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL');
  await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0]); process.exit(1); });
