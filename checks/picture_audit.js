// Audit of the picture skills in prototypes/kis_station_sketch.html.   [Proposal]
//
// It runs the real game code in a browser and, for every picture rule, makes 10,000 problems.
// For each problem it works the answer out again FROM THE PICTURE DATA ALONE and compares it
// with the answer the game would mark. It also checks every story and every teaching step.
// For clocks it reads the hands back from the drawn picture. For symmetry it reflects the shape.
//
// Run:  node checks/picture_audit.js [folder for a contact sheet]
// Needs Node with Playwright and Chromium. (The other checks in this folder need only Python.)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch(), errs = [];
  const p = await (await b.newContext({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 1 })).newPage();
  p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); } catch (e) {} });
  await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
  await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); });
  const res = await p.evaluate(() => {
    const N = 10000, bad = [], count = {}, note = (r, t) => { if (bad.length < 40) bad.push(r + ': ' + t); };
    const sum = a => a.reduce((x, y) => x + y, 0), near = (a, b) => Math.abs(a - b) < 1e-6;
    // does the line through the middle of pts, at this angle, fold the shape onto itself?
    const folds = (pts, deg) => { const [cx, cy] = centre(pts), a = deg * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a);
      return pts.every(q => { const dx = q[0] - cx, dy = q[1] - cy, d = dx * ux + dy * uy, rx = cx + 2 * d * ux - dx, ry = cy + 2 * d * uy - dy; return pts.some(o => Math.hypot(o[0] - rx, o[1] - ry) < .6); }); };
    const foldCount = pts => { let n = 0; for (let d = 0; d < 180; d += .5) if (folds(pts, d)) n++; return n; };
    const hand = (svg, col, wd) => { const m = svg.match(new RegExp(`<line x1="([\\d.]+)" y1="([\\d.]+)" x2="([\\d.]+)" y2="([\\d.]+)" stroke="${col}" stroke-width="${wd}"`)); const [x1, y1, x2, y2] = m.slice(1).map(Number); return (Math.atan2(x2 - x1, y1 - y2) * 180 / Math.PI + 360) % 360; };
    const readClock = svg => { const ma = hand(svg, PK.white, 3), ha = hand(svg, PK.amber, 5.5), m = Math.round(ma / 6) % 60, h = Math.round((ha - m / 2) / 30) % 12 || 12; return h * 100 + m; };
    const fromGraph = g => { const cats = g.pic.cats || g.pic.rows, step = g.pic.step || g.pic.key, q = g.v.q; if (!cats.every(c => c.n % step === 0 && c.n > 0 && c.n <= (g.pic.top || 8 * step))) return NaN; if (new Set(cats.map(c => c.n)).size !== 4) return NaN;
      if (!q) return cats.find(c => c.name === g.v.cat).n; const inQ = cats.filter(c => q.includes(' ' + c.name + ' ')).sort((x, y) => q.indexOf(' ' + x.name + ' ') - q.indexOf(' ' + y.name + ' ')); if (inQ.length !== 2) return NaN;
      return q.includes('altogether') ? inQ[0].n + inQ[1].n : q.startsWith('How many more') && inQ[0].n > inQ[1].n ? inQ[0].n - inQ[1].n : NaN; };
    const cellsOk = d => { const key = c => c[0] + ',' + c[1], set = new Set(d.cells.map(key)); if (set.size !== d.cells.length) return false; if (!d.cells.every(c => c[0] >= 0 && c[0] < d.cols && c[1] >= 0 && c[1] < d.rows)) return false;
      const seen = new Set([key(d.cells[0])]), todo = [d.cells[0]]; while (todo.length) { const [x, y] = todo.pop(); for (const n of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) if (set.has(key(n)) && !seen.has(key(n))) { seen.add(key(n)); todo.push(n); } } return seen.size === set.size; };
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const nameOf = d => { if (d.circle) return 'circle'; const n = d.pts.length, s = d.pts.map((q, i) => dist(q, d.pts[(i + 1) % n])), eq = s.every(x => Math.abs(x - s[0]) < .5);
      const right = d.pts.every((q, i) => { const a = d.pts[(i + n - 1) % n], c = d.pts[(i + 1) % n]; return Math.abs((a[0] - q[0]) * (c[0] - q[0]) + (a[1] - q[1]) * (c[1] - q[1])) < 1; });
      const par = (i, j) => { const e = k => [d.pts[(k + 1) % n][0] - d.pts[k][0], d.pts[(k + 1) % n][1] - d.pts[k][1]], u = e(i), v = e(j); return Math.abs(u[0] * v[1] - u[1] * v[0]) < 1; };
      if (n === 3) return 'triangle'; if (n === 4) return right ? (eq ? 'square' : 'rectangle') : eq ? 'rhombus' : (par(0, 2) !== par(1, 3) ? 'trapezoid' : 'other'); return { 5: 'pentagon', 6: 'hexagon', 8: 'octagon' }[n] || 'other'; };
    const T = {
      clock_hour: g => g.m === 0 && readClock(drawPic(g.pic)) === g.ans, clock_half: g => (g.m === 0 || g.m === 30) && readClock(drawPic(g.pic)) === g.ans, clock_five: g => g.m % 5 === 0 && g.m > 0 && readClock(drawPic(g.pic)) === g.ans,
      clock_minute: g => g.m % 5 !== 0 && readClock(drawPic(g.pic)) === g.ans && g.show === `${g.h}:${String(g.m).padStart(2, '0')}`,
      clock_elapsed: g => { const a = g.pic.a, c = g.pic.b; return g.v.unit === 'hours' ? a.m === c.m && c.h - a.h === g.ans && g.ans >= 1 && c.h <= 12 : a.h === c.h && c.m - a.m === g.ans && g.ans >= 5 && g.ans % 5 === 0 && c.m <= 55; },
      bar_read: g => g.pic.step === 1 && fromGraph(g) === g.ans, bar_addsub: g => g.pic.step === 1 && fromGraph(g) === g.ans, bar_multi: g => g.pic.step > 1 && fromGraph(g) === g.ans,
      picto_read: g => g.pic.key === 1 && fromGraph(g) === g.ans, picto_addsub: g => g.pic.key === 1 && fromGraph(g) === g.ans, picto_multi: g => g.pic.key > 1 && fromGraph(g) === g.ans,
      bars: g => { const st = JSON.parse(JSON.stringify(g.st)), step = g.pic.step; if (g.done(st) || !g.empty(st)) return false; g.pic.cats.forEach((c, i) => g.tap(st, `b:${i},${c.n / step}`)); if (!g.done(st)) return false; g.tap(st, `b:0,${g.pic.cats[0].n / step}`); return !g.done(st) && g.data.every((t, i) => t === `${g.pic.cats[i].label} ${g.pic.cats[i].n}`) && g.pic.cats.every(c => c.n <= g.pic.top && c.n % step === 0); },
      area_count: g => cellsOk(g.pic) && g.pic.cells.length === g.ans && g.ans !== g.pic.cols * g.pic.rows && g.ans >= 5 && g.ans <= 20,
      area_tile: g => { const st = { t: [] }; g.pic.cells.forEach(c => g.tap(st, `g:${c[0]},${c[1]}`)); return cellsOk(g.pic) && st.t.length === g.ans; },
      area_expr: g => { const [r, c] = g.ans; return g.pic.cells.length === r * c && g.pic.rows === r && g.pic.cols === c && g.okPair(r, c) && g.okPair(c, r) && !g.okPair(r, c + 1) && !g.okPair(1, r * c) && !g.okPair(r + 1, c); },
      perim_labeled: g => { const s = g.pic.sides; return s.length === g.pic.pts.length && sum(s) === g.ans && 2 * Math.max(...s) < sum(s) && (nameOf(g.pic) !== 'rectangle' || (s[0] === s[2] && s[1] === s[3])); },
      frac_parts: g => { const [n, d] = g.ans, bd = g.pic.bounds; return bd.length === d + 1 && bd.every((x, i) => near(x, i / d)) && new Set(g.pic.lit).size === n && n >= 1 && n < d && g.pic.lit.every(i => i >= 0 && i < d) && g.okPair(n, d) && g.okPair(2 * n, 2 * d) && !g.okPair(d, n) && !g.okPair(n + 1, d) && !g.okPair(n, 0); },
      frac_model: g => { const { num, den } = g.v, st = { parts: 1, lit: [] }, light = k => { for (let i = 0; i < k; i++) g.tap(st, 'p:' + i); }; if (!g.empty(st)) return false; light(1); if (g.done(st)) return false;
        g.tap(st, 'cut:' + den); if (st.lit.length) return false; light(num); if (!g.done(st)) return false; g.tap(st, 'p:0'); if (g.done(st)) return false; if (g.cuts.includes(2 * den)) { g.tap(st, 'cut:' + 2 * den); light(2 * num); if (!g.done(st)) return false; } return g.cuts.includes(den) && num >= 1 && num < den; },
      nl: g => { const st = { k: -1 }; if (!g.empty(st)) return false; for (let k = 0; k <= g.v.den; k++) { g.tap(st, 'k:' + k); if (g.done(st) !== (k === g.v.num)) return false; } return g.pic.den === g.v.den && g.v.num >= 1 && g.v.num < g.v.den; },
      array_expr: g => { const val = g.choices.map(c => sum(c.split(' + ').map(Number))), right = val.filter(v => v === g.r * g.c); const parts = g.choices[g.ans].split(' + ').map(Number); return right.length === 1 && val[g.ans] === g.r * g.c && parts.length === g.pic.r && parts.every(x => x === g.pic.c) && new Set(g.choices).size === 4; },
      mult_repeated: g => g.pic.r * g.pic.c === g.ans && g.pic.r === g.v.g && g.pic.c === g.v.e,
      shape_sides: g => g.pic.pts.length === g.ans, shape_basic: g => g.choices[g.ans] === nameOf(g.pic), shape_more: g => g.choices[g.ans].replace('trapezium', 'trapezoid') === nameOf(g.pic) && new Set(g.choices).size === 4 && (!g.mw || g.choices.some(c => /^trapez/.test(c))),
      coins_whole: g => { const c = g.pic.rows[0].coins; return sum(c) === g.ans && g.ans <= 99 && c.length >= 3 && c.length <= 6 && c.every(v => WHOLE.includes(v)); },
      coins_spend: g => { const t = sum(g.pic.rows[0].coins); return t - g.v.c === g.ans && g.ans >= 1 && g.v.c >= 5 && t <= 99; },
      coins_equal: g => { const r = g.pic.rows, T = sum(r[0].coins), same = r.slice(1).filter(x => sum(x.coins) === T); return r.length === 4 && same.length === 1 && r[1 + g.ans] === same[0] && same[0].coins.join() !== r[0].coins.join() && r.every(x => x.coins.length <= 6 && sum(x.coins) <= 99); },
      coins_decimal: g => { const c = g.pic.rows[0].coins; return sum(c) === g.ans && g.show === (g.ans / 100).toFixed(2) && c.every(v => DEC.includes(v)) && g.ans <= 999 && g.ans % 5 === 0; },
      sym_count: g => foldCount(g.pic.pts) === g.ans && g.teachPic.lines.length === g.ans && g.teachPic.lines.every(a => folds(g.pic.pts, a)),
      sym_line: g => folds(g.pic.pts, g.line) === (g.ans === 0) && g.pic.lines.length === 1,
      coord_read: g => { const q = g.pic.pts[0]; return g.okPair(q.x, q.y) && !g.okPair(q.y, q.x) && q.x !== q.y && q.x >= 1 && q.x <= 6 && q.y >= 1 && q.y <= 6; },
      coord_plot: g => { const st = { x: -1, y: -1 }; if (!g.empty(st)) return false; g.tap(st, `c:${g.v.y},${g.v.x}`); if (g.done(st)) return false; g.tap(st, `c:${g.v.x},${g.v.y}`); return g.done(st) && g.v.x !== g.v.y; },
      coord_what: g => { const hit = g.pic.pts.filter(q => q.x === g.v.x && q.y === g.v.y), keys = new Set(g.pic.pts.map(q => q.x + ',' + q.y)); return hit.length === 1 && hit[0].name === g.choices[g.ans] && keys.size === 4 && new Set(g.pic.pts.map(q => q.name)).size === 4 && g.pic.pts.some(q => q.x === g.v.y && q.y === g.v.x) && g.pic.pts.every(q => q.x >= 0 && q.x <= 6 && q.y >= 0 && q.y <= 6); }
    };
    const trio = n => g => { const good = g.pic.items.filter(it => it.bounds.length === n + 1 && it.bounds.every((x, i) => near(x, i / n))); return good.length === 1 && g.pic.items[g.ans] === good[0] && g.pic.items.length === 3; };
    Object.assign(T, { frac_halves: trio(2), frac_thirds: trio(3), frac_fourths: g => trio(4)(g) && ['fourths', 'quarters'].includes(g.v.word), frac_model_unit: g => g.v.num === 1 && T.frac_model(g), nl_unit: g => g.v.num === 1 && T.nl(g), nl_frac: g => g.v.num > 1 && T.nl(g), bar_build_multi: g => g.pic.step > 1 && T.bars(g) });
    T.bar_build = g => g.pic.step === 1 && T.bars(g);
    const seedWas = S.seed;
    for (const [rule] of LADDER) {
      const test = T[rule]; count[rule] = { pic: !!test, seen: new Set() }; if (!WORDS[rule] || !WORDS[rule][0] || !WORDS[rule][1]) note(rule, 'no maths word');
      for (let i = 0; i < N; i++) { S.seed = (i * 7919 + 13) >>> 0; const where = ['station', 'voltara', 'space'][i % 3], g = GEN[rule](where);
        try {
          if (test && !test(g)) note(rule, 'picture and answer disagree: ' + JSON.stringify(g.v) + ' ans ' + JSON.stringify(g.ans));
          if (g.pic) { const svg = drawPic(g.pic, g.st ? JSON.parse(JSON.stringify(g.st)) : null); if (!svg.startsWith('<svg') || /NaN|undefined|Infinity/.test(svg)) note(rule, 'bad drawing'); if (g.teachPic && /NaN|undefined/.test(drawPic(g.teachPic, null))) note(rule, 'bad teaching picture'); }
          const kind = g.kind || 'num'; if (kind === 'num' && (!Number.isInteger(g.ans) || g.ans < 0)) note(rule, 'answer ' + g.ans); if (kind === 'choice' && !(g.ans >= 0 && g.ans < g.choices.length)) note(rule, 'choice ' + g.ans);
          for (const sc of BANK.filter(x => x.rule === rule)) { const txt = (sc.text + ' ' + sc.ask).replace(/\{(\w+)\}/g, (_, k) => g.v[k]); if (/undefined|\{/.test(txt)) note(rule, 'story: ' + txt); }
          if (TEACH[rule]) { const st = TEACH[rule](g); if (!st.length || st.some(x => !Number.isInteger(x.ans) || x.ans < 0 || /undefined|NaN/.test(x.q))) note(rule, 'teach ' + JSON.stringify(st)); }
          count[rule].seen.add(JSON.stringify([g.v, g.ans, g.pic && (g.pic.cells || g.pic.sides || g.pic.pts || g.pic.items || g.pic.cats || g.pic.rows || [g.pic.h, g.pic.m, g.pic.a, g.pic.b, g.pic.lit])]));
        } catch (e) { note(rule, 'crash ' + e.message); }
      }
    }
    S.seed = seedWas;
    return { bad, rows: LADDER.map(l => [l[0], l[3], count[l[0]].pic, count[l[0]].seen.size]), n: N };
  });
  console.log(`${'rule'.padEnd(20)} band  picture test  different problems in ${res.n}`);
  for (const [rule, band, pic, seen] of res.rows) console.log(`${rule.padEnd(20)} ${band}   ${pic ? 'yes' : 'no (number rule)'.padEnd(3)}${pic ? '           ' : ' '}${seen}`);
  const tested = res.rows.filter(r => r[2]).length;
  console.log(`\n${res.rows.length} rules, ${tested} with a picture test, ${res.n} problems each.`);
  for (const t of res.bad) console.log('  PROBLEM', t);
  if (out) {   // one example of every picture, to look at
    await p.evaluate(() => { const d = document.createElement('div'); d.id = 'sheet'; d.style.cssText = 'position:absolute;left:0;top:0;width:1500px;z-index:99;background:#0b1322;color:#e8eef8;display:grid;grid-template-columns:repeat(5,1fr);gap:10px;padding:12px;font:14px sans-serif';
      S.seed = 4242; for (const l of LADDER) { const g = GEN[l[0]]('station'); if (!g.pic) continue; const sc = BANK.find(x => x.rule === l[0]), fill = t => t.replace(/\{(\w+)\}/g, (_, k) => g.v[k]);
        d.innerHTML += `<div style="border:1px solid #34496c;border-radius:8px;padding:8px"><b style="color:#ffb23e">${l[1]}</b> <small>${l[0]} · ${l[3]}</small><div style="max-width:240px;margin:6px auto">${drawPic(g.pic, g.st || null)}</div><div>${fill(sc.text)} <b>${fill(sc.ask)}</b></div><small>${g.choices ? g.choices.join(' | ') + ' → ' : ''}${g.was || g.show || g.ans}</small>${g.teachPic ? `<div style="max-width:150px;margin:4px auto;opacity:.8">${drawPic(g.teachPic, null)}</div>` : ''}</div>`; }
      document.body.appendChild(d); });
    await p.locator('#sheet').screenshot({ path: path.join(out, 'picture_sheet.png') }); console.log('contact sheet:', path.join(out, 'picture_sheet.png'));
  }
  console.log('console errors:', errs.length ? errs : 'none');
  console.log('RESULT:', !res.bad.length && !errs.length ? 'PASS' : 'FAIL');
  await b.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
