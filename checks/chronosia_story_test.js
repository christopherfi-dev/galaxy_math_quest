// Chronosia's story, version 94: the build list's stages 1 and 2.   [Source: Marc approved the story on 2026-11-23: "Your four are fine."]
//   [Proposal: the Chronosia story note, proposals/GMQ_Chronosia_Story_v1_2026-11-23.md] Played as a child plays, at iPad sideways, iPad upright and phone size:
//   ARRIVING: the first landing tells the call, the quakes, the stopped day and the Engine Core. Later landings follow what is done.
//   THE STUCK AFTERNOON (rules R13, R14; decision 3, pick A): before the eight clocks are true, the seventh quake cannot come. The Watcher says so, the
//     Stabilizer will not open, the hint points to the tower, and the mission panel says "after Fix the clocks". The Watcher's log can still be read.
//   THE KEEPER (R11 to R13): three things to say, in turn. None of them gives the method (no 59, no 60, no "add").
//   THE CLOCKS, THEN THE QUAKE: the great clock is ready and held; then the quake is held and the day turns. The tower, the door, the Keeper, the Watcher,
//     the needle, the workbench bell, the sundial's shadow and the burrow's digger all show which.
//   THE OTHER ORDER: a game saved before version 94 with the quake held first. The Keeper says so; fixing the clocks turns the day at once.
//   THE CRACK: it fades only when the day turns AND the night trips are stopped. Telling the Council on a stuck day leaves it; once the day turns, it goes.
//   THE CASE: no dates; three nights signed "Council errand", last night not signed. The log's picture at three sizes.
//   ALSO: every new line passes the game's own kind-words check; closing and opening the game keeps it all; the report home no longer says "time is broken".
// Run: node checks/chronosia_story_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html'), said = [];
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(400);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); }, no = (got, re, what) => { if (re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = async () => { const t = await p.evaluate(() => lines[lines.length - 1].text || ''); said.push(t); return t; };
    const idle = async () => { for (let i = 0; i < 300; i++) { if (await p.evaluate(() => !CM.route.length && !CM.then && PL.to == null && !PL.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return last(); };
    const shot = async n => { if (out) { await p.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p.waitForTimeout(500); await p.screenshot({ path: path.join(out, `story_${name}_${n}.png`) }); } };
    const D = () => p.evaluate(() => Object.assign({}, C().done)), mission = () => p.evaluate(() => cMissionHtml().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    try {
      // ---- arriving from space: the call
      await p.evaluate(() => { skipIntro(); goSpace(); S.at = 'metrica'; SP.to = null; save(); }); await p.waitForTimeout(200);
      const land1 = await say('land'); expect(land1, /^You land on Planet Chronosia, under a sky of coloured stripes\. Chronosia called for help\. Six Time Quakes came this afternoon\. They stopped the clocks, and the day stopped with them\. The Council has the Engine Core your ship needs\. But first, it needs your help\.$/, 'the first landing tells the call and why the cadet came');
      no(land1, /time is broken|Walk around/i, 'the old landing words are gone'); await shot('1_landing');
      expect(await mission(), /Next: Fix the clocks\. Walk to the Clock Tower, across the bridge\./, 'the mission panel says where, not "the Council\'s book says where"'); expect(await mission(), /The seventh quake \(after "Fix the clocks"\)/, 'the panel shows the quake waits for the clocks');
      await p.evaluate(() => { leaveChrono(say); }); await p.waitForTimeout(300); expect(await say('land'), /^You land on Planet Chronosia\. The clocks are still stopped, and the day with them\. The Clock Tower is across the bridge\.$/, 'the second landing is short');
      await p.evaluate(() => { C().seen = new Array(CW * CH).fill('1').join(''); save(); });
      // ---- the Quake Station, before the clocks
      await say('go to quake'); ok(await p.evaluate(() => C().at === 'quake'), 'at the Quake Station'); expect(await last(), /A needle rests on a roll of paper, after six wild lines\./, 'the station: no shaking now, six lines so far');
      expect(await say('talk watcher'), /While it is stuck, the seventh quake cannot come\. So it cannot be held\. Make the eight clocks true first\./, 'the Watcher, while the clocks are wrong (R13)');
      expect(await say('use stabilizer'), /^The Stabilizer waits\. While the day is stuck, the seventh quake cannot come\./, 'the Stabilizer will not open while the day is stuck'); ok(await p.evaluate(() => !widget), 'no Stabilizer sheet before the clocks');
      expect(await say('hint'), /Set the eight clocks in the Clock Tower first\./, 'the hint points to the tower'); ok(await p.evaluate(() => !C().q7 || !C().q7.nudges), 'that hint costs no nudge');
      await say('use log'); ok(await p.evaluate(() => widget && widget.kind === 'qlog'), 'the log can still be read early'); await p.tap('#leave'); await p.waitForTimeout(150); await shot('2_quake_before');
      await say('leave');
      // ---- the Keeper: the story reason, never the method
      await say('go to tower'); ok(await p.evaluate(() => C().at === 'tower'), 'at the tower'); expect(await last(), /Its great clock has stopped\./, 'the tower before');
      const k1 = await say('talk keeper'), k2 = await say('talk keeper'), k3 = await say('talk keeper'), k4 = await say('talk keeper');
      expect(k1, /jolted our clocks\. Their wheels slipped, and they stopped\. The great clock will not turn until all eight small clocks tell a true time\. Which are wrong\? What should they say\?/, 'the Keeper, first (R11)');
      expect(k2, /eight valleys, so the clocks need not agree/, 'the Keeper, second (R12)'); expect(k3, /the day cannot move on\. Look at any shadow/, 'the Keeper, third (R13)'); ok(k4 === k1, 'the Keeper goes round again');
      [k1, k2, k3].forEach(t => no(t, /\b59\b|\b60\b|\badd\b|hour has|ran past/, 'the Keeper must not give the method'));
      expect(await say('look keeper'), /A ring of tower keys/, '"a ring of tower keys", so nobody tries them on the portal');
      // ---- the clocks: the great clock is ready, and held
      await p.evaluate(() => { const c = C(); c.cl = {}; CLK.forEach((k, i) => { if (k[1]) c.cl[i] = k[1][0].slice(); }); save(); startClocks(); }); await p.waitForTimeout(200); await p.click('#try'); await p.waitForTimeout(300);
      expect(await last(), /^Eight gears turn\. The eight clocks tick\. The great clock is ready\. The keeper keeps one hand on its rope\. "Not yet\. Start the day, and the seventh quake comes with it\. Go to the Watcher\." You earn a card\.$/, 'the clocks win: ready, not "ticks again" (R14, state 2)');
      expect(await say('talk keeper'), /The great clock is ready\. I hold it still\./, 'the Keeper holds the great clock'); expect(await say('look door'), /the great clock waits\./, 'the door: the great clock waits');
      expect(await say('use door'), /to the north-east\. Beyond the hills lie seven more valleys, each under its own stripe of sky\. The crack in the sky is widest over the time portal\./, 'the tower top: north-east, the valleys, the crack');
      await say('leave'); await p.evaluate(() => { leaveChrono(say); }); await p.waitForTimeout(300); expect(await say('land'), /The great clock is ready, but the day is still stuck\. The Watcher waits at the Quake Station\./, 'landing with the clocks done');
      expect(await mission(), /Next: The seventh quake\. Go to the Quake Station, north of the tower\./, 'the panel: the quake is next');
      await p.evaluate(() => { C().seen = new Array(CW * CH).fill('1').join(''); save(); });
      // ---- the seventh quake: a wrong try, then the right one
      await say('go to quake'); { const w1 = await say('talk watcher'), w2 = await say('talk watcher'); expect(w1, /We fear the seventh will break Chronosia apart/, 'the Watcher sets the problem'); expect(w2, /hold one quake from its first minute to its last, and the chain breaks\. Nobody has ever tried it\./, 'the Watcher: the Clockmaker\'s notes (R10)'); }
      const stab = async (a, b2, c2, d) => { if (!(await p.$('#ah'))) { await say('use stabilizer'); await p.waitForTimeout(200); } await p.fill('#ah', a); await p.fill('#am', b2); await p.fill('#bh', c2); await p.fill('#bm', d); await p.tap('#try'); await p.waitForTimeout(250); return last(); };
      { const t = await stab('5', '30', '6', '05'); expect(t, /You throw the switch\. Far off, the keeper lets the great clock go\. Time runs forward\.[\s\S]*Too early\. The Watcher turns the Stabilizer's crank\. Time winds back to 5:04, and the keeper holds the great clock again\./, 'a wrong try winds back to 5:04 (R15)'); no(t, /5:34|6:09|brass key/, 'a wrong try gives nothing away'); }
      await shot('3_quake_stabilizer');
      { const t = await stab('5', '34', '6', '09'); expect(t, /The chain is broken\. Far off, the great clock strikes, and the day turns at last\./, 'the quake held: the day turns (R14, state 4)'); no(t, /Chronosia is whole/, 'not "Chronosia is whole" (fault 9)'); }
      expect(await last(), /./, ''); expect(await say('look needle'), /It draws a flat line now\./, 'the needle, after'); expect(await say('talk watcher'), /The needle draws a flat line, and the chain is broken/, 'the Watcher, after'); await say('leave');
      await say('go to tower'); expect(await last(), /Its great clock runs\./, 'the tower, after'); expect(await say('talk keeper'), /The great clock strikes, and the day turns\./, 'the Keeper, after'); await say('leave');
      // ---- what shows the day turning
      await p.evaluate(() => { C().x = 17; C().y = 10; CM.px = 17; CM.py = 10; save(); }); await p.waitForTimeout(150); expect(await say('dig'), /Its shadow moves slowly across the stone\. You earn a card\./, 'the sundial, dug after the day turns');
      expect(await say('look burrow'), /A furry digger sits outside it, in the sun\./, 'the burrow, after the quakes (task 22)');
      ok(await p.evaluate(() => /tower bell rings once/.test(CSC.shop.things.find(t => t.id === 'bench').use())), 'the workbench rings the tower bell once the great clock runs (fault 31)');
      expect(await say('look'), /A thin crack runs across them\./, 'the crack stays: the night trips are not stopped yet');
      await p.evaluate(() => { leaveChrono(say); }); await p.waitForTimeout(300); expect(await say('land'), /^You land on Planet Chronosia\. The ground is still, and the day turns again\. The Council still needs a plan for its missions\. A thin crack still runs across the sky\.$/, 'landing after the quake');
      // ---- the case: no dates, three errands signed, last night not
      await p.evaluate(() => { C().seen = new Array(CW * CH).fill('1').join(''); save(); }); await say('use portal'); await p.waitForTimeout(200);
      { const t = await p.locator('#stageview').innerText().catch(() => ''), all = await p.evaluate(() => document.body.innerText); expect(t, /Four nights[\s\S]*Council[\s\S]*errand[\s\S]*Last night[\s\S]*not[\s\S]*signed/, 'the portal log: nights without dates, errands signed, last night not'); no(all, /Oct 2|Oct 3,|Oct 5/, 'no date in the case'); ok((t.match(/errand/g) || []).length === 3, 'three nights signed "Council errand"'); }
      await shot('4_portal_log'); await p.tap('#leave'); await p.waitForTimeout(150);
      { const endTxt = await p.evaluate(() => { fCaseEnd('chrono', fCase(C().seed)); $('tell').click(); return lines[lines.length - 1].text; }); said.push(endTxt); expect(endTxt, /the portal is locked by night\. Missions go by day\.[\s\S]*With no more night trips, the crack in the sky begins to fade\./, 'telling the Council once the day turns: the crack fades'); no(endTxt, /chain the portal/, 'no chains'); }
      await idle(); expect(await say('look'), /Stripes of colour fill the sky\. A river/, 'the map, after'); no(await last(), /crack/, 'the crack is gone');
      expect(await say('look portal'), /Locked by night/, 'the portal, after'); await shot('5_map_after');
      // ---- closed and opened again
      await p.reload(); await p.waitForTimeout(700); ok(await p.evaluate(() => S.mode === 'chrono' && C().done.clocks && C().done.quakes && !cCrack()), 'kept after the game is opened again');
      // ---- the report home
      ok(await p.evaluate(() => RHOME.chrono.facts().every(f => !/time is broken/i.test(f))), 'the report home no longer says time is broken (fault 8)');
      // ---- THE OTHER ORDER: an old save with the quake held first
      await p.evaluate(() => { const c = C(); c.done = { quakes: true }; c.cl = {}; c.fk = {}; save(); leaveChrono(say); }); await p.waitForTimeout(300);
      expect(await say('land'), /^You land on Planet Chronosia\. The quakes are over\. But the clocks are still stopped, so the day cannot turn\./, 'an old save, quake first: landing');
      await p.evaluate(() => { C().seen = new Array(CW * CH).fill('1').join(''); save(); }); await say('go to tower'); expect(await say('talk keeper'), /The quakes are over\. Now let the day turn again\./, 'the Keeper, quake first (the note, section 8)');
      expect(await mission(), /Next: Fix the clocks/, 'the panel, quake first'); no(await mission(), /after "Fix the clocks"/, 'a held quake is not shown as waiting');
      await p.evaluate(() => { const c = C(); CLK.forEach((k, i) => { if (k[1]) c.cl[i] = k[1][0].slice(); }); save(); startClocks(); }); await p.waitForTimeout(200); await p.click('#try'); await p.waitForTimeout(300);
      expect(await last(), /^Eight gears turn\. The eight clocks tick\. The keeper lets the great clock go\. It strikes, and the day turns at last\./, 'fixing the clocks after the quake turns the day at once');
      await say('leave'); await shot('6_quake_first_done');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    // ---- every line said passes the game's own kind-words check
    { const rude = await p.evaluate(t => t.filter(x => rude(x)), said); if (rude.length) bad.push(name + ': unkind words: ' + rude.join(' | ')); }
    await ctx.close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].join(' | '));
  console.log(`${said.length} lines read.`); console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'Chronosia story, stages 1 and 2: every check passed, on three screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
