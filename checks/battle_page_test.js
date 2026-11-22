// Battle thread, step C. Plays the practice battle as a child would, at three screen sizes.
// The screen is Marc's of 22 November: the hand large in the middle, your shield lit, your attack in the top corner,
// your parts along the bottom with their lost-part rules, and one job for the player: sharing an attack out between parts.
// Run:  node checks/battle_page_test.js [folder for pictures]
// The last line is "ALL OK" or the list of what failed.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const PAGE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'card_battle.html');
const FILE = PAGE + '?fast';
const SHOTS = process.argv[2] || null;
const SIZES = [['ipad_sideways', 1180, 745, 150], ['ipad_upright', 820, 1180, 150], ['phone', 390, 760, 100]];
const BOARD = { 'Weapons': 'cannot attack', 'Engine': 'lose 1 card', 'Navigation': 'lose 1 card', 'Shield Gen': 'cannot defend', 'Power': 'cannot heal' };   // Marc's battle board
const bad = [];
let passed = 0, LAST = 'starting';
function pass(label, ok, extra) { if (ok) { passed++; } else { console.log('FAIL ' + label + (extra ? ': ' + extra : '')); if (bad.indexOf(label) < 0) bad.push(label); } return ok; }
const watchdog = setTimeout(() => { console.log('FAIL the test stalled for 4 minutes. Last seen: ' + LAST); process.exit(2); }, 240000);

async function shot(page, name) { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + '.png') }); } }
async function state(page) {
  return page.evaluate(() => {
    const U = window.GMQB.U, S = U.S, q = id => document.getElementById(id);
    const r = e => { if (!e) return null; const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; };
    const all = s => Array.from(document.querySelectorAll(s));
    return {
      phase: U.phase, round: S ? S.round : 0, over: S && S.over ? S.over : null, anim: U.anim, leader: S ? S.leader : -1,
      pick: U.pick ? { side: U.pick.side, among: U.pick.among, n: U.pick.n, chosen: U.pick.chosen } : null,
      req: U.req || null, split: U.split ? { among: U.split.req.among, total: U.split.total, limit: !!U.split.req.limit, err: U.split.err || '' } : null,
      swap: !!q('swy'), nextr: !!q('nextr'), again: !!q('again'), cgo: q('cgo') ? !q('cgo').disabled : null, mno: !!q('mno'), play: r(q('playit')),
      msg: q('msg').textContent, note: q('note') ? q('note').textContent : '', hint: q('shint') ? q('shint').textContent : '',
      hand: S ? S.P[0].hand.slice() : [], hp: S ? S.P.map(p => p.parts.map(x => x.hp)) : [], shield: S ? S.P.map(p => p.shield) : [],
      cards: all('.hc').map(e => Object.assign(r(e), { id: e.getAttribute('data-id'), tag: e.querySelector('.tag') ? e.querySelector('.tag').textContent : '' })),
      ecard: r(q('ecard')), ecardId: q('ecard') ? q('ecard').getAttribute('data-id') : null,
      check: r(q('check')), pad: r(q('pad')), boxes: all('#srow .box').map(e => Object.assign(r(e), { ix: +e.getAttribute('data-ix') })),
      tiles: all('#myparts .pt').map(r), etiles: all('#eparts .pt').map(r), mysh: r(q('mysh')), esh: r(q('esh')), myatk: r(q('myatk')), mid: r(q('mid')),
      myshText: q('mysh').textContent, myshOn: /\bon\b/.test(q('mysh').className), myatkText: q('myatk').textContent, eatkText: q('eatk').textContent,
      rules: all('#myparts .pt').map(e => [e.querySelector('.pn').textContent, e.querySelector('.rule').textContent]),
      numsFit: all('.pt').every(e => { const t = e.getBoundingClientRect(); return Array.from(e.querySelectorAll('.n')).every(n => { const b = n.getBoundingClientRect(); return b.left >= t.left - 1 && b.right <= t.right + 1 && b.top >= t.top - 1 && b.bottom <= t.bottom + 1; }); }),
      roundText: q('round').textContent, lastRound: S && S.log.length ? S.log[S.log.length - 1].round : 0,
      vw: innerWidth, vh: innerHeight, docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth
    };
  });
}
async function idle(page) { await page.waitForFunction(() => window.GMQB.idle(), null, { timeout: 20000 }); }
async function typeBox(page, ix, n) {
  await page.locator('#srow .box[data-ix="' + ix + '"]').tap();
  for (let k = 0; k < 3; k++) await page.locator('#pad button[data-k="del"]').tap();
  for (const ch of String(n)) await page.locator('#pad button[data-k="' + ch + '"]').tap();
}
// One pass answers whatever the page is asking for.
async function act(page, name, flags, minCard) {
  await idle(page);
  const st = await state(page);
  LAST = name + ' round ' + st.round + ' ' + st.phase + ' | ' + st.msg.slice(0, 70);
  if (st.over || st.again) return 'over';
  pass(name + ': no sum is ever asked outside a split', st.phase === 'split' || !st.check);
  if (st.phase === 'pick') {
    pass(name + ': the hand is on the screen', st.cards.length >= 3 && st.cards.length <= 5, String(st.cards.length));
    pass(name + ': every card of the hand is large and inside the screen', st.cards.every(c => c.w >= minCard && c.l >= -1 && c.r <= st.vw + 1 && c.t >= 0 && c.b <= st.vh), JSON.stringify(st.cards.map(c => Math.round(c.w))));
    pass(name + ': the hand is in the middle, between the enemy and your ship', st.cards.every(c => c.t >= st.etiles[0].b - 1 && c.b <= st.mysh.t + 1));
    if (/goes first/.test(st.msg)) { flags.enemyLed = true; pass(name + ': when the enemy goes first, its card lies beside your hand, as large as your own', st.ecard && Math.abs(st.ecard.w - st.cards[0].w) < 3 && st.ecard.t >= st.etiles[0].b - 1 && st.ecard.b <= st.mysh.t + 1, st.ecard ? Math.round(st.ecard.w) + ' against ' + Math.round(st.cards[0].w) : 'no card'); }
    if (/You go first/.test(st.msg)) { flags.youLed = true; pass(name + ': when you go first, no enemy card is shown', !st.ecard && /You go first/.test(st.msg)); }
    let i = st.cards.findIndex(c => !c.tag); if (i < 0) i = 0;
    await page.locator('.hc').nth(i).tap();
    const b = await state(page);
    pass(name + ': the Play button is on the screen', b.play && b.play.b <= b.vh + 1 && b.play.t >= 0);
    await page.locator('#playit').tap();
    return 'played';
  }
  if (st.swap) { await page.locator('#swy').tap(); return 'swap'; }
  if (st.nextr) { await page.locator('#nextr').tap(); return 'next'; }
  if (st.phase === 'split' && st.split) {
    const boxes = st.boxes;
    pass(name + ': the split shows the number pad and Check on the screen', st.check && st.check.b <= st.vh + 1 && st.pad.t >= 0, JSON.stringify(st.check));
    pass(name + ': every box of the split is in view, above the number pad', boxes.length === st.split.among.length && boxes.every(b => b.t >= 0 && b.b <= st.pad.t + 1));
    pass(name + ': each box stands over its own ship part', boxes.every(b => { const t = st.tiles[b.ix], c = (b.l + b.r) / 2; return c >= t.l && c <= t.r; }));
    if (st.req && st.req.type === 'amounts' && !st.split.limit) {
      flags.splits = (flags.splits || 0) + 1;
      if (!flags.shotSplit) { flags.shotSplit = true; await shot(page, name + '_4_split'); }
      if (!flags.wrongSplit) {
        flags.wrongSplit = true;
        await typeBox(page, st.split.among[0], st.split.total + 3);
        await page.locator('#check').tap();
        const after = await state(page);
        pass(name + ': a split that does not add up is not accepted, and the page says what it makes', /Your numbers make \d+\. The attack is \d+\./.test(after.hint) && JSON.stringify(after.hp) === JSON.stringify(st.hp), after.hint);
        await shot(page, name + '_5_wrong_split');
      }
    }
    if (st.req && st.req.type === 'move') { await typeBox(page, st.split.among[0], 1); await page.locator('#check').tap(); const a = await state(page); if (a.phase === 'split') { await typeBox(page, st.split.among[0], 0); await page.locator('#check').tap(); } return 'move'; }
    const ch = await page.evaluate(() => window.GMQB.B.cpuChoose(window.GMQB.U.S, window.GMQB.U.req));
    for (const ix of st.split.among) await typeBox(page, ix, ch[ix]);
    await page.locator('#check').tap();
    return 'split';
  }
  if (st.pick) {
    const side = st.pick.side, need = st.pick.n - st.pick.chosen.length;
    if (need > 0) { const next = st.pick.among.filter(x => st.pick.chosen.indexOf(x) < 0)[0]; await page.locator('.pt[data-side="' + side + '"][data-ix="' + next + '"]').tap(); return 'tile'; }
    if (st.cgo) { await page.locator('#cgo').tap(); return 'go'; }
  }
  return 'wait';
}

(async () => {
  const browser = await chromium.launch();
  for (const [name, w, h, minCard] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('dialog', d => d.accept());
    await page.goto(FILE);
    // ---- the first screen
    pass(name + ': the first screen says why, before anything else', await page.locator('#setup.open').count() === 1 && /practice battle/i.test(await page.locator('#setup').textContent()));
    pass(name + ': the first screen says 1 Spy card and 2 policemen in each deck', /1 Spy card and 2 policemen/.test(await page.locator('#setup').textContent()));
    await shot(page, name + '_1_setup');
    await page.locator('#myship button').nth(3).tap();
    pass(name + ': tapping a part changes its kind', /Proton Launcher/.test(await page.locator('#myship').textContent()));
    await page.locator('#sstd').tap();
    await page.evaluate(() => window.GMQB.setSeed(2026));
    await page.locator('#sgo').tap();
    let st = await state(page);
    pass(name + ': the battle starts at round 1 with 5 cards and two shields of 100', st.round === 1 && st.hand.length === 5 && st.shield[0] === 100 && st.shield[1] === 100);
    const deck = await page.evaluate(() => { const B = window.GMQB.B, p = window.GMQB.U.S.P.map(x => x.deck.concat(x.hand)); return p.map(a => [a.length, a.filter(B.isSpy).length, a.filter(B.isGuard).length]); });
    pass(name + ': each deck has one Spy card and two policemen', deck.every(d => d[1] === 1 && d[2] === 2), JSON.stringify(deck));
    pass(name + ': the page does not scroll', st.docH <= st.vh + 1 && st.docW <= st.vw + 1, st.docW + 'x' + st.docH + ' in ' + st.vw + 'x' + st.vh);
    // ---- Marc's layout
    pass(name + ': your shield is lit and shows how much is left', st.myshOn && st.myshText === 'MAIN SHIELD 100', st.myshText);
    pass(name + ': your attack points are in the top corner', st.myatk.l < st.vw * 0.2 && st.myatk.t < 70 && /YOUR ATTACK\s*55/.test(st.myatkText), st.myatkText);
    pass(name + ': your five parts are along the bottom', st.tiles.length === 5 && st.tiles.every(t => t.b >= st.vh - 24 && t.b <= st.vh + 1 && t.t > st.mysh.t));
    pass(name + ': each part shows what you lose with it, as on the battle board', st.rules.every(r => r[1] === 'If lost: ' + BOARD[r[0]]), JSON.stringify(st.rules));
    pass(name + ': every HP and AP number is inside its part', st.numsFit);
    pass(name + ': the enemy ship is above, your ship below, the cards between', st.etiles.every(t => t.b <= st.mid.t + 1) && st.mid.b <= st.mysh.t + 1);
    await shot(page, name + '_2_pick');
    await page.locator('.hc').nth(0).tap();
    await shot(page, name + '_3_chosen');

    // ---- play as a child
    const flags = {};
    let guard = 0, leftOnce = false, midOnce = false;
    while (guard++ < 600) {
      st = await state(page);
      if (st.over) break;
      if (!leftOnce && st.phase === 'pick' && st.round === 3 && !st.anim) {
        leftOnce = true;
        await page.evaluate(() => new Promise(r => setTimeout(r, 60)));
        await page.reload();
        const b = await state(page);
        pass(name + ': closing the page and opening it again keeps the battle', b.round === st.round && JSON.stringify(b.hand) === JSON.stringify(st.hand) && JSON.stringify(b.hp) === JSON.stringify(st.hp) && JSON.stringify(b.shield) === JSON.stringify(st.shield), JSON.stringify([b.round, st.round]));
        continue;
      }
      if (!midOnce && st.phase === 'split' && st.req && st.req.type === 'amounts' && !st.split.limit) {
        midOnce = true;
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('gmq_battle_v2')));
        await page.reload();
        const b = await state(page);
        pass(name + ': leaving in the middle of a round starts that round again, with the same hand', b.phase === 'pick' && b.round === saved.S.round && JSON.stringify(b.hand) === JSON.stringify(saved.S.P[0].hand) && JSON.stringify(b.hp) === JSON.stringify(saved.S.P.map(p => p.parts.map(x => x.hp))));
        continue;
      }
      await act(page, name, flags, minCard);
    }
    st = await state(page);
    pass(name + ': the player shared an attack out between parts', (flags.splits || 0) >= 1, String(flags.splits));
    pass(name + ': a wrong split was tried', !!flags.wrongSplit);
    pass(name + ': the lead passed from one player to the other', !!flags.enemyLed && !!flags.youLed);
    pass(name + ': the battle reaches an end', !!st.over, 'round ' + st.round);
    if (st.over) {
      const b = st.hp.map(a => a.every(x => x === 0));
      pass(name + ': the ending matches the ships', st.over.winner === 0 ? b[1] && !b[0] : st.over.winner === 1 ? b[0] && !b[1] : true, JSON.stringify(st.over));
      pass(name + ': the ending is said in words', st.msg.length > 10 && st.again, st.msg);
      pass(name + ': the round on the screen is the round in the log', st.roundText === 'Round ' + st.lastRound, st.roundText + ' against ' + st.lastRound);
      console.log('     ' + name + ': the battle ended in round ' + (st.round - 1) + ': ' + st.over.why);
    }
    await shot(page, name + '_6_over');
    await page.locator('#seelog').tap();
    const lg = await page.locator('#loglist .lg').count();
    pass(name + ': the log lists every round', lg >= st.round - 1, lg + ' for ' + (st.round - 1));
    await page.locator('#lclose').tap();
    await page.locator('#bhelp').tap();
    pass(name + ': "How" shows the six symbols and the lost-part rules', await page.locator('#keyrow svg').count() === 6 && /cannot attack/.test(await page.locator('#help').textContent()));
    await shot(page, name + '_7_how');
    await page.locator('#hclose').tap();
    await page.locator('#brules').tap();
    pass(name + ': the rules screen lists every switch', await page.locator('#switches .sw').count() === 14);
    await page.locator('#rclose').tap();
    await page.locator('#again').tap();
    pass(name + ': New battle goes back to the first screen', await page.locator('#setup.open').count() === 1);

    if (name === 'ipad_sideways') {
      // ---- the two "both together" ways to play, a few rounds each
      for (const [mode, idx] of [['swap', 1], ['blind', 2]]) {
        await page.locator('#srules').tap();
        await page.locator('#switches button[data-key="guard"][data-i="' + idx + '"]').tap();
        await page.locator('#rnew').tap();
        await page.evaluate(() => window.GMQB.setSeed(4711));
        await page.locator('#sgo').tap();
        let g = 0;
        while (g++ < 300) { st = await state(page); if (st.over || st.round > 5) break; if (st.phase === 'pick') pass(name + ': with both cards put down together, no enemy card is shown before you choose', !st.ecard); await act(page, name, flags, minCard); }
        st = await state(page);
        pass(name + ': a battle played "' + mode + '" plays on', st.round > 5 || !!st.over, 'round ' + st.round);
        await page.locator('#bnew').tap();
      }
      // ---- Marc's rule: a common card cannot block a rare attack card
      await page.locator('#srules').tap();
      await page.locator('#switches button[data-key="guard"][data-i="0"]').tap();
      await page.locator('#rnew').tap();
      await page.evaluate(() => window.GMQB.setSeed(5));
      await page.locator('#sgo').tap();
      await page.evaluate(() => { const U = window.GMQB.U, S = U.S; S.leader = 1; function put(pl, id, at) { let h = pl.hand.indexOf(id); if (h >= 0 && h !== at) { const t = pl.hand[at]; pl.hand[at] = id; pl.hand[h] = t; } else if (h < 0) { const d = pl.deck.indexOf(id); pl.deck.splice(d, 1); pl.deck.push(pl.hand[at]); pl.hand[at] = id; } } put(S.P[1], 'A08', 0); put(S.P[0], 'D02', 0); put(S.P[0], 'D06', 1); U.cpuLead = 0; });
      await page.locator('.hc').nth(0).tap();
      st = await state(page);
      pass(name + ': a common block card is marked "cannot block" against the rare card on the table', st.cards[0].tag === 'cannot block' && /enemy's card is rare\. A common card cannot block it/.test(st.note), st.cards[0].tag + ' | ' + st.note);
      pass(name + ': a rare block card is not marked', st.cards[1].tag === '');
      await shot(page, name + '_8_block_rule');
      await page.locator('#playit').tap();
      let g2 = 0; while (g2++ < 60) { st = await state(page); if (st.phase === 'roundend' || st.over) break; await act(page, name, flags, minCard); }
      const L = await page.evaluate(() => { const S = window.GMQB.U.S, l = S.log[S.log.length - 1]; return { atk: l.atk, block: l.block, through: l.through, lines: l.lines.join(' ') }; });
      pass(name + ': played anyway, the common card blocks nothing and the log says why', L.block[0] === 0 && L.through[0] === L.atk[1] && /is common\. It cannot block a rare attack card/.test(L.lines), JSON.stringify(L).slice(0, 200));
      await page.locator('#bnew').tap();

      // ---- movement, at real speed: a laser, a number that floats up, a Spy that flies
      const p2 = await ctx.newPage();
      await p2.goto(PAGE);
      await p2.evaluate(() => { localStorage.removeItem('gmq_battle_v2'); });
      await p2.reload();
      await p2.evaluate(() => window.GMQB.setSeed(5));
      await p2.locator('#sgo').tap();
      await p2.evaluate(() => { const U = window.GMQB.U, S = U.S; S.leader = 1; function put(pl, id, at) { let h = pl.hand.indexOf(id); if (h >= 0 && h !== at) { const t = pl.hand[at]; pl.hand[at] = id; pl.hand[h] = t; } else if (h < 0) { const d = pl.deck.indexOf(id); pl.deck.splice(d, 1); pl.deck.push(pl.hand[at]); pl.hand[at] = id; } } const spy = S.P[0].deck.concat(S.P[0].hand).filter(window.GMQB.B.isSpy)[0]; put(S.P[1], 'A01', 0); put(S.P[0], spy, 0); U.cpuLead = 0; U.sel = 0; });
      await p2.locator('.hc').nth(0).tap();
      await p2.locator('#playit').tap();
      const seen = { fly: false, beam: false, pop: false, shotSpy: false, shotBeam: false };
      const t0 = Date.now();
      while (Date.now() - t0 < 30000) {
        const s2 = await p2.evaluate(() => { const U = window.GMQB.U, f = document.getElementById('fx'); return { phase: U.phase, fly: !!f.querySelector('.fly'), beam: !!f.querySelector('.beam'), pop: !!f.querySelector('.pop'), pick: U.pick ? { side: U.pick.side, among: U.pick.among, n: U.pick.n, chosen: U.pick.chosen.length } : null, cgo: document.getElementById('cgo') ? !document.getElementById('cgo').disabled : null }; });
        if (s2.fly) { if (!seen.shotSpy) { seen.shotSpy = true; await shot(p2, name + '_9_spy_flies'); } seen.fly = true; }
        if (s2.beam) { if (!seen.shotBeam) { seen.shotBeam = true; await shot(p2, name + '_9_laser'); } seen.beam = true; }
        if (s2.pop) seen.pop = true;
        if (s2.phase === 'roundend' || s2.phase === 'over') break;
        if (s2.pick && s2.pick.chosen < s2.pick.n) await p2.locator('.pt[data-side="' + s2.pick.side + '"][data-ix="' + s2.pick.among[0] + '"]').tap();
        else if (s2.cgo) await p2.locator('#cgo').tap();
        else await p2.waitForTimeout(60);
      }
      pass(name + ': at real speed a Spy flies to the part it hits', seen.fly);
      pass(name + ': at real speed a laser fires', seen.beam);
      pass(name + ': at real speed the damage floats up as a number', seen.pop);
      await p2.close();
    }
    pass(name + ': no script errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await browser.close();
  clearTimeout(watchdog);
  console.log('     ' + passed + ' checks passed');
  console.log(bad.length ? 'FAILED: ' + bad.join('; ') : 'ALL OK');
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.log('FAIL the test stopped with an error: ' + String(e).slice(0, 300) + ' | last seen: ' + LAST); process.exit(3); });
