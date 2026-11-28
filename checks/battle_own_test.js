// Battle thread, 26 November. Plays the game's piece (GMQBattleOwn, docs/battle/own.html) as a child would, at three screen sizes:
// a battle with your own cards. Run:  node checks/battle_own_test.js [folder for pictures]
// The last line is "ALL OK" or the list of what failed.
const { chromium } = require('playwright');
const path = require('path');
const FILE = 'file://' + path.resolve(__dirname, '..', 'docs', 'battle', 'own.html');
const SHOTS = process.argv[2] || null;
const SIZES = [['ipad_sideways', 1180, 745], ['ipad_upright', 820, 1180], ['phone', 390, 760]];
const bad = [];
function want(label, ok, extra) { console.log((ok ? 'ok   ' : 'FAIL ') + label + (extra ? ': ' + extra : '')); if (!ok) bad.push(label); }
(async () => {
  const browser = await chromium.launch();
  for (const [name, w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('dialog', d => d.accept());
    await page.goto(FILE);
    const fr = page.frameLocator('#gmqbattle iframe');
    const inner = async fn => (await page.frames().find(f => f !== page.mainFrame()).evaluate(fn));
    async function openFor(who) { await page.locator('#who button[data-k="' + who + '"]').click(); await page.locator('#open').click(); await fr.locator('#ownsetup.open').waitFor(); }
    async function closed() { await page.waitForFunction(() => !document.getElementById('gmqbattle')); }

    // 1. a new cadet with 4 cards: the station lends 11
    await openFor('new');
    const box = await page.evaluate(() => { const b = document.getElementById('gmqbattle').getBoundingClientRect(); return [b.left, b.top, b.width, b.height, innerWidth, innerHeight]; });
    want(name + ': the battle fills the whole screen, over the game', box[0] === 0 && box[1] === 0 && Math.abs(box[2] - box[4]) < 1 && Math.abs(box[3] - box[5]) < 1, box.join(','));
    let t = await fr.locator('#odeck').textContent();
    want(name + ': a cadet with 4 cards: the deck is 15, and the station lends 11', /Your deck has 15 cards/.test(t) && /You have 4 battle cards of your own, so you borrow 11 from the station/.test(t), t);
    want(name + ': the deck shows 15 cards, 11 marked "borrowed"', await fr.locator('#ogrid .dc').count() === 15 && await fr.locator('#ogrid .dc i').count() === 11);
    want(name + ': the game\'s rules switches are not offered to a child', !(await fr.locator('#brules').isVisible()));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_own_1_new.png') });
    // a card in the deck opens large, above the setup screen, and closes
    await fr.locator('#ogrid .dc').nth(2).click();
    const pop = await inner(() => { const p = document.getElementById('pop'), r = p.getBoundingClientRect(), z = getComputedStyle(p).zIndex, s = getComputedStyle(document.getElementById('ownsetup')).zIndex; return { open: /open/.test(p.className), z: +z, s: +s, w: r.width }; });
    want(name + ': a tapped card opens large, above the deck', pop.open && pop.z > pop.s, JSON.stringify(pop));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_own_2_card.png') });
    await fr.locator('#popx').click();
    want(name + ': Back closes the large card', !(await inner(() => /open/.test(document.getElementById('pop').className))));
    await fr.locator('#oback').click(); await closed();
    want(name + ': Back returns to the game, and the game is told', /closed \(left\)/.test(await page.locator('#said').textContent()));

    // 2. three Spy cards: one goes in, and the child chooses which; the choice is kept
    await openFor('spies');
    t = await fr.locator('#odeck').textContent();
    const spyName = s => (s.match(/one goes in: ([^.]+)\./) || [])[1];
    const first = spyName(t);
    want(name + ': three Spy cards: one goes in, and it says so', /You have 3 Spy cards, and one goes in/.test(t) && !!first && await inner(() => document.querySelectorAll('#ogrid .dc').length) === 17, t);
    want(name + ': the ship part the cadet owns can be chosen: the words name it', /You have more than one Engine Core: tap it to change/.test(await fr.locator('#oshiph').textContent()));
    await fr.locator('#ogrid .dc.pick').click();
    t = await fr.locator('#odeck').textContent(); const second = spyName(t);
    want(name + ': tapping the Spy changes it to another of the cadet\'s Spy cards', !!second && second !== first, first + ' then ' + second);
    want(name + ': still only one Spy in the deck', await inner(() => GMQB.B.ownDeck(GMQB.own.cards, GMQB.own.seed, 'card', GMQB.U.spy).deck.filter(id => GMQB.B.isSpy(id)).length) === 1);
    await fr.locator('#oship button').nth(0).click();
    want(name + ': tapping the Engine Core gives the gold engine the cadet owns', /Stellar Reactor/.test(await fr.locator('#oship button').nth(0).textContent()));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_own_3_spies.png') });
    await fr.locator('#oback').click(); await closed();
    await page.reload(); await openFor('spies');
    want(name + ': the chosen Spy and part are kept after the game is closed and opened again', spyName(await fr.locator('#odeck').textContent()) === second && /Stellar Reactor/.test(await fr.locator('#oship button').nth(0).textContent()));
    await fr.locator('#oback').click(); await closed();

    // 3. the end of today's game: 86 cards, 76 in the deck (one Spy of eleven)
    await openFor('end');
    t = await fr.locator('#odeck').textContent();
    want(name + ': a cadet with 86 cards: every battle card is in, with one Spy', /Your deck has 76 cards/.test(t) && /You have 11 Spy cards, and one goes in/.test(t), t);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_own_4_end.png') });
    await fr.locator('#oback').click(); await closed();

    // 4. a battle: start, play a round, leave, come back to the same battle
    await openFor('starter');
    await fr.locator('#ogo').click();
    await fr.locator('.hc.mine').first().waitFor();
    const deck0 = await inner(() => GMQB.U.S.P[0].deck.concat(GMQB.U.S.P[0].hand).slice().sort().join(','));
    const want0 = await inner(() => GMQB.B.ownDeck(GMQB.own.cards, GMQB.own.seed, 'card', GMQB.U.spy).deck.slice().sort().join(','));
    want(name + ': the battle is played with the cadet\'s own deck', deck0 === want0);
    want(name + ': the hand is on the screen, 5 cards', await fr.locator('.hc.mine').count() === 5);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_own_5_battle.png') });
    await fr.locator('.hc.mine').first().tap();
    await fr.locator('#playit').tap();
    await page.waitForFunction(() => { const f = document.querySelector('#gmqbattle iframe'); const U = f && f.contentWindow.GMQB && f.contentWindow.GMQB.U; return U && (U.phase === 'roundend' || U.req || U.phase === 'over'); }, null, { timeout: 60000 });
    // if a hit must be placed, let the page's own computer chooser place it, as the tests of the practice battle do
    const rep = await inner(() => { const U = GMQB.U, S = U.S; if (U.phase !== 'roundend' || !S.start) return 'not at the end of a round'; const Q = GMQB.B.replay(JSON.parse(JSON.stringify(S.start)), JSON.parse(JSON.stringify(S.rec)));
      return Q.round === S.round && JSON.stringify(Q.P.map(p => p.parts.map(x => x.hp).concat([p.shield]))) === JSON.stringify(S.P.map(p => p.parts.map(x => x.hp).concat([p.shield]))) && S.rec.length === S.log.length ? 'same' : 'different'; });
    if (rep !== 'not at the end of a round') want(name + ': a round played on the screen, played again from its record, ends the same', rep === 'same', rep);
    const round1 = await inner(() => GMQB.U.S.round);
    await fr.locator('#bnew').click();   // Leave (the confirm is accepted)
    await closed();
    want(name + ': Leave returns to the game; the battle is saved', /closed \(left\)/.test(await page.locator('#said').textContent()));
    await page.reload(); await page.locator('#who button[data-k="starter"]').click(); await page.locator('#open').click();
    await fr.locator('#stage').waitFor();
    const back = await inner(() => ({ round: GMQB.U.S && GMQB.U.S.round, setup: /open/.test(document.getElementById('ownsetup').className) }));
    want(name + ': opened again, the same battle goes on', back.round === round1 && !back.setup, JSON.stringify(back) + ' round before ' + round1);

    want(name + ': the game can ask whether a battle is saved half-way (GMQBattleOwn.inProgress)', await page.evaluate(() => { const p = GMQBattleOwn.inProgress(); return !!p && p.round >= 1; }));
    // 5. the end of a battle: the game is told who won, and "Back to the station" closes it
    await inner(() => { const S = GMQB.U.S; S.P[1].parts.forEach(p => { p.hp = 0; }); S.over = { winner: 0, why: 'All five enemy parts are at 0. You win.' }; GMQB.U.anim = false; GMQB.endRound(); });
    await fr.locator('#goback').waitFor({ timeout: 20000 });
    want(name + ': at the end the game hears who won', /the cadet won/.test(await page.locator('#said').textContent()), await page.locator('#said').textContent());
    want(name + ': the way back says "Back to the station"', (await fr.locator('#goback').textContent()) === 'Back to the station');
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_own_6_end.png') });
    await fr.locator('#goback').click(); await closed();
    want(name + ': Back to the station closes the battle', /closed \(finished\)\. The cadet won/.test(await page.locator('#said').textContent()), await page.locator('#said').textContent());
    want(name + ': a finished battle is not "in progress"', await page.evaluate(() => GMQBattleOwn.inProgress() === null));
    // Marc, 28 November: battles are rationed. With again: false there is no "Battle again": every battle starts from the game
    await page.evaluate(() => localStorage.removeItem('gmq_battle_own_v1'));
    await page.evaluate(() => GMQBattleOwn.open({}, { cards: GMQBattleOwn.starter(5), seed: 5, again: false, back: 'Back to the station' }, function (r) { window.__r = r; }));
    await fr.locator('#ogo').click(); await fr.locator('.hc.mine').first().waitFor();
    await inner(() => { const S = GMQB.U.S; S.P[1].parts.forEach(p => { p.hp = 0; }); S.over = { winner: 0, why: 'All five enemy parts are at 0. You win.' }; GMQB.U.anim = false; GMQB.endRound(); });
    await fr.locator('#goback').waitFor({ timeout: 20000 });
    want(name + ': with again: false, the end offers no "Battle again"', await fr.locator('#again').count() === 0);
    await fr.locator('#goback').click(); await closed();
    // 6. lasting upgrades (the plan's decision 1): the parts start at Level 2 and the cards stay out of the deck
    await page.locator('#ups button[data-u="lasting"]').click();
    await openFor('spies');
    t = await fr.locator('#odeck').textContent();
    want(name + ': lasting upgrades: the deck says which parts are Level 2, and holds no upgrade card', /Your upgrades make your (Weapons|Shield Gen) and your (Weapons|Shield Gen) Level 2/.test(t) && !/upgrade(s)?\./.test(t.split('It is shuffled')[0]), t);
    await fr.locator('#ogo').click(); await fr.locator('.hc.mine').first().waitFor();
    want(name + ': and the battle starts with them at Level 2', await inner(() => GMQB.U.S.P[0].parts.filter(p => p.lvl === 2).map(p => p.part).sort().join(',')) === 'Shield Generator,Weapons System');
    await fr.locator('#bnew').click(); await closed();
    await page.locator('#ups button[data-u="card"]').click();

    // 7. a classmate's saved deck (job 5; the server's battle_start): friendly, then a challenge with the cards at stake
    await page.locator('#who button[data-k="starter"]').click();
    await page.locator('#vs button[data-v="cpu"]').click(); await page.locator('#open').click(); await fr.locator('#stage').waitFor();
    const practiceRound = await inner(() => { const U = GMQB.U; if (!U.S || U.S.over) return -1; return U.S.round; });
    await fr.locator('#bnew').click(); await closed();
    await page.locator('#vs button[data-v="friendly"]').click(); await page.locator('#open').click(); await fr.locator('#ownsetup.open').waitFor();
    want(name + ': a classmate\'s deck: the setup is new, not the practice battle left open', practiceRound > 0 && /A friendly battle against Blue Fox/.test(await fr.locator('#otitle').textContent()));
    want(name + ': friendly: nothing at stake, and it says so', !(await fr.locator('#ostake').isVisible()) && /Nothing is at stake/.test(await fr.locator('#ostory').textContent()));
    want(name + ': the classmate\'s cards are not shown before the battle, only how many', /Blue Fox’s deck has \d+ cards/.test(await fr.locator('#oenemy').textContent()) && /only when they are played/.test(await fr.locator('#oenemy').textContent()));
    await fr.locator('#ogo').click(); await fr.locator('.hc.mine').first().waitFor();
    const rv = await inner(() => { const U = GMQB.U, R = GMQB.own.rival, d = GMQB.B.ownDeck(R.cards, R.seed, 'card', null).deck.slice().sort().join(','), S = U.S;
      return { same: S.P[1].deck.concat(S.P[1].hand).slice().sort().join(',') === d, weapons: S.P[1].parts[3].kind, seed: R.seed }; });
    want(name + ': the computer flies the classmate\'s own deck, by the same deck rules', rv.same);
    want(name + ': and the classmate\'s ship, with the part card in their deck (a Lucky Draw weapon)', rv.weapons === 'lucky', rv.weapons);
    const deal = await inner(() => { const U = GMQB.U, R = GMQB.own.rival, P = GMQB.B.ownDeck(GMQB.own.cards, GMQB.own.seed, 'card', U.spy), F = GMQB.B.ownDeck(R.cards, R.seed, 'card', null);
      const T = GMQB.B.newBattle(GMQB.B.defaults(), U.kinds, U.S.P[1].parts.map(p => p.kind), R.seed, [P.deck, F.deck], [P.lvl2, F.lvl2]); return T.P[0].hand.join() === U.S.P[0].hand.join() && T.P[1].hand.join() === U.S.P[1].hand.join(); });
    want(name + ': the deal comes from the server\'s seed, so the battle could be played again', deal);
    await fr.locator('#bnew').click(); await closed();
    want(name + ': leaving says the battle is saved', /It is saved, to finish later/.test(await page.locator('#said').textContent()));
    await page.locator('#vs button[data-v="cpu"]').click(); await page.locator('#open').click(); await fr.locator('#stage').waitFor();
    want(name + ': the practice battle left open is still there, at its round', await inner(() => GMQB.U.S && GMQB.U.S.round) === practiceRound);
    await fr.locator('#bnew').click(); await closed();
    await page.locator('#vs button[data-v="friendly"]').click(); await page.locator('#open').click(); await fr.locator('#stage').waitFor();
    want(name + ': and the friendly battle goes on too', await inner(() => !!GMQB.U.S && GMQB.own.rival && GMQB.own.rival.kind === 'friendly' && !/open/.test(document.getElementById('ownsetup').className)));
    await fr.locator('#bnew').click(); await closed();
    // a challenge: both cards at stake first; back out; then agree
    await page.locator('#vs button[data-v="challenge"]').click(); await page.locator('#open').click(); await fr.locator('#ownsetup.open').waitFor();
    want(name + ': challenge: both cards at stake are shown before agreeing', await fr.locator('#ostake').isVisible() && await fr.locator('#ostakes .st svg').count() === 2 && /You put up/.test(await fr.locator('#ostakes').textContent()) && /Blue Fox puts up/.test(await fr.locator('#ostakes').textContent()));
    want(name + ': the rules of the stake, in words (Marc, 23 November)', /yours from your deck, Blue Fox’s from Blue Fox’s deck\. The winner gets both cards\. In a tie, you each keep your own card\. Both cards stay in their decks, so you may each play yours\./.test(await fr.locator('#ostakep').textContent()));
    want(name + ': the buttons say "I agree" and "Back out"', (await fr.locator('#ogo').textContent()) === 'I agree: start the battle' && (await fr.locator('#oback').textContent()) === 'Back out');
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_own_7_challenge.png') });
    await fr.locator('#ostakes .st[data-id]').first().click();
    want(name + ': a card at stake opens large when tapped, and Back closes it', await inner(() => /open/.test(document.getElementById('pop').className)) && (await fr.locator('#popx').click(), !(await inner(() => /open/.test(document.getElementById('pop').className)))));
    await fr.locator('#oback').click(); await closed();
    want(name + ': backing out moves nothing, and the game is told', /\(backed out\)\. Nothing moves/.test(await page.locator('#said').textContent()), await page.locator('#said').textContent());
    await page.locator('#open').click(); await fr.locator('#ownsetup.open').waitFor();
    await fr.locator('#ogo').click(); await fr.locator('.hc.mine').first().waitFor();
    want(name + ': agreeing tells the game (battle_accept), and the battle starts', /battle_accept, demo-challenge/.test(await page.locator('#said').textContent()));
    await inner(() => { const S = GMQB.U.S; S.P[0].parts.forEach(p => { p.hp = 0; }); S.log.push({ round: 1, card: ['A01', 'A01'], lines: ['A test round.'] }); S.over = { winner: 1, why: 'All five of your parts are at 0. The enemy wins.' }; GMQB.U.anim = false; GMQB.endRound(); });
    await fr.locator('#goback').waitFor({ timeout: 20000 });
    want(name + ': after a classmate\'s battle there is no "Battle again" (a new one starts on the server)', await fr.locator('#again').count() === 0);
    await fr.locator('#goback').click(); await closed();
    want(name + ': the game gets the result from the child\'s side and a log for the teacher', /battle_end, lost, with a log of [1-9]\d* letters and a record of \d+ rounds?/.test(await page.locator('#said').textContent()), await page.locator('#said').textContent());
    await page.locator('#vs button[data-v="oldcard"]').click(); await page.locator('#open').click(); await fr.locator('#ownsetup.open').waitFor();
    want(name + ': a card at stake that is not in the catalogue (an old card) shows its name and kind', /Void Vortex/.test(await fr.locator('#ostakes .plain').textContent()) && /rare card/.test(await fr.locator('#ostakes .plain').textContent()));
    await fr.locator('#oback').click(); await closed();
    await page.locator('#vs button[data-v="cpu"]').click();
    // 8. the ship the child fitted at the station (the game's numbers today): it flies as it is, and the computer's ship is the same
    await page.evaluate(() => localStorage.removeItem('gmq_battle_own_v1'));   // no practice battle left open on this iPad
    await page.locator('#who button[data-k="station"]').click(); await page.locator('#vs button[data-v="cpu"]').click();
    await page.locator('#open').click(); await fr.locator('#ownsetup.open').waitFor();
    want(name + ': the station ship: the screen says so, and shows its five parts', (await fr.locator('#oshiph').textContent()) === 'Your ship, as you fitted it at the station' && /Stellar Reactor/.test(await fr.locator('#oship').textContent()) && /Neutron Wall/.test(await fr.locator('#oship').textContent()));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_own_8_station_ship.png') });
    await fr.locator('#ogo').click(); await fr.locator('.hc.mine').first().waitFor();
    const sp = await inner(() => GMQB.U.S.P.map(pl => pl.parts.map(p => p.name + ' ' + p.max + '/' + p.ap).join(', ')));
    want(name + ': the battle flies those numbers, for both ships', sp[0] === 'Stellar Reactor 30/10, Standard Navigator 15/5, Neutron Wall 30/0, Standard Arsenal 10/15, Standard Battery 15/10' && sp[1] === sp[0], sp.join(' | '));
    await page.reload(); await page.locator('#who button[data-k="station"]').click(); await page.locator('#open').click(); await fr.locator('#stage').waitFor();
    want(name + ': closed and opened again, the station ship\'s battle goes on and draws', await inner(() => !!GMQB.U.S && document.querySelectorAll('#stage .pod').length >= 10));
    await fr.locator('#bnew').click(); await closed();
    await page.locator('#who button[data-k="starter"]').click();

    // the order box over a ship shows 3 lines of 30 letters: every card's words, and the enemy's words for it, must fit (from the independent review)
    await page.locator('#open').click(); await fr.locator('#stage').waitFor();   // (the practice battle left open earlier goes on: that is right)
    const long = await inner(() => GMQB.B && window.GMQB ? (function () { const D = JSON.parse(document.getElementById('carddata').textContent), out = []; D.cards.concat(D.upgrades).forEach(c => { if (GMQB.wrap(c.text, 30).length > 3) out.push(c.id + ' own'); if (GMQB.wrap(GMQB.theirs(c), 30).length > 3) out.push(c.id + ' enemy'); }); return out; })() : ['no page']);
    want(name + ': every card\'s words fit the order box, on both sides', long.length === 0, long.join(', '));
    await fr.locator('#bnew').click(); await closed();
    want(name + ': no error on the page', errs.length === 0, errs.join(' | '));
    await ctx.close();
  }
  await browser.close();
  console.log(bad.length ? 'FAILED: ' + bad.join('; ') : 'ALL OK');
  process.exit(bad.length ? 1 : 0);
})();
