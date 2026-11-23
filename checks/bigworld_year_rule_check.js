// Algora's deciding years: the number rule for the first kind of decision, "HOW MUCH?".   [DRAFT 2: nothing here is in the page yet.]
// Story: proposals/GMQ_Algora_Story_v1_2026-11-23.md.  Maths: proposals/GMQ_Big_World_Maths_Fit_v1_2026-11-23.md (version 2).
// [Source: Marc, 23 November] "For these they use the multiples. 3, 6, 9, 12." A row starts from nothing and climbs by the same step.
//
// Draft 1 covered three kinds. A joint review of story and maths found the second and third kinds not ready (no table at New Year; costs that
// contradict the story). They are PARKED. This file is the first kind only, with what that review asked for:
//   - the raft never comes on the count day after the last cut ("the next number" is not counting ahead)
//   - bands of steps, so one size is not too wide: small 2, 5, 10; low 3, 4, 6; high 7, 8, 9; big 11 to 15.
//     (Bands of two steps were tried first. A town then had 4 to 6 problems, and the picker ran dry. Three steps is the least that works.)
//   - a picker: after any year, the next problem has a new step, a new count day AND a new answer, and its answer is no number the last year showed
//   - what follows a miss, as a rule that is checked: the oil the town ends with, for every number a child could type
//
// THE PROBLEM.  The tally stick has four cuts: k, 2k, 3k, 4k.  "My raft comes on count day N, after the count. How many mats will there be, in all?"   answer k x N
// WHAT FOLLOWS.  The seller pours one pot of oil for each mat promised (S). On count day N the town has T = k x N mats.
//   S = T: she takes every mat. The town has T pots.
//   S < T: she takes S mats. T - S spare mats lie on the dock. The town has S pots.
//   S > T: she takes T mats, and S - T hooks on her raft are empty. For each empty hook she takes back TWO pots. The town has T - (S - T) pots, and never fewer than none.
//   So d too few and d too many both leave the town d pots short. Neither way is the safe way.   [A proposal to the story thread: its note says only "takes pots of oil back".]
//
// It lists EVERY case; it does not sample.   Run:  node checks/bigworld_year_rule_check.js
'use strict';
const SHOWN = 4, BOX_MAX = 99;      /* cuts on the tally stick at the Lake Market; the biggest number the box takes (her raft holds 99 pots) */
const BANDS = { small: [2, 5, 10], low: [3, 4, 6], high: [7, 8, 9], big: [11, 12, 13, 14, 15] };
const EXAMPLE = { step: 5, n: 8 };      /* the finished example: another keeper, long ago, four cuts 5, 10, 15, 20 and a promise for count day 8. No child is given this row. */
const pots = (S, T) => S <= T ? S : Math.max(0, T - (S - T));
/* "Double the 4th cut" is NOT here: for count day 8 it is a right way, and a good one. */
function wrongWays(k, n) { return [ { name: 'the next cut', v: (SHOWN + 1) * k }, { name: 'one count day short', v: k * (n - 1) }, { name: 'one count day over', v: k * (n + 1) }, { name: 'the last cut plus the count day', v: SHOWN * k + n },
  { name: 'the last cut plus the step', v: SHOWN * k + k }, { name: 'the step plus the count day', v: k + n }, { name: 'N more count days from the market', v: k * (SHOWN + n) }, { name: 'only the mats made after the market', v: k * (n - SHOWN) }, { name: 'all the cuts added up', v: k * (1 + 2 + 3 + 4) } ]; }
/* THE SMALL ROW  [the story's section 5: "a child's own rack"].  No stick: a child's chore brings one bundle each count day (a pair of sandals, a hand of five plums,
   a bundle of ten fire sticks). In the first week gran ties one loop for each thing there will be "on count day N, after the count". Nothing is cut yet, so any count day from 3 on can be asked. */
const SMALL_FROM = 3, smallWrong = (k, n) => [ { name: 'the bundle plus the count day', v: k + n }, { name: 'one count day short', v: k * (n - 1) }, { name: 'one count day over', v: k * (n + 1) }, { name: 'the count day itself', v: n }, { name: 'the bundle itself', v: k } ];
function pool(band, gold) { const out = [], small = band === 'small'; for (const k of BANDS[band]) for (let n = small ? SMALL_FROM : SHOWN + 2; n <= gold; n++) { const T = k * n; if (T > BOX_MAX) continue; if (k === EXAMPLE.step && n === EXAMPLE.n) continue; if ((small ? smallWrong(k, n) : wrongWays(k, n)).some(w => w.v === T)) continue; out.push({ k, n, T }); } return out; }
/* the picker: the next problem after one with step k, count day n, answer T, where the child said S */
function next(band, gold, last, seed) { const ok = pool(band, gold).filter(c => !last || (c.k !== last.k && c.n !== last.n && c.T !== last.T && c.T !== last.S && (band === 'small' || [1, 2, 3, 4].every(i => i * c.k !== last.T)))); return ok.length ? ok[seed % ok.length] : null; }      /* the new stick's four cuts never show last year's answer. (The small row has no cuts.) */
const bad = [], say = (ok, what) => { if (!ok) bad.push(what); };
for (const gold of [7, 9]) { console.log(`\nA year with ${gold} gold months (${gold} count days):`);
  for (const band of Object.keys(BANDS)) { const all = pool(band, gold);
    for (const c of all) { if (band !== 'small') say(c.n > SHOWN + 1, `${band} ${c.k}x${c.n}: the raft comes on the very next count day`); say(c.T <= BOX_MAX, `${band} ${c.k}x${c.n}: over ${BOX_MAX}`);
      if (band !== 'big') say(c.k <= 10 && c.n <= 10, `${band} ${c.k}x${c.n}: outside 10 x 10`);
      /* what follows at the Market: every number a child could type. (The small row has loops, not oil: a miss leaves things on the floor, or empty loops, and both can be counted.) */ if (band !== 'small') for (let S = 0; S <= BOX_MAX; S++) { const p = pots(S, c.T); say(p >= 0 && p <= c.T, `${c.k}x${c.n}, said ${S}: ${p} pots`); say((S === c.T) === (p === c.T), `${c.k}x${c.n}, said ${S}: a miss that costs nothing, or a right answer that costs`); if (S !== c.T && 2 * c.T - S >= 0 && 2 * c.T - S <= BOX_MAX) say(p === pots(2 * c.T - S, c.T), `${c.k}x${c.n}: ${S} and ${2 * c.T - S} are as far out and do not cost the same`); } }
    /* how long a chain can the picker make in this band, never repeating a problem, each one new in step, count day and answer? */
    let chain = 0, last = null; const used = {}; for (let i = 0; i < 60; i++) { const ok = pool(band, gold).filter(c => !used[c.k + 'x' + c.n] && (!last || (c.k !== last.k && c.n !== last.n && c.T !== last.T))); if (!ok.length) break; last = ok[0]; used[last.k + 'x' + last.n] = 1; chain++; }
    console.log(`  ${band.padEnd(6)} steps ${String(BANDS[band]).padEnd(15)} ${String(all.length).padStart(2)} problems: ${all.map(c => c.k + 'x' + c.n).join(' ')}   | in a row, all new: ${chain}`);
    if (gold === 9) say(all.length >= 5, `${band}: only ${all.length} problems in a year of 9 gold months`); } }
/* the picker really gives a new step, count day and answer, whatever came before and whatever the child said */
for (const band of Object.keys(BANDS)) for (const c of pool(band, 9)) for (let S = 0; S <= BOX_MAX; S += 7) for (let seed = 0; seed < 5; seed++) { const nx = next(band, 9, { k: c.k, n: c.n, T: c.T, S }, seed); if (!nx) { say(false, `${band}: nothing can follow ${c.k}x${c.n} when the child said ${S}`); continue; } say(nx.k !== c.k && nx.n !== c.n && nx.T !== c.T && nx.T !== S, `${band}: after ${c.k}x${c.n} (said ${S}) the picker gave ${nx.k}x${nx.n}`); }
/* the note's worked examples must be real problems of the pool, with the consequences the note states */
const inPool = (band, k, n) => pool(band, 9).some(c => c.k === k && c.n === n);
say(inPool('low', 6, 7), 'the note\'s example 6, 12, 18, 24 on count day 7 is not in the low band'); say(6 * 7 === 42, '6 x 7'); say(pots(36, 42) === 36 && 42 - 36 === 6, 'said 36: 6 spare mats, 36 pots'); say(pots(48, 42) === 36 && 48 - 42 === 6, 'said 48: 6 empty hooks, 36 pots'); say(pots(99, 42) === 0, 'said 99: no oil at all');
say(!inPool('small', EXAMPLE.step, EXAMPLE.n), 'the finished example is a child\'s problem'); say(EXAMPLE.step * EXAMPLE.n === 40, 'the finished example comes to 40');
console.log(bad.length ? '\nFAILED:\n  ' + [...new Set(bad)].slice(0, 30).join('\n  ') : '\nok: every "how much" problem is listed and holds; a miss always costs, a right answer never does, and too few costs what too many costs; the picker always finds a new step, count day and answer');
process.exit(bad.length ? 1 : 0);
