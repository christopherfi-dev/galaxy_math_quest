/*STAR-LOOK-BEGIN  Operation Stardust's ship, drawn like the KIS Station.   [Proposal, 26 November 2026]
  [Source: Marc, 26 November: "Look at the Stardust? One of them is like a space station in space. It's a pretty bland station at the moment." And: "Would it be better
   to have [Gemini] and I make images or is code good enough? You decide and then you begin." Claude's choice: the rooms in code (they must line up with the squares the
   cadet walks on, and change with the story); the things in the rooms from Gemini later.]
  Note: proposals/GMQ_Stardust_Look_v1_2026-11-26.md
  - Floors and walls as on the station (Marc: "The space station looks ok"): panels with rivets, walls with a lit face and a shadow on the floor below.
  - Each room its own floor, so a child knows where they are: Control (blue panels), Living Quarters (carpet), Greenhouse (grating), Food Storage (panels with
    painted lines), Engine Room (diamond plate), Airlock (hazard stripes at the door, a docking ring round your ship), the Corridor (a strip of guide lights).
  - Windows in the outer hull, with twinkling stars. The station's amber sliding doors, which open as the cadet comes near.
  - Fog as before: a room not seen yet stays dark. The room you are in is a little brighter than the others.
  - NOTHING here may give an answer away or mark a room as hot or cold (any room can be the wrong one; "It is not always the Engine Room"): no steam, no frost,
    no glow by temperature, no readings, no countable beds, pots, lamps or bars. The floors are the same at every seed.
  - "Ship look: old" in the Teacher row shows the game's own drawing.
  Drawn once into a picture of the whole ship (redrawn only when a room is seen, the room you are in changes, or the size changes); doors and stars move on top. */
const SLK = (() => {
  let on = true; try { on = localStorage.getItem('gmq-stardust-look') !== 'old'; } catch (e) {}
  const MAT = { control: 'panel', living: 'carpet', green: 'grate', food: 'lines', engine: 'diamond', lock: 'lock', hall: 'hall' };
  const lift = (hex, f) => shade(hex, f);
  const rrg = (g, x, y, w, h, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); };      /* older iPads have no roundRect */
  const isDoor = (x, y) => SDOOR.some(d => d[0] === x && d[1] === y);
  const inShip = (x, y) => x >= 0 && y >= 0 && x < SW && y < SH;
  /* a window in the outer hull: every third square of the top and bottom rows, over a room (not over a corner or an inner wall) */
  const isWin = (x, y) => (y === 0 || y === SH - 1) && x % 3 === 1 && !!sRoomAt(x, y === 0 ? 1 : SH - 2) && sRoomAt(x, y === 0 ? 1 : SH - 2) !== 'hall';
  const cache = { key: '', cv: null, sc: 1 };
  const doorOpen = {};
  function hereRoom() { return sRoomAt(Math.round(SM.px), Math.round(SM.py)); }
  function wallNear(x, y) { for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (inShip(x + dx, y + dy) && sSeen(x + dx, y + dy)) return true; return false; }
  /* one floor square, in the picture g, at (X, Y), s wide; k the room, dim its light */
  function floor(g, k, x, y, X, Y, s, dim) {
    const base = SRM[k].col, col = lift(base, 1.28 * dim), m = MAT[k];
    if (m === 'carpet') {      /* soft carpet: no rivets, a fine weave */
      g.fillStyle = lift(base, 1.18 * dim); g.fillRect(X, Y, s + 1, s + 1);
      g.strokeStyle = `rgba(255,255,255,${.05 * dim})`; g.lineWidth = 1; g.beginPath(); for (let i = -1; i < 4; i++) { g.moveTo(X + s * i / 3, Y + s); g.lineTo(X + s * (i + 1) / 3, Y); } g.stroke();
      return; }
    g.fillStyle = (x + y) % 2 ? col : lift(base, 1.28 * .9 * dim); g.fillRect(X, Y, s + 1, s + 1);
    if (m === 'grate') {      /* metal grating: slots, no rivets */
      g.fillStyle = lift(base, 1.0 * dim); for (let i = 0; i < 4; i++) g.fillRect(X + s * (.13 + i * .21), Y + s * .16, s * .07, s * .68);      /* soft slots: a floor, not a cage */
      g.fillStyle = lift(base, 1.5 * dim); g.fillRect(X + 2, Y + 2, s - 4, 2); return; }
    if (m === 'diamond') {      /* diamond plate */
      g.fillStyle = lift(base, 1.55 * dim); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const cxp = X + s * (.2 + i * .3) + (j % 2) * s * .15, cyp = Y + s * (.2 + j * .3);
        g.save(); g.translate(cxp, cyp); g.rotate((i + j) % 2 ? .6 : -.6); g.fillRect(-s * .07, -s * .02, s * .14, s * .04); g.restore(); }
      g.fillStyle = lift(base, .7 * dim); g.fillRect(X, Y + s - 2, s + 1, 2); g.fillRect(X + s - 2, Y, 2, s + 1); return; }
    /* panels with rivets (as on the station) */
    g.fillStyle = lift(base, 1.28 * 1.2 * dim); g.fillRect(X + 2, Y + 2, s - 4, 2);
    g.fillStyle = lift(base, 1.28 * .68 * dim); g.fillRect(X, Y + s - 2, s + 1, 2); g.fillRect(X + s - 2, Y, 2, s + 1);
    g.fillStyle = lift(base, 1.28 * 1.35 * dim); for (const [i, j] of [[.13, .13], [.84, .13], [.13, .84], [.84, .84]]) g.fillRect(X + s * i, Y + s * j, 2, 2);
    const r = SRM[k].r;
    if (m === 'lines') {      /* Food Storage: a painted line a little in from each wall */
      g.fillStyle = `rgba(255,210,94,${.55 * dim})`; const t = Math.max(2, s * .06);
      if (x === r[0]) g.fillRect(X + s * .3, Y, t, s + 1); if (x === r[0] + r[2] - 1) g.fillRect(X + s * .7 - t, Y, t, s + 1);
      if (y === r[1]) g.fillRect(X, Y + s * .3, s + 1, t); if (y === r[1] + r[3] - 1) g.fillRect(X, Y + s * .7 - t, s + 1, t); }
    if (m === 'lock') {      /* Airlock: hazard stripes along the wall with the door */
      if (y === r[1] && Math.abs(x - 22) <= 1) { g.save(); g.beginPath(); g.rect(X, Y, s + 1, s * .32); g.clip(); g.fillStyle = lift('#e8b53a', dim); g.fillRect(X, Y, s + 1, s * .32); g.fillStyle = lift('#22262e', dim);
        for (let i = -2; i < 6; i++) { g.beginPath(); g.moveTo(X + s * i * .25, Y + s * .32); g.lineTo(X + s * (i * .25 + .12), Y + s * .32); g.lineTo(X + s * (i * .25 + .24), Y); g.lineTo(X + s * (i * .25 + .12), Y); g.fill(); } g.restore(); } }
    if (m === 'hall') {      /* the Corridor: a guide strip down the middle */
      if (y === 8) { g.fillStyle = lift('#1a2236', dim); g.fillRect(X, Y + s - s * .1, s + 1, s * .2); }
      if (y === 9) { g.fillStyle = lift('#1a2236', dim); g.fillRect(X, Y - s * .1, s + 1, s * .2); } }
  }
  /* one wall square: the station's wall, with a window in the outer hull */
  function wall(g, x, y, X, Y, s, dim) {
    const below = inShip(x, y + 1) ? sRoomAt(x, y + 1) : null;
    g.fillStyle = lift('#414e66', dim); g.fillRect(X, Y, s + 1, s + 1);
    g.fillStyle = lift('#93a3bb', dim); g.fillRect(X, Y, s + 1, s * .62);
    g.fillStyle = lift('#bfcbdb', dim); g.fillRect(X, Y, s + 1, s * .1);
    g.fillStyle = lift('#6f7f99', dim); g.fillRect(X, Y + s * .62, s + 1, s * .06);
    if ((x * 3 + y) % 4 === 0 && !isWin(x, y)) { g.fillStyle = lift('#333d52', dim); g.fillRect(X + s * .28, Y + s * .76, s * .44, s * .13); }
    if ((x + y * 2) % 5 === 0 && !isWin(x, y)) { g.fillStyle = lift('#f0c23b', dim * .9); g.fillRect(X + s * .1, Y + s * .2, s * .14, s * .05); }
    if (isWin(x, y)) { g.fillStyle = lift('#d4dde9', dim); rrg(g, X + s * .05, Y + s * .07, s * .9, s * .8, 6); g.fill(); g.fillStyle = '#050a18'; rrg(g, X + s * .12, Y + s * .14, s * .76, s * .66, 4); g.fill(); }
    return !!below && !isDoor(x, y + 1);      /* it casts a shadow on the floor below it */
  }
  /* the whole ship into one picture, at scale sc (screen pixels per ship pixel) */
  function render(ts, here) {
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = SW * ts, H = SH * ts, sc = Math.min(dpr, Math.sqrt(5e6 / (W * H)));
    const c = cache.cv || (cache.cv = document.createElement('canvas')); c.width = Math.ceil(W * sc); c.height = Math.ceil(H * sc);
    const g = c.getContext('2d'); g.setTransform(sc, 0, 0, sc, 0, 0); g.clearRect(0, 0, W, H); const s = ts, shadows = [];
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) { const k = sRoomAt(x, y), X = x * s, Y = y * s;
      if (!k) { if (!wallNear(x, y)) { g.fillStyle = '#0c1222'; g.fillRect(X, Y, s + 1, s + 1); continue; } if (wall(g, x, y, X, Y, s, 1)) shadows.push([X, Y + s]); continue; }
      if (!sSeen(x, y)) { g.fillStyle = '#0c1222'; g.fillRect(X, Y, s + 1, s + 1); continue; }
      if (k === 'hall' && isDoor(x, y)) { g.fillStyle = '#1c2434'; g.fillRect(X, Y, s + 1, s + 1); continue; }
      floor(g, k, x, y, X, Y, s, k === here || (here === 'hall' && k === 'hall') ? 1 : .8); }
    for (const [X, Y] of shadows) { const gr = g.createLinearGradient(0, Y, 0, Y + s * .5); gr.addColorStop(0, 'rgba(0,0,0,.42)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(X, Y, s + 1, s * .5); }
    Object.keys(SRM).forEach(k => { if (k === 'hall' || !SD().seen.includes(k)) return; const r = SRM[k].r, mx = (r[0] + r[2] / 2) * s, my = (r[1] + r[3] / 2) * s;      /* a soft light over each room */
      const gr = g.createRadialGradient(mx, my, s, mx, my, s * 4.6); gr.addColorStop(0, `rgba(255,255,255,${k === here ? .07 : .035})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(r[0] * s, r[1] * s, r[2] * s, r[3] * s); });
    if (SD().seen.includes('lock')) { const [sx0, sy0] = [24.5 * s, 12.5 * s]; g.strokeStyle = 'rgba(255,210,94,.6)'; g.lineWidth = Math.max(2, s * .06); g.setLineDash([s * .22, s * .16]); g.beginPath(); g.arc(sx0, sy0, s * 1.25, 0, 7); g.stroke(); g.setLineDash([]); }      /* the docking ring round your ship */
    cache.sc = sc; }
  /* each frame: the stars outside, the ship's picture, then the doors and the window stars */
  function ship(x0, x1, y0, y1, Xs, Ys, ts, w, h, c) {
    cx.fillStyle = '#05070f'; cx.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) { const sx = (i * 137.5 % 100) / 100 * w, sy = (i * 61.8 % 100) / 100 * h; cx.fillStyle = `rgba(220,230,255,${.25 + .25 * Math.sin(tNow * .8 + i)})`; cx.fillRect(sx, sy, i % 7 ? 1.5 : 2.5, i % 7 ? 1.5 : 2.5); }
    const here = hereRoom(), key = [ts, c.seen.slice().sort().join(','), here, window.devicePixelRatio].join('|');
    if (key !== cache.key) { render(ts, here); cache.key = key; }
    cx.drawImage(cache.cv, Xs(0), Ys(0), SW * ts, SH * ts);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (!isWin(x, y) || !wallNear(x, y)) continue; const X = Xs(x), Y = Ys(y), s = ts;
      for (let i = 0; i < 4; i++) { cx.fillStyle = `rgba(255,235,190,${.45 + .45 * Math.sin(tNow * 2 + x * 3 + y + i * 2)})`; cx.fillRect(X + s * (.2 + ((x * 7 + y * 3 + i * 5) % 6) * .1), Y + s * (.22 + ((x + y * 5 + i * 3) % 5) * .1), 2, 2); }
      cx.fillStyle = 'rgba(160,200,255,.2)'; cx.beginPath(); cx.moveTo(X + s * .2, Y + s * .8); cx.lineTo(X + s * .5, Y + s * .14); cx.lineTo(X + s * .64, Y + s * .14); cx.lineTo(X + s * .34, Y + s * .8); cx.fill(); }
    SDOOR.forEach(([x, y]) => { if (!wallNear(x, y) && !sSeen(x, y)) return; const X = Xs(x), Y = Ys(y), s = ts;      /* the station's sliding door: panels part as the cadet comes near */
      const near = Math.hypot(SM.px - x, SM.py - y) < 1.9, id = x + ',' + y; doorOpen[id] = doorOpen[id] == null ? (near ? .08 : .47) : doorOpen[id] + ((near ? .08 : .47) - doorOpen[id]) * .2; const open = doorOpen[id];
      const pan = (px, py, pw, ph) => { cx.fillStyle = '#e8a53a'; rr(px, py, pw, ph, 3); cx.fill(); ol(2); cx.fillStyle = '#a36f1c'; rr(px + pw * .2, py + ph * .2, pw * .6, ph * .6, 2); cx.fill(); };
      cx.fillStyle = '#d4dde9'; rr(X - s * .1, Y + s * .12, s * .16, s * .76, 3); cx.fill(); ol(2); rr(X + s * .94, Y + s * .12, s * .16, s * .76, 3); cx.fill(); ol(2);
      pan(X + s * .05, Y + s * .24, s * open, s * .52); pan(X + s * (.95 - open), Y + s * .24, s * open, s * .52);
      cx.fillStyle = '#6fd08a'; circ(X - s * .02, Y + s * .5, s * .06); cx.fill(); });
    for (let x = Math.max(1, x0); x <= Math.min(SW - 2, x1); x++) { if (x % 2 || !sSeen(x, 8)) continue;      /* guide lights down the middle of the corridor, a soft pulse running along them */
      cx.fillStyle = `rgba(111,208,255,${.35 + .3 * Math.max(0, Math.sin(tNow * 3 - x * .5))})`; circ(Xs(x) + ts / 2, Ys(9), Math.max(2, ts * .06)); cx.fill(); }
  }
  function toggle() { on = !on; try { localStorage.setItem('gmq-stardust-look', on ? 'new' : 'old'); } catch (e) {} cache.key = ''; label(); }
  function label() { const b = document.getElementById('t_slk'); if (b) b.textContent = 'Ship look: ' + (on ? 'new' : 'old'); }
  const b = document.getElementById('t_slk'); if (b) { b.onclick = toggle; label(); }
  return { get on() { return on; }, ship, toggle, test: { isWin, cacheKey: () => cache.key } };
})();
/*STAR-LOOK-END*/
