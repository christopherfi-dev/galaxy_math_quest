// The game on one site, the server on another: the class link (GitHub Pages) using Marc's server, with 'allow_origin' set.
// On this machine only: the page is served from http://localhost:A and the server from http://127.0.0.1:B (two different sites).
//   1. with the log-in cookie alone, the next call is refused: the browser does not send another site's cookie (Safari blocks it too)
//   2. with the log-in token the server answers ("session"), sent back in the header X-GMQ-Session, the cadet stays logged in,
//      saves, and brings the iPad's game as the first save
//   3. a made-up token is never accepted (strict mode), and a page from a third site is not allowed by the server's CORS answer
// Run: node checks/server_cross_site_test.js
const { chromium } = require('playwright'); const { spawn, execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gmqxsite-')), WEB = path.join(TMP, 'web'), PAGE = path.join(TMP, 'page'), DATA = path.join(TMP, 'data');
const PA = 9200 + Math.floor(Math.random() * 40), PB = PA + 50, ORIGIN = `http://localhost:${PA}`, API = `http://127.0.0.1:${PB}/api/gmq-world-api.php`;
fs.cpSync(path.join(ROOT, 'engines', 'gmq-world', 'server'), WEB, { recursive: true }); fs.mkdirSync(DATA); fs.mkdirSync(PAGE);
fs.writeFileSync(path.join(WEB, 'api', 'config.php'), `<?php return ['data_dir' => ${JSON.stringify(DATA)}, 'allow_origin' => ${JSON.stringify(ORIGIN)}, 'ai' => ['provider' => '']];`);
execFileSync('php', [path.join(WEB, 'tools', 'set-teacher-password.php'), 'orbit-teacher-77', DATA]);
fs.writeFileSync(path.join(PAGE, 'index.html'), `<!doctype html><meta charset="utf-8"><title>class link (pretend)</title><script>
const API = ${JSON.stringify(API)}; let TOKEN = '';
async function call(body, useToken) { const h = { 'Content-Type': 'application/json' }; if (useToken && TOKEN) h['X-GMQ-Session'] = TOKEN;
  const r = await fetch(API, { method: 'POST', headers: h, credentials: 'include', body: JSON.stringify(body) }); const j = await r.json(); j.http = r.status; if (j.session) TOKEN = j.session; return j; }
</script>`);
const bad = []; const ok = (c, what, extra) => { if (!c) bad.push(what + (extra !== undefined ? ': ' + JSON.stringify(extra).slice(0, 300) : '')); };
(async () => {
  const sa = spawn('php', ['-S', `localhost:${PA}`, '-t', PAGE], { stdio: 'ignore' }), sb = spawn('php', ['-S', `127.0.0.1:${PB}`, '-t', WEB], { stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1000)); const b = await chromium.launch();
  try {
    // the teacher makes a class (directly, same site)
    let tc = ''; const T = async body => { const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: tc }, body: JSON.stringify(body) }); const sc = r.headers.get('set-cookie'); if (sc) tc = sc.split(';')[0]; return r.json(); };
    await T({ action: 't_login', password: 'orbit-teacher-77' }); const CODE = (await T({ action: 't_new_class', name: 'Pretend 3C' })).code;
    const p = await (await b.newContext()).newPage(); await p.goto(ORIGIN + '/'); await p.waitForTimeout(300);
    // 1. cookie alone
    const one = await p.evaluate(async code => { const j = await call({ action: 'join', class: code, name: 'Nova', pin: '1357' }, false); const l = await call({ action: 'load' }, false); return { join: j.ok, session: !!j.session, load: l.http }; }, CODE);
    ok(one.join && one.session, 'the join from another site works, and answers a log-in token', one);
    ok(one.load === 401, 'with the cookie alone, the next call from another site is refused (the browser does not send it)', one);
    // 2. the token
    const two = await p.evaluate(async code => { const j = await call({ action: 'join', class: code, name: 'Orbit', pin: '2468' }, true); const l = await call({ action: 'load' }, true);
      const s = await call({ action: 'save', state: { mode: 'station', done: { calib: true }, skill: {}, cards: [{ id: 'A01', r: 'common', n: 'Spark Shot' }], packSeed: 55555 }, rev: 0, caps: ['rev', 'cards'] }, true);
      const again = await call({ action: 'load' }, true); return { join: j.ok, first: j.first, load: l.http, name: l.name, save: s.ok, cards: again.state && again.state.cards.length, done: again.state && again.state.done && again.state.done.calib }; }, CODE);
    ok(two.join && two.first === true && two.load === 200 && two.name === 'Orbit', 'with the token in the header, the cadet stays logged in from another site', two);
    ok(two.save && two.cards === 1 && two.done === true, 'and brings the iPad\'s game as the first save', two);
    // 3. a made-up token, and a third site
    const three = await p.evaluate(async () => { TOKEN = 'abcdefghijklmnopqrstuvwxyz123456'; const l = await call({ action: 'load' }, true); return l.http; });
    ok(three === 401, 'a made-up token is never accepted', three);
    const cors = await fetch(API, { method: 'OPTIONS', headers: { Origin: 'http://evil.example', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'x-gmq-session' } });
    ok(cors.headers.get('access-control-allow-origin') === ORIGIN, 'the server allows only the one site it was told about', cors.headers.get('access-control-allow-origin'));
    ok(/X-GMQ-Session/i.test(cors.headers.get('access-control-allow-headers') || ''), 'and lets that site send the token header', cors.headers.get('access-control-allow-headers'));
  } finally { await b.close(); sa.kill(); sb.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('RESULT:', bad.length ? 'FAIL' : 'PASS'); process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('FAILED', e.stack); process.exit(1); });
