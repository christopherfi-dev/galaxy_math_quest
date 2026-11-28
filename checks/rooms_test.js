// Painted rooms test page check (painted rooms thread, 28 November 2026).
// Run from the repo root:  node checks/rooms_test.js [outdir]
// Serves docs/ itself on a free port. Needs Playwright with Chromium (pre-installed in the cloud sessions).
// Checks: walk maps (every stand point can be reached from every other), the number rule on 10,000 seeds,
// a child's play-through with wrong orders, leaving and coming back, closing and reopening,
// pictures at iPad sideways, iPad upright, phone upright and phone sideways, and measures.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'docs');
const OUT = process.argv[2] || path.join(require('os').tmpdir(), 'gmq_rooms_pictures');   // PNGs; pass a folder to keep them
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript' };
const server = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (f.endsWith('/')) f += 'index.html';
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
});
let fails = 0;
function ok(c, msg) { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) fails++; }

(async () => {
  await new Promise(r => server.listen(0, r));
  const URL = 'http://localhost:' + server.address().port + '/rooms/';
  const browser = await chromium.launch();

  // ---------- 1. walk maps and the number rule ----------
  {
    const p = await browser.newPage({ viewport: { width: 1180, height: 745 } });
    await p.goto(URL + '?seed=1'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const G = GMQRooms, out = [];
      for (const id in G.ROOMS) {
        const R = G.ROOMS[id], pts = [['start', [R.start.x, R.start.y]]];
        R.spots.forEach(s => { pts.push([s.id, s.stand]); }); for (const o in G.ROOMS) G.ROOMS[o].spots.forEach(s => { if (s.exit && s.exit.to === id) pts.push([o + '>' + s.id + '.walkIn', s.exit.walkIn], [o + '>' + s.id + '.enter', s.exit.enter]); });
        for (const k in G.THINGS) if (G.THINGS[k].room === id) { pts.push([k + '.stand', G.THINGS[k].stand]); pts.push([k + '.foot', [G.THINGS[k].x, G.THINGS[k].y], true]); }
        pts.forEach(([n, q, foot]) => out.push({ id, n, walk: G.walkable(R, q[0], q[1]), foot: !!foot }));
        let unreached = 0;
        pts.forEach(a => pts.forEach(b => { if (!a[2] && !b[2] && !G.findPath(R, a[1], b[1])) unreached++; }));
        out.push({ id, n: 'pairs', unreached });
      }
      let bad = 0; const seen = new Set();
      for (let s = 0; s < 10000; s++) { const t = G.bayTemp(s); seen.add(t); if (!(Number.isInteger(t) && t >= 9 && t <= 17)) bad++; }
      const tq = new Set(); let tbad = 0;
      const orders = new Set();
      for (let s = 0; s < 10000; s++) { const qs = [0, 1, 2].map(i => GMQRooms.tankQuarters(s, i)); orders.add(qs.join('')); qs.forEach(q => tq.add(q)); if (new Set(qs).size !== 3 || qs.some(q => !(q >= 1 && q <= 3))) tbad++; }
      if (orders.size !== 6) tbad++;
      return { out, bad, seen: [...seen].sort((a, b) => a - b), tbad, tq: [...tq].sort() };
    });
    r.out.filter(o => o.n !== 'pairs' && !o.foot).forEach(o => ok(o.walk, `${o.id}: ${o.n} stands on the floor`));
    r.out.filter(o => o.foot).forEach(o => ok(o.walk, `${o.id}: ${o.n} (a thing stands on the floor)`));
    r.out.filter(o => o.n === 'pairs').forEach(o => ok(o.unreached === 0, `${o.id}: every stand point reaches every other (${o.unreached} not)`));
    ok(r.tbad === 0 && r.tq.length === 3, `tank gauges on 10,000 seeds: 1, 2 and 3 quarters full, three different tanks, all six orders used`);
    ok(r.bad === 0 && r.seen.length === 9, `bay temperature on 10,000 seeds: whole numbers 9 to 17, all nine used (${r.seen.join(',')})`);
    await p.close();
  }

  // ---------- 2. a child's play-through, with pictures ----------
  async function play(vp, tag, opts = {}) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    let bytes = 0; p.on('response', async res => { try { const b = await res.body(); bytes += b.length; } catch (e) {} });
    await p.goto(URL + '?seed=7'); await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForLoadState('networkidle'); await p.waitForTimeout(400);
    bytes = 0; await p.reload(); await p.waitForLoadState('networkidle'); await p.waitForTimeout(600);
    const loadBytes = await p.evaluate(() => performance.getEntriesByType('resource').concat(performance.getEntriesByType('navigation')).reduce((a, e) => a + (e.transferSize || e.encodedBodySize || 0), 0));
    const idle = async () => { await p.waitForFunction(() => !GMQRooms.walking && !GMQRooms.busy, null, { timeout: 15000 }); await p.waitForTimeout(80); };
    const tap = async (x, y) => {
      const b = await p.evaluate(() => { const r = document.getElementById('stage').getBoundingClientRect(); return [r.left, r.top, r.width / 2000]; });
      await p.mouse.click(b[0] + x * b[2], b[1] + y * b[2]); await p.waitForTimeout(60); await idle();
    };
    const said = () => p.textContent('#say');
    const btn = async (re) => { const l = p.locator('#acts button', { hasText: re }); if (!(await l.count())) return false; await l.first().click(); await p.waitForTimeout(60); await idle(); return true; };
    const shot = async (n) => { if (opts.shots) await p.screenshot({ path: path.join(OUT, `${tag}_${n}.png`) }); };
    const st = () => p.evaluate(() => JSON.parse(JSON.stringify(GMQRooms.state)));

    await shot('1_dark_start');
    await tap(1420, 600);                                             // the robot, before you have a battery
    ok(/battery is flat/.test(await said()), `${tag}: the sleeping robot says its battery is flat`);
    ok(!(await p.locator('#acts button', { hasText: /battery/ }).count()), `${tag}: no "give" button without the battery`);
    await tap(1180, 900);                                             // walk about: frame timing while walking
    await p.evaluate(() => { GMQRooms.frameTimes.length = 0; GMQRooms.workTimes.length = 0; });
    await tap(400, 900); await tap(1500, 600);
    const frames = await p.evaluate(() => GMQRooms.frameTimes.slice()); const work = await p.evaluate(() => GMQRooms.workTimes.slice()).then(a => a.sort((x, y) => x - y));
    await tap(1200, 290);                                             // the light switch
    ok(/switch/.test(await said()), `${tag}: the switch answers`);
    await btn(/Pull it up/); await p.waitForTimeout(1600);
    ok((await st()).lit, `${tag}: the lights come on`);
    await shot('2_lit');
    await tap(80, 680);                                               // the wall screen with the child's number
    const T = await p.evaluate(() => GMQRooms.bayTemp(7));
    ok(new RegExp(T + ' degrees').test(await said()), `${tag}: the wall screen gives this child's number (seed 7: ${T})`);
    ok((await p.textContent('#readout')) === T + '°', `${tag}: the number drawn on the painted screen matches`);
    await btn(/Look closely/); await shot('3_closeup_number'); await btn(/Step back/);
    await tap(750, 380); await btn(/Open the book/); await shot('4_book');
    ok(/supply ship/i.test(await p.textContent('#pgL')), `${tag}: the book's words come from the game`);
    await btn(/Close the book/);
    await tap(1000, 300);                                             // north: the station door
    ok((await st()).room === 'entry', `${tag}: the station door leads north to the Entry Hall`);
    await shot('5_entry_hall');
    await tap(1330, 250); await btn(/Look closely/);
    ok(/Nok/.test(await p.textContent('#gauge')), `${tag}: the duty board's words come from the game`);
    await shot('6_duty_board'); await btn(/Step back/);
    await tap(660, 300); await btn(/Look in the pockets/);
    ok((await st()).pocket.includes('card'), `${tag}: the key card is in the hanging suit's pocket`);
    await tap(250, 500);                                              // west: the Greenhouse (test only)
    ok((await st()).room === 'greenhouse', `${tag}: the Entry Hall's left doorway leads to the Greenhouse (test only)`);
    await shot('7_greenhouse');
    await tap(700, 560); await btn(/Open the tin/);
    ok(/crumbs/.test(await said()), `${tag}: the tin holds only crumbs`);
    await p.reload(); await p.waitForTimeout(800);                    // close the game and open it again
    let s = await st();
    ok(s.room === 'greenhouse' && s.pocket.includes('card') && s.lit && s.tinOpen, `${tag}: after reopening: same room, the card, the tin open, the lights still on`);
    await tap(1500, 615); await btn(/Take the battery/);
    ok((await st()).pocket.includes('battery'), `${tag}: the battery is taken`);
    await tap(1750, 500);
    ok((await st()).room === 'entry', `${tag}: the Greenhouse's right doorway leads back to the Entry Hall`);
    await tap(1000, 960);                                             // south: the walkway between the wall ends
    ok((await st()).room === 'docking', `${tag}: the Entry Hall's south gap leads to the Docking Bay`);
    s = await st();
    await tap(s.rx, s.ry - 50); await btn(/Give it the battery/);
    ok((await st()).robotAwake && !(await st()).pocket.includes('battery'), `${tag}: the robot wakes and the battery is used`);
    await tap(1720, 600);                                             // east: the Hangar
    s = await st();
    ok(s.room === 'hangar' && s.robotRoom === 'hangar', `${tag}: the archway leads east to the Hangar, and the robot comes too`);
    await p.waitForTimeout(1200); await shot('8_hangar');
    await tap(1200, 330); await btn(/Look closely/);
    const q = await p.evaluate(() => [0, 1, 2].map(i => document.querySelectorAll('#gauge svg')[i] ? 1 : 0).reduce((a, b) => a + b, 0));
    ok(q === 3, `${tag}: the three gauges are drawn by the game in the close-up`);
    await shot('9_tanks'); await btn(/Step back/);
    await tap(540, 540); await btn(/Use the key card/);
    ok(/hello/.test(await said()), `${tag}: the key card wakes the launch console`);
    await tap(800, 900); await p.waitForTimeout(1200);                // the robot follows
    s = await st();
    ok(Math.hypot(s.rx - s.x, s.ry - s.y) < 260, `${tag}: the robot follows the cadet (${Math.round(Math.hypot(s.rx - s.x, s.ry - s.y))} away)`);
    await tap(1000, 1060);                                            // a tap on the bar does nothing
    ok(Math.abs((await st()).y - s.y) < 1, `${tag}: a tap on the game's bar does not move the cadet`);
    await tap(400, 985);
    ok((await st()).y < 990, `${tag}: the cadet never walks into the bar`);
    ok(errs.length === 0, `${tag}: no errors in the console${errs.length ? ': ' + errs.join(' | ') : ''}`);

    const cdp = await ctx.newCDPSession(p); await cdp.send('Performance.enable');
    const m = (await cdp.send('Performance.getMetrics')).metrics.reduce((a, x) => (a[x.name] = x.value, a), {});
    await ctx.close();
    frames.sort((a, b) => a - b);
    const pp = await (async () => 0)();
    return { work: work, loadBytes, heapMB: m.JSHeapUsedSize / 1048576, med: frames[Math.floor(frames.length / 2)], p95: frames[Math.floor(frames.length * 0.95)], n: frames.length };
  }

  const sizes = [['ipad_sideways', { width: 1180, height: 745 }], ['ipad_upright', { width: 820, height: 1180 }], ['phone_upright', { width: 390, height: 844 }], ['phone_sideways', { width: 844, height: 390 }]];
  const meas = {};
  for (const [tag, vp] of sizes) meas[tag] = await play(vp, tag, { shots: true });
  console.log('\nMEASURES (Chromium on Linux, not an iPad):');
  for (const k in meas) { const m = meas[k]; console.log(`  ${k}: first load ${(m.loadBytes / 1024).toFixed(0)} KB; JS heap ${m.heapMB.toFixed(1)} MB; frame while walking: median ${m.med.toFixed(1)} ms, 95th ${m.p95.toFixed(1)} ms (${m.n} frames); the page's own work in a frame: median ${m.work[Math.floor(m.work.length/2)].toFixed(2)} ms, slowest ${m.work[m.work.length-1].toFixed(2)} ms`); }
  // a 2x screen picks the big pictures
  {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 745 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage(); let bytes = 0;
    p.on('response', async res => { try { bytes += (await res.body()).length; } catch (e) {} });
    await p.goto(URL + '?seed=7'); await p.waitForLoadState('networkidle'); await p.waitForTimeout(500);
    const src = await p.evaluate(() => document.querySelector('.room .bg').getAttribute('src'));
    bytes = await p.evaluate(() => performance.getEntriesByType('resource').concat(performance.getEntriesByType('navigation')).reduce((a, e) => a + (e.transferSize || e.encodedBodySize || 0), 0));
    console.log(`  ipad_sideways at 2x: first load ${(bytes / 1024).toFixed(0)} KB; picture ${src}`);
    ok(/2360/.test(src), 'a 2x iPad screen gets the 2360-wide pictures');
    await p.screenshot({ path: path.join(OUT, 'ipad_sideways_2x_start.png') });
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
  process.exit(fails ? 1 : 0);
})();
