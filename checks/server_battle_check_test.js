// Checking who won a challenge (the server's known gap, closed with the battle thread's record and GMQBattle.replay). On this machine only.
// Made-up cadets only. Three challenges are played by a made-up child with the battle thread's own engine (prototypes/card_battle.html),
// from exactly what the server's battle_start sent, and ended with the record:
//   1. honest: the result the battle really had           -> the Desk says it checks
//   2. a false claim: the record says lost, the page says won -> the Desk says it does not match
//   3. a weakened classmate: the record's classmate deck swapped for weak cards -> the Desk says the deck is not the one the server sent
// The Desk plays each record again in a real browser, with the battle piece that is in the folder (battle-piece.js).
// Run: node checks/server_battle_check_test.js
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqbchk-')), WEB = path.join(TMP, 'web'), DATA = path.join(TMP, 'data'), PORT = 9550 + Math.floor(Math.random() * 40), URL = `http://127.0.0.1:${PORT}`;
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA);
fs.copyFileSync(path.join(ROOT, 'docs', 'battle', 'cards.json'), path.join(WEB, 'api', 'cards.json'));
fs.writeFileSync(path.join(WEB, 'battle-piece.js'), execFileSync('sh', [path.join(ROOT, 'engines', 'gmq-world', 'battle_piece.sh'), path.join(ROOT, 'docs', 'battle', 'own.html')], { maxBuffer: 64 * 1024 * 1024 }));
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'ai' => ['provider' => '']];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
// the battle thread's engine, as its own test loads it
const html = fs.readFileSync(path.join(ROOT, 'prototypes', 'card_battle.html'), 'utf8');
const CD = JSON.parse(html.match(/<script id="carddata" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const B = new Function(html.match(/\/\* ENGINE-BEGIN[\s\S]*?\/\* ENGINE-END \*\//)[0] + '\nreturn GMQBattle;')(); B.load(CD);
const STD = ['standard', 'standard', 'standard', 'standard', 'standard'], PART = {}; CD.parts.forEach(p => { PART[p.id] = 1; });
const bad = [], errs = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
const api = () => { let c = ''; return async body => { const r = await fetch(URL + '/api/gmq-world-api.php', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: c }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) c = sc.split(';')[0]; const j = await r.json().catch(() => ({})); j.status = r.status; return j; }; };
/* a made-up child plays the battle the server dealt, with the engine; the child's own choices come from its own dice, never the battle's */
let xr = 4242; const ext = () => { xr = (xr * 48271) % 2147483647; return xr / 2147483647; };
function play(st) {
  const ids = list => list.map(c => c.id).filter(id => id && !PART[id]);
  const start = { seed: st.seed, opts: B.defaults(), kinds: [STD, STD], decks: [B.ownDeck(ids(st.you.deck), st.seed, 'card').deck, B.ownDeck(ids(st.rival.deck), st.seed, 'card', null).deck], lvl2: [[], []] }, rec = [];
  const S = B.newBattle(start.opts, STD, STD, start.seed, start.decks, start.lvl2); let r = 0;
  while (!S.over && r < 80) { let a, b;
    if (S.leader === 1) { b = B.cpuPick(S, 1, null); a = Math.floor(ext() * S.P[0].hand.length); } else { a = Math.floor(ext() * S.P[0].hand.length); b = B.cpuPick(S, 1, S.P[0].hand[a]); }
    const R = { p: a, c: [] }; rec.push(R); B.startRound(S, a, b);
    B.steps(S).forEach(s => { const req = B.need(S, s); let ch = null; if (req && req.who === 0) { const T = JSON.parse(JSON.stringify(S)); T.opts.cpu = 'clever'; ch = B.cpuChoose(T, req); R.c.push(ch); } else if (req) ch = B.cpuChoose(S, req); B.run(S, s, ch); }); r++; }
  return { start, rec, result: !S.over ? null : S.over.winner === 0 ? 'won' : S.over.winner === 1 ? 'lost' : 'tie' };
}
(async () => {
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 900)); const br = await chromium.launch();
  try {
    const T = api(); await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend 3C' })).code;
    await T({ action: 't_set', class: CODE, names: 'auto', battles: 'swap', test_tools: true });
    const kid = async (name, ship) => { const c = api(); await c({ action: 'join', class: CODE, name, pin: '1357' }); await c({ action: 'name', ship }); await c({ action: 'test_starter' }); await c({ action: 'deck', open: true }); return c; };
    const ch = {}; for (const [n, sh] of [['Nova', 'Red Kite'], ['Juno', 'Gold Bee'], ['Lumen', 'Sky Whale'], ['Orbit', 'Blue Fox'], ['Pixel', 'Sun Moth'], ['Vega', 'Iron Owl']]) ch[n] = await kid(n, sh);
    const results = [];
    for (const [kind, who, ship] of [['honest', 'Nova', 'Blue Fox'], ['false claim', 'Juno', 'Sun Moth'], ['weakened', 'Lumen', 'Iron Owl']]) {      /* a fresh challenger and classmate each time, so both always have a card to put up */
      const A = ch[who], rival = (await A({ action: 'rivals' })).rivals.find(r => r.name === ship);
      const st = await A({ action: 'battle_start', rival: rival.rival, kind: 'challenge' }); ok(st.ok, 'a challenge starts', st.error); if (!st.ok) break;
      await A({ action: 'battle_accept', battle: st.battle });
      let g = play(st); for (let tries = 0; !g.result && tries < 5; tries++) g = play(st);           /* a battle that ends */
      ok(!!g.result, 'the made-up child\'s battle ends', g.rec.length);
      const record = JSON.parse(JSON.stringify({ start: g.start, rec: g.rec })); let claim = g.result;
      if (kind === 'false claim') claim = g.result === 'won' ? 'lost' : 'won';
      if (kind === 'weakened') { const weak = CD.cards.filter(c => c.type === 'repair' && c.rarity === 'common').map(c => c.id); record.start.decks[1] = record.start.decks[1].map((_, i) => weak[i % weak.length]); }
      const e = await A({ action: 'battle_end', battle: st.battle, result: claim, record }); ok(e.ok, 'the battle ends with its record', e.error);
      results.push({ kind, claim, real: g.result });
    }
    const tb = await T({ action: 't_battles', class: CODE }); ok(tb.done.filter(d => d.checkable).length === 3, 'the teacher\'s list marks three battles that can be checked', tb.done.map(d => d.checkable));
    // the Desk, in a browser
    const p = await (await br.newContext({ viewport: { width: 1180, height: 745 } })).newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL + '/teacher.html'); await p.waitForTimeout(800); await p.fill('#pw', 'orbit-teacher-77'); await p.click('#loginform button'); await p.waitForTimeout(800);
    await p.click(`#classlist button[data-c="${CODE}"]`); await p.waitForTimeout(1200);
    const btns = p.locator('#battlelist button[data-check]'); ok((await btns.count()) === 3, 'three "Check who won" buttons', await btns.count());
    const said = [];
    for (let i = 0; i < await btns.count(); i++) { await btns.nth(i).click(); await p.waitForFunction(i => { const s = document.querySelectorAll('#battlelist [data-checked]')[i]; return s && s.textContent && !/Playing it again/.test(s.textContent); }, i, { timeout: 30000 }).catch(() => {});
      said.push(await p.locator('#battlelist [data-checked]').nth(i).textContent()); }
    // the list shows the newest first: weakened, false claim, honest
    const byKind = { weakened: said[0], 'false claim': said[1], honest: said[2] };
    ok(/^✓ Checked/.test(byKind.honest || ''), 'an honest battle checks', byKind.honest);
    ok(/^✗ Does not match/.test(byKind['false claim'] || '') && /but the page said/.test(byKind['false claim']), 'a false claim does not match', byKind['false claim']);
    ok(/^✗ Does not match/.test(byKind.weakened || '') && /classmate's deck in the record is not the one the server sent/.test(byKind.weakened), 'a weakened classmate deck is found out', byKind.weakened);
    console.log('  NOTE results:', JSON.stringify(results)); console.log('  NOTE the Desk said:', JSON.stringify(said));
    await p.screenshot({ path: path.join(process.env.SHOTS || os.tmpdir(), 'server_battle_check_ipad.png'), fullPage: true });
  } finally { await br.close(); srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('page errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); process.exit(!bad.length && !errs.length ? 0 : 1);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
