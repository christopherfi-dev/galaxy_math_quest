// No secret is needed to finish the KIS Station.   [Marc, 2026-11-21: "a secret in the space station should not be mandatory or anything you must find to pass the major quests"]
//
// A fresh cadet with an empty bag and no secrets found:
//   - every one of the 15 task objects can be walked to, in a sensible order (the Power Bay opens after Cargo Load, the Launch Bay after the Navigation part)
//   - with the 15 tasks done, the cadet walks to the Launch Bay and launches
//   - at lift-off the bag is still empty and no secret has been found
// It also checks the dark passage: until the switch behind the poster is on, no square past the gap can be walked on.
// The tasks themselves are not played here (station_playthrough_test.js plays them). Their results are set, one by one, only once the cadet can reach them.
//
// Run:  node checks/no_secret_needed_test.js     Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(), bad = [], errs = [], p = await b.newPage({ viewport: { width: 1180, height: 745 } });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.GMQ_NO_PV = true; try { localStorage.clear(); localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-words', 'open'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} });
  await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(400);
  await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); }); await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const out = { order: [], stuck: [], dark: [] }, here = () => [Math.round(P.x), Math.round(P.y)];
    const reach = id => { const o = OBJ[id], ts = objTiles(id), g = o.stand ? (x, y) => x === o.stand[0] && y === o.stand[1] : (x, y) => ts.some(t => Math.abs(t[0] - x) + Math.abs(t[1] - y) <= (o.block ? 1 : 0)); return path(here()[0], here()[1], g) !== null; };
    // the dark passage: open the gap (a secret), but not the lights
    S.gap = true; for (let y = 0; y < G.length; y++) for (let x = 0; x < G[0].length; x++) { const c = G[y][x]; if ((c.room === 'tunnel' && !(x === 15 && y === 14)) || c.room === 'store') { if (walkable(x, y)) out.dark.push(`${x},${y}`); } }
    S.gap = false;
    // the main path: do any task the cadet can reach, until none is left
    let left = TASKS.map(t => t[0]), guard = 0;
    while (left.length && guard++ < 40) { const t = TASKS.find(t => left.includes(t[0]) && reach(t[4])); if (!t) break; S.done[t[0]] = true; syncParts(); out.order.push(t[0]); left = left.filter(x => x !== t[0]); }
    out.stuck = left; out.parts = S.parts.length;
    out.launchReach = path(here()[0], here()[1], (x, y) => G[y][x].room === 'launch') !== null;
    out.secrets = S.secrets.length; out.bag = S.inv.length; out.course = S.course;
    return out; });
  if (r.dark.length) bad.push('squares past the gap can be walked on in the dark: ' + r.dark.join(' '));
  if (r.stuck.length) bad.push('tasks that cannot be reached without secrets: ' + r.stuck.join(', '));
  if (r.parts !== 5) bad.push('ship parts fitted: ' + r.parts);
  if (!r.launchReach) bad.push('the Launch Bay cannot be reached');
  // walk to the Launch Bay and launch, as a cadet would
  await p.evaluate(() => walkTo((x, y) => G[y][x].room === 'launch' && x === 30 && y === 3));
  for (let i = 0; i < 150; i++) { if (await p.evaluate(() => P.route.length === 0 && !P.then)) break; await p.waitForTimeout(100); }
  await p.evaluate(() => { S.x = Math.round(P.x); S.y = Math.round(P.y); arrive(); });
  await p.fill('#cmd', 'launch'); await p.press('#cmd', 'Enter'); await p.waitForTimeout(400);
  const end = await p.evaluate(() => ({ text: lines.slice(-3).map(l => l.text).join(' | '), mode: S.mode, secrets: S.secrets.slice(), bag: S.inv.slice(), room: S.room }));
  if (end.mode !== 'space') bad.push('did not launch: ' + end.text + ' (room ' + end.room + ')');
  if (end.secrets.length || end.bag.length) bad.push('secrets or items were used: ' + JSON.stringify(end));
  console.log(`tasks reached in order: ${r.order.join(', ')}`);
  console.log(`launched with ${end.secrets.length} secrets and ${end.bag.length} items: ${end.mode === 'space'}`);
  await b.close();
  for (const e of errs) console.log('  PAGE ERROR', e);
  for (const t of bad) console.log('  PROBLEM', t);
  console.log(bad.length || errs.length ? 'FAIL' : 'PASS');
  process.exit(bad.length || errs.length ? 1 : 0);
})();
