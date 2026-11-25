// The Actions button (version 99).   [Source: Marc, 2026-11-25: "Maybe just like an action button that opens up the menu. I could expand and they could choose?
//   ... they don't need to see or look at the menu of places to visit?" Measured before: the panel took 31% of the width on an iPad held sideways.]
//   [Proposal] Played as a child, at iPad sideways (two iPads), iPad upright and phone size:
//   - the game opens with the doing words, the directions and the places folded away; the typing box, the bag and "More" stay
//   - the picture is as wide as before (version 98: 63% of the width on an iPad held sideways). A narrower side panel was tried and
//     given back: the small keyboard's letter keys fell to 25 pixels, and the station's locker table no longer fit the desk.
//   - "Actions" opens the rows, and a second tap folds them; the button is at least 44 pixels tall
//   - tapping the typing box opens the rows by itself
//   - a word in the opened rows still works (it walks, or it does)
//   - tapping the picture still works with the rows folded
//   - the Teacher switch keeps the rows open, and is remembered on the iPad; the Actions button then hides
//   - no row is cut off, and the page does not scroll sideways
//   - while folded, the first tip and help name the Actions button; arriving in Metrica opens the rows (its planets are landed on by name)
// Run: node checks/words_fold_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h] of [['ipad', 1180, 745], ['ipad-10', 1080, 810], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(400);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    const shown = id => p.evaluate(id => { const e = $(id); return !!e && getComputedStyle(e).display !== 'none' && !e.hidden; }, id);
    const shot = async n => { if (out) { await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, `words_${name}_${n}.png`) }); } };
    try {
      await p.evaluate(() => { skipIntro(); }); await p.waitForTimeout(400);
      ok(!(await shown('verbs')) && !(await shown('dirs')) && !(await shown('nouns')), 'the rows are folded when the game opens');
      ok(await shown('cmd') && await shown('bag') && await shown('menu') && await shown('wbtn'), 'the typing box, the bag, More and the Actions button are in view');
      { const r = await p.evaluate(() => ({ pic: $('cv').getBoundingClientRect().width / innerWidth, btn: $('wbtn').getBoundingClientRect().height, side: document.documentElement.scrollWidth > innerWidth + 1 }));
        if (w > h && w >= 900) ok(r.pic >= .62, `the picture is no narrower than in version 98 (63% of the width; it is ${Math.round(r.pic * 100)}%)`); ok(r.btn >= 44, `the Actions button is at least 44 pixels tall (${Math.round(r.btn)})`); ok(!r.side, 'no sideways scroll'); }
      await shot('1_folded');
      await p.click('#wbtn'); await p.waitForTimeout(200); ok(await shown('verbs') && await shown('dirs') && await shown('nouns'), '"Actions" opens the rows'); ok(/▴/.test(await p.textContent('#wbtn')), 'the button shows it is open'); await p.waitForTimeout(500);
      ok(await p.evaluate(() => { const r = $('verbs').getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight - 40; }), 'the opened rows are in view (on a phone the page scrolls to them)'); await shot('2_open');
      { const before = await p.evaluate(() => [P.x, P.y]); await p.locator('#dirs button', { hasText: /east/i }).first().click(); await p.waitForTimeout(1200); ok(await p.evaluate(b => P.x !== b[0] || P.y !== b[1] || P.route.length > 0, before), 'a direction word still walks'); }
      await p.click('#wbtn'); await p.waitForTimeout(200); ok(!(await shown('verbs')), 'a second tap folds them');
      await p.click('#cmd'); await p.waitForTimeout(200); ok(await shown('verbs') && await shown('nouns'), 'tapping the typing box opens the rows');
      await p.evaluate(() => { document.activeElement.blur(); wordsSet(false); }); await p.waitForTimeout(150);
      { const before = await p.evaluate(() => [P.x, P.y, lines.length]); const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + (S.x - cam.x + .5) * ts, r.top + (S.y - cam.y + 2.5) * ts]; }); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(1200);
        ok(await p.evaluate(b => P.x !== b[0] || P.y !== b[1] || P.route.length > 0 || lines.length > b[2], before), 'tapping the picture still works with the rows folded (it walks, or it looks)'); }
      await p.evaluate(() => { $('wordsOn').checked = true; $('wordsOn').onchange(); }); await p.waitForTimeout(150); ok(await shown('verbs') && !(await shown('wbtn')), 'the Teacher switch keeps the rows open, and hides the button');
      await p.reload(); await p.waitForTimeout(600); ok(await shown('verbs'), 'the Teacher switch is remembered on the iPad');
      await p.evaluate(() => { $('wordsOn').checked = false; $('wordsOn').onchange(); }); await p.waitForTimeout(150); ok(!(await shown('verbs')) && await shown('wbtn'), 'switched off, the rows fold again');
      // the words that point at a button say where it is, while the rows are folded
      await p.evaluate(() => { S.tut = 1; drawLog(); }); ok(/Tip: tap Actions\. Then tap LOOK/.test(await p.textContent('#log')), 'the LOOK tip names Actions while the rows are folded');
      await p.click('#wbtn'); await p.waitForTimeout(150); ok(/Tip: tap LOOK, then tap your ship/.test(await p.textContent('#log')), 'with the rows open, the tip is as before'); await p.click('#wbtn'); await p.waitForTimeout(150);
      { const h = await p.evaluate(() => { let t = ''; actPlanet('help', x => { t = x; }); return t; }); ok(/Or tap Actions, then Hint\./.test(h), 'Voltara\'s help names Actions: ' + h); }
      // Metrica's planets are landed on by name: the rows open by themselves when the ship arrives
      await p.evaluate(() => { S.tut = 3; goSpace(); wordsSet(false); }); await p.waitForTimeout(200); await p.fill('#cmd', 'fly to metrica'); await p.press('#cmd', 'Enter'); await p.evaluate(() => { document.activeElement.blur(); wordsSet(false); });
      for (let i = 0; i < 100; i++) { if (await p.evaluate(() => S.at === 'metrica' && !SP.to)) break; await p.waitForTimeout(100); }
      ok(await shown('nouns') && /land on Chronosia/.test(await p.textContent('#nouns')), 'arriving in Metrica opens the rows, with the planet names'); ok(/Tap a planet's name to land\./.test(await p.evaluate(() => lines[lines.length - 1].text)), 'the arrival line says to tap a planet\'s name'); await shot('3_metrica');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The Actions button: every check passed, on four screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
