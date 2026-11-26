// The game as it is today (prototypes/kis_station_sketch.html, not yet wired for server 0.2), against server 0.2, in a real browser.
// On this machine only. One made-up cadet on two devices. It checks that nothing is lost, and records what the cadet sees,
// so the main thread knows which words to change when it wires the game (proposals/GMQ_Server_Wiring_v1_2026-11-26.md).
//   1. iPad A plays and saves. A phone (B) logs in with the same name and gets the game. B plays on.
//   2. A wakes up and saves its older game: the server keeps B's. (Today A's bar says "not saved yet: no connection".)
//   3. A reloads: still not saved over B's game. Log out and in on A: A gets the newest game.
//   4. The teacher clears the game while B is open: B cannot save its old game over it. The teacher brings the copy back.
//   5. Closing the browser and opening the game again: log in, and the game is there.
// Run: node checks/server_game_test.js
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqgame-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9950 + Math.floor(Math.random() * 40), URL = `http://127.0.0.1:${PORT}`;
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA); fs.copyFileSync(process.env.GAME ? path.resolve(process.env.GAME) : path.join(ROOT, 'prototypes', 'kis_station_sketch.html'), path.join(WEB, 'play.html'));      /* GAME=docs/index.html tries the class link's copy */
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'ai' => ['provider' => '']];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const bad = [], errs = [], seen = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
let tc = ''; const T = async body => { const r = await fetch(URL + '/api/gmq-world-api.php', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: tc }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) tc = sc.split(';')[0]; return r.json(); };
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900)); const b = await chromium.launch();
  try {
    await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend 3C' })).code;
    const device = async (w, h) => { const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true }), p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
      p.on('console', m => { if (m.type() === 'error' && !/40[1349]|Failed to load resource/.test(m.text())) errs.push(m.text()); });
      await p.addInitScript(() => { window.GMQ_NO_PV = true; try { ['gmq-cards', 'gmq-hazards', 'gmq-flyin', 'gmq-rats'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } catch (e) {} });
      await p.goto(URL + '/play.html'); await p.waitForTimeout(800); return { ctx, p }; };
    const login = async (p, name, pin) => { await p.fill('#lc', CODE); await p.fill('#ln', name); await p.fill('#lp', pin); await p.click('#try'); await p.waitForTimeout(1300); };
    const push = async p => { await p.evaluate(() => { save(); netPush(true); }); await p.waitForTimeout(700); return p.textContent('#netstate'); };
    const server = async () => { const c = await T({ action: 't_class', class: CODE }); return (c.cadets || [])[0] || {}; };
    // ---- 1
    const A = await device(820, 1180); await login(A.p, 'Nova', '2468'); await A.p.evaluate(() => { skipIntro(); S.secrets.push('wrench'); S.inv.push('wrench'); });
    ok((await push(A.p)) === 'saved', 'iPad A saves'); ok((await server()).summary.secrets === 1, 'the server has A\'s game');
    const B = await device(390, 760); await login(B.p, 'nova', '2468');
    ok(await B.p.evaluate(() => S.secrets.includes('wrench')), 'the phone gets the same game');
    await B.p.evaluate(() => { S.secrets.push('fruit'); S.secrets.push('gem'); }); ok((await push(B.p)) === 'saved', 'the phone saves its newer game'); ok((await server()).summary.secrets === 3, 'the server has the phone\'s game');
    // ---- 2
    const said = await push(A.p); seen.push(`iPad A, after the phone logged in, when it saves: its bar says "${said}"`);
    ok((await server()).summary.secrets === 3, 'the older iPad does not write its old game over the newer one');
    // ---- 3
    await A.p.reload(); await A.p.waitForTimeout(1000); const s3 = await A.p.evaluate(() => ({ login: !!(widget && widget.kind === 'login'), secrets: S.secrets.length }));
    seen.push(`iPad A, reloaded: ${s3.login ? 'it asks who is flying' : 'it opens its own older game (' + s3.secrets + ' secrets)'}, and its next save says "${await push(A.p)}"`);
    ok((await server()).summary.secrets === 3, 'after a reload, the older iPad still cannot write over the newer game');
    await A.p.click('#netout'); await A.p.waitForTimeout(1200); await login(A.p, 'Nova', '2468');
    ok(await A.p.evaluate(() => S.secrets.length === 3), 'log out and in on the older iPad: it gets the newest game');
    ok((await push(A.p)) === 'saved', 'and now it saves');
    seen.push(`the phone, now that iPad A has logged in again, when it saves: "${await push(B.p)}"`);
    // ---- 4
    await T({ action: 't_reset', class: CODE, id: 'nova', what: 'game' });
    await B.p.evaluate(() => { S.secrets.push('star'); }); const s4 = await push(B.p); seen.push(`a device that was open when the teacher cleared the game, when it saves: "${s4}"`);
    let row = await server(); ok(!row.summary, 'an iPad that was open cannot write its old game over a game the teacher cleared', row.summary);
    const copies = await T({ action: 't_backups', class: CODE, id: 'nova' }), cl = copies.backups.find(c => c.why === 'before you cleared it');
    ok(cl && cl.summary.secrets === 3, 'the cleared game is kept as a copy', copies.backups);
    const kept = copies.backups.find(c => c.why === 'from another iPad, not kept'); ok(kept && kept.summary.secrets === 4, 'the game the open device could not save is kept as a copy too (it holds one more secret)', copies.backups.map(c => c.why));
    await T({ action: 't_restore', class: CODE, id: 'nova', n: cl ? cl.n : 0 }); row = await server(); ok(row.summary && row.summary.secrets === 3, 'the teacher brings it back');
    await A.p.click('#netout'); await A.p.waitForTimeout(1200); await login(A.p, 'Nova', '2468'); ok(await A.p.evaluate(() => S.secrets.length === 3), 'log out and in: the copy that was brought back is the game');
    // ---- 5
    await A.ctx.close(); await B.ctx.close(); const C = await device(1180, 745);
    ok(await C.p.evaluate(() => widget && widget.kind === 'login'), 'a fresh browser asks who is flying');
    await login(C.p, 'Nova', '2468'); ok(await C.p.evaluate(() => S.secrets.length === 3 && S.mode === 'station'), 'and the game is there');
  } finally { await b.close(); srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const s of seen) console.log('  SEEN', s);
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('page errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); process.exit(!bad.length && !errs.length ? 0 : 1);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
