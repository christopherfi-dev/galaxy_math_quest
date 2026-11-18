// The sketch playing against the world server, in a real browser, on this machine only. It never touches Marc's live server.
// One cadet on an iPad-sized screen and the same cadet on a phone-sized screen; the teacher through the API.
//   - with a server beside it, the page asks who is flying, and hides the teacher's bar
//   - a new cadet starts a fresh game; the game is saved to the server and arrives on a second device
//   - a real-life task is passed with the code the SERVER holds, and the teacher can change it
//   - a ship name waits for the teacher, then appears
//   - a line the game does not understand is answered by the (stand-in) AI, and a bad AI reply never reaches the child
//   - logging out clears the device for the next child
// Run: node checks/world_online_test.js
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqweb-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 8900 + Math.floor(Math.random() * 90), URL = `http://127.0.0.1:${PORT}`;
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA); fs.copyFileSync(path.join(ROOT, 'prototypes', 'kis_station_sketch.html'), path.join(WEB, 'play.html'));
const MOCK = path.join(TMP, 'mock.txt'); fs.writeFileSync(MOCK, 'Nothing.');
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'constraint_file' => ${JSON.stringify(path.join(ROOT, 'engines', 'gmq-world', 'constraints', 'gmq-world.txt'))}, 'ai' => ['provider' => 'mock', 'mock_file' => ${JSON.stringify(MOCK)}]];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const bad = [], errs = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra) : '')); };
let tcookie = ''; const teacher = async body => { const r = await fetch(URL + '/api/gmq-world-api.php', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: tcookie }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) tcookie = sc.split(';')[0]; return r.json(); };
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900)); const b = await chromium.launch();
  try {
    await teacher({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await teacher({ action: 't_new_class', name: '3B' })).code;
    const open = async (w, h) => { const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true }), p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/401|403|404|Failed to load resource/.test(m.text())) errs.push(m.text()); });
      await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); } catch (e) {} }); await p.goto(URL + '/play.html'); await p.waitForTimeout(700); return p; };
    const login = async (p, name, pin) => { await p.fill('#lc', CODE); await p.fill('#ln', name); await p.fill('#lp', pin); await p.click('#try'); await p.waitForTimeout(1200); };
    const last = p => p.evaluate(() => lines.length ? lines[lines.length - 1].text || '' : ''), say = async (p, t) => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(700); return last(p); };
    const saved = async p => { await p.evaluate(() => { save(); netPush(true); }); await p.waitForFunction(() => $('netstate').textContent === 'saved', null, { timeout: 8000 }).catch(() => bad.push('the game was not saved to the server')); };
    // ---- device 1
    const A = await open(820, 1180);
    ok(await A.evaluate(() => NET.found && !NET.on && widget && widget.kind === 'login' && !$('toy').hidden), 'with a server beside it, the page asks who is flying');
    ok(await A.evaluate(() => getComputedStyle(document.querySelector('.tbar')).display === 'none'), 'the teacher bar is hidden from cadets');
    await A.fill('#cmd', 'look ship'); await A.press('#cmd', 'Enter'); ok(await A.evaluate(() => widget && widget.kind === 'login'), 'nothing can be played behind the log in');
    await login(A, 'Poop Head', '1234'); ok(/own name/.test(await A.textContent('#msg')), 'a rude name is refused at log in', await A.textContent('#msg'));
    await login(A, 'Mia', '48'); ok(/4 digits/.test(await A.textContent('#msg')), 'a short secret number is refused');
    await login(A, 'Mia', '4821'); let st = await A.evaluate(() => ({ on: NET.on, name: $('netname').textContent, bar: !$('netbar').hidden, mode: S.mode, cards: S.cards.length }));
    ok(st.on && st.name === 'Mia' && st.bar && st.mode === 'intro' && st.cards === 0, 'a new cadet is logged in with a fresh game', st);
    await A.evaluate(() => { skipIntro(); S.secrets.push('wrench'); S.inv.push('wrench'); }); await A.waitForTimeout(300);
    // a ship name waits for the teacher
    ok(/You ask for the name Star Comet\. Your Commander will look at it/.test(await say(A, 'name ship star comet')), 'a new ship name waits for the Commander', await last(A)); ok((await A.evaluate(() => S.ship)) === '', 'the name is not on the hull yet');
    ok(/paint will not stick|Kind words/.test(await say(A, 'name ship sh it')), 'a rude ship name is refused');
    // a real-life task, with the code the server holds
    await A.evaluate(() => startSlip('calib')); await A.waitForTimeout(200); await A.fill('#ans', '111'); await A.click('#try'); await A.waitForTimeout(600); ok(/not the code/.test(await A.textContent('#msg')), 'a wrong code is refused by the server'); ok(!(await A.evaluate(() => S.done.calib)), 'a wrong code passes nothing');
    await teacher({ action: 't_set', class: CODE, codes: { calib: 5150 } }); await A.fill('#ans', '805'); await A.click('#try'); await A.waitForTimeout(600); ok(!(await A.evaluate(() => S.done.calib)), 'the code in the old page no longer works once the teacher has changed it');
    await A.fill('#ans', '5150'); await A.click('#try'); await A.waitForTimeout(800); ok(await A.evaluate(() => !!S.done.calib), 'the teacher\'s new code passes the task', await last(A));
    // the AI answers what the game does not know, and a bad reply never reaches the child
    fs.writeFileSync(MOCK, 'You lick the wall. It tastes of cold metal. Your tongue tingles.'); ok((await say(A, 'lick the wall')) === 'You lick the wall. It tastes of cold metal. Your tongue tingles.', 'the AI answers an unexpected line', await last(A));
    fs.writeFileSync(MOCK, 'Well done! The answer is 42. You win a gold card.'); ok(/does not know that yet/.test(await say(A, 'hug the robot please now')), 'a bad AI reply is replaced by the game\'s own words', await last(A));
    fs.writeFileSync(MOCK, 'The unicorn is not here. Only crates and your ship.'); ok(/unicorn is not here/.test(await say(A, 'look unicorn')), 'a thing that is not there is answered by the AI too', await last(A));
    await saved(A);
    // ---- device 2: the same cadet
    const B = await open(390, 760); await login(B, 'Mia', '0000'); ok(/not the secret number/.test(await B.textContent('#msg')), 'a wrong secret number is refused on a second device');
    await login(B, 'mia', '4821'); st = await B.evaluate(() => ({ on: NET.on, mode: S.mode, wrench: S.secrets.includes('wrench'), calib: !!S.done.calib, cards: S.cards.length, ship: S.ship }));
    ok(st.on && st.mode === 'station' && st.wrench && st.calib && st.cards >= 1 && st.ship === '', 'the second device gets the same game', st);
    // the teacher approves the name; it reaches both devices at their next save
    const cls = await teacher({ action: 't_class', class: CODE }); ok(cls.cadets.length === 1 && cls.cadets[0].ship.wants === 'Star Comet' && cls.cadets[0].summary.tasks === 1 && cls.cadets[0].codes_ok.includes('calib'), 'the teacher sees the cadet, the waiting name and the passed code', cls.cadets[0]);
    await teacher({ action: 't_name', class: CODE, id: 'mia', ok: true }); await saved(B); ok((await B.evaluate(() => S.ship)) === 'Star Comet' && /Your Commander said yes/.test(await last(B)), 'the approved name is painted on the ship', await last(B));
    await B.reload(); await B.waitForTimeout(900); st = await B.evaluate(() => ({ on: NET.on, ship: S.ship, login: !!(widget && widget.kind === 'login') })); ok(st.on && !st.login && st.ship === 'Star Comet', 'after a reload the cadet is still logged in, with the game', st);
    // logging out clears the device for the next child
    await B.click('#netout'); await B.waitForTimeout(1200); st = await B.evaluate(() => ({ login: !!(widget && widget.kind === 'login'), on: NET.on, local: localStorage.getItem(KEY), ship: S.ship, secrets: S.secrets.length })); ok(st.login && !st.on && st.ship === '' && st.secrets === 0, 'after log out the device holds nobody\'s game', st);
    await login(B, 'Tao', '1357'); st = await B.evaluate(() => ({ on: NET.on, name: $('netname').textContent, secrets: S.secrets.length })); ok(st.on && st.name === 'Tao' && st.secrets === 0, 'another child gets their own fresh game on that device', st);
    // the sketch on its own (no server asked for) still plays as before
    const C = await (await b.newContext()).newPage(); await C.goto('file://' + path.join(ROOT, 'prototypes', 'kis_station_sketch.html')); await C.waitForTimeout(500); ok(await C.evaluate(() => !NET.found && !NET.on && $('netbar').hidden && getComputedStyle(document.querySelector('.tbar')).display !== 'none'), 'the sketch by itself does not look for a server');
  } finally { await b.close(); srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('page errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL');
})().catch(e => { console.error('FAILED', e.message.split('\n')[0], '| at', (String(e.stack).match(/world_online_test.js:\d+:\d+/) || [''])[0]); process.exit(1); });
