// The server's card list and starter pack, checked against the battle thread's own code. On this machine only.
//   1. The server reads docs/battle/cards.json and knows every card, with the same group, type and kind.
//   2. The server's starter pack (PHP) is the same as GMQBattleOwn.starter(seed) (JavaScript, from docs/battle/own.html)
//      on 20,000 seeds, edge seeds included. Every pack follows Marc's rule: 15 cards, 1 Spy, 1 Policeman (Station Guard),
//      1 epic, 1 rare, no card twice.
// Run: node checks/server_cards_check.js [seeds]
const { execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path'); const vm = require('vm');
const ROOT = path.resolve(__dirname, '..'), JSONF = path.join(ROOT, 'docs', 'battle', 'cards.json'), LIB = path.join(ROOT, 'engines', 'gmq-world', 'server', 'api', 'gmq-world-cardlist.php');
const N = Number(process.argv[2] || 20000), bad = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
const DATA = JSON.parse(fs.readFileSync(JSONF, 'utf8'));
// the battle thread's piece, run as it is
const own = fs.readFileSync(path.join(ROOT, 'docs', 'battle', 'own.html'), 'utf8'); const a = own.indexOf('/* ===== GMQ BATTLE: start ====='), b = own.indexOf('/* ===== GMQ BATTLE: end ===== */');
const ctx = {}; vm.createContext(ctx); vm.runInContext(own.slice(a, b) + '\nthis.GMQBattleOwn = GMQBattleOwn;', ctx); const JS = ctx.GMQBattleOwn;
// seeds: edges, then a spread
const seeds = [0, 1, 2, 16807, 2147483645, 2147483646, 2147483647, 2147483648, -1, -2147483646, 9007199254740991];
for (let i = 0; seeds.length < N; i++) seeds.push(Math.floor(((i * 2654435761) % 4294967296) + i * 7919) % 2147483647 * (i % 5 === 0 ? -1 : 1));
// the server's code, run as it is
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqcards-')), SEEDS = path.join(TMP, 'seeds.json'); fs.writeFileSync(SEEDS, JSON.stringify(seeds));
const php = `$CONFIG = ['cards_file' => ${JSON.stringify(JSONF)}]; require ${JSON.stringify(LIB)}; $cat = catalogue(); $o = ['n' => $cat['n'], 'ids' => $cat['id'], 'packs' => []];
  foreach (json_decode(file_get_contents(${JSON.stringify(SEEDS)}), true) as $s) $o['packs'][] = starterPack((int)$s); echo json_encode($o);`;
const P = JSON.parse(execFileSync('php', ['-r', php], { maxBuffer: 256 * 1024 * 1024 }).toString()); fs.rmSync(TMP, { recursive: true, force: true });
// 1. the list
const all = DATA.cards.map(c => [c, 'battle card']).concat(DATA.upgrades.map(c => [c, 'upgrade']), DATA.parts.map(c => [c, 'ship part']));
ok(P.n === all.length, 'the server knows every card in the list', [P.n, all.length]);
let wrong = all.filter(([c, g]) => { const e = P.ids[c.id]; return !e || e.name !== c.name || e.group !== g || e.type !== String(c.type || '') || e.rarity !== String(c.rarity || ''); });
ok(!wrong.length, 'each card has the same name, group, type and kind on the server', wrong.slice(0, 3).map(x => x[0].id));
// 2. the starter pack
let differ = 0, first = null; const byId = {}; DATA.cards.forEach(c => { byId[c.id] = c; });
seeds.forEach((s, i) => {
  const js = Array.from(JS.starter(s)), ph = P.packs[i];
  if (JSON.stringify(js) !== JSON.stringify(ph)) { differ++; if (!first) first = { seed: s, js, ph }; }
  const cs = ph.map(id => byId[id]); const types = t => cs.filter(c => c && c.type === t).length;
  if (i < 3000 || i % 7 === 0) {
    ok(ph.length === 15 && new Set(ph).size === 15, `seed ${s}: 15 different cards`, ph);
    ok(types('spy') === 1 && types('guard') === 1, `seed ${s}: one Spy and one Policeman (Station Guard)`, ph);
    ok(cs.filter(c => c.rarity === 'epic' && c.type !== 'spy').length === 1 && cs.filter(c => c.rarity === 'rare' && c.type !== 'spy').length === 1, `seed ${s}: one epic and one rare, neither a Spy`, ph);
  }
});
ok(differ === 0, `the server's starter pack is the battle thread's, seed for seed (${seeds.length} seeds)`, first);
const packs = new Set(P.packs.map(p => p.slice().sort().join())); console.log(`  NOTE ${seeds.length} seeds; ${packs.size} different packs; ${P.n} cards known`);
for (const t of bad.slice(0, 20)) console.log('  PROBLEM', t); if (bad.length > 20) console.log(`  ... and ${bad.length - 20} more`);
console.log('RESULT:', bad.length ? 'FAIL' : 'PASS'); process.exit(bad.length ? 1 : 0);
