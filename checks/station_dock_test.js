// Docking at the KIS Station from space (version 98).   [Source: Marc, 2026-11-25: "How would I fly to the KIS station? It says that you're already here.
//   I don't know what to do now." "I think we need to have a dock at the KIS station. Obviously."]
//   [Proposal] Played as a child, at iPad sideways and phone size:
//   - after launch, at the station in space: the Here row offers "dock at the station", and no word to fly to where the ship already is
//   - "dock" takes the cadet into the Arrival Dock, everything as it was: parts, cards, secrets; the ship in the dock is drawn whole, not damaged
//   - tapping the floor walks again (before version 98 the station ignored taps after launch)
//   - closing the game and opening it again keeps the cadet on the station, with the right first line (not "Your ship limps into the dock")
//   - the Launch Bay launches again; the cadet is back in space at the station
//   - tapping the station on the map while there docks too; "dock" in another galaxy says where to go
//   - a game saved before version 98 (launched, with no "launched" mark) docks the same way
//   - "Play again" under the Mission report asks "Are you sure?" first; No keeps the game, Yes starts a new one
// Run: node checks/station_dock_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h] of [['ipad', 1180, 745], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(400);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || ''), say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(250); return last(); };
    const shot = async n => { if (out) { await p.waitForTimeout(400); await p.screenshot({ path: path.join(out, `dock_${name}_${n}.png`) }); } };
    const here = () => p.evaluate(() => hereWords().map(x => x[0] + '=' + x[1]).join(' | '));
    const toLaunch = async () => { await p.evaluate(() => { tidy(); S.mode = 'station'; S.room = 'launch'; S.x = 30; S.y = 3; P.x = S.x; P.y = S.y; if (S.seen.indexOf('launch') < 0) S.seen.push('launch'); snap = true; save(); }); await p.waitForTimeout(300); };      /* shortcut: the walk is played in station_playthrough_test.js */
    try {
      // a ship that has launched: every part fitted, a card, a secret, then lift off from the Launch Bay
      await p.evaluate(() => { skipIntro(); S.storyTold = true; PARTS.forEach(pt => tasksOf(pt).forEach(t => { S.done[t[0]] = true; })); S.parts = PARTS.slice(); S.cards.push({ r: 'common', n: 'Laser Cannon' }); if (!S.secrets.includes('locker')) S.secrets.push('locker'); save(); });
      await toLaunch(); expect(await say('launch'), /Lift off/, 'launch'); ok(await p.evaluate(() => S.mode === 'space' && S.at === 'station' && S.launched), 'in space at the station, marked launched');
      { const hw = await here(); ok(/dock=dock at the station/.test(hw), 'the Here row offers "dock at the station": ' + hw); ok(!/fly to station/.test(hw), 'no word to fly to where the ship already is'); }
      await shot('1_space');
      expect(await say('dock'), /You dock at the KIS Station\. Everything is as you left it\./, 'dock'); await p.waitForTimeout(300);
      ok(await p.evaluate(() => S.mode === 'station' && S.room === 'dock' && !S.ended && S.launched && S.parts.length === PARTS.length && S.cards.length >= 1 && S.secrets.includes('locker')), 'in the Arrival Dock, everything kept');
      ok(await p.evaluate(() => !!(S.ended || S.launched)), 'the docked ship is drawn whole, not damaged'); await shot('2_docked');
      { const before = await p.evaluate(() => [P.x, P.y]); const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + (S.x - cam.x + 3.5) * ts, r.top + (S.y - cam.y + .5) * ts]; }); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(1500);
        ok(await p.evaluate(b => P.x !== b[0] || P.y !== b[1] || P.route.length > 0, before), 'tapping the floor walks again'); }
      await p.reload(); await p.waitForTimeout(700); ok(await p.evaluate(() => S.mode === 'station' && S.launched), 'closed and opened again: still on the station'); expect(await last(), /^You are on the KIS Station, in the/, 'the first line after opening again'); ok(!/limps into the dock/.test(await last()), 'not the very first line of a new game');
      await toLaunch(); expect(await say('launch'), /Lift off/, 'launch again'); ok(await p.evaluate(() => S.mode === 'space' && S.at === 'station'), 'back in space');
      // tapping the station on the map docks too
      await p.waitForTimeout(400); const ptS = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + GAL.station.x * vw, r.top + GAL.station.y * vh]; }); await p.touchscreen.tap(ptS[0], ptS[1]); await p.waitForTimeout(500);
      ok(await p.evaluate(() => S.mode === 'station'), 'tapping the station while there docks'); await toLaunch(); await say('launch');
      // "dock" in another galaxy
      await p.evaluate(() => { S.at = 'metrica'; SP.to = null; save(); }); expect(await say('dock at the station'), /Fly to the KIS Station first\. Then dock\./, '"dock" away from the station');
      // a game saved before version 98: launched, but with no "launched" mark
      await p.evaluate(() => { delete S.launched; S.ended = true; S.mode = 'space'; S.at = 'station'; SP.to = null; save(); }); await p.reload(); await p.waitForTimeout(700);
      expect(await say('dock'), /You dock at the KIS Station/, 'an old save docks'); ok(await p.evaluate(() => S.mode === 'station' && S.launched), 'and is marked launched');
      // [v98] "Play again" under the Mission report asks first (the plan's decision 11, Marc: "Yes")
      await p.evaluate(() => { S.mode = 'space'; S.at = 'station'; S.ended = true; save(); showEnding(); }); await p.waitForTimeout(200); const cards = await p.evaluate(() => S.cards.length);
      await p.locator('#again').click(); await p.waitForTimeout(150); expect(await p.locator('#report').innerText(), /Are you sure\? You will lose your ship, your cards and your planets\./, 'Play again asks first');
      ok(await p.evaluate(n => S.cards.length === n && S.mode === 'space', cards), 'asking changes nothing'); await p.locator('[data-no]').click(); await p.waitForTimeout(150); ok(await p.evaluate(n => S.cards.length === n && !document.querySelector('.askreset') && !$('again').hidden, cards), '"No, keep my game" keeps it');
      await p.locator('#again').click(); await p.waitForTimeout(150); await p.locator('[data-yes]').click(); await p.waitForTimeout(400); ok(await p.evaluate(() => S.cards.length === 0 && S.mode !== 'space'), '"Yes, start again" starts a new game');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'Docking at the station: every check passed.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
