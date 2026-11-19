// Practice evidence, by the skill map of Marc's Mathematics Evidence Dashboard (num-2.0).
// [Source: Marc, 2026-11-19: he sent the dashboard. Its rules: counts and evidence, no grades, no mastery percentages, no rankings, no labels;
//  a status is worked out only by the dashboard's own table, from work the teacher has marked.]
//   - the map in the game: 37 skills in 11 threads, well formed. Every skill the game says it covers is on the map.
//   - an answer in a space hazard, to a time wisp, to the mud rats and at a world lock is kept: day, skill, where, right or wrong, first try or not, the question.
//   - the teacher's view: a tab for each thread, counts only. It never shows a percentage, a status or a label.
//   - "no practice yet" is not shown like "did badly". Skills the game cannot practise yet say so.
//   - the data view uses the dashboard's words CORRECT and INCORRECT, and says plainly that it is not a Stage 2 import. Mud rats are off unless switched on.
// Run: node checks/practice_evidence_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 1180, 820], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${String(got).slice(0, 300)}"`); };
    const key = d => p.tap(`#padkeys button[data-k="${d}"]`);
    try {
    const m = await p.evaluate(() => { skipIntro(); const ids = Object.keys(SKMAP.nodes); return { ver: SKMAP.ver, n: ids.length, threads: Object.keys(SKMAP.threads), badId: ids.filter(id => !/^NUM\.[A-Z]+\.\d+$/.test(id) || id.split('.')[1] !== SKMAP.nodes[id][0] || !SKMAP.threads[SKMAP.nodes[id][0]] || !SKMAP.nodes[id][1]), cover: Object.keys(SK_COVER).filter(id => !SKMAP.nodes[id]), gapOnMap: Object.keys(SKGAP).filter(id => SKMAP.nodes[id]), names: [SKMAP.nodes['NUM.FACT.1'][1], SKMAP.nodes['NUM.ADD.1'][1], SKMAP.nodes['NUM.PV.6'][1], SKMAP.nodes['NUM.FRAC.6'][1]], rats: RATON.on, ratsBox: $('ratsOn').checked }; });
    ok(m.ver === 'num-2.0' && m.n === 37 && m.threads.join() === 'REL,FACT,PV,EST,ADD,SUB,MULT,DIV,PROB,PAT,FRAC', `the map should be num-2.0 with 37 skills in 11 threads: ${m.ver}, ${m.n}, ${m.threads}`); ok(!m.badId.length, 'badly formed skills: ' + m.badId); ok(!m.cover.length && !m.gapOnMap.length, 'the game claims a skill that is not on the map, or lists a map skill as off the map');
    ok(m.names.join('|') === 'Addition and Subtraction Facts Within 20|Add Within 100|Round to the Nearest 10|Compare Fractions by Size', 'skill names should be Marc\'s own: ' + m.names.join('|')); ok(m.rats === false && m.ratsBox === false, 'mud rats should be off unless the teacher switches them on');
    // ---- a space hazard: level 1 sums go to NUM.FACT.1
    await p.evaluate(() => { goSpace(); act('practice'); }); await p.waitForTimeout(300); await p.tap('#hzgo'); await p.waitForTimeout(150);
    for (let i = 0; i < 10; i++) { const q = await p.evaluate(() => widget.qs[widget.i]), a = String(q[0] + q[1]); if (i === 0) { for (const d of String(q[0] + q[1] === 10 ? 11 : q[0] + q[1] + 1).slice(0, a.length)) await key(d); await p.waitForTimeout(60); } for (const d of a) await key(d); await p.waitForTimeout(40); } await p.waitForTimeout(250);
    let ev = await p.evaluate(() => S.ev); ok(ev.length === 11 && ev.every(r => r[1] === 'NUM.FACT.1' && r[2] === 'space hazard' && /^\d+ \+ \d+$/.test(r[5])), 'a hazard at level 1 should leave 11 answers under NUM.FACT.1: ' + JSON.stringify(ev.slice(0, 3)));
    ok(ev[0][3] === 0 && ev[0][4] === 1 && ev[1][3] === 1 && ev[1][4] === 0 && ev[2][3] === 1 && ev[2][4] === 1, 'a wrong first try, then a right later try, then a right first try: ' + JSON.stringify(ev.slice(0, 3)));
    // ---- level 3 sums go to NUM.ADD.1; a world lock goes to its own skill
    await p.evaluate(() => { S.flu = { lvl: 3, best: {}, tries: {}, pass: {} }; act('practice'); }); await p.waitForTimeout(300); await p.tap('#hzgo'); await p.waitForTimeout(150); { const q = await p.evaluate(() => widget.qs[0]); for (const d of String(q[0] + q[1])) await key(d); } await p.waitForTimeout(100); await p.tap('#leave'); await p.waitForTimeout(200);
    ok(await p.evaluate(() => { const r = S.ev[S.ev.length - 1]; return r[1] === 'NUM.ADD.1' && r[3] === 1 && r[4] === 1; }), 'a 2-digit sum should go under NUM.ADD.1');
    const lock = await p.evaluate(() => { const n = Object.keys(TR).find(n => wKit(n).lock === 0), k = wKit(n); landWorld(n); startWLock(k); const q = wLockQ(k, 0); $('ans').value = String(q.a + 1); $('try').click(); $('ans').value = String(q.a); $('try').click(); return S.ev.slice(-2); });
    ok(lock[0][1] === 'NUM.PV.6' && lock[0][3] === 0 && lock[0][4] === 1 && lock[1][1] === 'NUM.PV.6' && lock[1][3] === 1 && lock[1][4] === 0 && lock[0][2] === 'world lock', 'a rounding lock should leave a wrong first try and a right later try under NUM.PV.6: ' + JSON.stringify(lock));
    // ---- a time skill is kept, but it is not on the number map
    await p.evaluate(() => { skTally('TIME.READ', true, 'time wisp', 'a clock that shows 3:25', true); });
    // ---- the teacher's view
    await p.evaluate(() => { document.querySelectorAll('details').forEach(d => { d.open = true; }); drawEvidence('FACT'); }); await p.waitForTimeout(150);
    let view = await p.textContent('#evbox'); expect(view, /Counts only[\s\S]*No status is worked out here[\s\S]*Map: num-2\.0/, 'the view says what it is');
    expect(view, /NUM\.FACT\.1\s*Addition and Subtraction Facts Within 20\s*9\s*1\s*1\s*1\s*\d{4}-\d\d-\d\d\s*space hazard/, 'NUM.FACT.1 should show 9 first tries right, 1 wrong, 1 later try, 1 day'); expect(view, /NUM\.FACT\.2[\s\S]*The game has no quick questions for this skill yet\./, 'a skill the game cannot practise says so');
    const tabs = await p.evaluate(() => Array.from(document.querySelectorAll('#evbox .evtabs button')).map(x => x.dataset.t + (x.classList.contains('has') ? '*' : ''))); ok(tabs.join() === 'REL,FACT*,PV*,EST,ADD*,SUB,MULT,DIV,PROB,PAT,FRAC,GAP*', 'a tab for each thread, marked where there is practice: ' + tabs);
    await p.tap('#evbox .evtabs button[data-t="PV"]'); await p.waitForTimeout(100); view = await p.textContent('#evbox'); expect(view, /Place Value and Whole-Number Magnitude[\s\S]*NUM\.PV\.6\s*Round to the Nearest 10\s*0\s*1\s*1\s*1[\s\S]*NUM\.PV\.7\s*Round to the Nearest 100\s*No practice yet\./, 'the place value tab');
    await p.tap('#evbox .evtabs button[data-t="GAP"]'); await p.waitForTimeout(100); expect(await p.textContent('#evbox'), /not on your number map[\s\S]*TIME\.READ\s*Read a clock to 5 minutes\s*1\s*0\s*0\s*1/, 'the tab for skills that are not on the map'); if (out) await (await p.$('#evbox')).screenshot({ path: path.join(out, `evidence_${name}.png`) });
    // the numbers must be easy to see against their panel
    const con = await p.evaluate(() => { drawEvidence('FACT'); const lum = c => { const v = c.match(/[\d.]+/g).map(Number).slice(0, 3).map(x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; }, bgOf = el => { while (el) { const c = getComputedStyle(el).backgroundColor, a = c.match(/[\d.]+/g).map(Number); if (a.length < 4 || a[3] > .9) return c; el = el.parentElement; } return 'rgb(255,255,255)'; };
      return Array.from(document.querySelectorAll('#evbox td, #evbox th, #evbox td b')).map(el => { const a = lum(getComputedStyle(el).color), c = lum(bgOf(el)); return (Math.max(a, c) + .05) / (Math.min(a, c) + .05); }).reduce((m, x) => Math.min(m, x), 99); });
    ok(con >= 4.5, 'the evidence table is hard to read: lowest contrast ' + con.toFixed(2));
    for (const t of tabs) { await p.evaluate(t => drawEvidence(t.replace('*', '')), t); const txt = await p.textContent('#evbox'); if (/%|master|strong|weak|struggl|level \d|grade|score|rank|percent|REPEATED_DIFFICULTY|STRONG_EVIDENCE/i.test(txt)) bad.push(`${name}: the ${t} tab shows a percentage, a status or a label`); }
    // ---- the data view
    await p.tap('#evjson'); await p.waitForTimeout(100); const data = JSON.parse(await p.inputValue('#evout')); ok(data.source === 'gmq-practice' && /Not a Stage 2 import/.test(data.note) && data.map_version === 'num-2.0' && data.records.length === ev.length + 4 && data.records.every(r => ['CORRECT', 'INCORRECT'].indexOf(r.verdict) >= 0 && typeof r.first_try === 'boolean' && r.item) && data.records.filter(r => !r.on_map).length === 1, 'the data view: ' + JSON.stringify(data).slice(0, 200));
    // ---- kept after a reload; never more than 1,500
    const n0 = await p.evaluate(() => S.ev.length); await p.evaluate(() => save()); await p.waitForTimeout(300); await p.reload(); await p.waitForTimeout(500); ok(await p.evaluate(n => S.ev && S.ev.length === n, n0), 'the answers should be kept after a reload');
    ok(await p.evaluate(() => { for (let i = 0; i < 1600; i++) skTally('NUM.FACT.1', true, 'test', '1 + 1', true); return S.ev.length === 1500; }), 'only the newest 1,500 answers are kept');
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close();
  }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
