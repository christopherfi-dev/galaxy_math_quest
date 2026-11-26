// Pretend classmates: 14 made-up cadets, two iPads each, all at the same time, against the GMQ world server.
// On this machine only. It never touches Marc's live server. Made-up names only, never a child's.
// PHP's own small web server runs with 8 workers, so requests really do overlap, as they would on Marc's site.
//
// What it checks (each line below is one way a class could lose work):
//   1. 28 iPads log in at once. Nobody is refused, nobody gets someone else's game.
//   2. Every cadet saves 25 times from one iPad while the other iPad passes real-life codes and asks for a ship name.
//      No save, code or name is lost. No request is told "Please log in" by mistake (a half-written file read in the middle of a write).
//   3. The same cadet on two iPads: the older iPad wakes up and sends its old game. The newer game must not be overwritten.
//   4. Every request answers within a few seconds, and the slowest is reported.
//   5. (server 0.2 and later) the card features: the class card board, friendly and challenge battles between
//      classmates, cards that move are never copied or lost, and a classmate who is away is told what happened.
//
// Run:  node checks/server_class_test.js            (the server in engines/gmq-world/server)
//       SRC=/some/other/server node checks/server_class_test.js   (an older copy, to show what it got wrong)
const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const SRC = process.env.SRC || path.resolve(__dirname, '..', 'engines', 'gmq-world', 'server');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqclass-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9100 + Math.floor(Math.random() * 300);
fs.cpSync(SRC, WEB, { recursive: true }); fs.mkdirSync(DATA);
const CON = path.resolve(__dirname, '..', 'engines', 'gmq-world', 'constraints', 'gmq-world.txt');
const EXTRA = path.join(TMP, 'extra.json'); fs.writeFileSync(EXTRA, '{}');      /* settings the test changes while the server runs (how long a battle may last) */
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return array_merge(['data_dir' => ${JSON.stringify(DATA)}, 'constraint_file' => ${JSON.stringify(CON)}, 'ai' => ['provider' => '']], json_decode(file_get_contents(${JSON.stringify(EXTRA)}), true) ?: []);`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);

const bad = [], notes = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
const times = []; let wrongLogout = 0, serverErrors = 0;
function client(label) { let cookie = ''; return async body => {
  const t0 = Date.now(); let r;
  try { r = await fetch(`http://127.0.0.1:${PORT}/api/gmq-world-api.php`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(body) }); }
  catch (e) { serverErrors++; return { status: 0, j: {} }; }
  const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0]; let j = {}; try { j = await r.json(); } catch (e) {}
  times.push(Date.now() - t0); if (r.status >= 500) serverErrors++;
  return { status: r.status, j }; }; }

/* Made-up names only. Letters only, as the server keeps them. */
const SHIPS = ['Red Kite', 'Blue Fox', 'Sun Moth', 'Iron Owl', 'Gold Bee', 'Sky Whale', 'Mint Rover', 'Star Seed', 'Dust Hawk', 'Moon Crab', 'Ice Lark', 'Fern Ray', 'Tin Wolf', 'Opal Jet'];   /* made-up ship names; none holds a cadet's name */
const NAMES = ['Nova', 'Orbit', 'Pixel', 'Comet', 'Zephyr', 'Quill', 'Juno', 'Rocket', 'Vega', 'Astra', 'Bolt', 'Cosmo', 'Lumen', 'Tycho'];
const CODES = { calib: 805, starmap: 314, target: 936, alloc: 446, choice: 728 };
const pad = 'x'.repeat(18000);                     /* a late game is a few thousand characters; this one is bigger, to be safe */
const game = (name, level, extra) => Object.assign({ mode: 'station', room: 'dock', who: name, level, done: Object.fromEntries(['battle', 'grid', 'calib', 'core', 'nav', 'map', 'fuel', 'gear', 'hull', 'wire', 'cool', 'radar', 'lock', 'pump', 'beam'].slice(0, Math.min(15, level)).map(k => [k, true])),
  parts: [], cards: [], secrets: [], notes: pad }, extra || {});
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore', env: Object.assign({}, process.env, { PHP_CLI_SERVER_WORKERS: '8' }) }); await sleep(1000);
  try {
    const teacher = client('teacher'); await teacher({ action: 't_login', password: 'orbit-teacher-77' });
    const CODE = (await teacher({ action: 't_new_class', name: 'Pretend 3C' })).j.code; ok(!!CODE, 'the teacher makes a class');
    const health = (await client('h')({ action: 'health' })).j; const v2 = !!(health && health.version && health.version >= '0.2');
    notes.push('server version: ' + (v2 ? health.version : '0.1 (no health check)'));

    // ---- 1. 28 iPads log in at once
    const kids = NAMES.map((n, i) => ({ name: n, pin: String(1000 + i * 37).padStart(4, '0'), A: client(n + ' A'), B: client(n + ' B') }));
    let r = (await Promise.all(kids.map(async k => [await k.A({ action: 'join', class: CODE, name: k.name, pin: k.pin }), await k.B({ action: 'join', class: CODE, name: k.name, pin: k.pin })]))).flat();   /* all cadets at once; for each cadet, iPad B logs in after iPad A */
    const joined = r.filter(x => x.j.ok).length; ok(joined === 28, '28 iPads log in at once', { joined, errors: r.filter(x => !x.j.ok).map(x => x.status + ' ' + x.j.error) });
    ok(r.every((x, i) => !x.j.ok || x.j.name === kids[Math.floor(i / 2)].name), 'each iPad gets its own cadet');
    // after this, B is the newest log in for every cadet, so B plays and A sits in a bag

    // ---- 2. everybody plays at once on iPad B: 25 saves, 5 real-life codes and a ship name, all overlapping; the teacher watches
    await Promise.all(kids.map(async (k, i) => {
      const jobs = [];
      jobs.push((async () => { for (let lv = 1; lv <= 25; lv++) { const x = await k.B({ action: 'save', state: game(k.name, lv) }); if (x.status === 401) wrongLogout++; ok(x.j.ok, `${k.name}: save ${lv} is kept`, x.status + ' ' + x.j.error); await sleep(20 + (i * 7) % 40); } })());
      jobs.push((async () => { for (const t of Object.keys(CODES)) { const x = await k.A({ action: 'code', task: t, code: String(CODES[t]) });     /* the other iPad: a different log in, writing the same cadet's file */ if (x.status === 401) wrongLogout++; ok(x.j.right === true, `${k.name}: the code for ${t} passes`, x.status + ' ' + x.j.error); await sleep(35); } })());
      jobs.push((async () => { await sleep(60); const x = await k.B({ action: 'name', ship: SHIPS[i] }); if (x.status === 401) wrongLogout++; ok(x.j.ok, `${k.name}: asks for a ship name`, x.status); })());
      jobs.push((async () => { for (let n = 0; n < 12; n++) { await sleep(25); const x = await k.A({ action: 'load' }); if (x.status === 401) wrongLogout++; } })());      /* iPad A opens the game while B is saving it */
      jobs.push((async () => { for (let n = 0; n < 6; n++) { await sleep(70); const x = await teacher({ action: 't_class', class: CODE }); ok(x.j.ok && (x.j.cadets || []).length === 14, 'the teacher\'s class view shows all 14 cadets while the class plays', x.status + ' ' + (x.j.cadets || []).length); } })());
      await Promise.all(jobs);
    }));
    ok(wrongLogout === 0, 'nobody is told "Please log in" while they play (a file read half-written)', wrongLogout + ' times');
    const cls = (await teacher({ action: 't_class', class: CODE })).j; const rows = cls.cadets || [];
    ok(rows.length === 14, 'the teacher sees 14 cadets', rows.length);
    let lostCodes = 0, lostNames = 0, lostSaves = 0;
    for (const k of kids) { const row = rows.find(x => x.name === k.name) || {};
      if ((row.codes_ok || []).length !== 5) lostCodes++; if (!row.ship || row.ship.wants !== SHIPS[kids.indexOf(k)]) lostNames++; if (!row.summary || row.summary.tasks !== 15) lostSaves++; }
    ok(lostCodes === 0, 'no passed real-life code is lost when a save lands at the same moment', lostCodes + ' of 14 cadets lost a code');
    ok(lostNames === 0, 'no ship name request is lost when a save lands at the same moment', lostNames + ' of 14 cadets lost their name request');
    ok(lostSaves === 0, 'the last save is the one kept', lostSaves + ' of 14 cadets');

    // ---- 3. the old iPad (A) wakes up and sends its old game
    const stale = await Promise.all(kids.map(k => k.A({ action: 'save', state: game(k.name, 2) })));
    const after = (await teacher({ action: 't_class', class: CODE })).j.cadets || [];
    const overwritten = kids.filter(k => { const row = after.find(x => x.name === k.name); return !row || !row.summary || row.summary.tasks !== 15; }).length;
    ok(overwritten === 0, 'an old iPad that wakes up does not overwrite the newer game', overwritten + ' of 14 games went back to 2 tasks');
    if (v2) ok(stale.every(x => x.status === 409 && x.j.moved), 'the old iPad is told the game moved to another iPad', stale.map(x => x.status));

    if (v2) await cardsPart(kids, teacher, CODE);

    // ---- 4. how fast
    const sorted = times.slice().sort((a, b) => a - b), q = f => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * f))];
    notes.push(`${times.length} requests: middle ${q(0.5)} ms, 95 in 100 within ${q(0.95)} ms, slowest ${sorted[sorted.length - 1]} ms`);
    ok(sorted[sorted.length - 1] < 5000, 'every request answers within 5 seconds', sorted[sorted.length - 1]);
    ok(serverErrors === 0, 'no server errors', serverErrors);
  } finally { srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const n of notes) console.log('  NOTE', n);
  for (const t of bad.slice(0, 40)) console.log('  PROBLEM', t); if (bad.length > 40) console.log(`  ... and ${bad.length - 40} more`);
  console.log('RESULT:', bad.length ? 'FAIL' : 'PASS'); process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });

/* ---- 5. cards between classmates (server 0.2) ----
   Each cadet's newest iPad is played by a small pretend page: it saves the whole game, sends the count of saves it last had (rev),
   and, if it is a new page, takes the card book the server sends back. Half the pages are new, half never take it (an old page),
   to show that a card that moved stays moved either way. Card names here are test labels, not cards of the game. */
async function cardsPart(kids, teacher, CODE) {
  const KINDS = i => (i < 10 ? 'common' : i < 14 ? 'rare' : 'gold');
  let seq = 0; const uid = () => 'u' + (++seq).toString(36) + Math.random().toString(36).slice(2, 8);
  for (const [i, k] of kids.entries()) {
    k.adopts = i % 2 === 0; k.st = game(k.name, 15); k.st.cards = Array.from({ length: 15 }, (_, j) => ({ r: KINDS(j), n: `Test ${KINDS(j)} ${(i * 7 + j * 3) % (KINDS(j) === 'common' ? 12 : KINDS(j) === 'rare' ? 6 : 3) + 1}`, u: uid() }));
    k.rev = (await k.B({ action: 'load' })).j.rev;
    k.save = async () => { const x = await k.B({ action: 'save', state: k.st, rev: k.rev, caps: ['rev', 'cards'] });
      if (x.j.ok) { k.rev = x.j.rev; if (x.j.cards && k.adopts) k.st.cards = x.j.cards; }
      else if (x.status === 409 && x.j.newer) { k.st = x.j.state || game(k.name, 0); k.rev = x.j.rev; }
      return x; };
    ok((await k.save()).j.ok, `${k.name}: the new page saves a card book`);
  }
  // off until the teacher turns it on
  ok((await kids[0].B({ action: 'board' })).j.off === true, 'the class card board is off until the teacher turns it on');
  ok((await kids[0].B({ action: 'rivals' })).status === 403, 'battles are off until the teacher turns them on');
  // the teacher approves 12 of the 14 ship names; two cadets have none
  for (const k of kids.slice(0, 12)) await teacher({ action: 't_name', class: CODE, id: k.name.toLowerCase(), ok: true });
  ok((await teacher({ action: 't_set', class: CODE, board: true, battles: 'swap' })).j.ok, 'the teacher turns on the board and challenge battles');

  // ---- the class card board
  const board = (await kids[0].B({ action: 'board' })).j; const bj = JSON.stringify(board);
  ok(board.ok && board.classmates === 13, 'the board counts 13 classmates (not the cadet who looks)', board.classmates);
  ok(NAMES.every(n => bj.indexOf(n) < 0), 'the board never shows a first name, only ship names', NAMES.filter(n => bj.indexOf(n) >= 0));
  ok(bj.indexOf(SHIPS[12]) < 0 && bj.indexOf(SHIPS[13]) < 0, 'a ship name the teacher has not approved is not shown');
  const truth = {}; kids.slice(1).forEach(k => new Set(k.st.cards.map(c => c.n)).forEach(n => { truth[n] = (truth[n] || 0) + 1; }));
  ok(board.cards.length === Object.keys(truth).length && board.cards.every(c => c.found_by === truth[c.key]), 'the board counts each card once for each classmate who has it', board.cards.slice(0, 3));

  // ---- decks: 10 cadets open theirs; cadets 12 and 13 open theirs but have no ship name, so nobody sees them
  for (const k of kids.slice(0, 8).concat(kids.slice(12))) await k.B({ action: 'deck', open: true });
  for (const k of kids.slice(10, 12)) await k.B({ action: 'deck', open: true, uids: k.st.cards.slice(8).map(c => c.u) });   // two cadets put only part of their book in the deck
  const riv = (await kids[9].B({ action: 'rivals' })).j;
  ok(riv.ok && riv.rivals.length === 10 && riv.rivals.every(r => SHIPS.slice(0, 12).includes(r.name)), 'the list of classmates to battle shows 10 decks, by ship name only', riv.rivals && riv.rivals.map(r => r.name));
  ok(JSON.stringify(riv).indexOf(kids[0].name.toLowerCase()) < 0, 'a classmate is named by a mark, never by their first name or file name');
  const hOf = ship => { const r = (riv.rivals || []).find(x => x.name === ship); if (!r) ok(false, 'a classmate is on the list: ' + ship, (riv.rivals || []).map(x => x.name)); return r ? r.rival : 'none'; };
  const deck10 = riv.rivals.find(r => r.name === SHIPS[10]); ok(deck10 && deck10.deck === 7, 'a deck can be part of a book', deck10);

  // ---- many battles at once, while every iPad keeps saving
  const totalBefore = kids.reduce((a, k) => a + k.st.cards.length, 0); let playing = true, offers = 0, busy = 0, ends = 0, wins = 0, losses = 0;
  const savers = kids.map(async k => { while (playing) { await k.save(); await sleep(15 + Math.random() * 30); } });
  const fighters = kids.slice(0, 12);
  for (let round = 0; round < 6; round++) {
    await Promise.all(fighters.map(async (k, i) => {
      const targets = riv.rivals.filter(r => r.name !== SHIPS[i]); const t = targets[(i * 3 + round * 5) % targets.length];
      const st = await k.B({ action: 'battle_start', rival: t.rival, kind: 'challenge' });
      if (st.status === 409) { busy++; return; } if (!st.j.ok) { if (st.status !== 403) ok(false, `${k.name}: a battle starts or says why not`, st.status + ' ' + st.j.error); return; }
      offers++;
      ok(['rare', 'gold'].includes(st.j.you.stake.r) && ['rare', 'gold'].includes(st.j.rival.stake.r), 'both cards at stake are rare or epic', [st.j.you.stake, st.j.rival.stake]);
      ok(st.j.you.deck.some(c => c.u === st.j.you.stake.u) && st.j.rival.deck.some(c => c.u === st.j.rival.stake.u), 'each card at stake comes from its own deck');
      ok((await k.B({ action: 'battle_end', battle: st.j.battle, result: 'won' })).status === 409, 'a challenge cannot end before the challenger agrees to it');
      if ((i + round) % 5 === 4) { ok((await k.B({ action: 'battle_cancel', battle: st.j.battle })).j.ok, 'the challenger may back out after seeing the cards'); return; }
      ok((await k.B({ action: 'battle_accept', battle: st.j.battle })).j.ok, 'the challenger agrees');
      ok((await k.B({ action: 'battle_start', rival: t.rival, kind: 'friendly' })).status === 409, 'a cadet in a battle cannot start another');
      await sleep(20 + Math.random() * 40);
      const result = ['won', 'lost', 'tie'][(i + round) % 3]; const e = await k.B({ action: 'battle_end', battle: st.j.battle, result });
      ok(e.j.ok, `${k.name}: the battle ends`, e.status + ' ' + e.j.error); ends++; if (result === 'won') wins++; if (result === 'lost') losses++;
      if (e.j.ok && result !== 'tie') ok(e.j.moved && e.j.moved.u === (result === 'won' ? st.j.rival.stake.u : st.j.you.stake.u), 'the card at stake is the one that moves', e.j.moved);
      if (e.j.ok && k.adopts) k.st.cards = e.j.cards;
      ok((await k.B({ action: 'battle_end', battle: st.j.battle, result: 'won' })).status === 404, 'a battle has one result only');
    }));
  }
  playing = false; await Promise.all(savers); for (const k of kids) await k.save();
  notes.push(`battles: ${offers} offered, ${ends} played (${wins} won, ${losses} lost), ${busy} refused because a cadet was busy`);
  ok(ends >= 15, 'enough battles were played to test', ends);
  // every card is in exactly one book; none was copied or lost
  const all = []; const rowsNow = (await teacher({ action: 't_class', class: CODE })).j.cadets;
  const totalAfter = rowsNow.reduce((a, r) => a + r.summary.cards, 0);
  ok(totalAfter === totalBefore, 'under "winner takes both", no card is made or lost: the class holds the same number of cards', [totalBefore, totalAfter]);
  for (const k of kids) { const x = await k.B({ action: 'load' }); (x.j.state.cards || []).forEach(c => all.push(c.u)); }
  ok(new Set(all).size === all.length, 'no card is in two books', all.length - new Set(all).size);
  ok(all.length === totalBefore, 'every card is in a book', [all.length, totalBefore]);
  const oldPage = kids.find(k => !k.adopts); const oldSave = await oldPage.save(); ok(oldSave.j.ok, 'an old page that never took the new book still saves');
  ok((await oldPage.B({ action: 'load' })).j.state.cards.length === rowsNow.find(r => r.name === oldPage.name).summary.cards, 'an old card book sent again does not bring back a card that left, or lose one that came');

  // ---- the classmate who was away is told
  let withNews = 0;
  for (const k of kids) { const x = await k.B({ action: 'load' }); if ((x.j.news || []).length) withNews++; k.lastNews = x.j.news; }
  ok(withNews >= 5, 'classmates whose decks were battled are told what happened', withNews);
  const sample = kids.map(k => k.lastNews || []).flat().map(n => n.say);
  ok(sample.every(t => t.split(/(?<=[.!])\s+/).every(sn => sn.split(/\s+/).length <= 16)), 'the news is in short sentences', sample.find(t => t.split(/(?<=[.!])\s+/).some(sn => sn.split(/\s+/).length > 16)));
  ok(sample.every(t => NAMES.every(n => t.indexOf(n) < 0)), 'the news names classmates by ship name only');
  notes.push('news, for example: "' + (sample.find(t => /got/.test(t)) || sample[0]) + '"');
  await kids[0].B({ action: 'news_seen' }); ok(((await kids[0].B({ action: 'load' })).j.news || []).length === 0, 'news, once seen, is gone');

  // ---- "a classmate who is away never loses a card"
  await teacher({ action: 't_set', class: CODE, battles: 'away-safe' });
  const [ch, rv] = [kids[12], kids[2]];       /* kids[12] has no ship name: the news calls them "A classmate"; the fighters above have used most of their hour */ const rvHandle = (await ch.B({ action: 'rivals' })).j.rivals.find(r => r.name === SHIPS[2]);
  const rvBefore = (await rv.B({ action: 'load' })).j.state.cards.length, chBefore = (await ch.B({ action: 'load' })).j.state.cards.length;
  let st = await ch.B({ action: 'battle_start', rival: rvHandle.rival, kind: 'challenge' }); await ch.B({ action: 'battle_accept', battle: st.j.battle });
  let e = await ch.B({ action: 'battle_end', battle: st.j.battle, result: 'won' });
  const rvAfter = (await rv.B({ action: 'load' })).j.state.cards.length, chAfter = (await ch.B({ action: 'load' })).j.state.cards.length;
  ok(e.j.ok && rvAfter === rvBefore && chAfter === chBefore + 1 && e.j.moved.n === st.j.rival.stake.n && e.j.moved.u !== st.j.rival.stake.u, 'away-safe: the challenger wins a copy; the classmate who was away keeps theirs', [rvBefore, rvAfter, chBefore, chAfter]);
  st = await ch.B({ action: 'battle_start', rival: rvHandle.rival, kind: 'challenge' }); await ch.B({ action: 'battle_accept', battle: st.j.battle }); e = await ch.B({ action: 'battle_end', battle: st.j.battle, result: 'lost' });
  ok(e.j.ok && (await rv.B({ action: 'load' })).j.state.cards.length === rvBefore + 1 && (await ch.B({ action: 'load' })).j.state.cards.length === chBefore, 'away-safe: a challenger who loses still gives up their card');
  // friendly: nothing moves
  st = await ch.B({ action: 'battle_start', rival: rvHandle.rival, kind: 'friendly' }); ok(st.j.ok && st.j.status === 'on' && !st.j.you.stake, 'a friendly battle begins at once, with nothing at stake');
  e = await ch.B({ action: 'battle_end', battle: st.j.battle, result: 'won' }); ok(e.j.ok && !e.j.moved && (await rv.B({ action: 'load' })).j.state.cards.length === rvBefore + 1, 'a friendly battle moves no card');
  // friendly only
  await teacher({ action: 't_set', class: CODE, battles: 'friendly' }); ok((await ch.B({ action: 'battle_start', rival: rvHandle.rival, kind: 'challenge' })).status === 403, 'with "friendly only", a challenge is refused');
  // a battle never finished ends by itself, with nothing moved
  fs.writeFileSync(EXTRA, JSON.stringify({ battle_minutes: 0.05 })); st = await kids[13].B({ action: 'battle_start', rival: hOf(SHIPS[6]), kind: 'friendly' }); ok(st.j.ok, 'a battle starts (to be left unfinished)');
  await sleep(4600); const again = await kids[13].B({ action: 'battle_start', rival: hOf(SHIPS[7]), kind: 'friendly' }); ok(again.j.ok, 'a battle left unfinished ends by itself, so the cadet can battle again', again.status + ' ' + again.j.error);
  if (again.j.ok) await kids[13].B({ action: 'battle_end', battle: again.j.battle, result: 'tie' }); fs.writeFileSync(EXTRA, '{}');
  // an hour's limit
  let limited = false; for (let n = 0; n < 8 && !limited; n++) { const s2 = await kids[13].B({ action: 'battle_start', rival: hOf(SHIPS[4]), kind: 'friendly' }); if (s2.status === 429) limited = true; else if (s2.j.ok) await kids[13].B({ action: 'battle_end', battle: s2.j.battle, result: 'tie' }); }
  ok(limited, 'a cadet cannot start battles without end: there is a limit for each hour');
  // a card with no mark of its own (as today's game saves cards) is never put up in a challenge
  await teacher({ action: 't_set', class: CODE, battles: 'swap' }); const oldBook = kids[4].st.cards.map(c => ({ r: c.r, n: c.n }));
  const l4 = await kids[4].B({ action: 'load' }); await kids[4].B({ action: 'save', state: Object.assign({}, kids[4].st, { cards: oldBook }), rev: l4.j.rev });       /* an old page: no marks */
  const fromOld = await kids[12].B({ action: 'battle_start', rival: hOf(SHIPS[4]), kind: 'challenge' });
  const markedOnly = fromOld.status === 400 ? /no rare or epic card/.test(fromOld.j.error) : !!(fromOld.j.ok && /^[A-Za-z0-9]{6,20}$/.test(fromOld.j.rival.stake.u || '') && (await kids[4].B({ action: 'load' })).j.state.cards.some(c => c.u === fromOld.j.rival.stake.u));
  ok(markedOnly, 'from a book saved without marks, only a card the server itself gave (a won card, with its mark) can be put up', fromOld.status + ' ' + (fromOld.j.error || JSON.stringify(fromOld.j.rival && fromOld.j.rival.stake)));
  if (fromOld.j.ok) await kids[12].B({ action: 'battle_cancel', battle: fromOld.j.battle });
  // the teacher sees every battle
  const tb = (await teacher({ action: 't_battles', class: CODE })).j; ok(tb.ok && tb.done.length >= ends && tb.done.some(b => NAMES.includes(b.a)), 'the teacher sees every battle, with first names', tb.done && tb.done.length);
  ok(tb.done.some(b => b.status === 'not finished'), 'the teacher sees a battle that was never finished');
  ok(tb.done.some(b => b.status === 'backed out'), 'the teacher sees when a challenger backed out');

  // ---- the teacher clears a game, then brings it back
  const t0 = kids[6]; const before = (await t0.B({ action: 'load' })).j.state.cards.length;
  await teacher({ action: 't_reset', class: CODE, id: t0.name.toLowerCase(), what: 'game' });
  const keep = t0.st; let x = await t0.B({ action: 'save', state: keep, rev: t0.rev, caps: ['rev', 'cards'] });
  ok(x.status === 409 && x.j.newer && x.j.state === null, 'after the teacher clears a game, the open iPad is told, and cannot save the old game over it', x.status);
  t0.st = game(t0.name, 0); t0.rev = x.j.rev; ok((await t0.save()).j.ok, 'the iPad takes the cleared game and saves again');
  const bk = (await teacher({ action: 't_backups', class: CODE, id: t0.name.toLowerCase() })).j; const n = (bk.backups || []).findIndex(b => b.why === 'before you cleared it');
  ok(n >= 0 && bk.backups[n].summary.cards === before, 'the cleared game is kept as a copy the teacher can bring back', bk.backups);
  ok((await teacher({ action: 't_restore', class: CODE, id: t0.name.toLowerCase(), n })).j.ok, 'the teacher brings the copy back');
  x = await t0.save(); ok(x.status === 409 && x.j.newer && t0.st.cards.length === before, 'the open iPad is told, and takes the copy that was brought back', [x.status, t0.st.cards && t0.st.cards.length, before]); ok((await t0.save()).j.ok, 'then it saves again');
  // a game that goes back by itself (a new game by mistake) is kept too
  t0.st = game(t0.name, 1); await t0.save(); const bk2 = (await teacher({ action: 't_backups', class: CODE, id: t0.name.toLowerCase() })).j;
  ok(bk2.backups[0].why === 'before the game went back' && bk2.backups[0].summary.tasks === 15, 'a save that makes a game go back keeps the bigger game as a copy', bk2.backups[0]);
  // an old page that was open when the teacher cleared the game
  const t1 = kids[7]; await t1.B({ action: 'save', state: game(t1.name, 15) }); await teacher({ action: 't_reset', class: CODE, id: t1.name.toLowerCase(), what: 'game' });
  x = await t1.B({ action: 'save', state: game(t1.name, 15) }); ok(x.status === 409, 'an old page cannot save over a game the teacher cleared', x.status);
  // bring the game to this iPad
  const t2 = kids[8]; x = await t2.A({ action: 'claim' }); ok(x.j.ok && x.j.newest, 'an older iPad can take the game back ("bring it here")');
  ok((await t2.B({ action: 'save', state: t2.st, rev: t2.rev })).j.moved === true, 'then the other iPad is the older one');
  // the teacher removes a cadet while a classmate is battling their deck: nothing is written back for the removed cadet
  const t3 = kids[12], gone = kids[11]; st = await t3.B({ action: 'battle_start', rival: hOf(SHIPS[11]), kind: 'challenge' });
  ok(st.j.ok, 'a battle starts, to remove the classmate during it', st.status + ' ' + st.j.error); if (st.j.ok) await t3.B({ action: 'battle_accept', battle: st.j.battle });
  await teacher({ action: 't_reset', class: CODE, id: gone.name.toLowerCase(), what: 'remove' });
  if (st.j.ok) { const e3 = await t3.B({ action: 'battle_end', battle: st.j.battle, result: 'won' }); ok(e3.j.ok && !e3.j.moved, 'the battle ends with nothing moved', e3.j); }
  const left = (await teacher({ action: 't_class', class: CODE })).j.cadets; ok(left.length === 13 && left.every(r => r.name), 'the removed cadet stays removed', left.map(r => r.name));
  // nothing private is sent
  const everything = JSON.stringify([board, riv, (await kids[0].B({ action: 'load' })).j]); ok(everything.indexOf('pin_hash') < 0 && everything.indexOf('login') < 0 && everything.indexOf('ledger') < 0, 'no secret number, log in mark or ledger is ever sent to a cadet');
}
