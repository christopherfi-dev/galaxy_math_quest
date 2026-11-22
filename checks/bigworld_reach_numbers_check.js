// The Reach (region 2 of the big world): its number rule, checked BEFORE anything is built.
// Design note: proposals/GMQ_Big_World_Reach_Design_v1_2026-11-22.md.   [Proposal: nothing here is in the page yet]
//
// The rule is written here, in this file, so the design can be checked on thousands of children first.
// When the Reach is built, the rule moves into the page (between NUM-BEGIN and NUM-END) and this check reads it from there.
//
// THE THREE TOWNS
//   Every raft carries the same number of baskets: `each` (4, 6, 7, 8 or 9).
//   Three towns need rafts: big, mid and small (three different numbers from 3 to 9).
//   The fleet has `fleet` rafts. Kept by the rule:
//     - all three towns together need more rafts than the fleet has: somebody goes short
//     - the two biggest towns together do NOT fit: a plan that is not checked can fail
//     - the other two pairs DO fit: more than one plan works, so the choice is the child's
//     - a spare raft or two is never enough for the town left out
//     - every sum a child must do is a Grade 3 fact: inside 10 x 10, nothing over 81
//     - no town has the finished example's numbers (4 trays of 6 loaves = 24)
//   Each town's dock dial has one window burnt out. The three dials ask in three ways:
//     rafts:  ? x each = baskets      total:  rafts x each = ?      share:  baskets ÷ each = ?
//
// Run:  node checks/bigworld_reach_numbers_check.js
function wrng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const TOWNS = ['stilt', 'reed', 'mud'], FORMS = ['rafts', 'total', 'share'];
function bwReachNumbers(seed) {
  for (let k = 0; k < 200; k++) { const r = wrng((seed >>> 0) * 6151 + k * 7723 + 3), pick = a => a[Math.floor(r() * a.length)], mixed = a => a.map(v => [r(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
    const each = pick([4, 6, 7, 8, 9]), ns = mixed([3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => b - a), [big, mid, small] = ns;
    const lo = big + small, hi = big + mid - 1; if (hi < lo) continue; const fleet = lo + Math.floor(r() * (hi - lo + 1));
    if (ns.some(n => n === 4 && each === 6)) continue;      // the finished example: 4 trays of 6 loaves
    if (fleet > 16) continue;                               // a fleet a child can count in the picture
    const order = mixed([0, 1, 2]), forms = mixed(FORMS), towns = {};
    TOWNS.forEach((t, i) => { const n = ns[order[i]]; towns[t] = { rafts: n, baskets: n * each, form: forms[i] }; });
    return { each, fleet, towns }; }
  return null; }

const bad = [], say = (ok, what) => { if (!ok && bad.length < 25) bad.push(what); };
const N = 20000, stat = { each: {}, fleet: {}, plans: 0, forms: {} };
for (let seed = 1; seed <= N; seed++) { const g = bwReachNumbers(seed); if (!g) { say(false, `seed ${seed}: no numbers`); continue; }
  const ts = TOWNS.map(t => g.towns[t]), ns = ts.map(t => t.rafts).sort((a, b) => b - a), [big, mid, small] = ns;
  say([4, 6, 7, 8, 9].indexOf(g.each) >= 0, `seed ${seed}: ${g.each} baskets on a raft`);
  say(new Set(ns).size === 3 && ns.every(n => n >= 3 && n <= 9), `seed ${seed}: the towns need ${ns}`);
  say(ts.every(t => t.baskets === t.rafts * g.each && t.baskets >= 12 && t.baskets <= 81), `seed ${seed}: a town's baskets are wrong or over 81`);
  say(big + mid + small > g.fleet, `seed ${seed}: the fleet can feed everyone`);
  say(big + mid > g.fleet, `seed ${seed}: the two biggest towns fit`);
  say(big + small <= g.fleet && mid + small <= g.fleet, `seed ${seed}: a pair that should fit does not`);
  say(g.fleet - (big + small) < mid && g.fleet - (mid + small) < big, `seed ${seed}: the spare rafts could feed the town left out`);
  say(g.fleet >= 7 && g.fleet <= 16, `seed ${seed}: a fleet of ${g.fleet}`);
  say(ts.map(t => t.form).sort().join() === FORMS.slice().sort().join(), `seed ${seed}: the three dials do not ask in three ways`);
  say(!ts.some(t => t.rafts === 4 && g.each === 6), `seed ${seed}: a town has the finished example's numbers`);
  // every plan a child could send: how many rafts to each town, 0 to the fleet. Which towns are fed? (A town is fed when its rafts carry all it asked for.)
  const fedSets = {}; for (let a = 0; a <= g.fleet; a++) for (let b = 0; a + b <= g.fleet; b++) for (let c = 0; a + b + c <= g.fleet; c++) { const fed = [a >= ts[0].rafts, b >= ts[1].rafts, c >= ts[2].rafts]; fedSets[fed.map(f => f ? 1 : 0).join('')] = 1; }
  say(!fedSets['111'], `seed ${seed}: some plan feeds all three`); const two = Object.keys(fedSets).filter(k => k.split('1').length - 1 === 2).length; say(two === 2, `seed ${seed}: ${two} pairs of towns can be fed, not 2`); stat.plans += two;
  stat.each[g.each] = (stat.each[g.each] || 0) + 1; stat.fleet[g.fleet] = (stat.fleet[g.fleet] || 0) + 1; ts.forEach((t, i) => { stat.forms[TOWNS[i] + ':' + t.form] = 1; }); }
console.log(`children checked: ${N}`);
console.log(`baskets on a raft: ${Object.keys(stat.each).map(k => `${k}: ${(stat.each[k] / N * 100).toFixed(0)}%`).join(', ')}`);
console.log(`fleet sizes: ${Object.keys(stat.fleet).map(k => `${k}: ${(stat.fleet[k] / N * 100).toFixed(0)}%`).join(', ')}`);
console.log(`every town meets every kind of dial: ${Object.keys(stat.forms).length} of 9 pairings seen`);
console.log(bad.length ? 'FAILED:\n  ' + bad.join('\n  ') : `ok: ${N} children: nobody can feed all three towns, the two biggest never fit, exactly two pairs do, and every sum is a Grade 3 fact`);
process.exit(bad.length ? 1 : 0);
