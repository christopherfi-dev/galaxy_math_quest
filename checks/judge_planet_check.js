// Judge a planet (Project Second Home: the probe's three planets). [Marc, 2026-11-21, agreed: decision 16, the second tool]
//   For 10,000 cadets, with the game's own rule:
//     - exactly one of the three planets fits what people need in all three facts; each other planet fails at least one
//     - no fact sits on a limit (30 °C, 18 or 30 hours, 3 parts of water), so no mark reads two ways; no temperature below zero
//     - the day to round is never exactly halfway between two tens; three different names
//     - how often each fact is the one that fails, so no single fact always decides
// Run: node checks/judge_planet_check.js
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../prototypes/kis_station_sketch.html')); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); const bad = [], fail = { t: 0, d: 0, w: 0 }; let fall = 0, pos = [0, 0, 0];
    for (let i = 0; i < 10000; i++) { const J = jMake(5 + i * 31); if (J.ps[0].n === 'Kessa' && J.ps[0].t === 14 && J.ps[2].n === 'Tandul') fall++;
      const ok = J.ps.map(P => ['t', 'd', 'w'].every(k => jFit(P, k))); if (ok.filter(Boolean).length !== 1 || !ok[J.best]) bad.push('not exactly one planet fits'); pos[J.best]++;
      if (new Set(J.ps.map(P => P.n)).size !== 3) bad.push('two planets share a name');
      J.ps.forEach(P => { if (P.t === 30 || P.d === 18 || P.d === 30 || P.w === 3) bad.push('a fact on a limit'); if (P.t < 0) bad.push('below zero'); if (P.w < 0 || P.w > 10) bad.push('water out of range'); });
      if (J.ps[J.best].d % 10 === 5) bad.push('the day to round is halfway');
      J.ps.forEach((P, k) => { if (k !== J.best) ['t', 'd', 'w'].forEach(f => { if (!jFit(P, f)) fail[f]++; }); }); }
    return { bad: [...new Set(bad)], fall, fail, pos }; });
  console.log(`10,000 cadets: the right planet is first ${r.pos[0]}, second ${r.pos[1]}, third ${r.pos[2]} times; failing facts: temperature ${r.fail.t}, day ${r.fail.d}, water ${r.fail.w}; ${r.fall} on the fixed set`);
  if (r.bad.length || errs.length) { console.log('PROBLEMS: ' + r.bad.concat(errs).slice(0, 8).join(' | ')); console.log('RESULT: FAIL'); process.exitCode = 1; } else console.log('RESULT: PASS');
  await b.close(); })();
