// The Voltara fly-in as its own page (prototypes/voltara_flyin.html, copied to docs/flyin/index.html).   [Handoff: HANDOFF_Voltara_Flyin_2026-11-21.md, section 8]
//
// It checks:
//   1. on three screens (iPad sideways, iPad upright, a phone) and on the older iPad sideways: the page starts, plays, and ends by itself
//      within 10.5 seconds; the last picture is the meadow (sky above, river in the middle, grass below, the ship standing at the left)
//   2. a tap skips it at every second of the scene, at once, and the meadow picture is then shown
//   3. with WebGL 2 taken away it ends at once and says the game goes straight to the landing
//   4. a set-up that takes more than one second ends at once in the same way ("it never blocks the game")
//   5. the short one ends within 3 seconds
//   6. turning the iPad in the middle: it goes on, ends on time, and the picture has the new shape
//   7. a hidden page and a lost picture both end it
//   8. Watch again works, during the scene and after it
//   9. the two copies of the page are the same file; the page asks the network for nothing; no errors
//  10. the piece the game would use (between the two marked lines) is under 60 KB
// The speed is NOT checked: this machine draws WebGL in software. Speed comes only from real iPads.
//
// Run:  node checks/flyin_test.js     Needs Node with Playwright and Chromium. About 3 minutes.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const FILE = path.resolve(__dirname, '..', 'prototypes', 'voltara_flyin.html'), COPY = path.resolve(__dirname, '..', 'docs', 'flyin', 'index.html'), URL = 'file://' + FILE;
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }), bad = [], say = (ok, what) => { if (!ok) bad.push(what); };
  const open = async (w, h, q = '', init) => { const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }); p.errs = []; p.reqs = [];
    p.on('pageerror', e => p.errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') p.errs.push(m.text()); }); p.on('request', r => p.reqs.push(r.url()));
    if (init) await p.addInitScript(init); p.t0 = Date.now(); await p.goto(URL + q); return p; };
  const state = p => p.evaluate(() => ({ state: document.body.dataset.state, why: document.body.dataset.why, say: document.getElementById('say').textContent, stat: document.getElementById('stat').textContent, hint: getComputedStyle(document.getElementById('hint')).display, took: +document.body.dataset.took, cw: document.getElementById('cv').width, ch: document.getElementById('cv').height, bw: document.getElementById('cv').clientWidth, bh: document.getElementById('cv').clientHeight }));
  const done = (p, ms) => p.waitForFunction(() => document.body.dataset.state === 'done', null, { timeout: ms, polling: 50 }).then(() => true, () => false);
  // read the picture as it is drawn: a copy made in the same frame, then a few points of it
  const look = p => p.evaluate(() => new Promise(res => requestAnimationFrame(() => requestAnimationFrame(() => { const cv = document.getElementById('cv'), c = document.createElement('canvas'); c.width = 200; c.height = 160; const x = c.getContext('2d'); x.drawImage(cv, 0, 0, 200, 160);
    const at = (u, v) => Array.from(x.getImageData(Math.round(u * 199), Math.round(v * 159), 1, 1).data.slice(0, 3)); res({ top: at(.3, .03), river: [.04, .12, .33, .45, .62, .7, .92].map(u => at(u, .69)).sort((p, q) => (q[2] - q[0]) - (p[2] - p[0]))[0], grass: at(.5, .97), ship: at(.07, .76), all: new Set(Array.from(x.getImageData(0, 0, 200, 160).data).filter((_, i) => i % 4 === 0)).size }); }))));
  const meadow = (m, tag) => { say(m.top[2] > m.top[1] + 40 && m.top[2] > 90, `${tag}: the top of the last picture is not the purple sky (${m.top})`); say(m.river[2] > m.river[0] + 60, `${tag}: no blue river anywhere along its row in the last picture (${m.river})`);
    say(m.grass[1] > m.grass[0] + 15 && m.grass[1] > m.grass[2] - 5 && m.grass[1] < 140, `${tag}: no dark grass at the bottom of the last picture (${m.grass})`); say(Math.min(...m.ship) > 190, `${tag}: the ship is not standing at the left (${m.ship})`); say(m.all > 60, `${tag}: the last picture is nearly empty`); };

  // 1. it plays and ends by itself, on four screens
  for (const [w, h] of [[1180, 745], [820, 1180], [390, 760], [1080, 700]]) { const tag = `${w}x${h}`, p = await open(w, h);
    await p.waitForFunction(() => document.body.dataset.state === 'playing', null, { timeout: 3000 }).catch(() => bad.push(`${tag}: it did not start`)); const t0 = Date.now(); const s0 = await state(p);
    say(s0.hint !== 'none', `${tag}: no "Tap to skip" while it plays`);
    const ok = await done(p, 12000), s = await state(p), took = s.took;
    say(ok && s.why === 'end', `${tag}: it did not end by itself (${s.state}, ${s.why})`); say(took <= 10.5, `${tag}: it took ${took.toFixed(1)} s, more than 10.5`); say(took >= 9.4, `${tag}: it ended too soon, after ${took.toFixed(1)} s`);
    say(/The game starts here/.test(s.say), `${tag}: after the end it says "${s.say}"`); say(s.hint === 'none', `${tag}: "Tap to skip" stays after the end`); say(/Set-up took \d+ ms/.test(s.stat), `${tag}: no numbers after the end ("${s.stat}")`);
    say(Math.abs(s.cw / s.ch - s.bw / s.bh) < .02, `${tag}: the picture is stretched (${s.cw}x${s.ch} dots in a ${s.bw}x${s.bh} box)`);
    meadow(await look(p), tag); say(p.reqs.length === 1, `${tag}: the page asked for ${p.reqs.length} things`); say(!p.errs.length, `${tag}: errors: ${p.errs.slice(0, 3).join(' | ')}`); await p.close(); }

  // 2. a tap skips it, at every second
  for (const at of [.15, 1, 2, 3, 4, 5, 5.5, 6, 7, 8, 9]) { const p = await open(748, 640); await p.waitForFunction(() => document.body.dataset.state === 'playing', null, { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(at * 1000); const t0 = Date.now(); await p.mouse.click(300, 250); const ok = await done(p, 1000), s = await state(p);
    say(ok && s.why === 'skip' && Date.now() - t0 < 600, `tap at ${at} s: it did not skip at once (${s.state}, ${s.why}, ${Date.now() - t0} ms)`); say(/^Skipped/.test(s.say), `tap at ${at} s: it says "${s.say}"`);
    meadow(await look(p), `tap at ${at} s`); say(!p.errs.length, `tap at ${at} s: errors: ${p.errs.slice(0, 2).join(' | ')}`); await p.close(); }

  // 3. no WebGL 2      4. a slow set-up
  { const p = await open(1180, 745, '', () => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (k, ...a) { return k === 'webgl2' ? null : g.call(this, k, ...a); }; });
    const ok = await done(p, 800), s = await state(p); say(ok && s.why === 'nowebgl', `no WebGL 2: it did not end at once (${s.state}, ${s.why})`); say(/straight to the landing/.test(s.say), `no WebGL 2: it says "${s.say}"`); say(!p.errs.length, `no WebGL 2: errors: ${p.errs.slice(0, 2).join(' | ')}`); await p.close(); }
  { const p = await open(1180, 745, '', () => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (k, ...a) { if (k === 'webgl2') { const t = performance.now(); while (performance.now() - t < 1150); } return g.call(this, k, ...a); }; });
    const ok = await done(p, 3000), s = await state(p); say(ok && s.why === 'slowstart', `slow set-up: it did not give way to the landing (${s.state}, ${s.why})`); say(/straight to the landing/.test(s.say), `slow set-up: it says "${s.say}"`); await p.close(); }

  // 5. the short one
  { const p = await open(1180, 745, '?short=1'); await p.waitForFunction(() => document.body.dataset.state === 'playing', null, { timeout: 3000 }).catch(() => {}); const ok = await done(p, 5000), s = await state(p), took = s.took;
    say(ok && s.why === 'end' && took <= 3 && took >= 2.4, `the short one: ${s.why} after ${took.toFixed(1)} s`); meadow(await look(p), 'the short one'); await p.close(); }

  // 6. turned in the middle
  { const p = await open(1180, 745); await p.waitForFunction(() => document.body.dataset.state === 'playing', null, { timeout: 3000 }).catch(() => {}); const t0 = Date.now();
    await p.waitForTimeout(3000); await p.setViewportSize({ width: 745, height: 1180 }); await p.waitForTimeout(3500); const mid = await state(p); say(mid.state === 'playing', `turned: it stopped (${mid.state}, ${mid.why})`);
    await p.setViewportSize({ width: 1180, height: 745 }); await p.waitForTimeout(600); await p.setViewportSize({ width: 745, height: 1180 });
    const ok = await done(p, 9000), s = await state(p), took = s.took; say(ok && s.why === 'end' && took <= 10.5, `turned: ${s.why} after ${took.toFixed(1)} s`);
    await p.waitForTimeout(300); const s2 = await state(p); say(s2.bh > s2.bw && Math.abs(s2.cw / s2.ch - s2.bw / s2.bh) < .02, `turned: the picture did not take the new shape (${s2.cw}x${s2.ch} dots in ${s2.bw}x${s2.bh})`); meadow(await look(p), 'turned'); say(!p.errs.length, `turned: errors: ${p.errs.slice(0, 2).join(' | ')}`); await p.close(); }

  // 7. hidden, and a lost picture
  { const p = await open(1180, 745); await p.waitForTimeout(2500); await p.evaluate(() => { Object.defineProperty(document, 'hidden', { get: () => true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    const ok = await done(p, 800), s = await state(p); say(ok && s.why === 'hidden', `hidden: ${s.state}, ${s.why}`); await p.close(); }
  { const p = await open(1180, 745, '', () => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (k, ...a) { const c = g.call(this, k, ...a); if (k === 'webgl2') window.__gl = c; return c; }; });
    await p.waitForTimeout(2500); await p.evaluate(() => window.__gl.getExtension('WEBGL_lose_context').loseContext()); const ok = await done(p, 1500), s = await state(p);
    say(ok && s.why === 'lost', `lost picture: ${s.state}, ${s.why}`); say(/straight to the landing/.test(s.say), `lost picture: it says "${s.say}"`); say(!p.errs.length, `lost picture: errors: ${p.errs.slice(0, 2).join(' | ')}`); await p.close(); }

  // 8. Watch again
  { const p = await open(1180, 745); await p.waitForTimeout(2000); await p.click('#again'); await p.waitForTimeout(400); let s = await state(p); say(s.state === 'playing', `Watch again in the middle: ${s.state}, ${s.why}`);
    let ok = await done(p, 12000); s = await state(p); say(ok && s.why === 'end' && s.took > 9.4 && s.took <= 10.5, `Watch again in the middle: ${s.why} after ${s.took} s`);
    await p.click('#short'); await p.waitForTimeout(300); s = await state(p); say(s.state === 'playing', `The short one after the end: ${s.state}`); ok = await done(p, 4000); s = await state(p); say(ok && s.why === 'end', `The short one after the end: ${s.why}`); meadow(await look(p), 'after Watch again');
    say(!p.errs.length, `Watch again: errors: ${p.errs.slice(0, 2).join(' | ')}`); await p.close(); }

  // 9. the copy for the iPads is the same file      10. the size of the piece for the game
  const src = fs.readFileSync(FILE, 'utf8'); say(fs.existsSync(COPY) && fs.readFileSync(COPY, 'utf8') === src, 'docs/flyin/index.html is not a copy of prototypes/voltara_flyin.html');
  const a = src.indexOf('/* ===== GMQ FLY-IN: start'), z = src.indexOf('/* ===== GMQ FLY-IN: end ====='), kb = Buffer.byteLength(src.slice(a, z)) / 1024; say(a > 0 && z > a && kb < 60, `the piece for the game is ${kb.toFixed(1)} KB, over 60`);

  await b.close();
  console.log(bad.length ? bad.join('\n') : `The fly-in starts, ends by itself on time on four screens with the meadow as its last picture, skips on a tap at every second, and gives way at once with no WebGL 2, a slow set-up, a hidden page or a lost picture. The piece for the game is ${kb.toFixed(1)} KB.`);
  console.log(bad.length ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(bad.length ? 1 : 0);
})();
