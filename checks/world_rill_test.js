// The Rillfolk of the Reach, from Marc's Gemini pictures, in the big world sample (prototypes/world_cast_kit.js).   [Proposal, 25 November 2026]
// [Source: Marc, 25 November: "Can we try to upgrade the characters on the next village."] Prompts: proposals/GMQ_Character_Test_Rillfolk_v1_2026-11-25.md
// With no Rillfolk pictures in the page yet: the harbour and the guard still show the game's own drawing, with no errors, and the test says it waits.
// With pictures, on an iPad sideways, an iPad upright and a phone:
//   1  in the harbour, the keeper, the baker, the net weaver and the old singer are drawn from their pictures, calm
//   2  the keeper's first talk: happy at "A visitor from the sky!", worried at "The high water is coming", thinking at "Three towns have sent…"
//   3  the old singer is sad at "My throat is dry"; once the fleet has sailed, she sings while she is not talking
//   4  the net weaver stands at her bench in the rope task, from her picture
//   5  on the map: the guard is drawn from his picture, happy at "A visitor from the sky!"; the Reed Town speaker and the child are drawn from theirs
//   6  "Look: old" on the Ship panel shows the game's own drawing again
//   7  no page errors, and nothing asks the network
// Run:  node checks/world_rill_test.js [page] [--shots folder]      (default page: prototypes/world_look_sample.html)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const FILE = process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'world_look_sample.html'), URL = 'file://' + path.resolve(FILE);
const SHOTS = process.argv.indexOf('--shots') > 0 ? process.argv[process.argv.indexOf('--shots') + 1] : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
(async () => {
  const b = await chromium.launch();
  for (const [name, w, h] of [['iPad sideways', 1180, 745], ['iPad upright', 820, 1180], ['phone', 390, 760]]) {
    console.log('--- ' + name);
    const ctx = await b.newContext({ viewport: { width: w, height: h } }), p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('request', r => { if (!/^file:|^data:|fonts\.(googleapis|gstatic)\.com/.test(r.url())) errs.push('asked the network: ' + r.url()); });
    await p.goto(URL + '?seed=31&fastread=1#skip'); await p.waitForFunction(() => window.__bw && window.__bw.S());
    await p.click('#readskip'); await p.waitForTimeout(150); await p.click('#readok'); await p.waitForTimeout(150);
    const have = await p.evaluate(() => ['keeper2', 'baker', 'netmender', 'singer', 'guard', 'sp_stilt', 'sp_reed', 'sp_mud', 'rafter'].filter(c => CAST_SPRITES[c]));
    const shot = async n => { if (SHOTS) await p.screenshot({ path: path.join(SHOTS, `${name.replace(/ /g, '_')}_${n}.png`) }); };
    const shown = c => p.evaluate(c => CAST.test.shown(c), c), clear = () => p.evaluate(() => CAST.test.clear());
    const page = () => p.evaluate(() => ({ reading: reading(), page: READ.q[READ.i] || '', who: READ.who }));
    const next = async () => { await p.click('#readok'); await p.waitForTimeout(200); };
    const word = async id => { await p.click(`#words [data-thing="${id}"]`, { timeout: 6000 }); await p.waitForFunction(() => reading() || window.__bw.task(), null, { timeout: 8000 }).catch(() => {}); await p.waitForTimeout(250); };
    // into the harbour (the gates opened for the test)
    await p.evaluate(() => { S.gates.bridge = 1; S.gates.reeds = 1; P.px = 62; P.py = 73; P.route = []; ACT.harbour(); });
    await p.waitForTimeout(300); while ((await page()).reading) await next();
    await clear(); await p.waitForTimeout(400); await shot('1_harbour');
    if (!have.length) {
      say(await p.evaluate(() => S.at === 'harbour'), `${name}: the harbour did not open`);
      say(!(await shown('keeper2')), `${name}: a keeper picture was drawn with no pictures in the page`);
      if (errs.length) say(false, `${name}: ${errs.join(' | ')}`); await ctx.close(); continue; }
    for (const c of ['keeper2', 'baker', 'netmender', 'singer']) say(await shown(c) === 'idle', `${name}: the ${c} is not drawn calm from the picture in the harbour (${await shown(c)})`);
    // the keeper's first talk
    await word('keeper2'); let pg = await page(); say(/^A visitor from the sky/.test(pg.page) && await shown('keeper2') === 'happy', `${name}: the keeper is not happy at her welcome: ${await shown('keeper2')}`); await shot('2_keeper_welcome');
    await next(); pg = await page(); say(/high water is coming/.test(pg.page) && await shown('keeper2') === 'worried', `${name}: the keeper is not worried at the high water: ${await shown('keeper2')}`); await shot('3_keeper_worried');
    await next(); pg = await page(); say(/^Three towns have sent/.test(pg.page) && await shown('keeper2') === 'thinking', `${name}: the keeper is not thinking at the three towns: ${await shown('keeper2')}`);
    while ((await page()).reading) await next();
    // the old singer
    await word('singer'); pg = await page(); say(/throat is dry/.test(pg.page) && await shown('singer') === 'sad', `${name}: the singer is not sad at "My throat is dry": ${await shown('singer')}`); await shot('4_singer_sad');
    while ((await page()).reading) await next();
    await p.evaluate(() => setFlag('fleetDone')); await p.waitForTimeout(300); say(await shown('singer') === 'sing', `${name}: after the fleet, the singer does not sing: ${await shown('singer')}`); await shot('5_singer_sings');
    await p.evaluate(() => { delete S.flags.fleetDone; });
    // the net weaver at her bench: the rope task
    await clear(); await p.evaluate(() => { S.well.step = 1; S.well.hit = 1; }); await word('netmender'); while ((await page()).reading) await next();
    say(await p.evaluate(() => window.__bw.task() && window.__bw.task().kind === 'rope'), `${name}: the rope task did not open`);
    await p.waitForTimeout(300); say(!!(await shown('netmender')), `${name}: the net weaver is not drawn from her picture at her bench`); await shot('6_rope_task');
    await p.evaluate(() => { closeTask(); S.well.step = 0; S.at = 'map'; P.px = 58; P.py = 74; P.route = []; S.gates.reeds = 0; see(); setPlace(); drawWords(); drawTask(); }); await p.waitForTimeout(300);
    // the map: the guard
    const gHappy = await p.evaluate(() => !!CAST_SPRITES.guard.frames.happy) ? 'happy' : 'idle';      /* his happy face comes with picture 18; until then, calm */
    if (gHappy === 'idle' && name === 'iPad sideways') console.log('  (the five on the map have no happy picture yet: picture 18. They stay calm.)');
    await clear(); await word('guard'); pg = await page(); say(/^A visitor from the sky/.test(pg.page) && await shown('guard') === gHappy, `${name}: the guard is not drawn ${gHappy} at "A visitor from the sky!": ${await shown('guard')}`);
    await p.waitForTimeout(500); await shot('7_guard_talks'); while ((await page()).reading) await next(); await p.waitForTimeout(200); say(await shown('guard') === 'idle', `${name}: the guard is not calm after talking`);
    await p.evaluate(() => { P.px = 79; P.py = 75; P.route = []; see(); setPlace(); drawWords(); }); await clear(); await p.waitForTimeout(400);
    say(!!(await shown('sp_reed')), `${name}: the Reed Town speaker is not drawn from the picture`); await shot('8_reed_town');
    await p.evaluate(() => { P.px = 68; P.py = 76; P.route = []; see(); setPlace(); drawWords(); }); await clear(); await p.waitForTimeout(400);
    say(!!(await shown('rafter')), `${name}: the child is not drawn from the picture`);
    // Look: old
    await p.evaluate(() => WL.toggle()); await clear(); await p.waitForTimeout(300); say(!(await shown('rafter')) && !(await shown('guard')), `${name}: "Look: old" still shows the pictures`); await p.evaluate(() => WL.toggle());
    if (errs.length) say(false, `${name}: ${errs.join(' | ')}`); await ctx.close();
  }
  const anyPics = bad.length === 0;
  console.log(bad.length ? `world_rill_test: ${bad.length} FAULT(S)` : 'world_rill_test: all pass on three screens (if the page has no Rillfolk pictures yet, only that the game still draws its own with no errors)');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
