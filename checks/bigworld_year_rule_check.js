// Algora's deciding years: the number rule for the three kinds of decision, at three sizes.   [DRAFT: nothing here is in the page yet.]
// Story: proposals/GMQ_Algora_Story_v1_2026-11-23.md (sections 1, 3, 5).  Maths: proposals/GMQ_Big_World_Maths_Fit_v1_2026-11-23.md.
// [Source: Marc, 23 November] "For these they use the multiples. 3, 6, 9, 12." So every row starts from nothing and climbs by the same amount.
//
// There are so few cases that this does not sample: it lists EVERY case and checks each one.
//   kind 1  HOW MUCH      the mats row has four cuts: k, 2k, 3k, 4k. "How many mats, in all, after count day N?"     answer k x N
//   kind 2  HOW MANY      "The store must gain R sacks on every count day. One plot brings a. How many plots?"        answer R / a
//   kind 3  FOR HOW LONG  "The wall needs B blocks. The carts bring c on every count day. For how many months?"       answer B / c
// Sizes: small (a family: steps of 2, 5, 10), full (a town: 3, 4, 6, 7, 8, 9), big (a town with more houses: 11 to 15).
// A size is a range of the step, never a different kind of sum.
//
// What it checks for every case:
//   - every total is 100 or less; count days and months never pass 7 (the gold season)
//   - the answer is not a number the keeper has just said (so it cannot be parroted)
//   - no likely wrong method lands on the right answer (listed below, for each kind)
//   - small and full use only facts inside 10 x 10
//   - the finished example's own row (5, 10, 15 ... 35) is never a child's problem
// And for the engine: after a miss the next problem must have a new step AND a new count; it checks that enough such problems exist.
//
// Run:  node checks/bigworld_year_rule_check.js
'use strict';
const SIZES = {      /* small: the skip counts of the year before (2, 5, 10), which is the step below in Marc's skill map. full: the Grade 3 tables. big: steps past the tables, by skip counting. */
  1: { small: { step: [2, 5, 10], n: [5, 6, 7] }, full: { step: [3, 4, 6, 7, 8, 9], n: [5, 6, 7] }, big: { step: [11, 12, 13, 14, 15], n: [5, 6, 7] } },
  2: { small: { step: [2, 5, 10], n: [2, 3, 4, 5, 6] }, full: { step: [3, 4, 6, 7, 8, 9], n: [3, 4, 5, 6, 7, 8, 9] }, big: { step: [11, 12, 13, 14, 15], n: [3, 4, 5, 6, 7, 8] } },
  3: { small: { step: [2, 5, 10], n: [2, 3, 4, 5, 6] }, full: { step: [3, 4, 6, 7, 8, 9], n: [3, 4, 5, 6, 7] }, big: { step: [11, 12, 13, 14, 15], n: [3, 4, 5, 6, 7] } } };
const EXAMPLE = { step: 5, n: 7 };      /* the finished example on the old wall: 5, 10, 15 ... 35. No child is given this row. */
const SHOWN = 4;      /* cuts on the wall at the Lake Market */
/* every case of a kind and size: { step, n, total, ask, answer, said } where "said" are the numbers the child has been given */
function cases(kind, size) { const S = SIZES[kind][size], out = [];
  for (const step of S.step) for (const n of S.n) { const total = step * n; if (total > 100) continue;
    const c = kind === 1 ? { step, n, total, answer: total, said: [1, 2, 3, 4].map(i => i * step).concat([n]) } : { step, n, total, answer: n, said: [total, step] };
    if (step === EXAMPLE.step && n === EXAMPLE.n) continue;                        /* the finished example's own row */
    if (c.said.indexOf(c.answer) >= 0) continue;                                   /* the answer is a number just said */
    if (wrongWays(kind, c).some(w => w.v === c.answer)) continue;                   /* a wrong method lands on it */
    out.push(c); } return out; }
/* likely wrong methods, each with a name. A case is refused if any of them gives the right answer. */
function wrongWays(kind, c) { const k = c.step, n = c.n, T = c.total;
  if (kind === 1) return [ { name: 'the next cut only', v: (SHOWN + 1) * k, skip: n === SHOWN + 1 }, { name: 'one count day short', v: k * (n - 1) }, { name: 'one count day over', v: k * (n + 1) },
    { name: 'the last cut plus the count day', v: SHOWN * k + n }, { name: 'the last cut plus the step', v: SHOWN * k + k, skip: n === SHOWN + 1 }, { name: 'the step plus the count day', v: k + n }, { name: 'double the last cut', v: 2 * SHOWN * k } ].filter(w => !w.skip);
  return [ { name: 'take the step away', v: T - k }, { name: 'add them', v: T + k }, { name: 'the step itself', v: k } ]; }      /* halving is not listed: when the step is 2 it is the right way */
const bad = [], say = (ok, what) => { if (!ok) bad.push(what); }, NAMES = { 1: 'how much', 2: 'how many', 3: 'for how long' };
for (const kind of [1, 2, 3]) for (const size of ['small', 'full', 'big']) { const all = cases(kind, size), S = SIZES[kind][size];
  say(all.length >= (size === 'small' ? 6 : 12), `${NAMES[kind]}, ${size}: only ${all.length} problems`);
  for (const c of all) { say(c.total <= 100, `${NAMES[kind]} ${size} ${c.step}x${c.n}: over 100`); say(c.n <= 9 && (kind === 2 || c.n <= 7), `${NAMES[kind]} ${size} ${c.step}x${c.n}: past the 7th count day`);
    if (size !== 'big') say(c.step <= 10 && c.n <= 10, `${NAMES[kind]} ${size} ${c.step}x${c.n}: outside 10 x 10`); say(!(c.step === EXAMPLE.step && c.n === EXAMPLE.n), `${NAMES[kind]} ${size}: the finished example's row is a child's problem`);
    if (kind === 1) say(c.n > SHOWN, `how much ${size}: count day ${c.n} is already cut on the wall`); }
  /* the engine: assess, a new one, then up to three gates of three: twelve of one size, each with a new step and a new count from the one before */
  let chain = 0, last = null; const pool = all.slice(); for (let i = 0; i < 400 && chain < 12; i++) { const pick = pool.find(c => !last || (c.step !== last.step && c.n !== last.n)); if (!pick) break; pool.splice(pool.indexOf(pick), 1); last = pick; chain++; }
  say(chain >= 12 || size !== 'full', `${NAMES[kind]}, full: a child can meet only ${chain} problems in a row with a new step and a new count each time (the engine may ask for 12)`);
  const ans = all.map(c => c.answer), tot = all.map(c => c.total);
  console.log(`${NAMES[kind].padEnd(13)} ${size.padEnd(5)} steps ${String(S.step).padEnd(16)} ${String(all.length).padStart(3)} problems; totals ${Math.min(...tot)} to ${Math.max(...tot)}; answers ${Math.min(...ans)} to ${Math.max(...ans)}; in a row with new step and count: ${chain}`); }
/* the cases the rule refuses, and why: printed so a person can read them */
console.log('\nrefused, with the reason:');
for (const kind of [1, 2, 3]) for (const size of ['small', 'full', 'big']) { const S = SIZES[kind][size]; for (const step of S.step) for (const n of S.n) { const total = step * n; if (total > 100) continue; const c = kind === 1 ? { step, n, total, answer: total, said: [1, 2, 3, 4].map(i => i * step).concat([n]) } : { step, n, total, answer: n, said: [total, step] };
  const why = c.said.indexOf(c.answer) >= 0 ? 'the answer is a number just said' : (wrongWays(kind, c).find(w => w.v === c.answer) || {}).name; if (why) console.log(`  ${NAMES[kind]}, ${size}: step ${step}, ${kind === 1 ? 'count day' : 'answer'} ${n} (${total}): ${why}`); } }
/* what follows a miss: its size comes from the child's own number. Worked for one case of each kind, as the note does. */
const ex = [ ['how much: 6, 12, 18, 24; after count day 7', 6 * 7, 42], ['how many: the store must gain 24; a plot brings 4', 24 / 4, 6], ['for how long: 40 blocks; the carts bring 8', 40 / 8, 5], ['big, how much: 12, 24, 36, 48; after count day 7', 12 * 7, 84] ];
for (const [what, got, want] of ex) say(got === want, `the note's example "${what}" is ${got}, not ${want}`);
console.log(bad.length ? '\nFAILED:\n  ' + bad.join('\n  ') : '\nok: every case of the three kinds at three sizes is listed and holds; the note\'s examples are right');
process.exit(bad.length ? 1 : 0);
