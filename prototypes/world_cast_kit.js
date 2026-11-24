/*WORLD-CAST-BEGIN  Elder Thimble and Pim from Marc's Gemini pictures, alive in the village.   [Proposal, 24 November 2026]
  [Source: Marc, 24 November: "Put Elder Thimble and Pim into my copy of the big world now, with breathing, blinking, a hop when they talk, and faces that change with their words"]
  Pictures: prototypes/world_cast_sprites.js (CAST_SPRITES), cut out by prototypes/world_cast_build.py. Note: proposals/GMQ_Character_Test_Results_v1_2026-11-24.md
  - They stand where the game drew them, in the village scene. Nothing they say or do is changed; only how they look.
  - Breathing: a slow, small stretch from the feet. Blinking: every 2.5 to 5 seconds (not in a frame with closed eyes).
  - A hop at each new page of their words, and a small bob while their words are up.
  - Their face follows their words: each line in the game has a feeling (the table below); a new line falls back on its last mark (? thinking, ! happy).
  - Pim, until his spinner is given back: sad. After: playing with it. (What the child did shows in the picture.)
  - "Look: old" on the Ship panel shows the game's own drawing, as today. If a picture has not loaded, the game's own drawing is used.
  THE CROWD [Marc's pictures 9 to 11]: one ordinary Mender, made into each Mender of the crowd: the game's own copper for each (its col), and one or two things that fit their job.
  Things they wear sit on the lid; things they carry stand on the ground beside them, so they stay put when the face changes. On the walking map and at the first lesson. */
const CAST = (() => {
  const NAME = { elder: 'Elder Thimble', pim: 'Pim' }, HEIGHT = { elder: 2.3, pim: 1.7 };      /* on-screen height of the calm frame, in the scene's r (about 130 and 95 pixels on an iPad held sideways); taller, the elder covers the pip store */
  const IMG = {}, PROP = {};
  Object.keys(CAST_PROPS).forEach(k => { const im = new Image(); im.src = CAST_PROPS[k].src; PROP[k] = im; });
  Object.keys(CAST_SPRITES).forEach(c => Object.keys(CAST_SPRITES[c].frames).forEach(f => { const im = new Image(); im.src = CAST_SPRITES[c].frames[f].src; IMG[c + '.' + f] = im; }));
  /* each line they say, and the face that goes with it [Proposal: the feelings are Claude's reading of each line] */
  const LINES = {
    elder: [[/^Sky visitor! Welcome/, 'happy'], [/^The Makers built machines/, 'thinking'], [/burnt black|ate some of our pips|went up when the Gate broke|planning, and it burnt/, 'worried'],
      [/^You found a rule|^All four plates are true|^What is that\?|^It is a piece of the Gate/, 'surprised'],
      [/^The bridge has a lock|^The Makers made it so|^Its light flies|^This is no machine|^Was the rule|^So I poured in 3|^The bridge pan still waits/, 'thinking'],
      [/^You know how already|^Look: our Rule Stone|^And for you|^You have made|^Long ago I found|^3 times 4 is 12/, 'happy'],
      [/^Four machines stand|^Here are our last|^Use only a machine|^The other four|^Keep it safe|^The Rillfolk are over|^I poured in 2|^Now you\./, 'idle']],
    pim: [[/lost my spinner/, 'sad'], [/That is my spinner|You found it|I will write back/, 'joy'], [/Want a secret|Shh|Push the old post|The big kids cross/, 'secret'],
      [/^Whee! Look at it spin/, 'spinner'], [/count to 100 by fives|A bottle\? With a note|Wim!/, 'excited'], [/^Hello! I am Pim\.$/, 'idle']] };
  const st = {};
  Object.keys(NAME).forEach((c, i) => { st[c] = { page: '', hop: -9, blinkAt: 1.5 + i * 1.7, phase: i * 1.3 }; });
  function faceFor(c, text) { for (const [re, f] of LINES[c]) if (re.test(text)) return f; return /\?\s*$/.test(text) ? 'thinking' : /!/.test(text) ? 'happy' : 'idle'; }
  function rest(c) { return c === 'pim' ? (flag('spinGiven') ? 'spinner' : 'sad') : 'idle'; }
  function speaking(c) { return reading() && READ.who === NAME[c]; }
  /* draw one of them with the feet on the line base, at x X; r is the scene's size. Returns false to let the game draw its own. */
  function draw(c, X, base, r) {
    if (!WL.on || !CAST_SPRITES[c]) return false;
    const s = st[c], talk = speaking(c), text = talk ? READ.q[READ.i] || '' : '', key = talk ? READ.i + '|' + text : '';
    if (key && key !== s.page) s.hop = tNow; s.page = key;
    const fname = talk ? faceFor(c, text) : rest(c), fr = CAST_SPRITES[c].frames[fname] || CAST_SPRITES[c].frames.idle, im = IMG[c + '.' + (CAST_SPRITES[c].frames[fname] ? fname : 'idle')];
    if (!im || !im.complete || !im.naturalWidth) return false;
    const H = HEIGHT[c] * r, k = H / CAST_SPRITES[c].frames.idle.h;
    const br = Math.sin(tNow * 2.2 + s.phase), tb = talk ? Math.sin(tNow * 9) * .012 : 0, sy = 1 + .016 * br + tb, sx = 1 - .011 * br;
    const th = tNow - s.hop, dy = th < .42 ? -Math.sin(th / .42 * Math.PI) * H * .09 : 0, land = th >= .42 && th < .56 ? 1 - .07 * Math.sin((th - .42) / .14 * Math.PI) : 1;
    cx.fillStyle = 'rgba(0,0,0,.24)'; cx.beginPath(); cx.ellipse(X, base, fr.w * k * .3 * (1 + dy / H), Math.max(3, H * .05), 0, 0, 7); cx.fill();
    cx.save(); cx.translate(X, base + dy); cx.scale(k * sx * (2 - land), k * sy * land); cx.drawImage(im, -fr.ax, -fr.ay, fr.w, fr.h);
    if (tNow > s.blinkAt + .14) s.blinkAt = tNow + 2.5 + ((Math.sin(tNow * 12.9898 + s.phase) * 43758.5453) % 1 + 1) % 1 * 2.5;
    if (tNow >= s.blinkAt && tNow < s.blinkAt + .14 && fr.eyes.length) {       /* the eyelids: the face's own copper over each eye, and a dark line where it closes */
      for (const [ex, ey, rx, ry] of fr.eyes) { const ox = ex - fr.ax, oy = ey - fr.ay;
        cx.fillStyle = fr.lid; cx.beginPath(); cx.ellipse(ox, oy, rx * 1.12, ry * 1.12, 0, 0, 7); cx.fill();
        cx.strokeStyle = INK; cx.lineWidth = Math.max(2.5, ry * .2); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(ox - rx * .95, oy + ry * .1); cx.quadraticCurveTo(ox, oy + ry * .55, ox + rx * .95, oy + ry * .1); cx.stroke(); cx.lineCap = 'butt'; } }
    cx.restore(); return true; }
  /* ---- the crowd ---- */
  const DRESS = { gardener: { head: 'hat', side: 'can' }, fisher: { side: 'rod' }, gran: { head: 'shawl' }, cutter: { side: 'reeds' }, keeper: { side: 'basket' }, lesson: { side: 'toolbox' } };
  const SIDE_H = { can: .36, basket: .4, toolbox: .34, reeds: .85, rod: .95 };
  /* a face for any Mender's line: thanks and welcomes are happy; "Listen!" is surprised; missing, tipping, scaring, losing are worried; questions and "Shh" are thinking */
  const CROWD_FACE = [[/Thank you|Welcome|hum(ming)? again|Hello again/, 'happy'], [/^Listen!|^Wow|^Oh!/, 'surprised'], [/not heard|miss |Mind |tip\.|lost|burnt|ate some|nobody|afraid|dare/, 'worried'],
    [/\?|^Shh|rule|Watch\.|north of/, 'thinking'], [/!|^Hello/, 'happy']];
  const crowdFace = text => { for (const [re, f] of CROWD_FACE) if (re.test(text)) return f; return 'idle'; };
  const hexRGB = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const tinted = {};
  function tint(col) {      /* the ordinary Mender's copper turned to this Mender's own, once, and kept. Only copper changes: not the knob, band, feet, eyes or outline. */
    if (tinted[col]) return tinted[col]; const base = hexRGB(CAST_SPRITES.mender.base), want = hexRGB(col), k = want.map((v, i) => v / base[i]), out = {};
    for (const f of Object.keys(CAST_SPRITES.mender.frames)) { const im = IMG['mender.' + f]; if (!im || !im.complete || !im.naturalWidth) return null;
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height), q = d.data;
      for (let i = 0; i < q.length; i += 4) { const r = q[i], gr = q[i + 1], b = q[i + 2]; if (q[i + 3] < 10) continue; if (r > 120 && r - b > 55 && gr < r * .78 && gr > r * .38) { q[i] = Math.min(255, r * k[0]); q[i + 1] = Math.min(255, gr * k[1]); q[i + 2] = Math.min(255, b * k[2]); } }
      g.putImageData(d, 0, 0); out[f] = c; }
    return (tinted[col] = out); }
  const cst = {};
  /* one Mender of the crowd: key (its id, for what it wears and carries), col (its copper), feet at (X, feet), H tall; who: the name its words come under */
  function mender(key, col, X, feet, H, who) {
    if (!WL.on || !CAST_SPRITES.mender) return false; const set = tint(col); if (!set) return false;
    const s = cst[key] || (cst[key] = { page: '', hop: -9, blinkAt: 2 + (key.length % 5) * .7, phase: key.length * .9 });
    const talk = reading() && who && READ.who.toLowerCase() === who.toLowerCase(), text = talk ? READ.q[READ.i] || '' : '', pk = talk ? READ.i + '|' + text : '';
    if (pk && pk !== s.page) s.hop = tNow; s.page = pk;
    const fname = talk ? crowdFace(text) : 'idle', fr = CAST_SPRITES.mender.frames[fname], cv = set[fname], dress = DRESS[key] || {};
    const k = H / CAST_SPRITES.mender.frames.idle.h, br = Math.sin(tNow * 2.2 + s.phase), sy = 1 + .016 * br + (talk ? Math.sin(tNow * 9) * .012 : 0), sx = 1 - .011 * br;
    const th = tNow - s.hop, dy = th < .42 ? -Math.sin(th / .42 * Math.PI) * H * .09 : 0, land = th >= .42 && th < .56 ? 1 - .07 * Math.sin((th - .42) / .14 * Math.PI) : 1;
    if (dress.side && PROP[dress.side].complete) { const p = CAST_PROPS[dress.side], ph = H * SIDE_H[dress.side], pw = ph * p.w / p.h, px = X + fr.w * k * .32;      /* on the ground, to the right */
      cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(px + pw * .45, feet, pw * .42, Math.max(2, H * .03), 0, 0, 7); cx.fill(); cx.drawImage(PROP[dress.side], px, feet - ph, pw, ph); }
    cx.fillStyle = 'rgba(0,0,0,.24)'; cx.beginPath(); cx.ellipse(X, feet, fr.w * k * .3, Math.max(2, H * .045), 0, 0, 7); cx.fill();
    cx.save(); cx.translate(X, feet + dy); cx.scale(k * sx * (2 - land), k * sy * land); cx.drawImage(cv, -fr.ax, -fr.ay, fr.w, fr.h);
    if (dress.head && PROP[dress.head].complete) { const p = CAST_PROPS[dress.head], [rx, ry, hw, top] = fr.rim, lidH = ry - top;      /* on the lid: the brim at the lid's rim, never down over the eyes */
      if (dress.head === 'hat') { const w = hw * 2 * 1.18, h = w * p.h / p.w; cx.drawImage(PROP.hat, rx - w / 2 - fr.ax, ry + lidH * .08 - h - fr.ay, w, h); }
      else { const w = hw * 2 * 1.12, h = Math.min(w * p.h / p.w, lidH * 1.25); cx.drawImage(PROP[dress.head], rx - w / 2 - fr.ax, top - lidH * .15 - fr.ay, w, h); } }
    if (tNow > s.blinkAt + .14) s.blinkAt = tNow + 2.5 + ((Math.sin(tNow * 12.9898 + s.phase) * 43758.5453) % 1 + 1) % 1 * 2.5;
    if (tNow >= s.blinkAt && tNow < s.blinkAt + .14) for (const [ex, ey, erx, ery] of fr.eyes) { const ox = ex - fr.ax, oy = ey - fr.ay;
      cx.fillStyle = col; cx.beginPath(); cx.ellipse(ox, oy, erx * 1.12, ery * 1.12, 0, 0, 7); cx.fill(); cx.strokeStyle = INK; cx.lineWidth = Math.max(2.5, ery * .2); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(ox - erx * .95, oy + ery * .1); cx.quadraticCurveTo(ox, oy + ery * .55, ox + erx * .95, oy + ery * .1); cx.stroke(); cx.lineCap = 'butt'; }
    cx.restore(); return true; }
  /* on the walking map: a Mender of the crowd stands on its square (the Rillfolk are another people, and keep the game's drawing) */
  const grows = {};      /* a Mender talking on the map grows a little, so the face and the hop can be seen [Proposal, after Marc: "right now they're not really moving in any way"] */
  function crowd(t, X, Y, ts) { if (t.folk === 'rill') return false; const talk = reading() && READ.who.toLowerCase() === String(t.name).toLowerCase(), g = grows[t.id] = (grows[t.id] || 1) + ((talk ? 1.35 : 1) - (grows[t.id] || 1)) * .12;
    return mender(t.id, t.col || '#c9793a', X, Y + ts * .34, ts * .82 * g, t.name); }
  return { draw, faceFor, mender, crowd, crowdFace, test: { blinkNow: c => { st[c].blinkAt = tNow; } } };      /* test: for checks only */
})();
/*WORLD-CAST-END*/
