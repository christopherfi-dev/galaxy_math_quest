// Weapons Coding (station task 4-1): light every odd number on the cannons' lock; the odd numbers inside it make a V, for Voltara.
// [Marc, 2026-11-21, agreed: proposals/GMQ_Station_Story_v2_2026-11-21.md, item 13]
//   For 10,000 cadets, with the game's own rule:
//     - 36 different numbers, from 1 to 999
//     - every cell of the V is odd; exactly 4 odd numbers sit outside it (so guessing the shape is not enough); every other number is even
//     - each screen mixes one-, two- and three-digit numbers, so the child must look at the last digit
// Run: node checks/weapons_code_check.js
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../prototypes/kis_station_sketch.html')); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); const bad = [], d = [0, 0, 0];
    for (let i = 0; i < 10000; i++) { S.seed = 3 + i * 6007; const C = wcodeMake(), N = C.nums;
      if (N.length !== 36 || new Set(N).size !== 36) bad.push('not 36 different numbers'); if (N.some(n => n < 1 || n > 999)) bad.push('a number out of range');
      if (WCV.some(i => N[i] % 2 === 0)) bad.push('an even number in the V'); const out = N.filter((n, i) => n % 2 === 1 && !WCV.includes(i)).length; if (out !== 4) bad.push(out + ' odd numbers outside the V');
      const L = N.map(n => String(n).length); [1, 2, 3].forEach(k => { if (!L.includes(k)) bad.push('no ' + k + '-digit numbers'); else d[k - 1] += L.filter(x => x === k).length; }); }
    return { bad: [...new Set(bad)], d }; });
  console.log(`10,000 screens of 36: ${r.d.map((n, i) => `${Math.round(n / 3600)}% ${i + 1}-digit`).join(', ')}`);
  if (r.bad.length || errs.length) { console.log('PROBLEMS: ' + r.bad.concat(errs).slice(0, 8).join(' | ')); console.log('RESULT: FAIL'); process.exitCode = 1; } else console.log('RESULT: PASS');
  await b.close(); })();
