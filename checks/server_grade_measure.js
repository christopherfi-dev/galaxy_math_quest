// A measure, not a check: how the server copes with a whole grade in one world (60 made-up cadets, the most one class allows),
// two devices each, all at once, on PHP's small server with 8 workers. On this machine only. Made-up names only.
// Each cadet saves a late-game-sized game (about 20,000 letters, 40 cards from the card list) every few moments, while
// the class card board and the list of decks to battle are read, and the teacher's class view is opened.
// It prints how long each kind of request took, and fails only if one took longer than 5 seconds or an answer was wrong.
// Run: node checks/server_grade_measure.js [cadets, default 60]
const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqgrade-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9850 + Math.floor(Math.random() * 90);
const N = Math.min(60, Number(process.argv[2] || 60));
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA); fs.copyFileSync(path.join(ROOT, 'docs', 'battle', 'cards.json'), path.join(WEB, 'api', 'cards.json'));
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'ai' => ['provider' => '']];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const LIST = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'battle', 'cards.json'), 'utf8')).cards;
const times = {}, wrong = []; let slowest = 0;
function client() { let cookie = ''; return async body => { const t0 = Date.now(); const r = await fetch(`http://127.0.0.1:${PORT}/api/gmq-world-api.php`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(body) });
  const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0]; const j = await r.json().catch(() => ({})); const ms = Date.now() - t0; (times[body.action] = times[body.action] || []).push(ms); slowest = Math.max(slowest, ms); j.status = r.status; return j; }; }
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* letters only, made up from syllables: never a child's name */
const SYL = ['ka', 'lo', 'mi', 'ru', 'ze', 'ta', 'vo', 'ni', 'pa', 'so'], made = i => (SYL[i % 10] + SYL[Math.floor(i / 10) % 10] + 'x').replace(/^./, c => c.toUpperCase());
let u = 0; const game = (i, lv) => ({ mode: 'station', level: lv, done: Object.fromEntries(Array.from({ length: Math.min(15, lv) }, (_, k) => ['t' + k, true])), secrets: ['a', 'b'],
  cards: Array.from({ length: 40 }, (_, k) => { const c = LIST[(i * 7 + k * 11) % LIST.length]; return { id: c.id, r: c.rarity === 'epic' ? 'gold' : c.rarity, n: c.name, u: 'g' + i + 'k' + k + 'zz' }; }),
  v: { day: 4, hist: Array.from({ length: 6 }, (_, k) => ({ mood: 500 + k, actual: 1500 + k, notes: 'x'.repeat(400) })) }, notes: 'y'.repeat(14000) });
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore', env: Object.assign({}, process.env, { PHP_CLI_SERVER_WORKERS: '8' }) }); await sleep(1000);
  try {
    const T = client(); await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend Grade 3' })).code;
    await T({ action: 't_set', class: CODE, names: 'auto', board: true, battles: 'friendly' });
    const kids = Array.from({ length: N }, (_, i) => ({ i, name: made(i), A: client(), B: client() }));
    await Promise.all(kids.map(async k => { await k.A({ action: 'join', class: CODE, name: k.name, pin: '1234' }); const j = await k.B({ action: 'join', class: CODE, name: k.name, pin: '1234' });
      if (!j.ok) wrong.push(k.name + ' could not log in: ' + j.error); k.rev = j.rev; await k.B({ action: 'name', ship: 'Ship ' + SYL[k.i % 10] + SYL[(k.i + 3) % 10] }); await k.B({ action: 'deck', open: true }); }));
    const t0 = Date.now();
    await Promise.all(kids.map(async k => {
      for (let lv = 1; lv <= 12; lv++) { const r = await k.B({ action: 'save', state: game(k.i, lv), rev: k.rev, caps: ['rev', 'cards'] }); if (r.ok) k.rev = r.rev; else wrong.push(k.name + ' save ' + lv + ': ' + r.status + ' ' + r.error);
        if (lv % 4 === 0) { const b = await k.B({ action: 'board' }); if (!b.ok || b.classmates !== N - 1) wrong.push(k.name + ' board: ' + b.classmates); }
        if (lv % 6 === 0) { const r2 = await k.B({ action: 'rivals' }); if (!r2.ok || r2.rivals.length !== N - 1) wrong.push(k.name + ' rivals: ' + (r2.rivals || []).length); }
        await sleep(100 + (k.i * 13) % 200); }
    }).concat([(async () => { for (let n = 0; n < 8; n++) { const c = await T({ action: 't_class', class: CODE }); if (!c.ok || c.cadets.length !== N) wrong.push('teacher view: ' + (c.cadets || []).length); await sleep(400); } })()]));
    const secs = (Date.now() - t0) / 1000, reqs = Object.values(times).reduce((a, l) => a + l.length, 0);
    const size = d => fs.readdirSync(d, { withFileTypes: true }).reduce((a, e) => a + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0);
    console.log(`  ${N} cadets, 2 devices each, ${reqs} requests in ${secs.toFixed(1)} s. Saved data on disk: ${(size(DATA) / 1e6).toFixed(1)} MB.`);
    for (const [a, l] of Object.entries(times)) { const s = l.slice().sort((x, y) => x - y), q = f => s[Math.min(s.length - 1, Math.floor(s.length * f))]; console.log(`  ${a.padEnd(10)} ${String(l.length).padStart(5)} requests: middle ${q(0.5)} ms, 95 in 100 within ${q(0.95)} ms, slowest ${s[s.length - 1]} ms`); }
  } finally { srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const w of wrong.slice(0, 20)) console.log('  PROBLEM', w);
  const fine = !wrong.length && slowest < 5000; console.log('RESULT:', fine ? 'PASS' : 'FAIL'); process.exit(fine ? 0 : 1);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
