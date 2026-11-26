// The big world's number rules, worked out again on 20,000 children.   [Handoff: HANDOFF_Big_World_2026-11-22.md, section 8]
//
// It reads the number rules straight out of the page (between NUM-BEGIN and NUM-END in prototypes/big_world.html),
// so it checks the game as built, not a copy.
//
// THE MACHINES AND THE POUCH (Mender Meadow)
//   - every child gets four machines: one times, one add, one take away, one share. Every rule's number is in its list.
//   - no child's machine has a rule used in a finished example (x 4, + 6, x 10, + 1)
//   - a rule can be told from every other rule a child could write on a plate, using test pebbles 1 to 20:
//     for every wrong plate there is a number of test pebbles, from 2 to 12, where the plate and the machine disagree
//   - two tests are needed: for every machine there is a single test that fits two different plates
//   - the pan's number is from 20 to 90. It cannot be made in fewer than 3 machine runs. It can be made in 3.
//     (This check does its own search. It does not trust the page's.)
//   - none of the 3-run ways is one machine three times; at least one uses the times machine
//   - no dead end: from every number the pouch can hold, the pan's number can still be reached
//   - the pouch never needs to go over 100 or below 0, and no sum leaves Grade 3 (products inside 100)
//   - order matters: the machines of a shortest way, run in another order, give another number (or cannot run)
// THE STEPPING STONES
//   - the three carved numbers and the five right stones make one pattern with one step (3, 4, 6, 7, 8 or 9), up or down
//   - each row has three different numbers, exactly one of them right, all from 1 to 110
//   - no stone in a row is the next row's right stone (a child could spot the chain)
//   - a new round gives a new pattern (since 26 November nothing resets: the post lifts a stone by its number. Only an old save has a round over 0)
//   - the chance of crossing by guessing is 1 in 243
//
// Run:  node checks/bigworld_numbers_check.js [file]
const fs = require('fs'), path = require('path'), vm = require('vm');
const file = process.argv[2] || path.resolve(__dirname, '..', 'prototypes', 'big_world.html');
const page = fs.readFileSync(file, 'utf8'), a = page.indexOf('/*NUM-BEGIN'), b = page.indexOf('/*NUM-END*/');
if (a < 0 || b < 0) { console.log('FAILED: no NUM-BEGIN / NUM-END in ' + file); process.exit(1); }
const box = {}; vm.createContext(box); vm.runInContext(page.slice(a, b) + '\n;this.bwNumbers = bwNumbers; this.bwStones = bwStones; this.ruleOut = ruleOut; this.SITES = SITES;', box);
const { bwNumbers, bwStones, ruleOut, SITES } = box;
const bad = [], say = (ok, what) => { if (!ok && bad.length < 25) bad.push(what); };
const N = 20000, OPS = ['times', 'plus', 'minus', 'share'], LIST = { times: [2, 3, 5], plus: [3, 4, 5, 7, 8, 9], minus: [2, 3, 4, 5, 6, 7, 8], share: [2, 3] };
const allPlates = []; for (const op of OPS) for (let n = 1; n <= 20; n++) allPlates.push({ op, n });
const stat = { target: {}, start: {}, nways: 0, where: {}, order: 0, twoTests: 0, runsMax: 0 };
for (let seed = 1; seed <= N; seed++) {
  const g = bwNumbers(seed); if (!g) { say(false, `seed ${seed}: no numbers`); continue; }
  const rules = OPS.map(o => g.rule[o]);
  for (const o of OPS) { say(g.rule[o].op === o && LIST[o].indexOf(g.rule[o].n) >= 0, `seed ${seed}: ${o} ${g.rule[o].n} is not in its list`); }
  say(!(g.rule.times.n === 4 || g.rule.plus.n === 6 || g.rule.times.n === 10 || g.rule.plus.n === 1), `seed ${seed}: a machine has a rule from a finished example`);
  const sites = SITES.map(s => g.at[s].op).sort().join(); say(sites === OPS.slice().sort().join(), `seed ${seed}: the four sites do not hold one machine of each kind`);
  stat.where[SITES.map(s => g.at[s].op[0]).join('')] = 1;
  // a wrong plate can always be shown wrong with 2 to 12 test pebbles; and one test alone never settles it
  for (const rule of rules) { for (const p of allPlates) { if (p.op === rule.op && p.n === rule.n) continue; let found = false; for (let n = 2; n <= 12 && !found; n++) if (ruleOut(p, n) !== ruleOut(rule, n)) found = true; say(found, `seed ${seed}: plate ${p.op} ${p.n} cannot be told from ${rule.op} ${rule.n}`); }
    let twin = false; for (let n = 1; n <= 20 && !twin; n++) { const out = ruleOut(rule, n); if (out === null) continue; if (allPlates.some(p => !(p.op === rule.op && p.n === rule.n) && ruleOut(p, n) === out)) twin = true; } say(twin, `seed ${seed}: ${rule.op} ${rule.n} can be found from one test`); if (twin) stat.twoTests++; }
  // the pouch: my own search
  const dist = new Array(101).fill(-1), q = [g.start]; dist[g.start] = 0; for (let h = 0; h < q.length; h++) for (const r of rules) { const w = ruleOut(r, q[h], 100); if (w !== null) { say(w >= 0 && w <= 100, `seed ${seed}: pouch ${w}`); if (dist[w] < 0) { dist[w] = dist[q[h]] + 1; q.push(w); } } }
  say(g.start >= 3 && g.start <= 8, `seed ${seed}: start ${g.start}`); say(g.target >= 20 && g.target <= 90, `seed ${seed}: target ${g.target}`);
  say(dist[g.target] === 3, `seed ${seed}: the pan's ${g.target} takes ${dist[g.target]} runs from ${g.start}, not 3`);
  const ways = []; for (const x of rules) for (const y of rules) for (const z of rules) { const v1 = ruleOut(x, g.start, 100); if (v1 === null) continue; const v2 = ruleOut(y, v1, 100); if (v2 === null) continue; if (ruleOut(z, v2, 100) === g.target) ways.push([x, y, z]); }
  say(ways.length >= 1, `seed ${seed}: no 3-run way`); say(ways.length === g.ways.length, `seed ${seed}: the page counts ${g.ways.length} ways, this check ${ways.length}`);
  say(!ways.some(w => w[0] === w[1] && w[1] === w[2]), `seed ${seed}: one machine three times reaches the pan`); say(ways.some(w => w.some(r => r.op === 'times')), `seed ${seed}: no shortest way uses times`);
  stat.nways += ways.length;
  // no dead end
  const ok = new Array(101).fill(false); ok[g.target] = true; let ch = true; while (ch) { ch = false; for (const v of q) if (!ok[v]) for (const r of rules) { const w = ruleOut(r, v, 100); if (w !== null && ok[w]) { ok[v] = true; ch = true; break; } } }
  say(q.every(v => ok[v]), `seed ${seed}: a dead end: from ${q.find(v => !ok[v])} the pan's number cannot be reached`);
  // the furthest any reachable number is from the pan's number, in runs
  // order matters for at least one shortest way
  let om = false; for (const w of ways) { for (const p of [[0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) { let v = g.start; for (const i of p) { v = v === null ? null : ruleOut(w[i], v, 100); } if (v !== g.target) om = true; } } if (om) stat.order++;
  say(om, `seed ${seed}: order does not matter for any shortest way`);
  // every product a child must work out with real pips stays inside 100
  for (const v of q) { const t = ruleOut(g.rule.times, v, 100); say(t === null || t <= 100, `seed ${seed}: ${v} x ${g.rule.times.n} over 100`); }
  stat.target[g.target] = (stat.target[g.target] || 0) + 1; stat.start[g.start] = (stat.start[g.start] || 0) + 1;
  // the stones
  let lastKey = '';
  for (let round = 0; round < 4; round++) { const s = bwStones(seed, round), d = s.shown[1] - s.shown[0]; say(s.shown[2] - s.shown[1] === d && Math.abs(d) === s.step && [3, 4, 6, 7, 8, 9].indexOf(s.step) >= 0, `seed ${seed} round ${round}: carved numbers ${s.shown}`);
    let prev = s.shown[2]; say(s.rows.length === 5, `seed ${seed}: ${s.rows.length} rows`);
    for (const row of s.rows) { say(row.opts.length === 3 && new Set(row.opts).size === 3, `seed ${seed} round ${round}: a row is not three different stones: ${row.opts}`); say(row.opts.every(v => v >= 1 && v <= 110 && Number.isInteger(v)), `seed ${seed} round ${round}: a stone out of range: ${row.opts}`); say(row.opts[row.right] === prev + d, `seed ${seed} round ${round}: the right stone is ${row.opts[row.right]}, the pattern says ${prev + d}`); say(row.opts.filter(v => v === prev + d).length === 1, `seed ${seed} round ${round}: two right stones`); prev += d; }
    for (let i = 0; i < 4; i++) say(s.rows[i].opts.indexOf(s.rows[i + 1].opts[s.rows[i + 1].right]) < 0, `seed ${seed} round ${round}: a stone in row ${i + 1} is the next row's right stone (it gives the row after away)`);
    say(s.shown.every(v => v >= 1 && v <= 100), `seed ${seed} round ${round}: carved ${s.shown}`);
    const key = s.shown.join(); say(key !== lastKey, `seed ${seed}: round ${round} has the same pattern as the round before`); lastKey = key; }
}
const tk = Object.keys(stat.target).map(Number);
console.log(`children checked: ${N}`);
console.log(`pan numbers used: ${tk.length} different, from ${Math.min(...tk)} to ${Math.max(...tk)}; the most common is on ${(Math.max(...Object.values(stat.target)) / N * 100).toFixed(1)}% of children`);
console.log(`starting pips: ${Object.keys(stat.start).map(k => `${k}: ${(stat.start[k] / N * 100).toFixed(0)}%`).join(', ')}`);
console.log(`3-run ways to the pan, on average: ${(stat.nways / N).toFixed(2)}; ways the four machines are placed: ${Object.keys(stat.where).length} of 24`);
console.log(bad.length ? 'FAILED:\n  ' + bad.join('\n  ') : `ok: ${N} children: machines, plates, the pouch and the pan, and the stepping stones all hold`);
process.exit(bad.length ? 1 : 0);
