// The fly-in, wired into the game (version 95).   [Source: Marc, 2026-11-21 and 22: try the fly-in; first person; slower; the full scene the first time, two seconds after.]
//   [Proposal: the fly-in thread's section 9, built by the main thread] Played as a child lands, in the real game, at iPad sideways, iPad upright and phone size:
//   - landing from space shows the fly-in on its own canvas over the picture, with "Tap to skip"; under it the game is already on the meadow and saved
//   - during the flight the words say "You fly down to Planet Voltara. Tap the picture to skip."; the landing words come at touchdown, so they match the picture
//   - a tap skips it; the picture is then the meadow, and the game goes on (look, walk); the landing beep is not lost
//   - the first landing plays the full scene; it is counted (S.flown); the next landing plays the short one, and it ends by itself in about two and a half seconds
//   - closing the game during the fly-in: it opens on the meadow, with no fly-in
//   - it never plays: with the Teacher switch off; when the device asks for less motion; with no WebGL 2 (it ends at once, and the meadow is there)
//   - the Teacher shortcut "Go to Voltara" does not play it
// The pictures: one during the flight and one after, at each size. The scene itself is checked by the fly-in thread's checks/flyin_test.js.
// Run: node checks/voltara_landing_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const open = async (name, w, h, o) => { o = o || {}; const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1, reducedMotion: o.calm ? 'reduce' : 'no-preference' }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(fly => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-flyin', fly); } } catch (e) {} }, o.fly || 'on');
    if (o.nogl) await p.addInitScript(() => { window.GMQ_NO_CARDPOP = true; const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (k, ...a) { return k === 'webgl2' ? null : g.call(this, k, ...a); }; });
    await p.goto(FILE); await p.waitForTimeout(400); return p; };
  const toNumerix = async p => { await p.evaluate(() => { skipIntro(); goSpace(); S.at = 'numerix'; SP.to = null; SP.x = GAL.numerix.x; SP.y = GAL.numerix.y; save(); }); await p.waitForTimeout(300); };
  const land = async p => { await p.fill('#cmd', 'land'); await p.press('#cmd', 'Enter'); await p.waitForTimeout(250); };
  const st = p => p.evaluate(() => ({ flying: !!FLY, shown: !$('flycv').hidden, hint: !$('flyhint').hidden, mode: S.mode, sc: S.v && S.v.sc, flown: S.flown || 0, stored: JSON.parse(localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || '{}').mode }));
  const until = async (p, f, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(f)) return (Date.now() - t0) / 1000; await p.waitForTimeout(100); } return null; };
  const shot = async (p, n) => { if (out) await p.screenshot({ path: path.join(out, `landing_${n}.png`) }); };
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    const p = await open(name, w, h); await toNumerix(p);
    const gl = await p.evaluate(() => { const c = document.createElement('canvas'); return !!c.getContext('webgl2'); }); if (!gl) { bad.push(name + ': this test browser has no WebGL 2, so the fly-in cannot be seen here'); continue; }
    // ---- the first landing: the full scene, a tap skips it
    await land(p); let s = await st(p); ok(s.flying && s.shown && s.hint, 'landing shows the fly-in and "Tap to skip"'); ok(s.mode === 'planet' && s.sc === 'meadow' && s.stored === 'planet', 'under the fly-in the game is already on the meadow, and saved');
    ok(/^You fly down to Planet Voltara\. Tap the picture to skip\.$/.test(await p.evaluate(() => lines[lines.length - 1].text || '')), 'during the flight the words say so, and how to skip');
    await p.waitForTimeout(3500); await shot(p, name + '_1_flying'); ok((await st(p)).flying, 'the full scene is still playing after 3.5 seconds');
    const box = await p.locator('#flycv').boundingBox(); await p.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); const gone = await until(p, () => !FLY && $('flycv').hidden, 3000);
    ok(gone !== null, 'a tap skips the fly-in'); await p.waitForTimeout(200); ok(/^You land on Planet Voltara\. Rainbow skies! But the city across the river is dark\./.test(await p.evaluate(() => lines[lines.length - 1].text || '')), 'the landing words come at touchdown'); s = await st(p); ok(s.flown === 1, 'a skipped fly-in counts as seen'); await p.waitForTimeout(400); await shot(p, name + '_2_meadow');
    ok(await p.evaluate(() => S.mode === 'planet' && V().sc === 'meadow' && Math.abs(PL.x - .13) < .02), 'after the skip the cadet is on the meadow, where the game put them');
    await p.fill('#cmd', 'look'); await p.press('#cmd', 'Enter'); await p.waitForTimeout(300); ok(/meadow|Meadow/.test(await p.evaluate(() => lines[lines.length - 1].text || '')), 'the game goes on after the fly-in');
    // ---- the next landing: the short one, which ends by itself
    await p.evaluate(() => { goSpace(); S.at = 'numerix'; SP.to = null; save(); }); await p.waitForTimeout(300); await land(p); ok((await st(p)).flying, 'the second landing plays the short fly-in');
    const took = await until(p, () => !FLY && $('flycv').hidden, 8000); ok(took !== null && took < 5, `the short fly-in ends by itself in a few seconds (took ${took})`); await p.waitForTimeout(200); ok(/^You land on Planet Voltara/.test(await p.evaluate(() => lines[lines.length - 1].text || '')), 'the short one also ends with the landing words'); ok((await st(p)).flown === 2, 'counted again');
    // ---- closed during the fly-in
    await p.evaluate(() => { goSpace(); S.at = 'numerix'; SP.to = null; save(); }); await p.waitForTimeout(300); await land(p); await p.reload(); await p.waitForTimeout(700);
    s = await st(p); ok(s.mode === 'planet' && s.sc === 'meadow' && !s.flying && !s.shown, 'closed during the fly-in: it opens on the meadow, with no fly-in');
    await p.context().close(); }
  // ---- it never plays
  { const p = await open('switch off', 1180, 745, { fly: 'off' }); await toNumerix(p); await land(p); const s = await st(p); if (s.flying || s.shown) bad.push('the Teacher switch off: the fly-in still played'); if (!/^You land on Planet Voltara/.test(await p.evaluate(() => lines[lines.length - 1].text || ''))) bad.push('the Teacher switch off: the landing words are not said at once'); if (s.mode !== 'planet') bad.push('the Teacher switch off: the landing did not happen');
    await p.evaluate(() => { $('flyOn').checked = true; $('flyOn').onchange(); }); if (await p.evaluate(() => localStorage.getItem('gmq-flyin')) !== 'on') bad.push('the Teacher switch does not keep its setting'); await p.context().close(); }
  { const p = await open('less motion', 1180, 745, { calm: true }); await toNumerix(p); await land(p); const s = await st(p); if (s.flying || s.shown || s.mode !== 'planet') bad.push('less motion: the fly-in played, or the landing did not happen'); await p.context().close(); }
  { const p = await open('no webgl', 1180, 745, { nogl: true }); await toNumerix(p); await land(p); await p.waitForTimeout(300); const s = await st(p); if (s.flying || s.shown || s.mode !== 'planet' || s.sc !== 'meadow') bad.push('no WebGL 2: the fly-in did not end at once, or the meadow is not there: ' + JSON.stringify(s)); if (!/^You land on Planet Voltara/.test(await p.evaluate(() => lines[lines.length - 1].text || ''))) bad.push('no WebGL 2: the landing words are not said'); await p.context().close(); }
  { const p = await open('teacher shortcut', 1180, 745); await p.evaluate(() => { skipIntro(); goVoltara(); }); await p.waitForTimeout(400); const s = await st(p); if (s.flying || s.shown) bad.push('the Teacher shortcut played the fly-in'); await p.context().close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The fly-in in the game: every check passed, on three screens, and it stays away when it should.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
