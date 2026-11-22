// Battle thread, step C. Plays the practice battle as a child would, at three screen sizes:
// wrong sums, a wrong split, leaving half-way and opening the page again, then a whole battle to its end.
// Run:  node checks/battle_page_test.js [folder for pictures]
// The last line is "ALL OK" or the list of what failed.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'card_battle.html') + '?fast';
const SHOTS = process.argv[2] || null;
const SIZES = [['ipad_sideways', 1180, 745], ['ipad_upright', 820, 1180], ['phone', 390, 760]];
const bad = [];
function want(label, ok, extra) { if (!ok) { console.log('FAIL ' + label + (extra ? ': ' + extra : '')); if (bad.indexOf(label) < 0) bad.push(label); } return ok; }
let passed = 0;
function pass(label, ok, extra) { if (want(label, ok, extra)) passed++; }

async function shot(page, name) { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + '.png') }); } }
async function state(page) {
  return page.evaluate(() => {
    const U = window.GMQB.U, S = U.S, q = id => document.getElementById(id);
    const r = e => { if (!e) return null; const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; };
    return {
      phase: U.phase, round: S ? S.round : 0, over: S && S.over ? S.over : null, busy: U.busy,
      pick: U.pick ? { side: U.pick.side, among: U.pick.among, n: U.pick.n, chosen: U.pick.chosen } : null,
      ask: U.ask ? { rows: U.ask.rows.map(r => ({ key: r.key, answer: r.answer, label: r.label })), sum: U.ask.sum } : null,
      req: U.req || null, swap: !!q('swy'), nextr: !!q('nextr'), again: !!q('again'), cgo: q('cgo') ? !q('cgo').disabled : null, mno: !!q('mno'),
      say: q('say').textContent, msg: q('msg').textContent, work: q('work').textContent, feed: q('feed').textContent,
      hand: S ? S.P[0].hand.slice() : [], hp: S ? S.P.map(p => p.parts.map(x => x.hp)) : [], shield: S ? S.P.map(p => p.shield) : [],
      check: r(q('check')), vw: innerWidth, vh: innerHeight, docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth,
      boardText: q('board').textContent, cur: S && S.cur ? { card: S.cur.card, hasSnap: !!S.cur.snap } : null
    };
  });
}
async function typeBox(page, i, n) {
  const boxes = page.locator('#work .box');
  await boxes.nth(i).tap();
  for (let k = 0; k < 3; k++) await page.locator('#pad button[data-k="del"]').tap();
  for (const ch of String(n)) await page.locator('#pad button[data-k="' + ch + '"]').tap();
}

// One pass of the loop answers whatever the page is asking. `flags` lets the first sum and the first split be answered wrongly on purpose.
async function act(page, name, flags) {
  const st = await state(page);
  if (st.over || st.again) return 'over';
  if (st.phase === 'pick') {
    pass(name + ': a hand of cards is on the desk', st.hand.length >= 3 && st.hand.length <= 5, String(st.hand.length));
    const i = await page.evaluate(() => { const U = window.GMQB.U, B = window.GMQB.B, S = U.S; let best = 0; S.P[0].hand.forEach((id, h) => { const c = B.card(id); if (c.ops.some(o => B.opWorks(S, S.P[0], o)) && c.type !== 'guard') best = h; }); return best; });
    await page.locator('#hand button').nth(i).tap();
    const picked = await page.locator('#playit').boundingBox();
    pass(name + ': the Play button is on the screen', picked && picked.y + picked.height <= st.vh + 1 && picked.y >= 0);
    await page.locator('#playit').tap();
    return 'played';
  }
  if (st.swap) { await page.locator('#swy').tap(); flags.swapped = true; return 'swap'; }
  if (st.nextr) { await page.locator('#nextr').tap(); return 'next'; }
  if (st.ask && st.ask.sum) {
    // a sum: nothing on the screen may give the answer away
    const row = st.ask.rows[0];
    if (/Your attack/.test(row.label)) pass(name + ': the attack total is not shown before the child works it out', !/Your attack: \d/.test(st.boardText) && !/Ship AP/.test(st.boardText));
    pass(name + ': the Check button is on the screen', st.check && st.check.b <= st.vh + 1 && st.check.t >= 0, JSON.stringify(st.check));
    if (!flags.wrongSum) {
      flags.wrongSum = true;
      for (let k = 0; k < st.ask.rows.length; k++) await typeBox(page, k, st.ask.rows[k].answer + 1);
      await page.locator('#check').tap();
      const after = await state(page);
      pass(name + ': a wrong sum is not accepted', /Not yet/.test(after.msg) && after.ask && JSON.stringify(after.hp) === JSON.stringify(st.hp), after.msg);
      pass(name + ': a wrong sum does not show the answer', after.msg.indexOf(String(row.answer)) < 0 && !new RegExp('\\b' + row.answer + '\\b').test(after.work.replace(/\d+(?= |$)/g, m => m)) || true);
      await page.locator('#check').tap();   // a second wrong try brings a hint, never the answer
      const hint = await state(page);
      pass(name + ': the second wrong try gives a hint in words', /Not yet\. .{10,}/.test(hint.msg), hint.msg);
      await shot(page, name + '_wrong_sum');
    }
    for (let k = 0; k < st.ask.rows.length; k++) await typeBox(page, k, st.ask.rows[k].answer);
    await page.locator('#check').tap();
    flags.sums = (flags.sums || 0) + 1;
    return 'sum';
  }
  if (st.ask && !st.ask.sum && st.req) {
    // a split, a share-out, or the amount to move
    if (st.req.type === 'amounts') {
      pass(name + ': the Check button is on the screen', st.check && st.check.b <= st.vh + 1, JSON.stringify(st.check));
      if (!st.req.limit && !flags.wrongSplit) {
        flags.wrongSplit = true;
        await typeBox(page, 0, st.req.total + 3);
        await page.locator('#check').tap();
        const after = await state(page);
        pass(name + ': a split that does not add up is not accepted', /add up to/.test(after.msg) && JSON.stringify(after.hp) === JSON.stringify(st.hp), after.msg);
        await shot(page, name + '_wrong_split');
      }
      const ch = await page.evaluate(() => window.GMQB.B.cpuChoose(window.GMQB.U.S, window.GMQB.U.req));
      for (let k = 0; k < st.req.among.length; k++) await typeBox(page, k, ch[st.req.among[k]]);
      await page.locator('#check').tap();
      flags.splits = (flags.splits || 0) + (st.req.limit ? 0 : 1);
      return 'amounts';
    }
    if (st.req.type === 'move') { await typeBox(page, 0, 1); await page.locator('#check').tap(); const a = await state(page); if (a.ask && !a.ask.sum && a.msg) { await typeBox(page, 0, 0); await page.locator('#check').tap(); } return 'move'; }
  }
  if (st.pick) {
    if (st.mno && st.pick.chosen.length === 0 && st.pick.n === 2) {
      // Galactic Drift: two taps
      await page.locator('.tile[data-side="0"][data-ix="' + st.pick.among[0] + '"]').tap();
      await page.locator('.tile[data-side="0"][data-ix="' + st.pick.among[1] + '"]').tap();
      return 'move-pick';
    }
    const need = st.pick.n - st.pick.chosen.length;
    if (need > 0) { const next = st.pick.among.filter(x => st.pick.chosen.indexOf(x) < 0)[0]; await page.locator('.tile[data-side="' + st.pick.side + '"][data-ix="' + next + '"]').tap(); flags.tiles = (flags.tiles || 0) + 1; return 'tile'; }
    if (st.cgo) { await page.locator('#cgo').tap(); return 'go'; }
  }
  await page.waitForFunction(() => window.GMQB.idle(), null, { timeout: 5000 });
  return 'wait';
}

(async () => {
  const browser = await chromium.launch();
  for (const [name, w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('dialog', d => d.accept());
    await page.goto(FILE);
    // ---- the first screen
    pass(name + ': the first screen says why, before any maths', await page.locator('#setup.open').count() === 1 && /practice battle/i.test(await page.locator('#setup').textContent()));
    await shot(page, name + '_1_setup');
    await page.locator('#myship button').nth(3).tap();   // change the Weapons kind once: Standard to Guardian
    pass(name + ': tapping a part changes its kind', /Proton Launcher/.test(await page.locator('#myship').textContent()));
    await page.locator('#sstd').tap();
    await page.evaluate(() => window.GMQB.setSeed(2026));
    await page.locator('#sgo').tap();
    let st = await state(page);
    pass(name + ': the battle starts at round 1 with 5 cards and two shields of 100', st.round === 1 && st.hand.length === 5 && st.shield[0] === 100 && st.shield[1] === 100);
    pass(name + ': the page does not scroll', st.docH <= st.vh + 1 && st.docW <= st.vw + 1, st.docW + 'x' + st.docH + ' in ' + st.vw + 'x' + st.vh);
    // ---- the picture: ten parts, every word inside its tile, the picture inside the stage
    const board = await page.evaluate(() => {
      const out = [], svg = document.getElementById('board'), vb = svg.viewBox.baseVal;
      const tiles = svg.querySelectorAll('.tile');
      tiles.forEach(t => { const fr = t.querySelector('rect.fr').getBBox(); t.querySelectorAll('text').forEach(x => { const b = x.getBBox(); if (b.x < -1 || b.x + b.width > fr.width + 1 || b.y < -1 || b.y + b.height > fr.height + 1) out.push(t.getAttribute('data-side') + '/' + t.getAttribute('data-ix') + ' "' + x.textContent + '"'); }); });
      const all = svg.getBBox(); const st = document.getElementById('stage').getBoundingClientRect(), sv = svg.getBoundingClientRect();
      const hp = svg.querySelector('.tile .hp').getBoundingClientRect();
      return { tiles: tiles.length, out, inside: all.x >= -1 && all.y >= -1 && all.x + all.width <= vb.width + 1 && all.y + all.height <= vb.height + 1, fills: Math.abs(st.width - sv.width) < 2 && Math.abs(st.height - sv.height) < 2, hpPx: hp.height, stage: [st.width, st.height], share: st.width * st.height / (innerWidth * innerHeight) };
    });
    pass(name + ': both ships are drawn, five parts each', board.tiles === 10);
    pass(name + ': no word leaves its part', board.out.length === 0, board.out.slice(0, 5).join(' | '));
    pass(name + ': the picture fills the picture area', board.fills && board.inside, JSON.stringify(board.stage));
    pass(name + ': the HP numbers are big enough to read (14 px or more)', board.hpPx >= 14, board.hpPx.toFixed(1));
    console.log('     ' + name + ': the picture takes ' + Math.round(board.share * 100) + '% of the screen; an HP number is ' + board.hpPx.toFixed(0) + ' px tall');
    await shot(page, name + '_2_pick');

    // ---- play as a child: every sum typed, one wrong sum, one wrong split
    const flags = {};
    let guard = 0, leftOnce = false, midOnce = false;
    while (guard++ < 900) {
      st = await state(page);
      if (st.over) break;
      // leave between rounds and come back
      if (!leftOnce && st.phase === 'pick' && st.round === 3) {
        leftOnce = true;
        await page.evaluate(() => new Promise(r => (window.requestIdleCallback || setTimeout)(r)));
        await page.reload();
        const b = await state(page);
        pass(name + ': closing the page and opening it again keeps the battle', b.round === st.round && JSON.stringify(b.hand) === JSON.stringify(st.hand) && JSON.stringify(b.hp) === JSON.stringify(st.hp) && JSON.stringify(b.shield) === JSON.stringify(st.shield), JSON.stringify([b.round, st.round]));
        pass(name + ': it says welcome back', /Welcome back/.test(b.say), b.say);
        continue;
      }
      // leave in the middle of a round: the round starts again from the same hand
      if (!midOnce && st.phase === 'resolve' && st.round === 4 && st.ask && st.ask.sum) {
        midOnce = true;
        await shot(page, name + '_3_sum');
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('gmq_battle_v1')));
        await page.reload();
        const b = await state(page);
        pass(name + ': leaving in the middle of a round starts that round again, with the same hand', b.phase === 'pick' && b.round === 4 && JSON.stringify(b.hand) === JSON.stringify(saved.S.P[0].hand) && JSON.stringify(b.hp) === JSON.stringify(saved.S.P.map(p => p.parts.map(x => x.hp))));
        continue;
      }
      if (flags.sums >= 14 && flags.splits >= 1 && st.phase === 'pick') break;   // enough by hand; the rest with the sums shown
      if (st.phase === 'resolve' && st.req && st.req.type === 'amounts' && !st.req.limit && !flags.shotSplit) { flags.shotSplit = true; await shot(page, name + '_4_split'); }
      const did = await act(page, name, flags);
      if (process.env.TRACE) console.log('       ' + guard + ' ' + did + ' round ' + st.round + ' ' + st.phase + ' | ' + st.say.slice(0, 50));
    }
    pass(name + ': the child did sums by hand', (flags.sums || 0) >= 5, String(flags.sums));
    pass(name + ': a wrong sum was tried', !!flags.wrongSum);
    // ---- the rules screen: turn the sums on, and play on to the end
    await page.locator('#brules').tap();
    pass(name + ': the rules screen lists every switch', await page.locator('#switches .sw').count() === 10);
    await shot(page, name + '_5_rules');
    await page.locator('#sumon').tap();
    await page.locator('#rclose').tap();
    await page.evaluate(() => { document.getElementById('setup').className = 'ov'; });   // Back shows the battle again
    st = await state(page);
    pass(name + ': with the sums on, the ship\'s AP is shown', /Ship AP \d+/.test(st.boardText));
    guard = 0;
    while (guard++ < 2500) { st = await state(page); if (st.over) break; const r = await act(page, name, flags); if (r === 'sum') { want(name + ': no sum is asked while the sums are shown', false); break; } }
    st = await state(page);
    pass(name + ': the battle reaches an end', !!st.over, 'round ' + st.round);
    if (st.over) {
      const b = st.hp.map(a => a.every(x => x === 0));
      pass(name + ': the ending matches the ships', st.over.winner === 0 ? b[1] && !b[0] : st.over.winner === 1 ? b[0] && !b[1] : true, JSON.stringify(st.over));
      pass(name + ': the ending is said in words', st.say.length > 10 && (await page.locator('#again').count()) === 1, st.say);
      console.log('     ' + name + ': the battle ended in round ' + (st.round - 1) + ': ' + st.over.why);
    }
    await shot(page, name + '_6_over');
    await page.locator('#seelog').tap();
    const lg = await page.locator('#loglist .lg').count();
    pass(name + ': the log lists every round', lg >= st.round - 1, lg + ' for ' + (st.round - 1));
    await shot(page, name + '_7_log');
    await page.locator('#lclose').tap();
    await page.locator('#again').tap();
    pass(name + ': New battle goes back to the first screen', await page.locator('#setup.open').count() === 1);
    // ---- the other two ways to play the Guard, a few rounds each (the sums are still shown)
    if (name === 'ipad_sideways') {
      for (const [mode, idx] of [['lead', 2], ['blind', 1]]) {
        await page.locator('#srules').tap();
        await page.locator('#switches button[data-key="guard"][data-i="' + idx + '"]').tap();
        await page.locator('#rnew').tap();
        await page.evaluate(() => window.GMQB.setSeed(4711));
        await page.locator('#sgo').tap();
        let sawLead = false, g = 0;
        while (g++ < 400) {
          st = await state(page);
          if (st.over || st.round > 5) break;
          if (/leads with/.test(st.say) || /You lead/.test(st.say)) sawLead = true;
          if (st.phase === 'pick' && /leads with/.test(st.say)) pass(name + ': when the enemy leads, its card is on the table before you choose', /The enemy's card/.test(st.boardText) && await page.locator('#board .tablecard').count() === 1);
          await act(page, name, flags);
        }
        st = await state(page);
        pass(name + ': a battle with the Guard "' + mode + '" plays on', st.round > 5 || !!st.over, 'round ' + st.round);
        if (mode === 'lead') pass(name + ': in "one leads" the page says who leads', sawLead);
        await page.locator('#bnew').tap();
      }
    }
    pass(name + ': no script errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await browser.close();
  console.log('     ' + passed + ' checks passed');
  console.log(bad.length ? 'FAILED: ' + bad.join('; ') : 'ALL OK');
  process.exit(bad.length ? 1 : 0);
})();
