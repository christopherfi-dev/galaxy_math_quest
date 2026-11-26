// The cards, wired into the game (version 102).   [Source: Marc, 2026-11-26: "it shows what card they received like it pops up... they can actually read the card and see
//   like what it does... start collecting their own cards in their demo play through"]. The piece itself is tested by the cards thread (cards_in_game_test.js, cards_page_test.js,
//   cards_pick_check.js). This test checks the WIRING, played as a child at iPad sideways, iPad upright and phone:
//   - a station task won (Shield Calibration, played through its own win): the card pops up in the picture after the words, saying why ("For the Shield Calibration task, in the
//     Shield Bay."); taps on the picture do not walk while it shows; "Add to my cards" waits a moment, then the picture is the game's again and the card is added (not "unseen")
//   - all 15 station tasks: the 15 cards are the child's starter pack: 1 Spy, 1 Policeman (Station Guard), at least 1 epic and 1 rare; the same pack after closing and opening the game
//   - My cards: the panel's "Open my card book" opens the book in the picture; "Close my cards" gives the picture back
//   - a version 101 save with the old cards (Laser Cannon, Nebula Nova): opened in 102, each is swapped once for a new card of the same kind, shown as a pack; opened again, nothing changes
//   - a card left waiting when the game closed shows when it opens again
//   - the market's card says why
// Run: node checks/cards_wired_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(500);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    const shot = async n => { if (out) { await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, `cardswired_${name}_${n}.png`) }); } };
    const showing = () => p.evaluate(() => GMQCards.isOpen() && !!document.querySelector('#gmqc-desk'));
    const waitShow = async () => { for (let i = 0; i < 40; i++) { if (await showing()) return true; await p.waitForTimeout(150); } return false; };
    const add = async () => { for (let i = 0; i < 40; i++) { if (await p.evaluate(() => { const a = $('gmqc-add'); return a && !a.disabled; })) break; await p.waitForTimeout(150); } await p.click('#gmqc-add'); await p.waitForTimeout(500); };
    try {
      await p.evaluate(() => { skipIntro(); }); await p.waitForTimeout(600); ok(await p.evaluate(() => S.packSeed > 0), 'the save has a pack seed');
      // a station task, won through its own win: Shield Calibration
      await p.evaluate(() => { const before = S.cards.length; window.__before = before; taskWon('calib', 'Divide', 1, 0, 'The shield hums.'); });
      ok(await waitShow(), 'the card pops up after the task'); const c1 = await p.evaluate(() => S.cards[S.cards.length - 1]);
      ok(c1 && c1.id && c1.unseen === 1 && /For the Shield Calibration task, in the Shield Bay\./.test(c1.why), 'the card is saved at once, waiting, with why: ' + JSON.stringify(c1));
      ok(await p.evaluate(() => /Shield Calibration/.test(document.querySelector('.stage').innerText)), 'the card in the picture says why'); await shot('1_card');
      { const before = await p.evaluate(() => [P.x, P.y]); const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + r.width * .3, r.top + r.height * .6]; }); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(800);
        ok(await p.evaluate(b => P.x === b[0] && P.y === b[1], before), 'a tap on the picture does not walk while the card shows'); }
      await add(); ok(!(await showing()) && await p.evaluate(() => !widget && S.cards[S.cards.length - 1].unseen !== 1), '"Add to my cards": the picture is the game\'s again, the card added');
      // the whole station: the 15 cards are the starter pack
      await p.evaluate(() => { window.GMQ_NO_CARDPOP = true; S.cards = S.cards.slice(0, 1); TASKS.forEach(t => { if (!S.done[t[0]]) { S.done[t[0]] = true; stationCard(t[0]); } }); save(); });
      const pack = await p.evaluate(() => { const st = S.cards.filter(c => c.st), ty = st.map(c => (GMQCards.get(c.id) || {}).type || (GMQCards.info(c) || {}).type || ''), kinds = st.map(c => GMQCards.kindOf(c.r)); return { n: st.length, ids: st.map(c => c.id).sort().join(), ty: ty.join('|'), epic: kinds.filter(k => k === 'epic').length, rare: kinds.filter(k => k === 'rare').length, want: GMQCards.starterPack(S.packSeed).slice().sort().join() }; });
      ok(pack.n === 15, 'the station gives 15 cards: ' + pack.n); ok(pack.ids === pack.want, 'the 15 are exactly the child\'s starter pack'); ok(pack.epic >= 1 && pack.rare >= 1, `an epic and a rare (${pack.epic}, ${pack.rare})`);
      ok(/spy/i.test(pack.ty) && /(guard|police)/i.test(pack.ty), 'a Spy and a Policeman (Station Guard) in the pack: ' + pack.ty.slice(0, 120));
      await p.reload(); await p.waitForTimeout(900); ok(await p.evaluate(w => GMQCards.starterPack(S.packSeed).slice().sort().join() === w, pack.want), 'the same pack after closing and opening the game');
      // My cards: the book
      await p.evaluate(() => { window.GMQ_NO_CARDPOP = false; S.cards.forEach(c => { delete c.unseen; }); save(); menuOpen('cards'); }); await p.waitForTimeout(300);
      ok(await p.locator('#cardbook').isVisible(), 'My cards has "Open my card book"'); await p.click('#cardbook'); await p.waitForTimeout(700);
      ok(await p.evaluate(() => GMQCards.isOpen() && widget && widget.kind === 'cards'), 'the book opens in the picture'); await shot('2_book');
      await p.click('#gmqc-close'); await p.waitForTimeout(400); ok(await p.evaluate(() => !GMQCards.isOpen() && !widget), '"Close my cards" gives the picture back');
      // a card left waiting shows when the game opens again
      await p.evaluate(() => { window.GMQ_NO_CARDPOP = true; card('rare', 'For a test.'); }); await p.reload(); await p.waitForTimeout(600); ok(await waitShow(), 'a card left waiting shows when the game opens'); await add();
      // a version 101 save with the old cards
      await p.evaluate(() => { window.GMQ_NO_CARDPOP = true; S.cards = [{ r: 'common', n: 'Laser Cannon' }, { r: 'gold', n: 'Nebula Nova' }]; delete S.cardsMoved; save(); }); await p.reload(); await p.waitForTimeout(1200);
      ok(await p.evaluate(() => S.cardsMoved && S.cards.length === 2 && S.cards.every(c => c.id) && GMQCards.kindOf(S.cards[0].r) === 'common' && GMQCards.kindOf(S.cards[1].r) === 'epic'), 'old cards: swapped once for new cards of the same kind');
      ok(await waitShow(), 'the swapped cards are shown, as a pack'); await shot('3_swap');
      const ids = await p.evaluate(() => S.cards.map(c => c.id).join()); await p.evaluate(() => { GMQCards.close(true); widget = null; }); await p.reload(); await p.waitForTimeout(1200); ok(await p.evaluate(i => S.cards.map(c => c.id).join() === i, ids), 'opened again: nothing changes');
      // the market's card says why
      await p.evaluate(() => { GMQCards.close(true); widget = null; window.GMQ_NO_CARDPOP = true; MARKET_HOST.card(); }); ok(/Voltara's supplies/.test(await p.evaluate(() => S.cards[S.cards.length - 1].why)), 'the market\'s card says why');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The cards in the game: every check passed, on three screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
