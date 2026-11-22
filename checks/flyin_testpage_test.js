// The iPad test page for the Voltara fly-in (docs/flyin/test.html).   [Handoff: HANDOFF_Voltara_Flyin_2026-11-21.md, Phase 0]
//
// It checks, on three screens (iPad sideways, iPad upright, a phone):
//   - the page starts, says YES or NO for WebGL 2 and WebGPU, and shows the screen, the pixel ratio, the browser and the system
//   - the planet test ends by itself, with a number on each of its three lines, and then shows the photo line
//   - the photo line, the three results and the button are on the screen without scrolling; nothing spills sideways.
//     This is also checked on an older iPad held sideways with a browser's bars taking room (1080 wide, 700, 620 and 560 tall):
//     on Marc's older iPad in Chrome the button was half off the bottom [proposals/GMQ_Flyin_iPad_Results_2026-11-22.md]
//   - the page asks the network for nothing at all (only its own file is loaded)
//   - with WebGL 2 taken away it says NO, says why there is no planet, and still ends at once
//   - an iPad's Safari is named as Safari on an iPad, from the words an iPad really sends
//   - turning the iPad in the middle of the test starts it again and it still ends
//   - "Test again" runs it again
// The speeds are NOT checked: this machine draws WebGL in software, so its speed means nothing. Speed comes only from real iPads.
//
// Run:  node checks/flyin_testpage_test.js     Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'docs', 'flyin', 'test.html');
const done = p => p.waitForFunction(() => document.body.dataset.done === '1', null, { timeout: 90000 });
const read = p => p.evaluate(() => { const t = id => document.getElementById(id).textContent, box = id => { const r = document.getElementById(id).getBoundingClientRect(); return [r.top, r.bottom, r.left, r.right]; };
  return { gl2: t('gl2'), gpu: t('gpu'), scr: t('scr'), dpr: t('dpr'), brw: t('brw'), sys: t('sys'), r: [t('r0'), t('r1'), t('r2')], photo: t('photo'), count: t('count'),
    iw: innerWidth, ih: innerHeight, sw: document.scrollingElement.scrollWidth, boxes: ['photo', 'r0', 'r1', 'r2', 'again', 'gl2', 'gpu'].map(box), cw: document.getElementById('cv').width, ch: document.getElementById('cv').height }; });
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }), bad = [], say = (ok, what) => { if (!ok) bad.push(what); };
  const open = async (w, h, opts = {}, init) => { const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, ...opts }); p.errs = []; p.reqs = [];
    p.on('pageerror', e => p.errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') p.errs.push(m.text()); }); p.on('request', r => p.reqs.push(r.url()));
    if (init) await p.addInitScript(init); await p.goto(URL); return p; };

  // 1. the three screens
  for (const [w, h] of [[1180, 745], [820, 1180], [390, 760], [1080, 700], [1080, 620], [1080, 560]]) { const tag = `${w}x${h}`, p = await open(w, h);
    await p.waitForTimeout(1500); const mid = await read(p);
    say(mid.photo.startsWith('Please wait'), `${tag}: no "please wait" while the test runs`);
    say(/^\d+$/.test(mid.count), `${tag}: no countdown on the picture while the test runs ("${mid.count}")`);
    await done(p); const r = await read(p);
    say(r.gl2 === 'YES', `${tag}: WebGL 2 should say YES here, says "${r.gl2}"`);
    say(r.gpu === 'YES' || r.gpu === 'NO', `${tag}: WebGPU says "${r.gpu}"`);
    say(r.scr.startsWith(`${w} × ${h}`), `${tag}: screen says "${r.scr}"`); say(r.dpr === '2', `${tag}: pixel ratio says "${r.dpr}"`);
    say(r.brw.length > 3 && r.sys.length > 2, `${tag}: browser "${r.brw}", system "${r.sys}"`);
    r.r.forEach((t, i) => say(/^\d+, (smooth|OK|slow) \(slowest frame \d+ ms\)$/.test(t), `${tag}: result ${i + 1} reads "${t}"`));
    say(r.photo.startsWith('Take a photo of this screen'), `${tag}: the photo line reads "${r.photo}"`); say(r.count === '', `${tag}: the countdown stays after the end`);
    say(r.sw <= r.iw, `${tag}: the page spills sideways (${r.sw} > ${r.iw})`);
    r.boxes.forEach(([t, bt, l, rt], i) => say(t >= 0 && bt <= r.ih + 1 && l >= 0 && rt <= r.iw + 1, `${tag}: part ${i} is off the screen (${Math.round(t)} to ${Math.round(bt)} of ${r.ih})`));
    say(r.cw === w && r.ch === h, `${tag}: after the test the picture should be ${w} × ${h} dots, is ${r.cw} × ${r.ch}`);
    say(p.reqs.length === 1 && p.reqs[0] === URL, `${tag}: the page asked for ${p.reqs.length} things: ${p.reqs.slice(0, 4).join(', ')}`);
    say(!p.errs.length, `${tag}: errors: ${p.errs.slice(0, 3).join(' | ')}`); await p.close(); }

  // 2. no WebGL 2
  for (const old of [true, false]) { const p = await open(820, 1180, {}, `(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (k, ...a) { if (k === 'webgl2') return null; if (!${old} && /webgl/.test(k)) return null; return g.call(this, k, ...a); }; })();`);
    await p.waitForFunction(() => document.body.dataset.done === '1', null, { timeout: 3000 }).catch(() => bad.push('no WebGL 2: the page did not end at once')); const r = await read(p);
    say(old ? r.gl2 === 'NO (only the old WebGL 1)' : r.gl2 === 'NO', `no WebGL 2 (old one ${old}): says "${r.gl2}"`);
    r.r.forEach(t => say(t === 'No planet: it needs WebGL 2', `no WebGL 2: a result reads "${t}"`)); say(r.photo.startsWith('Take a photo'), 'no WebGL 2: no photo line');
    await p.click('#again'); await p.waitForTimeout(300); say((await read(p)).photo.startsWith('Take a photo'), 'no WebGL 2: Test again loses the photo line');
    say(!p.errs.length, `no WebGL 2: errors: ${p.errs.slice(0, 3).join(' | ')}`); await p.close(); }

  // 3. the words real iPads send
  for (const [ua, touch, brw, sys] of [
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15', 5, 'Safari 17.5', 'iPad, iPadOS 17.5 (Safari has the same number)'],
    ['Mozilla/5.0 (iPad; CPU OS 15_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1', 5, 'Safari 15.6', 'iPad, iPadOS 15.8'],
    ['Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.54 Mobile/15E148 Safari/604.1', 5, 'Chrome 126 for iPad', 'iPad, iPadOS 17.5'],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15', 0, 'Safari 26.0', 'Mac']]) {
    const p = await open(820, 1180, { userAgent: ua }, `Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { get: () => ${touch} });`); await p.waitForTimeout(300); const r = await read(p);
    say(r.brw === brw && r.sys === sys, `iPad words: expected "${brw}" / "${sys}", got "${r.brw}" / "${r.sys}"`); await p.close(); }

  // 4. turned in the middle, then Test again
  { const p = await open(1180, 745); await p.waitForTimeout(5000); await p.setViewportSize({ width: 745, height: 1180 }); await p.waitForTimeout(1200); const mid = await read(p);
    say(mid.r[0] === '…' && mid.photo.startsWith('Please wait'), `turned: the test did not start again (first result "${mid.r[0]}")`); say(mid.scr.includes('745 × 1180'), `turned: screen says "${mid.scr}"`);
    await done(p); const r = await read(p); r.r.forEach(t => say(/^\d+, /.test(t), `turned: a result reads "${t}"`));
    await p.setViewportSize({ width: 1180, height: 745 }); await p.waitForTimeout(700); const kept = await read(p);
    say(kept.r.join() === r.r.join() && kept.photo.startsWith('Take a photo'), 'turned after the end: the numbers were lost'); say(kept.cw === 1180 && kept.ch === 745, `turned after the end: the picture is ${kept.cw} × ${kept.ch}`);
    await p.click('#again'); await p.waitForTimeout(600); const again = await read(p); say(again.r[0] === '…' && again.photo.startsWith('Please wait'), 'Test again did not start the test again');
    await done(p); say((await read(p)).r.every(t => /^\d+, /.test(t)), 'Test again did not end with numbers');
    say(!p.errs.length, `turned: errors: ${p.errs.slice(0, 3).join(' | ')}`); await p.close(); }

  await b.close();
  console.log(bad.length ? bad.join('\n') : 'The iPad test page starts, ends by itself, fits the screen, asks the network for nothing, and copes with no WebGL 2, a turned iPad and Test again.');
  console.log(bad.length ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(bad.length ? 1 : 0);
})();
