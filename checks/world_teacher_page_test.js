// The Commander's Desk (engines/gmq-world/server/teacher.html), in a real browser, on this machine only.
//   - log in, make a class, see its code; a cadet joins and saves; the teacher sees them, approves a ship name, changes a code, gives a new secret number
// Run: node checks/world_teacher_page_test.js [folder for a screenshot]
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqdesk-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9100 + Math.floor(Math.random() * 90), URL = `http://127.0.0.1:${PORT}`;
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA);
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}];`); execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const bad = [], errs = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra) : '')); };
let cookie = ''; const cadet = async body => { const r = await fetch(URL + '/api/gmq-world-api.php', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0]; return r.json(); };
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900)); const b = await chromium.launch();
  try {
    const p = await (await b.newContext({ viewport: { width: 1100, height: 800 } })).newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept(d.type() === 'prompt' ? '2468' : undefined));
    await p.goto(URL + '/teacher.html'); await p.waitForTimeout(400); ok(await p.isVisible('#login') && !(await p.isVisible('#classes')), 'the desk asks for the teacher password first');
    await p.fill('#pw', 'wrong'); await p.click('#loginform button'); await p.waitForTimeout(400); ok(/not the teacher password/.test(await p.textContent('#loginmsg')), 'a wrong password is refused');
    await p.fill('#pw', 'orbit-teacher-77'); await p.click('#loginform button'); await p.waitForTimeout(500); ok(await p.isVisible('#classes'), 'the teacher is in');
    await p.fill('#newname', '3B Comets'); await p.click('#newclass button'); await p.waitForTimeout(600); const code = (await p.textContent('#classcode')).trim().toLowerCase(); ok(/^[a-z2-9]{5}$/.test(code) && (await p.textContent('#classname')) === '3B Comets', 'a new class shows its code', code);
    ok(/No cadets have joined yet/.test(await p.textContent('#cadets')), 'an empty class says so'); ok((await p.inputValue('#codes input[data-k="calib"]')) === '805', 'the codes for the real-life tasks are shown to the teacher');
    // a cadet joins, saves a game, passes a code and asks for a ship name
    await cadet({ action: 'join', class: code, name: 'Mia', pin: '4821' }); await cadet({ action: 'save', state: { mode: 'planet', done: { battle: true, grid: true }, parts: [], cards: [1, 2], secrets: [], v: { day: 2, hist: [{ mood: 300, actual: 1000 }] }, trade: { gems: 2000, best: 0 } } }); await cadet({ action: 'code', task: 'target', code: '936' }); await cadet({ action: 'name', ship: 'Star Comet' });
    await p.click('#refresh'); await p.waitForTimeout(500); let row = (await p.textContent('#cadets')).replace(/\s+/g, ' ');
    ok(/Mia/.test(row) && /2 of 15 tasks/.test(row) && /Worse off · day 2/.test(row) && /2,000 gems/.test(row) && /Target Practice/.test(row) && /wants: Star Comet/.test(row), 'the class view shows the cadet', row);
    if (process.argv[2]) await p.screenshot({ path: path.join(process.argv[2], 'desk.png') });
    await p.click('#cadets button[data-a="yes"]'); await p.waitForTimeout(500); row = (await p.textContent('#cadets')).replace(/\s+/g, ' '); ok(/Star Comet/.test(row) && !/wants:/.test(row), 'Approve puts the name on the ship', row); ok((await cadet({ action: 'load' })).ship.name === 'Star Comet', 'the cadet gets the approved name');
    await p.fill('#codes input[data-k="target"]', '1212'); await p.selectOption('#names', 'auto'); await p.click('#savecodes'); await p.waitForTimeout(500); ok((await cadet({ action: 'code', task: 'target', code: '1212' })).right === true, 'a code changed on the desk works for the cadet'); ok((await cadet({ action: 'name', ship: 'Blue Fox' })).status === 'ok', 'names can be set to be accepted at once');
    await p.click('#cadets button[data-a="number"]'); await p.waitForTimeout(500); cookie = ''; ok((await cadet({ action: 'join', class: code, name: 'Mia', pin: '2468' })).ok, 'a new secret number from the desk works'); cookie = ''; ok(!(await cadet({ action: 'join', class: code, name: 'Mia', pin: '4821' })).ok, 'the old secret number stops working');
    await p.click('#cadets button[data-a="game"]'); await p.waitForTimeout(500); ok(/not started|never/.test((await p.textContent('#cadets'))), 'Clear game empties the cadet\'s game'); await p.click('#cadets button[data-a="remove"]'); await p.waitForTimeout(500); ok(/No cadets have joined yet/.test(await p.textContent('#cadets')), 'Remove takes the cadet out of the class');
    await p.reload(); await p.waitForTimeout(500); ok(await p.isVisible('#classes') && !(await p.isVisible('#login')), 'after a reload the teacher is still logged in');
  } finally { await b.close(); srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t); console.log('page errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL');
})().catch(e => { console.error('FAILED', e.message.split('\n')[0], '| at', (String(e.stack).match(/world_teacher_page_test.js:\d+:\d+/) || [''])[0]); process.exit(1); });
