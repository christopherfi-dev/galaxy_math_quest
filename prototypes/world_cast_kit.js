/*WORLD-CAST-BEGIN  Elder Thimble and Pim from Marc's Gemini pictures, alive in the village.   [Proposal, 24 November 2026]
  [Source: Marc, 24 November: "Put Elder Thimble and Pim into my copy of the big world now, with breathing, blinking, a hop when they talk, and faces that change with their words"]
  Pictures: prototypes/world_cast_sprites.js (CAST_SPRITES), cut out by prototypes/world_cast_build.py. Note: proposals/GMQ_Character_Test_Results_v1_2026-11-24.md
  - They stand where the game drew them, in the village scene. Nothing they say or do is changed; only how they look.
  - Breathing: a slow, small stretch from the feet. Blinking: every 2.5 to 5 seconds (not in a frame with closed eyes).
  - A hop at each new page of their words, and a small bob while their words are up.
  - Their face follows their words: each line in the game has a feeling (the table below); a new line falls back on its last mark (? thinking, ! happy).
  - Pim, until his spinner is given back: sad. After: playing with it. (What the child did shows in the picture.)
  - "Look: old" on the Ship panel shows the game's own drawing, as today. If a picture has not loaded, the game's own drawing is used. */
const CAST = (() => {
  const NAME = { elder: 'Elder Thimble', pim: 'Pim' }, HEIGHT = { elder: 2.3, pim: 1.7 };      /* on-screen height of the calm frame, in the scene's r (about 130 and 95 pixels on an iPad held sideways); taller, the elder covers the pip store */
  const IMG = {};
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
  return { draw, faceFor, test: { blinkNow: c => { st[c].blinkAt = tNow; } } };      /* test: for checks only */
})();
/*WORLD-CAST-END*/
