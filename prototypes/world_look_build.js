// Makes prototypes/world_look_sample.html: the big world page (prototypes/big_world.html) with the new look put in.   [Proposal, 24 November 2026]
// The big world thread owns prototypes/big_world.html. This script never changes it. It reads it, and writes a copy.
// Run it again whenever the big world page changes:   node prototypes/world_look_build.js
// Each change below must match exactly once, or the script stops and says which did not. That is how a change in the big world page is caught.
const fs = require('fs'), path = require('path');
const here = __dirname, src = path.join(here, 'big_world.html'), kitFile = path.join(here, 'world_look_kit.js'), out = process.argv[2] ? path.resolve(process.argv[2]) : path.join(here, 'world_look_sample.html');      /* another place to write it: for trying a change while a test runs on the sample */
let html = fs.readFileSync(src, 'utf8'); const kit = fs.readFileSync(kitFile, 'utf8');
const cast = fs.readFileSync(path.join(here, 'world_cast_sprites.js'), 'utf8') + fs.readFileSync(path.join(here, 'world_cast_kit.js'), 'utf8') + fs.readFileSync(path.join(here, 'world_opening_kit.js'), 'utf8');      /* Elder Thimble and Pim from Gemini, alive in the village */
const once = (what, from, to) => { const n = typeof from === 'string' ? html.split(from).length - 1 : (html.match(new RegExp(from.source, 'g')) || []).length;
  if (n !== 1) { console.error(`STOP: "${what}" matched ${n} times, not once. The big world page has changed; look at it before going on.`); process.exit(1); }
  html = html.replace(from, typeof from === 'string' ? () => to : to); };      /* a plain text change is put in as it is: no $ patterns */
for (const name of ['WL', 'tallOld', 'CAST', 'CAST_SPRITES', 'OPENING', 'readskip']) if (new RegExp('\\b' + name + '\\b').test(html)) { console.error(`STOP: the big world page already uses the name ${name}.`); process.exit(1); }
// 1. the page's own tree, rock and house drawing stays, under a new name; the new look draws trees and hands the rest back to it
once('the tall function', 'function tall(t, x, y, px, py, ts) {', 'function tallOld(t, x, y, px, py, ts) {');
// 2. the new look itself, just after the page's drawing tools for the map
once('the place for the kit', '/* things on the map */', kit + '\n' + cast + '\n/* things on the map */');
// 3. the ground: the new look, or the page's own when "Look: old" is chosen on the Ship panel
const loop = 'for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const t = MAP[y][x], px = X(x), py = Y(y), g = GATEOF[key(x, y)]; ground(TALL.indexOf(t) >= 0 ? \'.\' : t, x, y, px, py, ts); if (g) drawGate(g, px, py, ts, x, y); }';
once('the ground loop in drawMap', loop, 'if (WL.on) WL.ground(x0, y0, x1, y1, X, Y, ts); else ' + loop);
// 3b. Elder Thimble and Pim in the village: the Gemini pictures, or the page's own drawing when "Look: old" is chosen or a picture has not loaded
once('Pim in the village', "else if (t.id === 'kid') mender(X, base - r * .62, r * .62, '#e09a55', 1, '');", "else if (t.id === 'kid') { if (!CAST.draw('pim', X, base, r)) mender(X, base - r * .62, r * .62, '#e09a55', 1, ''); }");
once('the elder in the village', "else if (t.id === 'elder') mender(X, base - r * 1.02, r * 1.02, '#b86a2a', 2, 'elder');", "else if (t.id === 'elder') { if (!CAST.draw('elder', X, base, r)) mender(X, base - r * 1.02, r * 1.02, '#b86a2a', 2, 'elder'); }");
// 3b2. the crowd: on the walking map (the Rillfolk keep the page's drawing), and the Mender at the first lesson
once('the crowd on the map', "else if (t.kind === 'being') (t.folk === 'rill' ? rillfolk : mender)(X, Y + ts * .02, ts * .3, t.col || '#c9793a', t.x * 3 + t.y, '');",
  "else if (t.kind === 'being') { if (!CAST.crowd(t, X, Y, ts)) (t.folk === 'rill' ? rillfolk : mender)(X, Y + ts * .02, ts * .3, t.col || '#c9793a', t.x * 3 + t.y, ''); }");
once('the Mender at the first lesson', "mender(w * .08 + bw * .62, h * .84, bw * .1, '#c9793a', 5, '');",
  "if (!CAST.mender('lesson', '#c9793a', w * .08 + bw * .62, h * .84 + bw * .098, bw * .27, 'A Mender')) mender(w * .08 + bw * .62, h * .84, bw * .1, '#c9793a', 5, '');");
// 3d. the start [Marc, 24 November]: land on the meadow and be met there; a way to skip the start once it has been seen (prototypes/world_opening_kit.js)
once('the reading card\'s top line', '<div id="readwho"></div>', '<button class="btn quiet" id="readskip" type="button" hidden>Skip the start ›</button><div id="readwho"></div>');
once('the reading card shown', "function showRead() { const rd = $('read');", "function showRead() { const rd = $('read'); $('readskip').hidden = !OPENING.canSkip();");
once('a tap on the card while OK sleeps', "e.target.closest('#readsay')", "e.target.closest('#readsay, #readskip')");
once('the story\'s pictures', "function introPic() { return { title: 'Galaxy Patternox', draw(w, h) { const s = READ.i;",
  "function introPic() { return { title: 'Galaxy Patternox', draw(w, h) { const s = READ.i; if (s >= 5) { if (this.title !== hereName()) { this.title = hereName(); setPlace(); } drawMap(.016); return; }      /* the last page, \"You land in a green meadow\": the meadow itself */");
once('after the story', "save(); if (!flag('lessonDone') && !flag('metElder')) startLesson(); }, 'Mission'); }", "save(); if (!flag('lessonDone') && !flag('metElder')) OPENING.greet(); }, 'Mission'); }");
once('landed, lesson not done', "else if (!flag('lessonDone') && !flag('metElder')) startLesson();", "else if (!flag('lessonDone') && !flag('metElder')) OPENING.greet();");
once('the lesson\'s first words', "if (L.step === 0) tell(['Welcome to ' + PLANET + ', visitor from the sky! I am a Mender. We keep the machines here.', 'Before you go anywhere, let me show you how we work.', 'We use machines like this one. Each machine follows one rule. Watch.'], ",
  "if (L.step === 0) tell((L.greeted ? [] : ['Welcome to ' + PLANET + ', visitor from the sky! I am a Mender. We keep the machines here.', 'Before you go anywhere, let me show you how we work.']).concat(['We use machines like this one. Each machine follows one rule. Watch.']), ");
once('the lesson\'s end', "function finishLesson() { setFlag('lessonDone');", "function finishLesson() { OPENING.mark(); setFlag('lessonDone');");
once('the names on the map', '  for (const t of THINGS) { if (!t.label || !thingSeen(t)', '  OPENING.drawGreeter(X, Y, ts);\n  for (const t of THINGS) { if (!t.label || !thingSeen(t)');
// 3c. the page lets in no pictures at all; the characters are pictures held inside the page itself (data:), so those are let in. Still nothing is asked of the internet but the fonts.
once('the page\'s safety rule', `content="default-src 'none'; script-src 'unsafe-inline';`, `content="default-src 'none'; img-src data:; script-src 'unsafe-inline';`);
// 4. sample only: "Look: new / old" on the Ship panel, beside Sound and Music
once('the Music button on the Ship panel', "${btn('music', 'Music: ' + (MUS.on ? 'on' : 'off'), 'quiet')}", "${btn('music', 'Music: ' + (MUS.on ? 'on' : 'off'), 'quiet')}${btn('look', 'Look: ' + (WL.on ? 'new' : 'old'), 'quiet')}");
once('the Ship panel\'s Music press', "if (b === 'music') { musSet(!MUS.on); return drawTask(); }", "if (b === 'music') { musSet(!MUS.on); return drawTask(); } if (b === 'look') { WL.toggle(); return drawTask(); }");
// 5. its own save, so the sample never writes over a child's big world game
once('the save key', /const KEY = 'gmq-bigworld-v1'/, "const KEY = 'gmq-bigworld-looksample-v1'");
once('the version', /const VERSION = '([^']*)'/, "const VERSION = '$1, new look sample'");
once('the title', /<title>[^<]*<\/title>/, '<title>Algora New Look</title>');
if (/\?\.|\?\?/.test(kit + fs.readFileSync(path.join(here, 'world_cast_kit.js'), 'utf8'))) { console.error('STOP: the kit uses ?. or ??, which older iPads cannot read.'); process.exit(1); }
fs.writeFileSync(out, html);
console.log('wrote ' + path.relative(process.cwd(), out) + ' (' + Math.round(html.length / 1024) + ' KB) from ' + path.relative(process.cwd(), src));
