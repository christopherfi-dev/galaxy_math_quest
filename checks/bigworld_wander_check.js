// The big world: can a child who does not know the way find things?   [Marc, 23 November: "I couldn't see very far. I didn't know where to walk."]
//
// The play test never gets lost: it knows where everything is. This check plays made-up children who know only the NAME of what they look for.
// A made-up child:
//   - sees only the squares on the walking screen (with the mist: only the squares it has walked near);
//   - taps the thing as soon as it is on the screen;
//   - reads a signpost on the screen that names it, then follows the path the sign points along;
//   - otherwise taps somewhere new on the screen, a path if it can, leaning the way a sign pointed for its next six taps, and not where a tap led nowhere.
// A tap walks as the page does: to the reachable square nearest the tap (with the mist, only through squares already seen; without it, through any square).
// It counts taps until the child stands at the thing. A child who has not found it after 40 taps has given up.
//
// It is a model, not a child. It does not read landmarks (a child may spot the orchard before the machine); it never misreads a sign.
// It is for comparing two versions of the page, not for promising how long a real child takes. Real children: the testing sheet.
//
// Run:  node checks/bigworld_wander_check.js [page.html] [--mist] [--noread]     (--mist: the old way, 12.5 squares across and a mist that lifts 6 squares round the cadet;
//        --noread: a child who never reads a sign)
const fs = require('fs'), path = require('path'), vm = require('vm');
const FILE = process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html'), MIST = process.argv.includes('--mist'), READS = !process.argv.includes('--noread');
const page = fs.readFileSync(FILE, 'utf8'), cut = (a, b) => page.slice(page.indexOf(a), page.indexOf(b) + b.length);
const box = {}; vm.createContext(box); vm.runInContext(cut('/*MAP-BEGIN', '/*MAP-END*/') + '\n' + cut('/*WORLD-BEGIN', '/*WORLD-END*/') + '\n;Object.assign(this, { MAP, MAPW, MAPH, WALK, THINGS, GATES, bwStand });', box);
const { MAP, MAPW, MAPH, WALK, THINGS, GATES } = box; THINGS.forEach(t => { if (!t.stand) t.stand = box.bwStand(t); });
const COLS = MIST ? 12.5 : 16, ROWS = MIST ? 11.4 : 14.6, SIGHT = 6, START = [13, 82], GIVE_UP = 40, KIDS = 1000;
const key = (x, y) => y * MAPW + x, SOLID = new Set(THINGS.map(t => key(t.x, t.y))), SHUT = new Set();
Object.values(GATES).forEach(g => g.tiles.forEach(([x, y]) => SHUT.add(key(x, y))));      // every gate shut: a child on the first day
for (let y = 0; y < MAPH; y++) for (let x = 0; x < MAPW; x++) if (MAP[y][x] === 'O') for (let j = y - 2; j < y; j++) for (let i = x - 1; i <= x + 1; i++) SHUT.add(key(i, j));      // under a big old tree's leaves, as in the page
const walk = (x, y) => x >= 0 && y >= 0 && x < MAPW && y < MAPH && WALK.indexOf(MAP[y][x]) >= 0 && !SOLID.has(key(x, y)) && !SHUT.has(key(x, y));
const rng = seed => { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const DIRS = { north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0] };
// what each goal is called on a sign
const SIGNWORD = { village: /VILLAGE/, m_pond: /POND/, m_wall: /WALL/, m_hill: /HILL/, m_orchard: /ORCHARD/, keeper: /ORCHARD/, pan: /BRIDGE|RILL/, post: /STONES/ };      // the orchard keeper: the name says where
const signs = READS ? THINGS.filter(t => t.kind === 'sign' && t.look) : [];      // --noread: a child who walks past every sign
function signHeading(sign, goal) { const re = SIGNWORD[goal]; if (!re) return null; for (const part of sign.look.replace(/^The sign says: /, '').split('.')) { if (re.test(part)) { const d = (/(north|south|east|west)/.exec(part) || [])[1]; if (d) return DIRS[d]; } } return null; }

function view(cx, cy) { const ox = Math.max(0, Math.min(MAPW - COLS, cx + .5 - COLS / 2)), oy = Math.max(0, Math.min(MAPH - ROWS, cy + .5 - ROWS / 2)); return [Math.floor(ox), Math.floor(oy), Math.min(MAPW - 1, Math.ceil(ox + COLS) - 1), Math.min(MAPH - 1, Math.ceil(oy + ROWS) - 1)]; }
function child(goalId, seed) {
  const r = rng(seed), goal = THINGS.find(t => t.id === goalId), seen = new Uint8Array(MAPW * MAPH), been = new Uint8Array(MAPW * MAPH); let [x, y] = START, taps = 0, idle = 0, heading = null, headLeft = 0; const read = new Set(), nowhere = [];
  const look = () => { if (MIST) { for (let j = y - SIGHT; j <= y + SIGHT; j++) for (let i = x - SIGHT; i <= x + SIGHT; i++) if (i >= 0 && j >= 0 && i < MAPW && j < MAPH && Math.hypot(i - x, j - y) <= SIGHT + .5) seen[key(i, j)] = 1; } else { const [a, b, c, d] = view(x, y); for (let j = b; j <= d; j++) for (let i = a; i <= c; i++) seen[key(i, j)] = 1; } been[key(x, y)] = 1; };
  const onScreen = (i, j) => { const [a, b, c, d] = view(x, y); return i >= a && i <= c && j >= b && j <= d && seen[key(i, j)]; };
  const go = (tx, ty) => { // the page's path finder: breadth first through seen squares, to the reachable square nearest the tap
    const prev = new Int32Array(MAPW * MAPH).fill(-2), q = [key(x, y)]; prev[q[0]] = -1; let best = q[0], bd = Math.hypot(x - tx, y - ty);
    for (let h = 0; h < q.length && bd > 0; h++) { const k = q[h], i = k % MAPW, j = (k - i) / MAPW; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = i + dx, nj = j + dy, nk = key(ni, nj); if (!walk(ni, nj) || prev[nk] !== -2 || (MIST && !seen[nk])) continue; prev[nk] = k; q.push(nk); const d = Math.hypot(ni - tx, nj - ty); if (d < bd) { bd = d; best = nk; } } }
    const route = []; for (let k = best; prev[k] >= 0; k = prev[k]) route.unshift(k); for (const k of route) { x = k % MAPW; y = (k - x) / MAPW; look(); } return route.length; };
  look();
  while (taps < GIVE_UP) {
    if (x === goal.stand[0] && y === goal.stand[1]) return { found: true, taps, idle };
    let tx, ty;
    if (onScreen(goal.x, goal.y)) [tx, ty] = goal.stand;                                                                                    // there it is
    else { const s = signs.find(s => !read.has(s.id) && onScreen(s.x, s.y) && signHeading(s, goalId));
      if (s) { if (x === s.stand[0] && y === s.stand[1]) { read.add(s.id); heading = signHeading(s, goalId); headLeft = 6; continue; } [tx, ty] = s.stand; }  // walk to the sign and read it
      else { const [a, b, c, d] = view(x, y); let best = null, bs = -1e9;      // somewhere new: not where it has been, not where a tap led nowhere, a path if it can, the way a sign pointed if one did
        for (let j = b; j <= d; j++) for (let i = a; i <= c; i++) { if (!seen[key(i, j)] || !walk(i, j) || (i === x && j === y) || been[key(i, j)] || nowhere.some(([p, q]) => Math.abs(p - i) <= 2 && Math.abs(q - j) <= 2)) continue;
          let near = 6; for (let dj = -5; dj <= 5; dj++) for (let di = -5; di <= 5; di++) { const ii = i + di, jj = j + dj; if (ii >= 0 && jj >= 0 && ii < MAPW && jj < MAPH && been[key(ii, jj)]) near = Math.min(near, Math.hypot(di, dj)); }
          const len = Math.hypot(i - x, j - y) || 1, along = heading && headLeft > 0 ? 3 * ((i - x) * heading[0] + (j - y) * heading[1]) / len : 0, sc = near + ((MAP[j][i] === ':' || MAP[j][i] === 'b') ? 2 : 0) + along + 2 * r();
          if (sc > bs) { bs = sc; best = [i, j]; } }
        if (!best) { taps++; idle++; nowhere.length = 0; continue; }      // nothing new on the screen: a tap that goes nowhere, then it looks again
        [tx, ty] = best; } }
    taps++; headLeft--; const moved = go(tx, ty); if (moved <= 1) { idle++; nowhere.push([tx, ty]); } }
  return { found: false, taps, idle }; }

const GOALS = ['village', 'm_pond', 'm_wall', 'm_hill', 'm_orchard', 'keeper', 'gran', 'fisher', 'cutter', 'pan', 'post'].filter(id => THINGS.some(t => t.id === id));
console.log(`${path.basename(FILE)}${MIST ? ', with the old mist and 12.5 squares across' : ', no mist, 16 squares across'}${READS ? '' : ', a child who reads no sign'}. ${KIDS} made-up children for each, each starting at the ship.`);
console.log('  looking for       taps (middle, 9 in 10 within)   gave up   taps that walked 0 or 1 square');
const out = {};
for (const g of GOALS) { const res = []; for (let s = 1; s <= KIDS; s++) res.push(child(g, s * 7919 + g.length)); const t = res.filter(o => o.found).map(o => o.taps).sort((a, b) => a - b), q = p => t.length ? t[Math.min(t.length - 1, Math.floor(p * t.length))] : '-';
  const gave = res.filter(o => !o.found).length, idle = res.reduce((a, o) => a + o.idle, 0) / KIDS; out[g] = { mid: q(.5), p90: q(.9), gave };
  console.log(`  ${g.padEnd(16)}  ${String(q(.5)).padStart(4)} ${String(q(.9)).padStart(10)}                ${String(Math.round(gave / KIDS * 100) + '%').padStart(5)}     ${idle.toFixed(1)} a child`); }
module.exports = out;
