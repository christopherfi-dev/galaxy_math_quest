// The big world: places a child can walk to and find nothing.   [proposals/GMQ_Big_World_Empty_Places_v1_2026-11-23.md]
// A measure, not a check: nothing passes or fails. It prints each stretch of the Meadow and the Reach that is 9 or more walking steps
// from anything to meet or find, and whether a child can walk into it (from the ship, with the bridge, the stones and the reed gate open).
// Run:  node checks/bigworld_empty_places.js [page.html] [zones.json]
const fs = require('fs'), vm = require('vm'); const path = require('path'), FILE = process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html'), page = fs.readFileSync(FILE, 'utf8'), cut = (a, b) => page.slice(page.indexOf(a), page.indexOf(b) + b.length);
const box = {}; vm.createContext(box); vm.runInContext(cut('/*MAP-BEGIN', '/*MAP-END*/') + '\n' + cut('/*WORLD-BEGIN', '/*WORLD-END*/') + '\n;Object.assign(this, { MAP, REG, MAPW, MAPH, WALK, THINGS });', box);
const { MAP, REG, MAPW, MAPH, WALK, THINGS } = box, key = (x, y) => y * MAPW + x, solid = new Set(THINGS.map(t => key(t.x, t.y)));
const walk = (x, y) => x >= 0 && y >= 0 && x < MAPW && y < MAPH && (WALK.indexOf(MAP[y][x]) >= 0 || MAP[y][x] === 'b') && !solid.has(key(x, y)) && (REG[y][x] === '1' || REG[y][x] === '2');
const dist = new Int32Array(MAPW * MAPH).fill(-1), q = [];
for (const t of THINGS) if (REG[t.y][t.x] === '1' || REG[t.y][t.x] === '2') for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = t.x + dx, y = t.y + dy; if (walk(x, y) && dist[key(x, y)] < 0) { dist[key(x, y)] = 0; q.push(key(x, y)); } }
for (let h = 0; h < q.length; h++) { const k = q[h], x = k % MAPW, y = (k - x) / MAPW; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, nk = key(nx, ny); if (walk(nx, ny) && dist[nk] < 0) { dist[nk] = dist[k] + 1; q.push(nk); } } }
const far = 9, seen = new Uint8Array(MAPW * MAPH), zones = [];
for (let y = 0; y < MAPH; y++) for (let x = 0; x < MAPW; x++) { const k = key(x, y); if (dist[k] < far || seen[k]) continue; const z = [], st = [k]; seen[k] = 1; while (st.length) { const c = st.pop(), cx = c % MAPW, cy = (c - cx) / MAPW; z.push([cx, cy]); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy, nk = key(nx, ny); if (nx >= 0 && ny >= 0 && nx < MAPW && ny < MAPH && dist[nk] >= far && !seen[nk]) { seen[nk] = 1; st.push(nk); } } } if (z.length >= 12) zones.push(z); }
zones.sort((a, b) => b.length - a.length);
for (const z of zones) { const cx = Math.round(z.reduce((a, p) => a + p[0], 0) / z.length), cy = Math.round(z.reduce((a, p) => a + p[1], 0) / z.length), most = Math.max(...z.map(([x, y]) => dist[key(x, y)])), kinds = {}; z.forEach(([x, y]) => { kinds[MAP[y][x]] = (kinds[MAP[y][x]] || 0) + 1; });
  const near = THINGS.filter(t => REG[t.y][t.x] !== '0').sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy))[0];
  console.log(`zone round ${cx},${cy} (region ${REG[cy][cx]}): ${z.length} squares, up to ${most} steps from anything; ground ${JSON.stringify(kinds)}; nearest thing ${near.id} at ${near.x},${near.y}`); }
const OUT = process.argv.find(a => /\.json$/.test(a)); if (OUT) fs.writeFileSync(OUT, JSON.stringify(zones));
// which zones a child can walk into, with the bridge, the stones and the reed gate open (the hedge and the lift lead to lands not built)
const gates = vm.runInContext('GATES', box), shut = new Set(); for (const g of ['hedge', 'lift']) gates[g].tiles.forEach(([x, y]) => shut.add(key(x, y)));
const ok = (x, y) => x >= 0 && y >= 0 && x < MAPW && y < MAPH && (WALK.indexOf(MAP[y][x]) >= 0 || Object.values(gates).some(g => g.tiles.some(t => t[0] === x && t[1] === y))) && !solid.has(key(x, y)) && !shut.has(key(x, y));
const reach = new Uint8Array(MAPW * MAPH), rq = [key(13, 82)]; reach[rq[0]] = 1; for (let h = 0; h < rq.length; h++) { const k = rq[h], x = k % MAPW, y = (k - x) / MAPW; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nk = key(x + dx, y + dy); if (ok(x + dx, y + dy) && !reach[nk]) { reach[nk] = 1; rq.push(nk); } } }
zones.forEach((z, n) => console.log(String.fromCharCode(65 + n), 'reachable squares:', z.filter(([x, y]) => reach[key(x, y)]).length, 'of', z.length));
