// Applies engines/gmq-world/wiring/net_v03.js to a game file: node engines/gmq-world/wiring/apply.js <game.html> [out.html]
// With no out file it writes the game file itself; that is the main thread's to do. It changes nothing if any old text is
// missing or found more than once, and says which.
const fs = require('fs'); const path = require('path');
function apply(text) {
  const changes = require(path.join(__dirname, 'net_v03.js')), bad = [];
  changes.forEach(([from, , , want], i) => { const n = text.split(from).length - 1, w = want || 1; if (n !== w) bad.push(`change ${i + 1}: the old text is in the game ${n} times, not ${w === 1 ? 'once' : w + ' times'} (${from.slice(0, 70)}...)`); });
  if (bad.length) return { bad };
  changes.forEach(([from, to]) => { text = text.split(from).join(to); });
  return { text, bad };
}
if (require.main === module) {
  const [src, out] = process.argv.slice(2); if (!src) { console.log('Usage: node apply.js <game.html> [out.html]'); process.exit(2); }
  const r = apply(fs.readFileSync(src, 'utf8')); if (r.bad.length) { r.bad.forEach(b => console.log('  STOP', b)); console.log('Nothing was changed.'); process.exit(1); }
  fs.writeFileSync(out || src, r.text); console.log(`All ${require(path.join(__dirname, 'net_v03.js')).length} changes made in ${out || src}.`);
}
module.exports = apply;
