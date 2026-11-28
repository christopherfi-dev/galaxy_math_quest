// A cadet's first log-in keeps the game their iPad already holds (the class link's game, with the cards earned on the station).
// [Marc, 28 November: children keep the cards they earn on the station.] On this machine only. Made-up cadets only.
//   1. a new cadet's join says first: true; the first save brings the iPad's game (15 cards, 4 tasks), and the Desk says so
//   2. the same game cannot be brought in by a second cadet: one game belongs to one cadet in a class
//   3. the second cadet brings their own game
//   4. a cadet who already has a game on the server: an iPad's own game is not written over it; if it holds more, it is kept as a copy
//   5. after the teacher clears a game, the old game cannot come back as a "first" save
//   6. when the teacher removes a cadet, the game they brought can be brought by its real owner
//   7. an old game with no number of its own (before version 102) is still taken as a first save
// Run: node checks/server_first_save_test.js
const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqfirst-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9400 + Math.floor(Math.random() * 40);
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA);
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'ai' => ['provider' => '']];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const bad = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
const URL = `http://127.0.0.1:${PORT}/api/gmq-world-api.php`;
function client() { let cookie = ''; return async body => { const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0]; const t = await r.text(); let j = {}; try { j = JSON.parse(t); } catch (e) {} j.http = r.status; return j; }; }
/* a game as the class link saves it (version 102 and later): its own number, cards from the list, tasks done */
const ipadGame = (packSeed, tasks, cards) => ({ mode: 'station', room: 'dock', seed: 4242, done: Object.fromEntries(['calib', 'grid', 'battle', 'core', 'nav', 'map'].slice(0, tasks).map(k => [k, true])), skill: {},
  cards: Array.from({ length: cards }, (_, i) => ({ id: 'A0' + (1 + i % 9), r: 'common', n: 'Card ' + i, why: 'For a station task.' })), secrets: [], ...(packSeed ? { packSeed } : {}) });
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900));
  try {
    const T = client(); await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend 3C' })).code;
    // 1
    const A = client(); let j = await A({ action: 'join', class: CODE, name: 'Nova', pin: '1357' });
    ok(j.ok && j.state === null && j.rev === 0 && j.first === true, 'a new cadet\'s join says first: true', j);
    let r = await A({ action: 'save', state: ipadGame(111111, 4, 15), rev: 0, caps: ['rev', 'cards'] });
    ok(r.ok && r.rev === 1, 'the first save brings the iPad\'s game', r);
    j = await client()({ action: 'join', class: CODE, name: 'Nova', pin: '1357' }); ok(j.state && j.state.cards.length === 15 && j.first === false, 'the 15 cards are on the server, and the next log-in is not "first"', j.state && j.state.cards.length);
    const row = n => T({ action: 't_class', class: CODE }).then(c => (c.cadets || []).find(x => x.name === n) || {});
    let nr = await row('Nova'); ok(nr.first_from && nr.first_from.summary.cards === 15 && nr.first_from.summary.tasks === 4, 'the Desk says Nova brought the game from the iPad: 4 tasks, 15 cards', nr.first_from);
    // 2
    const B = client(); await B({ action: 'join', class: CODE, name: 'Orbit', pin: '2468' });
    r = await B({ action: 'save', state: ipadGame(111111, 4, 15), rev: 0, caps: ['rev', 'cards'] });
    ok(r.http === 409 && r.claimed === true && /belongs to another cadet/.test(r.error), 'a second cadet cannot bring in the same game', r);
    ok(((await B({ action: 'load' })).state) === null, 'and Orbit\'s game on the server is still empty');
    // 3
    r = await B({ action: 'save', state: ipadGame(222222, 2, 9), rev: 0, caps: ['rev', 'cards'] }); ok(r.ok, 'Orbit brings their own game', r);
    // 4: Nova on another iPad that holds a different, bigger game
    const A2 = client(); j = await A2({ action: 'join', class: CODE, name: 'Nova', pin: '1357' }); ok(j.first === false && j.rev === 1, 'Nova already has a game: not first', j.rev);
    r = await A2({ action: 'save', state: ipadGame(333333, 6, 20), rev: 0, caps: ['rev', 'cards'] });
    ok(r.http === 409 && r.newer === true && r.state && r.state.cards.length === 15, 'the other iPad\'s own game is not written over the server\'s; the server\'s game is sent back to take', r.http);
    const bk = (await T({ action: 't_backups', class: CODE, id: 'nova' })).backups; ok(bk.some(b => b.summary.cards === 20), 'the bigger game from that iPad is kept as a copy the teacher can bring back', bk.map(b => b.why + ':' + b.summary.cards));
    // 5: after a clear
    await T({ action: 't_reset', class: CODE, id: 'orbit', what: 'game' }); await B({ action: 'logout' }); const B2 = client(); j = await B2({ action: 'join', class: CODE, name: 'Orbit', pin: '2468' });
    ok(j.state === null && j.first === false, 'after a clear, the join is not "first"', j.first);
    r = await B2({ action: 'save', state: ipadGame(444444, 3, 12), rev: 0 });
    ok(r.http === 409 && r.newer, 'and the iPad\'s old game cannot come back over the cleared one', r.http);
    // 6: removal frees the game
    const C = client(); await C({ action: 'join', class: CODE, name: 'Pixel', pin: '9999' });
    ok((await C({ action: 'save', state: ipadGame(111111, 4, 15), rev: 0 })).http === 409, 'Pixel cannot bring Nova\'s game');
    await T({ action: 't_reset', class: CODE, id: 'nova', what: 'remove' });
    r = await C({ action: 'save', state: ipadGame(111111, 4, 15), rev: 0 }); ok(r.ok, 'once the teacher removes Nova, the game can be brought by its real owner', r);
    // 7: an old game with no number of its own
    const D = client(); await D({ action: 'join', class: CODE, name: 'Vega', pin: '5555' }); r = await D({ action: 'save', state: ipadGame(0, 2, 6), rev: 0 }); ok(r.ok, 'an old game with no number of its own is still taken', r);
    // nothing about another child leaks in the refusals
    ok(!/Nova|nova/.test(JSON.stringify(await (async () => { const E = client(); await E({ action: 'join', class: CODE, name: 'Juno', pin: '1111' }); return E({ action: 'save', state: ipadGame(222222, 1, 1), rev: 0 }); })())), 'a refusal never names the cadet who owns the game');
  } finally { srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('RESULT:', bad.length ? 'FAIL' : 'PASS'); process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
