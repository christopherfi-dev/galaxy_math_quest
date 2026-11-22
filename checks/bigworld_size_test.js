// The size test page for the big world (docs/bigworld/size_test.html).   [Handoff: HANDOFF_Big_World_2026-11-22.md, Phase 0]
//
// It checks, on three screens (iPad sideways 1180 x 745, iPad upright 820 x 1180, a phone 390 x 760):
//   - the page starts with no error and asks the network for nothing
//   - each map (100, 200, 300 squares a side) builds, the astronaut walks by itself and the map scrolls
//   - only the squares on screen are drawn: the count stays the same whatever the size of the map
//   - the result line and the buttons are on the screen; nothing spills sideways
//   - "Test all three" ends by itself and fills the table
// It PRINTS the times on this machine. They are a first guide only: this machine draws in software.
// Speed that matters comes from a real iPad, read from the screen by Marc.
//
// Run:  node checks/bigworld_size_test.js [--full]     (--full also runs the 45 second "Test all three")
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'docs', 'bigworld', 'size_test.html');
const FULL = process.argv.includes('--full'), SHOT = process.argv.includes('--shots');
(async () => {
  const b = await chromium.launch(), bad = [], say = (ok, what) => { if (!ok) bad.push(what); };
  const rows = [];
  for (const [w, h, name] of [[1180, 745, 'iPad sideways'], [820, 1180, 'iPad upright'], [390, 760, 'phone']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }), errs = [], reqs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('request', r => reqs.push(r.url()));
    await p.goto(URL);
    let drawnFirst = null;
    for (const n of [100, 200, 300]) {
      await p.click(`[data-n="${n}"]`);
      const a = await p.evaluate(() => ({ x: P.px, y: P.py, cx: cam.x, cy: cam.y }));
      await p.waitForFunction(() => window.__bwSize && window.__bwSize.N === N && window.__bwSize.n >= 150, null, { timeout: 30000 });
      const s = await p.evaluate(() => ({ ...window.__bwSize, px: P.px, py: P.py, camx: cam.x, camy: cam.y, seen: seen.reduce((t, v) => t + v, 0), route: P.route.length }));
      say(s.N === n, `${name}: asked for ${n}, got ${s.N}`);
      say(Math.hypot(s.px - a.x, s.py - a.y) > 2, `${name} ${n}: the astronaut did not walk`);
      say(Math.hypot(s.camx - a.cx, s.camy - a.cy) > 1, `${name} ${n}: the map did not scroll`);
      say(s.seen > 100, `${name} ${n}: the mist did not lift`);
      if (drawnFirst === null) drawnFirst = s.drawn; say(Math.abs(s.drawn - drawnFirst) <= drawnFirst * .15, `${name} ${n}: squares drawn changed with the map size (${drawnFirst} then ${s.drawn})`);
      say(s.drawn < 700, `${name} ${n}: ${s.drawn} squares drawn each frame is too many`);
      rows.push([name, n, s.fps.toFixed(0), s.avg.toFixed(2), s.worst.toFixed(1), s.pathMs.toFixed(1), s.drawn]);
    }
    const lay = await p.evaluate(() => { const r = id => { const q = document.getElementById(id).getBoundingClientRect(); return [q.top, q.bottom, q.left, q.right]; }; return { iw: innerWidth, ih: innerHeight, sw: document.scrollingElement.scrollWidth, sh: document.scrollingElement.scrollHeight, res: r('res'), btn: r('runall'), cvh: document.getElementById('cv').clientHeight }; });
    say(lay.sw <= lay.iw, `${name}: the page spills sideways`); say(lay.sh <= lay.ih, `${name}: the page scrolls`);
    say(lay.res[1] <= lay.ih && lay.btn[1] <= lay.ih && lay.btn[3] <= lay.iw, `${name}: the result or the button is off the screen`);
    say(lay.cvh >= lay.ih * .45, `${name}: the map has under half the screen (${lay.cvh} of ${lay.ih})`);
    if (SHOT) await p.screenshot({ path: path.resolve(process.argv[process.argv.indexOf('--shots') + 1] || '.', `size_test_${w}x${h}.png`) });
    if (FULL && w === 1180) { await p.click('#runall'); await p.waitForFunction(() => window.__bwDone === true, null, { timeout: 70000 }); const t = await p.evaluate(() => document.getElementById('tbl').rows.length); say(t === 4, `"Test all three" did not fill its table (${t} rows)`); }
    say(!errs.length, `${name}: errors: ${errs.join(' | ')}`);
    say(reqs.every(u => u === URL), `${name}: the page asked the network for something: ${reqs.filter(u => u !== URL).join(', ')}`);
    await p.close();
  }
  await b.close();
  console.log('screen | map | frames a second | draw ms usual | draw ms slowest | path ms | squares drawn');
  for (const r of rows) console.log(r.join(' | '));
  console.log('(These times are from this machine, which draws in software. Real speed comes from a real iPad.)');
  console.log(bad.length ? 'FAILED:\n  ' + bad.join('\n  ') : `ok: the size test page works on three screens, three map sizes${FULL ? ', and "Test all three" ends by itself' : ''}`);
  process.exit(bad.length ? 1 : 0);
})();
