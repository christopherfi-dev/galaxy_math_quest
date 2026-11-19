// Time wisps on Chronosia: quick practice a cadet can see and walk into, and practice credits.
// [Source: Marc, 2026-11-18: things that pop up as you walk, for extra practice. A win is a QUARTER of a credit (1/4, 0.25), not a card.
//  1 whole credit buys a common card, 96 quarters a gold card. Cards are never traded for better cards. A record of skills.]
//   - the question makers: 20,000 rounds. Every answer is worked out again from the words of the question.
//   - wisps stand only on open ground, never on a door, and can always be walked to. A wisp never steps onto the cadet. Walking past one does not start it.
//   - going for a wisp starts three questions. Three right: a quarter of a credit. Two slips, or stepping away: nothing. The skills are tallied.
//   - credits: shown as a mixed number and a decimal for every count from 0 to 400; 1 credit for a common card, 12 for a rare, 24 for a gold; cards are never used up.
// Run: node checks/time_wisps_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 1180, 820], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const idle = async () => { for (let i = 0; i < 200; i++) { if (await p.evaluate(() => !CM.route.length)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const tapTile = async (x, y) => { await p.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p.waitForTimeout(60); const pt = await p.evaluate(([x, y]) => { const g = cGeo(), r = cv.getBoundingClientRect(); return [r.left + g.ox + (x + .5) * g.ts, r.top + g.oy + (y + .5) * g.ts]; }, [x, y]); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(120); await idle(); await p.waitForTimeout(200); };
    try {
    if (name === 'ipad') {     // ---- the question makers
      const g = await p.evaluate(() => { skipIntro(); const res = { bad: [], n: 0, kinds: {} }, B = m => { if (res.bad.length < 12) res.bad.push(m); }, mins = t => { const [a, c] = t.split(':').map(Number); return a * 60 + c; };
        for (let seed = 1; seed <= 20000; seed++) { const lvl = 1 + seed % 4, qs = wispQs(wrng(seed), lvl); if (qs.length !== 3 || new Set(qs.map(q => q.sk.replace(/\d/, ''))).size !== 3) B(`seed ${seed}: three different kinds expected`);
          qs.forEach(q => { res.n++; res.kinds[q.sk] = 1; let m;
            if ((m = q.q.match(/^(\d+) \+ (\d+) = \?$/))) { const a = +m[1], c = +m[2], sum = a + c, fit = lvl === 1 ? sum <= 10 : lvl === 2 ? sum >= 11 && sum <= 20 : lvl === 3 ? a % 10 + c % 10 <= 9 && sum <= 99 && a >= 10 : a % 10 + c % 10 >= 10 && sum <= 99; if (q.kind !== 'num' || q.ans[0] !== sum || !fit || q.sk !== (lvl <= 2 ? 'NUM.FACT.1' : 'NUM.ADD.1')) B(`seed ${seed}: ${q.q}`); }
            else if ((m = q.q.match(/^It is (\d+:\d+)\. What time will it be (\d+) minutes later\?$/))) { const t = mins(m[1]) + +m[2]; if (q.kind !== 'time' || q.ans[0][0] !== Math.floor(t / 60) || q.ans[0][1] !== t % 60 || q.ans[0][0] > 12 || +m[2] % 5 || +m[2] < 5 || +m[2] > 30) B(`seed ${seed}: ${q.q}`); }
            else if ((m = q.q.match(/^How many minutes is it from (\d+:\d+) to (\d+:\d+)\?$/))) { const d = mins(m[2]) - mins(m[1]); if (q.kind !== 'num' || q.ans[0] !== d || d < 10 || d > 50 || d % 5) B(`seed ${seed}: ${q.q}`); }
            else if (q.q === 'What time does this clock show?') { const [hh, mm] = q.ans[0], x2 = 60 + 39 * Math.cos((mm * 6 - 90) * Math.PI / 180), hx = 60 + 25 * Math.cos(((hh % 12 + mm / 60) * 30 - 90) * Math.PI / 180); if (q.kind !== 'time' || hh < 1 || hh > 12 || mm % 5 || q.art.indexOf(`x2="${x2}"`) < 0 || q.art.indexOf(`x2="${hx}"`) < 0) B(`seed ${seed}: the clock picture does not show ${hh}:${mm}`); }
            else B(`seed ${seed}: a question the test does not know: ${q.q}`); if (!q.hint) B(`seed ${seed}: no hint`); }); }
        return res; });
      g.bad.forEach(x => bad.push('questions: ' + x)); ok(Object.keys(g.kinds).sort().join() === 'NUM.ADD.1,NUM.FACT.1,TIME.BETWEEN,TIME.LATER,TIME.READ', 'expected two skills from the number map and three time skills: ' + Object.keys(g.kinds)); console.log(`question makers: ${g.n.toLocaleString()} questions worked out again, ${g.bad.length} wrong`);
    }
    await p.evaluate(() => { skipIntro(); goChronosia(); }); await p.waitForTimeout(700);
    // ---- where wisps may be
    const w0 = await p.evaluate(() => { const res = { n: CWISP.length, bad: [] }; for (let round = 0; round < 300; round++) { CWISP = []; wispFill(); CWISP.forEach(o => { const t = cTile(o.x, o.y), pth = cPath(o.x, o.y), e = pth[pth.length - 1]; if ('.:'.indexOf(t) < 0) res.bad.push(`on a "${t}" tile`); if (!e || e[0] !== o.x || e[1] !== o.y) res.bad.push('cannot be walked to'); if (Math.hypot(o.x - C().x, o.y - C().y) < 4) res.bad.push('too close at the start'); }); if (CWISP.length !== 3) res.bad.push('not three'); } return res; });
    ok(w0.n === 3, 'three wisps on landing, got ' + w0.n); w0.bad.slice(0, 5).forEach(x => bad.push(`${name}: a wisp ${x}`));
    // a wisp never steps onto the cadet, and walking past one does not start it
    await p.evaluate(() => { CWISP = [[6, 10], [7, 9], [7, 11]].map((q, i) => ({ x: q[0], y: q[1], px: q[0], py: q[1], t: 0, hue: i })); }); await p.waitForTimeout(2500);
    ok(await p.evaluate(() => !widget && !CWISP.some(o => o.x === C().x && o.y === C().y)), 'a wisp must not step onto a cadet who stands still');
    await p.evaluate(() => { CWISP = [{ x: 5, y: 10, px: 5, py: 10, t: 99, hue: 0 }]; CWNEXT = 999; act('go west'); }); await idle(); await p.waitForTimeout(300); ok(await p.evaluate(() => !widget && C().x === 4), 'walking past a wisp must not start it');
    // ---- going for a wisp: three right answers
    await p.evaluate(() => { CWISP = [{ x: 6, y: 11, px: 6, py: 11, t: 99, hue: 1 }]; CWNEXT = 999; }); ok(await p.evaluate(() => hereWords().some(x => x[0] === 'catch wisp')), 'a seen wisp becomes a word to tap');
    await tapTile(6, 11); ok(await p.evaluate(() => widget && widget.kind === 'cq' && !!widget.wisp), 'tapping a wisp should start it'); expect(await last(), /A time wisp!.*three quick questions/, 'the wisp words'); if (out) await p.screenshot({ path: path.join(out, `wisp_${name}_1.png`) });
    const answer = async wrong => { const s2 = await p.evaluate(() => { const s = widget.steps[widget.i]; return { kind: s.kind, ans: s.ans }; }); if (s2.kind === 'num') await p.fill('#ah', String(wrong ? s2.ans[0] + 1 : s2.ans[0])); else { await p.fill('#ah', String(s2.ans[0][0])); await p.fill('#am', String(wrong ? (s2.ans[0][1] + 5) % 60 : s2.ans[0][1])); } await p.tap('#try'); await p.waitForTimeout(150); };
    const c0 = await p.evaluate(() => S.cards.length); await answer(true); ok(await p.evaluate(() => widget && widget.slips === 1 && widget.i === 0 && /one slip/.test($('msg').textContent)), 'the first slip gives a hint and stays'); await answer(); await answer(); await answer(); await p.waitForTimeout(200);
    expect(await last(), /You catch the wisp! You earn ¼ of a credit \(0\.25\)\. You have ¼ credit\. 1 whole credit buys a common card\./, 'catching a wisp'); let st = await p.evaluate(() => ({ n: S.cards.length, q: S.q4, w: C().wisps, left: CWISP.length, sk: evCounts(), ev: S.ev, log: S.log[S.log.length - 1].result }));
    ok(st.n === c0 && st.q === 1 && st.w === 1 && st.left === 0 && st.log === 'caught', 'after a catch, a quarter and no card: ' + JSON.stringify(st)); const tally = Object.keys(st.sk).reduce((a, k) => [a[0] + st.sk[k].right, a[1] + st.sk[k].wrong, a[2] + st.sk[k].later], [0, 0, 0]); ok(tally.join() === '2,1,1' && Object.keys(st.sk).length === 3 && st.ev.length === 4 && st.ev.every(r => r[2] === 'time wisp' && /^\d{4}-\d\d-\d\d$/.test(r[0]) && r[5]), 'the record should hold 2 first tries right, 1 first try wrong and 1 later try, over 3 skills: ' + JSON.stringify(st.ev));
    await p.waitForTimeout(100); expect(await p.textContent('#cards'), /Practice credits: ¼ = 0\.25 = 1 quarter[\s\S]*4 quarters make 1 whole credit[\s\S]*A common card costs 1\. You need ¾ more\.[\s\S]*A rare card costs 12\. You need 11¾ more\.[\s\S]*A gold card costs 24\. You need 23¾ more\./, 'the card panel shows the credits as maths'); expect(await p.textContent('#status'), /Credits ¼/, 'the status row');
    // ---- two slips, then stepping away
    await p.evaluate(() => { CWISP = [{ x: C().x + 1, y: C().y, px: C().x + 1, py: C().y, t: 99, hue: 2 }]; act('catch wisp'); }); await p.waitForTimeout(400); ok(await p.evaluate(() => widget && !!widget.wisp), '"catch wisp" should start a wisp beside you'); await answer(true); await answer(true); await p.waitForTimeout(200);
    expect(await last(), /Two slips\. The wisp slips away/, 'two slips'); ok(await p.evaluate(n => !widget && S.cards.length === n && C().wisps === 1 && S.q4 === 1, c0), 'two slips: nothing earned');
    await p.evaluate(() => { CWISP = [{ x: C().x + 1, y: C().y, px: C().x + 1, py: C().y, t: 99, hue: 2 }]; act('catch wisp'); }); await p.waitForTimeout(400); await p.tap('#leave'); await p.waitForTimeout(200); expect(await last(), /You step away\. The wisp slips off/, 'stepping away'); ok(await p.evaluate(n => S.cards.length === n && S.q4 === 1, c0), 'stepping away: nothing earned');
    await p.evaluate(() => { CWNEXT = .2; }); await p.waitForTimeout(900); ok(await p.evaluate(() => CWISP.length === 3), 'new wisps should drift in after a while');
    // ---- credits: the words for every count, worked out again here
    const fq = await p.evaluate(() => { const badq = []; for (let n = 0; n <= 400; n++) { const w2 = (n - n % 4) / 4, f = n % 4 === 1 ? '¼' : n % 4 === 2 ? '½' : n % 4 === 3 ? '¾' : '', want = w2 === 0 ? (f || '0') : '' + w2 + f; if (fmtQ(n) !== want) badq.push(n + ': ' + fmtQ(n)); } return badq; }); ok(!fq.length, 'credits written wrongly: ' + fq.slice(0, 5));
    ok(await p.evaluate(() => QCOST.common === 1 && QCOST.rare === 12 && QCOST.gold === 24 && QCOST.gold * 4 === 96), 'the prices: 1, 12 and 24 credits, so a gold card is 96 wins');
    // cards are never traded up
    await p.evaluate(() => { S.q4 = 0; S.cards = []; for (let i = 0; i < 30; i++) S.cards.push({ r: 'common', n: 'Laser Cannon' }); drawCards(); }); ok(!(await p.$('#cards button')) && !/Swap/.test(await p.textContent('#cards')), '30 common cards and no credits: nothing can be traded');
    // turning credits in
    await p.evaluate(() => { menuOpen('cards'); }); await p.waitForTimeout(150);      /* the cards wait behind the More row */
    await p.evaluate(() => { S.cards = [{ r: 'rare', n: 'Void Vortex' }]; S.q4 = 11; drawCards(); }); expect(await p.textContent('#cards'), /Practice credits: 2¾ = 2\.75 = 11 quarters[\s\S]*Turn in 1 credit for a common card[\s\S]*A rare card costs 12\. You need 9¼ more\.[\s\S]*A gold card costs 24\. You need 21¼ more\./, 'with 2¾ credits');
    await p.tap('#cards button[data-to="common"]'); await p.waitForTimeout(150); ok(await p.evaluate(() => S.cards.length === 1 && S.q4 === 11), 'one tap must not turn in'); expect(await p.textContent('#cards button[data-to="common"]'), /Are you sure\? Tap again/, 'turning in asks first');
    await p.tap('#cards button[data-to="common"]'); await p.waitForTimeout(200); st = await p.evaluate(() => ({ c: S.cards.map(c => c.r).join(), q: S.q4 })); ok(st.c === 'rare,common' && st.q === 7, 'after turning in 1 credit: ' + JSON.stringify(st)); expect(await last(), /You turn in 1 credit for a common card\. You have 1¾ credits left\./, 'the turn-in words');
    await p.evaluate(() => { S.cards = []; S.q4 = 50; drawCards(); }); ok(!(await p.$('#cards button[data-to="gold"]')), 'no gold card with 12½ credits'); await p.tap('#cards button[data-to="rare"]'); await p.tap('#cards button[data-to="rare"]'); await p.waitForTimeout(200); st = await p.evaluate(() => ({ c: S.cards.map(c => c.r).join(), q: S.q4 })); ok(st.c === 'rare' && st.q === 2, '12 credits for a rare card: ' + JSON.stringify(st));
    await p.evaluate(() => { S.cards = []; S.q4 = 96; drawCards(); }); await p.tap('#cards button[data-to="gold"]'); await p.tap('#cards button[data-to="gold"]'); await p.waitForTimeout(200); st = await p.evaluate(() => ({ c: S.cards.map(c => c.r).join(), q: S.q4 })); ok(st.c === 'gold' && st.q === 0, '96 quarters for a gold card: ' + JSON.stringify(st));
    // ---- with reading cards on, the "caught" words come up as a card once, not after every wisp
    await p.evaluate(() => { READ.on = true; S.read = []; for (let k = 0; k < 2; k++) { widget = { kind: 'cq', id: 'wisp', q: { title: 'A time wisp' }, steps: [], i: 0, wisp: {}, slips: 0 }; wispEnd(true, 'You catch the wisp!'); if (k === 0) { window.__first = READ.open; readOk(true); } } window.__second = READ.open; readOk(true); READ.on = false; });
    ok(await p.evaluate(() => window.__first === true && window.__second === false), 'the catch words should be a reading card the first time only');
    // ---- kept after a reload; the teacher switch
    const pre = await p.evaluate(() => JSON.stringify([C().wisps, S.q4, S.cards.length, S.ev])); await p.waitForTimeout(300); await p.reload(); await p.waitForTimeout(600); const post = await p.evaluate(() => JSON.stringify([C().wisps, S.q4, S.cards.length, S.ev])); ok(pre === post && JSON.parse(post)[1] === 2 && JSON.parse(post)[0] === 3, `the catches, the credits, the cards and the tally should be kept: ${pre} then ${post}`);
    await p.evaluate(() => { $('wispOn').checked = false; $('wispOn').onchange(); }); await p.waitForTimeout(1500); ok(await p.evaluate(() => CWISP.length === 0 && getKeep('gmq-wisps') === 'off' && !hereWords().some(x => x[0] === 'catch wisp')), 'the teacher switch should clear the wisps');
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close();
  }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
