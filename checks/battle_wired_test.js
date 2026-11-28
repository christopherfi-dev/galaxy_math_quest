// The battle with a child's own cards, wired into the game at the Launch Bay, rationed (version 105).
//   [Source: Marc, 2026-11-28: the battle opens at the Launch Bay, after the station's 15 tasks; "you only get the battle like two or three times and then you have to go and
//   do more quests". The children love their cards and the battle.] [Proposal, the main thread's pick: 3 to start, then 1 whole practice credit (4 quarters) for 1 more.]
//   The piece itself is tested by the battle thread (battle_own_test.js). This test checks the WIRING, played as a child at iPad sideways, iPad upright and phone:
//   - before the 15 station tasks: a tap on the training screen walks there, and it says it wakes when all 15 are done, and how many tasks are left; no battle opens
//   - after: a tap opens its words on the desk (the story, how many battles are left, Start); a tap on the floor meanwhile walks nowhere; Leave closes it
//   - Start: the battle covers the whole screen; the game stops drawing and its music stops; keys and the typing box do nothing underneath
//   - leaving in the middle does not count; the screen then offers "Finish my battle", and the same battle goes on (same round)
//   - finishing counts once (the page's own end: every enemy part at 0, its endRound, its end screen, "Back to the Launch Bay"); no "Battle again" at the end
//   - after 3 finished: none left; the screen says how to earn more; with 0 and with 2 quarters it says how many more are needed; with 5 quarters, "Turn in 1 credit
//     for 1 battle" asks "Are you sure? Tap again" first, then gives 1 battle for 4 quarters
//   - a battle left half-way can be finished even with none left, and the count never goes below 0
//   - closing the game and opening it again keeps every count; an old save (no S.bat) opens with 3 left; Start again forgets a half-finished battle
//   HOW A BATTLE IS FINISHED here: not round by round (dozens of rounds with the page's own pauses). Inside the battle's frame, the enemy's five parts are set to 0
//   and the page's own endRound() is called, as checks/battle_own_test.js does. Everything after that is the page's own: its end screen, its "over" message to the game,
//   its "Back to the Launch Bay" button and its "close" message.
// Run: node checks/battle_wired_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    p.on('dialog', d => d.accept());      /* the battle's own "Leave the battle? It is saved." */
    await p.addInitScript(() => { window.GMQ_NO_CARDPOP = true; try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(500);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${String(got).slice(0, 300)}"`); };
    const last = () => p.evaluate(() => (lines[lines.length - 1] || {}).text || '');
    const shot = async n => { if (out) { await p.waitForTimeout(350); await p.screenshot({ path: path.join(out, `battle105_${name}_${n}.png`) }); } };
    const fr = p.frameLocator('#gmqbattle iframe');
    const inner = async fn => { const f = p.frames().find(x => x !== p.mainFrame() && /srcdoc/.test(x.url())); return f.evaluate(fn); };
    const toy = () => p.evaluate(() => $('toy').hidden ? '' : $('toy').innerText.replace(/\s+/g, ' '));
    const hook = () => p.evaluate(() => { if (window.__hooked) return; window.__hooked = 1; window.__sayN = 0; const s = window.say; window.say = function () { window.__sayN++; return s.apply(this, arguments); }; });
    const toLaunch = async () => { await p.evaluate(() => { tidy(); S.mode = 'station'; S.room = 'launch'; S.x = 30; S.y = 3; P.x = S.x; P.y = S.y; if (S.seen.indexOf('launch') < 0) S.seen.push('launch'); snap = true; save(); }); await p.waitForTimeout(300); };      /* the walk to the bay is played in station_playthrough_test.js */
    /* a tap on the training screen in the picture, as a child taps; then wait until the cadet has arrived and the screen has answered */
    const tapTrainer = async () => {
      const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + (34.5 - cam.x) * ts, r.top + (1.5 - cam.y) * ts, r.left, r.right, r.top, r.bottom]; });
      ok(pt[0] > pt[2] && pt[0] < pt[3] && pt[1] > pt[4] && pt[1] < pt[5], 'the training screen is in the picture: ' + pt.map(Math.round).join(','));
      await hook(); await p.evaluate(() => { window.__said = window.__sayN; }); await p.touchscreen.tap(pt[0], pt[1]);
      await p.waitForFunction(() => !P.route.length && !P.then && window.__sayN > window.__said && Math.abs(Math.round(P.x) - 33.5) <= 1.6 && Math.round(P.y) <= 2, null, { timeout: 15000 }); };
    const openBattle = async () => { await p.click('#try'); await p.waitForFunction(() => GMQBattleOwn.isOpen() && widget && widget.kind === 'cardbattle'); await p.waitForFunction(() => { const f = document.querySelector('#gmqbattle iframe'); return f && f.contentWindow && f.contentWindow.GMQB; }, null, { timeout: 15000 }); };
    const closed = () => p.waitForFunction(() => !document.getElementById('gmqbattle') && !widget, null, { timeout: 15000 });
    const startNew = async () => { await fr.locator('#ownsetup.open').waitFor({ timeout: 15000 }); await fr.locator('#ogo').click(); await fr.locator('.hc.mine').first().waitFor({ timeout: 15000 }); };
    /* the page's own end: every enemy part at 0, then its endRound(); wait for its end screen */
    const finish = async () => { await inner(() => { const S = GMQB.U.S; S.P[1].parts.forEach(q => { q.hp = 0; }); S.over = { winner: 0, why: 'All five enemy parts are at 0. You win.' }; GMQB.U.anim = false; GMQB.endRound(); }); await fr.locator('#goback').waitFor({ timeout: 25000 }); };
    const bat = () => p.evaluate(() => ({ used: (S.bat || {}).used || 0, bought: (S.bat || {}).bought || 0, left: batLeft(), q4: S.q4 || 0, half: GMQBattleOwn.inProgress() }));
    try {
      await p.evaluate(() => { skipIntro(); S.storyTold = true; }); await p.waitForFunction(() => S.packSeed > 0, null, { timeout: 5000 });
      ok(await p.evaluate(() => typeof GMQBattleOwn === 'object' && /105/.test($('t_ver').textContent)), 'version 105, with the battle piece');
      // ---- before the 15 station tasks: 12 done (the Navigation part fitted, so the Launch Bay is open)
      await p.evaluate(() => { PARTS.forEach(pt => tasksOf(pt).forEach(t => { S.done[t[0]] = pt !== 'Power'; })); S.parts = PARTS.filter(pt => pt !== 'Power'); save(); }); await toLaunch();
      ok(await p.evaluate(() => hereWords().some(x => x[1] === 'training screen')), 'the Here row offers "training screen"');
      await tapTrainer(); const asleep = await last();
      expect(asleep, /^The training screen is asleep\. It wakes when all 15 station tasks are done\. You have 3 tasks left\. Then you get 3 practice battles, with your own cards\.$/, 'before 15 tasks: its words');
      ok(await p.evaluate(() => !GMQBattleOwn.isOpen() && !widget && $('toy').hidden), 'before 15 tasks: no battle and no panel opens');
      await shot('1_asleep');
      await p.fill('#cmd', 'use screen'); await p.press('#cmd', 'Enter'); await p.waitForFunction(() => !P.route.length && !P.then); expect(await last(), /^The training screen is asleep/, '"use screen" says the same');
      await p.fill('#cmd', 'take screen'); await p.press('#cmd', 'Enter'); await p.waitForFunction(() => !P.route.length && !P.then); expect(await last(), /bolted to the floor/, '"take screen"');
      await p.evaluate(() => { S.done.board = true; S.done.blocks = true; save(); }); await tapTrainer(); expect(await last(), /You have 1 task left\./, 'one task left: "1 task", not "1 tasks"');
      // ---- after: all 15 tasks, each with its starter card
      await p.evaluate(() => { S.done = {}; S.cards = []; TASKS.forEach(t => { S.done[t[0]] = true; stationCard(t[0]); }); S.parts = PARTS.slice(); S.cards.forEach(c => { delete c.unseen; }); save(); drawStatus(); });
      await toLaunch(); await p.evaluate(() => { P.x = S.x = 32; P.y = S.y = 3; snap = true; }); await p.waitForTimeout(400); await shot('2_awake');
      await tapTrainer(); let t = await toy();
      expect(t, /The station's training crew flies a practice ship against you\. You battle with your own cards\./, 'the story, first');
      expect(t, /You have 3 practice battles left\./, 'three to start'); expect(t, /Start a practice battle/, 'Start'); expect(await last(), /The training screen lights up\./, 'the log line');
      await shot('3_panel');
      { const before = await p.evaluate(() => [P.x, P.y]); const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + (28.5 - cam.x) * ts, r.top + (3.5 - cam.y) * ts]; }); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(500);
        ok(await p.evaluate(b => P.x === b[0] && P.y === b[1] && !P.route.length, before), 'a tap on the floor while the words are open walks nowhere'); expect(await last(), /Finish this first\. Or tap Leave\./, 'and says to tap Leave'); }
      await p.click('#leave'); ok(await p.evaluate(() => !widget && $('toy').hidden), 'Leave closes the words'); expect(await last(), /You step back from the training screen\./, 'Leave: its words');
      // ---- a battle: music, drawing, keys
      await tapTrainer(); await p.evaluate(() => { MUS.on = true; musStart(); window.__draws = 0; const d = window.drawObj; window.drawObj = function (id) { window.__draws++; return d(id); }; });
      ok(await p.evaluate(() => !!MUS.timer), 'the game\'s music is on before the battle');
      await openBattle();
      const box = await p.evaluate(() => { const r = document.getElementById('gmqbattle').getBoundingClientRect(); return [r.left, r.top, r.width, r.height, innerWidth, innerHeight]; });
      ok(box[0] === 0 && box[1] === 0 && Math.abs(box[2] - box[4]) < 1 && Math.abs(box[3] - box[5]) < 1, 'the battle covers the whole screen: ' + box.join(','));
      await fr.locator('#ownsetup.open').waitFor({ timeout: 15000 });
      expect(await fr.locator('#odeck').textContent(), /Your deck has 1[5-9] cards/, 'the deck is the child\'s own cards');
      ok(await p.evaluate(() => !MUS.timer), 'the game\'s music stops while the battle is open');
      await p.evaluate(() => { document.dispatchEvent(new Event('pointerdown')); document.dispatchEvent(new Event('click')); }); ok(await p.evaluate(() => !MUS.timer), 'a tap does not wake the game\'s music under the battle');
      await p.evaluate(() => { window.__draws = 0; }); await p.waitForTimeout(400); ok(await p.evaluate(() => window.__draws === 0), 'the game draws nothing under the battle');
      { const n = await p.evaluate(() => lines.length); await p.evaluate(() => { $('cmd').value = ''; $('cmd').focus(); }); await p.keyboard.type('look ship'); await p.keyboard.press('Enter');
        ok(await p.evaluate(n => $('cmd').value === '' && lines.length === n && GMQBattleOwn.isOpen(), n), 'keys and the typing box do nothing underneath'); await p.evaluate(() => { $('cmd').blur(); act('look ship'); }); ok(await p.evaluate(n => lines.length === n, n), 'a command does nothing underneath'); }
      await shot('4_setup');
      await startNew(); await shot('5_battle');
      await fr.locator('.hc.mine').first().tap(); await fr.locator('#playit').tap();
      await p.waitForFunction(() => { const f = document.querySelector('#gmqbattle iframe'); const U = f && f.contentWindow.GMQB && f.contentWindow.GMQB.U; return U && (U.phase === 'roundend' || U.req || U.phase === 'over'); }, null, { timeout: 60000 });
      const round1 = await inner(() => GMQB.U.S.round);
      await fr.locator('#bnew').click(); await closed();      // Leave, in the middle (the battle's confirm is accepted)
      let n = await bat(); ok(n.used === 0 && n.left === 3 && n.half, 'leaving in the middle does not count, and the battle is kept: ' + JSON.stringify(n));
      expect(await last(), /^You leave the battle\. It is saved\. Tap the training screen to go on with it\.$/, 'leaving: its words');
      ok(await p.evaluate(() => !!MUS.timer), 'the game\'s music starts again after the battle'); await p.evaluate(() => { MUS.on = false; musStop(); });
      await p.evaluate(() => { window.__draws = 0; }); await p.waitForTimeout(300); ok(await p.evaluate(() => window.__draws > 0), 'the game draws again after the battle');
      // ---- closed and opened again: the half-finished battle is offered, and goes on
      await p.reload(); await p.waitForTimeout(600); await toLaunch();
      await tapTrainer(); t = await toy(); expect(t, /You have 3 practice battles left\./, 'opened again: still 3'); expect(t, new RegExp(`Your last battle is not finished\\. It waits for you on round ${round1}\\.`), 'opened again: the half-finished battle, with its round');
      expect(t, /Finish my battle/, '"Finish my battle"'); await shot('6_unfinished');
      await openBattle(); await fr.locator('#stage').waitFor({ timeout: 15000 });
      ok(await inner(() => !!GMQB.U.S && !/open/.test(document.getElementById('ownsetup').className)) && await inner(() => GMQB.U.S.round) === round1, 'the same battle goes on, at the same round');
      await finish(); n = await bat(); ok(n.used === 1 && !n.half, 'a finished battle counts when it ends, before the child taps out: ' + JSON.stringify(n));
      ok(await fr.locator('#again').count() === 0, 'no "Battle again" at the end'); expect(await fr.locator('#goback').textContent(), /^Back to the Launch Bay$/, 'the way out says "Back to the Launch Bay"');
      await shot('7_end');
      await fr.locator('#goback').click(); await closed(); n = await bat(); ok(n.used === 1 && n.left === 2, 'counted once, not twice: ' + JSON.stringify(n));
      expect(await last(), /^You are back in the Launch Bay\. You have 2 practice battles left\.$/, 'back: its words');
      ok(await p.evaluate(() => { const l = S.log[S.log.length - 1]; return l.what === 'A practice battle' && /^won, \d+ rounds?$/.test(l.result); }), 'the ship\'s log keeps the battle: ' + await p.evaluate(() => JSON.stringify(S.log[S.log.length - 1])));
      // ---- two more, finished: none left
      for (const k of [1, 0]) { await tapTrainer(); await openBattle(); await startNew(); await finish(); await fr.locator('#goback').click(); await closed(); n = await bat(); ok(n.left === k, `after another battle, ${k} left: ` + JSON.stringify(n)); }
      expect(await last(), /You have 0 practice battles left\.$/, '"0 practice battles"');
      await p.evaluate(() => { WISPON.on = true; RATON.on = false; S.q4 = 0; save(); });
      await tapTrainer(); t = await toy();
      expect(t, /You have 0 practice battles left\. To get more battles, earn practice credits\. 4 quarters make 1 whole credit\. 1 credit gives 1 battle\. Catch a time wisp on Chronosia\. Each one gives ¼ of a credit\./, 'none left: how to get more (time wisps on, mud rats off: the default)');
      expect(t, /You have no quarters yet\. You need 4 quarters for 1 battle\./, 'no quarters: 4 needed'); ok(!/Start a practice battle|Turn in/.test(t), 'none left: no Start, no turn-in');
      await p.evaluate(() => batGo()); ok(await p.evaluate(() => !GMQBattleOwn.isOpen()), 'none left: no battle opens');
      await p.click('#leave'); await p.evaluate(() => { S.q4 = 2; RATON.on = true; save(); }); await tapTrainer(); t = await toy();
      expect(t, /You have 2 quarters: ½ of a credit\. You need 2 more quarters for 1 battle\./, '2 quarters: 2 more needed'); expect(t, /Catch a time wisp on Chronosia, or beat a band of mud rats on Voltara\./, 'mud rats named when they are switched on');
      await shot('8_none_left');
      await p.click('#leave'); await p.evaluate(() => { S.q4 = 3; RATON.on = false; WISPON.on = false; save(); }); await tapTrainer(); t = await toy();
      expect(t, /You have 3 quarters: ¾ of a credit\. You need 1 more quarter for 1 battle\./, '3 quarters: 1 more needed'); expect(t, /Ask your teacher how to earn practice credits\./, 'both switched off: ask the teacher');
      await p.click('#leave'); await p.evaluate(() => { S.q4 = 5; WISPON.on = true; save(); }); await tapTrainer(); t = await toy();
      expect(t, /You have 1¼ credits\./, '5 quarters: 1¼ credits'); expect(await p.locator('#buy').textContent(), /^Turn in 1 credit for 1 battle$/, 'the turn-in button');
      await shot('9_credit');
      await p.click('#buy'); expect(await p.locator('#buy').textContent(), /^Are you sure\? Tap again$/, 'the first tap asks first'); n = await bat(); ok(n.q4 === 5 && n.left === 0, 'asking changes nothing');
      await p.click('#buy'); n = await bat(); ok(n.q4 === 1 && n.bought === 1 && n.left === 1, 'the second tap: 4 quarters for 1 battle: ' + JSON.stringify(n));
      t = await toy(); expect(t, /You have 1 practice battle left\./, 'then: 1 left'); expect(t, /You turn in 1 credit for 1 battle\. You have ¼ credit left\./, 'then: what was turned in'); expect(t, /Start a practice battle/, 'then: Start');
      ok(await p.evaluate(() => { const l = S.log[S.log.length - 1]; return l.what === 'Practice credits turned in' && l.result === '1 practice battle'; }), 'the turn-in is in the ship\'s log');
      await shot('10_bought');
      // ---- closed and opened again: the counts are kept
      await p.reload(); await p.waitForTimeout(600); n = await bat(); ok(n.used === 3 && n.bought === 1 && n.left === 1 && n.q4 === 1, 'closed and opened again: the counts are kept: ' + JSON.stringify(n));
      // ---- a battle left half-way can be finished with none left, and the count stays at 0
      await toLaunch(); await tapTrainer(); await openBattle(); await startNew(); await fr.locator('#bnew').click(); await closed();
      await p.evaluate(() => { S.bat.used = 4; save(); });      /* none left now, with a battle half-way (as if the last one had been spent) */
      await tapTrainer(); t = await toy(); expect(t, /You have 0 practice battles left\..*Your last battle is not finished\./, 'none left, a battle half-way: it is offered'); expect(t, /Finish my battle/, '"Finish my battle" with none left');
      await openBattle(); await fr.locator('#stage').waitFor({ timeout: 15000 }); await finish(); await fr.locator('#goback').click(); await closed();
      n = await bat(); ok(n.used === 4 && n.left === 0 && !n.half, 'finished with none left: the count stays at 0, never below: ' + JSON.stringify(n));
      // ---- an old save, without S.bat, opens with 3 left; Start again forgets a half-finished battle
      await p.evaluate(() => { delete S.bat; save(); }); await p.reload(); await p.waitForTimeout(600); ok((await bat()).left === 3, 'an old save opens with 3 left');
      await toLaunch(); await tapTrainer(); await openBattle(); await startNew(); await fr.locator('#bnew').click(); await closed(); ok(!!(await bat()).half, 'a battle half-way, before Start again');
      await p.evaluate(() => restart()); ok(!(await bat()).half && (await bat()).left === 3, 'Start again: a new cadet, 3 left, no battle half-way');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The battle at the Launch Bay: every check passed, on three screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
