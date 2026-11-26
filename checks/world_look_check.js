// The new look for the maps seen from above (prototypes/world_look_kit.js), checked on its sample page.   [Proposal, 24 November 2026]
// Note: proposals/GMQ_World_Look_v1_2026-11-24.md
//
// The new look rounds the edges between land and water. That must never make a square look like what it is not.
// For EVERY square of the whole map (128 x 96), it paints the ground with the kit and reads the colour at the middle of the square:
//   - a water square (~) must look like water (blue), and
//   - every other square (land, sand, path, bridge...) must not.
// It also checks: the kit leaves walking alone (every square walks the same with the new look on and off); the top bar is the big world's own
// (no button added there: on a phone a taller bar took taps meant for the ground); no page errors; nothing asked of the network but the fonts.
// Run:  node checks/world_look_check.js [page]      (default: prototypes/world_look_sample.html)
const { chromium } = require('playwright'); const path = require('path');
const FILE = process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'world_look_sample.html');
(async () => {
  const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 1180, height: 745 } })).newPage(), errs = [], reqs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('request', r => { if (!/^file:|^data:|fonts\.(googleapis|gstatic)\.com/.test(r.url())) reqs.push(r.url()); });
  await p.goto('file://' + path.resolve(FILE) + '?seed=7&fastread=1'); await p.waitForFunction(() => window.__bw && window.__bw.S());
  const r = await p.evaluate(() => { const ts = 40, CH = 8, bad = [], c = document.createElement('canvas'); c.width = c.height = CH * ts + 2; const g = c.getContext('2d', { willReadFrequently: true });
    let n = 0; for (let by = 0; by < MAPH / CH; by++) for (let bx = 0; bx < MAPW / CH; bx++) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); WL.paint(g, bx * CH, by * CH, ts); const d = g.getImageData(0, 0, CH * ts, CH * ts).data;
      for (let j = 0; j < CH; j++) for (let i = 0; i < CH; i++) { const x = bx * CH + i, y = by * CH + j, o = ((j * ts + ts / 2) * CH * ts + (i * ts + ts / 2)) * 4, R = d[o], G = d[o + 1], B = d[o + 2], blue = B > G && B > R + 40, water = MAP[y][x] === '~'; n++;
        if (blue !== water && bad.length < 20) bad.push(`(${x},${y}) '${MAP[y][x]}' looks ${blue ? 'like water' : 'like land'}: rgb(${R},${G},${B})`); } }
    return { n, bad, on: WL.on }; });
  // walking with the look off: switch, and compare every square
  const before = await p.evaluate(() => { const o = []; for (let y = 0; y < MAPH; y++) for (let x = 0; x < MAPW; x++) o.push(walkable(x, y) ? 1 : 0); return o.join(''); });
  const off = await p.evaluate(() => { WL.toggle(); return WL.on; });      /* what "Look: old" on the Ship panel does */
  const after = await p.evaluate(() => { const o = []; for (let y = 0; y < MAPH; y++) for (let x = 0; x < MAPW; x++) o.push(walkable(x, y) ? 1 : 0); return o.join(''); });
  await p.evaluate(() => WL.toggle());
  // Elder Thimble and Pim: their pictures load (the page's safety rule lets pictures held in the page through), and they draw in place of the old drawing
  await p.waitForTimeout(400);
  const cast = await p.evaluate(() => ({ loaded: ['elder', 'pim', 'mender'].every(c => CAST_SPRITES[c] && Object.keys(CAST_SPRITES[c].frames).length >= 5) && Object.keys(CAST_SPRITES).every(c => CAST_SPRITES[c].frames.idle),      /* the Rillfolk have 1 to 5 faces (25 November) */ drawsElder: CAST.draw('elder', 100, 200, 50), drawsPim: CAST.draw('pim', 200, 200, 50),
    faces: ['One machine ate some of our pips! We do not dare to use them.', 'I lost my spinner by the pond. It is red. Have you seen it?', 'Push the old post, and the stones come up. Shh!'].map((t, i) => CAST.faceFor(i ? 'pim' : 'elder', t)).join(',') }));
  const faults = [];
  if (!cast.loaded || !cast.drawsElder || !cast.drawsPim) faults.push('Elder Thimble and Pim do not draw: ' + JSON.stringify(cast));
  if (cast.faces !== 'worried,sad,secret') faults.push('the faces do not follow the words: ' + cast.faces);
  if (r.bad.length) faults.push(...r.bad.map(s => 'square ' + s));
  if (!r.on) faults.push('the new look was not on at the start');
  if (off) faults.push('Look: old did not switch the look off');
  const bar = await p.evaluate(() => Array.from(document.querySelectorAll('#hud button')).map(b => b.id).join(','));
  if (bar !== 'b_map,b_needs,b_ship,b_mus') faults.push('the top bar has changed: ' + bar);
  if (before !== after) faults.push('walking changed when the look was switched');
  if (errs.length) faults.push('page errors: ' + errs.join(' | '));
  if (reqs.length) faults.push('asked the network for: ' + reqs.join(', '));
  console.log(`world look: ${r.n} squares painted and read; water looks like water and land like land` + (r.bad.length ? ' — NOT ALWAYS' : ''));
  faults.forEach(f => console.log('  FAULT: ' + f));
  console.log(faults.length ? `world_look_check: ${faults.length} FAULT(S)` : 'world_look_check: all pass');
  await b.close(); process.exit(faults.length ? 1 : 0);
})();
