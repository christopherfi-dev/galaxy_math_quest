/*CHRONO-LOOK-BEGIN  Planet Chronosia's map, drawn like the big world's new look.   [Proposal, 26 November 2026]
  [Source: Marc, 26 November: "Should we start updating the characters on those? Or filling them in or looking at the visual design?" and "Push what you can."]
  Note: proposals/GMQ_Worlds_Look_v1_2026-11-26.md
  - Chronosia's map is scenery (its tasks are about time, in close-up pictures), so its ground can change: soft grass with tufts in place of the checkerboard, a sand
    path with rounded corners, a river with banks and foam, a plank bridge with rails, mountains with a lit side and snow, round trees with a shadow.
  - Kept exactly: which squares are what; the river's ripples (fast on the left, slow on the right, as the game has them); the fire-trees' glowing fruit; the
    sundial stones (and the sundial once found); the fog; the places' own pictures and names, drawn by the game on top.
  - NOT for Xylophora: its ground is "a patchwork of squares" and its tasks count squares (area), so its squares stay as they are.
  - "World look: old" in the Teacher row shows the game's own drawing.
  The still ground is drawn once into a picture (again only when the cadet sees new squares or the size changes); water and fire move on top. */
const CHLK = (() => {
  const isP = (x, y) => { const t = cTile(x, y); return t === ':' || t === '='; }, isW = (x, y) => { const t = cTile(x, y); return t === '~' || t === '='; };
  const inMap = (x, y) => x >= 0 && y >= 0 && x < CW && y < CH;
  const rnd = (x, y, k) => { const s = Math.sin(x * 127.1 + y * 311.7 + k * 74.7) * 43758.5453; return s - Math.floor(s); };
  const cache = { key: '', cv: null };
  const rrg = (g, x, y, w, h, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); };
  /* a square with only some corners rounded: each corner rounds when neither neighbour on that corner is the same ground */
  function blob(g, X, Y, s, same, x, y, col) { const r = s * .42, tl = !same(x - 1, y) && !same(x, y - 1), tr = !same(x + 1, y) && !same(x, y - 1), br = !same(x + 1, y) && !same(x, y + 1), bl = !same(x - 1, y) && !same(x, y + 1);
    g.fillStyle = col; g.beginPath(); g.moveTo(X + (tl ? r : 0), Y); g.lineTo(X + s - (tr ? r : 0), Y); if (tr) g.quadraticCurveTo(X + s, Y, X + s, Y + r); g.lineTo(X + s, Y + s - (br ? r : 0)); if (br) g.quadraticCurveTo(X + s, Y + s, X + s - r, Y + s);
    g.lineTo(X + (bl ? r : 0), Y + s); if (bl) g.quadraticCurveTo(X, Y + s, X, Y + s - r); g.lineTo(X, Y + (tl ? r : 0)); if (tl) g.quadraticCurveTo(X, Y, X + r, Y); g.closePath(); g.fill(); }
  function tree(g, X, Y, s, col, fire) {      /* a round tree, as on the big world: a shadow, a trunk, a crown of three, a shine */
    g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(X + s * .52, Y + s * .9, s * .36, s * .1, 0, 0, 7); g.fill();
    g.fillStyle = '#6b4a22'; g.fillRect(X + s * .44, Y + s * .55, s * .12, s * .36); g.strokeStyle = INK; g.lineWidth = 1.5; g.strokeRect(X + s * .44, Y + s * .55, s * .12, s * .36);
    const c2 = shade(col, .82); g.lineWidth = 1.6;
    for (const [a, b, r, cc] of [[.33, .5, .25, c2], [.67, .5, .25, c2], [.5, .32, .3, col]]) { g.fillStyle = cc; g.beginPath(); g.arc(X + s * a, Y + s * b, s * r, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(X + s * .42, Y + s * .24, s * .1, s * .06, -.5, 0, 7); g.fill(); }
  function peak(g, X, Y, s, x, y) {      /* a mountain: a lit side, a shadow side, snow on top */
    const h = .9 + rnd(x, y, 1) * .25, top = Y + s * (1 - h), mx = X + s * (.42 + rnd(x, y, 2) * .16);
    g.fillStyle = '#a9a4c4'; g.beginPath(); g.moveTo(X - s * .06, Y + s); g.lineTo(mx, top); g.lineTo(mx + s * .02, Y + s); g.closePath(); g.fill();
    g.fillStyle = '#7d7898'; g.beginPath(); g.moveTo(mx, top); g.lineTo(X + s * 1.06, Y + s); g.lineTo(mx + s * .02, Y + s); g.closePath(); g.fill();
    g.strokeStyle = INK; g.lineWidth = 1.6; g.lineJoin = 'round'; g.beginPath(); g.moveTo(X - s * .06, Y + s); g.lineTo(mx, top); g.lineTo(X + s * 1.06, Y + s); g.stroke();
    g.fillStyle = '#f4f7fb'; g.beginPath(); g.moveTo(mx - s * .14, top + s * .22); g.lineTo(mx, top); g.lineTo(mx + s * .16, top + s * .24); g.lineTo(mx + s * .05, top + s * .18); g.lineTo(mx - s * .04, top + s * .25); g.closePath(); g.fill(); g.stroke(); }
  function render(ts, c) {
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = CW * ts, H = CH * ts, cv = cache.cv || (cache.cv = document.createElement('canvas'));
    cv.width = Math.ceil(W * dpr); cv.height = Math.ceil(H * dpr); const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); const s = ts;
    /* grass first, everywhere seen */
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { if (!cSeen(x, y)) continue; const X = x * s, Y = y * s;
      g.fillStyle = rnd(x, y, 3) < .5 ? '#3a9a84' : '#379480'; g.fillRect(X, Y, s + 1, s + 1);
      g.strokeStyle = 'rgba(20,70,58,.55)'; g.lineWidth = 1.3; g.beginPath(); for (let k = 0; k < 3; k++) { const gx = X + s * (.15 + rnd(x, y, 10 + k) * .7), gy = Y + s * (.25 + rnd(x, y, 20 + k) * .6); g.moveTo(gx, gy); g.lineTo(gx - s * .04, gy - s * .1); g.moveTo(gx, gy); g.lineTo(gx + s * .04, gy - s * .1); } g.stroke(); }
    /* water, with a lighter edge where it meets land, and a dark bank on the land side */
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { if (!cSeen(x, y) || !isW(x, y)) continue; const X = x * s, Y = y * s;
      g.fillStyle = '#2f6fd0'; g.fillRect(X, Y, s + 1, s + 1);
      if (inMap(x, y - 1) && !isW(x, y - 1)) { const gr = g.createLinearGradient(0, Y, 0, Y + s * .35); gr.addColorStop(0, '#6aa6ea'); gr.addColorStop(1, 'rgba(106,166,234,0)'); g.fillStyle = gr; g.fillRect(X, Y, s + 1, s * .35); g.fillStyle = 'rgba(20,60,40,.45)'; g.fillRect(X, Y - s * .08, s + 1, s * .08); }
      if (inMap(x, y + 1) && !isW(x, y + 1)) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(X, Y + s - s * .1, s + 1, s * .06); } }
    /* the sand path: rounded where it turns or ends, with a few pebbles */
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { if (!cSeen(x, y) || cTile(x, y) !== ':') continue; const X = x * s, Y = y * s;
      blob(g, X, Y, s + .5, isP, x, y, '#e2cf9a'); g.fillStyle = '#cdb97f'; for (let k = 0; k < 2; k++) { g.beginPath(); g.ellipse(X + s * (.25 + rnd(x, y, 30 + k) * .5), Y + s * (.3 + rnd(x, y, 40 + k) * .45), s * .07, s * .045, 0, 0, 7); g.fill(); } }
    /* the bridge: planks over the water, rails on each side */
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { if (!cSeen(x, y) || cTile(x, y) !== '=') continue; const X = x * s, Y = y * s;
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(X + s * .14, Y + s * .1, s * .8, s + 2); g.fillStyle = '#a8713f'; rrg(g, X + s * .1, Y - s * .06, s * .8, s * 1.12, 3); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke();
      g.strokeStyle = '#6b4424'; g.lineWidth = 1.5; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(X + s * .12, Y + s * k / 4); g.lineTo(X + s * .88, Y + s * k / 4); g.stroke(); }
      g.fillStyle = '#7a4f28'; g.fillRect(X + s * .06, Y - s * .1, s * .08, s * 1.2); g.fillRect(X + s * .86, Y - s * .1, s * .08, s * 1.2); }
    /* mountains and trees, top row first, so a lower one stands in front */
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { if (!cSeen(x, y)) continue; const t = cTile(x, y), X = x * s, Y = y * s;
      if (t === '^') peak(g, X, Y, s, x, y);
      else if (t === 'T') tree(g, X, Y, s, (x * 7 + y * 3) % 3 ? '#1f6f5f' : '#2a5f8a');
      else if (t === 'F') tree(g, X, Y, s, '#3fb07a', true); }
    cache.key = ts + '|' + c.seen + '|' + dpr; }
  /* each frame: the still ground, then the river's ripples, the fire-trees' fruit, the sundial stones */
  function ground(X, Y, ts, c) {
    const key = ts + '|' + c.seen + '|' + Math.min(2, window.devicePixelRatio || 1); if (key !== cache.key) render(ts, c);
    cx.drawImage(cache.cv, X(0), Y(0), CW * ts, CH * ts);
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { if (!cSeen(x, y)) continue; const t = cTile(x, y), px = X(x), py = Y(y);
      if (t === '~') { const sp = x < CW / 2 ? 2.2 : .35; cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = 2; cx.lineCap = 'round'; for (let k = 0; k < 2; k++) { const o = ((tNow * sp + k * .5 + y * .3) % 1) * ts; cx.beginPath(); cx.moveTo(px + o, py + ts * (.3 + k * .4)); cx.lineTo(px + Math.min(ts, o + ts * .3), py + ts * (.3 + k * .4)); cx.stroke(); } cx.lineCap = 'butt'; }
      else if (t === 'F') { const gl = .5 + .5 * Math.sin(tNow * 2); cx.fillStyle = `rgb(255,${Math.round(140 + gl * 80)},60)`; for (const [a, b] of [[.34, .3], [.64, .36], [.5, .52]]) { circ(px + ts * a, py + ts * b, ts * .08); cx.fill(); ol(1); } }
      else if (t === 'X') { const got = c.finds.indexOf('sundial') >= 0; cx.fillStyle = '#b9b2d6'; for (let k = 0; k < 6; k++) { circ(px + ts * (.5 + .32 * Math.cos(k * 1.047)), py + ts * (.5 + .32 * Math.sin(k * 1.047)), ts * .08); cx.fill(); ol(1); }
        if (got) { cx.fillStyle = '#ffd25e'; circ(px + ts * .5, py + ts * .5, ts * .18); cx.fill(); ol(1.5); cx.strokeStyle = INK; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(px + ts * .5, py + ts * .5); cx.lineTo(px + ts * .62, py + ts * .36); cx.stroke(); } } } }
  return { get on() { return typeof SLK === 'undefined' || SLK.on; }, ground, test: { cacheKey: () => cache.key } };
})();
/*CHRONO-LOOK-END*/
