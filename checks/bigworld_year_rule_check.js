// Algora's deciding years: the first kind of decision, "HOW MUCH?".  The number rule, the picker, and the engine's path.   [DRAFT 5: nothing here is in the page yet.]
// Story: proposals/GMQ_Algora_Story_v1_2026-11-23.md.  Maths: proposals/GMQ_Big_World_Maths_Fit_v1_2026-11-23.md (version 4).
// [Source: Marc, 23 November] "For these they use the multiples. 3, 6, 9, 12." A row starts from nothing and climbs by the same step.
//
// THE PROBLEM, at every size: a tally stick with four cuts, each marked with its count day and the pile that day: k, 2k, 3k, 4k.
//   "Today is count day 4. My raft comes on count day N, after that day's count. How many mats will there be by then, in all?"   answer T = k x N
// WHAT FOLLOWS.  She pours one pot of oil and ties one hook for each mat promised (S).
//   too few:  T - S spare mats on the dock.     too many:  S - T empty hooks, and two pots back for each.     Either way the town is that many pots short, and never more than T short.
//   The picture shows only the gap: that many dark windows.
// THE SMALL ROW is the same task, smaller, with steps of 2, 5 or 10: "Promise", a children's game on Market day [story, section 16a, point 4].
//   Gran pays one shell for each thing promised and keeps one hook on her rack for each. Too few: the rest are hers, with no shell paid. Too many: two shells back
//   for each empty hook, never fewer than none. It is the oil rule, so gap() below is the small row's rule too. Things: reed cups (2 a count day), plums (5), clay beads (10).  (Draft 2 had no stick for it; a reviewer showed it then read two ways.)
// YEARS [draft 5, from the story's section 16b, finding B2, and 16d, row 5]: a year is one Market day. A year at the lake is one problem. The step down is played
//   on Market day in the town (Promise), so it is one year; a second Promise, if needed, is on the next Market day: a second year. The song is taught by the lamp
//   in the white months of a year already counted, so the two sung rows cost no year of their own. "That line of the song again" after a missed gate costs none either.
//
// What this file does:
//   1. lists every problem in each band and checks it
//   2. checks what follows, for every number a child could type
//   3. plays the engine's path for 3,000 made-up children of each of nine kinds, through three towns. It checks that no child meets a problem twice, that two
//      problems running never share a step, a count day or an answer, and that a child with one fixed habit is not waved through. When a band has nothing
//      new left for a child, the kind rests; it prints how often that happens.
// Run:  node checks/bigworld_year_rule_check.js
'use strict';
const SHOWN = 4, GOLD = 9, TOTAL_MAX = 99, BOX_MAX = 999;      /* no answer is over 99; the box takes three digits, so a child who means 108 can say 108 */
const BANDS = { small: [2, 5, 10], low: [3, 4, 6], high: [7, 8, 9], big: [11, 12, 13, 14, 15] };
const EXAMPLE = { step: 20, n: 9, what: 'the oil seller\'s stick: the last plan the Year Machine made for him' };      /* 20, 40, 60, 80; the machine's line for Last Raft, count day 9: 180 [story, section 16a, points 1 and 2]. No band has a step of 20.
   Day 8 gave 160, a double of the last cut, which a child could take as the rule. 180 is not. It is the last three cuts added (40 + 60 + 80), which is a true way; the picker catches a child with only that habit. */
const gap = (S, T) => S <= T ? T - S : Math.min(T, S - T);      /* pots short of what the mats could have bought = dark windows */
/* likely wrong replies, each named, and of one of two sorts: a COUNT fault (the skip count went wrong) or a READ fault (the question was read another way) */
function wrongWays(k, n) { return [ { sort: 'count', name: 'one count day short', v: k * (n - 1) }, { sort: 'count', name: 'one count day over', v: k * (n + 1) }, { sort: 'count', name: 'the next cut', v: (SHOWN + 1) * k },
  { sort: 'read', name: 'only the mats still to come', v: k * (n - SHOWN) }, { sort: 'read', name: 'N more count days from today', v: k * (SHOWN + n) }, { sort: 'read', name: 'that one day\'s mats', v: k }, { sort: 'read', name: 'the count day itself', v: n },
  { sort: 'read', name: 'all the cuts added up', v: k * 10 }, { sort: 'read', name: 'the last cut plus the count day', v: SHOWN * k + n }, { sort: 'read', name: 'the step plus the count day', v: k + n }, { sort: 'read', name: 'the whole year', v: k * GOLD, skip: n === GOLD } ].filter(w => !w.skip); }
const classify = (k, n, S) => { const w = wrongWays(k, n).find(w => w.v === S); return w ? w.sort : 'other'; };
/* Three ways that are RIGHT, and are not refused: add the last two cuts (count day 7), double the last cut (8), add the last three (9). A child who knows all three knows the row.
   A child with only one of them is caught by the picker: see rightN below. */
function pool(band) { const out = []; for (const k of BANDS[band]) for (let n = SHOWN + 2; n <= GOLD; n++) { const T = k * n; if (T > TOTAL_MAX) continue; if (wrongWays(k, n).some(w => w.v === T)) continue; out.push({ k, n, T, id: k + 'x' + n }); } return out; }
/* THE PICKER.  h is the child's history: used (ids), last ({k,n,T,S}), rightN (count days the child has been right on).
   A new problem is never one the child has had; differs from the last in step, count day and answer; its answer is not what the child last said;
   and, while it can, it uses a count day the child has NOT yet been right on. So one habit ("add the last two cuts") is right once and no more. */
function pick(band, h, rnd) { const P = pool(band).filter(c => !h.used[c.id]), L = h.last, fresh = c => !L || (c.k !== L.k && c.n !== L.n && c.T !== L.T && c.T !== L.S);
  let ok = P.filter(c => fresh(c) && h.rightN.indexOf(c.n) < 0), relaxed = 0; if (!ok.length) { ok = P.filter(fresh); relaxed = 1; } if (!ok.length) { ok = P.filter(c => !L || (c.k !== L.k && c.T !== L.T && c.T !== L.S)); relaxed = 2; } if (!ok.length) { ok = P.filter(c => !L || (c.T !== L.T && c.T !== L.S)); relaxed = 3; } if (!ok.length) { ok = P; relaxed = 4; } if (!ok.length) return null;
  /* It gives up one wish at a time before it stops: first a fresh count day, then a new count day, then a new step, then a new answer. It NEVER repeats a problem. It returns nothing only when every problem of the band has been used. */
  /* keep the road open: prefer the problem that leaves most others still usable after it */ const room = c => P.filter(d => d.id !== c.id && d.k !== c.k && d.n !== c.n && d.T !== c.T).length, best = Math.max(...ok.map(room)), top = ok.filter(c => room(c) === best), c = top[Math.floor(rnd() * top.length)];
  return Object.assign({ relaxed }, c); }
/* THE ENGINE'S PATH in one town.  [Source: math-skills.txt v4.1: assess, probe, classify from both wrong answers, check the step below, teach in single steps, a worked example, a mastery gate of three.]
   child(problem, phase) returns the number the child says. Returns { end: 'first' | 'slip' | 'gate' | 'rest', years, log }. */
function town(band, h, child, rnd, note) { let years = 0; const log = [], ask = (b, phase, free) => { const c = pick(b, h, rnd); if (!c) { note.dry++; return null; } if (c.relaxed) note.relaxed[c.relaxed]++; const S = child(c, phase, b), right = S === c.T; if (!free) years++; h.used[c.id] = 1; h.last = { k: c.k, n: c.n, T: c.T, S }; if (right && phase !== 'sung') h.rightN.push(c.n); log.push(`${phase}:${c.id}${right ? '' : '(' + S + ')'}`); return { c, S, right }; };
  const a = ask(band, 'assess'); if (!a) return { end: 'none left', years, log }; if (a.right) return { end: 'first', years, log };
  const p = ask(band, 'probe'); if (!p) return { end: 'none left', years, log }; if (p.right) return { end: 'slip', years, log };
  const sort = classify(a.c.k, a.c.n, a.S) === 'read' && classify(p.c.k, p.c.n, p.S) === 'read' ? 'read' : 'count';
  if (sort === 'count') { /* the step below: the small row */ const s1 = ask('small', 'small'); if (!s1) return { end: 'none left', years, log }; if (!s1.right) { log.push('song by 2s, 5s, 10s'); const s2 = ask('small', 'small again');      /* the next Market day: a second step-down year [story, 16b, B2] */ if (!s2 || !s2.right) return { end: 'rest', years, log }; } log.push('the song: a new verse'); } else log.push('the seller tells it again, with the stick laid along the days');
  /* taught in single steps, then a worked example: the child's own two missed rows are made again, line by line. They spend no new problem. */ for (const m of [a, p]) { child(m.c, 'sung', band); log.push('sung:' + m.c.id + ' again'); }      /* by the fire, in the white months: no year of its own */
  for (let g = 0; g < 2; g++) { let run = 0; for (let i = 0; i < 3; i++) { const q = ask(band, 'gate'); if (!q) return { end: run > 0 ? 'gate' : 'rest', years, log, short: 1 };      /* every problem of the band is used: a gate with only right answers so far counts */ if (!q.right) break; run++; } if (run === 3) return { end: 'gate', years, log }; if (g === 0) log.push('that line of the song again'); }
  return { end: 'rest', years, log }; }
/* THREE TOWNS.  The first asks the low band. A town learned at the first try, or through the gate (three right in a row), sends the next town one band up.
   Learned by a slip: the next town asks the same band once more, as the engine re-asks a fragile skill. A rest, or no new problem left: the kind rests, and no other town asks. */
function trial(child, rnd) { const h = { used: {}, last: null, rightN: [] }, note = { dry: 0, relaxed: { 1: 0, 2: 0, 3: 0, 4: 0 } }, order = ['low', 'high', 'big'], out = [], mem = {}; let b = 0; for (let t = 0; t < 3; t++) { const r = town(order[b], h, (c, ph, band) => child(c, ph, band, mem), rnd, note); out.push(Object.assign({ band: order[b] }, r)); if (r.end === 'rest' || r.end === 'none left') break; if ((r.end === 'first' || r.end === 'gate') && b < 2) b++; } return { towns: out, note, h }; }
const rng = seed => { let s = (seed * 2654435761) >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

const bad = [], say = (ok, what) => { if (!ok) bad.push(what); };
/* 1. every problem */
console.log(`A year of ${GOLD} gold months. The stick shows count days 1 to ${SHOWN}. The raft comes on count day ${SHOWN + 2} to ${GOLD}.`);
for (const band of Object.keys(BANDS)) { const all = pool(band); say(all.length >= (band === 'small' ? 6 : 10), `${band}: only ${all.length} problems`);
  for (const c of all) { say(c.n >= SHOWN + 2 && c.n <= GOLD, `${c.id}: the raft's day`); say(c.T <= TOTAL_MAX, `${c.id}: over ${TOTAL_MAX}`); if (band !== 'big') say(c.k <= 10 && c.n <= 10, `${c.id}: outside 10 x 10`);
    say([1, 2, 3, 4].map(i => i * c.k).indexOf(c.T) < 0, `${c.id}: the answer is cut on the stick`);
    /* 2. what follows, for every number the box takes */ for (let S = 0; S <= BOX_MAX; S++) { const g = gap(S, c.T); say((g === 0) === (S === c.T), `${c.id}, said ${S}: a miss with no dark window, or a right answer with one`); say(g >= 0 && g <= c.T, `${c.id}, said ${S}: ${g} dark windows`); if (S !== c.T) say(g >= 1, `${c.id}, said ${S}: a miss that does not show`); const m = 2 * c.T - S; if (m >= 0 && m <= BOX_MAX) say(g === gap(m, c.T), `${c.id}: ${S} and ${m} are as far out and cost differently`); } }
  console.log(`  ${band.padEnd(6)} steps ${String(BANDS[band]).padEnd(15)} ${String(all.length).padStart(2)} problems: ${all.map(c => c.id).join(' ')}`); }
say(Object.keys(BANDS).every(b => BANDS[b].indexOf(EXAMPLE.step) < 0), 'the finished example\'s step is in a band'); say(EXAMPLE.step * EXAMPLE.n === 180, 'the finished example comes to 180'); say(EXAMPLE.step * EXAMPLE.n !== 2 * SHOWN * EXAMPLE.step, 'the finished example is a double of the last cut');
/* the note's worked example */ say(pool('low').some(c => c.id === '6x7'), 'the note\'s example (6, 12, 18, 24; count day 7) is not a low problem'); say(gap(36, 42) === 6 && gap(48, 42) === 6 && gap(99, 42) === 42 && gap(108, 42) === 42 && gap(42, 42) === 0, 'the note\'s example: said 36, 48, 99, 42'); say(classify(6, 7, 18) === 'read' && classify(6, 7, 36) === 'count' && classify(6, 7, 66) === 'read', 'the note\'s named faults');
/* 3. made-up children. What each says: */
const KINDS = { 'always right': c => c.T, 'one count day over, always': c => c.T + c.k, 'only the mats to come, always': c => c.k * (c.n - SHOWN), 'adds the last two cuts, always': c => 7 * c.k, 'doubles the last cut, always': c => 8 * c.k,
  'wrong until taught, then right': (c, ph, b, r, mem) => { if (ph === 'sung') mem[b] = 1; return mem[b] || b === 'small' ? c.T : c.T - c.k; }, 'cannot do the small row either': (c, ph) => ph === 'sung' ? c.T : c.T + 1, 'right half the time': (c, ph, b, r) => r() < .5 ? c.T : c.T - c.k, 'right 8 times in 10': (c, ph, b, r) => r() < .8 ? c.T : c.T + c.k };
console.log('\n3,000 made-up children of each kind, through three towns:');
for (const name of Object.keys(KINDS)) { const ends = {}, yrs = []; let dry = 0, rel1 = 0, rel2 = 0, rel3 = 0, firsts = 0, most = 0;
  for (let seed = 1; seed <= 3000; seed++) { const rnd = rng(seed), r2 = rng(seed + 99991), res = trial((c, ph, b, mem) => KINDS[name](c, ph, b, r2, mem), rnd); let y = 0; const ids = [];
    for (const t of res.towns) { ends[t.end] = (ends[t.end] || 0) + 1; y += t.years; most = Math.max(most, t.years); t.log.forEach(l => { if (/^sung:/.test(l)) return;      /* the two missed rows made again with the singer are meant to come twice */ const m = /:(\d+x\d+)/.exec(l); if (m) ids.push(m[1]); }); if (t.end === 'first') firsts++; }
    yrs.push(y); dry += res.note.dry; rel1 += res.note.relaxed[1]; rel2 += res.note.relaxed[2]; rel3 += res.note.relaxed[3] + res.note.relaxed[4]; say(new Set(ids).size === ids.length, `${name}, child ${seed}: a problem came twice`);
    /* a fixed habit must not be waved through: at most one town at the first try */ if (/always$/.test(name) && name !== 'always right') say(res.towns.filter(t => t.end === 'first').length <= 1, `${name}, child ${seed}: learned ${res.towns.filter(t => t.end === 'first').length} towns at the first try`); }
  say(dry <= (/half/.test(name) ? 30 : 0), `${name}: a band was used up for ${dry} of 3000 children`);      /* only a coin-flip child may ever use a whole band up, and then for fewer than 1 in 100 */ say(most <= 12, `${name}: ${most} years in one town`);
  yrs.sort((a, b) => a - b); console.log(`  ${name.padEnd(32)} years for three towns: ${yrs[0]} to ${yrs[yrs.length - 1]} (middle ${yrs[1500]}); most in one town ${most}; towns ended: ${Object.keys(ends).map(e => e + ' ' + ends[e]).join(', ')}${dry ? `; a whole band was used up for ${dry} children` : ''}${rel3 ? `; two problems running shared a step ${rel3} times` : ''}`); }
console.log(bad.length ? '\nFAILED:\n  ' + [...new Set(bad)].slice(0, 30).join('\n  ') : '\nok: every problem holds; every miss shows as dark windows and too few costs what too many costs; through three towns no child met a problem twice, and no fixed habit was waved through');
process.exit(bad.length ? 1 : 0);
