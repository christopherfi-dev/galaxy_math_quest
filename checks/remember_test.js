// The game remembers what you were doing.  [Source: Marc, 2026-11-17: a child at the vent types "use wrench" and is asked "on what?"]
//   - after looking at a thing, a command with no thing in it is taken to mean that thing ("open", "push it", "use wrench")
//   - with nothing in mind, the one thing you stand next to is used
//   - when neither is clear, the game asks, fills in the start of the command, and one tap on a word finishes it
//   - a thing that is not there is never guessed at; a different room forgets
//   - if you walk off by your own choice, the old thing is let go: what you stand beside now counts, or the game asks
//   - the same on Voltara ("give fruit" beside the fish) and on a small world
// Run: node checks/remember_test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true }), p = await ctx.newPage(); p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-words', 'open'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const last = () => p.evaluate(() => lines[lines.length - 1].text || ''), echo = () => p.evaluate(() => { const y = lines.filter(l => l.you); return y.length ? y[y.length - 1].you : ''; });
    const idle = async () => { for (let i = 0; i < 150; i++) { if (await p.evaluate(() => PL.to == null && !PL.then && !(S.mode === 'station' && ((P.route && P.route.length) || P.then)))) return; await p.waitForTimeout(100); } bad.push(name + ': still walking'); };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return last(); };
    const expect = (got, re, what) => { if (!re.test(got)) bad.push(`${name}: ${what}: got "${got}"`); }, not = (got, re, what) => { if (re.test(got)) bad.push(`${name}: ${what}: got "${got}"`); };
    // ---- the station
    await p.evaluate(() => { skipIntro(); S.tut = 3; S.battleSeen = true; }); await p.waitForTimeout(300);      // battleSeen: so that walking about does not set off the asteroid alarm in this test
    const lookShip = await say('look ship'), openShip = await say('open ship'); await p.evaluate(() => { FOCUS = null; }); await say('look ship');
    const r1 = await say('open'); not(r1, /what\?/i, 'after looking at the ship, "open" should mean the ship'); const e1 = await echo(); if (e1 && e1 !== 'open ship') bad.push(name + ': the echo should show what the game took you to mean: ' + e1); const r1b = await say('open ship'); if (r1 !== r1b) bad.push(name + `: "open" gave "${r1}" but "open ship" gives "${r1b}"`);
    const pushed = await say('look crate'); const r2 = await say('push it'); not(r2, /what\?|do not see/i, '"push it" after looking at the crate');
    await p.evaluate(() => { if (!S.inv.includes('wrench')) give('wrench'); }); await say('look ship'); const r3 = await say('use wrench'); not(r3, /on what/i, '"use wrench" after looking at the ship'); expect(await echo(), /^use wrench on ship$/, 'the echo of "use wrench"');
    const r3b = await say('use wrench on it'); not(r3b, /on what|do not see/i, '"use wrench on it"');
    // nothing in mind and nothing beside you: the game asks, and a tap finishes it
    await p.evaluate(() => { FOCUS = null; P.x = 10; P.y = 9; S.x = 10; S.y = 9; }); await p.waitForTimeout(100); const lone = await p.evaluate(() => nearObj());
    if (!lone) { expect(await say('use wrench'), /Use the wrench on what\? Tap a thing\./, 'with nothing in mind the game asks'); if ((await p.inputValue('#cmd')) !== 'use wrench on ') bad.push(name + ': the command should be started for you: "' + await p.inputValue('#cmd') + '"');
      await p.locator('#nouns .noun', { hasText: /^ship$/ }).first().tap(); await p.waitForTimeout(200); await idle(); await p.waitForTimeout(150); not(await last(), /on what/i, 'one tap on a word finishes "use wrench on"'); expect(await echo(), /^use wrench on ship$/, 'the finished command');
      await p.evaluate(() => { FOCUS = null; P.x = 10; P.y = 9; }); expect(await say('open'), /Open what\? Tap a thing\./, '"open" with nothing in mind'); if ((await p.inputValue('#cmd')) !== 'open ') bad.push(name + ': "open " should be started for you'); await p.fill('#cmd', ''); }
    await say('look ship'); expect(await say('use wrench on unicorn'), /do not see that here/, 'a thing that is not there is never guessed at');
    // walk off by your own choice: the ship is let go
    await say('look ship'); await say('go south'); await say('go west'); if ((await p.evaluate(() => S.room)) !== 'dock') { await p.evaluate(() => { S.room = 'dock'; P.x = S.x = 12; P.y = S.y = 13; P.route = []; FOCUS = { k: 'station:dock', id: 'ship', moved: true }; }); } const beside = await p.evaluate(() => nearObj()), r5 = await say('open'), e5 = await echo(); if (beside !== 'ship' && e5 === 'open ship') bad.push(name + ': after walking away, "open" still meant the ship');
    if (!beside) expect(r5, /Open what\? Tap a thing\./, 'after walking away to nothing, the game asks'); else expect(e5, new RegExp('^open ' + await p.evaluate(b => OBJ[b].words[0], beside) + '$'), 'after walking away, "open" means the thing you stand beside'); await p.fill('#cmd', '');
    // a real tap on the floor lets it go too
    await say('look ship'); const moved0 = await p.evaluate(() => !!FOCUS.moved); const cvb = await p.locator('#cv').boundingBox(); await p.evaluate(() => window.scrollTo(0, 0)); const fl = await p.evaluate(() => { for (let y = 11; y < 15; y++) for (let x = 9; x < 24; x++) if (x > cam.x + 1 && x < cam.x + cv.clientWidth / ts - 1 && y > cam.y + 1 && y < cam.y + cv.clientHeight / ts - 1 && walkable(x, y) && !thingAt(x, y) && Math.hypot(x - P.x, y - P.y) > 2) return [(x + .5 - cam.x) * ts, (y + .5 - cam.y) * ts]; return null; });
    if (fl) { const bb = await p.locator('#cv').boundingBox(); await p.touchscreen.tap(bb.x + fl[0], bb.y + fl[1]); await p.waitForTimeout(200); await idle(); if (moved0 || !(await p.evaluate(() => FOCUS && FOCUS.moved))) bad.push(name + ': a tap on the floor should let the thing in mind go'); }
    await say('look crate'); if (await p.evaluate(() => FOCUS.moved)) bad.push(name + ': a walk that a command makes should not let the thing go'); not(await say('push'), /what\?/i, 'after "look crate" walks you there, "push" still means the crate');
    await say('look ship'); await p.evaluate(() => { S.room = 'shield'; }); expect(await say('open'), /what\? Tap a thing|Open/i, 'another room'); if ((await echo()) === 'open ship') bad.push(name + ': the ship was remembered in another room'); await p.evaluate(() => { S.room = 'dock'; });
    // ---- Voltara: "give fruit" beside the fish
    await p.evaluate(() => menuOpen('teacher')); await p.waitForTimeout(120); await p.locator('#t_volt').tap(); await p.waitForTimeout(800); await say('take fruit'); await say('go east'); await say('talk fish'); expect(await say('give fruit'), /stones rise/, 'Voltara: "give fruit" after talking to the fish');
    await p.evaluate(() => { FOCUS = null; PL.x = VT.gumble.x; }); not(await say("talk"), /what\?/i, 'Voltara: "talk" beside the fish means the fish'); if (await p.evaluate(() => !!widget)) await p.click('#leave');
    await p.evaluate(() => { FOCUS = null; const xs = vThings().filter(t => t.x != null).map(t => t.x).sort((a, b) => a - b); let best = .5, gap = 0; for (let i = 1; i < xs.length; i++) if (xs[i] - xs[i - 1] > gap) { gap = xs[i] - xs[i - 1]; best = (xs[i] + xs[i - 1]) / 2; } PL.x = best; window.__gap = gap; });
    if (await p.evaluate(() => window.__gap > .24)) { expect(await say('take'), /Take what\? Tap a thing\./, 'Voltara: "take" with nothing near asks'); await p.fill('#cmd', ''); }
    // ---- a small world
    await p.evaluate(() => { landWorld('C'); }); await p.waitForTimeout(400); await say('look post'); expect(await say('touch'), /trade post of/, 'a small world: "touch" after looking at the post'); expect(await say('look it'), /trade post of/, 'a small world: "look it"');
    await say('look post'); await say('go east'); await say('touch'); if (await p.evaluate(() => FOCUS && FOCUS.id === 'post' && Math.abs(PL.x - .25) > .1)) bad.push(name + ': a small world: after walking east, "touch" still meant the post');
    await p.evaluate(() => { FOCUS = null; PL.x = wThings(wKit('C'))[4].x - .03; }); const lab = await p.evaluate(() => wThings(wKit('C'))[4].label); await say('touch'); expect(await p.evaluate(() => FOCUS && wThings(wKit('C')).find(t => t.id === FOCUS.id).label), new RegExp('^' + lab + '$'), 'a small world: "touch" means the thing you stand beside');
    console.log(`${name}: the game remembers`); await ctx.close();
  }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0], '| at', (String(e.stack).match(/remember_test.js:\d+:\d+/) || [''])[0]); process.exit(1); });
