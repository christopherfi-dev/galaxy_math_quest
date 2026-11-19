// Counts the dead ends on the station: every thing with every doing word (take, open, push, use), and what the game says back.   [Proposal]
// It is a count for Marc to decide with, not a pass-or-fail test. A flat "no" is not a fault by itself: his Novus engine says "Dead Ends Are Real".
// Run:  node checks/dead_ends_count.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage(); await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(400);
  const r = await p.evaluate(() => { const V = ['look', 'take', 'open', 'push', 'use'], rows = []; Object.keys(OBJ).forEach(id => { const o = OBJ[id], d = DO[id] || {}; V.forEach(v => { const h = d[v]; rows.push({ room: o.room, id, label: o.label || id, v, kind: h === undefined ? 'default' : typeof h === 'string' ? 'words' : 'acts', text: h === undefined ? NOPE[v] : typeof h === 'string' ? h : '' }); }); }); return rows; });
  const total = r.length, def = r.filter(x => x.kind === 'default' && x.v !== 'look'), words = r.filter(x => x.kind === 'words' && x.v !== 'look');
  const flat = words.filter(x => x.text.split(/[.!?]/).filter(s => s.trim()).length <= 1);   // one short sentence: a "no" and nothing more
  console.log(`things: ${new Set(r.map(x => x.id)).size}, thing-and-word pairs (take, open, push, use): ${r.filter(x => x.v !== 'look').length}`);
  console.log(`  the game's stock reply (dead end): ${def.length}`); console.log(`  the thing's own reply, one sentence only: ${flat.length}`); console.log(`  the thing's own reply with a second sentence: ${words.length - flat.length}`); console.log(`  does something: ${r.filter(x => x.kind === 'acts' && x.v !== 'look').length}`);
  console.log('\nARRIVAL DOCK, every pair:'); r.filter(x => x.room === 'dock' && x.v !== 'look').forEach(x => console.log(`  ${x.v.padEnd(5)} ${x.label.padEnd(12)} ${x.kind.padEnd(8)} ${x.text}`));
  await b.close(); })();
