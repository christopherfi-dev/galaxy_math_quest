// The floating number pad.  [Source: Marc, 2026-11-17: "a little number keypad pop up... floating, they can move around... it's annoying that they get the full keyboard"]
// Checks, at iPad and phone size, with touch:
//   - a number box tells the device not to open its own keyboard, and the pad appears
//   - tapping the pad types into the box, rubs out, and "Check" presses the Check button
//   - with two boxes, "Next box" moves on, and the pad follows the box you touch
//   - the pad can be dragged, stays on the screen, and is in the same place after the page is opened again
//   - "ABC" brings the device keyboard back, and "123" brings the pad back
//   - the pad goes away when the task closes, and never shows for the word boxes
// Run: node checks/number_pad_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['ipad-wide', 1180, 820], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} }); /* reading cards have their own test: reading_card_test.js */ await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const pad = () => p.evaluate(() => { const e = $('pad'), r = e.getBoundingClientRect(); return { shown: !e.hidden, x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), mini: e.classList.contains('mini') }; });
    const key = k => p.locator(`#padkeys button[data-k="${k}"]`).tap();
    const box = id => p.evaluate(i => { const e = $(i); return e ? { v: e.value, mode: e.getAttribute('inputmode'), focus: document.activeElement === e } : null; }, id);
    // Voltara, at the tower store: one box, then two boxes
    await p.evaluate(() => { skipIntro(); goVoltara(); const v = V(); v.met = true; v.sc = 'plaza'; give('ckey'); save(); }); await p.waitForTimeout(500);
    if ((await pad()).shown) bad.push(name + ': the pad shows with no number box');
    await p.fill('#cmd', 'open tower'); await p.press('#cmd', 'Enter'); await p.waitForSelector('#toy #try', { state: 'visible', timeout: 20000 }); await p.waitForTimeout(200); await p.locator('#try').tap(); await p.locator('#try').tap(); await p.waitForTimeout(200);
    const first = () => p.evaluate(() => { const i = document.querySelector('#toy input'); return i ? i.id : null; }); let A = await first();
    let st = await pad(), bx = await box(A); if (!st.shown || !bx || bx.mode !== 'none') bad.push(name + ': a number box should show the pad and keep the device keyboard away: ' + JSON.stringify([st, bx]));
    if (st.x < 0 || st.y < 0 || st.r > w || st.b > h) bad.push(name + ': the pad is off the screen ' + JSON.stringify(st));
    { const over = await p.evaluate(() => { const a = $('pad').getBoundingClientRect(), i = document.querySelector('#toy input').getBoundingClientRect(); return !(a.right < i.left || a.left > i.right || a.bottom < i.top || a.top > i.bottom); }); if (over) bad.push(name + ': the pad covers the box you are typing in'); }
    if (out) { await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, `pad_${name}_1.png`) }); }
    await key('1'); await key('9'); await key('del'); await key('5'); bx = await box(A); if (bx.v !== '15' || !bx.focus) bad.push(name + ': tapping 1 9 rub-out 5 should give 15 and keep the cursor in the box: ' + JSON.stringify(bx));
    await key('ok'); await p.waitForTimeout(250); const q2 = await p.evaluate(() => document.querySelectorAll('#toy input').length); if (q2 !== 2) bad.push(name + ': Check on the pad should move on to the two-box question, found ' + q2 + ' boxes');
    st = await pad(); if (!st.shown || !(await p.evaluate(() => !$('padnext').hidden))) bad.push(name + ': two boxes should show the pad with "Next box"');
    const ids = await p.evaluate(() => [...document.querySelectorAll('#toy input')].map(i => i.id)); await key('8'); await key('next'); await key('5'); const two = await p.evaluate(() => [...document.querySelectorAll('#toy input')].map(i => i.value));
    if (two.join(',') !== '8,5') bad.push(name + ': 8, Next box, 5 should fill the two boxes: ' + two.join(',')); await p.locator('#' + ids[0]).tap(); await key('del'); await key('8'); if ((await box(ids[0])).v !== '8') bad.push(name + ': the pad should follow the box you touch');
    await key('ok'); await p.waitForTimeout(250); if (!/big crystals, and/.test(await p.textContent('#toy .q'))) bad.push(name + ': the two-box answer was not accepted from the pad');
    // drag it. It stays on the screen and remembers its place.
    const bar = await p.locator('#padbar').boundingBox(); await p.mouse.move(bar.x + 20, bar.y + 10); await p.mouse.down(); await p.mouse.move(60, 200, { steps: 6 }); await p.mouse.up(); const moved = await pad();
    if (Math.abs(moved.x - 40) > 12 || Math.abs(moved.y - 190) > 12) bad.push(name + ': dragging the bar should move the pad: ' + JSON.stringify(moved));
    await p.mouse.move(moved.x + 20, moved.y + 10); await p.mouse.down(); await p.mouse.move(-500, -500, { steps: 4 }); await p.mouse.up(); const edge = await pad(); if (edge.x < 0 || edge.y < 0) bad.push(name + ': the pad can be dragged off the screen');
    const clearY = await p.evaluate(() => Math.max(14, Math.min(300, $('leave').getBoundingClientRect().top - $('pad').offsetHeight - 24)));      /* park the pad where it does not sit on the task's own buttons */
    await p.mouse.move(edge.x + 20, edge.y + 10); await p.mouse.down(); await p.mouse.move(120, clearY + 10, { steps: 6 }); await p.mouse.up(); const kept = await pad(); if (out) await p.screenshot({ path: path.join(out, `pad_${name}_2_moved.png`) });
    // the full keyboard, and back
    await p.locator('#padkb').tap(); await p.waitForTimeout(150); A = await first(); st = await pad(); bx = await box(A); if (!st.mini || bx.mode !== 'numeric') bad.push(name + ': ABC should fold the pad and give the device keyboard back: ' + JSON.stringify([st, bx]));
    if (await p.locator('#padkeys').isVisible()) bad.push(name + ': the keys should be hidden when the pad is folded');
    await p.locator('#padkb').tap(); await p.waitForTimeout(150); st = await pad(); bx = await box(A); if (st.mini || bx.mode !== 'none') bad.push(name + ': 123 should bring the pad back');
    // it goes away with the task, and the place is remembered
    await p.locator('#leave').tap(); await p.waitForTimeout(150); if ((await pad()).shown) bad.push(name + ': the pad should go when the task closes');
    await p.reload(); await p.waitForTimeout(500); await p.fill('#cmd', 'open tower'); await p.press('#cmd', 'Enter'); await p.waitForSelector('#toy #try', { state: 'visible', timeout: 20000 }); await p.waitForTimeout(200); for (let i = 0; i < 2 && !(await p.locator('#toy input').count()); i++) await p.locator('#try').tap(); await p.waitForTimeout(200);
    const again = await pad(); if (!again.shown || Math.abs(again.x - kept.x) > 6 || Math.abs(again.y - kept.y) > 6) bad.push(name + ': the pad should be where it was left: ' + JSON.stringify([kept, again]));
    await p.locator('#leave').tap();
    // a word box never shows it
    await p.locator('#cmd').tap(); if ((await pad()).shown) bad.push(name + ': the pad shows for the command line');
    await p.evaluate(() => { goStation(); S.ship = ''; shipReport(); }); await p.waitForTimeout(300); await p.locator('#shipname').tap(); if ((await pad()).shown) bad.push(name + ': the pad shows for the ship-name box'); await p.locator('#later').tap();
    console.log(`${name}: pad checked`); await ctx.close();
  }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0], '| at', (String(e.stack).match(/number_pad_test.js:\d+:\d+/) || [''])[0]); process.exit(1); });
