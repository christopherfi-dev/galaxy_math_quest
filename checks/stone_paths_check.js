// Stone paths on Xylophora (a side job after the colony stands): join the Home, the Hospital and the Food Store; grass 3 stones, mud 5.
// [Marc, 2026-11-21, agreed: decisions 16 and 19]
//   For 3,000 cadets, each with floors placed at random on the building ground (as a child might place them), with the game's own rules:
//     - the stones carried are always enough: a network made of three cheapest paths to one meeting square is joined and costs no more than that
//     - a careless network is never enough: stones on every free square cost more than is carried
//     - "joined" is right: a network missing one building is not joined; the plan's own network is
// Run: node checks/stone_paths_check.js
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../prototypes/kis_station_sketch.html')); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); const bad = [], g = XR.ground; let n = 0, slack = 0, unreach = 0;
    for (let i = 0; i < 3000; i++) { S.xy = null; const c = XY(); c.seed = 1 + i * 37; const R = wrng(i * 7 + 3); c.fl = {};
      for (const b of XPB) { for (let t = 0; t < 200; t++) { const w = 2 + Math.floor(R() * 4), h = 2 + Math.floor(R() * 3), x = g[0] + Math.floor(R() * (g[2] - w + 1)), y = g[1] + Math.floor(R() * (g[3] - h + 1)), f = [x, y, w, h];
          if (!XPB.some(o => c.fl[o] && x < c.fl[o][0] + c.fl[o][2] && c.fl[o][0] < x + w && y < c.fl[o][1] + c.fl[o][3] && c.fl[o][1] < y + h)) { c.fl[b] = f; break; } } }
      const P = xpPlan(), mud = new Set(P.mud), cells = xpCells(), cost = k => mud.has(k) ? XPM : XPG;
      if (!isFinite(P.best)) { unreach++; continue; } n++; if (P.carry < P.best) bad.push('carry below the best');
      const all = new Set(cells.map(q => q.join())), allCost = [...all].reduce((s, k) => s + cost(k), 0); if (allCost <= P.carry) bad.push('stones everywhere would be enough');
      /* rebuild the planner's network: three cheapest paths to the best meeting square */
      const free = all, dist = b => { const d = new Map(), prev = new Map(), q = []; cells.forEach(([x, y]) => { if (xpTouch(b, x, y)) { const k = x + ',' + y; d.set(k, cost(k)); q.push(k); } });
        while (q.length) { q.sort((a, z) => d.get(a) - d.get(z)); const k = q.shift(), [x, y] = k.split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const m = (x + dx) + ',' + (y + dy); if (!free.has(m)) return; const nd = d.get(k) + cost(m); if (!d.has(m) || nd < d.get(m)) { d.set(m, nd); prev.set(m, k); q.push(m); } }); } return { d, prev }; };
      const D = XPB.map(dist); let bestK = null, best = Infinity; free.forEach(k => { if (D.every(x => x.d.has(k))) { const v = D[0].d.get(k) + D[1].d.get(k) + D[2].d.get(k) - 2 * cost(k); if (v < best) { best = v; bestK = k; } } });
      const net = new Set(); D.forEach(x => { let k = bestK; while (k) { net.add(k); k = x.prev.get(k); } }); const nc = [...net].reduce((s, k) => s + cost(k), 0);
      if (xpJoined(net).length !== 3) bad.push('the planner network is not joined'); if (nc > P.carry) bad.push('the planner network costs more than carried');
      slack += P.carry - nc;
      const one = new Set([...net].filter(k => { const [x, y] = k.split(',').map(Number); return !xpTouch('store', x, y); })); if (!xpFloorsTouch('store', 'home') && !xpFloorsTouch('store', 'hosp') && xpJoined(one).length === 3 && ![...one].some(k => { const [x, y] = k.split(',').map(Number); return xpTouch('store', x, y); })) bad.push('joined without touching the Food Store'); }
    return { bad: [...new Set(bad)], n, unreach, slack: n ? (slack / n).toFixed(1) : 0 }; });
  console.log(`${r.n} layouts checked (${r.unreach} with a building walled off, skipped by the game); on average a good network leaves ${r.slack} stones spare`);
  if (r.bad.length || errs.length) { console.log('PROBLEMS: ' + r.bad.concat(errs).slice(0, 8).join(' | ')); console.log('RESULT: FAIL'); process.exitCode = 1; } else console.log('RESULT: PASS');
  await b.close(); })();
