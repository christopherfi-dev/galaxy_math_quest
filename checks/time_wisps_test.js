// Time wisps on Chronosia: quick practice a cadet can see and walk into, a common card for a win, and the card swap.
// [Source: Marc, 2026-11-18: things that pop up as you walk, for extra practice; a win is one common card; 12 commons make a rare, 24 a gold; a record of skills]
//   - the question makers: 20,000 rounds. Every answer is worked out again from the words of the question.
//   - wisps stand only on open ground, never on a door, and can always be walked to. A wisp never steps onto the cadet. Walking past one does not start it.
//   - going for a wisp starts three questions. Three right: a common card. Two slips, or stepping away: no card. The skills are tallied.
//   - the swap: 12 common cards for 1 rare, 24 for 1 gold, with "are you sure". The teacher switch turns wisps off.
// Run: node checks/time_wisps_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 1180, 820], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); } catch (e) {} });
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
            if ((m = q.q.match(/^(\d+) \+ (\d+) = \?$/))) { const a = +m[1], c = +m[2], sum = a + c, fit = lvl === 1 ? sum <= 10 : lvl === 2 ? sum >= 11 && sum <= 20 : lvl === 3 ? a % 10 + c % 10 <= 9 && sum <= 99 && a >= 10 : a % 10 + c % 10 >= 10 && sum <= 99; if (q.kind !== 'num' || q.ans[0] !== sum || !fit || q.sk !== 'add' + lvl) B(`seed ${seed}: ${q.q}`); }
            else if ((m = q.q.match(/^It is (\d+:\d+)\. What time will it be (\d+) minutes later\?$/))) { const t = mins(m[1]) + +m[2]; if (q.kind !== 'time' || q.ans[0][0] !== Math.floor(t / 60) || q.ans[0][1] !== t % 60 || q.ans[0][0] > 12 || +m[2] % 5 || +m[2] < 5 || +m[2] > 30) B(`seed ${seed}: ${q.q}`); }
            else if ((m = q.q.match(/^How many minutes is it from (\d+:\d+) to (\d+:\d+)\?$/))) { const d = mins(m[2]) - mins(m[1]); if (q.kind !== 'num' || q.ans[0] !== d || d < 10 || d > 50 || d % 5) B(`seed ${seed}: ${q.q}`); }
            else if (q.q === 'What time does this clock show?') { const [hh, mm] = q.ans[0], x2 = 60 + 39 * Math.cos((mm * 6 - 90) * Math.PI / 180), hx = 60 + 25 * Math.cos(((hh % 12 + mm / 60) * 30 - 90) * Math.PI / 180); if (q.kind !== 'time' || hh < 1 || hh > 12 || mm % 5 || q.art.indexOf(`x2="${x2}"`) < 0 || q.art.indexOf(`x2="${hx}"`) < 0) B(`seed ${seed}: the clock picture does not show ${hh}:${mm}`); }
            else B(`seed ${seed}: a question the test does not know: ${q.q}`); if (!q.hint) B(`seed ${seed}: no hint`); }); }
        return res; });
      g.bad.forEach(x => bad.push('questions: ' + x)); ok(Object.keys(g.kinds).length === 7, 'expected 7 skills (add 1 to 4, and three time skills): ' + Object.keys(g.kinds)); console.log(`question makers: ${g.n.toLocaleString()} questions worked out again, ${g.bad.length} wrong`);
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
    expect(await last(), /You catch the wisp! It turns into a common card\. You have 1 common card\. 12 make a rare card\. 24 make a gold card\./, 'catching a wisp'); let st = await p.evaluate(() => ({ n: S.cards.length, r: S.cards[S.cards.length - 1].r, w: C().wisps, left: CWISP.length, sk: S.sk, log: S.log[S.log.length - 1].result }));
    ok(st.n === c0 + 1 && st.r === 'common' && st.w === 1 && st.left === 0 && st.log === 'caught', 'after a catch: ' + JSON.stringify(st)); const tally = Object.keys(st.sk).reduce((a, k) => [a[0] + st.sk[k][0], a[1] + st.sk[k][1]], [0, 0]); ok(tally[0] === 3 && tally[1] === 1 && Object.keys(st.sk).length === 3, 'the skill tally should hold 3 right and 1 wrong over 3 skills: ' + JSON.stringify(st.sk));
    expect(await p.textContent('#cards'), /You have 1 common card\. 12 make a rare card\. 24 make a gold card\./, 'the card panel explains the swap');
    // ---- two slips, then stepping away
    await p.evaluate(() => { CWISP = [{ x: C().x + 1, y: C().y, px: C().x + 1, py: C().y, t: 99, hue: 2 }]; act('catch wisp'); }); await p.waitForTimeout(400); ok(await p.evaluate(() => widget && !!widget.wisp), '"catch wisp" should start a wisp beside you'); await answer(true); await answer(true); await p.waitForTimeout(200);
    expect(await last(), /Two slips\. The wisp slips away/, 'two slips'); ok(await p.evaluate(n => !widget && S.cards.length === n && C().wisps === 1, c0 + 1), 'two slips: no card');
    await p.evaluate(() => { CWISP = [{ x: C().x + 1, y: C().y, px: C().x + 1, py: C().y, t: 99, hue: 2 }]; act('catch wisp'); }); await p.waitForTimeout(400); await p.tap('#leave'); await p.waitForTimeout(200); expect(await last(), /You step away\. The wisp slips off/, 'stepping away'); ok(await p.evaluate(n => S.cards.length === n, c0 + 1), 'stepping away: no card');
    await p.evaluate(() => { CWNEXT = .2; }); await p.waitForTimeout(900); ok(await p.evaluate(() => CWISP.length === 3), 'new wisps should drift in after a while');
    // ---- the swap
    await p.evaluate(() => { S.cards = [{ r: 'rare', n: 'Void Vortex' }]; for (let i = 0; i < 13; i++) S.cards.push({ r: 'common', n: 'Laser Cannon' }); drawCards(); }); expect(await p.textContent('#cards'), /You have 13 common cards\.[\s\S]*Swap 12 for 1 rare card[\s\S]*Or save them\. 11 more make a gold card\./, 'with 13 commons');
    ok(!(await p.$('#cards button[data-n="24"]')), 'no gold swap with 13 commons'); await p.tap('#cards button[data-n="12"]'); await p.waitForTimeout(150); ok(await p.evaluate(() => S.cards.length === 14), 'one tap must not swap'); expect(await p.textContent('#cards button[data-n="12"]'), /Are you sure\? Tap again/, 'the swap asks first');
    await p.tap('#cards button[data-n="12"]'); await p.waitForTimeout(200); st = await p.evaluate(() => S.cards.map(c => c.r).sort().join()); ok(st === 'common,rare,rare', 'after the swap: ' + st); expect(await last(), /You swap 12 common cards for 1 rare card/, 'the swap words');
    await p.evaluate(() => { S.cards = []; for (let i = 0; i < 24; i++) S.cards.push({ r: 'common', n: 'Stealth Mode' }); drawCards(); }); await p.tap('#cards button[data-n="24"]'); await p.tap('#cards button[data-n="24"]'); await p.waitForTimeout(200); st = await p.evaluate(() => S.cards.map(c => c.r).join()); ok(st === 'gold', '24 commons should become one gold: ' + st);
    // ---- with reading cards on, the "caught" words come up as a card once, not after every wisp
    await p.evaluate(() => { READ.on = true; S.read = []; for (let k = 0; k < 2; k++) { widget = { kind: 'cq', id: 'wisp', q: { title: 'A time wisp' }, steps: [], i: 0, wisp: {}, slips: 0 }; wispEnd(true, 'You catch the wisp!'); if (k === 0) { window.__first = READ.open; readOk(true); } } window.__second = READ.open; readOk(true); READ.on = false; });
    ok(await p.evaluate(() => window.__first === true && window.__second === false), 'the catch words should be a reading card the first time only');
    // ---- kept after a reload; the teacher switch
    await p.waitForTimeout(300); await p.reload(); await p.waitForTimeout(600); ok(await p.evaluate(() => C().wisps === 3 && S.sk && Object.keys(S.sk).length >= 3 && S.cards.length === 3), 'the catches, the tally and the cards should be kept');
    await p.evaluate(() => { $('wispOn').checked = false; $('wispOn').onchange(); }); await p.waitForTimeout(1500); ok(await p.evaluate(() => CWISP.length === 0 && getKeep('gmq-wisps') === 'off' && !hereWords().some(x => x[0] === 'catch wisp')), 'the teacher switch should clear the wisps');
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close();
  }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
