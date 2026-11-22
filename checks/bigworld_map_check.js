// The big world's map and its tables, checked by code.   [Handoff: HANDOFF_Big_World_2026-11-22.md, section 8: "The map itself, checked by code"]
//
// It reads the map and the world tables straight out of the page (MAP-BEGIN..MAP-END and WORLD-BEGIN..WORLD-END in prototypes/big_world.html)
// and runs the page's own check, bwCheck(), outside a browser.
//
//   1  the letters in the page are exactly what checks/bigworld_map_build.js paints (nobody changed one by hand and forgot the builder)
//   2  the map is 128 x 96, every row is full, every letter is one the page knows how to draw
//   3  bwCheck() finds no fault:
//        every thing can be reached; nothing that is not built can be reached; every border on the main road has two ways,
//        and each way alone gets across; no main job needs a secret; every find has a use or is scenery; no job waits on a place not built;
//        the law of the road (leave any one people's quest undone: every people can still be reached); a tool is never a border's way;
//        no big quest needs a thing from another region; every mini quest step has its line for the Needs list; every item is used
//   4  the check CAN fail: fifteen broken copies of the world are fed to it, and it must catch each one
//   5  every line a being says is short; every thing has a word to tap; no two things near each other share their first word... except the four machines, which are far apart
//   6  the walks are short: from the ship, every thing in the Meadow is within 75 steps, and no thing is more than 16 steps from the next nearest thing
//
// Run:  node checks/bigworld_map_check.js
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');
const file = path.resolve(__dirname, '..', 'prototypes', 'big_world.html'), page = fs.readFileSync(file, 'utf8');
const cut = (a, b) => { const i = page.indexOf(a), j = page.indexOf(b); if (i < 0 || j < 0) { console.log(`FAILED: no ${a} .. ${b} in the page`); process.exit(1); } return page.slice(i, j + b.length); };
const SRC = cut('/*MAP-BEGIN', '/*MAP-END*/') + '\n' + cut('/*WORLD-BEGIN', '/*WORLD-END*/') + '\n;Object.assign(this, { MAP, REG, MAPW, MAPH, WALK, REGIONS, THINGS, SCENES, GATES, BORDERS, JOBS, ITEMS, PEOPLES, bwCheck, bwStand });';
const world = () => { const box = {}; vm.createContext(box); vm.runInContext(SRC, box); box.THINGS.forEach(t => { if (!t.stand) t.stand = box.bwStand(t); }); return box; };
const bad = [], say = (ok, what) => { if (!ok) bad.push(what); };

// 1. the page holds what the builder paints
const built = execFileSync('node', [path.resolve(__dirname, 'bigworld_map_build.js'), '--block'], { encoding: 'utf8', maxBuffer: 1 << 24 });
say(built === cut('/*MAP-BEGIN', '/*MAP-END*/'), 'the map in the page is not what checks/bigworld_map_build.js paints. Run the builder, or put the change into it.');

// 2. shape and letters
const W = world(), KNOWN = '~.:,*swcpdRTtarH^#mDbS';
say(W.MAPW === 128 && W.MAPH === 96 && W.MAP.length === 96 && W.REG.length === 96, `the map is ${W.MAPW} x ${W.MAPH} with ${W.MAP.length} rows`);
W.MAP.forEach((r, y) => { say(r.length === 128, `row ${y} is ${r.length} long`); for (const c of r) if (KNOWN.indexOf(c) < 0) say(false, `row ${y} has the letter "${c}", which the page cannot draw`); });
W.REG.forEach((r, y) => { say(r.length === 128 && /^[0-9]+$/.test(r), `region row ${y} is wrong`); });
for (let y = 0; y < 96; y++) for (let x = 0; x < 128; x++) if (W.MAP[y][x] !== '~' && W.REG[y][x] === '0') { say(false, `land at ${x},${y} belongs to no region`); y = 96; break; }

// 3. the page's own check
const faults = W.bwCheck(); say(faults.length === 0, 'bwCheck: ' + faults.join(' | '));

// 4. the check can fail
const breaks = [
  ['a main job needs a secret', w => { w.JOBS.plates.needs.push('coin'); }, /main road and needs a secret/],
  ['a border with one way', w => { w.BORDERS[0].ways.pop(); }, /only one way across/],
  ['two ways with the same maths', w => { w.JOBS.stones.maths = w.JOBS.bridge.maths; }, /same maths/],
  ['a hole in the old wall', w => { w.MAP[55] = w.MAP[55].slice(0, 30) + '.' + w.MAP[55].slice(31); }, /can be reached/],
  ['a thing in the water', w => { const t = w.THINGS.find(t => t.id === 'well'); t.x = 10; t.y = 67; t.stand = [10, 68]; }, /cannot be walked on|cannot be reached/],
  ['a find that leads nowhere', w => { delete w.THINGS.find(t => t.id === 'ring').scenery; }, /leads nowhere/],
  ['the law of the road: both ways over the river lean on the Menders\' quest', w => { w.JOBS.stones.uses = ['plates']; }, /law of the road/],
  ['a tool as one of a border\'s two ways', w => { w.JOBS.stones.tool = 'raft'; }, /A tool is never/],
  ['a big quest that needs a thing from another region', w => { w.JOBS.plates.needs.push('rope'); }, /another region|does not need it/],
  ['a mini quest step with no line for the Needs list', w => { delete w.JOBS.well.steps[2].need; }, /no line for the Needs list/],
  ['an item nothing uses', w => { delete w.ITEMS.rope.use; }, /nothing uses it/],
  ['a job in a region that is not built', w => { w.JOBS.coin.region = 3; }, /not built/],
  ['an item from nowhere', w => { w.ITEMS.coin.from = 'nobody'; }, /does not exist|from nowhere/],
  ['a secret that holds maths help for a main job', w => { w.ITEMS.shard.helps = 'plates'; }, /help with the maths must be open/],
  ['a secret that gives a main job', w => { w.THINGS.find(t => t.id === 'post').secret = true; }, /is a secret and gives a main job/] ];
for (const [name, fn, want] of breaks) { const w = world(); fn(w); const f = w.bwCheck(); say(f.length > 0 && f.some(x => want.test(x)), `the check did not catch: ${name} (it said: ${f.join(' | ') || 'nothing'})`); }

// 5. words
W.THINGS.forEach(t => { say(t.words && t.words.length && /^[a-z]+$/.test(t.words[0]), `${t.id}: no word to tap`); say(!!t.name, `${t.id}: no name`); (t.says || []).concat(t.then ? t.then.says : [], t.look ? [t.look] : []).forEach(s => say(s.length <= 150, `${t.id}: a line of ${s.length} letters is too long to read at once`)); });
Object.keys(W.SCENES).forEach(s => W.SCENES[s].things.forEach(t => say(t.words && t.words.length && t.x > 0 && t.x < 1, `scene ${s}: ${t.id} has no word or no place`)));
for (const a of W.THINGS) for (const b of W.THINGS) if (a.id < b.id && a.words[0] === b.words[0] && Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)) <= 6 && !(a.words[1] && b.words[1] && a.words[1] !== b.words[1])) say(false, `${a.id} and ${b.id} are close and share the word "${a.words[0]}"`);

// 6. walks are short
{ const key = (x, y) => y * 128 + x, solid = {}; W.THINGS.forEach(t => { solid[key(t.x, t.y)] = 1; });
  const dist = from => { const d = new Int32Array(128 * 96).fill(-1), q = [from]; d[key(from[0], from[1])] = 0; for (let h = 0; h < q.length; h++) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = q[h][0] + dx, y = q[h][1] + dy, k = key(x, y); if (x < 0 || y < 0 || x > 127 || y > 95 || d[k] >= 0 || solid[k] || W.WALK.indexOf(W.MAP[y][x]) < 0) continue; d[k] = d[key(q[h][0], q[h][1])] + 1; q.push([x, y]); } return d; };
  const meadow = W.THINGS.filter(t => W.REG[t.y][t.x] === '1'), ship = W.THINGS.find(t => t.id === 'ship'), dShip = dist(ship.stand); let far = 0, lonely = 0, who = '', who2 = '';
  for (const t of meadow) { const d = dShip[key(t.stand[0], t.stand[1])]; if (d > far) { far = d; who = t.id; } const dt = dist(t.stand); let near = 1e9; for (const o of meadow) if (o !== t) near = Math.min(near, dt[key(o.stand[0], o.stand[1])]); if (near > lonely) { lonely = near; who2 = t.id; } }
  say(far <= 75, `the furthest thing from the ship (${who}) is ${far} steps away`); say(lonely <= 16, `${who2} is ${lonely} steps from the nearest other thing`);
  console.log(`things on the map: ${W.THINGS.length} (${meadow.length} in the Meadow); furthest from the ship: ${who}, ${far} steps (about ${Math.round(far / 5.4)} seconds); the loneliest thing: ${who2}, ${lonely} steps from its nearest neighbour`); }
const land = W.MAP.join('').split('').filter(c => c !== '~').length, meadowSq = W.REG.join('').split('').filter(c => c === '1').length;
console.log(`the map: 128 x 96 = ${128 * 96} squares; ${land} are land; the Mender Meadow is ${meadowSq} of them (${Math.round(meadowSq / land * 100)}%)`);
console.log(bad.length ? 'FAILED:\n  ' + bad.join('\n  ') : `ok: the map is what the builder paints, the world check finds no fault, and it caught all ${breaks.length} broken copies`);
process.exit(bad.length ? 1 : 0);
