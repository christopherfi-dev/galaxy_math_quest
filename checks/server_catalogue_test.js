// Server 0.3 with the battle thread's card list (docs/battle/cards.json, copied as api/cards.json). On this machine only. Made-up cadets only.
//   - a card named by its id ("A01") or its name ("Spark Shot") is one card on the class card board
//   - the kind comes from the list: a page that says a common card is epic is not believed
//   - a deck holds battle cards and upgrades; ship parts go with the ship; the 6 old cards stay out
//   - only rare or epic battle cards are put up in a challenge
//   - the test starter pack: off until the teacher turns on the test page; then 15 cards by the starter rule, once; they stay on any device
// Run: node checks/server_catalogue_test.js
const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqcat-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9300 + Math.floor(Math.random() * 150);
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA); fs.copyFileSync(path.join(ROOT, 'docs', 'battle', 'cards.json'), path.join(WEB, 'api', 'cards.json'));
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'ai' => ['provider' => '']];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const LIST = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'battle', 'cards.json'), 'utf8')), byId = {}; LIST.cards.concat(LIST.upgrades, LIST.parts).forEach(c => { byId[c.id] = c; });
const pick = (type, rarity) => LIST.cards.filter(c => c.type === type && c.rarity === rarity);
const bad = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
function client() { let cookie = ''; return async body => { const r = await fetch(`http://127.0.0.1:${PORT}/api/gmq-world-api.php`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0]; const j = await r.json().catch(() => ({})); j.status = r.status; return j; }; }
let n = 0; const u = () => 'm' + (++n) + 'abcdef';
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900));
  try {
    const T = client(); await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend 3C' })).code;
    await T({ action: 't_set', class: CODE, names: 'auto', board: true, battles: 'swap' });
    ok((await client()({ action: 'health' })).card_list === 118, 'the server check counts the card list', (await client()({ action: 'health' })).card_list);
    const join = async (name, ship) => { const c = client(); await c({ action: 'join', class: CODE, name, pin: '4242' }); await c({ action: 'name', ship }); return c; };
    const A = await join('Nova', 'Red Kite'), B = await join('Orbit', 'Blue Fox'), C = await join('Pixel', 'Sun Moth');
    const commonAtk = pick('attack', 'common')[0], rareDef = pick('defence', 'rare')[0], epicRep = pick('repair', 'epic')[0], part = LIST.parts[3], upg = LIST.upgrades[0];
    // Nova: by id; a common card the page says is epic; a ship part; an upgrade; one of the 6 old cards
    const novaCards = [{ id: commonAtk.id, r: 'gold', u: u() }, { id: rareDef.id, r: 'rare', u: u() }, { id: part.id, r: 'common', u: u() }, { id: upg.id, r: 'rare', u: u() }, { r: 'gold', n: 'Nebula Nova', u: u() }];
    // Orbit: the same common card by its NAME, an epic, and a rare
    const orbitCards = [{ n: commonAtk.name, r: 'common', u: u() }, { id: epicRep.id, r: 'gold', u: u() }, { id: pick('attack', 'rare')[1].id, r: 'rare', u: u() }];
    for (const [c, cards] of [[A, novaCards], [B, orbitCards]]) { const l = await c({ action: 'load' }); ok((await c({ action: 'save', state: { mode: 'station', done: {}, cards }, rev: l.rev, caps: ['rev', 'cards'] })).ok, 'a made-up card book is saved'); await c({ action: 'deck', open: true }); }
    // the class card board, seen by Pixel
    const board = await C({ action: 'board' }); const row = board.cards.find(c => c.key === commonAtk.id);
    ok(row && row.found_by === 2 && !board.cards.some(c => c.key === commonAtk.name), 'one card, named by id by one cadet and by name by another, is one card on the board', board.cards.map(c => c.key + ':' + c.found_by));
    ok(row && row.kind === 'common', 'the board takes the kind from the list');
    ok(board.cards.some(c => c.key === 'Nebula Nova' && c.kind === 'epic'), 'an old card is still on the board, by its old name');
    // the teacher's view: kinds from the list
    const k = (await T({ action: 't_class', class: CODE })).cadets.find(r => r.name === 'Nova').summary.card_kinds;
    ok(k.common === 1 && k.rare === 1 && k.epic === 1 && k.part === 1 && k.upgrade === 1, 'the teacher sees kinds from the list: the common card the page called epic counts as common', k);
    // decks and stakes
    const riv = await B({ action: 'rivals' }); const nova = riv.rivals.find(r => r.name === 'Red Kite');
    ok(nova && nova.deck === 3, "Nova's deck holds 3 cards: two battle cards and the upgrade, not the ship part or the old card", nova);
    for (let i = 0; i < 12; i++) { const st = await B({ action: 'battle_start', rival: nova.rival, kind: 'challenge' });
      if (!st.ok) { ok(false, 'a challenge starts', st.status + ' ' + st.error); break; }
      ok(st.rival.stake.id === rareDef.id, "Nova's only card that can be put up is the rare battle card (not the common one the page called epic, not the upgrade, not the old epic)", st.rival.stake);
      ok([epicRep.id, pick('attack', 'rare')[1].id].includes(st.you.stake.id), "Orbit's card at stake is one of their rare or epic battle cards", st.you.stake);
      ok(st.rival.parts.length === 1 && st.rival.parts[0].id === part.id && !st.rival.deck.some(c => c.id === part.id), 'the ship part is sent for the ship, not in the deck', st.rival.parts);
      ok(st.rival.deck.every(c => c.n === byId[c.id].name), 'every card sent carries its name from the list');
      await B({ action: 'battle_cancel', battle: st.battle }); if (i >= 2) break; }
    // a card that arrives says why, and is marked unseen, as the cards thread's book keeps a card (so the game's pop-up shows it)
    await T({ action: 't_set', class: CODE, battles: 'swap' });
    const st2 = await B({ action: 'battle_start', rival: nova.rival, kind: 'challenge' }); await B({ action: 'battle_accept', battle: st2.battle }); await B({ action: 'battle_end', battle: st2.battle, result: 'lost' });
    const nb = (await A({ action: 'load' })).state.cards.find(c => c.u === st2.you.stake.u);
    ok(nb && nb.unseen === 1 && /^Your deck won it from Blue Fox in a challenge\.$/.test(nb.why), 'a card won by a deck while its owner was away arrives with why, and unseen', nb);
    const st3 = await B({ action: 'battle_start', rival: nova.rival, kind: 'challenge' }); ok(st3.ok, 'a second challenge starts (Nova now has two cards to put up)', st3.error);
    if (st3.ok) { await B({ action: 'battle_accept', battle: st3.battle }); const e3 = await B({ action: 'battle_end', battle: st3.battle, result: 'won' }); const got = (e3.cards || []).find(c => c.u === st3.rival.stake.u);
      ok(got && got.unseen === 1 && /^Won from Red Kite's deck in a challenge\.$/.test(got.why), 'a card won arrives with why it came, and unseen', got); }
    // the test starter pack
    ok((await C({ action: 'test_starter' })).status === 403, 'the test starter pack is refused until the teacher turns on the test page');
    await T({ action: 't_set', class: CODE, test_tools: true });
    const sp = await C({ action: 'test_starter' }); const ids = (sp.cards || []).map(c => c.id), cs = ids.map(id => byId[id]);
    ok(sp.ok && ids.length === 15 && new Set(ids).size === 15, 'the test page gives 15 different cards', sp);
    ok(cs.filter(c => c.type === 'spy').length === 1 && cs.filter(c => c.type === 'guard').length === 1 && cs.filter(c => c.rarity === 'epic').length === 1 && cs.filter(c => c.rarity === 'rare' && c.type !== 'spy').length === 1, 'by the starter rule: 1 Spy, 1 Policeman, 1 epic, 1 rare', ids);
    ok((sp.cards || []).every(c => /^[A-Za-z0-9]{6,20}$/.test(c.u)), 'each card has its own mark');
    ok((await C({ action: 'test_starter' })).status === 409, 'only once');
    const l = await C({ action: 'load' }); const s2 = await C({ action: 'save', state: { mode: 'station', cards: [] }, rev: l.rev, caps: ['rev', 'cards'] });
    ok(s2.ok && (s2.cards || []).length === 15, 'a device that never had the starter pack keeps it when it saves (the ledger puts it back)', s2.cards && s2.cards.length);
    ok((await A({ action: 'test_starter' })).status === 409, 'a cadet who already has cards from the list gets no starter pack');
  } finally { srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('RESULT:', bad.length ? 'FAIL' : 'PASS'); process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
