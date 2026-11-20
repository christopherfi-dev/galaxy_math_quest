// Does the game file still parse?   A ten-second check to run after every edit, before any play test.
// It reads each <script> in the game file and asks the JavaScript engine to parse it. It runs nothing.
// It also warns about ?. and ??, which older iPads do not understand.
// Run:  node checks/parse_check.js [file ...]      (with no file: the game, the class copy and the preview copy)
const fs = require('fs'), path = require('path');
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['prototypes/kis_station_sketch.html', 'docs/index.html', 'docs/next/index.html'].map(f => path.join(__dirname, '..', f));
let bad = 0;
for (const f of files) { const h = fs.readFileSync(f, 'utf8'); let n = 0;
  try { for (const m of h.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)) { new Function(m[1]); n++; } } catch (e) { bad++; console.log(path.basename(path.dirname(f)) + '/' + path.basename(f) + ': DOES NOT PARSE: ' + e.message); continue; }
  const js = h.replace(/<style[\s\S]*?<\/style>/g, ''), ver = (h.match(/id="t_ver">([^<]*)</) || [0, '?'])[1];
  console.log(path.basename(path.dirname(f)) + '/' + path.basename(f) + ': ' + ver + ', scripts parsed: ' + n + (/\?\.|\?\?/.test(js) ? '  WARNING: ?. or ?? found' : '')); }
console.log(bad ? 'RESULT: FAIL' : 'RESULT: PASS'); process.exit(bad ? 1 : 0);
