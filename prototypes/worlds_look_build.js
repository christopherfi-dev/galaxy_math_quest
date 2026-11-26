// Makes prototypes/worlds_look_sample.html: the class game (prototypes/kis_station_sketch.html) with two worlds in a new look: Operation Stardust's ship drawn like the station,
// and Planet Chronosia's map drawn like the big world.   [Proposal, 26 November 2026]
// The main thread owns the class game. This script never changes it. It reads it, and writes a copy. Notes: proposals/GMQ_Stardust_Look_v1_2026-11-26.md, proposals/GMQ_Worlds_Look_v1_2026-11-26.md
// Run it again whenever the game changes:   node prototypes/worlds_look_build.js [output.html]
// Each change below must match exactly once, or the script stops and says which did not. That is how a change in the game is caught.
const fs = require('fs'), path = require('path');
const here = __dirname, src = path.join(here, 'kis_station_sketch.html'), out = process.argv[2] ? path.resolve(process.argv[2]) : path.join(here, 'worlds_look_sample.html');
let html = fs.readFileSync(src, 'utf8'); const kit = fs.readFileSync(path.join(here, 'star_look_kit.js'), 'utf8'), ckit = fs.readFileSync(path.join(here, 'chrono_look_kit.js'), 'utf8');
const once = (what, from, to) => { const n = html.split(from).length - 1;
  if (n !== 1) { console.error(`STOP: "${what}" matched ${n} times, not once. The game has changed; look at it before going on.`); process.exit(1); }
  html = html.replace(from, () => to); };
for (const name of ['SLK', 'CHLK', 't_slk']) if (new RegExp('\\b' + name + '\\b').test(html)) { console.error(`STOP: the game already uses the name ${name}.`); process.exit(1); }
if (/\?\.|\?\?/.test(kit + ckit)) { console.error('STOP: the kit uses ?. or ??, which older iPads cannot read.'); process.exit(1); }
// 1. the kit, just before the ship is drawn (it uses the ship's own SRM, SDOOR, sRoomAt, sSeen, SM and SD)
once('the start of drawStar', 'function drawStar(dt) {', kit + '\nfunction drawStar(dt) {');
// 2. the ship's floors and walls: the new look, or the game's own when "Ship look: old"
once('the ship\'s floors and walls (start)', "  cx.fillStyle = '#05070f'; cx.fillRect(0, 0, w, h);\n  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const k = sRoomAt(x, y), px = Xs(x), py = Ys(y);",
  "  if (SLK.on) SLK.ship(x0, x1, y0, y1, Xs, Ys, ts, w, h, c); else { cx.fillStyle = '#05070f'; cx.fillRect(0, 0, w, h);\n  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const k = sRoomAt(x, y), px = Xs(x), py = Ys(y);");
once('the ship\'s floors and walls (end)', "\n  ST.forEach(t => { if (c.seen.indexOf(sThingRoom(t)) < 0) return;", " }\n  ST.forEach(t => { if (c.seen.indexOf(sThingRoom(t)) < 0) return;");
// 2b. Chronosia's map: the kit just before its map is drawn; the ground loop becomes the old look's half
once('Chronosia\'s ground (start)', "  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { if (!cSeen(x, y)) continue; const t = cTile(x, y), px = X(x), py = Y(y);",
  "  if (CHLK.on) CHLK.ground(X, Y, ts, c); else {\n  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { if (!cSeen(x, y)) continue; const t = cTile(x, y), px = X(x), py = Y(y);");
once('Chronosia\'s ground (end)', "\n  fDraw('chrono', X, Y, ts);", " }\n  fDraw('chrono', X, Y, ts);");
once('the start of drawCMap', 'function drawCMap(dt) {', ckit + '\nfunction drawCMap(dt) {');      /* after the patches above: the kit has a loop like the game's */
// 3. a switch in the Teacher row, beside "Go to Stardust"
once('the Teacher row\'s Stardust button', 'id="t_std">Go to Stardust</button>', 'id="t_std">Go to Stardust</button><button class="word" type="button" id="t_slk">World look: new</button>');
// 4. its own save, title and version, so it can never touch the class's game on the same iPad
once('the save key', "const KEY = 'gmq-station-sketch-v6'", "const KEY = 'gmq-worlds-looksample-v1'");
once('the title', '<title>KIS Station Sketch</title>', '<title>Worlds New Look</title>');
once('the version', /Sketch version (\d+)/.exec(html)[0], /Sketch version (\d+)/.exec(html)[0] + ', worlds look sample');
fs.writeFileSync(out, html);
console.log('wrote ' + path.relative(process.cwd(), out) + ' (' + Math.round(html.length / 1024) + ' KB) from ' + path.relative(process.cwd(), src));
