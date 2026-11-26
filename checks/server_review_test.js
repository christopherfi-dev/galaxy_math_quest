// The faults an independent review found in server 0.3 (26 November, night), each played again on server 0.3.1. On this machine only.
// Made-up cadets only; the names in part 2 are common names and nicknames, used only to check that they are NOT refused.
//   1. an empty object {} in a saved game comes back as {} (0.1 to 0.3 turned it into [], and a finished task was then lost)
//   2. real names are not refused (Pornthip, Siriporn, Supaporn, Kanokporn, Shital, Fukuda, Wankaew; Poo, Pee, Bum, Fu); curses still are
//   3. a game refused after the teacher cleared it is kept as a copy
//   4. a smaller copy never pushes out a bigger one of the same kind
//   5. bringing back a copy cannot make a card that left come back (no card in two books)
//   6. many wrong teacher passwords sent at once still lock the door after five
//   7. a battle log cut in the middle of a letter does not empty the teacher's battle list
//   8. a real-life code that starts with 0 can be passed
//   9. a battle ended after its time moves nothing
//  10. a cleared game starts with no cards
//  11. a second child with the same first name is told to add a letter
//  12. a game nested too deep to read back is refused, and the name cannot be taken over
//  13. the server check probes a data folder inside the API's folder
// Run: node checks/server_review_test.js
const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqrev-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9450 + Math.floor(Math.random() * 40);
fs.cpSync(process.env.SRC || path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA);      /* SRC=<an older server folder> shows what it got wrong */
const EXTRA = path.join(TMP, 'extra.json'); fs.writeFileSync(EXTRA, '{}');
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return array_merge(['data_dir' => ${JSON.stringify(DATA)}, 'ai' => ['provider' => '']], json_decode(file_get_contents(${JSON.stringify(EXTRA)}), true) ?: []);`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const bad = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
const URL = `http://127.0.0.1:${PORT}/api/gmq-world-api.php`;
function client() { let cookie = ''; const f = async (body, raw) => { const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: raw || JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0]; const text = await r.text(); let j = {}; try { j = JSON.parse(text); } catch (e) {} j.status = r.status; j.text = text; return j; }; return f; }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore', env: Object.assign({}, process.env, { PHP_CLI_SERVER_WORKERS: '8' }) }); await sleep(1000);
  try {
    const T = client(); await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend 3C' })).code;
    await T({ action: 't_set', class: CODE, names: 'auto', battles: 'swap' });
    const kid = async (name, pin) => { const c = client(); const j = await c({ action: 'join', class: CODE, name, pin: pin || '1357' }); c.j = j; return c; };
    // 1. {} stays {}
    const A = await kid('Nova'); let r = await A({ action: 'save', state: { mode: 'station', done: {}, skill: {}, c: { done: {}, prog: {} }, grid: { 0: 'a', 1: 'b' }, cards: [], log: [] } });
    const B = await kid('Nova'); const raw = B.j.text;
    ok(/"done":\{\}/.test(raw) && /"skill":\{\}/.test(raw) && /"c":\{"done":\{\},"prog":\{\}\}/.test(raw), 'an empty object {} comes back as {}, at the top and inside', raw.slice(0, 300));
    ok(/"grid":\{"0":"a","1":"b"\}/.test(raw) && /"cards":\[\]/.test(raw), 'an object with keys 0, 1 stays an object, and a list stays a list', raw.slice(0, 300));
    // the game's own case: a task marked done on the second device is kept
    const st = JSON.parse(raw).state; st.done.calib = true; r = await B({ action: 'save', state: st }); const C2 = await kid('Nova');
    ok(C2.j.state && C2.j.state.done && C2.j.state.done.calib === true, 'a task finished on the second device is kept (it was lost before)', C2.j.state && C2.j.state.done);
    // 2. names
    for (const n of ['Pornthip', 'Siriporn', 'Supaporn', 'Kanokporn', 'Pornpimol', 'Poo', 'Pee', 'Bum', 'Fu', 'Shital', 'Harshit', 'Fukuda', 'Wankaew', 'Assadawut', 'Phassakorn', 'Dickson', 'Ali Butt', 'Poo P', 'Fu K', 'Phuc', 'Bich', 'Titus']) {
      const c = await kid(n, '2468'); ok(c.j.ok, `a real name is not refused: ${n}`, c.j.error); }
    for (const n of ['Fuck', 'Shit Head', 'F U C K', 'B1tch', 'Porn', 'Poop Head', 'Fuuuck', 'Sexy', 'Stupid', 'Idiot', 'Fucked', 'Motherfucker', 'Bullshit', 'Pissed', 'Smartass', 'Crappy', 'Dammit', 'Douchebag', 'Retarded', 'Fatso']) {
      const c = await kid(n, '2468'); ok(c.j.status === 400 && /own name/.test(c.j.error), `a curse or an insult is still refused: ${n}`, c.j); }
    // a real name the check refuses can be allowed by the teacher, for the class
    await T({ action: 't_set', class: CODE, allow: 'Porn, Fuk' }); ok((await kid('Porn', '2468')).j.ok && (await kid('Fuk', '2468')).j.ok, 'a real name the teacher allows can log in (Porn, Fuk)');
    ok((await T({ action: 't_class', class: CODE })).class.allow === 'Porn, Fuk', 'the Desk shows the names allowed');
    const SH = await kid('Pimchanok', '2468'); const said = async ship => JSON.parse((await SH({ action: 'name', ship })).text).status;      /* the server's own status, not the web status */
    ok((await said('Siriporn')) !== 'refused' && (await said('Fucked Up')) === 'refused', 'ship names: Siriporn is allowed, a curse is not');
    // odd input made by hand gets a plain answer, never an empty page
    for (const body of [{ action: 'save', state: { mode: {}, cards: [] }, caps: [{}] }, { action: 'code', task: 'calib', code: {} }]) { const x = await SH(body); ok(x.text.length > 0 && /"ok":false/.test(x.text), 'odd input gets a plain answer', [body, x.status, x.text.slice(0, 80)]); }
    // 3. a game refused after a clear is kept
    const D = await kid('Orbit'); await D({ action: 'save', state: { mode: 'station', done: { a: true, b: true, c: true }, cards: [] } });
    await T({ action: 't_reset', class: CODE, id: 'orbit', what: 'game' });
    r = await D({ action: 'save', state: { mode: 'station', done: { a: true, b: true, c: true, d: true }, cards: [] } }); ok(r.status === 409, 'an iPad that was open cannot save over a cleared game');
    let bk = (await T({ action: 't_backups', class: CODE, id: 'orbit' })).backups; ok(bk.some(b => b.why === 'from an iPad that was open, not kept' && b.summary.tasks === 4), 'the game it could not save is kept as a copy', bk.map(b => b.why + ':' + b.summary.tasks));
    // 4. a smaller copy does not push out a bigger one
    const E = await kid('Pixel'); const big = { mode: 'station', done: Object.fromEntries('abcdefghijkl'.split('').map(k => [k, true])), cards: [] };
    await E({ action: 'save', state: big }); await E({ action: 'save', state: { mode: 'intro', done: {}, cards: [] } });
    await E({ action: 'save', state: { mode: 'station', done: { a: true }, cards: [] } }); await E({ action: 'save', state: { mode: 'intro', done: {}, cards: [] } });
    bk = (await T({ action: 't_backups', class: CODE, id: 'pixel' })).backups; ok(bk.some(b => b.why === 'before the game went back' && b.summary.tasks === 12), 'the 12-task copy is still there after a smaller game went back too', bk.map(b => b.why + ':' + b.summary.tasks));
    // 5. no card in two books after a copy is brought back
    const P = await kid('Vega'), Q = await kid('Juno'), R = await kid('Lumen');
    for (const [c, u] of [[P, 'vegacard01'], [Q, 'junocard01'], [R, 'lumencard1']]) { await c({ action: 'name', ship: 'Ship ' + u.slice(0, 4) }); await c({ action: 'save', state: { mode: 'station', done: { a: true }, cards: [{ r: 'rare', n: 'Void Vortex', u }] } }); await c({ action: 'deck', open: true }); }
    await T({ action: 't_reset', class: CODE, id: 'juno', what: 'game' });          // a copy of Juno's game, with junocard01, is kept
    await Q({ action: 'logout' }); const Q2 = await kid('Juno'); await Q2({ action: 'save', state: { mode: 'station', done: { a: true }, cards: [{ r: 'rare', n: 'Void Vortex', u: 'junocard01' }] } }); await Q2({ action: 'deck', open: true });
    const handle = async (c, ship) => ((await c({ action: 'rivals' })).rivals || []).find(x => x.name === ship);
    let h = await handle(P, 'Ship Juno'); let b1 = await P({ action: 'battle_start', rival: h.rival, kind: 'challenge' }); await P({ action: 'battle_accept', battle: b1.battle }); await P({ action: 'battle_end', battle: b1.battle, result: 'won' });
    bk = (await T({ action: 't_backups', class: CODE, id: 'juno' })).backups; const n = bk.findIndex(b => b.why === 'before you cleared it'); await T({ action: 't_restore', class: CODE, id: 'juno', n });
    const book = async c => (((await c({ action: 'load' })).state || {}).cards || []).map(x => x.u);
    ok(!(await book(Q2)).includes('junocard01') && (await book(P)).includes('junocard01'), 'after a copy is brought back, the card Juno lost stays with Vega', [await book(Q2), await book(P)]);
    // 6. many wrong teacher passwords at once
    const thieves = Array.from({ length: 30 }, () => client()); await Promise.all(thieves.map(t => t({ action: 't_login', password: 'wrong-guess' })));
    r = await client()({ action: 't_login', password: 'orbit-teacher-77' }); ok(r.status === 429, '30 wrong passwords sent at once still lock the door (only five were tried)', r.status);
    const tj = JSON.parse(fs.readFileSync(path.join(DATA, 'teacher.json'), 'utf8')); tj.locked_until = 0; tj.tries = 0; fs.writeFileSync(path.join(DATA, 'teacher.json'), JSON.stringify(tj));      /* the teacher waits ten minutes */
    // 7. a log cut in the middle of a letter
    h = await handle(R, 'Ship Vega'); b1 = await R({ action: 'battle_start', rival: h.rival, kind: 'friendly' }); await R({ action: 'battle_end', battle: b1.battle, result: 'tie', log: 'a' + '—'.repeat(9000) });
    const T2 = client(); const tl = await T2({ action: 't_login', password: 'orbit-teacher-77' }); ok(tl.ok, 'after the lock, the teacher logs in again', tl); r = await T2({ action: 't_battles', class: CODE });
    ok(r.ok && r.done.length >= 2 && r.text.length > 0, 'a long log in letters of more than one byte does not empty the teacher\'s battle list', [r.status, r.text.length]);
    // 8. a code that starts with 0
    await T2({ action: 't_set', class: CODE, codes: { calib: '0420' } }); ok((await P({ action: 'code', task: 'calib', code: '0420' })).right === true && (await P({ action: 'code', task: 'calib', code: '420' })).right === true, 'a code that starts with 0 can be passed, typed with or without the 0');
    ok((await P({ action: 'code', task: 'calib', code: '421' })).right === false, 'and a wrong one is still wrong');
    // 9. a battle ended after its time
    fs.writeFileSync(EXTRA, JSON.stringify({ battle_minutes: 0.05 })); h = await handle(R, 'Ship Vega'); b1 = await R({ action: 'battle_start', rival: h.rival, kind: 'challenge' });
    await R({ action: 'battle_accept', battle: b1.battle }); await sleep(4600); const before = [await book(R), await book(P)].join('|');
    r = await R({ action: 'battle_end', battle: b1.battle, result: 'won' }); fs.writeFileSync(EXTRA, '{}');
    ok(r.ok && JSON.parse(r.text).status === 'too late' && !r.moved && [await book(R), await book(P)].join('|') === before, 'a battle ended after its time moves nothing, and says so', r);
    // 10. a cleared game starts with no cards
    await T2({ action: 't_reset', class: CODE, id: 'vega', what: 'game' }); await P({ action: 'logout' }); const P2 = await kid('Vega');
    r = await P2({ action: 'save', state: { mode: 'intro', done: {}, cards: [] } }); ok(r.ok && !(r.cards && r.cards.length), 'a cleared game starts with no cards (won cards do not come back into it)', r.cards);
    // 11. the same first name
    r = await client()({ action: 'join', class: CODE, name: 'Nova', pin: '9999' }); ok(r.status === 403 && /add a letter to your name, like Nova B/.test(r.error), 'a second Nova is told to add a letter', r.error);
    // 12. a game too deep to read back
    let deep = '{}'; for (let i = 0; i < 520; i++) deep = '{"a":' + deep + '}';
    const F = await kid('Tycho'); r = await F(null, `{"action":"save","state":${deep}}`); ok(r.status === 400, 'a game nested too deep to read back is refused', [r.status, r.error]);
    ok((await F({ action: 'load' })).ok, 'and the cadet can still load their game');
    ok((await client()({ action: 'join', class: CODE, name: 'Tycho', pin: '0000' })).status === 403, 'nobody can take the name over');
    // 13. the probe, for a data folder inside the API's folder
    fs.writeFileSync(EXTRA, JSON.stringify({ data_dir: path.join(WEB, 'api', 'data') })); await sleep(300); r = await client()({ action: 'health' });      /* the default place: api/data */
    ok(r.data_inside_web && /\/api\/data\/probe\.txt$/.test(r.probe_url), 'with the data folder inside the API, the server check probes it from the web', [r.data_inside_web, r.probe_url]);
    if (r.probe_url) { const pr = await fetch(`http://127.0.0.1:${PORT}${r.probe_url}`); ok(pr.ok && (await pr.text()) === r.probe_word, 'and (on PHP\'s small server, which ignores .htaccess) the probe is readable, so the Desk would show it in red'); }
  } finally { srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('RESULT:', bad.length ? 'FAIL' : 'PASS'); process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
