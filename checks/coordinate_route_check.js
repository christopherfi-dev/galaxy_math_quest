// Coordinate Plotting (station task 2-2, Navigation): the route to the hidden star.  [Source: Marc, 2026-11-21: "you start here... go over this much
// and up this much. A different day you go over and down... we found a hidden star on there somewhere. The goal is for them to mark down where the
// hidden star is on the coordinate plane."]
//   THE DATA, for 10,000 cadets, walked again here day by day:
//     - 4 or 5 days; every move is 1 to 4 along and 1 to 4 up or down, never 0
//     - at least one day goes back (left) and at least one goes down
//     - every point stays on the chart, 1 to 9 each way, and no point is visited twice, so a tap can only mean one day
//     - the end is where the days lead; how many cadets fall back to the one fixed route; how many different stars there are
//   THE HELP, for 1,000 of them: boxes right for k days and then wrong name Day k + 1, where it starts and its move, never the star;
//     a point written the wrong way round, (up, along), is told "along first, then up"
//   CLOSING THE GAME: two taps and Day 1's boxes, a reload; the same route, taps and boxes come back
// Run: node checks/coordinate_route_check.js
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../prototypes/kis_station_sketch.html')); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const bad = [], ends = {}; let fall = 0, helps = 0, swaps = 0; if (S.mode === 'intro') skipIntro();
    for (let i = 0; i < 10000; i++) { S.seed = 1000 + i * 7919; delete S.hopR; const R = hopRoute(); if (R.start.join() === '2,2' && R.end.join() === '9,5') fall++; ends[R.end.join()] = 1;
      let [x, y] = R.start; const seen = [R.start.join()];
      R.days.forEach((d, k) => { if (!d[0] || !d[1] || Math.abs(d[0]) > 4 || Math.abs(d[1]) > 4) bad.push('a move of 0 or more than 4'); x += d[0]; y += d[1];
        if (x < 1 || x > 9 || y < 1 || y > 9) bad.push('off the chart'); if (R.pts[k + 1].join() !== x + ',' + y) bad.push('a point does not follow'); seen.push(x + ',' + y); });
      if (x !== R.end[0] || y !== R.end[1]) bad.push('the end does not follow'); if (new Set(seen).size !== seen.length) bad.push('a point twice');
      if (!R.days.some(d => d[0] < 0) || !R.days.some(d => d[1] < 0)) bad.push('no day back or no day down'); if (R.days.length < 4 || R.days.length > 5) bad.push('days');
      if (i % 10 === 0) { /* the help: the boxes right for k days, then a wrong day; the last tap on the star */ S.hopR = R; delete R.b; const k = i / 10 % R.days.length; startHop(); const w = widget;
        R.b = R.days.map((d, j) => j < k ? R.pts[j + 1].map(String) : ['0', '0']); w.trail.length = 0; w.trail.push(R.end.slice()); $('try').click();
        const t = $('msg').textContent; helps++; if (!t.includes(`Check Day ${k + 1}: from ${k ? `(${R.pts[k].join(', ')})` : `the station at (${R.start.join(', ')})`}, go ${hopWords(R.days[k])}.`)) bad.push('help: ' + t);
        if (t.includes(`(${R.end.join(', ')})`)) bad.push('the help names the star: ' + t);
        const P = R.pts[k + 1]; if (P[0] !== P[1]) { R.b[k] = [String(P[1]), String(P[0])]; $('try').click(); if (!/Coordinates go along first, then up/.test($('msg').textContent)) bad.push('swap: ' + $('msg').textContent); swaps++; }
        closeToy(); } }
    delete S.hopR; return { bad: [...new Set(bad)], fall, ends: Object.keys(ends).length, helps, swaps }; });
  console.log(`10,000 cadets: ${r.ends} different stars, ${r.fall} on the fixed route, ${r.helps} wrong days answered, ${r.swaps} swapped points answered`);
  // closing the game: the route and the taps so far come back
  await p.evaluate(() => { S.seed = 4242; startHop(); }); const pts = await p.evaluate(() => widget.r.pts.slice(1, 3));
  await p.fill('#toy .hopdays input[data-d="0"][data-k="0"]', String(pts[0][0])); await p.fill('#toy .hopdays input[data-d="0"][data-k="1"]', String(pts[0][1]));
  for (const q of pts) await p.click(`#pic [data-t="c:${q[0]},${q[1]}"]`);
  const before = await p.evaluate(() => JSON.stringify([widget.r.start, widget.r.days, widget.trail, [...document.querySelectorAll('#toy .hopdays input')].map(a => a.value)])); await p.reload(); await p.waitForTimeout(400);
  const after = await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); startHop(); return JSON.stringify([widget.r.start, widget.r.days, widget.trail, [...document.querySelectorAll('#toy .hopdays input')].map(a => a.value)]); });
  if (before !== after || !after.includes(JSON.stringify(pts))) r.bad.push('after closing the game: ' + before + ' became ' + after); else console.log('closing the game: the route, 2 taps and the Day 1 boxes come back');
  if (r.bad.length || errs.length) { console.log('PROBLEMS:', r.bad.concat(errs).slice(0, 10).join(' | ')); console.log('RESULT: FAIL'); process.exitCode = 1; } else console.log('RESULT: PASS');
  await b.close(); })();
