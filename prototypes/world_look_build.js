// Makes prototypes/world_look_sample.html: the big world page (prototypes/big_world.html) with the new look put in.   [Proposal, 24 November 2026]
// The big world thread owns prototypes/big_world.html. This script never changes it. It reads it, and writes a copy.
// Run it again whenever the big world page changes:   node prototypes/world_look_build.js
// Each change below must match exactly once, or the script stops and says which did not. That is how a change in the big world page is caught.
const fs = require('fs'), path = require('path');
const here = __dirname, src = path.join(here, 'big_world.html'), kitFile = path.join(here, 'world_look_kit.js'), out = path.join(here, 'world_look_sample.html');
let html = fs.readFileSync(src, 'utf8'); const kit = fs.readFileSync(kitFile, 'utf8');
const once = (what, from, to) => { const n = typeof from === 'string' ? html.split(from).length - 1 : (html.match(new RegExp(from.source, 'g')) || []).length;
  if (n !== 1) { console.error(`STOP: "${what}" matched ${n} times, not once. The big world page has changed; look at it before going on.`); process.exit(1); }
  html = html.replace(from, typeof from === 'string' ? () => to : to); };      /* a plain text change is put in as it is: no $ patterns */
for (const name of ['WL', 'tallOld', 'b_look']) if (new RegExp('\\b' + name + '\\b').test(html)) { console.error(`STOP: the big world page already uses the name ${name}.`); process.exit(1); }
// 1. the page's own tree, rock and house drawing stays, under a new name; the new look draws trees and hands the rest back to it
once('the tall function', 'function tall(t, x, y, px, py, ts) {', 'function tallOld(t, x, y, px, py, ts) {');
// 2. the new look itself, just after the page's drawing tools for the map
once('the place for the kit', '/* things on the map */', kit + '\n/* things on the map */');
// 3. the ground: the new look, or the page's own when "Old look" is chosen
const loop = 'for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const t = MAP[y][x], px = X(x), py = Y(y), g = GATEOF[key(x, y)]; ground(TALL.indexOf(t) >= 0 ? \'.\' : t, x, y, px, py, ts); if (g) drawGate(g, px, py, ts, x, y); }';
once('the ground loop in drawMap', loop, 'if (WL.on) WL.ground(x0, y0, x1, y1, X, Y, ts); else ' + loop);
// 5. its own save, so the sample never writes over a child's big world game
once('the save key', /const KEY = 'gmq-bigworld-v1'/, "const KEY = 'gmq-bigworld-looksample-v1'");
once('the version', /const VERSION = '([^']*)'/, "const VERSION = '$1, new look sample'");
once('the title', /<title>[^<]*<\/title>/, '<title>Algora New Look</title>');
if (/\?\.|\?\?/.test(kit)) { console.error('STOP: the kit uses ?. or ??, which older iPads cannot read.'); process.exit(1); }
fs.writeFileSync(out, html);
console.log('wrote ' + path.relative(process.cwd(), out) + ' (' + Math.round(html.length / 1024) + ' KB) from ' + path.relative(process.cwd(), src));
