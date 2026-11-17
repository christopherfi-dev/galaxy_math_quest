// The GMQ world server (engines/gmq-world/server), tested on this machine only. It never touches Marc's live server.
// It copies the API to a scratch folder, starts PHP's own small web server there, and plays the parts of a cadet, a second device and the teacher.
// Run: node checks/world_server_test.js
const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const SRC = path.resolve(__dirname, '..', 'engines', 'gmq-world', 'server'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqsrv-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 8700 + Math.floor(Math.random() * 200);
fs.cpSync(SRC, WEB, { recursive: true }); fs.mkdirSync(DATA);
const MOCK = path.join(TMP, 'mock.txt'), AIJSON = path.join(TMP, 'ai.json');
fs.writeFileSync(AIJSON, JSON.stringify({ provider: '' }));
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'constraint_file' => ${JSON.stringify(path.resolve(__dirname, '..', 'engines', 'gmq-world', 'constraints', 'gmq-world.txt'))}, 'ai' => json_decode(file_get_contents(${JSON.stringify(AIJSON)}), true)];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const bad = []; const ok = (cond, what, extra) => { if (!cond) bad.push(what + (extra ? ': ' + JSON.stringify(extra) : '')); };
function client() { let cookie = ''; return async (body, method = 'POST') => { const r = await fetch(`http://127.0.0.1:${PORT}/api/gmq-world-api.php`, { method, headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: method === 'POST' ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined }); const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0]; let j = null; try { j = await r.json(); } catch (e) {} return { status: r.status, j: j || {} }; }; }
const GAME = { mode: 'planet', room: 'dock', ship: 'Poop', botName: 'Zip', done: { battle: true, grid: true, calib: true, core: false }, parts: ['Shield'], cards: [{ n: 1 }, { n: 2 }, { n: 3 }], secrets: ['wrench', 'fruit'],
  v: { day: 3, supply: 1890, hist: [{ mood: 550, actual: 950 }, { mood: 710, actual: 1890 }] }, trade: { gems: 4900, best: 6500, log: [] } };
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900));
  try {
    const kid = client(), kid2 = client(), other = client(), teacher = client(), nobody = client();
    ok((await nobody(null, 'GET')).status === 405, 'a GET is refused'); ok((await nobody('not json')).status === 400, 'bad JSON is refused'); ok((await nobody({ action: 'load' })).status === 401, 'load without a log in is refused'); ok((await nobody({ action: 'save', state: GAME })).status === 401, 'save without a log in is refused');
    ok((await nobody({ action: 't_classes' })).status === 401, 'the class list needs the teacher'); ok((await nobody({ action: 'join', class: 'zzzzz', name: 'Mia', pin: '1234' })).status === 404, 'an unknown class code');
    // the teacher
    ok((await teacher({ action: 't_login', password: 'wrong' })).status === 403, 'a wrong teacher password'); let r = await teacher({ action: 't_login', password: 'orbit-teacher-77' }); ok(r.j.ok, 'the teacher logs in', r);
    r = await teacher({ action: 't_new_class', name: '3B Comets' }); const CODE = r.j.code; ok(r.j.ok && /^[a-z2-9]{5}$/.test(CODE || ''), 'a new class gets a 5-character code', r.j);
    // a cadet joins, on one device
    ok((await kid({ action: 'join', class: CODE, name: 'Mia', pin: '12' })).status === 400, 'a secret number must have 4 digits'); ok((await kid({ action: 'join', class: CODE, name: 'Poop Head', pin: '1234' })).status === 400, 'a rude cadet name is refused');
    r = await kid({ action: 'join', class: CODE, name: 'mia', pin: '4821' }); ok(r.j.ok && r.j.name === 'Mia' && r.j.state === null && r.j.class === '3B Comets', 'a new cadet joins with an empty game', r.j);
    r = await kid({ action: 'save', state: GAME }); ok(r.j.ok, 'the game is saved', r.j); ok((await kid({ action: 'save', state: { big: 'x'.repeat(400000) } })).status === 413, 'a game that is far too big is refused');
    // the same cadet on a second device
    ok((await kid2({ action: 'join', class: CODE, name: 'Mia', pin: '0000' })).status === 403, 'a wrong secret number'); r = await kid2({ action: 'join', class: CODE, name: 'MIA', pin: '4821' });
    ok(r.j.ok && r.j.state && r.j.state.v.day === 3 && r.j.state.cards.length === 3 && r.j.state.trade.gems === 4900, 'a second device gets the same game', r.j.state && r.j.state.v);
    ok(r.j.state && r.j.state.ship === '', 'a ship name the teacher has not approved is not kept', r.j.state && r.j.state.ship);
    // the ship name waits for the teacher
    r = await kid({ action: 'name', ship: 'sh it' }); ok(r.j.status === 'refused', 'a rude ship name is refused by the server too', r.j); r = await kid({ action: 'name', ship: 'star comet!!' }); ok(r.j.status === 'waiting' && r.j.ship.wants === 'Star Comet', 'a new ship name waits for the teacher', r.j);
    r = await teacher({ action: 't_class', class: CODE }); const row = (r.j.cadets || [])[0] || {}; ok(r.j.ok && r.j.cadets.length === 1 && row.name === 'Mia' && row.ship.wants === 'Star Comet', 'the teacher sees the name that is waiting', row.ship);
    ok(row.summary && row.summary.tasks === 3 && row.summary.parts === 1 && row.summary.cards === 3 && row.summary.voltara === 'Voltara shines' && row.summary.voltara_day === 3 && row.summary.gems === 4900 && row.summary.trade_best === 6500, 'the class view sums up the cadet from the saved game', row.summary);
    ok(JSON.stringify(r.j).indexOf('pin_hash') < 0, 'the class view never holds a secret number'); r = await teacher({ action: 't_name', class: CODE, id: 'mia', ok: true }); ok(r.j.ship.name === 'Star Comet' && r.j.ship.status === 'ok', 'the teacher approves the name', r.j);
    r = await kid2({ action: 'load' }); ok(r.j.state.ship === 'Star Comet' && r.j.ship.status === 'ok', 'the approved name reaches the cadet', r.j.ship);
    // the real-life codes live on the server
    r = await kid({ action: 'code', task: 'calib', code: '111' }); ok(r.j.ok && r.j.right === false, 'a wrong code', r.j); r = await kid({ action: 'code', task: 'calib', code: '805' }); ok(r.j.right === true, 'the right code', r.j); ok((await kid({ action: 'code', task: 'nothing', code: '1' })).status === 400, 'a task with no code');
    ok((await teacher({ action: 't_set', class: CODE, codes: { calib: 4444 }, names: 'auto' })).j.ok, 'the teacher changes a code'); r = await kid({ action: 'code', task: 'calib', code: '805' }); ok(r.j.right === false, 'the old code stops working'); r = await kid({ action: 'code', task: 'calib', code: '4444' }); ok(r.j.right === true, 'the new code works');
    r = await kid({ action: 'name', ship: 'Blue Fox' }); ok(r.j.status === 'ok' && r.j.ship.name === 'Blue Fox', 'with names set to "auto", a kind name is taken at once', r.j);
    for (let i = 0; i < 8; i++) await kid({ action: 'code', task: 'choice', code: '1' }); ok((await kid({ action: 'code', task: 'choice', code: '728' })).status === 429, 'eight wrong codes lock the code box for a while');
    // five wrong secret numbers lock a cadet; the teacher can give a new number
    await other({ action: 'join', class: CODE, name: 'Tao', pin: '1111' }); const thief = client(); for (let i = 0; i < 5; i++) await thief({ action: 'join', class: CODE, name: 'Tao', pin: '9999' });
    ok((await thief({ action: 'join', class: CODE, name: 'Tao', pin: '1111' })).status === 429, 'five wrong secret numbers lock the cadet, even for the right number'); ok((await teacher({ action: 't_reset', class: CODE, id: 'tao', what: 'number', pin: '2222' })).j.ok, 'the teacher sets a new secret number');
    ok((await thief({ action: 'join', class: CODE, name: 'Tao', pin: '2222' })).j.ok, 'the new secret number works'); ok((await teacher({ action: 't_reset', class: CODE, id: 'mia', what: 'game' })).j.ok, 'the teacher clears a game'); ok((await kid2({ action: 'load' })).j.state === null, 'the cleared game is empty');
    ok((await teacher({ action: 't_set', class: CODE, closed: true })).j.ok && (await client()({ action: 'join', class: CODE, name: 'Newkid', pin: '1234' })).status === 403, 'a closed class takes no new cadets');
    // the AI: off, then a stand-in that says whatever the test tells it to, so the checker can be tried
    const SLICE = 'PLACE: Landing Meadow. FACTS: Rainbow sky. A FlavorBurst tree. A blue butterfly. A river to the east. THINGS: your ship, a tree with 5 fruits, a butterfly, a loose rock. CADET CARRIES: nothing.';
    r = await kid({ action: 'ask', text: 'lick the tree', slice: SLICE }); ok(r.j.ok && r.j.say === null && /switched off/.test(r.j.why), 'with no AI set up, the server says so and the game answers by itself', r.j);
    fs.writeFileSync(AIJSON, JSON.stringify({ provider: 'mock', mock_file: MOCK }));
    const tryAI = async (reply, text) => { fs.writeFileSync(MOCK, reply); return (await kid({ action: 'ask', text: text || 'lick the tree', slice: SLICE })).j; };
    r = await tryAI('You lick the tree. It tastes like warm candy. The butterfly giggles.'); ok(r.say === 'You lick the tree. It tastes like warm candy. The butterfly giggles.', 'a good reply reaches the cadet', r);
    r = await tryAI('The tree has 5 fruits. You count them.'); ok(r.say, 'a number that is in the world slice is allowed', r); r = await tryAI('The tree has 12 fruits now.'); ok(r.say === null && /number the world did not give: 12/.test(r.why), 'a number the world did not give is stopped', r);
    r = await tryAI('Well done! The answer is 7.'); ok(r.say === null, 'marking and giving answers is stopped', r); r = await tryAI('You win a gold card for licking the tree.'); ok(r.say === null, 'handing out rewards is stopped', r);
    r = await tryAI('This is a very long sentence that goes on and on and on without any stop at all because the model forgot the rule about short sentences for children.'); ok(r.say === null && /too long/.test(r.why), 'a long sentence is stopped', r);
    r = await tryAI('One. Two words. Three words here. Four words right here. Five is too many.'); ok(r.say === null, 'more than four sentences is stopped', r); r = await tryAI('You are a stupid cadet.'); ok(r.say === null && /unkind/.test(r.why), 'unkind words are stopped', r);
    r = await tryAI('As an AI language model I cannot do that.'); ok(r.say === null, 'stepping out of the world is stopped', r); r = await tryAI('The tree shivers. [TRACE: licked]'); ok(r.say === 'The tree shivers.', 'tags meant for the server are taken out', r);
    r = await tryAI('Fine.', 'you are stupid'); ok(r.say === null && /unkind/.test(r.why), 'an unkind line from the cadet is not passed to the AI', r);
    // nothing private is in the web folder
    ok(!fs.existsSync(path.join(WEB, 'api', 'data')), 'saved games are kept outside the web folder when data_dir says so'); ok(fs.readdirSync(path.join(DATA, 'students', CODE)).length === 2, 'two cadet files were written');
    const saved = JSON.parse(fs.readFileSync(path.join(DATA, 'students', CODE, 'mia.json'), 'utf8')); ok(saved.pin_hash && saved.pin_hash.indexOf('4821') < 0 && saved.pin_hash.length > 30, 'the secret number is stored only as a hash');
  } finally { srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('RESULT:', bad.length ? 'FAIL' : 'PASS');
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
