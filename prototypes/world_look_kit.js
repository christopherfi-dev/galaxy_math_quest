/*WORLD-LOOK-BEGIN  A new look for a map seen from above.   [Proposal, 24 November 2026]
  [Source: Marc, 24 November: "The space station looks ok. But the bigger worlds not as..well designed? You can decide."]
  Note: proposals/GMQ_World_Look_v1_2026-11-24.md. Sample: prototypes/world_look_sample.html (made by prototypes/world_look_build.js).

  It draws the SAME squares. Nothing here changes where a child can walk, what is solid, what can be tapped, or what any word says. It only paints.
  - The ground: no checkerboard. Land, sand, water and paths meet in rounded edges, not square steps.
  - Land stands a little above the water: an earth bank shows on its south side, as walls do in the station.
  - Shallow water near the shore is lighter; deep water is darker.
  - Trees: each one a little different, in clumps that overlap, with one outline round the whole tree.
  - Light from the two suns: a highlight on the upper left of each tree, and the page's own two shadows. (A soft darkening at the picture's edges was tried and taken out: it cost 10 ms a frame in the test browser.)
  - NOTHING NEW TO TAP. No flowers, stones or pebbles are added where the map has none. (Grey pebbles are the machines' test pebbles.)
  Speed: the still ground is painted once into blocks of 8 x 8 squares and kept (at most 16). While nothing new is needed, the next block towards the edge is painted ahead,
  one a frame, so walking does not stop to paint. Only the water's glints and the tall grass move each frame.
  Needs from the page: MAP, MAPW, MAPH, REGIONS, regAt, GATEOF, SOLID, TALL, cx, INK, tNow, vw, vh, shadow2, drawGate, tallOld.
  The tap "Old look" on the top bar shows the page's own drawing, for comparing (sample only). */
const WL = (() => {
  let on = true; try { on = localStorage.getItem('gmq-look-sample') !== 'old'; } catch (e) {}
  const CH = 8, MAXC = 16, cache = new Map(), spr = new Map(); let cKey = '', sKey = '';
  const dprNow = () => Math.min(2, window.devicePixelRatio || 1);
  const L = (x, y) => x < 0 || y < 0 || x >= MAPW || y >= MAPH ? '~' : MAP[y][x];
  const hash = (x, y, k) => { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul((k | 0) + 1, 1442695041); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const css = (c, a) => a == null ? `rgb(${c.map(v => Math.round(Math.max(0, Math.min(255, v)))).join(',')})` : `rgba(${c.map(v => Math.round(Math.max(0, Math.min(255, v)))).join(',')},${a})`;
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const shade = (c, t) => t > 0 ? mix(c, [255, 255, 255], t) : mix(c, [0, 0, 0], -t);

  /* how high each kind of ground lies: water 0, sand 1, land 2, a worn surface (path, stone floor, field) 3 */
  const isW = t => t === '~' || t === 'b';
  const rank = t => isW(t) ? 0 : t === 's' ? 1 : t === ':' || t === 'R' || t === 'w' ? 3 : 2;
  const rk = (x, y) => rank(L(x, y));
  const reg = (x, y) => { const r = regAt(x, y); return REGIONS[r] && REGIONS[r].g ? r : 1; };
  const GREEN = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 };
  const landC = r => rgb((REGIONS[r] && REGIONS[r].g || REGIONS[1].g)[0]);
  const COL = { shallow: rgb('#4f95df'), deep: rgb('#4488d8'), deep2: rgb('#3b7bcf'), sand: rgb('#ead8a2'), bank: rgb('#7a5934'), bank2: rgb('#94703f'),
    path: rgb('#d6b076'), pathRim: rgb('#b48a55'), stone: rgb('#a8a2bb'), stoneRim: rgb('#7d7890'), wheat: rgb('#dcc35c'), wheatRim: rgb('#b89a34') };

  /* a rounded rectangle with its own radius at each corner: nw, ne, se, sw */
  function rr4(g, x, y, w, h, a, b, c, d) { g.moveTo(x + a, y); g.lineTo(x + w - b, y); if (b) g.arcTo(x + w, y, x + w, y + b, b); g.lineTo(x + w, y + h - c); if (c) g.arcTo(x + w, y + h, x + w - c, y + h, c); g.lineTo(x + d, y + h); if (d) g.arcTo(x, y + h, x, y + h - d, d); g.lineTo(x, y + a); if (a) g.arcTo(x, y, x + a, y, a); g.closePath(); }

  /* The shape of all squares where inn() is true, with rounded outer corners and filled inner corners.
     nb() says which neighbours count as "the same" for rounding (land of another region: yes). grow widens it; dy moves it down. Adds to the current path. */
  function shape(g, x0, y0, ts, inn, nb, o) {
    const R = (o.r == null ? .5 : o.r) * ts, gr = (o.grow || 0) * ts, dy = (o.dy || 0) * ts, m = o.margin || 3, ov = gr ? 0 : .5;
    for (let y = y0 - m; y < y0 + CH + m; y++) for (let x = x0 - m; x < x0 + CH + m; x++) {
      const px = (x - x0) * ts, py = (y - y0) * ts + dy, n = nb(x, y - 1), s = nb(x, y + 1), w = nb(x - 1, y), e = nb(x + 1, y);
      if (inn(x, y)) { const k = R + gr; rr4(g, px - gr - (w ? ov : 0), py - gr - (n ? ov : 0), ts + 2 * gr + (w ? ov : 0) + (e ? ov : 0), ts + 2 * gr + (n ? ov : 0) + (s ? ov : 0), !n && !w ? k : 0, !n && !e ? k : 0, !s && !e ? k : 0, !s && !w ? k : 0); continue; }
      if (nb(x, y)) continue;
      const f = R - gr; if (f < .5) continue;
      const iN = inn(x, y - 1), iS = inn(x, y + 1), iW = inn(x - 1, y), iE = inn(x + 1, y);      /* an inner corner is filled only between two squares of this same shape */
      for (const [sx, sy, A, B] of [[-1, -1, iW, iN], [1, -1, iE, iN], [1, 1, iE, iS], [-1, 1, iW, iS]]) { if (!A || !B || !nb(x + sx, y + sy)) continue;      /* where two squares touch only at a corner, what lies between stays joined: a river that steps sideways still flows */
        const Kx = px + (sx < 0 ? 0 : ts), Ky = py + (sy < 0 ? 0 : ts), Ox = Kx - sx * R, Oy = Ky - sy * R, Cx = Kx - sx * gr, Cy = Ky - sy * gr, a1 = sy < 0 ? -Math.PI / 2 : Math.PI / 2, a2 = sx < 0 ? Math.PI : 0;
        let dl = a1 - Math.atan2(sy, sx); while (dl > Math.PI) dl -= 2 * Math.PI; while (dl <= -Math.PI) dl += 2 * Math.PI;
        g.moveTo(Cx, Cy); g.lineTo(Ox, Cy); g.arc(Ox, Oy, f, a1, a2, dl > 0); g.closePath(); } } }
  function fillShape(g, x0, y0, ts, inn, nb, col, o) { g.beginPath(); shape(g, x0, y0, ts, inn, nb || inn, o || {}); g.fillStyle = col; g.fill(); }

  /* paint one block of 8 x 8 squares (and the edges of its neighbours, so the blocks meet without a seam) */
  function paint(g, x0, y0, ts) {
    const M = 4; g.fillStyle = css(COL.shallow); g.fillRect(-2, -2, CH * ts + 6, CH * ts + 6);
    const water = (x, y) => isW(L(x, y)), deepAt = d => (x, y) => { for (let j = -d; j <= d; j++) for (let i = -d; i <= d; i++) if (!water(x + i, y + j)) return false; return true; };
    fillShape(g, x0, y0, ts, deepAt(1), null, css(COL.deep), { r: .5 });
    fillShape(g, x0, y0, ts, deepAt(2), null, css(COL.deep2), { r: .5 });
    const up1 = (x, y) => rk(x, y) >= 1, up2 = (x, y) => rk(x, y) >= 2;
    fillShape(g, x0, y0, ts, up1, null, 'rgba(255,255,255,.5)', { grow: .07 });                 /* foam round every shore */
    fillShape(g, x0, y0, ts, up2, null, 'rgba(255,255,255,.42)', { grow: .07, dy: .17 });       /* and round the foot of a bank */
    fillShape(g, x0, y0, ts, up2, null, css(COL.bank), { dy: .17 });                           /* the bank: land stands above the water */
    fillShape(g, x0, y0, ts, up2, null, css(COL.bank2), { dy: .07 });
    fillShape(g, x0, y0, ts, up1, null, css(COL.sand));
    /* land, one region at a time; land of another region counts as the same for rounding */
    const regs = {}; for (let y = y0 - M; y < y0 + CH + M; y++) for (let x = x0 - M; x < x0 + CH + M; x++) if (up2(x, y)) regs[reg(x, y)] = 1;
    for (const r of Object.keys(regs).map(Number)) { const inn = (x, y) => up2(x, y) && reg(x, y) === r, c = landC(r);
      fillShape(g, x0, y0, ts, inn, up2, css(shade(c, -.2)), { grow: .03 }); fillShape(g, x0, y0, ts, inn, up2, css(c)); }
    /* soft light and dark patches on the land, kept inside the land */
    g.save(); g.beginPath(); shape(g, x0, y0, ts, up2, up2, { margin: 4 }); g.clip();
    for (let cy = Math.floor((y0 - 4) / 2); cy <= Math.floor((y0 + CH + 4) / 2); cy++) for (let cxx = Math.floor((x0 - 4) / 2); cxx <= Math.floor((x0 + CH + 4) / 2); cxx++) {
      const h = hash(cxx, cy, 7); if (h > .75) continue; const bx = (cxx * 2 + hash(cxx, cy, 8) * 2 - x0) * ts, by = (cy * 2 + hash(cxx, cy, 9) * 2 - y0) * ts, br = ts * (1 + hash(cxx, cy, 10) * 1.3), lite = hash(cxx, cy, 11) > .45;
      const gd = g.createRadialGradient(bx, by, 0, bx, by, br); gd.addColorStop(0, lite ? 'rgba(255,255,220,.13)' : 'rgba(10,40,20,.11)'); gd.addColorStop(1, lite ? 'rgba(255,255,220,0)' : 'rgba(10,40,20,0)'); g.fillStyle = gd; g.fillRect(bx - br, by - br, br * 2, br * 2); }
    /* where two regions meet: a soft change of colour across one square, not a ruler line */
    for (let y = y0 - 1; y < y0 + CH + 1; y++) for (let x = x0 - 1; x < x0 + CH + 1; x++) { if (!up2(x, y)) continue; const r = reg(x, y);
      for (const [i, j] of [[1, 0], [0, 1]]) { if (!up2(x + i, y + j) || reg(x + i, y + j) === r) continue; const ex = (x - x0 + i) * ts, ey = (y - y0 + j) * ts, h = ts * .55;
        const gd = i ? g.createLinearGradient(ex - h, 0, ex + h, 0) : g.createLinearGradient(0, ey - h, 0, ey + h); gd.addColorStop(0, css(landC(r), 0)); gd.addColorStop(.5, css(mix(landC(r), landC(reg(x + i, y + j)), .5))); gd.addColorStop(1, css(landC(reg(x + i, y + j)), 0));
        g.fillStyle = gd; if (i) g.fillRect(ex - h, ey, h * 2, ts); else g.fillRect(ex, ey - h, ts, h * 2); } }
    g.restore();
    /* worn ground: paths, stone floors, fields */
    for (const [ch, c, rim, r] of [[':', COL.path, COL.pathRim, .38], ['R', COL.stone, COL.stoneRim, .2], ['w', COL.wheat, COL.wheatRim, .2]]) { const inn = (x, y) => L(x, y) === ch;
      fillShape(g, x0, y0, ts, inn, null, css(rim), { grow: .05, r }); fillShape(g, x0, y0, ts, inn, null, css(c), { r }); }
    /* small marks, inside each square: grass tufts, worn marks on paths, ripples on sand, rows in a field, slabs on a stone floor */
    for (let y = y0 - 1; y < y0 + CH + 1; y++) for (let x = x0 - 1; x < x0 + CH + 1; x++) { const t = L(x, y), px = (x - x0) * ts, py = (y - y0) * ts, k = x + ',' + y;
      if (t === 'b') { g.fillStyle = '#a8713f'; g.fillRect(px - 1, py + ts * .08, ts + 2, ts * .84); g.strokeStyle = '#6b4424'; g.lineWidth = 2; g.beginPath(); for (let k2 = 1; k2 < 4; k2++) { g.moveTo(px + ts * k2 / 4, py + ts * .08); g.lineTo(px + ts * k2 / 4, py + ts * .92); } g.stroke(); g.strokeStyle = INK; g.lineWidth = 1.5; g.strokeRect(px - 1, py + ts * .08, ts + 2, ts * .84); continue; }      /* a bridge is always drawn, even with a thing standing on it */
      if (SOLID[key(x, y)] || GATEOF[key(x, y)]) continue;
      if (t === '.' || t === 'd' || t === 'c' || t === 'p') { const r = reg(x, y), c = landC(r), green = GREEN[r];
        for (let i = 0; i < 3; i++) { if (hash(x, y, 20 + i) > .5) continue; const bx = px + ts * (.15 + hash(x, y, 23 + i) * .7), by = py + ts * (.25 + hash(x, y, 26 + i) * .65);
          if (green) { g.strokeStyle = css(shade(c, -.25)); g.lineWidth = Math.max(1, ts * .028); g.lineCap = 'round'; g.beginPath(); g.moveTo(bx - ts * .05, by - ts * .1); g.lineTo(bx, by); g.lineTo(bx, by - ts * .13); g.moveTo(bx, by); g.lineTo(bx + ts * .055, by - ts * .095); g.stroke(); }
          else { g.fillStyle = css(shade(c, -.14)); g.beginPath(); g.ellipse(bx, by, ts * .05, ts * .025, 0, 0, 7); g.fill(); } }
        if (green && hash(x, y, 29) < .3) { g.fillStyle = css(shade(c, .16)); g.beginPath(); g.ellipse(px + ts * hash(x, y, 30), py + ts * hash(x, y, 31), ts * .06, ts * .03, 0, 0, 7); g.fill(); } }
      else if (t === ':') { g.fillStyle = css(shade(COL.path, -.14)); for (let i = 0; i < 2; i++) { const bx = px + ts * (.2 + hash(x, y, 50 + i) * .6), by = py + ts * (.2 + hash(x, y, 52 + i) * .6); g.beginPath(); g.ellipse(bx, by, ts * .07, ts * .022, hash(x, y, 54 + i) * 3, 0, 7); g.fill(); } }
      else if (t === 's') { g.strokeStyle = css(shade(COL.sand, -.1)); g.lineWidth = Math.max(1, ts * .025); g.beginPath(); for (let i = 0; i < 2; i++) { const bx = px + ts * (.2 + hash(x, y, 60 + i) * .5), by = py + ts * (.3 + i * .35); g.moveTo(bx, by); g.quadraticCurveTo(bx + ts * .12, by - ts * .07, bx + ts * .24, by); } g.stroke(); }
      else if (t === 'w') { g.strokeStyle = css(COL.wheatRim); g.lineWidth = 1.5; g.beginPath(); for (let k2 = 0; k2 < 3; k2++) { g.moveTo(px + ts * .06, py + ts * (.25 + k2 * .3)); g.lineTo(px + ts * .94, py + ts * (.25 + k2 * .3)); } g.stroke(); }
      else if (t === 'R') { g.strokeStyle = css(COL.stoneRim); g.lineWidth = 1.2; g.strokeRect(px + 2, py + 2, ts - 4, ts - 4); }
      else if (t === '*') { for (const [a, b, col] of [[.28, .34, '#ffd25e'], [.66, .56, '#ff8fb0'], [.4, .74, '#ffffff'], [.78, .26, '#b9a3ff']]) { const fx = px + ts * (a + (hash(x, y, 70 + a * 9) - .5) * .12), fy = py + ts * (b + (hash(x, y, 71 + b * 9) - .5) * .12);
          g.strokeStyle = '#2f7f3f'; g.lineWidth = Math.max(1, ts * .025); g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx, fy + ts * .12); g.stroke(); g.fillStyle = col; for (let p = 0; p < 5; p++) { const an = p / 5 * 6.283; g.beginPath(); g.arc(fx + Math.cos(an) * ts * .045, fy + Math.sin(an) * ts * .045, ts * .04, 0, 7); g.fill(); } g.fillStyle = '#f08a2c'; g.beginPath(); g.arc(fx, fy, ts * .03, 0, 7); g.fill(); } }
} }

  let painted = 0;
  function block(ci, cj, ts) { const d = dprNow(), ck = ts.toFixed(3) + '@' + d; if (ck !== cKey) { for (const c of cache.values()) { c.cv.width = c.cv.height = 0; } cache.clear(); cKey = ck; }
    const k = ci + ',' + cj; let c = cache.get(k); if (c) { cache.delete(k); cache.set(k, c); return c; } painted++;
    const W = Math.ceil(CH * ts * d) + 2, cv2 = document.createElement('canvas'); cv2.width = W; cv2.height = W; const g = cv2.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); paint(g, ci * CH, cj * CH, ts);
    c = { cv: cv2, w: W / d }; cache.set(k, c); while (cache.size > MAXC) { const old = cache.keys().next().value, o = cache.get(old); o.cv.width = o.cv.height = 0; cache.delete(old); } return c; }

  /* each frame: the kept blocks, then what moves (glints on water, tall grass), then the gates, as the page drew them */
  function ground(x0, y0, x1, y1, X, Y, ts) {
    painted = 0; for (let cj = Math.floor(y0 / CH); cj <= Math.floor(y1 / CH); cj++) for (let ci = Math.floor(x0 / CH); ci <= Math.floor(x1 / CH); ci++) { const c = block(ci, cj, ts); cx.drawImage(c.cv, X(ci * CH), Y(cj * CH), c.w, c.w); }
    if (!painted) { /* nothing new on screen: let go of blocks far away, then paint one block that is 3 squares or less from the screen's edge (at most 4 x 4 blocks, so never more than are kept) */
      const a0 = Math.floor(Math.max(0, x0 - 3) / CH), a1 = Math.floor(Math.min(MAPW - 1, x1 + 3) / CH), b0 = Math.floor(Math.max(0, y0 - 3) / CH), b1 = Math.floor(Math.min(MAPH - 1, y1 + 3) / CH);
      for (const k of Array.from(cache.keys())) { const [i, j] = k.split(',').map(Number); if (i < a0 || i > a1 || j < b0 || j > b1) { const o = cache.get(k); o.cv.width = o.cv.height = 0; cache.delete(k); } }
      ahead: for (let cj = b0; cj <= b1; cj++) for (let ci = a0; ci <= a1; ci++) if (!cache.has(ci + ',' + cj) && cache.size < MAXC) { block(ci, cj, ts); break ahead; } }
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const t = L(x, y), px = X(x), py = Y(y);
      if (t === '~' && hash(x, y, 80) < .2) { const ph = tNow * .9 + hash(x, y, 81) * 6.283, a = Math.max(0, Math.sin(ph)) * .55; if (a > .02) { const bx = px + ts * (.2 + hash(x, y, 82) * .5), by = py + ts * (.25 + hash(x, y, 83) * .5); cx.strokeStyle = `rgba(255,255,255,${a})`; cx.lineWidth = Math.max(1.5, ts * .035); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(bx, by); cx.quadraticCurveTo(bx + ts * .1, by - ts * .05, bx + ts * .22, by); cx.stroke(); cx.lineCap = 'butt'; } }
      else if (t === ',') { cx.lineCap = 'round'; for (let k = 0; k < 7; k++) { const bx = px + ts * (.1 + k * .13 + (hash(x, y, 90 + k) - .5) * .06), by = py + ts * (.55 + hash(x, y, 97 + k) * .38), hgt = ts * (.28 + hash(x, y, 104 + k) * .16), sway = Math.sin(tNow * 1.6 + x + k) * ts * .05;
          cx.strokeStyle = k % 2 ? '#2f7f3f' : '#3f9548'; cx.lineWidth = Math.max(1.5, ts * .045); cx.beginPath(); cx.moveTo(bx, by); cx.quadraticCurveTo(bx + sway * .3, by - hgt * .5, bx + sway, by - hgt); cx.stroke(); } cx.lineCap = 'butt'; }
      const gt = GATEOF[key(x, y)]; if (gt) drawGate(gt, px, py, ts, x, y); } }

  /* trees: a few kept drawings of each kind, each placed a little off the middle of its square */
  const TREE = { T: ['#2f8f55', '#3a9a5e', '#2b8550', '#348f4e'], t: ['#b58ad8', '#d88ab8', '#a87fd2', '#c98ad0'], a: ['#4fa04a', '#56a64c', '#489a45'] };
  const LOBES = [[-.42, .16, .6], [.42, .18, .58], [0, -.32, .64], [-.12, .2, .7], [.16, -.06, .62]];
  function sprite(t, v, ts) { const d = dprNow(), sk = ts.toFixed(3) + '@' + d; if (sk !== sKey) { spr.clear(); sKey = sk; }
    const k = t + v; let s = spr.get(k); if (s) return s;
    const ox = ts * .35, oy = ts * .45, W = Math.ceil(ts * 1.7 * d), H = Math.ceil(ts * 1.55 * d), c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0);
    const P = (u, w) => [ox + u * ts, oy + w * ts], base = rgb(TREE[t][v % TREE[t].length]), rB = .4 * (.9 + (v % 3) * .08) * ts, [mx, my] = P(.5, .32), rot = v * 1.7;
    g.fillStyle = '#6b4a22'; g.beginPath(); g.moveTo(...P(.43, .93)); g.lineTo(...P(.57, .93)); g.lineTo(...P(.545, .45)); g.lineTo(...P(.455, .45)); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.2; g.stroke();
    const lobes = LOBES.map(([a, b, q]) => { const ca = Math.cos(rot * .15), sa = Math.sin(rot * .15); return [mx + (a * ca - b * sa) * rB, my + (a * sa + b * ca) * rB, q * rB * (.95 + ((v * 7 + q * 10) % 3) * .04)]; });
    g.fillStyle = INK; for (const [a, b, q] of lobes) { g.beginPath(); g.arc(a, b, q + 1.6, 0, 7); g.fill(); }
    g.fillStyle = css(shade(base, -.22)); for (const [a, b, q] of lobes) { g.beginPath(); g.arc(a, b, q, 0, 7); g.fill(); }
    g.fillStyle = css(base); for (const [a, b, q] of lobes) { g.beginPath(); g.arc(a - q * .08, b - q * .12, q * .84, 0, 7); g.fill(); }
    g.fillStyle = css(shade(base, .22), .85); for (const [a, b, q] of lobes.slice(1, 4)) { g.beginPath(); g.arc(a - q * .32, b - q * .36, q * .3, 0, 7); g.fill(); }
    if (t === 'a') for (let i = 0; i < 4; i++) { const an = v + i * 1.9, ax = mx + Math.cos(an) * rB * .55, ay = my + Math.sin(an) * rB * .45 + rB * .1; g.fillStyle = '#ff6a4d'; g.beginPath(); g.arc(ax, ay, ts * .07, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(ax - ts * .022, ay - ts * .022, ts * .02, 0, 7); g.fill(); }
    s = { c, ox, oy, w: W / d, h: H / d }; spr.set(k, s); return s; }
  function tree(t, x, y, px, py, ts) { if (!TREE[t]) return false; const v = Math.floor(hash(x, y, 1) * 6), j = t === 'a' ? .04 : .14, jx = (hash(x, y, 2) - .5) * j * ts, jy = (hash(x, y, 3) - .5) * j * .7 * ts;
    shadow2(px + jx, py + jy, ts, .38); const s = sprite(t, v, ts); cx.drawImage(s.c, px + jx - s.ox, py + jy - s.oy, s.w, s.h); return true; }

  /* sample only: a button on the top bar to compare with the page's own drawing */
  function button() { const hr = document.getElementById('hudr'); if (!hr || document.getElementById('b_look')) return; const b = document.createElement('button'); b.className = 'hb' + (on ? ' on' : ''); b.id = 'b_look'; b.type = 'button'; b.textContent = on ? 'New look' : 'Old look';
    b.onclick = () => { on = !on; b.className = 'hb' + (on ? ' on' : ''); b.textContent = on ? 'New look' : 'Old look'; try { localStorage.setItem('gmq-look-sample', on ? 'new' : 'old'); } catch (e) {} }; hr.insertBefore(b, hr.firstChild); }
  button();
  return { get on() { return on; }, ground, tree, paint, hash, cacheSize: () => cache.size };
})();
function tall(t, x, y, px, py, ts) { if (WL.on && WL.tree(t, x, y, px, py, ts)) return; tallOld(t, x, y, px, py, ts); }
/*WORLD-LOOK-END*/
