// The game, wired for server 0.3 by engines/gmq-world/wiring/net_v03.js, played against the server in a real browser.
// The changes are made to a COPY of prototypes/kis_station_sketch.html; the game file itself is never touched.
// On this machine only. Made-up cadets only. One cadet on an iPad (A) and a phone (B); a classmate through the API.
//   1. the changes fit the game exactly (each old text found once), and the wired copy passes the parse check
//   2. every card gets its own mark
//   3. A saves after B logged in: A says "Your game is open on another iPad." and stops; "Bring it here" brings the newest game
//   4. a device that reloads takes the server's game when it is newer, and asks at once if another device holds it
//   5. the teacher clears the game, then brings back a copy: the open device takes each, and says "Your Commander changed your game."
//   6. a classmate's challenge: the card that left leaves the book, the card that came arrives, and the news is said once
//   7. pictures of the "another iPad" box at iPad and phone size; no page errors
// Run: node checks/server_wiring_test.js       Pictures go to $SHOTS (default: the system's temp folder, gmq_server_shots/)
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqwire-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9600 + Math.floor(Math.random() * 90), URL = `http://127.0.0.1:${PORT}`;
const SHOTS = process.env.SHOTS || path.join(os.tmpdir(), 'gmq_server_shots'); fs.mkdirSync(SHOTS, { recursive: true });
const bad = [], errs = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA);
const GAME = process.env.GAME ? path.resolve(process.env.GAME) : path.join(ROOT, 'prototypes', 'kis_station_sketch.html');
const wired = require(path.join(ROOT, 'engines', 'gmq-world', 'wiring', 'apply.js'))(fs.readFileSync(GAME, 'utf8'));
wired.bad.forEach(b => bad.push('the changes do not fit the game: ' + b));
if (!wired.bad.length) { fs.writeFileSync(path.join(WEB, 'play.html'), wired.text);
  const pc = (() => { try { return execFileSync('node', [path.join(__dirname, 'parse_check.js'), path.join(WEB, 'play.html')]).toString(); } catch (e) { return String(e.stdout || e.message); } })(); ok(/RESULT: PASS/.test(pc), 'the wired copy passes the parse check', pc.slice(-200)); }
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'ai' => ['provider' => '']];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
const api = () => { let c = ''; return async body => { const r = await fetch(URL + '/api/gmq-world-api.php', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: c }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) c = sc.split(';')[0]; const j = await r.json().catch(() => ({})); j.status = r.status; return j; }; };
(async () => {
  if (wired.bad.length) { for (const t of bad) console.log('  PROBLEM', t); console.log('RESULT: FAIL'); process.exit(1); }
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900)); const b = await chromium.launch();
  try {
    const T = api(); await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend 3C' })).code; await T({ action: 't_set', class: CODE, names: 'auto', battles: 'swap' });
    const dev = async (w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: true })).newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/40[1349]|Failed to load resource/.test(m.text())) errs.push(m.text()); });
      await p.addInitScript(() => { window.GMQ_NO_PV = true; try { ['gmq-cards', 'gmq-hazards', 'gmq-flyin', 'gmq-rats'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } catch (e) {} });
      await p.goto(URL + '/play.html'); await p.waitForTimeout(900); return p; };
    const login = async (p, name, pin) => { await p.fill('#lc', CODE); await p.fill('#ln', name); await p.fill('#lp', pin); await p.click('#try'); await p.waitForTimeout(1400); };
    const push = async p => { await p.evaluate(() => { save(); netPush(true); }); await p.waitForTimeout(900); };
    const st = p => p.evaluate(() => ({ on: NET.on, w: widget && widget.kind, bar: $('netstate').textContent, secrets: S.secrets.slice(), cards: S.cards.map(c => c.u), mode: S.mode, toy: $('toy').hidden ? '' : $('toy').innerText }));
    const said = p => p.evaluate(() => lines.map(l => l.text || '').join(' | '));
    const server = async () => (await T({ action: 't_class', class: CODE })).cadets.find(c => c.name === 'Nova') || {};
    // ---- 2. marks
    const A = await dev(820, 1180); await login(A, 'Nova', '1357');
    await A.evaluate(() => { skipIntro(); card('rare'); card('gold'); card('common'); S.secrets.push('wrench'); }); await push(A);
    let a = await st(A); ok(a.bar === 'saved' && a.cards.length === 3 && a.cards.every(u => /^[a-z2-9]{8}$/.test(u || '')), 'every card has its own mark, and the game is saved', a);
    // ---- 3. another device
    const B = await dev(390, 760); await login(B, 'Nova', '1357'); ok((await st(B)).secrets.includes('wrench'), 'the phone gets the game');
    await A.evaluate(() => { S.secrets.push('stale'); }); await push(A); a = await st(A);
    ok(a.w === 'moved' && /Your game is open on another iPad\./.test(a.toy) && a.bar === 'not saving here' && !a.on, 'the older iPad says the game is open on another iPad, and stops saving', a);
    ok(!/no connection/.test(a.bar), 'it no longer says "no connection"');
    await A.screenshot({ path: path.join(SHOTS, 'server_wiring_moved_ipad.png') });
    ok(!(await server()).summary.secrets || (await server()).summary.secrets === 1, 'its older game did not reach the server');
    await B.evaluate(() => { S.secrets.push('gem'); }); await push(B); ok((await server()).summary.secrets === 2, 'the phone saves');
    await A.click('#try'); await A.waitForTimeout(1800); a = await st(A);
    ok(a.on && a.secrets.includes('gem') && !a.secrets.includes('stale'), '"Bring it here" brings the newest game to the iPad', a);
    await push(B); const bb = await st(B); ok(bb.w === 'moved', 'and now the phone is the one that asks', bb);
    await B.screenshot({ path: path.join(SHOTS, 'server_wiring_moved_phone.png') });
    const where = () => B.evaluate(() => JSON.stringify([S.room, S.inv, S.secrets, S.x, S.y, typeof P !== 'undefined' ? [Math.round(P.x * 10), Math.round(P.y * 10), P.tx, P.ty, P.path && P.path.length] : null]));
    const before = await where(), saidBefore = await said(B);
    if (await B.isVisible('#cmd')) { await B.fill('#cmd', 'take crate'); await B.press('#cmd', 'Enter'); await B.waitForTimeout(400); }
    const cv = await B.$('#cv'); if (cv) { const bx = await cv.boundingBox(); if (bx) { await B.mouse.click(bx.x + bx.width * 0.3, bx.y + bx.height * 0.4); await B.waitForTimeout(600); } }
    await B.waitForTimeout(800); const after = await where();
    ok(after === before && (await st(B)).w === 'moved', 'behind the box, a tap on the picture does not walk, and nothing changes', [before, after]);
    ok((await said(B)) === saidBefore, 'and a typed command gets no answer (not "Finish this first. Or tap Leave.": there is no Leave)', (await said(B)).slice(saidBefore.length));
    await B.evaluate(() => { closeToy(); S.secrets.push('lost'); save(); }); await B.waitForTimeout(300);
    ok((await st(B)).w === 'moved', 'if another box took its place, the "another iPad" box comes back as soon as the game would save', (await st(B)).w);
    await B.evaluate(() => { S.secrets = S.secrets.filter(x => x !== 'lost'); });
    // ---- 4. reload takes a newer game, and asks at once if another device holds it
    await B.click('#try'); await B.waitForTimeout(1800); await B.evaluate(() => { S.secrets.push('star'); }); await push(B);
    await A.reload(); await A.waitForTimeout(2500); a = await st(A);
    ok(a.secrets.includes('star'), 'an iPad that reloads takes the server\'s newer game (today it keeps its older one)', a.secrets);
    ok(a.w === 'moved', 'and, since the phone holds the game, it asks at once before the child plays', a.w);
    await A.click('#try'); await A.waitForTimeout(1800); a = await st(A); ok(a.on && a.secrets.includes('star'), 'brought back to the iPad');
    // ---- 5. the teacher clears the game, then brings back a copy
    await T({ action: 't_reset', class: CODE, id: 'nova', what: 'game' }); await A.evaluate(() => { S.secrets.push('after'); }); await push(A); await A.waitForTimeout(1500); a = await st(A);
    ok(a.secrets.length === 0 && a.on, 'after the teacher clears the game, the open iPad takes the cleared game', a);
    ok(/Your Commander changed your game\./.test(await said(A)), 'and says "Your Commander changed your game."');
    const copies = (await T({ action: 't_backups', class: CODE, id: 'nova' })).backups; const n = copies.findIndex(c => c.why === 'before you cleared it');
    await T({ action: 't_restore', class: CODE, id: 'nova', n }); await push(A); await A.waitForTimeout(1500); a = await st(A);
    ok(a.secrets.includes('star') && a.on, 'a copy brought back reaches the open iPad', a.secrets);
    // ---- 6. a classmate's challenge
    await A.evaluate(() => { netCall({ action: 'name', ship: 'Red Kite' }); netCall({ action: 'deck', open: true }); }); await A.waitForTimeout(600);
    const O = api(); await O({ action: 'join', class: CODE, name: 'Orbit', pin: '2468' }); await O({ action: 'name', ship: 'Blue Fox' });
    await O({ action: 'save', state: { mode: 'station', cards: [{ r: 'rare', n: 'Void Vortex', u: 'orbitcard1' }, { r: 'gold', n: 'Nebula Nova', u: 'orbitcard2' }] }, rev: 0, caps: ['rev', 'cards'] });
    const nova = (await O({ action: 'rivals' })).rivals.find(r => r.name === 'Red Kite'); ok(!!nova, 'Nova\'s deck can be battled');
    let ch = await O({ action: 'battle_start', rival: nova.rival, kind: 'challenge' }); await O({ action: 'battle_accept', battle: ch.battle }); await O({ action: 'battle_end', battle: ch.battle, result: 'won' });
    const lost = ch.rival.stake.u; await push(A); await A.waitForTimeout(500); a = await st(A);
    ok(!a.cards.includes(lost), 'the card that left in the challenge leaves Nova\'s book on the iPad', [lost, a.cards]);
    const s1 = await said(A); ok(/Blue Fox challenged your deck and won\./.test(s1), 'the news is said in the log', s1.slice(-300));
    await push(A); ok(((await said(A)).match(/Blue Fox challenged your deck and won\./g) || []).length === 1, 'and said once only');
    ch = await O({ action: 'battle_start', rival: nova.rival, kind: 'challenge' });
    if (ch.ok) { await O({ action: 'battle_accept', battle: ch.battle }); await O({ action: 'battle_end', battle: ch.battle, result: 'lost' }); await push(A); await A.waitForTimeout(500);
      const got = await A.evaluate(u => S.cards.find(c => c.u === u), ch.you.stake.u); ok(got && got.unseen === 1 && /Your deck won it from Blue Fox/.test(got.why || ''), 'a card won by Nova\'s deck arrives in the book, with why and unseen', got); }
    else ok(false, 'a second challenge starts', ch.error);
    ok(((await T({ action: 't_class', class: CODE })).cadets.find(c => c.name === 'Nova') || {}).summary.cards === (await st(A)).cards.length, 'the iPad\'s book and the server\'s agree');
  } finally { await b.close(); srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('page errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); process.exit(!bad.length && !errs.length ? 0 : 1);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
