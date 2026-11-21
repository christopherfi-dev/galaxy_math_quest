// Plays the skills trainer in prototypes/kis_station_sketch.html through the real page.   [Proposal]
//
// For EVERY skill it plays two paths by answering in the task panel, as a student would:
//   1. knows it:      three right answers                         -> PASSED
//   2. has a gap:     wrong, wrong, the small steps, three right  -> REMEDIATED
// Then, on a few skills, the other paths: a slip (SELF-CORRECTED) and not ready (FAILED-FOUNDATIONAL).
// Picture toys are answered by clicking the picture: bars, fraction parts, number line marks, map points.
//
// Run:  node checks/trainer_paths_test.js [folder for screenshots]
// Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch(), errs = [];
  const p = await (await b.newContext({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1 })).newPage();
  p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} }); /* reading cards have their own test: reading_card_test.js */ await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
  await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); S.bot = true; S.botName = 'Zip'; save(); });
  // answer the question on screen, right or wrong, through the panel's own controls
  const answer = right => p.evaluate(right => {
    const w = widget, k = w.akind, g = w.cur, hit = sel => (document.querySelector('#toy ' + sel) || document.querySelector('#stageview ' + sel)).dispatchEvent(new MouseEvent('click', { bubbles: true })), type = (id, v) => { $(id).value = String(v); $(id).oninput(); };
    if (k === 'num') { type('ans', right ? w.ans : w.ans + 1); return $('try').click(); }
    if (k === 'time') { type('ans', right ? w.ans : (w.ans % 100 === 59 ? w.ans - 1 : w.ans + 1)); return $('try').click(); }
    if (k === 'money') { type('ans', String(right ? w.ans : w.ans + 5).padStart(3, '0')); return $('try').click(); }
    if (k === 'pair') { type('ans', g.ans[0]); type('ans2', right ? g.ans[1] : g.ans[1] + 1); return $('try').click(); }
    if (k === 'choice') return hit(`.opt[data-c="${right ? w.ans : (w.ans + 1) % g.choices.length}"]`);
    const t = g.pic.t;
    if (t === 'bar') g.pic.cats.forEach((c, i) => { const u = c.n / g.pic.step; hit(`[data-t="b:${i},${right || i ? u : (u > 1 ? u - 1 : u + 1)}"]`); });
    else if (t === 'model') { hit(`.cut[data-cut="${g.v.den}"]`); for (let i = 0; i < (right ? g.v.num : g.v.num + 1); i++) hit(`[data-t="p:${i}"]`); }
    else if (t === 'nline') hit(`[data-t="k:${right ? g.v.num : g.v.num - 1}"]`);
    else if (t === 'plane') hit(`[data-t="c:${right ? g.v.x : g.v.y},${right ? g.v.y : g.v.x}"]`);
    $('try').click();
  }, right);
  const phase = () => p.evaluate(() => widget && widget.kind === 'skill' ? widget.phase : 'closed');
  const steps = async () => { let n = 0; while ((await phase()) === 'teach' && n++ < 14) await answer(true); return n; };
  const run = async (rule, moves) => { await p.evaluate(r => { delete S.skill[r]; startSkill(r, 'Zip', 'station'); }, rule); let taught = 0;
    for (const m of moves) { if ((await phase()) === 'closed') break; if (m === 'steps') taught += await steps(); else await answer(m === 'right'); }
    return { status: await p.evaluate(r => (S.skill[r] || {}).status || 'open: ' + (widget ? widget.phase : 'closed'), rule), taught }; };
  const rules = await p.evaluate(() => LADDER.map(l => [l[0], !!TEACH[l[0]], (GEN[l[0]]().kind || 'num')]));
  const bad = []; let withSteps = 0; const kinds = {};
  const noWord = await p.evaluate(() => { startSkill('perim_labeled', 'Zip', 'station'); const t = $('toy').innerText; leave(); return !/Maths word: perimeter/i.test(t) || !/perimeter of/i.test(t); }); if (noWord) bad.push('the perimeter question does not say perimeter');
  for (const [rule, hasSteps, kind] of rules) {
    kinds[kind] = (kinds[kind] || 0) + 1;
    const a = await run(rule, ['right', 'right', 'right']); if (a.status !== 'PASSED') bad.push(`${rule}: three right gave ${a.status}`);
    const g = await run(rule, ['wrong', 'wrong', 'steps', 'right', 'right', 'right']); if (g.status !== 'REMEDIATED') bad.push(`${rule}: gap path gave ${g.status}`);
    if (hasSteps) { withSteps++; if (!g.taught) bad.push(`${rule}: has steps but none were shown`); } else if (g.taught) bad.push(`${rule}: steps shown but none are written`);
  }
  console.log(`${rules.length} skills played twice each. Answer kinds:`, JSON.stringify(kinds), `· ${withSteps} have small steps.`);
  for (const rule of ['add_2digit_regroup', 'clock_five', 'frac_model', 'shape_basic', 'coord_read', 'coins_decimal']) {
    const s = await run(rule, ['right', 'wrong', 'right', 'right', 'right']); if (s.status !== 'SELF-CORRECTED') bad.push(`${rule}: slip path gave ${s.status}`);
    const n = await run(rule, ['wrong', 'wrong', 'steps', 'wrong', 'steps', 'wrong']); if (n.status !== 'FAILED-FOUNDATIONAL') bad.push(`${rule}: not-ready path gave ${n.status}`);
  }
  console.log('Slip and not-ready paths played on 6 skills.');
  // who asks what: on the station the robot is a guide and asks nothing. Voltara's animals ask only Numbers Quest 1. The rest is a bank.
  const scope = await p.evaluate(() => { const walk = list => { S.skill = {}; const seq = []; let r, n = 0; while ((r = nextUnlit(list)) && n++ < 99) { seq.push(r); S.skill[r] = { status: 'PASSED', tries: 3 }; } return seq; };
    const vo = walk(AT_VOLTARA); S.skill = {}; S.bot = true; save(); drawStars(); const talk = zipTalk(), asked = !!widget;
    return { vo, talk, asked, hidden: $('stars').hidden, total: LADDER.length }; });
  if (scope.vo.length !== 4) bad.push('Voltara should ask 4 skills, got ' + scope.vo.length);
  if (scope.asked || !/beeps: /.test(scope.talk)) bad.push('the robot should give a hint and ask nothing: ' + scope.talk);
  if (!scope.hidden) bad.push('the star chart should be hidden on the station');
  console.log(`The robot gives a hint and asks nothing. Voltara asks ${scope.vo.length}. ${scope.total - 4} more skills wait in the bank.`);
  if (out) for (const rule of ['clock_minute', 'bar_build', 'frac_model', 'nl_frac', 'coord_what', 'frac_parts', 'area_tile', 'sym_line', 'picto_multi', 'frac_thirds']) {
    await p.evaluate(r => { S.seed = 99; startSkill(r, 'Zip', 'station'); }, rule); await p.waitForTimeout(80); await p.screenshot({ path: path.join(out, `toy_${rule}.png`) }); await p.evaluate(() => leave()); }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none');
  console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL');
  await b.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
