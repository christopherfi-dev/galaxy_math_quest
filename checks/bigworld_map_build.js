// The big world's map is made here.   [Handoff: HANDOFF_Big_World_2026-11-22.md]
//
// The map of Planet Algora is 128 squares wide and 96 tall. It is two layers of letters:
//   MAP: what stands on each square (grass, water, a tree, a path ...)
//   REG: which region the square belongs to (0 sea, 1 Mender Meadow, 2 the Reach ...)
// This file paints both from a short list of shapes, the same way every time (no chance in it),
// and writes them into prototypes/big_world.html between the marks MAP-BEGIN and MAP-END.
// The page never makes its own map: it reads the letters. A person or an AI can change a letter by hand,
// but then this file must be changed too, or the next run will paint over it.
// checks/bigworld_map_check.js checks the map in the page: it must equal what this file paints, and every place must be reachable.
//
// Run:  node checks/bigworld_map_build.js            paints the map into the page
//       node checks/bigworld_map_build.js --print    prints the two layers and changes nothing
const fs = require('fs'), path = require('path');
const W = 128, H = 96;
const M = [], R = [];
for (let y = 0; y < H; y++) { M.push(new Array(W).fill('~')); R.push(new Array(W).fill(0)); }

// ---- chance that is the same every time
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function noise(seed, G) { const r = rng(seed), gw = Math.ceil(W / G) + 3, gh = Math.ceil(H / G) + 3, L = []; for (let i = 0; i < gw * gh; i++) L.push(r()); const sm = t => t * t * (3 - 2 * t);
  return (x, y) => { const gx = x / G + 1, gy = y / G + 1, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = sm(gx - x0), fy = sm(gy - y0), a = L[y0 * gw + x0], b = L[y0 * gw + x0 + 1], c = L[(y0 + 1) * gw + x0], d = L[(y0 + 1) * gw + x0 + 1]; return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy; }; }
const n1 = noise(11, 9), n2 = noise(23, 5), n3 = noise(37, 14);
const rnd = rng(4242);

// ---- brushes
const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
const get = (x, y) => inb(x, y) ? M[y][x] : '~';
const set = (x, y, c, only) => { x = Math.round(x); y = Math.round(y); if (!inb(x, y)) return; if (only && only.indexOf(M[y][x]) < 0) return; M[y][x] = c; };
function rect(x0, y0, x1, y1, c, only) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, c, only); }
function blob(cx, cy, rx, ry, c, wob, only, seedN) { const nz = seedN || n2; for (let y = Math.floor(cy - ry - 3); y <= cy + ry + 3; y++) for (let x = Math.floor(cx - rx - 3); x <= cx + rx + 3; x++) { const d = Math.hypot((x - cx) / rx, (y - cy) / ry); if (d < 1 + ((nz(x, y) - .5) * 2) * (wob || 0)) set(x, y, c, only); } }
function line(pts, wd, c, only) { for (let i = 0; i < pts.length - 1; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], n = Math.ceil(Math.hypot(bx - ax, by - ay) * 2); for (let k = 0; k <= n; k++) { const x = ax + (bx - ax) * k / n, y = ay + (by - ay) * k / n; if (wd <= 1) set(x, y, c, only); else for (let dy = -wd; dy <= wd; dy++) for (let dx = -wd; dx <= wd; dx++) if (Math.hypot(dx, dy) <= wd / 2 + .01) set(x + dx, y + dy, c, only); } } }
// a path that only moves along rows and columns, so the astronaut can always walk it
function road(pts, c, only) { for (let i = 0; i < pts.length - 1; i++) { let [x, y] = pts[i]; const [bx, by] = pts[i + 1]; set(x, y, c, only); while (x !== bx) { x += Math.sign(bx - x); set(x, y, c, only); } while (y !== by) { y += Math.sign(by - y); set(x, y, c, only); } } }
function scatter(x0, y0, x1, y1, c, chance, only) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (rnd() < chance) set(x, y, c, only); }
function region(x0, y0, x1, y1, id) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inb(x, y) && M[y][x] !== '~') R[y][x] = id; }

// ---- 1. the land: one big island with a wobbly coast
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const ex = Math.max(0, Math.abs(x - 64) - 46) / 14, ey = Math.max(0, Math.abs(y - 48) - 30) / 14, d = Math.hypot(ex, ey), wob = (n1(x, y) - .5) * .5 + (n2(x, y) - .5) * .22; if (d < .93 + wob) M[y][x] = '.'; }
// the south-east bay, for the Prime Isles
blob(111, 88, 16, 8, '~', .35); for (const [x, y, r] of [[103, 87, 2.4], [110, 90, 2.1], [117, 86, 2.6], [112, 84, 1.6]]) blob(x, y, r, r * .8, 's', .2);

// ---- 2. regions (painted as rectangles; the sea stays 0). Order matters: later ones paint over earlier ones.
region(0, 0, 127, 95, 1);                    // everything is the Meadow until told otherwise
region(0, 0, 50, 54, 4);                     // the Pattern Woods, north-west
region(51, 0, 91, 57, 5);                    // the Lake of Two Suns, the middle
region(50, 58, 85, 95, 2);                   // the Reach, south: it starts on the Rill's east bank
region(86, 55, 127, 95, 3);                  // the Terrace Hills, south-east
region(92, 0, 127, 54, 6);                   // the Canyon and the Old Works, north-east
region(54, 0, 88, 22, 7);                    // Gate Mountain, north
region(0, 0, 30, 21, 9);                     // the Growing Dunes, north-west corner (an extra land)
region(96, 80, 127, 95, 8);                  // the Prime Isles (an extra land)

// ---- 3. ground for each region
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (M[y][x] === '~') continue; const g = R[y][x]; M[y][x] = g === 9 ? 'd' : g === 6 ? 'c' : g === 7 ? 'p' : g === 8 ? 's' : '.'; }

// ---- 4. water: the lake, and three rivers
blob(72, 41, 16, 10.5, '~', .28, null, n1);
for (const [x, y, rx, ry] of [[72, 41, 3.6, 2.8], [62, 37, 1.8, 1.5], [82, 45, 2, 1.6], [79, 35, 1.5, 1.3]]) blob(x, y, rx, ry, '.', .15);          // islands: the big one holds the watch house
const RILL = [[60, 50], [56, 53], [51, 55], [48, 58], [48, 64], [47, 70], [48, 76], [47, 83], [48, 95]];
line(RILL, 2.4, '~');                                                                                                                                    // the Rill: lake to the south sea. It parts the Meadow from the Reach.
line([[87, 43], [93, 47], [100, 52], [108, 53], [118, 55], [127, 56]], 2.4, '~');                                                                         // the east river: parts the hills from the canyon
line([[71, 20], [70, 26], [71, 31]], 1.6, '~');                                                                                                           // the fall from Gate Mountain

// ---- 5. walls of rock between regions (each has its gates, opened later in the page)
line([[52, 4], [54, 14], [53, 22], [56, 26]], 2.6, '^'); line([[88, 4], [89, 14], [88, 22], [86, 27]], 2.6, '^');                                        // the two arms of Gate Mountain
line([[56, 22], [62, 23], [66, 22]], 2.2, '^'); line([[76, 22], [82, 23], [86, 23]], 2.2, '^');                                                            // its south face, with a gap for the stair and the fall
line([[53, 2], [70, 3], [88, 2]], 2.6, '^');
line([[2, 55], [14, 55], [25, 55]], 1, '#', '.d'); line([[27, 55], [38, 55], [46, 55]], 1, '#', '.d');                                                      // the Makers' old wall: the north edge of the Meadow. The gap at 26 is the hedge gate.
line([[46, 49], [46, 55]], 1, '#', '.'); line([[46, 55], [51, 55]], 1, '#', '.'); line([[44, 30], [47, 40], [46, 49]], 2.2, '^', '.');                                                                // the ridge between the woods and the lake
line([[0, 21], [12, 21], [22, 20], [30, 19], [31, 10], [30, 2]], 1.8, '^', '.d');                                                                           // the cliffs round the Growing Dunes
line([[86, 57], [86, 66]], 1, '#', '.'); line([[86, 68], [86, 93]], 1, '#', '.sm,*');                                                                // the hill wall: the gap at 67 is the lift
line([[92, 4], [93, 20], [92, 34], [91, 41]], 2.2, '^', 'c.p');                                                                                            // the canyon's west rim

// ---- 6. the Mender Meadow (region 1), square by square. Everything a child meets on the first day.
rect(4, 88, 46, 90, 's', '.');                                                                                                                              // the south beach
blob(10, 67, 2.4, 2, '~', .1);                                                                                                                              // the pond
rect(21, 69, 25, 73, '.');                                                                                                                                  // the village green
road([[13, 82], [13, 79], [19, 79], [19, 75], [23, 75], [23, 73]], ':', '.');                                                                              // ship to village
road([[23, 75], [34, 75], [34, 74], [45, 74]], ':', '.');                                                                                                  // village to the bridge
road([[19, 75], [14, 75], [14, 69]], ':', '.');                                                                                                            // to the pond machine
road([[23, 73], [21, 73], [21, 66], [20, 66], [20, 60], [19, 60]], ':', '.');                                                                                        // north to the wall machine (the lane goes round the houses)
road([[26, 66], [26, 56]], ':', '.'); road([[21, 66], [26, 66]], ':', '.');                                                                                 // the lane to the hedge gate
road([[26, 66], [32, 66], [32, 63]], ':', '.');                                                                                                            // to the hill machine
road([[34, 75], [34, 78]], ':', '.');                                                                                                            // to the orchard machine
set(22, 71, 'H'); set(24, 71, 'H'); set(23, 70, 'H'); set(23, 72, ':'); set(23, 73, ':'); set(23, 74, ':');                                                 // three huts
for (let oy = 0; oy < 4; oy++) for (let ox = 0; ox < 6; ox++) set(29 + ox * 2, 81 + oy * 2, 'a', '.s');                                    // the orchard: 4 rows of 6 trees
for (const [x, y, rx, ry] of [[33, 61, 3.2, 2.2], [36, 63, 2, 1.6]]) blob(x, y, rx, ry, 'r', .25, '.');                                                      // the rocky hill
rect(31, 62, 33, 63, '.', 'r'); set(32, 63, ':'); set(32, 64, ':'); set(32, 65, ':');
for (const [x, y, rx, ry] of [[28, 66, 2.4, 1.6], [18, 85, 2.6, 1.6], [40, 68, 2.6, 2], [9, 61, 2.4, 1.8]]) blob(x, y, rx, ry, ',', .3, '.');                // tall grass
for (const [x, y, rx, ry] of [[8, 76, 1.6, 1.2], [43, 85, 1.6, 1.2], [28, 60, 1.6, 1.2], [16, 71, 1.4, 1]]) blob(x, y, rx, ry, '*', .2, '.');               // flowers
scatter(5, 57, 45, 87, 'T', .045, '.'); scatter(5, 57, 12, 64, 'T', .2, '.'); scatter(38, 57, 45, 62, 'T', .12, '.');                                      // trees: a copse in the north-west and one by the reeds
for (const [x, y] of [[13, 82], [12, 82], [14, 82], [13, 81], [13, 83], [12, 81], [14, 81], [12, 83], [14, 83], [15, 80], [18, 59], [18, 60], [17, 60], [19, 60], [13, 68], [14, 68], [14, 69], [33, 62], [32, 62], [34, 79], [34, 78], [33, 79], [35, 79], [45, 74], [44, 74], [45, 73], [45, 75], [44, 60], [45, 60], [44, 59], [44, 61], [24, 86], [27, 77], [15, 69], [14, 69], [13, 66], [46, 59], [46, 73], [9, 70], [21, 57], [6, 86], [22, 73], [24, 73], [26, 57], [26, 58], [25, 57], [27, 57], [20, 78], [16, 66], [38, 72], [29, 70], [10, 73], [41, 82]]) if (get(x, y) === 'T' || get(x, y) === 'r' || get(x, y) === 'a') set(x, y, '.');      // squares that must stay clear: places, beings, things
blob(45, 60, 2.2, 3, 'm', .2, '.'); road([[34, 74], [40, 74]], ':', '.'); road([[40, 74], [40, 60], [45, 60]], ':', '.m,T*');                                                                       // the reeds, and the old track to the stepping stones
set(46, 60, ':', '.m'); set(46, 74, ':', '.');
rect(28, 80, 40, 88, '.', 'T*,'); for (let oy = 0; oy < 4; oy++) for (let ox = 0; ox < 6; ox++) set(29 + ox * 2, 81 + oy * 2, 'a');
for (const [x, y] of [[46, 59], [46, 73], [13, 83], [12, 83], [14, 83], [14, 68], [18, 60], [33, 62], [34, 79], [15, 80], [20, 78], [13, 66], [9, 70], [38, 72], [29, 70], [41, 82], [24, 86], [27, 77], [21, 57], [7, 79], [8, 76], [25, 72], [21, 71], [41, 61], [41, 62]]) set(x, y, '.');   // squares where a thing or a being stands
// ways to every person, and a landmark at each one that can be picked out from across the screen
// [Marc, 23 November: "he's just like in the middle of grass somewhere ... there's no landmarks there's no like real paths". Proposal of the big world thread: each can be moved.]
road([[34, 78], [41, 78], [41, 81]], ':', '.,*T');                                                                                                        // to the orchard keeper, at the side of her orchard ("Four rows of six trees")
road([[14, 69], [13, 69], [13, 67]], ':', '.,*T');                                                                                                        // past the pond machine to the fisher, at the pond
rect(27, 67, 31, 70, '.', 'T*,'); set(29, 69, 'O'); road([[29, 75], [29, 70]], ':', '.,*T');                                                              // the big old tree in the middle of the meadow, the tallest thing there; the old Mender sits under it
set(44, 75, '.');                                                                                                                                         // the Mender with big ears stands at the broken bridge, listening across the river
for (const [x, y] of [[22, 67], [33, 76], [41, 73]]) set(x, y, '.');                                                                                      // signposts at three forks (old wall and hill; orchard and bridge; old stones and bridge)
// the far bank: the Reach's landing. A small piece of region 2 that is built now.
road([[50, 74], [55, 74], [55, 72]], ':', '.'); set(49, 74, '~'); set(48, 74, '~'); set(47, 74, '~'); set(47, 60, '~'); set(48, 60, '~'); set(49, 60, '~');
road([[50, 60], [52, 60], [52, 74]], ':', '.');
blob(55, 71, 1.8, 1.4, '.', 0); line([[51, 66], [58, 66], [59, 70], [59, 79], [50, 80], [48, 80]], 1, 'm', '.,*T'); line([[50, 58], [54, 58], [54, 66]], 1, 'm', '.,*T'); set(52, 66, ':');                                                       // reeds ring the landing: the road east is not open yet
scatter(51, 67, 58, 79, '*', .06, '.');

// ---- 7. the other regions: their look only. Each one is finished when it is built.
// the Pattern Woods: trees in rows that follow a rule, with glades
for (let y = 9; y <= 53; y++) for (let x = 6; x <= 45; x++) if (R[y][x] === 4 && M[y][x] === '.') { const k = (x + y * 2) % 5; if (k === 0 || (k === 2 && y % 2 === 0)) M[y][x] = 't'; }
for (const [x, y, rx, ry] of [[20, 44, 5, 3.4], [36, 34, 4.5, 3.4], [16, 30, 4, 3], [38, 47, 3, 2.4]]) blob(x, y, rx, ry, '.', .25, 't');
road([[26, 54], [26, 46], [21, 46], [21, 44]], ':', '.t'); road([[21, 44], [21, 36], [34, 36], [34, 34]], ':', '.t'); road([[34, 34], [40, 34], [40, 26], [44, 26]], ':', '.t^'); road([[21, 36], [16, 36], [16, 30]], ':', '.t');
// the Reach: channels and reed beds
// (built: see section 7b, below the other regions)
// the Terrace Hills: fields in steps
for (let y = 58; y <= 80; y++) for (let x = 88; x <= 122; x++) if (R[y][x] === 3 && M[y][x] === '.') { if ((y - 58) % 5 === 4 && x % 9 !== 4) M[y][x] = '#'; else if ((y - 58) % 5 < 4 && (Math.floor(x / 9) + Math.floor((y - 58) / 5)) % 2 === 0) M[y][x] = 'w'; }
// the lake shore
scatter(54, 26, 90, 56, 'T', .08, '.'); for (let y = 24; y <= 56; y++) for (let x = 53; x <= 90; x++) if (M[y][x] === '.' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(d => get(x + d[0], y + d[1]) === '~')) M[y][x] = 's';
// the Canyon and the Old Works
for (let y = 4; y <= 52; y++) for (let x = 94; x <= 124; x++) if (R[y][x] === 6 && M[y][x] === 'c') { const v = n3(x * 2.2, y * 2.2); if (v > .56 && v < .64) M[y][x] = '#'; else if (rnd() < .04) M[y][x] = 'r'; }
rect(104, 16, 112, 22, 'R', 'c#r');
// Gate Mountain: the high flat, and the Gate
blob(71, 11, 10, 5.5, 'p', .12); road([[71, 16], [71, 19]], 'p'); scatter(58, 5, 84, 20, '^', .5, 'p.');
blob(71, 11, 8.5, 4.4, 'p', .1); road([[69, 16], [69, 21]], 'p', 'p^.~'); road([[69, 21], [68, 21], [68, 25]], 'p', 'p^.~s');
// the Growing Dunes
for (let y = 4; y <= 20; y++) for (let x = 4; x <= 29; x++) if (M[y][x] === 'd' && (x + Math.round(Math.sin(y * .9) * 2)) % 6 === 0) M[y][x] = 'D';

// ---- 7b. the Reach (region 2), square by square: channels, plank bridges, three towns on legs, the harbour
line([[60, 62], [66, 68], [64, 78], [70, 88], [72, 95]], 1.4, '~', '.'); line([[66, 68], [76, 66], [84, 72]], 1.4, '~', '.'); line([[70, 88], [80, 84], [85, 86]], 1.2, '~', '.');
// a road that becomes a plank bridge (b) wherever it meets water
function roadB(pts) { for (let i = 0; i < pts.length - 1; i++) { let [x, y] = pts[i]; const [bx, by] = pts[i + 1], put = () => set(x, y, get(x, y) === '~' || get(x, y) === 'b' ? 'b' : ':'); put(); while (x !== bx) { x += Math.sign(bx - x); put(); } while (y !== by) { y += Math.sign(by - y); put(); } } }
set(59, 74, ':');                                                     // the reed gate's square
roadB([[60, 74], [79, 74]]);                                          // the gate, the harbour, the bridge over the first channel, on to Reed Town
roadB([[62, 74], [62, 73]]);                                          // up to the harbour houses
roadB([[71, 74], [71, 63]]);                                          // north, over the second channel, to Stilt Town
roadB([[75, 74], [75, 89]]);                                          // south, over the third channel, to Mud Town
roadB([[62, 74], [62, 77], [64, 77]]);                                // the long pier
roadB([[78, 74], [78, 67], [85, 67]]);                                // east to the lift under the hill wall
for (const [x, y] of [[61, 72], [63, 72], [70, 62], [72, 62], [73, 64], [80, 73], [80, 75], [81, 74], [76, 90], [77, 88], [74, 90]]) set(x, y, 'S');      // houses on legs
line([[55, 58], [85, 58]], 1, 'm', '.,*T:');                          // reeds close the north side for now
scatter(60, 59, 85, 91, 'm', .07, '.'); scatter(60, 59, 85, 91, ',', .05, '.'); scatter(60, 59, 85, 91, '*', .025, '.');
for (const [x, y] of [[62, 72], [62, 73], [72, 63], [71, 63], [80, 74], [79, 74], [76, 89], [75, 89], [68, 75], [74, 83], [85, 67], [84, 67], [69, 73], [60, 73], [60, 75]]) if ('m,*'.indexOf(get(x, y)) >= 0) set(x, y, '.');      // squares where a thing or a being stands
set(64, 77, 'b'); set(63, 77, 'b');

// ---- 8. tidy: no land letter may be left in region 0, and the edge is sea
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (M[y][x] !== '~' && !R[y][x]) { let got = 0; for (let d = 1; d <= 4 && !got; d++) for (const [dx, dy] of [[d, 0], [-d, 0], [0, d], [0, -d], [d, d], [-d, -d], [d, -d], [-d, d]]) if (!got && inb(x + dx, y + dy) && R[y + dy][x + dx]) got = R[y + dy][x + dx]; if (got) R[y][x] = got; else M[y][x] = '~'; }
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (x === 0 || y === 0 || x === W - 1 || y === H - 1) M[y][x] = '~'; if (M[y][x] === '~' && R[y][x] && ![[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1], [2, 0], [-2, 0], [0, 2], [0, -2]].some(d => inb(x + d[0], y + d[1]) && M[y + d[1]][x + d[0]] !== '~')) R[y][x] = 0; }

const rows = M.map(r => r.join('')), regs = R.map(r => r.join(''));
const block = `/*MAP-BEGIN (painted by checks/bigworld_map_build.js; change that file, not these letters)*/\nconst MAPW = ${W}, MAPH = ${H};\nconst MAP = [\n${rows.map(r => `'${r}'`).join(',\n')}];\nconst REG = [\n${regs.map(r => `'${r}'`).join(',\n')}];\n/*MAP-END*/`;
if (process.argv.includes('--print')) { console.log(rows.join('\n')); console.log(); console.log(regs.join('\n')); process.exit(0); }
if (process.argv.includes('--block')) { process.stdout.write(block); process.exit(0); }
const file = path.resolve(__dirname, '..', 'prototypes', 'big_world.html');
let page = fs.readFileSync(file, 'utf8'); const a = page.indexOf('/*MAP-BEGIN'), b = page.indexOf('/*MAP-END*/');
if (a < 0 || b < 0) { console.log('FAILED: the page has no MAP-BEGIN and MAP-END marks'); process.exit(1); }
const next = page.slice(0, a) + block + page.slice(b + '/*MAP-END*/'.length);
if (next !== page) { fs.writeFileSync(file, next); console.log('ok: the map was painted into prototypes/big_world.html (' + W + ' x ' + H + ')'); } else console.log('ok: the map in the page is already the same');
module.exports = { rows, regs, W, H, block };
