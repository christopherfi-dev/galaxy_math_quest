// Algora's deciding years: the first kind of decision, "HOW MUCH?".  The number rule, the picker, and the engine's path.   [DRAFT 8: nothing here is in the page yet. Draft 6 answered the fourth joint review; draft 7 followed the story's second review; draft 8 answers the fifth joint review, 23 November.]
// Story: proposals/GMQ_Algora_Story_v1_2026-11-23.md.  Maths: proposals/GMQ_Big_World_Maths_Fit_v1_2026-11-23.md (version 7).
// [Source: Marc, 23 November] "For these they use the multiples. 3, 6, 9, 12." A row starts from nothing and climbs by the same step.
//
// THE PROBLEM, at every size: a tally stick with four cuts, each marked with its count day and the pile that day: k, 2k, 3k, 4k.
//   "Today is count day 4. My raft comes on count day N, after that day's count. How many mats will your town have by then, in all?"   answer T = k x N
// THE SELLER CANNOT COUNT AHEAD [story, 16d, row 5]. A promise LESS than the stick already shows (under 4k) is the one fault he can see: "Your stick has more than that already."
//   He lays the stick along the jetty planks, one for each count day, and asks again, the same year. Any other number runs. Gran does the same at Shells [Proposal].
//   A reply put right this way is SELF-CORRECTED, as the engine says, not right at the first try: it lights the town by a slip, and at the gate it does not count
//   as one of three answers given alone [fifth review, M2].
// THE SAFE WAY of a town not yet learned is the last cut, 4k: "I promise only what I can see." [16d, row 6]. It always leaves (n - 4) x k lamps dark.
// WHAT FOLLOWS.  He pours one pot of oil and ties one hook for each mat promised (S).
//   too few:  T - S spare mats on the dock.     too many:  S - T empty hooks, and two pots back for each.     Either way the town is that many pots short, and never more than T short.
//   On raft day the town sets out one lamp for each mat woven, on the dock at dusk; that many stay dark [16d, row 3].
// THE SMALL ROW is the same task, smaller, with steps of 2, 5 or 10: "Shells" (round 2 called it "Promise"), a children's game on Market day [story, 16a and 16h].
//   Gran pays one shell for each thing promised and keeps one hook on her rack for each. Too few: the rest are hers, with no shell paid. Too many: two shells back
//   for each empty hook, never fewer than none. It is the oil rule, so gap() below is the small row's rule too. Things: lotus pods (2 a count day), plums (5), shrimp (10), each from the family's own pond, tree or trap.  (Draft 2 had no stick for it; a reviewer showed it then read two ways.)
// YEARS [from the story's 16b, finding B2, and 16h]: a year is one Market day. A year at the lake is one problem. The step down is played
//   on Market day in the town (Shells), so it is one year; a second game, if needed, is on the next Market day: a second year. A re-ask costs no year. The song is taught by the lamp
//   in the white months of a year already counted, so the two sung rows cost no year of their own. "That line of the song again" after a missed gate costs none either.
//
//
// What this file does:
//   1. lists every problem in each band and checks it
//   2. checks what follows, for every number a child could type
//   3. plays the engine's path for 3,000 made-up children of each of eighteen kinds, through three towns. It checks:
//      no child meets a problem twice; a child with one fixed habit lights at most one town (at the first try, by a slip, or through the gate);
//      each kind takes the path it should in EVERY town (counting faults to Shells and the song, reading faults to the planks, "decide without me" to the singer);
//      a reading path never meets the song; a child put right on the planks is never counted right at the first try; every child finishes; the first problem
//      is never on count day 9 and its answer is no other first problem's. It PRINTS what it cannot promise: how often two problems running share a step,
//      a count day or an answer (the picker avoids it, and gives up one wish at a time when it must), how often a band runs out, how many
//      different first problems the children get, and what the engine's three gate tries would give in place of two.
// Run:  node checks/bigworld_year_rule_check.js
'use strict';
const SHOWN = 4, GOLD = 9, TOTAL_MAX = 99, BOX_MAX = 999;      /* no answer is over 99; the box takes three digits, so a child who means 108 can say 108 */
const BANDS = { small: [2, 5, 10], low: [3, 4, 6], high: [7, 8, 9], big: [11, 12, 13, 14, 15] };
const EXAMPLE = { step: 20, n: 9, what: 'the oil seller\'s stick: the last plan the Year Machine made for him' };      /* 20, 40, 60, 80; the machine's line for Last Raft, count day 9: 180 [story, section 16a, points 1 and 2]. No band has a step of 20.
   Day 8 gave 160, a double of the last cut, which a child could take as the rule. 180 is not. It is the last three cuts added (40 + 60 + 80), which is a true way; the picker catches a child with only that habit. */
const gap = (S, T) => S <= T ? T - S : Math.min(T, S - T);      /* pots short of what the mats could have bought = dark lamps */
/* likely wrong replies, each named, and of one of two sorts: a COUNT fault (the skip count went wrong) or a READ fault (the question was read another way) */
function wrongWays(k, n) { return [ { sort: 'count', name: 'one count day short', v: k * (n - 1) }, { sort: 'count', name: 'one count day over', v: k * (n + 1) }, { sort: 'count', name: 'the next cut', v: (SHOWN + 1) * k },
  { sort: 'read', name: 'only the mats still to come', v: k * (n - SHOWN) }, { sort: 'read', name: 'N more count days from today', v: k * (SHOWN + n) }, { sort: 'read', name: 'that one day\'s mats', v: k }, { sort: 'read', name: 'the count day itself', v: n },
  { sort: 'read', name: 'what the stick shows now (the last cut)', v: SHOWN * k }, { sort: 'read', name: 'all the cuts added up', v: k * 10 }, { sort: 'read', name: 'the last cut plus the count day', v: SHOWN * k + n }, { sort: 'read', name: 'the step plus the count day', v: k + n }, { sort: 'read', name: 'the whole year', v: k * GOLD, skip: n === GOLD } ].filter(w => !w.skip); }
/* a reply's sort. A reply that is a reading fault AND a counting fault is 'both': it tells nothing, and the other reply decides [fourth review, M2]. It happens on
   count days 6, 8 and 9 and on some rows of a square (section 1 prints them all). No reply ("decide without me") is 'skip'. The sort is the sort of the reply that RAN:
   a child put right on the planks, who then miscounts, is a counting fault [fifth review, B1]. */
const classify = (k, n, S) => { if (S === null) return 'skip'; const w = wrongWays(k, n).filter(w => w.v === S), sorts = [...new Set(w.map(x => x.sort))]; return !sorts.length ? 'other' : sorts.length > 1 ? 'both' : sorts[0]; };
const GATE_TRIES = +(process.env.GATES || 2);      /* the two threads chose two, not the engine's three. Section 3 prints what three would give [fourth review, M5] */
/* Three ways that are RIGHT, and are not refused: add the last two cuts (count day 7), double the last cut (8), add the last three (9). A child who knows all three knows the row.
   A child with only one of them lights one town at most: see rightN below, and the check in section 3. */
function pool(band) { const out = []; for (const k of BANDS[band]) for (let n = SHOWN + 2; n <= GOLD; n++) { const T = k * n; if (T > TOTAL_MAX) continue; if (wrongWays(k, n).some(w => w.v === T)) continue; out.push({ k, n, T, id: k + 'x' + n }); } return out; }
/* THE PICKER.  h is the child's history: used (ids), last ({k,n,T,S}: the last row the child met, or sang), rightN (count days the child has been right on).
   It never gives a problem the child has had. It WISHES, in this order, and gives up one wish at a time only when no problem left meets them all:
     0. the child's very first problem is not on the finished example's count day (9), and its answer is no other first problem's (so a neighbour's answer does not fit)
     1. a count day the child has not yet been right on (so one habit is right once and no more)
     2. a new step, a new count day and a new answer, and not the answer the child last said
     3. a new step and a new answer      4. a new answer      5. any problem not yet used
   Among the problems that meet its wishes it picks BY CHANCE, so the children in one class do not all hear the same stick [fourth review, M1].
   Only when the band runs tight (6 or fewer left) does it prefer the problem that leaves most others usable, so the band does not run out. */
const FIRSTS = band => pool(band).filter(c => c.n !== EXAMPLE.n), firstOK = (band, c) => c.n !== EXAMPLE.n && !FIRSTS(band).some(d => d.id !== c.id && d.T === c.T);
function pick(band, h, rnd) { const P = pool(band).filter(c => !h.used[c.id]), L = h.last, av = h.avoidT || [], fresh = c => !L || (c.k !== L.k && c.n !== L.n && c.T !== L.T && c.T !== L.S && av.indexOf(c.T) < 0);
  const wish = [c => (L || firstOK(band, c)) && h.rightN.indexOf(c.n) < 0 && fresh(c), c => h.rightN.indexOf(c.n) < 0 && fresh(c), fresh, c => !L || (c.k !== L.k && c.T !== L.T && c.T !== L.S), c => !L || (c.T !== L.T && c.T !== L.S), () => true];
  let ok = [], relaxed = 0; for (; relaxed < wish.length; relaxed++) { ok = P.filter(wish[relaxed]); if (ok.length) break; } if (!ok.length) return null;
  if (P.length <= 6) { const room = c => P.filter(d => d.id !== c.id && d.k !== c.k && d.n !== c.n && d.T !== c.T).length, best = Math.max(...ok.map(room)); ok = ok.filter(c => room(c) === best); }
  const c = ok[Math.floor(rnd() * ok.length)]; return Object.assign({ relaxed, sameK: !!L && c.k === L.k, sameN: !!L && c.n === L.n, sameT: !!L && (c.T === L.T || c.T === L.S) }, c); }
/* THE ENGINE'S PATH in one town.  [Source: math-skills.txt v4.1: assess, probe, classify from both wrong answers, check the step below, teach in single steps, a worked example, a mastery gate of three.]
   child(problem, phase, band) returns the number the child says, or null for "decide without me". Phases: assess, probe, small, small again, told, sung, gate.
   Returns { end: 'first' | 'slip' | 'gate' | 'rest' | 'none left', path, years, log }.
   - Two counting faults (or one, and one reply that tells nothing): Shells, ONLY until the child has passed it once in any town [fourth review, M6]; then the song.
   - Two reading faults (or one, and one that tells nothing): the next year the seller lays out the planks BEFORE he asks [story, 16d, row 5]. No Shells, and no song [note, section 2; fourth review, M7].
   - Two "decide without me": the singer finds the cadet in the white months, "Come and sing": the song [story, 16d, row 6]. One, and one wrong reply: the wrong reply decides.
   - A skip at Shells or at the gate counts as a miss. A skip uses up its problem: the child has seen it. */
function town(band, h, child, rnd, note, gates) { let years = 0; const log = [], ask = (b, phase) => { const c = pick(b, h, rnd); if (!c) { note.dry++; return null; } note.asked++; if (c.sameK) note.sameK++; if (c.sameN) note.sameN++; if (c.sameT) note.sameT++;
    const S0 = child(c, phase, b); let S = S0, reasked = false; if (S !== null && S < SHOWN * c.k) { note.reask++; reasked = true; child(c, 'told', b); S = child(c, phase, b); }      /* less than the stick shows: told on the planks (or at Gran's rack), asked again, the same year, once */
    if (reasked) say(S0 < SHOWN * c.k, `a re-ask for ${c.id} came after ${S0}, which is not under the stick`);
    const right = S === c.T; years++; h.used[c.id] = 1; h.avoidT = null; h.last = { k: c.k, n: c.n, T: c.T, S }; if (right && !reasked) h.rightN.push(c.n); log.push(`${phase}:${c.id}${reasked ? '[re-asked]' : ''}${right ? '' : '(' + S + ')'}`); return { c, S, right, reasked }; },
    out = (end, path, extra) => Object.assign({ end, path, years, log }, extra || {});
  const a = ask(band, 'assess'); if (!a) return out('none left'); if (a.right) return out(a.reasked ? 'slip' : 'first');      /* put right on the planks: self-corrected, a slip */
  const p = ask(band, 'probe'); if (!p) return out('none left'); if (p.right) return out('slip');
  const so = [a, p].map(m => classify(m.c.k, m.c.n, m.S)), said = so.filter(x => x !== 'skip');      /* the sort of the reply that ran [fifth review, B1] */
  const path = !said.length ? 'singer' : said.every(x => x === 'read' || x === 'both') && said.some(x => x === 'read') ? 'read' : 'count';
  if (path === 'count' && !h.promised) { const s1 = ask('small', 'small'); if (!s1) return out('none left', path); if (!s1.right) { log.push('the song by twos, fives and tens'); const s2 = ask('small', 'small again'); if (!s2) return out('none left', path); if (!s2.right) return out('rest', path); } h.promised = 1; }
  if (path === 'read') { child(p.c, 'told', band); log.push('next year, the planks laid out before he asks'); }
  else { /* the song, by the lamp in the white months: the child's own two missed rows made again, line by line. They spend no new problem and no year. */ for (const m of [a, p]) { child(m.c, 'sung', band); log.push('sung:' + m.c.id + ' again'); } h.last = { k: p.c.k, n: p.c.n, T: p.c.T, S: p.c.T }; h.avoidT = [a.c.T, p.c.T]; }
  let missed = p; for (let g = 0; g < gates; g++) { let run = 0; for (let i = 0; i < 3; i++) { const q = ask(band, 'gate'); if (!q) { note.short++; return out(run > 0 ? 'gate' : 'rest', path, { short: 1 }); }      /* every problem of the band is used: a gate with only right answers so far counts */
      if (!q.right || q.reasked) { missed = q; if (q.right) log.push('self-corrected: not one of the three'); break; } run++; }      /* the gate wants three answers given alone */
    if (run === 3) return out('gate', path); if (g < gates - 1) { if (path === 'read') { child(missed.c, 'told', band); log.push('the planks again, before he asks'); } else log.push('that line of the song again'); } }      /* a reading path is never sung to [fifth review, M1] */
  return out('rest', path); }
/* THREE TOWNS.  The first asks the low band. A town learned at the first try, or through the gate (three right in a row), sends the next town one band up.
   Learned by a slip: the next town asks the same band once more, as the engine re-asks a fragile skill. A rest, or no new problem left: the kind rests, and no other town asks. */
function trial(child, rnd, gates) { const h = { used: {}, last: null, rightN: [], promised: 0 }, note = { dry: 0, asked: 0, sameK: 0, sameN: 0, sameT: 0, short: 0, reask: 0 }, order = ['low', 'high', 'big'], towns = [], mem = {}; let b = 0;
  for (let t = 0; t < 3; t++) { const r = town(order[b], h, (c, ph, band) => child(c, ph, band, mem), rnd, note, gates || GATE_TRIES); towns.push(Object.assign({ band: order[b] }, r)); if (r.end === 'rest' || r.end === 'none left') break; if ((r.end === 'first' || r.end === 'gate') && b < 2) b++; } return { towns, note, h }; }
const rng = seed => { let s = (seed * 2654435761) >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

const bad = [], say = (ok, what) => { if (!ok) bad.push(what); };
/* 1. every problem */
console.log(`A year of ${GOLD} gold months. The stick shows count days 1 to ${SHOWN}. The raft comes on count day ${SHOWN + 2} to ${GOLD}.`);
for (const band of Object.keys(BANDS)) { const all = pool(band); say(all.length >= (band === 'small' ? 6 : 10), `${band}: only ${all.length} problems`);
  for (const c of all) { say(c.n >= SHOWN + 2 && c.n <= GOLD, `${c.id}: the raft's day`); say(c.T <= TOTAL_MAX, `${c.id}: over ${TOTAL_MAX}`); if (band !== 'big') say(c.k <= 10 && c.n <= 10, `${c.id}: outside 10 x 10`);
    say([1, 2, 3, 4].map(i => i * c.k).indexOf(c.T) < 0, `${c.id}: the answer is cut on the stick`); say(gap(SHOWN * c.k, c.T) === (c.n - SHOWN) * c.k && c.n > SHOWN, `${c.id}: the safe way (the last cut) leaves no lamp dark`);
    /* 2. what follows, for every number the box takes */ for (let S = 0; S <= BOX_MAX; S++) { const g = gap(S, c.T); say((g === 0) === (S === c.T), `${c.id}, said ${S}: a miss with no dark lamp, or a right answer with one`); say(g >= 0 && g <= c.T, `${c.id}, said ${S}: ${g} dark lamps`); if (S !== c.T) say(g >= 1, `${c.id}, said ${S}: a miss that does not show`); const m = 2 * c.T - S; if (m >= 0 && m <= BOX_MAX) say(g === gap(m, c.T), `${c.id}: ${S} and ${m} are as far out and cost differently`); } }
  console.log(`  ${band.padEnd(6)} steps ${String(BANDS[band]).padEnd(15)} ${String(all.length).padStart(2)} problems: ${all.map(c => c.id).join(' ')}`);
  const refused = []; for (const k of BANDS[band]) for (let n = SHOWN + 2; n <= GOLD; n++) { const T = k * n; if (T > TOTAL_MAX) continue; const w = wrongWays(k, n).find(w => w.v === T); if (w) refused.push(`${k}x${n} ("${w.name}" also gives ${T})`); }
  const both = []; for (const c of all) { const seen = {}; for (const w of wrongWays(c.k, c.n)) { if (seen[w.v] && seen[w.v] !== w.sort && w.v !== c.T) both.push(`${c.id}: ${w.v}`); seen[w.v] = seen[w.v] || w.sort; } }
  if (refused.length) console.log(`         refused: ${refused.join('; ')}`); if (both.length) console.log(`         replies that tell nothing (a reading and a counting fault at once): ${[...new Set(both)].join(', ')}`); }
say(Object.keys(BANDS).every(b => BANDS[b].indexOf(EXAMPLE.step) < 0), 'the finished example\'s step is in a band'); say(EXAMPLE.step * EXAMPLE.n === 180, 'the finished example comes to 180'); say(EXAMPLE.step * EXAMPLE.n !== 2 * SHOWN * EXAMPLE.step, 'the finished example is a double of the last cut');
/* the note's worked example */ say(pool('low').some(c => c.id === '6x7'), 'the note\'s example (6, 12, 18, 24; count day 7) is not a low problem'); say(gap(36, 42) === 6 && gap(48, 42) === 6 && gap(99, 42) === 42 && gap(108, 42) === 42 && gap(42, 42) === 0, 'the note\'s example: said 36, 48, 99, 42'); say(classify(6, 7, 18) === 'read' && classify(6, 7, 36) === 'count' && classify(6, 7, 66) === 'read', 'the note\'s named faults'); say(classify(3, 9, 15) === 'both' && classify(3, 9, 30) === 'both' && classify(3, 9, null) === 'skip', 'a reply that tells nothing is not called a counting fault'); say(classify(6, 7, 24) === 'read', 'the last cut ("have" read as "have now") is not a reading fault');
/* 3. made-up children. What each says. Each kind names the path it must take in the first town, and how its towns must end. */
const KINDS = {
  'always right':                    { say: c => c.T, ends: /^(first)$/ },
  'right 8 times in 10':             { say: (c, ph, b, r) => r() < .8 ? c.T : c.T + c.k },
  'right half the time':             { say: (c, ph, b, r) => r() < .5 ? c.T : c.T - c.k, dry: 30 },
  'one count day over, always':      { say: c => c.T + c.k, path: 'count', habit: 1 },
  'only the mats to come, always':   { say: c => c.k * (c.n - SHOWN), path: 'read', habit: 1 },
  'adds the last two cuts, always':  { say: c => 7 * c.k, habit: 1 },
  'doubles the last cut, always':    { say: c => 8 * c.k, habit: 1 },
  'adds the last three cuts, always':{ say: c => 9 * c.k, habit: 1 },
  'wrong until taught, then right':  { say: (c, ph, b, r, m) => { if (ph === 'sung') m[b] = 1; return m[b] || b === 'small' ? c.T : c.T - c.k; }, path: 'count', ends: /^(gate)$/ },
  'taught, needs every second try':  { say: (c, ph, b, r, m) => { if (ph === 'sung') m[b] = 1; if (b === 'small') return (m.sm = (m.sm || 0) + 1) % 2 ? c.T + 1 : c.T; if (ph === 'gate' && m[b] && !m['g' + b] && (m['q' + b] = (m['q' + b] || 0) + 1) === 3) { m['g' + b] = 1; return c.T - c.k; }      /* misses the LAST question of the first gate: the longest way */ return m[b] ? c.T : c.T - c.k; }, path: 'count', ends: /^(gate)$/ },
  'misreads until told again':       { say: (c, ph, b, r, m) => { if (ph === 'told') m.told = 1; return m.told ? c.T : c.k * (c.n - SHOWN); }, path: 'read', ends: /^(gate|first|slip)$/ },      /* told on the planks in the same year when the reply is under the stick, or the next year; then right at the first try */
  'cannot do Shells either':           { say: (c, ph) => ph === 'sung' ? c.T : c.T + 1, path: 'count', ends: /^(rest)$/ },
  'always decides without me':       { say: () => null, path: 'singer', ends: /^(rest)$/ },
  'misreads, then miscounts':        { say: (c, ph, b, r, m) => { if (ph === 'told') { m.t = c.id; return null; } return m.t === c.id ? c.T - 1 : c.k; }, path: 'count', ends: /^(rest)$/ },      /* under the stick, put on the planks, then one short: a counting fault [fifth review, B1] */
  'types 0 to see the planks':       { say: (c, ph, b, r, m) => { if (ph === 'told') { m.t = c.id; return null; } return m.t === c.id ? c.T : 0; }, ends: /^(slip)$/ },      /* never right at the first try, never through the gate */
  'reads "have" as "have now"':      { say: c => SHOWN * c.k, path: 'read', habit: 1, ends: /^(rest)$/ },
  'N more count days, always':       { say: c => c.k * (SHOWN + c.n), path: 'read', habit: 1, ends: /^(rest)$/ },
  'decides without me, then learns': { say: (c, ph, b, r, m) => { if (ph === 'sung') m[b] = 1; return m[b] ? c.T : ph === 'assess' || ph === 'probe' ? null : c.T - c.k; }, path: 'singer', ends: /^(gate)$/ } };
function play(name, gates) { const K = KINDS[name], ends = {}, yrs = [], firsts = {}; let dry = 0, asked = 0, sameK = 0, sameN = 0, sameT = 0, short = 0, reask = 0, most = 0;
  for (let seed = 1; seed <= 3000; seed++) { const rnd = rng(seed), r2 = rng(seed + 99991), res = trial((c, ph, b, mem) => K.say(c, ph, b, r2, mem), rnd, gates); let y = 0; const ids = [];
    for (const t of res.towns) { ends[t.end] = (ends[t.end] || 0) + 1; y += t.years; most = Math.max(most, t.years); t.log.forEach(l => { if (/^sung:/.test(l)) return;      /* the two missed rows sung again are meant to come twice */ const m = /:(\d+x\d+)/.exec(l); if (m) ids.push(m[1]); }); }
    const f = (/:(\d+x\d+)/.exec(res.towns[0].log[0]) || [])[1]; firsts[f] = (firsts[f] || 0) + 1;
    yrs.push(y); dry += res.note.dry; asked += res.note.asked; sameK += res.note.sameK; sameN += res.note.sameN; sameT += res.note.sameT; short += res.note.short; reask += res.note.reask;
    if (gates !== GATE_TRIES) continue;
    say(new Set(ids).size === ids.length, `${name}, child ${seed}: a problem came twice`);
    if (K.habit) say(res.towns.filter(t => /^(first|slip|gate)$/.test(t.end)).length <= 1, `${name}, child ${seed}: a fixed habit lit ${res.towns.filter(t => /^(first|slip|gate)$/.test(t.end)).length} towns`);
    if (K.path) for (const t of res.towns) if (t.path) say(t.path === K.path, `${name}, child ${seed}: a town took the ${t.path} path, not the ${K.path} path`);      /* every town, not only the first */
    for (const t of res.towns) if (t.path === 'read') say(!t.log.some(l => /^small/.test(l) || /^sung:/.test(l) || /song/.test(l)), `${name}, child ${seed}: a reading path met Shells or the song: ${t.log.join(' | ')}`);
    for (const t of res.towns) say(!(t.end === 'first' && /\[re-asked\]/.test(t.log[0] || '')), `${name}, child ${seed}: put right on the planks, and counted right at the first try`);
    { const fc = /:(\d+)x(\d+)/.exec(res.towns[0].log[0] || ''); if (fc) say(firstOK('low', { id: fc[1] + 'x' + fc[2], n: +fc[2], T: fc[1] * fc[2] }), `${name}, child ${seed}: the first problem ${fc[1]}x${fc[2]} is on count day 9 or shares its answer`); }
    if (K.ends) say(res.towns.every(t => K.ends.test(t.end)), `${name}, child ${seed}: a town ended ${res.towns.map(t => t.end).join(', ')}`);
    say(res.towns.filter(t => /small/.test(t.log.join(' '))).length <= 1, `${name}, child ${seed}: Shells came in more than one town`);
    const last = res.towns[res.towns.length - 1]; say(res.towns.length === 3 || /^(rest|none left)$/.test(last.end), `${name}, child ${seed}: the trial stopped without an end`); }
  yrs.sort((a, b) => a - b); const nf = Object.keys(firsts).length, topF = Math.max(...Object.values(firsts));
  return { name, lo: yrs[0], hi: yrs[yrs.length - 1], mid: yrs[1500], most, ends, dry, asked, sameK, sameN, sameT, short, reask, nf, topF }; }
console.log(`\n3,000 made-up children of each kind, through three towns (gate: ${GATE_TRIES} tries):`);
const rows = Object.keys(KINDS).map(name => play(name, GATE_TRIES));
for (const r of rows) { const K = KINDS[r.name]; say(r.dry <= (K.dry || 0), `${r.name}: a band was used up for ${r.dry} of 3000 children`); say(r.most <= 10, `${r.name}: ${r.most} years in one town`);
  console.log(`  ${r.name.padEnd(33)} years ${r.lo === r.hi ? r.lo : r.lo + ' to ' + r.hi} (middle ${r.mid}); most in one town ${r.most}; towns ended: ${Object.keys(r.ends).map(e => e + ' ' + r.ends[e]).join(', ')}${r.dry ? `; a band used up for ${r.dry}` : ''}${r.short ? `; a short gate passed ${r.short} times` : ''}${r.reask ? `; re-asked on the planks ${r.reask} times` : ''}`); }
const all = rows.reduce((a, r) => ({ asked: a.asked + r.asked, sameK: a.sameK + r.sameK, sameN: a.sameN + r.sameN, sameT: a.sameT + r.sameT }), { asked: 0, sameK: 0, sameN: 0, sameT: 0 });
console.log(`\nTwo problems running, of ${all.asked} asked: the same step ${all.sameK} times, the same count day ${all.sameN}, the same answer (or the last answer said) ${all.sameT}.`);
const ar = rows.find(r => r.name === 'always right'); console.log(`First problems: ${ar.nf} different ones among 3,000 "always right" children; the commonest is given to ${ar.topF}.`);
say(ar.nf >= 5 && ar.topF <= 750, `the first problem is nearly fixed: ${ar.nf} different, the commonest ${ar.topF} of 3000`);
const g3 = Object.keys(KINDS).map(name => play(name, GATE_TRIES === 2 ? 3 : 2)), g3dry = g3.filter(r => r.dry).map(r => `${r.name} ${r.dry}`), g3m = Math.max(...g3.map(r => r.most)), g3h = g3.find(r => r.name === 'right half the time');
console.log(`With ${GATE_TRIES === 2 ? 'the engine\'s three gate tries in place of two' : 'two gate tries'}: a band used up for ${g3dry.length ? g3dry.join(', ') : 'nobody'}; most years in one town ${g3m}; "right half the time" ${g3h.lo} to ${g3h.hi} years.`);
console.log(bad.length ? '\nFAILED:\n  ' + [...new Set(bad)].slice(0, 30).join('\n  ') : '\nok: every problem holds; every miss shows as dark lamps and too few costs what too many costs; through three towns no child met a problem twice; a fixed habit lights one town at most; each kind takes its path in every town and finishes; a reading path never meets the song; the planks never count as a first try; Shells comes once; the first problem is not fixed and shares no answer; the safe way always leaves lamps dark');
process.exit(bad.length ? 1 : 0);
