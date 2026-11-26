// The words beside the picture (version 101), a Teacher try-out.   [Source: Marc, 2026-11-26: "I agree with your things": option B of
//   proposals/GMQ_Picture_Size_v1_2026-11-26.md, behind a Teacher switch first]
//   [Proposal] Played as a child, on an iPad held sideways (two sizes), held upright, and a phone:
//   - switch off (the start): the words under the picture, as before; nothing moves
//   - switch on, held sideways: the words sit in the side panel, under the word rows and the bag (folded rows: just under the typing box); the picture is taller; the room is never smaller
//     (measured: the Arrival Dock grows 8% at 1180 x 745; at 1080 x 810 it does not grow, because the picture's width limits it there)
//   - "look ship": the answer shows in the side panel, in view
//   - a task opens: the desk takes the whole panel, as before; the words come back when it closes; My ship open: the words step aside
//   - held upright and on a phone: nothing changes, even with the switch on; turning the iPad sideways again moves the words back beside the picture
//   - the switch is remembered on the iPad
// Run: node checks/words_side_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h] of [['ipad', 1180, 745], ['ipad-10', 1080, 810], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { window.GMQ_NO_CARDPOP = true; try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(400);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    const shot = async n => { if (out) { await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, `wside_${name}_${n}.png`) }); } };
    const where = () => p.evaluate(() => { const lg = $('log').parentNode, r = lg.getBoundingClientRect(), c = cv.getBoundingClientRect(); return { side: lg.parentNode.id === 'side', top: Math.round(r.top), bottom: Math.round(r.bottom), shown: getComputedStyle(lg).display !== 'none' && r.height > 0, picH: Math.round(c.height), picW: Math.round(c.width), ts, wide: document.body.classList.contains('sidecol'), cls: document.body.classList.contains('wside') }; });
    const sw = async on => { await p.evaluate(on => { $('wsideOn').checked = on; $('wsideOn').onchange(); }, on); await p.waitForTimeout(400); };
    try {
      await p.evaluate(() => { skipIntro(); }); await p.waitForTimeout(400);
      const off = await where(); ok(!off.side && off.shown && !off.cls, 'switch off: the words are under the picture, as before'); ok(!(await p.evaluate(() => $('wsideOn').checked)), 'the switch starts off'); await shot('1_off');
      await sw(true); const on = await where(); await p.evaluate(() => act('look ship')); await p.waitForTimeout(900);
      if (off.wide) {
        ok(on.side && on.cls && on.shown, 'switch on: the words are in the side panel'); ok(on.picH > off.picH + 60, `the picture is taller (${off.picH} to ${on.picH})`); ok(on.ts >= off.ts, `the room is never drawn smaller (${off.ts.toFixed(1)} to ${on.ts.toFixed(1)})`); console.log(`${name}: picture ${off.picW}x${off.picH} -> ${on.picW}x${on.picH}; Arrival Dock tile ${off.ts.toFixed(1)} -> ${on.ts.toFixed(1)} (x${(on.ts / off.ts).toFixed(2)})`);
        ok(await p.evaluate(() => { const r = document.querySelector('#side > .log').getBoundingClientRect(), c = $('bag').getBoundingClientRect(); return r.top >= c.bottom - 2 && r.bottom <= innerHeight; }), 'the words sit under the word rows and the bag, in view');
        ok(/Scrap metal holds the hull together/.test(await p.evaluate(() => document.querySelector('#side > .log').innerText)), 'the answer to "look ship" shows beside the picture'); await shot('2_on_look');
        // a task: the Shield Bay's calibration (or whichever first task the game opens by "open" in the dock: the locker)
        await p.evaluate(() => { startLocker(); }); await p.waitForTimeout(600);
        ok(await p.evaluate(() => { const lg = document.querySelector('#side > .log'); return getComputedStyle(lg).display === 'none' && $('try') && $('try').getBoundingClientRect().bottom <= innerHeight; }), 'during a task the desk takes the whole panel, as before'); await shot('3_task');
        await p.evaluate(() => closeToy()); await p.waitForTimeout(300); ok(await p.evaluate(() => getComputedStyle(document.querySelector('#side > .log')).display !== 'none'), 'after the task the words are back');
        await p.evaluate(() => menuOpen('ship')); await p.waitForTimeout(300); ok(await p.evaluate(() => getComputedStyle(document.querySelector('#side > .log')).display === 'none'), 'My ship open: the words step aside'); await p.evaluate(() => menuOpen(null)); await p.waitForTimeout(200);
        // turned upright: the words go back under the picture; turned back: beside it again
        await p.setViewportSize({ width: 820, height: 1180 }); await p.waitForTimeout(700); const up = await where(); ok(!up.side && up.shown, 'turned upright: the words go back under the picture');
        await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(700); ok((await where()).side, 'turned sideways again: the words are beside the picture');
      } else { ok(!on.side && on.shown && on.picH === off.picH, 'held upright or on a phone: nothing changes with the switch on'); await shot('2_on_unchanged'); }
      await p.reload(); await p.waitForTimeout(700); ok(await p.evaluate(() => $('wsideOn').checked), 'the switch is remembered'); if (off.wide) ok((await where()).side, 'after opening again, the words are beside the picture');
      await sw(false); ok(!(await where()).side, 'switched off: the words go back under the picture');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The words beside the picture: every check passed, on four screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
