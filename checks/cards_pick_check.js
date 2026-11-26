// Which card does a child get? The cards thread's number check, on thousands of made-up children.   (26 November 2026)
// It reads GMQCards from between its marked lines in docs/cards/index.html (or a file given), and the card list from the same page, and runs the rule itself.
//   1. pick: always a card of the kind asked for; the same seed and the same book give the same card; a lost card can come again.
//   2. The doubles rule, A, B and C side by side: how many cards of a kind it takes to fill that kind; doubles; the longest run of doubles while cards are left.
//   3. Books differ: after the station's 15 cards, how many children share a book.
//   4. The starter pack (Marc, 23 November: 15 cards on the KIS Station, always with 1 Spy, 1 Policeman, 1 epic and 1 rare), the stand-in rule:
//      every child, with secrets found between tasks, ends the station holding all four; the 15 task cards hold at most 1 Spy and 1 Guard; when the sure cards come.
//      Also as one pack (starterPack), and for children part-way through the station when the new cards arrive (old saves).
//   5. Old saves: keep, swap and map. Kinds kept; swapping twice changes nothing; map gives Laser Cannon its card.
//   6. A made-up list of 140 cards, in one flat list as cards.json may be: everything above still holds.
// Run: node checks/cards_pick_check.js [children, default 20000] [page]
const fs = require('fs'), path = require('path'), vm = require('vm');
const N = +(process.argv[2] || 20000), PAGE = process.argv[3] || path.join(__dirname, '..', 'docs', 'cards', 'index.html');
const html = fs.readFileSync(PAGE, 'utf8');
const block = (html.match(/\/\* ===== GMQ CARDS: start =====[\s\S]*?\/\* ===== GMQ CARDS: end ===== \*\//) || [''])[0];
const listJs = (html.match(/<script id="gmqc-list">([\s\S]*?)<\/script>/) || [0, ''])[1];
let bad = 0; const ok = (c, what) => { if (!c) { bad++; console.log('FAIL ' + what); } return c; };
function load() { const ctx = { window: {}, Math, JSON, String, Number, Array, Object, console }; vm.createContext(ctx); vm.runInContext(block + '\nthis.G = GMQCards;', ctx); vm.runInContext(listJs, ctx); return { G: ctx.G, list: ctx.window.GMQC_LIST }; }
const { G, list } = load(); ok(block && list, 'the page has the piece and the list');
const L0 = G.use(list);
// a seeded stream of numbers for the made-up children (the game's own generator: rnd() in the game file)
function stream(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s; }; }
const pct = (a, b) => (100 * a / b).toFixed(b >= 10000 ? 2 : 1) + '%', mean = a => a.reduce((x, y) => x + y, 0) / a.length, q = (a, p) => { const b = a.slice().sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; };
const info = id => G.get(id);
function report(title) { console.log('\n== ' + title); }

function allChecks(label, flat) {
  const pools = { common: G.pool('common'), rare: G.pool('rare'), epic: G.pool('epic') }, sizes = Object.keys(pools).map(k => k + ' ' + pools[k].length).join(', ');
  report(label + ': ' + sizes);
  ok(pools.common.length && pools.rare.length && pools.epic.length, label + ': every kind has cards');
  // 1. pick
  let wrong = 0, nulls = 0, same = 0;
  for (let i = 1; i <= N; i++) { const r = stream(i), k = ['common', 'rare', 'epic', 'gold'][i % 4], own = [], n = r() % 30;
    for (let j = 0; j < n; j++) own.push(G.record(G.pick(r(), G.rarity(r() / 4294967296), own), ''));
    const s = r(), a = G.pick(s, k, own), b = G.pick(s, k, own); if (!a) nulls++; else if (info(a).rarity !== G.kindOf(k)) wrong++; if (a === b) same++; }
  ok(!wrong && !nulls, `${label}: pick gives a card of the kind asked for, every time (${N} children; wrong ${wrong}, none ${nulls})`);
  ok(same === N, `${label}: the same seed and the same book give the same card`);
  { const all = pools.epic.map(id => G.record(id, '')), lost = all.splice(0, 1)[0]; const back = G.pick(123, 'epic', all, { rule: 'A' }); ok(back === lost.id, `${label}: a card lost in a challenge battle can come again as a new card (${back})`); }
  // 2. the doubles rule
  console.log('  How many cards of one kind a child needs to fill that kind (made-up children, each kind on its own):');
  console.log('  rule | kind   | cards to fill: mean, 95 in 100, most | doubles before full: mean, most | longest run of doubles while cards are left');
  const fills = {};
  for (const rule of ['A', 'B', 'C']) for (const k of ['common', 'rare', 'epic']) {
    const draws = [], dups = [], runs = []; let maxRun = 0, run3 = 0;
    for (let i = 1; i <= N; i++) { const r = stream(i * 7 + k.length), own = [], have = {}; let d = 0, dup = 0, run = 0, best = 0;
      while (Object.keys(have).length < pools[k].length && d < 5000) { const id = G.pick(r(), k, own, { rule }); d++; if (have[id]) { dup++; run++; best = Math.max(best, run); } else { run = 0; have[id] = 1; } own.push(id); }
      draws.push(d); dups.push(dup); runs.push(best); maxRun = Math.max(maxRun, best); if (best >= 3) run3++; }
    fills[rule + k] = draws;
    console.log(`  ${rule}    | ${k.padEnd(6)} | ${mean(draws).toFixed(1).padStart(5)}, ${String(q(draws, .95)).padStart(4)}, ${String(Math.max(...draws)).padStart(4)}            | ${mean(dups).toFixed(1).padStart(5)}, ${String(Math.max(...dups)).padStart(4)}         | ${maxRun} (3 or more in a row: ${pct(run3, N)} of children)`);
    if (rule === 'A') ok(Math.max(...draws) === pools[k].length, `${label}: rule A fills ${k} in exactly ${pools[k].length} cards`);
    if (rule === 'B') ok(maxRun <= 8, `${label}: rule B: nobody gets stuck on doubles (${k}: the longest run while cards are left is ${maxRun})`);
  }
  // a whole game: the station's 15, then cards by the game's odds, with 6 epic cards from projects
  console.log('  A whole game, by rule: what a child holds after 30, 60, 100 and 150 cards (station first; 6 epic cards from projects among them):');
  console.log('  rule | after | common found | rare found | epic found | doubles so far');
  for (const rule of ['A', 'B', 'C']) { G.rule.doubles = rule; const at = { 30: [], 60: [], 100: [], 150: [] };
    for (let i = 1; i <= Math.min(N, 5000); i++) { const r = stream(i * 13), own = []; const forced = new Set(); while (forced.size < 6) forced.add(20 + r() % 120); let dup = 0;
      for (let c = 0; c < 150; c++) { const id = c < 15 ? G.starterNext(r(), own, 15 - c) : G.pick(r(), forced.has(c) ? 'epic' : G.rarity(r() / 4294967296), own); if (own.some(o => o.id === id)) dup++; own.push(G.record(id, ''));
        if (at[c + 1]) { const h = {}; own.forEach(o => h[o.id] = 1); at[c + 1].push([pools.common.filter(x => h[x]).length, pools.rare.filter(x => h[x]).length, pools.epic.filter(x => h[x]).length, dup]); } } }
    for (const t of [30, 60, 100, 150]) { const a = at[t]; console.log(`  ${rule}    | ${String(t).padStart(5)} | ${mean(a.map(x => x[0])).toFixed(1).padStart(5)} of ${pools.common.length}  | ${mean(a.map(x => x[1])).toFixed(1).padStart(4)} of ${pools.rare.length} | ${mean(a.map(x => x[2])).toFixed(1).padStart(4)} of ${pools.epic.length} | ${mean(a.map(x => x[3])).toFixed(1)}`); } }
  G.rule.doubles = 'B';
  // 3. books differ
  { const books = new Map(); for (let i = 1; i <= N; i++) { const r = stream(i * 31), own = []; for (let c = 0; c < 15; c++) own.push(G.record(G.starterNext(r(), own, 15 - c), '')); const key = own.map(o => o.id).sort().join(','); books.set(key, (books.get(key) || 0) + 1); }
    let shared = 0; books.forEach(v => { if (v > 1) shared += v; });
    console.log(`  Books after the station's 15 cards: ${books.size} different books among ${N} children; ${shared} children share their book with someone (${pct(shared, N)}).`);
    ok(books.size > N * 0.95, `${label}: two children's books differ (at least 95 in 100 different)`); }
  // 4. the starter pack
  const S = G.starter(); console.log(`  The starter rule (${S.source}): ${S.sure.map(s => s.say).join(', ')}; the rest ${S.rest === 'odds' ? 'by the game\'s odds' : 'common'}, never ${S.restNot.join(' or ')}.`);
  const isT = (id, t) => { const e = info(id); return e && (e.type === t || e.look === t); };
  let miss = 0, spy2 = 0, guard2 = 0, last4 = 0, rares = [], epics = [], posEpic = new Array(15).fill(0), packMiss = 0, packSpy = 0;
  for (let i = 1; i <= N; i++) { const r = stream(i * 101), own = [], task = []; const secrets = r() % 7;
    const at = new Set(); while (at.size < secrets) at.add(r() % 15);
    for (let t = 0; t < 15; t++) { if (at.has(t)) own.push(G.record(G.pick(r(), G.rarity(r() / 4294967296), own), 'a secret'));
      const id = G.starterNext(r(), own, 15 - t); own.push(G.record(id, 'task')); task.push(id); }
    if (G.starterNeeds(own).length) miss++;
    if (task.filter(id => isT(id, 'spy')).length > 1) spy2++; if (task.filter(id => isT(id, 'guard')).length > 1) guard2++;
    rares.push(task.filter(id => info(id).rarity === 'rare').length); epics.push(task.filter(id => info(id).rarity === 'epic').length);
    const fe = task.findIndex(id => info(id).rarity === 'epic' && !isT(id, 'spy')); if (fe >= 0) posEpic[fe]++;
    if (task.slice(11).every(id => { const e = info(id); return isT(id, 'spy') || isT(id, 'guard') || e.rarity !== 'common'; })) last4++;
    const pack = G.starterPack(r(), []); if (G.starterNeeds(pack).length) packMiss++; if (pack.filter(id => isT(id, 'spy')).length !== 1) packSpy++; }
  ok(!miss, `${label}: every child (${N}, with 0 to 6 secrets found between tasks) ends the station holding a Spy, a Guard, a rare and an epic card (missing: ${miss})`);
  ok(!spy2 && !guard2, `${label}: the 15 task cards never hold two Spies or two Guards (${spy2}, ${guard2})`);
  ok(!packMiss && !packSpy, `${label}: as one pack of 15: always the four sure cards, and exactly one Spy (${packMiss}, ${packSpy})`);
  console.log(`  Rare cards among the 15 task cards: mean ${mean(rares).toFixed(2)}, fewest ${Math.min(...rares)}, most ${Math.max(...rares)}. Epic: mean ${mean(epics).toFixed(2)}, fewest ${Math.min(...epics)}, most ${Math.max(...epics)}.`);
  console.log(`  The first epic card comes at task: ${posEpic.map((n, i) => (i + 1) + ': ' + pct(n, N)).join(', ')}`);
  console.log(`  Children whose last 4 task cards are all sure cards or better (the sure cards piled up at the end): ${pct(last4, N)}`);
  // part-way through the station when the new cards arrive (an old save): k tasks done, k old cards by the old odds
  console.log('  Old saves part-way through the station: share of children who still end it holding all four sure cards');
  console.log('  tasks done | keep    | swap    | map');
  for (const k of [0, 5, 10, 12, 13, 14]) { const row = [];
    for (const way of ['keep', 'swap', 'map']) { let full = 0; for (let i = 1; i <= Math.min(N, 5000); i++) { const r = stream(i * 977 + k), old = [];
        for (let j = 0; j < k; j++) { const x = r() % 100; const nm = x < 70 ? ['Laser Cannon', 'Stealth Mode', 'Asteroid Assault'][r() % 3] : x < 95 ? ['Quantum Quell', 'Void Vortex'][r() % 2] : 'Nebula Nova'; old.push({ r: x < 70 ? 'common' : x < 95 ? 'rare' : 'gold', n: nm }); }      /* the game's own six names and odds (DECK, ODDS) */
        const own = G.migrate(old, way, r()).cards; for (let t = k; t < 15; t++) own.push(G.record(G.starterNext(r(), own, 15 - t), 'task')); if (!G.starterNeeds(own).length) full++; }
      row.push(pct(full, Math.min(N, 5000)).padStart(7)); }
    console.log(`  ${String(k).padStart(10)} | ${row.join(' | ')}`); }
  // 5. old saves
  { const old = [{ r: 'common', n: 'Laser Cannon' }, { r: 'common', n: 'Stealth Mode' }, { r: 'rare', n: 'Quantum Quell' }, { r: 'common', n: 'Asteroid Assault' }, { r: 'gold', n: 'Nebula Nova' }, { r: 'rare', n: 'Void Vortex' }];
    let kindsKept = 0, distinct = 0, twice = 0;
    for (let i = 1; i <= N; i++) { const m = G.migrate(old, 'swap', i); if (m.cards.every((c, j) => G.kindOf(info(c.id).rarity) === G.kindOf(old[j].r))) kindsKept++; if (new Set(m.cards.map(c => c.id)).size === 6) distinct++; if (!G.migrate(m.cards, 'swap', i + 1).changed.length) twice++; }
    ok(kindsKept === N, `${label}: swap: each old card becomes a new card of the same kind (${N} children)`);
    ok(distinct === N, `${label}: swap: six old cards become six different cards (no double made by the swap)`);
    ok(twice === N, `${label}: swap: opening the game again changes nothing (the swap happens once)`);
    const kp = G.migrate(old, 'keep', 1); ok(!kp.changed.length && kp.cards.every((c, j) => c === old[j]), `${label}: keep: the old cards stay as they are`);
    if (!flat) { const mp = G.migrate(old, 'map', 1).cards; ok(mp[0].id === 'A01' && mp[4].id === 'R14', `${label}: map: Laser Cannon becomes ${mp[0].n}, Nebula Nova becomes ${mp[4].n} (the cards that grew from them); the other four are swapped`); } }
}

allChecks('The card list on the page (' + L0 + ' battle cards)');
// 6. a made-up list of 140 cards, in one flat list
{ const types = ['attack', 'defence', 'repair', 'spy', 'guard'], flat = []; let n = 0;
  for (const [k, c] of [['common', 66], ['rare', 46], ['epic', 18]]) for (let i = 0; i < c; i++) { n++; const t = i < 3 ? 'guard' : types[i % 5]; flat.push({ id: 'T' + String(n).padStart(3, '0'), name: 'Test card ' + n, kind: 'battle card', rarity: k, type: t, text: 'Words for card ' + n + '.', badge: '+' + (n % 20) }); }
  for (let i = 0; i < 5; i++) flat.push({ id: 'TU' + i, name: 'Test upgrade ' + i, kind: 'upgrade', type: 'upgrade', part: 'Engine Core', text: 'Level 2.' });
  for (let i = 0; i < 5; i++) flat.push({ id: 'TP' + i, name: 'Test part ' + i, kind: 'ship part', part: 'Navigation', hp: 15, ap: 10, text: 'A part.' });
  flat.push({ id: 'TX1', name: 'An idea', kind: 'idea, not in the set', rarity: 'rare', type: 'attack', text: 'Not a card yet.' });
  const n2 = G.use({ version: 'made up', cards: flat });
  ok(n2 === 130, `a flat list of 140 entries (130 battle cards, 5 upgrades, 5 parts, 1 idea) is read: ${n2} battle cards, ${G.list().filter(e => e.group === 'upgrade').length} upgrades, ${G.list().filter(e => e.group === 'part').length} parts, the idea left out`);
  allChecks('A made-up list of 140 cards', true);
  G.use(list); }
console.log('\n' + (bad ? 'RESULT: FAIL (' + bad + ')' : 'RESULT: PASS'));
process.exit(bad ? 1 : 0);
