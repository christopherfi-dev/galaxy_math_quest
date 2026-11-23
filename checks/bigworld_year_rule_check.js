// Algora's deciding years: the first kind of decision, "HOW MUCH?".  The number rule, the picker, and the engine's path.   [DRAFT 6: nothing here is in the page yet. Draft 6 answers the fourth joint review, 23 November.]
// Story: proposals/GMQ_Algora_Story_v1_2026-11-23.md.  Maths: proposals/GMQ_Big_World_Maths_Fit_v1_2026-11-23.md (version 5).
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
//
// What this file does:
//   1. lists every problem in each band and checks it
//   2. checks what follows, for every number a child could type
//   3. plays the engine's path for 3,000 made-up children of each of fourteen kinds, through three towns. It checks:
//      no child meets a problem twice; a child with one fixed habit lights at most one town (at the first try, by a slip, or through the gate);
//      each kind of child takes the path it should (counting faults to Promise and the song, reading faults to the second telling, "decide without me"
//      to the singer); every child finishes (learned, or a rest). It PRINTS what it cannot promise: how often two problems running share a step,
//      a count day or an answer (the picker avoids it, and gives up one wish at a time when it must), how often a band runs out, how many
//      different first problems the children get, and what the engine's three gate tries would give in place of two.
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
/* a reply's sort. A reply that is a reading fault AND a counting fault (on count day 9: 5k is "only the mats to come" and "the next cut"; 10k is "all the cuts
   added" and "one count day over") is 'both': it tells nothing, and the other reply decides [fourth review, M2]. No reply ("decide without me") is 'skip'. */
const classify = (k, n, S) => { if (S === null) return 'skip'; const w = wrongWays(k, n).filter(w => w.v === S), sorts = [...new Set(w.map(x => x.sort))]; return !sorts.length ? 'other' : sorts.length > 1 ? 'both' : sorts[0]; };
const GATE_TRIES = +(process.env.GATES || 2);      /* the two threads chose two, not the engine's three. Section 3 prints what three would give [fourth review, M5] */
/* Three ways that are RIGHT, and are not refused: add the last two cuts (count day 7), double the last cut (8), add the last three (9). A child who knows all three knows the row.
   A child with only one of them lights one town at most: see rightN below, and the check in section 3. */
function pool(band) { const out = []; for (const k of BANDS[band]) for (let n = SHOWN + 2; n <= GOLD; n++) { const T = k * n; if (T > TOTAL_MAX) continue; if (wrongWays(k, n).some(w => w.v === T)) continue; out.push({ k, n, T, id: k + 'x' + n }); } return out; }
/* THE PICKER.  h is the child's history: used (ids), last ({k,n,T,S}: the last row the child met, or sang), rightN (count days the child has been right on).
   It never gives a problem the child has had. It WISHES, in this order, and gives up one wish at a time only when no problem left meets them all:
     0. the child's very first problem is not on the finished example's count day (9)
     1. a count day the child has not yet been right on (so one habit is right once and no more)
     2. a new step, a new count day and a new answer, and not the answer the child last said
     3. a new step and a new answer      4. a new answer      5. any problem not yet used
   Among the problems that meet its wishes it picks BY CHANCE, so the children in one class do not all hear the same stick [fourth review, M1].
   Only when the band runs tight (6 or fewer left) does it prefer the problem that leaves most others usable, so the band does not run out. */
function pick(band, h, rnd) { const P = pool(band).filter(c => !h.used[c.id]), L = h.last, fresh = c => !L || (c.k !== L.k && c.n !== L.n && c.T !== L.T && c.T !== L.S);
  const wish = [c => (L || c.n !== EXAMPLE.n) && h.rightN.indexOf(c.n) < 0 && fresh(c), c => h.rightN.indexOf(c.n) < 0 && fresh(c), fresh, c => !L || (c.k !== L.k && c.T !== L.T && c.T !== L.S), c => !L || (c.T !== L.T && c.T !== L.S), () => true];
  let ok = [], relaxed = 0; for (; relaxed < wish.length; relaxed++) { ok = P.filter(wish[relaxed]); if (ok.length) break; } if (!ok.length) return null;
  if (P.length <= 6) { const room = c => P.filter(d => d.id !== c.id && d.k !== c.k && d.n !== c.n && d.T !== c.T).length, best = Math.max(...ok.map(room)); ok = ok.filter(c => room(c) === best); }
  const c = ok[Math.floor(rnd() * ok.length)]; return Object.assign({ relaxed, sameK: !!L && c.k === L.k, sameN: !!L && c.n === L.n, sameT: !!L && (c.T === L.T || c.T === L.S) }, c); }
/* THE ENGINE'S PATH in one town.  [Source: math-skills.txt v4.1: assess, probe, classify from both wrong answers, check the step below, teach in single steps, a worked example, a mastery gate of three.]
   child(problem, phase, band) returns the number the child says, or null for "decide without me". Phases: assess, probe, small, small again, told, sung, gate.
   Returns { end: 'first' | 'slip' | 'gate' | 'rest' | 'none left', path, years, log }.
   - Two counting faults (or one, and one reply that tells nothing): Promise, ONLY until the child has passed it once in any town [fourth review, M6]; then the song.
   - Two reading faults (or one, and one that tells nothing): the seller tells it again on the jetty. No Promise, and no song [note, section 2; fourth review, M7].
   - Two "decide without me": the singer finds the cadet in the white months, "Come and sing": the song [story, 16d, row 6]. One, and one wrong reply: the wrong reply decides.
   - A skip at Promise or at the gate counts as a miss. A skip uses up its problem: the child has seen it. */
function town(band, h, child, rnd, note, gates) { let years = 0; const log = [], ask = (b, phase) => { const c = pick(b, h, rnd); if (!c) { note.dry++; return null; } note.asked++; if (c.sameK) note.sameK++; if (c.sameN) note.sameN++; if (c.sameT) note.sameT++;
    const S = child(c, phase, b), right = S === c.T; years++; h.used[c.id] = 1; h.last = { k: c.k, n: c.n, T: c.T, S }; if (right) h.rightN.push(c.n); log.push(`${phase}:${c.id}${right ? '' : '(' + S + ')'}`); return { c, S, right }; },
    out = (end, path, extra) => Object.assign({ end, path, years, log }, extra || {});
  const a = ask(band, 'assess'); if (!a) return out('none left'); if (a.right) return out('first');
  const p = ask(band, 'probe'); if (!p) return out('none left'); if (p.right) return out('slip');
  const so = [classify(a.c.k, a.c.n, a.S), classify(p.c.k, p.c.n, p.S)], said = so.filter(x => x !== 'skip');
  const path = !said.length ? 'singer' : said.every(x => x === 'read' || x === 'both') && said.some(x => x === 'read') ? 'read' : 'count';
  if (path === 'count' && !h.promised) { const s1 = ask('small', 'small'); if (!s1) return out('none left', path); if (!s1.right) { log.push('the song by twos, fives and tens'); const s2 = ask('small', 'small again'); if (!s2) return out('none left', path); if (!s2.right) return out('rest', path); } h.promised = 1; }
  if (path === 'read') { child(p.c, 'told', band); log.push('told again on the jetty, one plank for each count day'); }
  else { /* the song, by the lamp in the white months: the child's own two missed rows made again, line by line. They spend no new problem and no year. */ for (const m of [a, p]) { child(m.c, 'sung', band); log.push('sung:' + m.c.id + ' again'); } h.last = { k: p.c.k, n: p.c.n, T: p.c.T, S: p.c.T }; }
  for (let g = 0; g < gates; g++) { let run = 0; for (let i = 0; i < 3; i++) { const q = ask(band, 'gate'); if (!q) { note.short++; return out(run > 0 ? 'gate' : 'rest', path, { short: 1 }); }      /* every problem of the band is used: a gate with only right answers so far counts */ if (!q.right) break; run++; } if (run === 3) return out('gate', path); if (g < gates - 1) log.push('that line of the song again'); }
  return out('rest', path); }
/* THREE TOWNS.  The first asks the low band. A town learned at the first try, or through the gate (three right in a row), sends the next town one band up.
   Learned by a slip: the next town asks the same band once more, as the engine re-asks a fragile skill. A rest, or no new problem left: the kind rests, and no other town asks. */
function trial(child, rnd, gates) { const h = { used: {}, last: null, rightN: [], promised: 0 }, note = { dry: 0, asked: 0, sameK: 0, sameN: 0, sameT: 0, short: 0 }, order = ['low', 'high', 'big'], towns = [], mem = {}; let b = 0;
  for (let t = 0; t < 3; t++) { const r = town(order[b], h, (c, ph, band) => child(c, ph, band, mem), rnd, note, gates || GATE_TRIES); towns.push(Object.assign({ band: order[b] }, r)); if (r.end === 'rest' || r.end === 'none left') break; if ((r.end === 'first' || r.end === 'gate') && b < 2) b++; } return { towns, note, h }; }
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
/* the note's worked example */ say(pool('low').some(c => c.id === '6x7'), 'the note\'s example (6, 12, 18, 24; count day 7) is not a low problem'); say(gap(36, 42) === 6 && gap(48, 42) === 6 && gap(99, 42) === 42 && gap(108, 42) === 42 && gap(42, 42) === 0, 'the note\'s example: said 36, 48, 99, 42'); say(classify(6, 7, 18) === 'read' && classify(6, 7, 36) === 'count' && classify(6, 7, 66) === 'read', 'the note\'s named faults'); say(classify(3, 9, 15) === 'both' && classify(3, 9, 30) === 'both' && classify(3, 9, null) === 'skip', 'a reply that tells nothing is not called a counting fault');
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
  'misreads until told again':       { say: (c, ph, b, r, m) => { if (ph === 'told') m.told = 1; return m.told ? c.T : c.k * (c.n - SHOWN); }, path: 'read', ends: /^(gate|first)$/ },      /* once told, every later town is right at the first try */
  'cannot do Promise either':        { say: (c, ph) => ph === 'sung' ? c.T : c.T + 1, path: 'count', ends: /^(rest)$/ },
  'always decides without me':       { say: () => null, path: 'singer', ends: /^(rest)$/ },
  'decides without me, then learns': { say: (c, ph, b, r, m) => { if (ph === 'sung') m[b] = 1; return m[b] ? c.T : ph === 'assess' || ph === 'probe' ? null : c.T - c.k; }, path: 'singer', ends: /^(gate)$/ } };
function play(name, gates) { const K = KINDS[name], ends = {}, yrs = [], firsts = {}; let dry = 0, asked = 0, sameK = 0, sameN = 0, sameT = 0, short = 0, most = 0;
  for (let seed = 1; seed <= 3000; seed++) { const rnd = rng(seed), r2 = rng(seed + 99991), res = trial((c, ph, b, mem) => K.say(c, ph, b, r2, mem), rnd, gates); let y = 0; const ids = [];
    for (const t of res.towns) { ends[t.end] = (ends[t.end] || 0) + 1; y += t.years; most = Math.max(most, t.years); t.log.forEach(l => { if (/^sung:/.test(l)) return;      /* the two missed rows sung again are meant to come twice */ const m = /:(\d+x\d+)/.exec(l); if (m) ids.push(m[1]); }); }
    const f = (/:(\d+x\d+)/.exec(res.towns[0].log[0]) || [])[1]; firsts[f] = (firsts[f] || 0) + 1;
    yrs.push(y); dry += res.note.dry; asked += res.note.asked; sameK += res.note.sameK; sameN += res.note.sameN; sameT += res.note.sameT; short += res.note.short;
    if (gates !== GATE_TRIES) continue;
    say(new Set(ids).size === ids.length, `${name}, child ${seed}: a problem came twice`);
    if (K.habit) say(res.towns.filter(t => /^(first|slip|gate)$/.test(t.end)).length <= 1, `${name}, child ${seed}: a fixed habit lit ${res.towns.filter(t => /^(first|slip|gate)$/.test(t.end)).length} towns`);
    if (K.path) say(res.towns[0].path === K.path, `${name}, child ${seed}: the first town took the ${res.towns[0].path} path, not the ${K.path} path`);
    if (K.path === 'read') say(res.towns.every(t => !t.log.some(l => /^small/.test(l) || /^sung:/.test(l))), `${name}, child ${seed}: a reading fault was sent to Promise or the song`);
    if (K.ends) say(res.towns.every(t => K.ends.test(t.end)), `${name}, child ${seed}: a town ended ${res.towns.map(t => t.end).join(', ')}`);
    say(res.towns.filter(t => /small/.test(t.log.join(' '))).length <= 1, `${name}, child ${seed}: Promise came in more than one town`);
    const last = res.towns[res.towns.length - 1]; say(res.towns.length === 3 || /^(rest|none left)$/.test(last.end), `${name}, child ${seed}: the trial stopped without an end`); }
  yrs.sort((a, b) => a - b); const nf = Object.keys(firsts).length, topF = Math.max(...Object.values(firsts));
  return { name, lo: yrs[0], hi: yrs[yrs.length - 1], mid: yrs[1500], most, ends, dry, asked, sameK, sameN, sameT, short, nf, topF }; }
console.log(`\n3,000 made-up children of each kind, through three towns (gate: ${GATE_TRIES} tries):`);
const rows = Object.keys(KINDS).map(name => play(name, GATE_TRIES));
for (const r of rows) { const K = KINDS[r.name]; say(r.dry <= (K.dry || 0), `${r.name}: a band was used up for ${r.dry} of 3000 children`); say(r.most <= 10, `${r.name}: ${r.most} years in one town`);
  console.log(`  ${r.name.padEnd(33)} years ${r.lo === r.hi ? r.lo : r.lo + ' to ' + r.hi} (middle ${r.mid}); most in one town ${r.most}; towns ended: ${Object.keys(r.ends).map(e => e + ' ' + r.ends[e]).join(', ')}${r.dry ? `; a band used up for ${r.dry}` : ''}${r.short ? `; a short gate passed ${r.short} times` : ''}`); }
const all = rows.reduce((a, r) => ({ asked: a.asked + r.asked, sameK: a.sameK + r.sameK, sameN: a.sameN + r.sameN, sameT: a.sameT + r.sameT }), { asked: 0, sameK: 0, sameN: 0, sameT: 0 });
console.log(`\nTwo problems running, of ${all.asked} asked: the same step ${all.sameK} times, the same count day ${all.sameN}, the same answer (or the last answer said) ${all.sameT}.`);
const ar = rows.find(r => r.name === 'always right'); console.log(`First problems: ${ar.nf} different ones among 3,000 "always right" children; the commonest is given to ${ar.topF}.`);
say(ar.nf >= 6 && ar.topF <= 750, `the first problem is nearly fixed: ${ar.nf} different, the commonest ${ar.topF} of 3000`);
const g3 = Object.keys(KINDS).map(name => play(name, GATE_TRIES === 2 ? 3 : 2)), g3dry = g3.filter(r => r.dry).map(r => `${r.name} ${r.dry}`), g3m = Math.max(...g3.map(r => r.most)), g3h = g3.find(r => r.name === 'right half the time');
console.log(`With ${GATE_TRIES === 2 ? 'the engine\'s three gate tries in place of two' : 'two gate tries'}: a band used up for ${g3dry.length ? g3dry.join(', ') : 'nobody'}; most years in one town ${g3m}; "right half the time" ${g3h.lo} to ${g3h.hi} years.`);
console.log(bad.length ? '\nFAILED:\n  ' + [...new Set(bad)].slice(0, 30).join('\n  ') : '\nok: every problem holds; every miss shows as dark windows and too few costs what too many costs; through three towns no child met a problem twice; a fixed habit lights one town at most; each kind takes its path and finishes; Promise comes once; the first problem is not fixed');
process.exit(bad.length ? 1 : 0);
