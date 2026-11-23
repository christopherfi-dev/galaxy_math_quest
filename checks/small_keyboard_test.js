// Direction buttons, and a small keyboard for the command box.
// [Source: Marc, 2026-11-19: "Can you also add West East north and south as buttons to tap? Maybe a little mini keyboard, if possible,
//  because every time they need to type it, their giant keyboard comes up on their iPad."]
//   - Go buttons: four on the station and on Chronosia's map, west and east on Voltara and the small worlds, none where they mean nothing. A tap walks.
//   - on a touch screen the command box does not call the big keyboard. A tap on the box brings small letter keys. They type, rub out and send.
//   - the small keys sit just above the box. They never cover the box, the Do row, the Go row, the Here row or the bag. The page does not move.
//     They step aside after a command. They can be moved and hidden.
//   - "Big keys" switches to the device's own keyboard and back, and the choice is remembered. With typed words in the box, a bag word is added, not erased.
// Run: node checks/small_keyboard_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad-wide', 1180, 820], ['ipad-tall', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-wisps', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${String(got).slice(0, 200)}"`); };
    const idle = async () => { for (let i = 0; i < 150; i++) { if (await p.evaluate(() => PL.to == null && !PL.then && !(S.mode === 'station' && ((P.route && P.route.length) || P.then)) && !(S.mode === 'chrono' && CM.route.length))) return; await p.waitForTimeout(100); } bad.push(name + ': still walking'); };
    const st = async () => { await p.waitForTimeout(250); await idle(); await p.waitForTimeout(150); return p.evaluate(() => ({ last: lines[lines.length - 1].text || '', box: $('cmd').value, kb: !$('kb').hidden })); };
    const dirs = () => p.evaluate(() => $('dirs').hidden ? '' : Array.from(document.querySelectorAll('#dirs button')).map(x => x.dataset.d).join());
    const kkey = async k => { await p.tap(`#kbkeys button[data-k="${k}"]`); };
    try {
    // ---- Go buttons
    await p.evaluate(() => { skipIntro(); }); await p.waitForTimeout(300); ok(await dirs() === 'north,south,east,west', 'the station should show north, south, east, west: ' + await dirs());
    const room0 = await p.evaluate(() => S.room + '|' + S.x + ',' + S.y); let moved = false, said = '';
    for (const d of ['north', 'south', 'east', 'west']) { await p.tap(`#dirs button[data-d="${d}"]`); const r = await st(); said += d + ': ' + r.last + ' / '; if (await p.evaluate(() => S.room + '|' + S.x + ',' + S.y) !== room0 || /You walk|You go|You crawl/.test(r.last)) { moved = true; break; } }
    ok(moved, 'a Go button on the station should walk somewhere: ' + said);
    await p.evaluate(() => { goVoltara(); }); await p.waitForTimeout(500); ok(await dirs() === 'west,east', 'Voltara should show west and east: ' + await dirs()); await p.tap('#dirs button[data-d="east"]'); let r = await st(); ok(await p.evaluate(() => V().sc === 'river'), 'EAST from the meadow should reach the river: ' + r.last);
    await p.evaluate(() => { goSpace(); }); await p.waitForTimeout(400); ok(await dirs() === '', 'space has no Go buttons'); await p.evaluate(() => { landWorld(Object.keys(TR)[1]); }); await p.waitForTimeout(500); ok(await dirs() === 'west,east', 'a small world shows west and east');
    await p.evaluate(() => { goChronosia(); }); await p.waitForTimeout(600); ok(await dirs() === 'north,south,east,west', 'Chronosia\'s map shows four ways'); await p.tap('#dirs button[data-d="north"]'); r = await st(); ok(await p.evaluate(() => C().y === 9), 'NORTH on the map should walk north: ' + r.last);
    await p.evaluate(() => { cEnter('ridge'); }); await p.waitForTimeout(500); ok(await dirs() === '', 'inside a place on Chronosia there are no Go buttons');
    await p.evaluate(() => { goVoltara(); vGo('homes', .3); V().met = true; act('use board'); }); await p.waitForTimeout(1800); ok(await dirs() === '', 'no Go buttons while a task is open'); await p.evaluate(() => { closeToy(); });
    // ---- the small keyboard
    await p.evaluate(() => { vGo('river', .3); PL.fade = 0; V().fed = false; V().crossed = false; if (!S.inv.includes('burst')) S.inv.push('burst'); drawBag(); }); await p.waitForTimeout(400);
    ok(await p.evaluate(() => $('cmd').getAttribute('inputmode') === 'none' && $('kb').hidden && $('kbt').hidden), 'on a touch screen the box should not call the big keyboard, the small keys start hidden, and no keyboard switch sits beside Do it');
    await p.tap('#cmd'); await p.waitForTimeout(350); ok(await p.evaluate(() => !$('kb').hidden && document.querySelectorAll('#kbkeys button').length === 29), 'a tap on the box should bring 26 letters, rub out, space and Do it');
    const lay = await p.evaluate(() => { const k = $('kb').getBoundingClientRect(), R = id => $(id).getBoundingClientRect(), over = r => r.width > 0 && r.left < k.right && k.left < r.right && r.top < k.bottom && k.top < r.bottom, inView = r => r.top >= 0 && r.bottom <= innerHeight; return { cmd: over(R('cmd')), verbs: over(R('verbs')), dirs: over(R('dirs')), nouns: over(R('nouns')), bag: over(R('bag')), cmdIn: inView(R('cmd')), nounsIn: inView(R('nouns')), kbIn: k.top >= 0 && k.bottom <= innerHeight && k.left >= 0 && k.right <= innerWidth, keyW: document.querySelector('#kbkeys button[data-k="q"]').getBoundingClientRect().width }; });
    // Sketch version 43: on an iPad the keys sit on the desk, never on the picture. Held sideways they lie at the bottom of the desk, clear of every word row.
    // Held upright the desk is short, so the keys may cover the right-hand end of the lower rows; the first word of each row stays in reach.
    const desk = await p.evaluate(() => ({ on: document.body.classList.contains('desk'), col: document.body.classList.contains('sidecol'), pic: (() => { const k = $('kb').getBoundingClientRect(), s = document.querySelector('.stage').getBoundingClientRect(); return k.left < s.right - 1 && s.left < k.right - 1 && k.top < s.bottom - 1 && s.top < k.bottom - 1; })(),
      firsts: ['verbs', 'nouns', 'bag'].filter(id => { const e = document.querySelector('#' + id + ' button'); if (!e) return false; const r = e.getBoundingClientRect(), k = $('kb').getBoundingClientRect(); return r.width > 0 && r.left < k.right && k.left < r.right && r.top < k.bottom && k.top < r.bottom; }) }));
    if (desk.on) { ok(!desk.pic, 'the small keys are on the picture'); ok(!lay.cmd, 'the small keys cover the box'); if (desk.col) ok(!lay.verbs && !lay.dirs && !lay.nouns && !lay.bag, 'beside the picture the small keys should be clear of the word rows: ' + JSON.stringify(lay)); else ok(!lay.verbs && !lay.dirs && desk.firsts.length === 0, 'the small keys cover the first word of a row: ' + desk.firsts + ' ' + JSON.stringify(lay)); }
    else ok(!lay.cmd && !lay.verbs && !lay.dirs && !lay.nouns && !lay.bag, 'the small keys cover the box or the word rows: ' + JSON.stringify(lay)); ok(lay.cmdIn && lay.kbIn, 'the box and the keys should both be on the screen: ' + JSON.stringify(lay)); ok(lay.keyW >= 30, 'a letter key is too narrow to tap: ' + lay.keyW);
    if (out) await p.screenshot({ path: path.join(out, `smallkeys_${name}.png`) });
    for (const k of ['g', 'i', 'v', 'e', 'x']) await kkey(k); await kkey('del'); await kkey('space'); await kkey('space'); r = await st(); ok(r.box === 'give ' && r.kb, 'typing g-i-v-e-x, rub out, space should leave "give ": "' + r.box + '"');
    // typed words, then a word from the bag: added, not erased
    await p.tap('#bag .word[data-i="burst"]'); r = await st(); ok(r.box === 'give flavorburst to ', 'a bag word after typed words must be added, not erased: "' + r.box + '"'); expect(r.last, /Give the FlavorBurst to what\? Tap a thing\./, 'and the game asks to what');
    await p.tap('#nouns button[data-w="gumblefish"]'); r = await st(); expect(r.last, /Gulp! The Gumblefish spins/, 'type give, tap FlavorBurst, tap Gumblefish');
    // type a whole command on the small keys and send it with their own Do it
    await p.tap('#cmd'); await p.waitForTimeout(300); for (const k of ['l', 'o', 'o', 'k']) await kkey(k); await kkey('ok'); r = await st(); expect(r.last, /Sparkling River|river sparkles/i, 'l-o-o-k and Do it on the small keys'); ok(!r.kb && r.box === '', 'the small keys step aside after a command');
    // the page must not move when the keys come and go
    const y0 = await p.evaluate(() => { $('cmd').blur(); return window.scrollY; }); const y1 = await p.evaluate(() => { $('cmd').focus({ preventScroll: true }); return [window.scrollY, !$('kb').hidden]; }); await kkey('l'); await kkey('ok'); await p.waitForTimeout(400); const y2 = await p.evaluate(() => window.scrollY); ok(y1[1] && y1[0] === y0 && y2 === y0, `the page should not move when the small keys come and go: ${y0}, ${y1[0]}, ${y2}`);
    // move it, hide it
    await p.tap('#cmd'); await p.waitForTimeout(300); const before = await p.evaluate(() => $('kb').getBoundingClientRect().top); const g = await p.evaluate(() => { const q = $('kbgrip').getBoundingClientRect(); return [q.left + 10, q.top + 6]; });
    await p.mouse.move(g[0], g[1]); await p.mouse.down(); await p.mouse.move(g[0] + 10, g[1] - 120, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(150); if (desk.on) ok(await p.evaluate(t => Math.abs($('kb').getBoundingClientRect().top - t) < 3 && !$('kb').hidden, before), 'on an iPad the small keys have their own place on the desk and should not be dragged'); else ok(await p.evaluate(t => Math.abs($('kb').getBoundingClientRect().top - t) > 60 && !$('kb').hidden, before), 'the small keys should move when dragged by the bar');
    await p.tap('#kbx'); await p.waitForTimeout(250); ok(await p.evaluate(() => $('kb').hidden), 'the cross should hide the small keys');
    // big keys and back, remembered
    await p.tap('#cmd'); await p.waitForTimeout(300); await p.tap('#kbbig'); await p.waitForTimeout(300); ok(await p.evaluate(() => $('cmd').getAttribute('inputmode') === 'text' && $('kb').hidden && !$('kbt').hidden && $('kbt').textContent === 'Small keys' && getKeep('gmq-kb') === 'big'), '"Big keys" on the small keyboard should hand over to the device keyboard, and leave a way back');
    await p.evaluate(() => save()); await p.waitForTimeout(250); await p.reload(); await p.waitForTimeout(500); ok(await p.evaluate(() => $('cmd').getAttribute('inputmode') === 'text' && KB.big), 'the choice of big keys should be remembered');
    await p.tap('#kbt'); await p.waitForTimeout(350); ok(await p.evaluate(() => $('cmd').getAttribute('inputmode') === 'none' && !$('kb').hidden && $('kbt').hidden), '"Small keys" should bring the small keys back'); await p.tap('#kbx');
    // a real keyboard still works: type and press Enter
    await p.fill('#cmd', 'look'); await p.press('#cmd', 'Enter'); r = await st(); ok(r.last.length > 5 && r.box === '', 'typing on a real keyboard and pressing Enter still works');
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close();
  }
  // ---- no touch screen: no small keys, and the box is an ordinary text box
  { const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: false }), p = await ctx.newPage(); await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const d = await p.evaluate(() => { skipIntro(); $('cmd').focus(); return { mode: $('cmd').getAttribute('inputmode'), kb: $('kb').hidden, kbt: $('kbt').hidden, touch: KB.touch }; }); if (d.touch) console.log('note: this browser reports touch even without a touch screen; the desktop check was skipped'); else if (d.mode !== 'text' || !d.kb || !d.kbt) bad.push('desktop: with no touch screen there should be no small keys: ' + JSON.stringify(d)); await ctx.close(); }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
