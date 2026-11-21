// Fuel Calculation (station task 2-1, Navigation): two ways to Voltara; the fuel after every leg; land with at least 10 units.
// [Marc, 2026-11-21, agreed: proposals/GMQ_Station_Story_v2_2026-11-21.md, item 13]
//   For 10,000 cadets, with the game's own rule:
//     - exactly one way lands with at least 10 units, so the child must work out both to know which
//     - no amount on the way is below 1 or above 199 (no negative numbers, and sums a Grade 3 child can write)
//     - no landing is 9, 10 or 11, so "at least 10" never reads two ways
//     - each amount follows from the one before (the tank, the legs, the refuel)
//     - how often each way is the right one, how many fall back to the fixed plan, and how many sums need regrouping
// Run: node checks/fuel_route_check.js
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../prototypes/kis_station_sketch.html')); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); const bad = [], n = { rocks: 0, moon: 0, fall: 0, regroup: 0, steps: 0 };
    for (let i = 0; i < 10000; i++) { S.seed = 11 + i * 7919; const F = fuelPlan(); if (F.T === 80 && F.a1 === 30 && F.b3 === 30) n.fall++;
      const R1 = [F.T - F.a1, F.T - F.a1 - F.a2], R2 = [F.T - F.b1, F.T - F.b1 + F.r, F.T - F.b1 + F.r - F.b2, F.T - F.b1 + F.r - F.b2 - F.b3];
      if (R1.join() !== F.R1.join() || R2.join() !== F.R2.join()) bad.push('an amount does not follow');
      if (R1.concat(R2).some(v => v < 1 || v > 199)) bad.push('an amount out of range');
      const ok1 = R1[1] >= 10, ok2 = R2[3] >= 10; if (ok1 === ok2) bad.push('not exactly one way'); if ((ok1 ? 'rocks' : 'moon') !== F.best) bad.push('the best way is wrong');
      if ([R1[1], R2[3]].some(v => v >= 9 && v <= 11)) bad.push('a landing at 9, 10 or 11'); n[F.best]++;
      [[F.T, F.a1], [R1[0], F.a2], [F.T, F.b1], [R2[1], F.b2], [R2[2], F.b3]].forEach(([x, y]) => { n.steps++; if (x % 10 < y % 10) n.regroup++; }); if (R2[0] % 10 + F.r % 10 >= 10) n.regroup++; n.steps++; }
    return { bad: [...new Set(bad)], n }; });
  console.log(`10,000 cadets: rocks is right for ${r.n.rocks}, the moon for ${r.n.moon}; ${r.n.fall} on the fixed plan; ${Math.round(100 * r.n.regroup / r.n.steps)}% of the sums need regrouping`);
  if (r.bad.length || errs.length) { console.log('PROBLEMS: ' + r.bad.concat(errs).slice(0, 8).join(' | ')); console.log('RESULT: FAIL'); process.exitCode = 1; } else console.log('RESULT: PASS');
  await b.close(); })();
