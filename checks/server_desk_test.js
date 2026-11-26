// The Commander's Desk (engines/gmq-world/server/teacher.html), in a real browser, on this machine only. Made-up cadets only.
//   1. A data folder INSIDE the web folder, on a server that ignores .htaccess (PHP's own small server does): the server check
//      must say in red that anyone can read the saved games.
//   2. A data folder outside the web folder, no teacher password yet, a setup word in config.php: the check is green where it
//      should be, a wrong setup word is refused, the right one sets the password, and the class page opens.
//   3. Pretend cadets play (through the API): the class table, the sharing settings saved, an older copy brought back, the battles list.
//   4. Pictures at iPad sideways (1180x745), iPad upright (820x1180) and a phone (390x760), and nothing wider than the screen.
// Run: node checks/server_desk_test.js        Pictures go to $SHOTS (default: the system's temp folder, gmq_server_shots/)
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), SHOTS = process.env.SHOTS || path.join(os.tmpdir(), 'gmq_server_shots'); fs.mkdirSync(SHOTS, { recursive: true });
const bad = [], errs = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
function serve(dataInside, setupWord) {
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqdesk-')), WEB = path.join(TMP, 'web'), DATA = dataInside ? path.join(WEB, 'api', 'data') : path.join(TMP, 'data'), PORT = 9500 + Math.floor(Math.random() * 400);
  fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true });
  fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'setup_code' => ${JSON.stringify(setupWord)}, 'constraint_file' => ${JSON.stringify(path.join(ROOT, 'engines', 'gmq-world', 'constraints', 'gmq-world.txt'))}, 'ai' => ['provider' => '']];`);
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' });
  return { URL: `http://127.0.0.1:${PORT}`, stop: () => { srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); } };
}
const api = URL => { let cookie = ''; return async body => { const r = await fetch(URL + '/api/gmq-world-api.php', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0]; const j = await r.json().catch(() => ({})); j.status = r.status; return j; }; };
(async () => {
  const b = await chromium.launch(); let s1, s2;
  try {
    // ---- 1. saved games that anyone can read
    s1 = serve(true, 'orbit-setup-word'); await sleep(900);
    let p = await (await b.newContext({ viewport: { width: 1180, height: 745 } })).newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto(s1.URL + '/teacher.html'); await p.waitForTimeout(1200);
    const t1 = await p.textContent('#checks'); ok(/Anyone can read the saved games from the web/.test(t1), 'with the data folder open to the web, the check says so', t1);
    ok(/Do not let cadets play yet/.test(t1), 'and says not to let cadets play');
    await p.screenshot({ path: path.join(SHOTS, 'server_desk_open_data.png') }); s1.stop(); s1 = null;

    // ---- 2. a good folder, first time
    s2 = serve(false, 'orbit-setup-word'); await sleep(900);
    p = await (await b.newContext({ viewport: { width: 1180, height: 745 } })).newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/40[134]|Failed to load/.test(m.text())) errs.push(m.text()); });
    await p.goto(s2.URL + '/teacher.html'); await p.waitForTimeout(1000);
    const t2 = await p.textContent('#checks');
    ok(/Saved games can be written/.test(t2) && /outside the web folder/.test(t2) && /The AI is off/.test(t2) && /not set yet/.test(t2), 'the check is green for a good folder and says the password is not set', t2);
    ok(!/✗/.test(t2), 'no red line for a good folder', t2);
    ok(await p.isVisible('#setup') && !(await p.isVisible('#login')), 'the first-time box shows, and the log in does not');
    await p.screenshot({ path: path.join(SHOTS, 'server_desk_first_time.png') });
    await p.fill('#sw', 'wrong-word'); await p.fill('#np1', 'teacher-pass-9'); await p.fill('#np2', 'teacher-pass-9'); await p.click('#setupform button'); await p.waitForTimeout(500);
    ok(/not the setup word/.test(await p.textContent('#setupmsg')), 'a wrong setup word is refused', await p.textContent('#setupmsg'));
    await p.fill('#sw', 'orbit-setup-word'); await p.fill('#np1', 'teacher-pass-9'); await p.fill('#np2', 'teacher-pass-8'); await p.click('#setupform button'); await p.waitForTimeout(300);
    ok(/not the same/.test(await p.textContent('#setupmsg')), 'two different passwords are refused');
    await p.fill('#sw', 'orbit-setup-word'); await p.fill('#np1', 'teacher-pass-9'); await p.fill('#np2', 'teacher-pass-9'); await p.click('#setupform button'); await p.waitForTimeout(800);
    ok(await p.isVisible('#classes') && !(await p.isVisible('#setup')), 'the right setup word sets the password and opens the classes');
    ok(/The teacher password is set/.test(await p.textContent('#checks')), 'the check now says the password is set');
    const again = await api(s2.URL)({ action: 't_setup', setup_code: 'orbit-setup-word', password: 'someone-else-1' }); ok(again.status === 409, 'once set, the setup word cannot set the password again', again.status);
    await p.fill('#newname', 'Pretend 3C'); await p.click('#newclass button'); await p.waitForTimeout(700);
    const CODE = (await p.textContent('#classcode')).trim().toLowerCase(); ok(/^[a-z2-9]{5}$/.test(CODE), 'a class is made', CODE);

    // ---- 3. pretend cadets play
    const T = api(s2.URL); await T({ action: 't_login', password: 'teacher-pass-9' }); await T({ action: 't_set', class: CODE, names: 'auto', board: true, battles: 'swap' });
    const kids = ['Nova', 'Orbit', 'Pixel', 'Vega'].map((n, i) => ({ n, c: api(s2.URL), ship: ['Red Kite', 'Blue Fox', 'Sun Moth', 'Iron Owl'][i] }));
    for (const [i, k] of kids.entries()) { await k.c({ action: 'join', class: CODE, name: k.n, pin: '24' + i + '8' }); await k.c({ action: 'name', ship: k.ship });
      const cards = Array.from({ length: 6 + i }, (_, j) => ({ r: j < 4 ? 'common' : j < 6 + i - 1 ? 'rare' : 'gold', n: 'Test card ' + (j + 1), u: 'u' + i + 'x' + j + 'abcd' }));
      k.rev = (await k.c({ action: 'save', state: { mode: 'station', done: { a: 1, b: 1, c: 1, d: i }, parts: ['Shield'], cards, secrets: [] }, caps: ['rev', 'cards'] })).rev; await k.c({ action: 'deck', open: true }); }
    const riv = await kids[0].c({ action: 'rivals' }); const st = await kids[0].c({ action: 'battle_start', rival: riv.rivals[0].rival, kind: 'challenge' });
    await kids[0].c({ action: 'battle_accept', battle: st.battle }); const end = await kids[0].c({ action: 'battle_end', battle: st.battle, result: 'won' }); ok(end.ok, 'a pretend battle is played');
    await kids[2].c({ action: 'save', state: { mode: 'intro', done: {}, parts: [], cards: [], secrets: [] }, rev: (await kids[2].c({ action: 'load' })).rev, caps: ['rev', 'cards'] });   // Pixel starts a new game by mistake
    await p.click('#refresh'); await p.waitForTimeout(900);
    const table = await p.textContent('#cadets'); ok(/Nova/.test(table) && /Vega/.test(table) && /Red Kite/.test(table), 'the class table shows the pretend cadets and their ship names', table.slice(0, 200));
    ok(/rare/.test(table) && /deck open to battles/.test(table), 'the table shows cards by kind, and whose deck is open');
    ok(await p.isVisible('#battlebox') && /Nova battled/.test(await p.textContent('#battlelist')) && /moved to Nova/.test(await p.textContent('#battlelist')), 'the battles list says who battled whom, and which card moved', await p.textContent('#battlelist'));
    ok((await p.inputValue('#battles')) === 'swap' && (await p.inputValue('#board')) === '1', 'the settings show what is set');
    ok(/The winner takes both/.test(await p.textContent('#sharenote')), 'the note under the settings says what the battle setting means');
    ok(/4 cadets/.test(await p.textContent('#classlist')), 'Refresh also updates the count of cadets in the class list', await p.textContent('#classlist'));
    await p.selectOption('#battles', 'away-safe'); await p.selectOption('#show', 'ship'); ok(/never loses one/.test(await p.textContent('#sharenote')), 'the note changes with the setting');
    await p.selectOption('#testtools', '1'); ok(/made-up cadets only/.test(await p.textContent('#sharenote')), 'turning on the test page says it is for made-up cadets only');
    await p.click('#savecodes'); await p.waitForTimeout(700); const saved = (await T({ action: 't_class', class: CODE })).class; ok(saved.battles === 'away-safe' && saved.test_tools === true, 'the settings are saved', saved);
    await p.screenshot({ path: path.join(SHOTS, 'server_desk_class_ipad.png'), fullPage: true });
    // an older copy brought back
    const copyBtn = p.locator('#cadets button[data-a="copies"]'); ok((await copyBtn.count()) === 1, 'only the cadet whose game went back has older copies', await copyBtn.count());
    if (await copyBtn.count()) { await copyBtn.first().click(); await p.waitForTimeout(500); const box = await p.textContent('#copies'); ok(/before the game went back/.test(box) && /Now: 0 of 15 tasks/.test(box), 'the copies box says why each copy was kept, and what is in it', box);
      p.once('dialog', d => d.accept()); await p.click('#copies button[data-n="0"]'); await p.waitForTimeout(800);
      const back = await kids[2].c({ action: 'load' }); ok(back.state && back.state.cards.length === 8, 'the copy is the game again: its 8 cards are back', back.state && back.state.cards.length); }
    // ---- 4. three screen sizes
    for (const [name, w, h] of [['ipad_sideways', 1180, 745], ['ipad_upright', 820, 1180], ['phone', 390, 760]]) {
      await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(300);
      const cut = await p.evaluate(() => { const c = document.createElement('canvas').getContext('2d'); return [...document.querySelectorAll('.set select')].flatMap(s => { c.font = getComputedStyle(s).font; return [...s.options].filter(o => c.measureText(o.text).width + 44 > s.clientWidth).map(o => o.text); }); });
      ok(!cut.length, `${name}: no choice in the settings is cut off`, cut);      /* a menu does not say when its words run over, so the words are measured */
      const wide = await p.evaluate(() => document.documentElement.scrollWidth); ok(wide <= w + 1, `${name}: the page is no wider than the screen (tables scroll inside their box)`, wide);
      await p.screenshot({ path: path.join(SHOTS, `server_desk_${name}.png`), fullPage: true });
    }
  } finally { await b.close(); if (s1) s1.stop(); if (s2) s2.stop(); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('page errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); process.exit(!bad.length && !errs.length ? 0 : 1);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
