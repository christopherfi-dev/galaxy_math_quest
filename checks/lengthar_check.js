// Planet Lengthar's numbers, on 20,000 cadets: the game's own rule (lNums), run in the game's own page.   [Proposal]
// Design: proposals/GMQ_Lengthar_Design_v2_2026-11-22.md, section 5. Lengths are in HALF centimetres (15 means 7½ cm).
//
// For every cadet it checks:
//   - a rule was found (no cadet is left without numbers)
//   - eight lengths, all inside one window of five neighbouring half centimetres, from 3 cm to 12 cm
//   - one most common length (no tie), at least three different lengths, at least one whole and one half
//   - the first four things end exactly on a mark; the last four end exactly 1 mm before or after one (never between two marks)
//   - eight different things
//   - the plot's question has one answer: the most common length, or a count from 1 to 7 of things LONGER than a whole length inside the window
//   - the finished example's length is not one of the cadet's lengths, nor next to one
//   - the Guardian: three crystals from 3½ to 12 cm; it lies at least once and tells the truth at least once; a lie is ½ or 1 cm off, never 0
//   - where the ruler starts: never at 0, so the cadet must slide it
//   - the rod asks for ¼ and ¾, in one order or the other
//
// Run:  node checks/lengthar_check.js     Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(), p = await b.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const bad = [], seen = { most: 0, longer: 0, w0: new Set(), lie: 0, truth: 0 };
    for (let seed = 1; seed <= 20000; seed++) {
      const v = lNums(seed); if (!v) { bad.push(seed + ': no numbers'); continue; }
      const f = m => bad.length < 30 && bad.push(`${seed}: ${m}`);
      if (v.L.length !== 8) f('not eight lengths');
      if (v.w0 < 6 || v.w0 + 4 > 24) f('window out of 3 to 12 cm: ' + v.w0);
      if (v.L.some(x => x < v.w0 || x > v.w0 + 4)) f('a length outside the window');
      const cnt = [0, 1, 2, 3, 4].map(k => v.L.filter(x => x === v.w0 + k).length), mx = Math.max(...cnt);
      if (cnt.filter(c => c === mx).length !== 1) f('a tie for most common');
      if (cnt.filter(c => c > 0).length < 3) f('fewer than three different lengths');
      if (!v.L.some(x => x % 2 === 0) || !v.L.some(x => x % 2 === 1)) f('no whole or no half');
      if (v.off.slice(0, 4).some(o => o !== 0) || v.off.slice(4).some(o => Math.abs(o) !== 1)) f('the ends: ' + v.off.join());
      if (new Set(v.names.map(n => n[0])).size !== 8) f('two things alike');
      if (v.q.kind === 'most') { if (v.q.ans !== v.w0 + cnt.indexOf(mx)) f('most common answer wrong'); seen.most++; }
      else { if (v.q.th % 2 || v.q.th <= v.w0 || v.q.th >= v.w0 + 4) f('threshold not a whole length inside the window'); const a = v.L.filter(x => x > v.q.th).length; if (a !== v.q.ans || a < 1 || a > 7) f('longer-than answer'); seen.longer++; }
      if (v.ex >= v.w0 - 1 && v.ex <= v.w0 + 5) f('the example is one of the lengths, or next to one');
      if (v.G.some(g => g < 7 || g > 24)) f('a crystal out of range');
      if (v.tr.every(t => t) || v.tr.every(t => !t)) f('the Guardian never lies, or never tells the truth');
      v.G.forEach((g, i) => { const d = Math.abs(v.claim[i] - g); if (v.tr[i] ? d !== 0 : (d < 1 || d > 2)) f('a claim: ' + g + ' / ' + v.claim[i]); if (v.tr[i]) seen.truth++; else seen.lie++; });
      if (v.start.some(s => s === 0)) f('the ruler starts at the start');
      if (!['1/4,3/4', '3/4,1/4'].includes(v.rodOrder.join())) f('rod order');
      seen.w0.add(v.w0);
    }
    return { bad, most: seen.most, longer: seen.longer, windows: seen.w0.size, lie: seen.lie, truth: seen.truth };
  });
  await b.close();
  console.log(`20,000 cadets. Plot questions: ${r.most} "most common", ${r.longer} "longer than". ${r.windows} different windows. Guardian claims: ${r.truth} true, ${r.lie} false.`);
  for (const x of r.bad) console.log('  PROBLEM', x);
  for (const e of errs) console.log('  PAGE ERROR', e);
  console.log(r.bad.length || errs.length ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(r.bad.length || errs.length ? 1 : 0);
})();
