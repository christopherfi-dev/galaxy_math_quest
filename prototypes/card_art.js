/* ===== GMQ CARD ART: start =====   The pictures for the cards, one for each picture key in docs/battle/cards.json.   [Proposal, 26 November 2026]
  [Source: the conductor's plan, HANDOFF_Next_Threads_2026-11-26.md: "pictures for the cards. One style for all of them. They must be small enough to live inside one
   game file (SVG, or drawn on the canvas), readable at the size of a card in a child's card book on a phone, and original."]
  Note: proposals/GMQ_Card_Art_v1_2026-11-26.md
  - GMQArt.svg(pic) gives the picture as an SVG string (square, viewBox 0 0 100 100). GMQArt.has(pic) says if there is one. GMQArt.count(pic) gives what the picture
    counts, for the check (checks/card_art_check.js): every number in the card's picture words must be drawn exactly.
  - One style: the game's own (a dark navy outline, flat colours, one white shine), on a dark panel tinted by the card's type.
  - Built in code, not from image files: exact counts, and small (the whole set is one script).
  - No optional chaining and no ??: older iPads cannot read them. */
const GMQArt = (() => {
  const K = '#0e1626', W = 2.4, r1 = n => Math.round(n * 10) / 10;
  /* ---- the pen ---- */
  const pa = (d, fill, sw) => `<path d="${d}" fill="${fill}" stroke="${K}" stroke-width="${sw == null ? W : sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const ci = (x, y, r, fill, sw) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${fill}" stroke="${K}" stroke-width="${sw == null ? W : sw}"/>`;
  const el = (x, y, rx, ry, fill, sw) => `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${fill}" stroke="${K}" stroke-width="${sw == null ? W : sw}"/>`;
  const re = (x, y, w, h, rx, fill, sw) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(rx)}" fill="${fill}" stroke="${K}" stroke-width="${sw == null ? W : sw}"/>`;
  const ln = (x1, y1, x2, y2, col, w) => `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  const sh = (x, y, rx, ry) => `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="#fff" opacity=".5" transform="rotate(-30 ${r1(x)} ${r1(y)})"/>`;
  const tx = (s, x, y, size, fill) => `<text x="${r1(x)}" y="${r1(y)}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill || '#fff'}" stroke="${K}" stroke-width="${size / 7}" paint-order="stroke">${s}</text>`;
  const g = (t, inner, op) => `<g transform="${t}"${op != null ? ` opacity="${op}"` : ''}>${inner}</g>`;
  const at = (x, y, s, rot) => `translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${rot})` : ''}${s && s !== 1 ? ` scale(${s})` : ''}`;
  const poly = (pts, fill, sw) => pa('M' + pts.map(p => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'Z', fill, sw);
  const starPts = (x, y, r, n, inner) => { const p = []; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * inner : r; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } return p; };
  const star = (x, y, r, fill, n, inner, sw) => poly(starPts(x, y, r, n || 5, inner || .47), fill, sw);
  const spark = (x, y, r, fill, sw) => poly(starPts(x, y, r, 4, .32), fill, sw);
  /* ---- things the pictures are made of (each drawn round 0,0; place with at()) ---- */
  const ship = (col, o) => { o = o || {};      /* a small friendly fighter, nose to the right, about 40 long */
    return (o.flame ? poly([[-16, -4], [-27, 0], [-16, 4]], '#ffb23e', 1.8) : '') + pa('M-8 -7 L-18 -17 L-12 -5Z', o.fin || '#ef6a4a') + pa('M-8 7 L-18 17 L-12 5Z', o.fin || '#ef6a4a')
      + pa('M21 0 C11 -10 -6 -10 -16 -7 L-16 7 C-6 10 11 10 21 0Z', col || '#e8edf5') + ci(6, -1.5, 4.6, '#5bb8ff', 2) + sh(4, -3.5, 1.6, 1) + sh(-2, -5.5, 6, 1.3); };
  const laser = col => re(-14, -5, 22, 10, 3, col || '#9fb2cc') + re(6, -3, 12, 6, 2, '#5d6f8a') + re(-10, 3, 7, 10, 2, '#5d6f8a') + sh(-6, -2.5, 5, 1.3);      /* a blaster pointing right */
  const beam = (x1, y, x2, h, col) => re(x1, y - h / 2, x2 - x1, h, h / 2, col || '#ff6b5e', 2) + `<rect x="${r1(x1 + 3)}" y="${r1(y - h / 5)}" width="${r1(x2 - x1 - 6)}" height="${r1(h / 3)}" rx="${r1(h / 6)}" fill="#fff" opacity=".6"/>`;
  const comet = (r, col) => poly([[0, -r], [-r * 3.6, -r * .4], [-r * 3, r * .2], [-r * 3.8, r * .8], [0, r]], '#ffd25e', 2) + ci(0, 0, r, col || '#ffe9a8') + sh(-r * .3, -r * .35, r * .35, r * .2);
  const bolt = (s, col) => g(at(0, 0, s), pa('M4 -22 L-9 2 L0 2 L-5 22 L10 -3 L1 -3 Z', col || '#ffd25e', 2.2 / (s || 1)));
  const heart = (s, col) => g(at(0, 0, s), pa('M0 8 C-14 -2 -10 -13 -3 -10 C-1 -9 0 -7 0 -6 C0 -7 1 -9 3 -10 C10 -13 14 -2 0 8Z', col || '#ff5a7a', 2.2 / (s || 1)));
  const wrench = (s, col) => g(at(0, 0, s), pa('M-16 13 L4 -7 C2 -12 5 -18 11 -18 L7 -13 L9 -9 L13 -9 L17 -13 C18 -6 13 -2 8 -3 L-12 17 C-13 18 -15 18 -16 17 L-17 16 C-18 15 -17 14 -16 13Z', col || '#c8d3e3', 2.2 / (s || 1)));
  const nut = (s, rot) => g(at(0, 0, s, rot), poly([[-7, -4], [0, -8], [7, -4], [7, 4], [0, 8], [-7, 4]], '#c8d3e3', 2) + ci(0, 0, 3, '#6f7f99', 1.6));      /* a bolt's hex head, from above */
  const shield = col => pa('M0 -22 L18 -15 C18 4 10 16 0 22 C-10 16 -18 4 -18 -15Z', col || '#5bb8ff') + sh(-8, -11, 5, 2.2);
  const dome = (w, h, col) => pa(`M${-w / 2} 0 A${w / 2} ${h} 0 0 1 ${w / 2} 0Z`, col || 'rgba(120,200,255,.45)') + ln(-w / 2 - 3, 0, w / 2 + 3, 0, K, 3);
  const cloud = (col, sw) => pa('M-20 8 C-28 8 -28 -4 -19 -4 C-19 -13 -7 -15 -3 -8 C1 -16 15 -14 14 -4 C24 -5 25 8 16 8Z', col || '#e7ecf7', sw);
  const robot = (col, o) => { o = o || {};      /* a little box robot, about 30 tall */
    return ln(0, -15, 0, -21, K, 2) + ci(0, -22, 2.4, '#ff5a4d', 1.6) + re(-9, -15, 18, 13, 4, col || '#c8d3e3') + ci(-4, -9, 2.2, '#5bb8ff', 1.4) + ci(4, -9, 2.2, '#5bb8ff', 1.4)
      + re(-8, -1, 16, 13, 3, col || '#c8d3e3') + ln(-8, 3, -13, 8, K, 2.4) + ln(8, 3, 13, 8, K, 2.4) + re(-7, 12, 5, 4, 1, '#6f7f99', 1.6) + re(2, 12, 5, 4, 1, '#6f7f99', 1.6)
      + (o.cap ? pa('M-10 -15 C-10 -22 10 -22 10 -15Z', '#3b82f6', 2) + star(0, -18, 3, '#ffd25e', 5, .45, 1.2) : '')
      + (o.tool ? g(at(13, 6, .4, 30), wrench(1)) : ''); };
  const drone = (o) => { o = o || {};      /* a round drone with two rotors */
    return ln(-12, -8, -4, -4, K, 2) + ln(12, -8, 4, -4, K, 2) + el(-13, -9, 6, 1.8, '#c8d3e3', 1.6) + el(13, -9, 6, 1.8, '#c8d3e3', 1.6) + ci(0, 0, 8, o.col || '#9fb2cc')
      + (o.eyes === 2 ? ci(-3, 0, 2.4, '#fff', 1.4) + ci(3, 0, 2.4, '#fff', 1.4) + ci(-3, .4, 1, K, 0) + ci(3, .4, 1, K, 0) : ci(0, 0, 3.6, o.eye || '#ff5a4d', 1.6) + ci(-1, -1, 1, '#fff', 0))
      + (o.spanner ? g(at(8, 9, .38, -20), wrench(1)) : ''); };
  const patch = (s, col) => g(at(0, 0, s, -8), re(-9, -7, 18, 14, 3, col || '#ffd25e', 2) + `<rect x="-6" y="-4" width="12" height="8" rx="2" fill="none" stroke="${K}" stroke-width="1.2" stroke-dasharray="2 1.6"/>`);
  const card = (col) => re(-6, -8, 12, 16, 2, '#fff', 1.8) + star(0, 0, 3.2, col || '#ff5a4d', 5, .45, 1.1);      /* a playing card */
  const meteor = (r, col) => { const rad = [1, .82, .95, .78, 1, .86, .92, .8], p = rad.map((q, i) => { const t = i / rad.length * Math.PI * 2; return [Math.cos(t) * r * q, Math.sin(t) * r * q]; });      /* a lumpy rock with craters (not a nut) */
    let d = ''; p.forEach((pt, i) => { const nx = p[(i + 1) % p.length], mx = (pt[0] + nx[0]) / 2, my = (pt[1] + nx[1]) / 2; d += (i ? ' Q' : 'M' + r1((p[p.length - 1][0] + pt[0]) / 2) + ' ' + r1((p[p.length - 1][1] + pt[1]) / 2) + ' Q') + `${r1(pt[0])} ${r1(pt[1])} ${r1(mx)} ${r1(my)}`; });
    return pa(d + 'Z', col || '#9aa3b3', 1.8) + el(-r * .28, -r * .2, r * .22, r * .18, '#7d8494', 1.2) + el(r * .3, r * .28, r * .15, r * .12, '#7d8494', 1.1) + sh(-r * .35, -r * .5, r * .22, r * .1); };
  const mite = (col) => el(0, 0, 6, 4.4, col || '#c79a6a', 1.8) + ci(-2, -1, 1.2, K, 0) + ci(2, -1, 1.2, K, 0) + ln(-5, 3, -8, 6, K, 1.4) + ln(5, 3, 8, 6, K, 1.4) + ln(-5, -2, -8, -5, K, 1.4) + ln(5, -2, 8, -5, K, 1.4);
  const person = (body, o) => { o = o || {};      /* a small person, about 30 tall: the station's crew */
    return re(-7, -2, 14, 16, 4, body || '#3b82f6') + ci(0, -9, 7, o.helmet || '#fff') + (o.visor === false ? ci(-2.4, -9.5, 1.1, K, 0) + ci(2.4, -9.5, 1.1, K, 0) : el(1.5, -9.2, 4.2, 3.2, '#16264a', 1.4)) + re(-6, 14, 5, 5, 1.5, '#5d6f8a', 1.6) + re(1, 14, 5, 5, 1.5, '#5d6f8a', 1.6); };
  /* ---- the panel behind every picture: tinted by the card's type, with a few stars ---- */
  const TINT = { attack: '#3b2232', defence: '#1d2f52', repair: '#173c34', spy: '#2d2249', guard: '#1d3b45', part: '#222b3d', upgrade: '#2b2742' };
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };
  function panel(kind, key) { let out = `<rect x="2" y="2" width="96" height="96" rx="12" fill="${TINT[kind] || TINT.part}" stroke="${K}" stroke-width="2.4"/>`; const h = hash(key);
    for (let i = 0; i < 7; i++) { const x = 10 + ((h * (i + 3) * 37) % 80), y = 9 + ((h * (i + 5) * 53) % 82); out += `<circle cx="${x}" cy="${y}" r="${i % 3 ? .9 : 1.4}" fill="#fff" opacity=".55"/>`; } return out; }
  /* ---- the ship parts: five shapes, four kinds (the border colours of the kinds) ---- */
  const KIND = { standard: { c: '#9aa6b8', d: '#6f7b8e' }, guardian: { c: '#3b82f6', d: '#1f5bbf', thick: true }, striker: { c: '#ef4444', d: '#b52a2a', sharp: true }, lucky: { c: '#f5c518', d: '#c99a06', shine: true } };
  function part(shape, kind) { const k = KIND[kind] || KIND.standard, w = k.thick ? 3.6 : W; let s = '';
    if (shape === 'reactor') s = re(-14, -20, 28, 40, 7, k.c, w) + re(-8, -12, 16, 24, 5, '#7df0ff', 2) + ci(0, 0, 4, '#fff', 1.6) + re(-17, -22, 34, 6, 3, k.d, w) + re(-17, 16, 34, 6, 3, k.d, w);
    if (shape === 'dish') s = re(-3, 6, 6, 12, 2, k.d, w) + re(-12, 16, 24, 6, 3, k.d, w) + pa('M-20 -8 C-12 14 12 14 20 -8 C10 0 -10 0 -20 -8Z', k.c, w) + ln(0, 2, 6, -14, K, 2.2) + ci(6, -15, 2.6, '#ffd25e', 1.6);
    if (shape === 'shieldgen') s = re(-16, 10, 32, 10, 3, k.d, w) + pa('M-14 10 A14 16 0 0 1 14 10Z', k.c, w) + `<path d="M-22 10 A22 24 0 0 1 22 10" fill="none" stroke="#7df0ff" stroke-width="2.4" stroke-dasharray="4 3"/>`;
    if (shape === 'turret') s = re(-16, 6, 32, 14, 4, k.d, w) + pa('M-12 6 A12 11 0 0 1 12 6Z', k.c, w) + re(4, -14, 8, 22, 3, k.c, w) + re(5, -20, 6, 7, 2, k.d, 2);
    if (shape === 'battery') s = re(-13, -16, 26, 36, 5, k.c, w) + re(-5, -21, 10, 6, 2, k.d, w) + pa('M2 -9 L-6 3 L-1 3 L-3 13 L6 0 L1 0 Z', '#ffd25e', 1.8);
    if (k.sharp) s += poly([[-21, -2], [-27, 4], [-19, 6]], k.d, 1.8) + poly([[21, -2], [27, 4], [19, 6]], k.d, 1.8);
    if (k.shine) s += spark(-20, -18, 5, '#fff7c2', 1.4) + spark(21, -10, 3.6, '#fff7c2', 1.2) + spark(17, 20, 3, '#fff7c2', 1.1);
    return s + sh(-6, -12, 4, 1.6); }
  const up3 = () => [0, 1, 2].map(i => k(poly([[70, 64 - i * 18], [80, 52 - i * 18], [90, 64 - i * 18], [84, 64 - i * 18], [84, 72 - i * 18], [76, 72 - i * 18], [76, 64 - i * 18]], '#6fd08a', 2))).join('');
  /* ---- each card's picture: [type for the panel, drawing, what it counts (for the check)] ---- */
  const C = {}, N = {};
  const def = (pic, kind, draw, count) => { C[pic] = [kind, draw]; if (count) N[pic] = count; };
  const k = s => `<g class="n">${s}</g>`;      /* one counted thing: checks/card_art_check.js counts these against the card's words */
  const row = (n, x0, x1, y, f) => { let s = ''; for (let i = 0; i < n; i++) s += f(n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (n - 1), y, i); return s; };
  /* attack */
  def('spark-shot', 'attack', () => g(at(32, 60, 1.1), laser()) + spark(70, 42, 13, '#ffd25e'));
  def('comet-jab', 'attack', () => g(at(66, 50, 1, -10), comet(11)));
  def('odd-rocket', 'attack', () => g(at(50, 52, 1), poly([[-36, -9], [-44, -18], [-30, -9]], '#ef6a4a') + poly([[-36, 9], [-44, 18], [-30, 9]], '#ef6a4a') + pa('M40 0 C30 -12 -20 -12 -38 -9 L-38 9 C-20 12 30 12 40 0Z', '#e8edf5') + row(7, -28, 26, -1, x => k(ci(x, -1, 3.3, '#5bb8ff', 1.6))) + sh(0, -7, 14, 1.4)), { n: 7, of: 'windows' });
  def('even-beam', 'attack', () => g(at(18, 50, 1), laser()) + row(8, 34, 90, 50, (x, y, i) => k(re(x - 3.4, 42, 6.8, 16, 2, i % 2 ? '#ffb23e' : '#ff6b5e', 1.6))), { n: 8, of: 'stripes' });
  def('nine-star-burst', 'attack', () => ci(50, 50, 7, '#fff2a8', 2) + row(9, 0, 8, 0, (i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 9; return k(star(50 + Math.cos(a) * 32, 50 + Math.sin(a) * 32, 8, '#ffd25e')); }), { n: 9, of: 'stars' });
  def('tens-torpedo', 'attack', () => g(at(48, 50, 1), poly([[-36, -10], [-46, -20], [-42, -8]], '#6f7f99') + poly([[-36, 10], [-46, 20], [-42, 8]], '#6f7f99') + pa('M46 0 C40 -13 32 -13 28 -13 L-38 -13 L-38 13 L28 13 C32 13 40 13 46 0Z', '#e8edf5') + row(10, -33, 25, 0, x => k(re(x - 2, -13, 4, 26, 1, '#ef4444', 1.4))) + sh(-6, -8, 16, 1.3)), { n: 10, of: 'rings' });
  def('voltara-bolt', 'attack', () => `<circle cx="50" cy="50" r="30" fill="#d38bff" opacity=".16"/>` + g(at(50, 50, 1.6, 12), bolt(1, '#d38bff')));
  const torp = (y) => g(at(50, y, .8), pa('M42 0 C34 -10 24 -10 20 -10 L-36 -10 L-36 10 L20 10 C24 10 34 10 42 0Z', '#c8d3e3') + poly([[-34, -8], [-44, -16], [-40, -6]], '#6f7f99') + poly([[-34, 8], [-44, 16], [-40, 6]], '#6f7f99') + re(-10, -10, 4, 20, 1, '#ef4444', 1.2) + sh(-6, -6, 14, 1.2));
  def('twin-tens', 'attack', () => k(torp(34)) + k(torp(66)), { n: 2, of: 'torpedoes' });
  def('all-hands-fire', 'attack', () => g(at(28, 50, 1.2), ship()) + [0, 1, 2, 3, 4].map(i => { const y = 26 + i * 12; return k(re(46, y - 3, 10, 6, 2, '#5d6f8a', 1.6) + beam(58, y, 92, 5, '#ff6b5e')); }).join(''), { n: 5, of: 'lasers' });
  def('hit-and-hide', 'attack', () => re(46, 26, 12, 52, 3, '#8a96ac') + g(at(30, 56, 1), ship(null, { flame: false })) + beam(60, 40, 92, 6, '#ff6b5e'));
  def('doubling-drive', 'attack', () => g(at(16, 50, 1), laser()) + beam(32, 50, 52, 7, '#ff6b5e') + k(g('rotate(-22 52 50)', beam(52, 50, 92, 7, '#ff6b5e'))) + k(g('rotate(22 52 50)', beam(52, 50, 92, 7, '#ff6b5e'))), { n: 2, of: 'beams after the split' });
  def('hundred-cannon', 'attack', () => ci(32, 74, 10, '#6f7f99') + ci(56, 74, 10, '#6f7f99') + g('rotate(-28 44 62)', re(20, 50, 64, 24, 8, '#5d6f8a') + re(78, 47, 10, 30, 3, '#3e4b62') + tx('100', 49, 68, 15, '#ffd25e')) + ci(32, 74, 3, '#c8d3e3', 1.6) + ci(56, 74, 3, '#c8d3e3', 1.6), { text: '100' });
  def('pebble-popper', 'attack', () => ci(36, 70, 7, '#6f7f99') + g('rotate(-20 40 60)', re(24, 52, 30, 14, 5, '#8a96ac') + re(50, 50, 6, 18, 2, '#5d6f8a')) + k(ci(64, 46, 4, '#b3a28c', 1.6)) + k(ci(74, 38, 3.6, '#b3a28c', 1.6)) + k(ci(83, 30, 3.2, '#b3a28c', 1.5)) + k(ci(90, 22, 2.8, '#b3a28c', 1.4)));      /* 4 pebbles: the card adds 4 */
  def('eleven-sparks', 'attack', () => row(10, 11, 89, 42, x => k(poly(starPts(x, 42, 5.6, 4, .45), '#ffd25e', 1.3))) + k(poly(starPts(50, 68, 7, 4, .45), '#ffd25e', 1.6)), { n: 11, of: 'sparks (ten in a row and one more)' });
  def('dozen-darts', 'attack', () => re(14, 30, 72, 44, 5, '#8a5f34') + row(6, 22, 78, 0, x => k(g(at(x, 42, .9), poly([[0, -8], [3, -2], [1, -2], [1, 8], [-1, 8], [-1, -2], [-3, -2]], '#ff6b5e', 1.4)))) + row(6, 22, 78, 0, x => k(g(at(x, 62, .9), poly([[0, -8], [3, -2], [1, -2], [1, 8], [-1, 8], [-1, -2], [-3, -2]], '#ff6b5e', 1.4)))), { n: 12, of: 'darts' });
  def('thirteen-zaps', 'attack', () => row(7, 14, 86, 0, x => k(g(at(x, 34, .5), bolt(1, '#ffd25e')))) + row(6, 20, 80, 0, x => k(g(at(x, 66, .5), bolt(1, '#ffd25e')))), { n: 13, of: 'zaps' });
  def('double-seven-ray', 'attack', () => g(at(14, 36, .8), laser()) + g(at(14, 64, .8), laser()) + row(7, 32, 88, 0, (x, _, i) => k(re(x - 3.6, 30, 7.2, 12, 2, i % 2 ? '#ffb23e' : '#ff6b5e', 1.4))) + row(7, 32, 88, 0, (x, _, i) => k(re(x - 3.6, 58, 7.2, 12, 2, i % 2 ? '#ffb23e' : '#ff6b5e', 1.4))), { n: 14, of: 'stripes (two beams of seven)' });
  def('patrol-pop', 'attack', () => [[30, 36], [30, 66]].map(([x, y]) => k(g(at(x, y, .75), ship()) + ci(x + 26, y, 3, '#ffd25e', 1.4) + ci(x + 40, y, 3, '#ffd25e', 1.4))).join(''));      /* 2 ships: the card adds 2 for each part */
  def('clockwork-cannon', 'attack', () => ci(40, 72, 9, '#8a5f34') + g('rotate(-20 46 58)', re(22, 46, 58, 22, 7, '#d8a850') + re(76, 44, 9, 26, 3, '#a8782a')) + star(46, 52, 9, '#f0d27a', 10, .72, 1.6) + ci(46, 52, 3, '#8a5f34', 1.2));
  def('xylophora-thorn', 'attack', () => g(at(52, 50, 1, -15), pa('M-36 0 C-20 -8 10 -6 40 0 C10 6 -20 8 -36 0Z', '#7cc46a') + ln(-30, 0, 30, 0, '#4f8f3e', 2)) + ln(14, 26, 24, 22, '#fff', 1.6) + ln(10, 70, 22, 72, '#fff', 1.6));
  def('two-dozen-blast', 'attack', () => `<circle cx="50" cy="50" r="30" fill="#ffe27a" opacity=".18"/>` + row(12, 10, 90, 0, x => k(star(x, 38, 4.2, '#ffd25e', 5, .55, .9))) + row(12, 10, 90, 0, x => k(star(x, 62, 4.2, '#ffd25e', 5, .55, .9))), { n: 24, of: 'stars (two rows of twelve)' });
  def('quarter-cannon', 'attack', () => g('rotate(-18 48 60)', re(18, 50, 42, 18, 6, '#5d6f8a') + pa('M60 59 L88 59 A28 28 0 0 0 79.8 39.2 Z', '#ffb23e') + ln(66, 54, 80, 47, '#fff7c2', 2)) + ci(30, 72, 10, '#6f7f99') + ci(30, 72, 3.4, '#c8d3e3', 1.6) + ci(52, 72, 8, '#6f7f99') + ci(52, 72, 3, '#c8d3e3', 1.6));      /* the mouth is a quarter circle: a fan of 90 degrees */
  def('triple-ten-strike', 'attack', () => [28, 50, 72].map(x => k(g(at(x, 50, 1.25, 20), bolt(1, '#ffd25e')))).join(''), { n: 3, of: 'bolts' });
  def('fleet-flash', 'attack', () => [[26, 22], [20, 41], [20, 60], [26, 79]].map(([x, y]) => k(g(at(x, y, .52), ship()) + spark(x + 22, y, 5, '#fff2a8', 1.4))).join(''));      /* 4 ships: the card adds 4 for each part */
  def('fix-and-fire', 'attack', () => g(at(36, 52, 1.2), laser()) + g(at(34, 70, .55, -10), wrench(1)) + beam(58, 47, 90, 6, '#ff6b5e'));
  def('rally-cry', 'attack', () => g(at(50, 54, 1.2), ship()) + [[22, 30], [50, 20], [78, 30], [80, 76], [20, 76]].map(([x, y]) => k(g(at(x, y, .42), heart(1)))).join(''));      /* 5 hearts: the card adds 5 */
  def('duck-and-jab', 'attack', () => pa('M24 36 C36 22 62 22 74 36', 'none', 3) + `<path d="M24 36 C36 22 62 22 74 36" fill="none" stroke="#5bb8ff" stroke-width="5" stroke-linecap="round"/>` + g(at(46, 54, 1), ship()) + beam(68, 54, 92, 5, '#ff6b5e'));
  /* defence */
  def('dust-screen', 'defence', () => g(at(26, 50, .85), ship()) + g(at(70, 50, 1.25), cloud('#c9b8a0')) + row(24, 0, 23, 0, i => `<circle cx="${54 + (i * 37 % 34)}" cy="${30 + (i * 53 % 40)}" r=".9" fill="#7d6a52"/>`));
  const tileWall = (cols, rows, w, h, gap, col, shape) => { let s = ''; const W0 = cols * w + (cols - 1) * gap, H0 = rows * h + (rows - 1) * gap, x0 = 50 - W0 / 2, y0 = 50 - H0 / 2;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = x0 + c * (w + gap), y = y0 + r * (h + gap);
      s += '<g class="n">' + (shape === 'gem' ? poly([[x + w / 2, y], [x + w, y + h / 2], [x + w / 2, y + h], [x, y + h / 2]], col, 1.6) : shape === 'rock' ? el(x + w / 2, y + h / 2, w / 2, h / 2.2, col, 1.6) + ci(x + w * .4, y + h * .45, w * .12, '#7d8290', 0)
        : shape === 'ice' ? poly([[x + w * .25, y], [x + w * .75, y], [x + w, y + h / 2], [x + w * .75, y + h], [x + w * .25, y + h], [x, y + h / 2]], col, 1.6) : re(x, y, w, h, shape === 'brick' ? 1.5 : 3, col, 1.6)) + '</g>'; }
    return s; };
  const rowsWall = (per, w, h, gap, col, shape) => { let s = ''; const H0 = per.length * h + (per.length - 1) * gap, y0 = 50 - H0 / 2;      /* rows of different lengths, centred */
    per.forEach((m, r) => { const W0 = m * w + (m - 1) * gap, x0 = 50 - W0 / 2; for (let c = 0; c < m; c++) { const x = x0 + c * (w + gap), y = y0 + r * (h + gap);
      s += '<g class="n">' + (shape === 'rock' ? el(x + w / 2, y + h / 2, w / 2, h / 2.2, col, 1.6) + ci(x + w * .4, y + h * .45, w * .12, '#7d8290', 0) : poly([[x + w * .25, y], [x + w * .75, y], [x + w, y + h / 2], [x + w * .75, y + h], [x + w * .25, y + h], [x, y + h / 2]], col, 1.6)) + '</g>'; } });
    return s; };
  def('ten-tile-wall', 'defence', () => tileWall(5, 2, 13, 13, 3, '#8fb3e8'), { n: 10, of: 'tiles' });
  def('dozen-deflector', 'defence', () => re(12, 26, 76, 48, 6, '#3e4b62') + tileWall(6, 2, 10, 14, 2.4, '#7df0ff', 'gem'), { n: 12, of: 'gems' });
  def('double-seven-wall', 'defence', () => tileWall(7, 2, 10, 9, 1.6, '#d08a5a', 'brick'), { n: 14, of: 'bricks (two rows of seven)' });
  def('subtraction-shield', 'defence', () => g(at(50, 50, 1.6), shield()) + re(36, 46, 28, 8, 3, '#fff', 2));
  def('meteor-net', 'defence', () => `<path d="M12 22 C34 34 66 34 88 22 L80 66 C64 82 36 82 20 66 Z" fill="rgba(200,211,227,.12)" stroke="#c8d3e3" stroke-width="3" stroke-linejoin="round"/><path d="M16 40 C38 50 62 50 84 40 M19 56 C40 66 60 66 81 56 M32 28 L34 78 M50 30 L50 80 M68 28 L66 78" fill="none" stroke="#c8d3e3" stroke-width="2" stroke-linecap="round"/>` + g(at(50, 52), meteor(13)) + ln(6, 14, 20, 26, '#ffb23e', 2.4) + ln(10, 10, 16, 18, '#ffb23e', 1.6));
  def('quarter-wall', 'defence', () => pa('M24 76 L24 26 A50 50 0 0 1 74 76Z', '#8fb3e8') + `<path d="M24 51 A25 25 0 0 1 49 76 M24 34 A42 42 0 0 1 66 76" fill="none" stroke="${K}" stroke-width="1.6"/>`);
  def('patch-and-block', 'defence', () => g(at(50, 50, 1.6), shield()) + g(at(58, 58, 1.1), patch(1)));
  def('card-wall', 'defence', () => row(4, 26, 74, 0, (x, _, i) => k(g(at(x, 52, 1.5), card(i % 2 ? '#3b82f6' : '#ff5a4d')))));      /* 4 cards: the card blocks 4 for each card */
  def('vanishing-act', 'defence', () => g(at(46, 50, 1.3), ship(), .3) + `<path d="M8 50 L92 50" stroke="#ff6b5e" stroke-width="5" stroke-linecap="round" opacity=".9"/>`);
  def('wormhole-zip', 'defence', () => `<g fill="none" stroke-linecap="round">${[26, 19, 12, 6].map((r, i) => `<circle cx="66" cy="50" r="${r}" stroke="${['#7a5cff', '#a37cff', '#cfa8ff', '#fff'][i]}" stroke-width="4"/>`).join('')}</g>` + g(at(32, 54, .8, -10), ship(null, { flame: true })));
  def('triple-illusion', 'defence', () => [30, 50, 70].map((y, i) => k(g(at(50, y, .8), ship('#cfe6ff'), i === 1 ? 1 : .45))).join(''), { n: 3, of: 'ships' });
  def('foil-screen', 'defence', () => pa('M18 26 L34 22 L48 28 L64 22 L82 28 L78 46 L84 62 L76 78 L58 74 L42 80 L24 74 L20 56 L14 42Z', '#d4dde9') + ln(30, 34, 46, 48, '#fff', 1.6) + ln(56, 36, 70, 56, '#fff', 1.6) + ln(32, 62, 50, 66, '#8a96ac', 1.4));
  def('cloud-cover', 'defence', () => g(at(52, 52, 1.7), cloud('#e7ecf7')));
  def('moon-rock-wall', 'defence', () => rowsWall([4, 4, 3], 15, 12, 2, '#a7adb9', 'rock'));      /* 11 rocks: the card blocks 11 */
  def('ice-crystal-wall', 'defence', () => rowsWall([5, 4, 4], 13, 12, 2, '#9fdcff', 'ice'));      /* 13 crystals: the card blocks 13 */
  def('card-fence', 'defence', () => ln(14, 70, 86, 70, '#8a5f34', 4) + row(3, 30, 70, 0, (x, _, i) => k(g(at(x, 54, 1.3, (i - 1) * 5), card(i % 2 ? '#3b82f6' : '#ff5a4d')))));      /* 3 cards: the card blocks 3 for each card */
  def('bubble-patch', 'defence', () => g(at(44, 52, 1.6), shield()) + ci(66, 42, 11, 'rgba(180,230,255,.55)', 2) + sh(62, 37, 3, 1.4));
  def('glow-coat', 'defence', () => `<ellipse cx="50" cy="50" rx="34" ry="20" fill="#ffe27a" opacity=".35"/>` + g(at(50, 50, 1.4), ship('#fff2a8')));
  def('rock-shell', 'defence', () => ci(50, 50, 30, '#8a8f9c') + ci(50, 50, 21, TINT.defence, 2) + g(at(50, 50, .8), ship()) + [[28, 34], [72, 36], [70, 68], [30, 68]].map(([x, y]) => ci(x, y, 3, '#6f7480', 1.2)).join(''));
  def('triple-ten-wall', 'defence', () => [32, 50, 68].map(y => k(re(16, y - 6, 68, 12, 4, '#8fb3e8'))).join(''), { n: 3, of: 'bars' });
  def('halo-ring', 'defence', () => `<ellipse cx="50" cy="50" rx="36" ry="24" fill="none" stroke="#ffe27a" stroke-width="6"/>` + g(at(50, 50, 1.1), ship()));
  def('star-dome', 'defence', () => g(at(50, 70), dome(68, 42, 'rgba(120,200,255,.3)')) + (() => { let s = '', m = 0; for (let y = 36; y <= 66 && m < 30; y += 7.5) for (let x = 20; x <= 80 && m < 30; x += 7.5) { const dx = (x - 50) / 32, dy = (70 - y) / 40; if (dx * dx + dy * dy > .9 || y > 66) continue; s += k(star(x, y, 3.1, '#ffd25e', 5, .5, .7)); m++; } return s; })());      /* 30 stars: the card adds 30 */
  def('card-castle', 'defence', () => row(3, 30, 70, 0, x => k(g(at(x, 66, 1.3), card('#ff5a4d')))) + row(2, 40, 60, 0, x => k(g(at(x, 42, 1.3), card('#3b82f6')))) + poly([[50, 14], [57, 26], [43, 26]], '#ffd25e', 1.6));      /* 5 cards: the card adds 5 for each card */
  def('shell-and-mend', 'defence', () => g(at(42, 52, 1.5), shield()) + g('rotate(40 72 44)', re(70, 22, 4, 40, 2, '#d4dde9', 1.6) + `<ellipse cx="72" cy="26" rx="1" ry="2.4" fill="${K}"/>`) + `<path d="M72 62 C80 70 64 76 70 84" fill="none" stroke="#ff5a7a" stroke-width="2"/>`);
  def('hold-and-heal', 'defence', () => pa('M40 76 L40 44 C40 40 46 40 46 44 L46 34 C46 30 52 30 52 34 L52 32 C52 28 58 28 58 32 L58 36 C58 32 64 32 64 36 L64 58 C64 70 56 76 50 76Z', '#f2c9a0') + beam(70, 50, 94, 5, '#ff6b5e') + k(g(at(24, 32, .4), heart(1))) + k(g(at(24, 62, .4), heart(1))));      /* 2 hearts: it repairs 2 on every part */
  def('star-harbour', 'defence', () => `<ellipse cx="50" cy="56" rx="38" ry="20" fill="#ffe27a" opacity=".25"/>` + re(12, 70, 76, 10, 3, '#8a96ac') + g(at(50, 56, 1.1), ship()) + star(50, 24, 7, '#ffd25e'));
  /* repair */
  def('quick-patch', 'repair', () => g(at(50, 50, 1.4, -30), re(-26, -9, 52, 18, 9, '#f2c9a0') + re(-9, -7, 18, 14, 3, '#e8a57a', 1.6) + ci(-17, -3, 1, K, 0) + ci(-17, 3, 1, K, 0) + ci(17, -3, 1, K, 0) + ci(17, 3, 1, K, 0)));
  def('hull-tape', 'repair', () => pa('M48 70 L48 84 L86 84 L83 80 L86 76 L83 72 L86 70Z', '#c8d3e3') + ci(46, 46, 26, '#c8d3e3', 2.6) + ci(46, 46, 12, TINT.repair, 2.4) + `<circle cx="46" cy="46" r="19" fill="none" stroke="#9aa6b8" stroke-width="1.4"/>` + sh(34, 32, 7, 2.4));
  def('repair-bot', 'repair', () => g(at(50, 56, 1.5), robot('#c8d3e3', { tool: true })));
  def('dozen-bolts', 'repair', () => row(5, 26, 74, 0, x => k(g(at(x, 70, 1.05), nut(1)))) + row(4, 32, 68, 0, x => k(g(at(x, 55, 1.05), nut(1)))) + row(3, 38, 62, 0, x => k(g(at(x, 40, 1.05), nut(1)))), { n: 12, of: 'bolts (five, four and three)' });
  def('shield-spark', 'defence', () => g(at(50, 52, 1.6), shield()) + k(spark(60, 40, 9, '#ffd25e')), { n: 1, of: 'spark' });
  def('nano-shield', 'defence', () => { let s = `<path d="M50 16 L79 27 C79 58 66 78 50 88 C34 78 21 58 21 27Z" fill="none" stroke="#7df0ff" stroke-width="1.2" stroke-dasharray="2 3" opacity=".7"/>`;      /* dots that make a shield: inside its outline */
    for (let y = 22; y <= 84; y += 5) for (let x = 24; x <= 76; x += 5) { const t = (y - 16) / 72, half = t < .15 ? 29 : 29 * Math.sqrt(Math.max(0, 1 - Math.pow((t - .15) / .85, 2.2))); if (Math.abs(x - 50) > half - 3) continue; s += `<circle cx="${x}" cy="${y}" r="1.6" fill="#7df0ff"/>`; } return s; });
  def('dome-top-up', 'defence', () => g(at(50, 72), dome(70, 40, 'rgba(120,200,255,.35)')) + poly([[50, 14], [62, 28], [55, 28], [55, 40], [45, 40], [45, 28], [38, 28]], '#6fd08a', 2));
  def('meteor-mend', 'repair', () => g(at(44, 44), meteor(16, '#b3a28c')) + `<path d="M58 54 C66 62 70 66 72 72" fill="none" stroke="#ffd25e" stroke-width="2.4" stroke-dasharray="3 3"/>` + g(at(74, 76, .9), patch(1)));
  def('fix-it-fleet', 'repair', () => [[62, 50], [44, 31], [44, 69], [24, 16], [24, 84]].map(([x, y]) => k(g(at(x, y, .5), ship('#d6f5df', { fin: '#6fd08a' })) + g(at(x + 16, y - 8, .22, 20), wrench(1)))).join(''));      /* 5 ships: the card repairs 5 on every part */
  def('rounding-rover', 'repair', () => re(16, 52, 44, 16, 5, '#ffb23e') + ci(24, 72, 6, '#5d6f8a') + ci(52, 72, 6, '#5d6f8a') + ln(40, 52, 46, 40, K, 2.4) + ci(46, 38, 3.6, '#5bb8ff', 1.6) + `<path d="M62 64 C74 64 80 52 78 34" fill="none" stroke="#6fd08a" stroke-width="4" stroke-linecap="round"/>` + poly([[72, 36], [78, 24], [84, 36]], '#6fd08a', 2) + tx('10', 76, 20, 12, '#fff'));
  const drift = (n) => re(12, 40, 26, 30, 4, '#c8d3e3') + re(62, 40, 26, 30, 4, '#c8d3e3') + g(at(25, 55, .6), heart(1)) + g(at(75, 55, .6), heart(1, '#ff8aa0')) + `<path d="M36 30 C44 18 56 18 64 30" fill="none" stroke="#ffd25e" stroke-width="4" stroke-linecap="round"/>` + poly([[60, 24], [68, 34], [56, 34]], '#ffd25e', 1.8) + k(g(at(50, 22, .42), heart(1)));      /* the one heart on its way */
  def('galactic-drift', 'repair', () => drift(1));
  def('quarter-dome', 'defence', () => g(at(50, 74), dome(70, 40, 'rgba(120,200,255,.35)')) + `<path d="M15 74 A35 40 0 0 1 50 34 L50 74Z" fill="rgba(120,200,255,.45)" stroke="${K}" stroke-width="2"/>`);
  def('stellar-revival', 'repair', () => g(at(50, 58, 1.1), part('battery', 'standard')) + poly([[50, 16], [58, 26], [53, 26], [53, 34], [47, 34], [47, 26], [42, 26]], '#6fd08a', 2) + star(74, 28, 8, '#ffd25e'));
  def('repair-bay', 'repair', () => re(10, 76, 80, 8, 2, '#8a96ac') + re(16, 20, 6, 56, 2, '#ffb23e') + re(16, 20, 40, 6, 2, '#ffb23e') + ln(50, 26, 50, 40, K, 2) + re(78, 20, 6, 56, 2, '#ffb23e') + g(at(52, 58, 1.1), ship()));
  def('shield-reborn', 'defence', () => `<circle cx="50" cy="52" r="40" fill="#7df0ff" opacity=".18"/><circle cx="50" cy="52" r="32" fill="#7df0ff" opacity=".18"/>` + g(at(50, 52, 1.6), shield('#7df0ff')));
  def('gum-patch', 'repair', () => re(14, 52, 72, 26, 4, '#8a96ac') + pa('M34 52 C34 40 48 34 56 40 C66 38 70 48 66 54 C64 62 40 62 34 52Z', '#ff8ac6') + sh(46, 44, 5, 2));
  def('seven-stitches', 'repair', () => re(12, 34, 76, 32, 5, '#8a96ac') + ln(18, 50, 82, 50, K, 1.6) + row(7, 22, 78, 0, x => k(ln(x - 3, 42, x + 3, 58, '#ffd25e', 3.2))), { n: 7, of: 'stitches' });
  def('wrench-spin', 'repair', () => g(at(50, 50, 1.5, 20), wrench(1)) + `<path d="M22 30 A32 32 0 0 1 40 16 M78 70 A32 32 0 0 1 60 84" fill="none" stroke="#ffd25e" stroke-width="3" stroke-linecap="round"/>`);
  def('bolt-beetles', 'repair', () => [[34, 56], [66, 56]].map(([x, y]) => k(el(x, y, 11, 8, '#6fd08a') + ln(x, y - 8, x, y + 8, K, 1.6) + ci(x + 11, y, 3.2, '#4f8f3e', 1.6) + g(at(x - 2, y - 14, .7), nut(1)))).join(''), { n: 2, of: 'beetles' });
  def('helper-drones', 'repair', () => [[24, 40], [50, 60], [76, 40]].map(([x, y]) => k(g(at(x, y, 1.05), drone({ spanner: true, col: '#d6f5df' })))).join(''), { n: 3, of: 'drones' });
  def('patch-pack', 'repair', () => re(28, 28, 44, 50, 10, '#6fa8dc') + re(34, 50, 32, 22, 5, '#4f86b8') + pa('M36 30 C36 16 64 16 64 30', 'none', 3) + g(at(50, 30, .75), patch(1, '#ffd25e')));
  def('little-drift', 'repair', () => drift(0), { n: 1, of: 'heart moving' });
  def('mega-mend', 'repair', () => `<circle cx="50" cy="50" r="34" fill="#ffe27a" opacity=".3"/>` + g(at(50, 50, 2.6), patch(1, '#ffd25e')));
  def('star-mechanic', 'repair', () => g(at(50, 58, 1.5), robot('#c8d3e3', { cap: true, tool: true })));
  def('comet-quilt', 'repair', () => poly([[22, 50], [4, 40], [8, 50], [2, 60]], '#ffd25e', 1.6) + re(24, 28, 56, 44, 4, '#c8d3e3') + [[24, 28, '#ff8aa0'], [52, 28, '#6fd08a'], [24, 50, '#5bb8ff'], [52, 50, '#ffd25e']].map(([x, y, c]) => re(x + 2, y + 2, 24, 18, 3, c, 1.4)).join(''));
  def('robot-crew', 'repair', () => [18, 39, 61, 82].map((x, i) => k(g(at(x, 58, .95), robot(['#c8d3e3', '#ffd25e', '#9fdcff', '#d6f5df'][i], { tool: true })))).join(''), { n: 4, of: 'robots' });
  def('comeback-crew', 'repair', () => [26, 74].map(x => g(at(x, 60, 1), person('#3b82f6'))).join('') + re(30, 36, 40, 14, 4, '#9aa6b8') + ci(50, 43, 4, '#7df0ff', 1.4));
  /* spy */
  def('probe-drone', 'spy', () => k(g(at(50, 50, 2.2), drone({ eye: '#ff5a4d' }))), { n: 1, of: 'eye' });
  def('sneak-circuit', 'spy', () => re(26, 30, 48, 30, 4, '#4f8f3e') + ln(34, 38, 66, 38, '#ffd25e', 2) + ln(34, 46, 54, 46, '#ffd25e', 2) + ci(62, 50, 3, '#ffd25e', 1.4) + [32, 44, 56, 68].map((x, i) => ln(x, 60, x + (i % 2 ? 4 : -4), 76, K, 2.6)).join('') + ci(40, 26, 2, '#fff', 1) + ci(60, 26, 2, '#fff', 1));
  def('twin-probes', 'spy', () => k(g(at(32, 50, 1.4), drone())) + k(g(at(68, 50, 1.4), drone())), { n: 2, of: 'probes' });
  def('databa-hacker', 'spy', () => `<rect x="48" y="20" width="40" height="30" rx="4" fill="#7df0ff" opacity=".35"/>` + re(48, 20, 40, 30, 4, '#173c54') + ln(54, 30, 74, 30, '#7df0ff', 2) + ln(54, 38, 68, 38, '#7df0ff', 2) + re(62, 50, 12, 8, 1, '#5d6f8a') + pa('M14 80 L16 50 C16 36 42 36 42 50 L44 80Z', '#4a3f6b') + pa('M18 48 C18 30 40 30 40 48', '#3a3157'));
  def('double-agent', 'spy', () => k(pa('M50 22 C30 22 22 38 24 54 C26 70 40 78 50 78Z', '#f2c9a0')) + k(pa('M50 22 C70 22 78 38 76 54 C74 70 60 78 50 78Z', '#8f7ad6')) + ci(38, 46, 3, K, 0) + ci(62, 46, 3, '#fff', 0) + `<path d="M34 60 C38 64 44 64 46 60 M54 62 C58 58 64 58 66 62" fill="none" stroke="${K}" stroke-width="2"/>` + re(18, 18, 64, 8, 3, '#2d2249'), { n: 2, of: 'faces' });
  def('triple-tap', 'spy', () => pa('M40 84 L40 50 C40 44 48 44 48 50 L48 24 C48 18 56 18 56 24 L56 46 C56 42 64 42 64 48 L64 66 C64 78 56 84 50 84Z', '#f2c9a0') + [0, 1, 2].map(i => k(`<circle cx="52" cy="22" r="${8 + i * 7}" fill="none" stroke="#ffd25e" stroke-width="2.4" opacity="${.95 - i * .2}"/>`)).join(''), { n: 3, of: 'taps (rings)' });
  def('five-part-swarm', 'spy', () => [[30, 30], [70, 28], [50, 50], [28, 72], [72, 70]].map(([x, y]) => k(g(at(x, y, .95), drone({ col: '#8f7ad6' })))).join(''), { n: 5, of: 'drones' });
  def('tick-bug', 'spy', () => el(42, 58, 16, 12, '#8f7ad6') + ci(56, 50, 7, '#8f7ad6') + ci(70, 30, 12, '#fff') + ln(70, 30, 70, 22, K, 2) + ln(70, 30, 76, 32, K, 2) + [34, 42, 50].map(x => ln(x, 68, x - 4, 78, K, 2)).join(''));
  def('shadow-pair', 'spy', () => [36, 64].map((x, i) => k(g(at(x, 54, 1.3), person('#2a2238', { helmet: '#2a2238' }), 1))).join('') + ci(30, 42, 1.4, '#fff', 0) + ci(70, 42, 1.4, '#fff', 0), { n: 2, of: 'spies' });
  def('dust-mites', 'spy', () => [[30, 40], [68, 44], [48, 70]].map(([x, y]) => k(g(at(x, y, 1.6), mite()))).join(''), { n: 3, of: 'mites' });
  def('night-owl', 'spy', () => pa('M30 30 L36 18 L42 28 L58 28 L64 18 L70 30 C76 50 70 76 50 78 C30 76 24 50 30 30Z', '#6f6890') + ci(41, 44, 9, '#fff') + ci(59, 44, 9, '#fff') + ci(41, 45, 4, '#ffd25e', 1.6) + ci(59, 45, 4, '#ffd25e', 1.6) + poly([[50, 52], [54, 58], [46, 58]], '#ffb23e', 1.6) + ln(18, 40, 28, 44, K, 2) + ln(82, 40, 72, 44, K, 2));
  /* guard */
  def('station-guard', 'guard', () => g(at(36, 56, 1.6), person('#2f6b8a')) + re(60, 30, 4, 46, 2, '#8a96ac', 1.6) + poly([[54, 18], [70, 18], [78, 26], [78, 40], [70, 48], [54, 48], [46, 40], [46, 26]], '#e5463b', 2) + tx('STOP', 62, 37, 9), { text: 'STOP' });
  /* ship parts */
  [['standard-reactor', 'reactor', 'standard'], ['neutron-reactor', 'reactor', 'guardian'], ['quantum-reactor', 'reactor', 'striker'], ['stellar-reactor', 'reactor', 'lucky'],
   ['standard-navigator', 'dish', 'standard'], ['celestial-cartographer', 'dish', 'guardian'], ['astrolabe-navigator', 'dish', 'striker'], ['cosmic-navigator', 'dish', 'lucky'],
   ['standard-shield', 'shieldgen', 'standard'], ['neutron-wall', 'shieldgen', 'guardian'], ['quantum-deflector', 'shieldgen', 'striker'], ['nova-shield', 'shieldgen', 'lucky'],
   ['standard-arsenal', 'turret', 'standard'], ['proton-launcher', 'turret', 'guardian'], ['pulsar-phaser', 'turret', 'striker'], ['supernova-arsenal', 'turret', 'lucky'],
   ['standard-battery', 'battery', 'standard'], ['proton-generator', 'battery', 'guardian'], ['quantum-dynamo', 'battery', 'striker'], ['galaxy-battery', 'battery', 'lucky']]
    .forEach(([pic, shape, kind]) => def(pic, 'part', () => g(at(50, 52, 1.5), part(shape, kind))));
  /* upgrades: the part, and three arrows up */
  def('booster-upgrade', 'upgrade', () => g(at(38, 52, 1.1), part('reactor', 'standard')) + up3(), { n: 3, of: 'arrows up' });
  def('inertial-dampener', 'upgrade', () => ci(38, 52, 20, '#c8d3e3') + poly([[38, 36], [43, 52], [38, 68], [33, 52]], '#ef4444', 1.8) + ci(38, 52, 3, '#fff', 1.4) + up3(), { n: 3, of: 'arrows up' });
  def('magnetic-field-amplifier', 'upgrade', () => g(at(38, 54, 1.1), shield()) + pa('M22 30 C22 14 54 14 54 30 L48 30 C48 22 28 22 28 30Z', '#ef4444') + up3(), { n: 3, of: 'arrows up' });
  def('laser-sight-enhancer', 'upgrade', () => ci(38, 52, 18, 'none') + ln(38, 30, 38, 74, K, 2) + ln(16, 52, 60, 52, K, 2) + ci(38, 52, 4, '#ff5a4d', 1.6) + up3(), { n: 3, of: 'arrows up' });
  def('battery-optimizer', 'upgrade', () => g(at(38, 52, 1.1), part('battery', 'standard')) + up3(), { n: 3, of: 'arrows up' });
  /* ---- the result ---- */
  const cache = {};
  function svg(pic) { if (cache[pic]) return cache[pic]; const d = C[pic]; if (!d) return '';
    return (cache[pic] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img">${panel(d[0], pic)}${d[1]()}</svg>`); }
  return { svg, has: pic => !!C[pic], count: pic => N[pic] || null, keys: () => Object.keys(C) };
})();
if (typeof module !== 'undefined') module.exports = GMQArt;
/* ===== GMQ CARD ART: end ===== */
