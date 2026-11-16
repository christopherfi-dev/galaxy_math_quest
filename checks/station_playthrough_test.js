// Plays the whole KIS Station in prototypes/kis_station_sketch.html, on an iPad and on a phone.   [Proposal]
//
// It types the short commands a student would type, and taps the drones on the canvas with real taps.
// It earns all five ship parts, finds all 18 station secrets, and launches.
// Along the way it checks the things a stuck child needs:
//   - a number typed on its own opens the locker
//   - on a phone the camera follows, so the locker and every other thing can be seen
//   - the Hint always names a next step
//   - the ship will not launch with parts missing
//   - a rude ship name is refused
//
// Run:  node checks/station_playthrough_test.js [folder for screenshots]
// Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), errs = [], bad = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); }); await p.waitForTimeout(700);
    const idle = async () => { for (let i = 0; i < 120; i++) { if (await p.evaluate(() => P.route.length === 0 && !P.then)) return; await p.waitForTimeout(100); } bad.push(name + ': still walking'); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(120); await idle(); await p.waitForTimeout(80); return last(); };
    const expect = (got, re, what) => { if (!re.test(got)) bad.push(`${name}: ${what}: got "${got}"`); };
    const shot = async n => { if (out) await p.screenshot({ path: path.join(out, `st_${name}_${n}.png`) }); };
    const onScreen = id => p.evaluate(id => { const t = objTiles(id)[0], X = sx(t[0]) + ts / 2, Y = sy(t[1]) + ts / 2; return X > 4 && X < vw - 4 && Y > 4 && Y < vh - 4; }, id);
    const numberTask = async (re, f, n) => { for (let i = 0; i < n; i++) { const m = (await p.textContent('#toy .q')).match(re); await p.fill('#ans', String(f(m))); await p.click('#try'); await p.waitForTimeout(120); } };

    // the dock: the sign, the locker, a number typed on its own
    expect(await say('hint'), /ship|hatch/i, 'first hint');
    expect(await say('name ship shit'), /will not stick/, 'rude name');
    expect(await say('open hatch'), /wrench/i, 'hatch');
    expect(await say('read sign'), /open locker/, 'the sign says what to do');
    const m = (await say('look crates')).match(/(\d+) rows\. (\d+) crates/), code = m[1] * m[2];
    expect(await say(String(code + 1)), /stays shut/, 'wrong locker code typed alone');
    expect(await say(String(code)), /magnet/i, 'locker code typed alone'); if (!(await onScreen('locker'))) bad.push(name + ': the locker is off the screen when you stand at it');
    await shot('1_locker');
    await say('push crate'); await say('use wrench on vent'); await say('go gap'); await say('east'); expect(await say('open chest'), /badge/i, 'chest'); await say('go to dock');
    expect(await say('launch'), /Launch Bay/, 'launch from the dock');
    // Shield Bay: the battle starts as you walk in
    await say('go to shield'); await p.waitForTimeout(300); await numberTask(/(\d+) rows\. (\d+) rocks/, m => m[1] * m[2], 4); expect(await last(), /Shield part/, 'battle');
    await say('use magnet on grate'); expect(await say('fix robot'), /wakes/i, 'robot'); await say('push poster');
    // Engine Bay: count what you find
    await say('go to engine'); await p.waitForTimeout(200); await shot('2_engine');
    expect(await say('look artifacts'), /Count each kind/, 'artifacts'); expect(await say('push valve'), /FUSES/, 'valve'); expect(await say('open toolbox'), /oil/i, 'toolbox');
    await say('open cage'); const counts = await p.evaluate(() => GEMC.map((_, c) => S.gems.filter(g => g[2] === c).length));
    if (new Set(counts).size !== 4) bad.push(name + ': artifact counts are not all different: ' + counts);
    for (let i = 0; i < 4; i++) await p.fill('#g' + i, String(i === 2 ? (counts[i] % 9) + 1 : counts[i])); await p.click('#try'); expect(await p.textContent('#msg'), /3 of 4/, 'wrong artifact count');
    await p.click('#leave'); await say('open cage'); if ((await p.inputValue('#g0')) !== String(counts[0])) bad.push(name + ': the dials forgot the numbers');
    await p.fill('#g2', String(counts[2])); await shot('3_core_lock'); await p.click('#try'); await p.waitForTimeout(150); expect(await last(), /Engine Core part/, 'engine core');
    // Weapons Bay: odd and even, by tapping drones on the canvas
    await say('go to weapons'); await p.waitForTimeout(200); expect(await say('open ammo'), /fuse/i, 'ammo box'); expect(await say('use oil on rusty drone'), /lifts off/, 'rusty drone');
    await say('use cannon'); await p.waitForTimeout(1500);
    for (let round = 0; round < 2; round++) {
      const ds = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return widget.d.map((d, i) => ({ n: d.n, want: (d.n % 2 === 1) === (widget.want === 'odd'), x: r.left + sx(DSLOT[i][0]) + ts / 2, y: r.top + sy(DSLOT[i][1]) + ts * .42 })); });
      if (ds.some(d => d.x < 2 || d.x > w - 2)) bad.push(name + ': a drone is off the screen');
      if (round === 0) { await shot('4_drones'); const no = ds.find(d => !d.want); await p.touchscreen.tap(no.x, no.y); await p.waitForTimeout(80); expect(await p.textContent('#msg'), /will not fire/, 'tapping a wrong drone'); }
      for (const d of ds.filter(d => d.want)) { await p.touchscreen.tap(d.x, d.y); await p.waitForTimeout(90); }
    }
    await p.waitForTimeout(150); expect(await last(), /Weapons part/, 'target practice');
    // Navigation Bay: the cargo, and the door behind it
    await say('go to navigation'); expect(await say('go to power'), /cargo pile/, 'power bay before the cargo');
    await say('use card on drawer'); await say('push chair'); await say('take bolt');
    await say('use scale'); for (const i of [1, 3, 2, 4, 0, 9, 6]) await p.evaluate(i => cargoToggle(i), i); await p.click('#try'); await p.waitForTimeout(200); expect(await last(), /Navigation part/, 'cargo');
    // Power Bay: place value, and the lights
    expect(await say('go to power'), /Power Bay/, 'power bay after the cargo'); await p.waitForTimeout(200); await shot('5_power_dark');
    expect(await say('use fuse on fusebox'), /lights come on/, 'fuse box'); expect(await say('open plate'), /star chip/, 'loose plate');
    expect(await say('hint'), /circuit board/, 'hint for the last part');
    await say('use board');
    for (let round = 0; round < 2; round++) { const n = await p.evaluate(() => widget.n), want = [`${Math.floor(n / 100)} hundred`, `${Math.floor(n / 10) % 10} ten`, `${n % 10} one`];
      if (round === 0) { await p.click('#toy .wire >> nth=0'); await p.click('#try'); expect(await p.textContent('#msg'), /Connect 3/, 'one wire only'); await p.click('#toy .wire >> nth=0'); }
      for (const t of want) await p.locator('#toy .wire', { hasText: new RegExp('^' + t + 's?$') }).click(); if (round === 0) await shot('6_board'); await p.click('#try'); await p.waitForTimeout(150); }
    expect(await last(), /Power part.*all five parts/, 'circuit board and the whole ship');
    // launch: needs a course
    await say('go to launch'); expect(await say('launch'), /No course/, 'launch without a course'); await say('use chart on console'); expect(await say('launch'), /Lift off/, 'launch'); await p.waitForTimeout(300); await shot('7_space');
    const st = await p.evaluate(() => ({ parts: S.parts.length, secrets: S.secrets.length, mode: S.mode, rooms: S.seen.length, side: document.documentElement.scrollWidth > innerWidth + 1 }));
    if (st.parts !== 5 || st.secrets !== 18 || st.mode !== 'space' || st.rooms !== 9 || st.side) bad.push(name + ': end state ' + JSON.stringify(st));
    console.log(`${name}: ${st.parts} of 5 parts, ${st.secrets} of 18 station secrets, ${st.rooms} rooms seen, launched: ${st.mode === 'space'}`);
    await ctx.close();
  }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none');
  console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL');
  await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0]); process.exit(1); });
