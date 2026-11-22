// Battle thread, step C. Plays the practice battle as a child would, at three screen sizes.
// The screen is a space battle (Marc, 22 November: "a space battle. That's what they should feel like"):
// two ships, the five parts as places on each ship, the Main Shield as a bubble, the cards as orders.
// The page does every sum. The player's one job is to send an incoming hit, block by block, to the parts they choose.
// Run:  node checks/battle_page_test.js [folder for pictures]
// The last line is "ALL OK" or the list of what failed.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const PAGE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'card_battle.html');
const FILE = PAGE + '?fast';
const SHOTS = process.argv[2] || null;
// name, width, height, smallest hand card, smallest HP number, smallest "if lost" words (all in screen points)
const SIZES = [['ipad_sideways', 1180, 745, 150, 20, 10], ['ipad_upright', 820, 1180, 140, 20, 10], ['phone', 390, 760, 60, 10, 5]];
const BOARD = { 'Weapons': 'cannot attack', 'Engine': 'lose 1 card', 'Navigation': 'lose 1 card', 'Shield Gen': 'cannot defend', 'Power': 'cannot heal' };   // Marc's battle board
const KEY = 'gmq_battle_v3';
const bad = [];
let passed = 0, LAST = 'starting';
function pass(label, ok, extra) { if (ok) { passed++; } else { console.log('FAIL ' + label + (extra ? ': ' + extra : '')); if (bad.indexOf(label) < 0) bad.push(label); } return ok; }
const watchdog = setTimeout(() => { console.log('FAIL the test stalled for 5 minutes. Last seen: ' + LAST); process.exit(2); }, 300000);
const PUT = 'function put(pl,id,at){var h=pl.hand.indexOf(id);if(h>=0&&h!==at){var t=pl.hand[at];pl.hand[at]=id;pl.hand[h]=t;}else if(h<0){var d=pl.deck.indexOf(id);pl.deck.splice(d,1);pl.deck.push(pl.hand[at]);pl.hand[at]=id;}}';

async function shot(page, name) { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + '.png') }); } }
async function state(page) {
  return page.evaluate(() => {
    const U = window.GMQB.U, S = U.S, B = window.GMQB.B, q = id => document.getElementById(id);
    const r = e => { if (!e) return null; const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; };
    const all = s => Array.from(document.querySelectorAll(s));
    const txt = (e, s) => { const x = e && e.querySelector(s); return x ? x.textContent : null; };
    const pods = side => [0, 1, 2, 3, 4].map(ix => { const e = q('pod' + side + ix); return e ? { ix: ix, box: r(e.querySelector('.fr')), hp: txt(e, '.hp'), ap: txt(e, '.ap'), rule: txt(e, '.rule'), hpBox: r(e.querySelector('.hp')), ruleBox: r(e.querySelector('.rule')), al: txt(e, '.al'), can: /\bcan\b/.test(e.getAttribute('class')), lost: /LOST/.test(e.textContent), text: e.textContent } : null; });
    const A = U.alloc;
    return {
      phase: U.phase, round: S ? S.round : 0, over: S && S.over ? S.over : null, anim: U.anim, leader: S ? S.leader : -1,
      pick: U.pick ? { side: U.pick.side, among: U.pick.among, n: U.pick.n, chosen: U.pick.chosen.slice(), two: !!U.pick.done } : null,
      alloc: A ? { among: A.among.slice(), total: A.total, limit: A.limit, cells: A.cells.slice(), sel: A.sel || 0, placed: A.among.map(ix => (A.placed[ix] || []).reduce((a, b) => a + b, 0)), err: A.err || '' } : null,
      swap: !!q('swy'), nextr: !!q('nextr'), again: !!q('again'), cgo: q('cgo') ? !q('cgo').disabled : null, mno: !!q('mno'), mv: all('.mv').length, play: r(q('playit')), bigCard: r(document.querySelector('#pop.open .big svg')),
      fire: q('fire') ? { box: r(q('fire')), off: q('fire').disabled } : null, cells: all('.cell').map(e => Object.assign(r(e), { v: +e.textContent, lit: /\bnext\b/.test(e.className) })),
      msg: q('msg').textContent, note: q('note') ? q('note').textContent : '', fore: q('fore') ? Array.from(q('fore').children).map(x => x.textContent).join(' ') : '',
      apNow: S ? S.P.map(p => B.has(p, 'Weapons System') ? B.shipAP(p) : 0) : [], eFore: S && U.phase === 'pick' && S.opts.guard === 'lead' && S.leader === 1 && U.cpuLead >= 0 ? window.GMQB.plain(1, S.P[1].hand[U.cpuLead]) : null,
      lastLog: S && S.log.length ? { round: S.log[S.log.length - 1].round, atk: S.log[S.log.length - 1].atk, through: S.log[S.log.length - 1].through } : null, hint: q('ahint') ? q('ahint').textContent : '',
      hand: S ? S.P[0].hand.slice() : [], hp: S ? S.P.map(p => p.parts.map(x => x.hp)) : [], ap: S ? S.P.map(p => p.parts.map(x => x.ap)) : [], shield: S ? S.P.map(p => p.shield) : [],
      names: S ? S.P[0].parts.map(x => B.SHORT[x.part]) : [], shieldOn: S ? S.P.map(p => B.shieldWorks(S, p)) : [],
      cards: all('.hc.mine').map(e => Object.assign(r(e), { id: e.getAttribute('data-id'), tag: e.querySelector('.tag') ? e.querySelector('.tag').textContent : '' })),
      foecard: q('foecard') ? Object.assign(r(q('foecard')), { id: q('foecard').getAttribute('data-id') }) : null,
      order: [0, 1].map(i => q('order' + i) ? q('order' + i).getAttribute('data-id') : null), eLead: S && U.cpuLead >= 0 ? S.P[1].hand[U.cpuLead] : null,
      pods: [pods(0), pods(1)], bub: [!!q('bub0'), !!q('bub1')], shl: [txt(q('shl0'), '.sht'), txt(q('shl1'), '.sht')], shlBox: [r(q('shl0')), r(q('shl1'))],
      still: [0, 1].map(i => q('ship' + i) ? !/\bbob\b/.test(q('ship' + i).getAttribute('class')) : null), banner: q('banner') ? q('banner').textContent : null,
      myatk: r(q('myatk')), myatkText: q('myatk').textContent, eatkNum: q('eatk').querySelector('b') ? q('eatk').querySelector('b').textContent : '', eatkText: q('eatk').textContent, stage: r(q('stagewrap')), tray: r(q('tray')), btns: r(q('btns')),
      inputs: all('input,textarea,select').length, roundText: q('round').textContent, lastRound: S && S.log.length ? S.log[S.log.length - 1].round : 0,
      vw: innerWidth, vh: innerHeight, docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth
    };
  });
}
async function idle(page) { await page.waitForFunction(() => window.GMQB.idle(), null, { timeout: 20000 }); }
const podSel = (side, ix) => '#pod' + side + ix;
const inScreen = (b, st) => b && b.l >= -1 && b.r <= st.vw + 1 && b.t >= -1 && b.b <= st.vh + 1;

// Send `want` (an amount for each part) to the ship, block by block, breaking a block when it is too big.
async function placeBlocks(page, name, want) {
  let guard = 0;
  while (guard++ < 200) {
    const st = await state(page);
    if (!st.alloc || !st.alloc.cells.length) break;
    const A = st.alloc;
    let k = -1, ix = -1;
    for (let j = 0; j < A.among.length && ix < 0; j++) { const need = (want[A.among[j]] || 0) - A.placed[j]; if (need > 0) { ix = A.among[j]; const fits = A.cells.map((v, i) => [v, i]).filter(c => c[0] <= need); if (fits.length) { k = fits[0][1]; } else { k = -2 - A.cells.findIndex(v => v > 1); } } }
    if (ix < 0) { pass(name + ': the blocks left over match what is still to place', false, JSON.stringify(A)); break; }
    if (k <= -2) { await page.locator('.cell').nth(-2 - k).tap(); await page.locator('#brk').tap(); continue; }
    if (k !== A.sel) await page.locator('.cell').nth(k).tap();
    await page.locator(podSel(0, ix)).tap();
  }
}

// One pass answers whatever the page is asking for.
async function act(page, name, flags, size) {
  await idle(page);
  const st = await state(page);
  LAST = name + ' round ' + st.round + ' ' + st.phase + ' | ' + st.msg.slice(0, 70);
  if (st.over || st.again) return 'over';
  pass(name + ': no sum is ever asked: there is no box to type a number in', st.inputs === 0);
  pass(name + ': every HP on your ship is the HP in the rules engine', st.pods[0].every((p, ix) => p && (p.lost ? st.hp[0][ix] === 0 : +p.hp === st.hp[0][ix] && +p.ap === st.ap[0][ix])), JSON.stringify([st.pods[0].map(p => p.hp), st.hp[0]]));
  pass(name + ': the bubble is there exactly when the shield works, with its number', st.bub[0] === st.shieldOn[0] && (!st.shieldOn[0] || st.shl[0] === 'MAIN SHIELD ' + st.shield[0]), st.shl[0]);
  if (st.phase === 'pick') {
    pass(name + ': the hand is on the screen', st.cards.length >= 3 && st.cards.length <= 5, String(st.cards.length));
    pass(name + ': every card of the hand is large and inside the screen', st.cards.every(c => c.w >= size.card && inScreen(c, st)), JSON.stringify(st.cards.map(c => Math.round(c.w))));
    pass(name + ': the cards lie below the ships and do not cover them', st.cards.every(c => c.t >= st.stage.b - 1));
    pass(name + ': both ships are whole and on the screen while you choose', [0, 1].every(s => st.pods[s].every(p => p && inScreen(p.box, st) && p.box.t >= st.stage.t - 1 && p.box.b <= st.stage.b + 1)));
    if (/goes first/.test(st.msg)) {
      flags.enemyLed = true;
      if (size.w > size.h) pass(name + ': when the enemy goes first, its order lies beside your hand, as large as your cards', st.foecard && st.foecard.id === st.eLead && Math.abs(st.foecard.w - st.cards[0].w) < 3 && inScreen(st.foecard, st), JSON.stringify(st.foecard));
      else pass(name + ': when the enemy goes first, its order is shown over its ship', st.order[1] === st.eLead && !!st.eLead, String(st.order[1]));
      pass(name + ': when the enemy goes first with an attack card, the number at the top already has the card in it', !st.eFore || st.eFore.atk === 0 || st.eatkNum === String(st.eFore.atk), st.eatkNum + ' against ' + JSON.stringify(st.eFore));
      pass(name + ': and the words above the ships say that attack', !st.eFore || !st.eFore.isA || st.eFore.atk === 0 || st.msg.indexOf('Its attack is now ' + st.eFore.atk + '.') >= 0, st.msg);
      if (!flags.shotLed) { flags.shotLed = true; await shot(page, name + '_3_enemy_goes_first'); }
    }
    pass(name + ': your attack at the top is the AP of your working parts', st.apNow[0] > 0 ? new RegExp('(YOUR ATTACK|YOU)\\s*' + st.apNow[0] + '$').test(st.myatkText.trim()) : /NO ATTACK/.test(st.myatkText), st.myatkText + ' against ' + st.apNow[0]);
    if (/You go first/.test(st.msg)) { flags.youLed = true; pass(name + ': when you go first, no enemy order is shown', !st.foecard && !st.order[1]); }
    let i = st.cards.findIndex(c => !c.tag); if (i < 0) i = 0;
    await page.locator('.hc.mine').nth(i).tap();
    const b = await state(page);
    pass(name + ': a tapped card opens large, with "Give this order" on the screen', inScreen(b.play, b) && inScreen(b.bigCard, b) && b.bigCard.w >= Math.min(260, b.vw * 0.6), JSON.stringify(b.bigCard));
    if (!flags.shotPop && b.fore) { flags.shotPop = true; await shot(page, name + '_4_card_opened'); }
    flags.fore = { round: st.round, text: b.fore, shield: st.shield[0] };
    if (b.fore) flags.fores = (flags.fores || 0) + 1;
    await page.locator('#playit').tap();
    return 'played';
  }
  if (st.swap) { await page.locator('#swy').tap(); return 'swap'; }
  if (st.nextr) {
    // what the opened card foretold, against what happened
    const F = flags.fore, L = st.lastLog;
    if (F && L && F.round === L.round && F.text && !/if your Spy/.test(F.text)) {
      let m = /enemy's hit is (\d+)/.exec(F.text); if (m) pass(name + ': the opened card foretold the enemy\'s hit', +m[1] === L.atk[1], F.text + ' | ' + JSON.stringify(L));
      m = /: (\d+) gets through/.exec(F.text); if (m) pass(name + ': it foretold what gets through a block', +m[1] === L.through[0], F.text + ' | ' + JSON.stringify(L));
      m = /goes from (\d+) to (\d+)/.exec(F.text); if (m) pass(name + ': it foretold what the hit leaves of your shield', +m[2] === st.shield[0], F.text + ' | ' + st.shield[0]);
      if (/It will break/.test(F.text)) pass(name + ': it foretold that your shield breaks', st.shield[0] === 0, String(st.shield[0]));
      m = /Your attack(?: will be)?:? .*?(\d+)\.$/.exec(F.text); if (m) pass(name + ': it foretold your attack', +m[1] === L.atk[0], F.text + ' | ' + JSON.stringify(L));
    }
    pass(name + ': after a round, the attack at the top is what each ship can do now', (st.apNow[0] > 0 ? st.myatkText.indexOf(String(st.apNow[0])) >= 0 : /NO ATTACK/.test(st.myatkText)) && (st.apNow[1] > 0 ? st.eatkText.indexOf(String(st.apNow[1])) >= 0 : /NO ATTACK/.test(st.eatkText)), st.myatkText + ' | ' + st.eatkText + ' | ' + JSON.stringify(st.apNow));
    await page.locator('#nextr').tap(); return 'next';
  }
  if (st.phase === 'alloc' && st.alloc) {
    const A = st.alloc, sum = a => a.reduce((x, y) => x + y, 0);
    pass(name + ': the blocks add up to the hit', sum(A.cells) + sum(A.placed) === A.total, JSON.stringify(A));
    pass(name + ': the blocks are tens, fives and ones', A.cells.every(v => v === 10 || v === 5 || v === 1));
    pass(name + ': the blocks and the button are on the screen', st.cells.every(c => inScreen(c, st)) && inScreen(st.fire.box, st), JSON.stringify(st.fire));
    pass(name + ': the button is off until every block is placed', st.fire.off === (A.cells.length > 0));
    pass(name + ': every part you may choose is lit and on the screen', A.among.every(ix => st.pods[0][ix].can && inScreen(st.pods[0][ix].box, st)));
    pass(name + ': the ships hold still while you tap them', st.still[0] === true && st.still[1] === true);
    if (!A.limit) {
      flags.splits = (flags.splits || 0) + 1;
      if (!flags.shotAlloc) { flags.shotAlloc = true; await shot(page, name + '_5_incoming_hit'); }
      if (!flags.blockPlay && A.cells[0] === 10 && A.among.length >= 2) {
        flags.blockPlay = true;
        const ix = A.among[0];
        await page.locator(podSel(0, ix)).tap();
        let a = await state(page);
        const left = Math.max(0, st.hp[0][ix] - 10);
        pass(name + ': a tapped part takes the lit block, and the page says what it leaves', a.pods[0][ix].al === '−10' && new RegExp(left === 0 ? 'it will be lost' : 'leaves ' + left).test(a.pods[0][ix].text) && a.alloc.cells.length === A.cells.length - 1, a.pods[0][ix].text);
        pass(name + ': placing a block changes no HP yet', JSON.stringify(a.hp) === JSON.stringify(st.hp));
        await page.locator('#undo').tap();
        a = await state(page);
        pass(name + ': Undo gives the block back', JSON.stringify(a.alloc.cells) === JSON.stringify(A.cells) && a.pods[0][ix].al === null);
        await page.locator('#brk').tap();
        a = await state(page);
        pass(name + ': Break makes a ten into two fives, and the total stays', a.alloc.cells.length === A.cells.length + 1 && sum(a.alloc.cells) === A.total && a.alloc.cells.filter(v => v === 5).length === A.cells.filter(v => v === 5).length + 2, JSON.stringify(a.alloc.cells));
        await page.locator(podSel(0, A.among[1])).tap();
        await shot(page, name + '_6_blocks_placed');
        await page.locator('#reset').tap();
        a = await state(page);
        pass(name + ': Take all back gives every block back', JSON.stringify(a.alloc.cells) === JSON.stringify(A.cells) && sum(a.alloc.placed) === 0);
      }
    }
    const want = await page.evaluate(() => window.GMQB.B.cpuChoose(window.GMQB.U.S, window.GMQB.U.alloc.req));
    await placeBlocks(page, name, want);
    const b = await state(page);
    pass(name + ': with every block placed, the button is on', b.fire && !b.fire.off && b.alloc.cells.length === 0, JSON.stringify(b.alloc));
    await page.locator('#fire').tap();
    await idle(page);
    const c = await state(page);
    if (!A.limit) pass(name + ': each part lost exactly what was sent to it', A.among.every(ix => c.hp[0][ix] === Math.max(0, st.hp[0][ix] - want[ix])), JSON.stringify([st.hp[0], want, c.hp[0]]));
    return 'alloc';
  }
  if (st.mv) { await page.locator('.mv').first().tap(); return 'moved'; }
  if (st.pick) {
    pass(name + ': the ships hold still while you tap them', st.still[0] === true && st.still[1] === true);
    const side = st.pick.side, need = st.pick.n - st.pick.chosen.length;
    if (need > 0) { const next = st.pick.among.filter(x => st.pick.chosen.indexOf(x) < 0)[0]; pass(name + ': a part you may tap is lit', st.pods[side][next].can); await page.locator(podSel(side, next)).tap(); return 'pod'; }
    if (st.cgo) { await page.locator('#cgo').tap(); return 'go'; }
  }
  return 'wait';
}

(async () => {
  const browser = await chromium.launch();
  for (const [name, w, h, card, hpPx, rulePx] of SIZES) {
    const size = { w: w, h: h, card: card };
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
    await shot(page, name + '_1_first_screen');
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
    // ---- the screen: two ships
    pass(name + ': each ship has its five parts on it', [0, 1].every(s => st.pods[s].every(p => p && p.box && p.box.w > 20)));
    pass(name + ': no part of one ship lies over a part of the other', st.pods[0].every(a => st.pods[1].every(b => a.box.r <= b.box.l + 1 || b.box.r <= a.box.l + 1 || a.box.b <= b.box.t + 1 || b.box.b <= a.box.t + 1)));
    pass(name + ': your shield is a bubble that is lit, with its number on it', st.bub[0] && st.shl[0] === 'MAIN SHIELD 100' && inScreen(st.shlBox[0], st), st.shl[0]);
    pass(name + ': your attack points are in the top corner', st.myatk.l < st.vw * 0.2 && st.myatk.t < 70 && /(YOUR ATTACK|YOU)\s*55/.test(st.myatkText), st.myatkText);
    pass(name + ': the buttons at the top are inside the screen', inScreen(st.btns, st), JSON.stringify(st.btns));
    pass(name + ': each of your parts shows what you lose with it, as on the battle board', st.pods[0].every((p, ix) => p.rule === BOARD[st.names[ix]]), JSON.stringify(st.pods[0].map(p => p.rule)));
    pass(name + ': the HP numbers are large enough to read', [0, 1].every(s => st.pods[s].every(p => p.hpBox.h >= hpPx)), String(Math.round(st.pods[0][0].hpBox.h)));
    pass(name + ': the "if lost" words are large enough to read', st.pods[0].every(p => p.ruleBox.h >= rulePx), String(Math.round(st.pods[0][0].ruleBox.h)));
    await shot(page, name + '_2_choose_an_order');

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
      if (!midOnce && st.phase === 'alloc' && st.alloc && !st.alloc.limit) {
        midOnce = true;
        const saved = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
        await page.reload();
        const b = await state(page);
        pass(name + ': leaving in the middle of a round starts that round again, with the same hand', b.phase === 'pick' && b.round === saved.S.round && JSON.stringify(b.hand) === JSON.stringify(saved.S.P[0].hand) && JSON.stringify(b.hp) === JSON.stringify(saved.S.P.map(p => p.parts.map(x => x.hp))));
        continue;
      }
      await act(page, name, flags, size);
    }
    await idle(page);
    st = await state(page);
    pass(name + ': the player sent a hit to their parts', (flags.splits || 0) >= 1, String(flags.splits));
    pass(name + ': Undo, Break a block and Take all back were tried', !!flags.blockPlay);
    pass(name + ': opened cards said what they would do', (flags.fores || 0) >= 3, String(flags.fores));
    pass(name + ': the lead passed from one player to the other', !!flags.enemyLed && !!flags.youLed);
    pass(name + ': the battle reaches an end', !!st.over, 'round ' + st.round);
    if (st.over) {
      const b = st.hp.map(a => a.every(x => x === 0));
      pass(name + ': the ending matches the ships', st.over.winner === 0 ? b[1] && !b[0] : st.over.winner === 1 ? b[0] && !b[1] : true, JSON.stringify(st.over));
      pass(name + ': the ending is said in words, and in large letters over the ships', st.msg.length > 10 && st.again && st.banner === (st.over.winner === 0 ? 'YOU WIN!' : st.over.winner === 1 ? 'THE ENEMY WINS' : 'NOBODY WINS'), st.msg + ' | ' + st.banner);
      pass(name + ': the round on the screen is the round in the log', st.roundText === 'Round ' + st.lastRound, st.roundText + ' against ' + st.lastRound);
      console.log('     ' + name + ': the battle ended in round ' + (st.round - 1) + ': ' + st.over.why);
    }
    await shot(page, name + '_7_the_end');
    await page.locator('#seelog').tap();
    const lg = await page.locator('#loglist .lg').count();
    pass(name + ': the log lists every round', lg >= st.round - 1, lg + ' for ' + (st.round - 1));
    await page.locator('#lclose').tap();
    await page.locator('#bhelp').tap();
    pass(name + ': "How" shows the six symbols and the lost-part rules', await page.locator('#keyrow svg').count() === 6 && /cannot attack/.test(await page.locator('#help').textContent()));
    await shot(page, name + '_8_how');
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
        while (g++ < 300) { st = await state(page); if (st.over || st.round > 5) break; if (st.phase === 'pick') pass(name + ': with both cards put down together, no enemy order is shown before you choose', !st.foecard && !st.order[1]); await act(page, name, flags, size); }
        st = await state(page);
        pass(name + ': a battle played "' + mode + '" plays on', st.round > 5 || !!st.over, 'round ' + st.round);
        await idle(page);
        await page.locator('#bnew').tap();
      }
      // ---- Marc's rule: a common card cannot block a rare attack card
      await page.locator('#srules').tap();
      await page.locator('#switches button[data-key="guard"][data-i="0"]').tap();
      await page.locator('#rnew').tap();
      await page.evaluate(() => window.GMQB.setSeed(5));
      await page.locator('#sgo').tap();
      await page.evaluate('(function(){' + PUT + 'var U=window.GMQB.U,S=U.S;S.leader=1;put(S.P[1],"A08",0);put(S.P[0],"D02",0);put(S.P[0],"D06",1);U.cpuLead=0;})()');
      await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      st = await state(page);
      pass(name + ': a common block card is marked "cannot block" against the rare order on the table', st.cards[0].id === 'D02' && st.cards[0].tag === 'cannot block', st.cards[0].id + ' ' + st.cards[0].tag);
      pass(name + ': a rare block card is not marked', st.cards[1].tag === '');
      await shot(page, name + '_9_block_rule');
      await page.locator('.hc.mine').nth(0).tap();
      st = await state(page);
      pass(name + ': the opened card says why it cannot block', /enemy's order is rare\. A common card cannot block it/.test(st.note), st.note);
      await page.locator('#playit').tap();
      let g2 = 0; while (g2++ < 60) { st = await state(page); if (st.phase === 'roundend' || st.over) break; await act(page, name, flags, size); }
      const L = await page.evaluate(() => { const S = window.GMQB.U.S, l = S.log[S.log.length - 1]; return { atk: l.atk, block: l.block, through: l.through, lines: l.lines.join(' ') }; });
      pass(name + ': played anyway, the common card blocks nothing and the log says why', L.block[0] === 0 && L.through[0] === L.atk[1] && /is common\. It cannot block a rare attack card/.test(L.lines), JSON.stringify(L).slice(0, 200));
      await idle(page);
      await page.locator('#bnew').tap();
    }

    // ---- movement, at real speed
    const p2 = await ctx.newPage();
    const errors2 = [];
    p2.on('pageerror', e => errors2.push(String(e)));
    p2.on('dialog', d => d.accept());
    await p2.goto(PAGE);
    await p2.evaluate(k => { localStorage.removeItem(k); }, KEY);
    await p2.reload();
    await p2.evaluate(() => window.GMQB.setSeed(5));
    await p2.locator('#sgo').tap();
    // round A: you lead with your Spy, the enemy answers with a block card; your shield is down, so you must place its hit
    await p2.evaluate('(function(){' + PUT + 'var U=window.GMQB.U,S=U.S,B=window.GMQB.B;S.leader=0;S.P[0].shield=0;var spy=S.P[0].deck.concat(S.P[0].hand).filter(B.isSpy)[0];put(S.P[0],spy,0);["D06","D07","D08","D09","D10"].forEach(function(id,i){put(S.P[1],id,i);});})()');
    await p2.evaluate(() => window.dispatchEvent(new Event('resize')));
    const bob = await p2.evaluate(() => { const g = document.getElementById('ship0'); return /\bbob\b/.test(g.getAttribute('class')) && getComputedStyle(g).animationName; });
    pass(name + ': the ships float while nothing has to be tapped', bob === 'bob', String(bob));
    pass(name + ': the stars drift', await p2.evaluate(() => { const g = document.querySelector('#sky .drift'); return !!g && getComputedStyle(g).animationName === 'drift'; }));
    await p2.locator('.hc.mine').nth(0).tap();
    await p2.locator('#playit').tap();
    const seen = { fly: false, beam: false, pop: false, wall: false, shotSpy: false, shotBeam: false, shotWall: false };
    async function watch(until) {
      const t0 = Date.now(); let n = 0;
      while (Date.now() - t0 < 45000) {
        const s2 = await p2.evaluate(() => { const U = window.GMQB.U, f = document.getElementById('fxg'), q = s => !!(f && f.querySelector(s)); return { phase: U.phase, fly: q('.fly'), beam: q('.beam'), pop: q('.pop'), wall: q('circle[r="74"]'), banner: !!document.getElementById('banner'), booms: f ? f.childNodes.length : 0, pick: U.pick ? { side: U.pick.side, among: U.pick.among, n: U.pick.n, chosen: U.pick.chosen.length } : null, cgo: document.getElementById('cgo') ? !document.getElementById('cgo').disabled : null, alloc: U.alloc ? { cells: U.alloc.cells.length, among: U.alloc.among } : null, fire: document.getElementById('fire') ? !document.getElementById('fire').disabled : false }; });
        if (s2.fly) { if (!seen.shotSpy) { seen.shotSpy = true; await shot(p2, name + '_10_spy_flies'); } seen.fly = true; }
        if (s2.wall) { if (!seen.shotWall) { seen.shotWall = true; await shot(p2, name + '_11_block'); } seen.wall = true; }
        if (s2.beam) { if (!seen.shotBeam) { seen.shotBeam = true; await shot(p2, name + '_12_laser'); } seen.beam = true; }
        if (s2.pop) seen.pop = true;
        if (until(s2)) return s2;
        if (s2.pick && s2.pick.chosen < s2.pick.n) await p2.locator(podSel(s2.pick.side, s2.pick.among[0])).tap();
        else if (s2.cgo) await p2.locator('#cgo').tap();
        else if (s2.alloc && s2.alloc.cells) await p2.locator(podSel(0, s2.alloc.among[(n++) % s2.alloc.among.length])).tap();
        else if (s2.fire) await p2.locator('#fire').tap();
        else await p2.waitForTimeout(50);
      }
      return null;
    }
    const tA = Date.now();
    const endA = await watch(s => s.phase === 'roundend' || s.phase === 'over');
    pass(name + ': at real speed a round plays to its end', !!endA);
    pass(name + ': at real speed a round takes under 25 seconds', Date.now() - tA < 25000, String(Date.now() - tA));
    pass(name + ': at real speed a Spy flies to the part it hits', seen.fly);
    pass(name + ': at real speed a block card shows its shield', seen.wall);
    pass(name + ': at real speed a laser fires', seen.beam);
    pass(name + ': at real speed the damage floats up as a number', seen.pop);
    await shot(p2, name + '_13_round_over');
    // round B: your ship is whole again, and the enemy has one part left, with 1 HP
    if (endA && endA.phase === 'roundend') {
      await p2.locator('#nextr').tap();
      await p2.evaluate('(function(){' + PUT + 'var U=window.GMQB.U,S=U.S;S.P[1].shield=0;S.P[1].parts.forEach(function(p,i){p.hp=i===3?1:0;});S.P[0].shield=100;S.P[0].parts.forEach(function(p){if(p.hp<=0)p.hp=10;});put(S.P[0],"A01",0);["A02","A03","A04","A05","A06"].forEach(function(id,i){put(S.P[1],id,i);});})()');
      await p2.evaluate(() => window.dispatchEvent(new Event('resize')));
      await p2.locator('.hc.mine').nth(0).tap();
      await p2.locator('#playit').tap();
      let most = 0;
      const endB = await watch(s => { if (s.phase === 'over' && !s.banner) most = Math.max(most, s.booms); return s.phase === 'over' && s.banner; });
      pass(name + ': at real speed the beaten ship blows up before the words appear', !!endB && most >= 2, String(most));
      const fin = await state(p2);
      pass(name + ': the winner is named in large letters', fin.banner === 'YOU WIN!' && fin.over && fin.over.winner === 0, String(fin.banner));
      await p2.waitForTimeout(500);
      await shot(p2, name + '_14_you_win');
    }
    pass(name + ': no script errors at real speed', errors2.length === 0, errors2.slice(0, 3).join(' | '));
    await p2.close();

    pass(name + ': no script errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await browser.close();
  clearTimeout(watchdog);
  console.log('     ' + passed + ' checks passed');
  console.log(bad.length ? 'FAILED: ' + bad.join('; ') : 'ALL OK');
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.log('FAIL the test stopped with an error: ' + String(e).slice(0, 300) + ' | last seen: ' + LAST); process.exit(3); });
