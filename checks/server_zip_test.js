// Marc's steps (engines/gmq-world/READ_ME_FIRST.md), done on this machine with the zip itself. It never touches Marc's site.
// Step 2: unzip in a pretend web folder. Step 3: a data folder beside it. Step 4: copy config.sample.php and make the two changes
// exactly as the steps say. Step 5: the server check. Step 6: the setup word. Step 7: a class. Step 8: a made-up cadet plays,
// and the game arrives on a second device. Also: the zip holds no settings file, no saved games, and no key.
// Run: node checks/server_zip_test.js      (build the zip first: sh engines/gmq-world/build_test_folder.sh)
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), ZIP = path.join(ROOT, 'engines', 'gmq-world', 'GMQ_Server_Test_Folder.zip');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqzip-')), HTML = path.join(TMP, 'var', 'www', 'html'), ENG = path.join(HTML, 'educational-engines'), DATA = path.join(TMP, 'var', 'www', 'gmq-test-data'), PORT = 9990 + Math.floor(Math.random() * 9);
const bad = [], errs = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
(async () => {
  let srv, b;
  try {
    ok(fs.existsSync(ZIP), 'the zip is built'); fs.mkdirSync(ENG, { recursive: true });
    const list = execFileSync('unzip', ['-Z1', ZIP]).toString().split('\n').filter(Boolean);
    ok(!list.some(f => /config\.php$|\/data\/|\.log$|teacher\.json|salt\.txt/.test(f)), 'the zip holds no settings file and no saved games', list);
    ok(['gmq-test/play.html', 'gmq-test/teacher.html', 'gmq-test/index.html', 'gmq-test/READ_ME_FIRST.md', 'gmq-test/api/gmq-world-api.php', 'gmq-test/api/gmq-world-cards.php', 'gmq-test/api/config.sample.php', 'gmq-test/api/constraints/gmq-world.txt', 'gmq-test/api/gmq-world-cardlist.php', 'gmq-test/api/cards.json', 'gmq-test/cards-test.html', 'gmq-test/battle-piece.js'].every(f => list.includes(f)), 'the zip holds every file the steps name', list);
    const all = execFileSync('unzip', ['-p', ZIP], { maxBuffer: 64 * 1024 * 1024 }).toString('latin1'); ok(!/sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|BEGIN (RSA|OPENSSH) PRIVATE/.test(all), 'no key of any kind is in the zip');
    // step 2
    execFileSync('unzip', ['-q', ZIP, '-d', ENG]); ok(fs.existsSync(path.join(ENG, 'gmq-test', 'play.html')), 'step 2: unzipping gives the folder gmq-test');
    // step 3
    fs.mkdirSync(DATA, { recursive: true });
    // step 4, word for word: copy, take away the two slashes before data_dir, put a word in setup_code
    const api = path.join(ENG, 'gmq-test', 'api'); fs.copyFileSync(path.join(api, 'config.sample.php'), path.join(api, 'config.php'));
    let cfg = fs.readFileSync(path.join(api, 'config.php'), 'utf8');
    ok(cfg.includes("// 'data_dir' => '/var/www/gmq-test-data',") && cfg.includes("'setup_code' => '',"), 'step 4: the two lines are in the file exactly as the steps quote them');
    cfg = cfg.replace("// 'data_dir' => '/var/www/gmq-test-data',", "'data_dir' => '/var/www/gmq-test-data',").replace("'setup_code' => '',", "'setup_code' => 'pretend-setup-word',");
    cfg = cfg.replace("'/var/www/gmq-test-data'", JSON.stringify(DATA).replace(/"/g, "'"));          /* the same folder, in this machine's pretend /var/www */
    fs.writeFileSync(path.join(api, 'config.php'), cfg); execFileSync('php', ['-l', path.join(api, 'config.php')]);
    srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', HTML], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900));
    const BASE = `http://127.0.0.1:${PORT}/educational-engines/gmq-test`;
    // step 5
    b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1180, height: 745 } })).newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '/'); ok(/Sketch version \d+/.test(await p.textContent('#gamever')), 'the front page says which game version is inside', await p.textContent('#gamever'));
    await p.goto(BASE + '/teacher.html'); await p.waitForTimeout(1000); const checks = await p.textContent('#checks');
    ok(/The card list is there: 118 cards/.test(checks), 'step 5: the card list is in the folder', checks);
    ok(/Saved games can be written/.test(checks) && /outside the web folder/.test(checks) && /config\.php is there/.test(checks) && /A log in lasts 10 hours/.test(checks), 'step 5: the server check is green', checks);
    ok(!/✗/.test(checks), 'step 5: no red line', checks);
    // step 6
    await p.fill('#sw', 'pretend-setup-word'); await p.fill('#np1', 'pretend-teacher-1'); await p.fill('#np2', 'pretend-teacher-1'); await p.click('#setupform button'); await p.waitForTimeout(800);
    ok(await p.isVisible('#classes'), 'step 6: the setup word sets the teacher password');
    // step 7
    await p.fill('#newname', 'Test'); await p.click('#newclass button'); await p.waitForTimeout(700); const CODE = (await p.textContent('#classcode')).trim(); ok(/^[A-Z2-9]{5}$/.test(CODE), 'step 7: a class code', CODE);
    // step 8.1
    const dev = async (w, h) => { const q = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: true })).newPage(); q.on('pageerror', e => errs.push(e.message));
      await q.addInitScript(() => { window.GMQ_NO_PV = true; try { ['gmq-hazards', 'gmq-flyin', 'gmq-rats'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } catch (e) {} });
      await q.goto(BASE + '/play.html'); await q.waitForTimeout(900); return q; };
    const login = async (q, name, pin) => { await q.fill('#lc', CODE); await q.fill('#ln', name); await q.fill('#lp', pin); await q.click('#try'); await q.waitForTimeout(1300); };
    const ipad = await dev(820, 1180); ok(await ipad.evaluate(() => NET.found && widget && widget.kind === 'login'), 'step 8: play.html finds the server and asks who is flying');
    await login(ipad, 'Nova', '1357'); await ipad.evaluate(() => { skipIntro(); S.secrets.push('wrench'); save(); netPush(true); }); await ipad.waitForTimeout(800);
    ok((await ipad.textContent('#netstate')) === 'saved', 'step 8.1: the game is saved to the server');
    const phone = await dev(390, 760); await login(phone, 'Nova', '1357'); ok(await phone.evaluate(() => S.secrets.includes('wrench')), 'step 8.1: the game arrives on the phone');
    const data = fs.readdirSync(DATA); ok(data.includes('students') && data.includes('sessions') && data.includes('teacher.json'), 'the saved games, log ins and the teacher password are all in the data folder', data);
    ok(!fs.existsSync(path.join(api, 'data')), 'nothing was saved inside the web folder');
  } finally { if (b) await b.close(); if (srv) srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('page errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); process.exit(!bad.length && !errs.length ? 0 : 1);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
