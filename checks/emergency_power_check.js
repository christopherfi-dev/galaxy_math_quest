// Emergency Power (station task 5-3, Power Module): read the cells, then send an exact amount, breaking blocks to make it. Two rounds.
// [Marc, 2026-11-21, agreed: proposals/GMQ_Station_Story_v2_2026-11-21.md, item 13]
//   For 10,000 cadets, with the game's own number rules:
//     ROUND 1: the amount for life support is less than the cells hold; it CANNOT be made without breaking a ten (worked out by trying every way);
//              it CAN be made by breaking one ten, without breaking a hundred
//     ROUND 2, after a child plays round 1 the plain way (one ten broken): the amount for the air pumps is from 10 to what is left, and it
//              cannot be made without breaking a hundred
//     ROUND 2, after a child plays round 1 a strange way (extra blocks broken, picked at random): the amount still fits what is left
// Run: node checks/emergency_power_check.js
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../prototypes/kis_station_sketch.html')); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); const bad = [], val = b => b.h * 100 + b.t * 10 + b.o;
    /* can `need` be made from blocks {h,t,o}, breaking tens only if bt, hundreds only if bh? Breaking only ever helps, so try the most breaking allowed. */
    const can = (st, need, bt, bh) => { for (let h = 0; h <= st.h; h++) { const rest = need - 100 * h; if (rest < 0) break; const T = st.t + (bh ? (st.h - h) * 10 : 0);
        for (let t = 0; t <= T; t++) { const o = rest - 10 * t; if (o < 0) break; const O = st.o + (bt ? (T - t) * 10 : 0); if (o <= O) return true; } } return false; };
    let r2hund = 0, r2fall = 0, weird = 0;
    for (let i = 0; i < 10000; i++) { S.seed = 7 + i * 104729; const E = empRound1(), st = E.store, v = val(st);
      if (!(E.need > 0 && E.need < v)) bad.push('round 1: need not below what the cells hold');
      if (can(st, E.need, false, false)) bad.push('round 1: can be made without breaking'); if (!can(st, E.need, true, false)) bad.push('round 1: cannot be made by breaking tens only');
      /* the plain way: break one ten, move exactly the need */
      const a = Math.floor(E.need / 100), bb = Math.floor(E.need / 10) % 10, c = E.need % 10, left = { h: st.h - a, t: st.t - 1 - bb, o: st.o + 10 - c };
      if (left.h < 0 || left.t < 0 || left.o < 0 || val(left) !== v - E.need) bad.push('round 1: the plain way does not work');
      const R = empRound2(left); if (R.need < 10 || R.need > val(left)) bad.push('round 2: need out of range ' + R.need + ' of ' + val(left));
      if (!can(left, R.need, true, true)) bad.push('round 2: cannot be made');
      if (can(left, R.need, true, false)) r2fall++; else r2hund++;
      /* a strange way: break 0 to 3 extra blocks at random first */
      const odd = { ...st }; for (let k = rnd(4); k > 0; k--) { if (odd.h && rnd(2)) { odd.h--; odd.t += 10; } else if (odd.t) { odd.t--; odd.o += 10; } }
      let need = E.need; const mv = { h: 0, t: 0, o: 0 }; for (const k of ['h', 't', 'o']) { const u = { h: 100, t: 10, o: 1 }[k], n = Math.min(odd[k], Math.floor(need / u)); mv[k] = n; need -= n * u; }
      if (need === 0) { const l2 = { h: odd.h - mv.h, t: odd.t - mv.t, o: odd.o - mv.o }, R2 = empRound2(l2); weird++; if (R2.need < 10 || R2.need > val(l2) || !can(l2, R2.need, true, true)) bad.push('round 2 after a strange round 1: does not fit'); } }
    return { bad: [...new Set(bad)], r2hund, r2fall, weird }; });
  console.log(`10,000 cadets. Round 2 needs a hundred broken for ${r.r2hund}; for ${r.r2fall} it does not (they would need to have broken extra blocks). ${r.weird} strange round 1s checked.`);
  if (r.bad.length || errs.length) { console.log('PROBLEMS: ' + r.bad.concat(errs).slice(0, 8).join(' | ')); console.log('RESULT: FAIL'); process.exitCode = 1; } else console.log('RESULT: PASS');
  await b.close(); })();
