// The Reach's numbers, the well's and the loose cog's, worked out again on 20,000 children.   [Brief 2, section 4]
// It reads the rules straight out of the page (NUM-BEGIN to NUM-END in prototypes/big_world.html), so it checks the game as built.
//
// THE FLEET (the Reach's big quest)
//   The harbour has rafts of three kinds (how many baskets a raft carries): three different numbers from 4, 6, 7, 8, 9.
//   Three towns each order baskets. A raft sails full; a town's rafts are all one kind; a town gets exactly its order.
//   Checked by this file's OWN search of every line a child could set (any kind, 1 to 20 rafts):
//     - every order can be carried by at least one kind; at least one order by two kinds
//     - no fit needs more than 10 rafts (every fact inside 10 x 10); no order over 81, under 12, or 24 (the baker's example)
//     - the harbour has the rafts for 1 or 2 plans that serve all three towns, never none and never more
//     - a trap: a line right for its own town, with rafts that are there, that no full plan uses
//     - no right plan has three lines of the same length, and no right plan uses every raft in the harbour
//     - no kind has more than 9 rafts
//     - the page's own list of plans agrees with this file's
//   Nothing sails until all three lines are right, so no line a child sets can ever make the job impossible. (That is in the page's code, not a number rule.)
// THE WELL (a mini quest)
//   - depth = per x turns = each x bundles, all whole; each is never per or turns (the second fact is a new one)
//   - the depth is 18 to 40; bundles x 10 is the reeds
//   - the box: a is 2, 3 or 4; b is 1 to 9 and never 2; never the lid's example (x 5 then + 2); every number the box shows for 1 to 10 pebbles is under 50
//   - any wrong pair of wheels can be shown wrong with 1 to 10 pebbles
// THE LOOSE COG
//   - three questions; each rule is "times 2 to 5" or "add 3 to 9"; the two shown pairs fit one of those rules only; every answer is 50 or less
//
// Run:  node checks/bigworld_reach_numbers_check.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const page = fs.readFileSync(path.resolve(__dirname, '..', 'prototypes', 'big_world.html'), 'utf8'), a = page.indexOf('/*NUM-BEGIN'), b = page.indexOf('/*NUM-END*/');
const box = {}; vm.createContext(box); vm.runInContext(page.slice(a, b) + '\n;Object.assign(this, { bwFleet, bwFleetPlans, bwWell, bwCog, boxOut, TOWNS });', box);
const { bwFleet, bwFleetPlans, bwWell, bwCog, boxOut, TOWNS } = box;
const bad = [], say = (ok, what) => { if (!ok && bad.length < 25) bad.push(what); };
const N = 20000, stat = { kinds: {}, full1: 0, full2: 0, choices: 0, real: 0, rafts: 0, maxRafts: 0, maxOrder: 0, hard: 0, lines: 0, wells: {}, boxes: {} };
for (let seed = 1; seed <= N; seed++) { const g = bwFleet(seed); if (!g) { say(false, `seed ${seed}: no fleet`); continue; }
  const orders = TOWNS.map(t => g.order[t]), K = g.kinds;
  say(K.length === 3 && new Set(K).size === 3 && K.every(k => [4, 6, 7, 8, 9].indexOf(k) >= 0), `seed ${seed}: kinds ${K}`);
  say(new Set(orders).size === 3 && orders.every(o => o >= 12 && o <= 81 && o !== 24), `seed ${seed}: orders ${orders}`);
  say(K.every(k => g.count[k] >= 1 && g.count[k] <= 9), `seed ${seed}: raft counts ${JSON.stringify(g.count)}`);
  const fits = orders.map(o => { const f = []; for (const k of K) for (let n = 1; n <= 20; n++) if (n * k === o) f.push({ k, n }); return f; });
  say(fits.every(f => f.length >= 1), `seed ${seed}: an order no kind can carry: ${orders}`); say(fits.some(f => f.length >= 2), `seed ${seed}: no town has a choice of kind`);
  say(fits.every(f => f.every(q => q.n <= 10)), `seed ${seed}: a fit needs more than 10 rafts`);
  const fullPlans = []; for (const x of fits[0]) for (const y of fits[1]) for (const z of fits[2]) { const used = {}; for (const q of [x, y, z]) used[q.k] = (used[q.k] || 0) + q.n; if (K.every(k => (used[k] || 0) <= g.count[k])) fullPlans.push([x, y, z]); }
  say(fullPlans.length === 1 || fullPlans.length === 2, `seed ${seed}: ${fullPlans.length} plans serve all three towns`); if (fullPlans.length === 1) stat.full1++; else stat.full2++;
  say(bwFleetPlans(K, g.count, orders).full.length === fullPlans.length, `seed ${seed}: the page counts another number of plans`);
  let trap = 0, real = 0; fits.forEach((f, i) => { let here = 0; f.forEach(q => { if (q.n > g.count[q.k]) return; here++; if (!fullPlans.some(pl => pl[i].k === q.k)) trap++; }); if (here >= 2) real++; });
  say(trap >= 1, `seed ${seed}: no trap`);
  // a plan must not fall to a rule of thumb: 'the same number for every town', or 'use every raft'   [the reviewer of the Reach's pictures, child 7]
  fullPlans.forEach(pl => { say(!(pl[0].n === pl[1].n && pl[1].n === pl[2].n), `seed ${seed}: all three lines are the same length`); say(pl.reduce((x, q) => x + q.n, 0) < K.reduce((x, k) => x + g.count[k], 0), `seed ${seed}: a right plan uses every raft in the harbour`); });
  fullPlans[0].forEach(q => { stat.lines++; if (q.k >= 7 || q.n >= 7) stat.hard++; });
  const total = K.reduce((t, k) => t + g.count[k], 0); stat.rafts += total; stat.maxRafts = Math.max(stat.maxRafts, total); stat.kinds[K.join('-')] = 1; stat.choices += fits.filter(f => f.length >= 2).length; stat.real += real; stat.maxOrder = Math.max(stat.maxOrder, ...orders);
  // the well
  const w = bwWell(seed); say(w.per * w.turns === w.depth && w.each * w.bundles === w.depth, `seed ${seed}: the well's two facts disagree: ${JSON.stringify(w)}`); say(w.each !== w.per && w.each !== w.turns, `seed ${seed}: the rope's fact is the winch's fact turned round`);
  say(w.depth >= 18 && w.depth <= 40 && w.per >= 3 && w.per <= 9 && w.turns >= 4 && w.turns <= 10 && w.bundles >= 2 && w.bundles <= 10 && w.each >= 4 && w.each <= 10, `seed ${seed}: the well's numbers are out of range: ${JSON.stringify(w)}`);
  say([2, 3, 4].indexOf(w.a) >= 0 && w.b >= 1 && w.b <= 9 && w.b !== 2 && !(w.a === 5 && w.b === 2), `seed ${seed}: the box's wheels: ${w.a}, ${w.b}`); for (let n = 1; n <= 10; n++) say(boxOut(w, n) === w.a * n + w.b && boxOut(w, n) < 50, `seed ${seed}: the box shows ${boxOut(w, n)} for ${n}`);
  if (seed <= 400) for (let a2 = 1; a2 <= 9; a2++) for (let b2 = 0; b2 <= 20; b2++) { if (a2 === w.a && b2 === w.b) continue; let found = false; for (let n = 1; n <= 10 && !found; n++) if (a2 * n + b2 !== boxOut(w, n)) found = true; say(found, `seed ${seed}: wheels x ${a2} + ${b2} cannot be told from the box`); }
  stat.wells[w.depth] = 1; stat.boxes[w.a + '+' + w.b] = 1;
  // the cog
  for (let k = 1; k <= 3; k++) { const qs = bwCog(seed, k); say(qs.length === 3, `seed ${seed}: the cog has ${qs.length} clicks`); for (const q of qs) { const rules = []; for (let n = 2; n <= 5; n++) if (q.a[0] * n === q.a[1] && q.b[0] * n === q.b[1]) rules.push(x => x * n); for (let n = 3; n <= 9; n++) if (q.a[0] + n === q.a[1] && q.b[0] + n === q.b[1]) rules.push(x => x + n);
      say(rules.length === 1, `seed ${seed}: a cog click fits ${rules.length} rules: ${JSON.stringify(q)}`); if (rules.length === 1) say(rules[0](q.x) === q.ans && q.ans <= 50 && q.x !== q.a[0] && q.x !== q.b[0], `seed ${seed}: a cog click's answer: ${JSON.stringify(q)}`); } } }
console.log(`children checked: ${N}`);
console.log(`the fleet: ${Object.keys(stat.kinds).length} of 10 sets of kinds; ${(stat.rafts / N).toFixed(1)} rafts in a harbour on average, ${stat.maxRafts} at most; the biggest order: ${stat.maxOrder}`);
console.log(`  one plan serves all three towns for ${(stat.full1 / N * 100).toFixed(1)}% of children, two plans for ${(stat.full2 / N * 100).toFixed(1)}%`);
console.log(`  towns whose order two kinds can carry: ${(stat.choices / N).toFixed(2)} of 3; towns with two ways the harbour has rafts for: ${(stat.real / N).toFixed(2)} of 3`);
console.log(`  lines in a right plan that use a 7, 8 or 9: ${(stat.hard / stat.lines * 100).toFixed(0)}%`);
console.log(`the well: ${Object.keys(stat.wells).length} depths; the box: ${Object.keys(stat.boxes).length} pairs of wheels`);
console.log(bad.length ? 'FAILED:\n  ' + bad.join('\n  ') : `ok: ${N} children: the fleet, the well, the Makers' box and the loose cog all hold`);
process.exit(bad.length ? 1 : 0);
