// The cards test page (engines/gmq-world/server/cards-test.html) in a real browser, with server 0.3, the battle thread's card list
// and its battle piece (GMQBattleOwn), as the test-folder zip carries them. On this machine only. Two made-up cadets on two devices.
//   - off until the teacher turns it on; then each cadet takes a starter pack once, and opens their deck
//   - the class card board: a card the cadet has not found shows only an empty shape and a count, never its name
//   - a challenge: both cards at stake shown before agreeing; backing out moves nothing
//   - agreeing opens the battle over the whole screen (the picture shows the task)
//   - the battle's end is sent as the battle piece sends it (the battle's own play is the battle thread's test: battle_own_test.js);
//     the card at stake moves on the server, and the classmate who was away is told
//   - pictures at iPad sideways, iPad upright and phone; nothing wider than the screen
// Run: node checks/server_cards_page_test.js      Pictures go to $SHOTS (default: the system's temp folder, gmq_server_shots/)
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqcpage-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9700 + Math.floor(Math.random() * 150), URL = `http://127.0.0.1:${PORT}`;
const SHOTS = process.env.SHOTS || path.join(os.tmpdir(), 'gmq_server_shots'); fs.mkdirSync(SHOTS, { recursive: true });
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA);
fs.copyFileSync(path.join(ROOT, 'docs', 'battle', 'cards.json'), path.join(WEB, 'api', 'cards.json'));
fs.writeFileSync(path.join(WEB, 'battle-piece.js'), execFileSync('sh', [path.join(ROOT, 'engines', 'gmq-world', 'battle_piece.sh'), path.join(ROOT, 'docs', 'battle', 'own.html')], { maxBuffer: 64 * 1024 * 1024 }));
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'ai' => ['provider' => '']];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const LIST = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'battle', 'cards.json'), 'utf8')), NAMES = LIST.cards.concat(LIST.upgrades, LIST.parts).map(c => c.name);
const bad = [], errs = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
let tc = ''; const T = async body => { const r = await fetch(URL + '/api/gmq-world-api.php', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: tc }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) tc = sc.split(';')[0]; return r.json(); };
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900)); const b = await chromium.launch();
  try {
    await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend 3C' })).code;
    await T({ action: 't_set', class: CODE, names: 'auto', board: true, battles: 'swap' });
    const dev = async (w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: true })).newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/40[1349]|Failed to load resource/.test(m.text())) errs.push(m.text()); }); await p.goto(URL + '/cards-test.html'); await p.waitForTimeout(700); return p; };
    const login = async (p, name, pin) => { await p.fill('#lc', CODE); await p.fill('#ln', name); await p.fill('#lp', pin); await p.click('#loginform button'); await p.waitForTimeout(900); };
    const A = await dev(1180, 745), B = await dev(390, 760);
    await login(A, 'Nova', '1357'); await login(B, 'Orbit', '2468');
    ok(/test page is off/.test(await A.textContent('#offmsg')) && !(await A.isVisible('#take')), 'off until the teacher turns it on: no starter pack offered');
    await T({ action: 't_set', class: CODE, test_tools: true });
    for (const p of [A, B]) {
      await p.reload(); await p.waitForTimeout(900); ok(await p.isVisible('#take'), 'with the test page on, a starter pack is offered');
      await p.click('#take'); await p.waitForTimeout(900); ok((await p.locator('#mycards .card').count()) === 15 && !(await p.isVisible('#take')), 'the starter pack: 15 cards, and the offer is gone', await p.locator('#mycards .card').count());
      await p.check('#open'); await p.waitForTimeout(400); }
    // ship names: each cadet asks for one (names are accepted at once in this class)
    for (const [p, ship] of [[A, 'Red Kite'], [B, 'Blue Fox']]) { ok(await p.isVisible('#shipform'), 'a cadet with no ship name is offered the ship name box'); await p.fill('#shipname', ship); await p.click('#shipform button'); await p.waitForTimeout(900);
      ok(!(await p.isVisible('#shipform')) && (await p.textContent('#myship')).includes(ship), 'the ship name is taken (this class accepts kind names at once)', await p.textContent('#myship')); }
    await A.reload(); await A.waitForTimeout(1200); await B.reload(); await B.waitForTimeout(1200);
    // the board, seen by Nova
    const boardText = await A.textContent('#board'); const novaCards = await A.locator('#mycards .card b').allTextContents();
    const hidden = NAMES.filter(n => boardText.includes(n) && !novaCards.includes(n));
    ok(/1 classmates|1 classmate/.test(boardText) || /classmates\. Cards you have/.test(boardText), 'the board shows', boardText.slice(0, 120));
    ok(!hidden.length, 'the board never shows the name of a card Nova has not found', hidden);
    ok((await A.locator('#board .card.empty').count()) > 0, 'cards Nova has not found show as empty shapes with a count');
    ok(/Blue Fox/.test(await A.textContent('#rivals')), "Orbit's deck is on Nova's list, by ship name", await A.textContent('#rivals'));
    ok(/not your classmate's real deck/.test(await A.textContent('#foenote')), 'the page says plainly that the computer does not yet play the real deck');
    await A.screenshot({ path: path.join(SHOTS, 'server_cards_page_ipad.png'), fullPage: true });
    // a challenge, backed out
    await A.click('#rivals button[data-k="challenge"]'); await A.waitForTimeout(700);
    ok(await A.isVisible('#offer') && (await A.locator('#offer .card.stake').count()) === 2, 'both cards at stake are shown before agreeing');
    ok(/The winner gets both cards/.test(await A.textContent('#rule')), 'the rule is said in plain words');
    await A.screenshot({ path: path.join(SHOTS, 'server_cards_page_offer_ipad.png') });
    const before = (await T({ action: 't_class', class: CODE })).cadets.map(c => c.summary.cards).join();
    await A.click('#backout'); await A.waitForTimeout(600); ok(!(await A.isVisible('#offer')) && (await T({ action: 't_class', class: CODE })).cadets.map(c => c.summary.cards).join() === before, 'backing out moves nothing');
    // a challenge, agreed and won
    await A.click('#rivals button[data-k="challenge"]'); await A.waitForTimeout(700); const theirStake = (await A.textContent('#theirstake')).trim();
    await A.click('#agree'); await A.waitForTimeout(1500);
    const box = await A.evaluate(() => { const e = document.getElementById('gmqbattle'); if (!e) return null; const r = e.getBoundingClientRect(); return { w: r.width, h: r.height, W: innerWidth, H: innerHeight }; });
    ok(box && box.w >= box.W - 1 && box.h >= box.H - 1, 'agreeing opens the battle over the whole screen', box);
    await A.screenshot({ path: path.join(SHOTS, 'server_cards_page_battle_ipad.png') });
    const frame = A.frames().find(f => f !== A.mainFrame()); ok(!!frame, 'the battle runs in its own frame');
    if (frame) await frame.evaluate(() => { parent.postMessage({ gmqBattle: 'over', winner: 0, rounds: 7 }, '*'); parent.postMessage({ gmqBattle: 'close', winner: 0, rounds: 7 }, '*'); });
    await A.waitForTimeout(1200);
    ok(await A.isVisible('#resultbox') && /You won/.test(await A.textContent('#resulthead')), 'the result is shown', await A.textContent('#resultbox'));
    ok((await A.textContent('#result')).includes(theirStake.replace(/^(rare|epic)/i, '').trim().split('\n')[0].trim().slice(0, 8)), 'the card shown as won is the one Orbit put up', [await A.textContent('#result'), theirStake]);
    await A.screenshot({ path: path.join(SHOTS, 'server_cards_page_result_ipad.png') });
    const counts = (await T({ action: 't_class', class: CODE })).cadets.reduce((o, c) => { o[c.name] = c.summary.cards; return o; }, {});
    ok(counts.Nova === 16 && counts.Orbit === 14, 'the card moved on the server: Nova 16, Orbit 14', counts);
    // Orbit is told
    await B.reload(); await B.waitForTimeout(1200); ok(await B.isVisible('#newsbox') && /Red Kite challenged your deck and won/.test(await B.textContent('#news')), 'the classmate who was away is told', await B.textContent('#news'));
    await B.screenshot({ path: path.join(SHOTS, 'server_cards_page_news_phone.png'), fullPage: true });
    await B.click('#newsok'); await B.waitForTimeout(500); await B.reload(); await B.waitForTimeout(1000); ok(!(await B.isVisible('#newsbox')), 'news, once seen, is gone');
    // three screen sizes
    for (const [name, w, h] of [['ipad_sideways', 1180, 745], ['ipad_upright', 820, 1180], ['phone', 390, 760]]) {
      await A.setViewportSize({ width: w, height: h }); await A.waitForTimeout(300); const wide = await A.evaluate(() => document.documentElement.scrollWidth);
      ok(wide <= w + 1, `${name}: no wider than the screen`, wide); await A.screenshot({ path: path.join(SHOTS, `server_cards_page_${name}.png`), fullPage: true }); }
  } finally { await b.close(); srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('page errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); process.exit(!bad.length && !errs.length ? 0 : 1);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
