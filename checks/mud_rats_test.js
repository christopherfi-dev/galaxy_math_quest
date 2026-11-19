// Mud rats: a surprise attack in a dark street on Voltara.
// [Source: Marc, 2026-11-18: "a band of mud rats attack you from the dark. You have one minute to defeat them all or you run back to your ship."]
//   - walking into a street with no lights brings the band, about two seconds later. A street with any light is safe.
//   - the size of the band fits the cadet's level: 10, 10, 7, 5. Each sum fits the level. The clock is one minute.
//   - beaten: a quarter of a credit (not a card), and that street is safe for the day. Next day, if it is still dark, they are back.
//   - too slow, or running: back at the ship. The rats then rest, so the cadet can always get through. The teacher switch turns them off.
// Run: node checks/mud_rats_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 1180, 820], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'on'); /* the rats are off unless the teacher switches them on */ } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || ''), key = d => p.tap(`#padkeys button[data-k="${d}"]`);
    const enter = async (sc, wait) => { await p.evaluate(sc => vGo(sc, .12), sc); await p.waitForTimeout(wait || 2600); return p.evaluate(() => widget ? widget.kind : null); };
    try {
    await p.evaluate(() => { skipIntro(); goVoltara(); const v = V(); v.crossed = true; v.met = true; v.count = true; RATS.rest = 0; save(); }); await p.waitForTimeout(300);
    ok(await enter('plaza') === null, 'no rats in the plaza'); ok(await p.evaluate(() => !RATS.due), 'nothing is due in the plaza');
    // ---- the ambush
    await p.evaluate(() => vGo('homes', .12)); await p.waitForTimeout(700); ok(await p.evaluate(() => !widget), 'the band should not be there in the first second'); await p.waitForTimeout(1900);
    ok(await p.evaluate(() => widget && widget.kind === 'rats' && widget.n === 10 && widget.lvl === 1), 'a dark street should bring a band of 10 at level 1'); expect(await p.textContent('#toy'), /A band of 10 mud rats attacks you from the dark![\s\S]*You have one minute to beat them all\. Or you run back to your ship\./, 'the ambush words');
    if (out) await p.screenshot({ path: path.join(out, `rats_${name}_1.png`) }); const c0 = await p.evaluate(() => S.cards.length);
    await p.tap('#hzgo'); await p.waitForTimeout(200); ok(await p.evaluate(() => !$('pad').hidden && $('rats').textContent.length > 0 && /10 left/.test($('hzn').textContent)), 'the fight shows ten rats and the number pad'); if (out) await p.screenshot({ path: path.join(out, `rats_${name}_2.png`) });
    const fits = await p.evaluate(() => widget.qs.every(q => q[0] + q[1] <= 10) && new Set(widget.qs.map(q => Math.min(q[0], q[1]) + '+' + Math.max(q[0], q[1]))).size === 10); ok(fits, 'ten different sums within 10');
    const answer = async wrongFirst => { const q = await p.evaluate(() => widget.qs[widget.i]), a = String(q[0] + q[1]); if (wrongFirst) { for (const d of String(q[0] + q[1] === 10 ? 11 : q[0] + q[1] + 1).slice(0, a.length)) await key(d); await p.waitForTimeout(60); } for (const d of a) await key(d); await p.waitForTimeout(40); };
    await answer(true); ok(await p.evaluate(() => widget.miss === 1 && widget.i === 1), 'a wrong answer is a slip, then the right one scares a rat off'); for (let i = 1; i < 10; i++) await answer(); await p.waitForTimeout(250);
    expect(await last(), /The last mud rat squeaks and runs off.*The band is beaten! You earn ¼ of a credit \(0\.25\)\. You have ¼ credit\..*Light this street/, 'beating the band');
    let st = await p.evaluate(() => ({ n: S.cards.length, q: S.q4, beat: V().ratBeat, sc: V().sc, log: S.log[S.log.length - 1].result, sk: evCounts()['NUM.FACT.1'] })); ok(st.n === c0 && st.q === 1 && st.beat.R === 1 && st.sc === 'homes', 'after a win, a quarter and no card: ' + JSON.stringify(st)); expect(st.log, /beaten: 10 sums in \d+ s, 1 slips/, 'the log line'); ok(st.sk && st.sk.right === 9 && st.sk.wrong === 1 && st.sk.later === 1 && st.sk.where['mud rats'] === 1, 'the record for NUM.FACT.1 should hold 9 first tries right, 1 wrong, 1 later try: ' + JSON.stringify(st.sk));
    // ---- the rats rest; a beaten street stays safe today; another dark street is still dangerous after the rest
    ok(await enter('shops') === null, 'the rats rest after an ambush, so the next street is quiet'); await p.evaluate(() => { RATS.rest = 0; }); ok(await enter('homes') === null, 'a beaten street is safe for the day'); ok(await enter('shops') === 'rats', 'another dark street has its own band');
    // ---- running away
    await p.tap('#leave'); await p.waitForTimeout(250); expect(await last(), /You do not stay to fight\. There are too many mud rats! You run all the way back to your ship/, 'running away'); ok(await p.evaluate(n => V().sc === 'meadow' && !widget && S.cards.length === n && S.q4 === 1 && !(V().ratBeat || {}).C, c0), 'running: back at the ship, nothing earned');
    ok(await enter('shops') === null, 'after running, the cadet can walk through: the rats rest');
    // ---- too slow
    await p.evaluate(() => { RATS.rest = 0; RATS.secs = 2; }); ok(await enter('works') === 'rats', 'Factory Row has a band too'); await p.tap('#hzgo'); await p.waitForTimeout(150); await answer(); await p.waitForTimeout(2300);
    expect(await last(), /Time is up\. There are too many mud rats! You run all the way back to your ship/, 'time is up'); ok(await p.evaluate(() => V().sc === 'meadow' && /ran away: 1 of 10 in 2 s/.test(S.log[S.log.length - 1].result)), 'too slow: back at the ship, and logged'); await p.evaluate(() => { RATS.secs = 60; });
    // ---- light ends it; the next day brings them back to a dark street
    await p.evaluate(() => { RATS.rest = 0; const i = SPOTS.find(q => q.k === 'C').i; V().plan = [i]; V().planDay = V().day; }); ok(await enter('shops') === null, 'a street with any light is safe');
    await p.evaluate(() => { RATS.rest = 0; V().plan = []; V().day = 2; }); ok(await enter('homes') === 'rats', 'next day, a street that is still dark has rats again'); await p.tap('#leave'); await p.waitForTimeout(200);
    // ---- the band fits the level
    for (const [lvl, n] of [[2, 10], [3, 7], [4, 5], [5, 5]]) { await p.evaluate(l => { RATS.rest = 0; S.flu = { lvl: l, best: {}, tries: {}, pass: {} }; }, lvl); ok(await enter('works') === 'rats', `level ${lvl}: a band`); const g = await p.evaluate(() => { $('hzgo').click(); return { n: widget.n, lvl: widget.lvl, qs: widget.qs }; });
      const fit = g.qs.every(([a, c]) => g.lvl === 2 ? a + c >= 11 && a + c <= 20 : g.lvl === 3 ? a % 10 + c % 10 <= 9 && a + c <= 99 && a >= 10 : a % 10 + c % 10 >= 10 && a + c <= 99); ok(g.n === n && g.qs.length === n && g.lvl === Math.min(4, lvl) && fit, `level ${lvl}: expected ${n} sums that fit, got ${JSON.stringify(g).slice(0, 120)}`); await p.tap('#leave'); await p.waitForTimeout(150); }
    // ---- never over a reading card or another task; the teacher switch
    await p.evaluate(() => { RATS.rest = 0; vGo('homes', .12); READ.open = true; }); await p.waitForTimeout(2600); ok(await p.evaluate(() => !widget), 'the band waits while a reading card is open'); await p.evaluate(() => { READ.open = false; }); await p.waitForTimeout(500); ok(await p.evaluate(() => widget && widget.kind === 'rats'), 'then it comes'); await p.tap('#leave'); await p.waitForTimeout(150);
    await p.evaluate(() => { RATS.rest = 0; $('ratsOn').checked = false; $('ratsOn').onchange(); }); ok(await enter('homes') === null && await p.evaluate(() => getKeep('gmq-rats') === 'off'), 'the teacher switch turns the rats off');
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close();
  }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
