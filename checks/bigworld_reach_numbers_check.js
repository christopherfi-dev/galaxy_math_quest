// The Reach (region 2 of the big world): its number rule, checked BEFORE anything is built.
// Design note: proposals/GMQ_Big_World_Reach_Design_v1_2026-11-22.md (version 2 of the fleet problem).   [Proposal: nothing here is in the page yet]
//
// The rule is written here, in this file, so the design can be checked on thousands of children first.
// When the Reach is built, the rule moves into the page (between NUM-BEGIN and NUM-END) and this check reads it from there.
//
// THE FLEET
//   The harbour has rafts of three kinds. A kind is how many baskets a raft carries: three different numbers from 4, 6, 7, 8, 9.
//   Three towns each order a number of baskets. A raft sails full. A town's rafts are all one kind. A town gets exactly its order.
//   So for each town the child looks for a kind and a number of rafts with  rafts x kind = order  (the missing number, many times: 3.OA.4).
//   Kept by the rule, and checked here by trying every plan a child could make:
//     - every order can be carried by at least one kind; at least one order can be carried by two kinds (there is a real choice)
//     - the harbour has enough rafts for a plan that serves all three towns; there are 1 or 2 such plans, never more
//     - there is a trap: a choice that is right for one town by itself (the kind fits, the rafts are there) but leaves another town with no rafts.
//       So the towns cannot be done one at a time without looking ahead.
//     - every fact is inside 10 x 10: no order needs more than 10 rafts of any kind that fits it; nothing over 81
//     - no kind has more than 9 rafts (a child can count them in the picture)
//     - no order is 24 (the finished example: 24 loaves on trays of 6)
//   The three dials (one in each town) are about LAST season's load, so they cannot give this season's answer away.
//   One window is burnt on each; the three ask in three ways:   ? x kind = baskets     rafts x ? = baskets     rafts x kind = ?
//     - no dial's numbers are a town's order or its answer this season
//
// Run:  node checks/bigworld_reach_numbers_check.js
function wrng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const TOWNS = ['stilt', 'reed', 'mud'], FORMS = ['rafts', 'each', 'total'];
// every plan: for each town, a kind that divides its order (or none). Returns the plans that serve all three inside the harbour's rafts.
function reachPlans(kinds, count, orders) { const opts = orders.map(o => kinds.filter(k => o % k === 0).map(k => ({ k, n: o / k }))), full = [];
  for (const a of opts[0]) for (const b of opts[1]) for (const c of opts[2]) { const used = {}; for (const q of [a, b, c]) used[q.k] = (used[q.k] || 0) + q.n; if (kinds.every(k => (used[k] || 0) <= count[k])) full.push([a, b, c]); }
  return { opts, full }; }
function bwReachNumbers(seed) {
  for (let t = 0; t < 4000; t++) { const r = wrng((seed >>> 0) * 6151 + t * 7723 + 3), pick = a => a[Math.floor(r() * a.length)], mixed = a => a.map(v => [r(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
    const kinds = mixed([4, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => a - b), plan = [0, 1, 2].map(() => ({ k: pick(kinds), n: 3 + Math.floor(r() * 7) })), orders = plan.map(p => p.k * p.n);
    if (new Set(orders).size < 3 || orders.some(o => o > 81 || o < 12 || o === 24)) continue;
    if (orders.some(o => kinds.some(k => o % k === 0 && o / k > 10))) continue;
    const count = {}; kinds.forEach(k => { count[k] = plan.filter(p => p.k === k).reduce((s, p) => s + p.n, 0) + Math.floor(r() * 2); if (count[k] === 0) count[k] = 2 + Math.floor(r() * 3); });
    if (kinds.some(k => count[k] > 9)) continue;
    const { opts, full } = reachPlans(kinds, count, orders); if (full.length < 1 || full.length > 2) continue; if (!opts.some(o => o.length >= 2)) continue;
    // the trap: a choice that fits one town alone and is in no plan that serves all three
    const trap = opts.some((o, i) => o.some(q => q.n <= count[q.k] && !full.some(f => f[i].k === q.k))); if (!trap) continue;
    // last season's dials
    const forms = mixed(FORMS), dials = [], taken = new Set(orders); let ok = true;
    for (let i = 0; i < 3 && ok; i++) { let d = null; for (let g = 0; g < 40 && !d; g++) { const k = pick(kinds), n = 2 + Math.floor(r() * 8), b = k * n; if (b > 81 || b === 24 || taken.has(b) || n === orders[i] / k || dials.some(q => q.b === b)) continue; d = { form: forms[i], k, n, b }; } if (!d) ok = false; else dials.push(d); }
    if (!ok) continue;
    const order = mixed([0, 1, 2]), towns = {}; TOWNS.forEach((name, i) => { towns[name] = { order: orders[order[i]], dial: dials[i] }; });
    return { kinds, count, towns }; }
  return null; }

const bad = [], say = (ok, what) => { if (!ok && bad.length < 25) bad.push(what); };
const N = 20000, stat = { kinds: {}, full1: 0, full2: 0, choices: 0, rafts: 0, maxOrder: 0, trapTowns: 0 };
for (let seed = 1; seed <= N; seed++) { const g = bwReachNumbers(seed); if (!g) { say(false, `seed ${seed}: no numbers`); continue; }
  const orders = TOWNS.map(t => g.towns[t].order), K = g.kinds;
  say(K.length === 3 && new Set(K).size === 3 && K.every(k => [4, 6, 7, 8, 9].indexOf(k) >= 0), `seed ${seed}: kinds ${K}`);
  say(new Set(orders).size === 3 && orders.every(o => o >= 12 && o <= 81 && o !== 24), `seed ${seed}: orders ${orders}`);
  say(K.every(k => g.count[k] >= 1 && g.count[k] <= 9), `seed ${seed}: raft counts ${JSON.stringify(g.count)}`);
  // every plan, by this check's own search: any kind, any number of rafts from 1 to 10, for each town
  const fits = orders.map(o => { const a = []; for (const k of K) for (let n = 1; n <= 12; n++) if (n * k === o) a.push({ k, n }); return a; });
  say(fits.every(a => a.length >= 1), `seed ${seed}: an order no kind can carry: ${orders}`); say(fits.some(a => a.length >= 2), `seed ${seed}: no town has a choice of kind`);
  say(fits.every(a => a.every(q => q.n <= 10)), `seed ${seed}: a fit needs more than 10 rafts (outside 10 x 10)`);
  let full = 0; for (const a of fits[0]) for (const b of fits[1]) for (const c of fits[2]) { const used = {}; for (const q of [a, b, c]) used[q.k] = (used[q.k] || 0) + q.n; if (K.every(k => (used[k] || 0) <= g.count[k])) full++; }
  say(full === 1 || full === 2, `seed ${seed}: ${full} plans serve all three towns`); if (full === 1) stat.full1++; else stat.full2++;
  // the trap, again by its own search: a fit for one town alone that no full plan uses
  let trap = 0; fits.forEach((a, i) => a.forEach(q => { if (q.n > g.count[q.k]) return; let inFull = false; for (const x of fits[(i + 1) % 3]) for (const y of fits[(i + 2) % 3]) { const used = {}; for (const z of [q, x, y]) used[z.k] = (used[z.k] || 0) + z.n; if (K.every(k => (used[k] || 0) <= g.count[k])) inFull = true; } if (!inFull) trap++; }));
  say(trap >= 1, `seed ${seed}: no trap: the towns can be done one at a time`); stat.trapTowns += trap;
  // the dials
  const ds = TOWNS.map(t => g.towns[t].dial); say(ds.map(d => d.form).sort().join() === FORMS.slice().sort().join(), `seed ${seed}: the three dials do not ask in three ways`);
  ds.forEach((d, i) => { say(d.n * d.k === d.b && d.n >= 2 && d.n <= 9 && d.b <= 81 && d.b !== 24 && K.indexOf(d.k) >= 0, `seed ${seed}: a dial is wrong: ${JSON.stringify(d)}`); say(orders.indexOf(d.b) < 0, `seed ${seed}: a dial shows a town's order`); say(!fits[i].some(q => q.k === d.k && q.n === d.n), `seed ${seed}: a dial shows its own town's answer`); });
  say(new Set(ds.map(d => d.b)).size === 3, `seed ${seed}: two dials are the same`);
  stat.kinds[K.join('-')] = (stat.kinds[K.join('-')] || 0) + 1; stat.choices += fits.filter(a => a.length >= 2).length; stat.rafts += K.reduce((s, k) => s + g.count[k], 0); stat.maxOrder = Math.max(stat.maxOrder, ...orders); }
console.log(`children checked: ${N}`);
console.log(`sets of raft kinds used: ${Object.keys(stat.kinds).length} of 10; rafts in a harbour, on average: ${(stat.rafts / N).toFixed(1)}; the biggest order: ${stat.maxOrder}`);
console.log(`plans that serve all three towns: one plan for ${(stat.full1 / N * 100).toFixed(0)}% of children, two plans for ${(stat.full2 / N * 100).toFixed(0)}%`);
console.log(`towns with a choice of kind, on average: ${(stat.choices / N).toFixed(2)} of 3; choices that look right alone but spoil the plan, on average: ${(stat.trapTowns / N).toFixed(2)}`);
console.log(bad.length ? 'FAILED:\n  ' + bad.join('\n  ') : `ok: ${N} children: every town can be served, by 1 or 2 plans; every child has a real choice and a trap; every fact is inside 10 x 10; no dial gives this season away`);
process.exit(bad.length ? 1 : 0);
