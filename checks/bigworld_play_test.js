// The big world, played as a child would play it.   [Handoff: HANDOFF_Big_World_2026-11-22.md, Phase 2 and section 8]
// Page: prototypes/big_world.html (Planet Algora: the overworld and the Tindle Meadow).
//
// It only TAPS: the picture, the words, the boxes and the buttons. It never types and never reaches into the game to change it.
// (It reads the game's state to know what to expect, and it works every expected number out again by itself.)
//
// What it plays, on an iPad held sideways (1180 x 745):
//   1  the story comes first: six pages before the map; no maths on them
//   2  a machine before the elder: a Tindle sends the cadet to the village; no task opens
//   3  the pan before the pouch: it goes on the Needs list; no task opens
//   4  the walk to the village through the mist; inside, Elder Rivet's story, then the finished example (the old pump)
//   5  a machine: nothing typed, a number too big, tests, "handed back", notes written only when the child taps
//   6  a wrong plate: it is shown wrong by a test, and the right rule is never said
//   7  closing the page in the middle of a machine and opening it again: the same machine, the same notes
//   8  the right plate; all four plates; the pouch; the Rule Stone
//   9  real pips: a wrong guess (the machine does not run and does not say the answer), a run that cannot work (pips handed back), the right way
//  10  the pan: the wrong number of pips, a fresh pouch from the elder, then exactly right: the bridge comes down
//  11  over the bridge: the guard, the lookout, and no way further
//  12  the small quests: Pim's spinner, the keeper's coin (its fact fits this child's machine), the half plate (it names the share machine)
//  13  a second child crosses by the old stones only: a splash gives a new pattern; five right stones get across
//  14  closing in the middle of the stones and opening again
//  15  the big map, the Needs list, the ship panel, the report, "Go back to my ship"
// On all three screens (1180 x 745, 820 x 1180, 390 x 760): nothing scrolls, nothing spills, every button of every task is on the screen,
// the reading card is inside the picture, the picture has at least 45% of the screen. The page asks the network for nothing.
//
// Run:  node checks/bigworld_play_test.js [--shots folder]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const FILE = process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html');
const URL = 'file://' + path.resolve(FILE);
const SHOTS = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
const ruleOut = (rule, v, cap) => { const n = rule.n; cap = cap || 1e9; return rule.op === 'times' ? (v > 0 && v * n <= cap ? v * n : null) : rule.op === 'plus' ? (v + n <= cap ? v + n : null) : rule.op === 'minus' ? (v >= n ? v - n : null) : (v > 0 && v % n === 0 ? v / n : null); };
const SIGN = { times: '×', plus: '+', minus: '−', share: '÷' };

async function open(b, w, h, seed) { const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: SHOTS ? 2 : 1, hasTouch: true }), p = await ctx.newPage(); p.errs = []; p.reqs = [];
  p.on('pageerror', e => p.errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') p.errs.push(m.text()); }); p.on('request', r => p.reqs.push(r.url()));
  p.seedUrl = URL + '?seed=' + seed; await p.goto(p.seedUrl); await p.waitForFunction(() => window.__bw && window.__bw.S()); return p; }
const st = p => p.evaluate(() => { const b = window.__bw, S = b.S(); return { S: JSON.parse(JSON.stringify(S)), x: Math.round(b.P.px), y: Math.round(b.P.py), reading: b.READ.q.length > 0, page: b.READ.q[b.READ.i] || '', pages: b.READ.q.length, task: b.task() ? JSON.parse(JSON.stringify(b.task())) : null, panel: b.panel(), big: b.big(), pic: b.pic() ? b.pic().title : '', idle: b.idle(), place: document.getElementById('place').textContent, desk: document.getElementById('desk').innerText, tasktext: document.getElementById('task').innerText }; });
const idle = p => p.waitForFunction(() => window.__bw.idle(), null, { timeout: 30000 });
const shot = async (p, name) => { if (SHOTS) { await p.waitForTimeout(120); await p.screenshot({ path: path.join(SHOTS, name + '.png') }); } };
// read every page of a reading card, the way a child does: OK, OK, OK. Returns the pages.
async function readAll(p, max) { const got = []; for (let i = 0; i < (max || 30); i++) { const s = await st(p); if (!s.reading) break; got.push(s.page); await p.click('#readok'); await p.waitForTimeout(40); } return got; }
// tap a square of the map, if it is on the screen; otherwise tap toward it
async function tapSquare(p, x, y) { const g = await p.evaluate(() => { const c = document.getElementById('cv').getBoundingClientRect(); return { c: { l: c.left, t: c.top, w: c.width, h: c.height } }; });
  const cam = await p.evaluate(() => window.__bw.cam());
  const px = (x + .5 - cam.ox) * cam.ts, py = (y + .5 - cam.oy) * cam.ts, cx = Math.max(6, Math.min(g.c.w - 6, px)), cy = Math.max(52, Math.min(g.c.h - 6, py));
  await p.mouse.click(g.c.l + cx, g.c.t + cy); return px >= 0 && py >= 0 && px <= g.c.w && py <= g.c.h; }
async function walkTo(p, x, y) { for (let i = 0; i < 60; i++) { const s = await st(p); if (s.x === x && s.y === y) return true; await tapSquare(p, x, y); await p.waitForTimeout(60); await idle(p); } const s = await st(p); return s.x === x && s.y === y; }
// tap a thing word on the desk. If the thing is not close yet, walk beside it first (tapping the map).
async function word(p, thing, verb) { if (verb) await p.click(`#words [data-verb="${verb}"]`); try { await p.click(`#words [data-thing="${thing}"]`, { timeout: 4000 }); } catch (e) { const s = await st(p); throw new Error(`the word for "${thing}" is not on the desk. The cadet is at ${s.x},${s.y} in ${s.place}; reading: ${s.reading}; task: ${s.task && s.task.kind}; picture: ${s.pic}; desk: ${s.desk.replace(/\n/g, ' / ')}`); } await p.waitForTimeout(40); await idle(p); await p.waitForTimeout(40); }
async function goNear(p, id) { const t = await p.evaluate(id => { const t = window.__bw.things[id]; return { x: t.x, y: t.y, sx: t.stand[0], sy: t.stand[1] }; }, id); const okk = await walkTo(p, t.sx, t.sy); say(okk, `could not walk to ${id}`); return okk; }
// walk beside a thing by tapping the map, then tap its word. (A tap on the way may land on the thing itself: then it is already in use.)
async function useThing(p, id, verb) { const before = await st(p); await goNear(p, id); const s = await st(p); if (s.reading || s.task || s.panel || s.S.at !== before.S.at) return; await word(p, id, verb); }
const pad = async (p, n) => { await p.click('#pad [data-k="clr"]'); for (const d of String(n)) await p.click(`#pad [data-k="${d}"]`); };
const press = async (p, b) => { await p.click(`#task [data-b="${b}"]`); await p.waitForTimeout(40); };
async function testStones(p, n) { await pad(p, n); await press(p, 'pull'); await idle(p); await p.waitForTimeout(60); return (await st(p)).task.msg; }
async function plate(p, rule) { await press(p, 'plate'); await p.click(`#task [data-sign="${rule.op}"]`); await pad(p, rule.n); await press(p, 'fit'); return readAll(p); }
// layout: nothing scrolls, nothing spills, the desk's buttons are on the screen
async function layout(p, where) { const L = await p.evaluate(() => { const r = e => { const q = e.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom, q.width, q.height]; }, vis = e => !!(e.offsetWidth || e.offsetHeight), stage = r(document.getElementById('stage')), desk = r(document.getElementById('desk')), read = document.getElementById('read');
    const btns = [...document.querySelectorAll('#desk button, #hud button')].filter(vis).map(b => ({ t: b.textContent.trim().slice(0, 24), r: r(b) }));
    const task = document.getElementById('task'), words = document.getElementById('words');
    return { iw: innerWidth, ih: innerHeight, sw: document.scrollingElement.scrollWidth, sh: document.scrollingElement.scrollHeight, sy: scrollY, stage, desk, read: read.hidden ? null : r(read), btns, taskScroll: task.hidden ? 0 : task.scrollHeight - task.clientHeight, wordsScroll: words.hidden ? 0 : words.scrollHeight - words.clientHeight, deskScroll: document.getElementById('desk').scrollHeight - document.getElementById('desk').clientHeight }; });
  say(L.sw <= L.iw && L.sh <= L.ih && L.sy === 0, `${where}: the page scrolls or spills (${L.sw} x ${L.sh} in ${L.iw} x ${L.ih})`);
  say(L.stage[4] * L.stage[5] >= L.iw * L.ih * .45, `${where}: the picture has under 45% of the screen (${Math.round(L.stage[4] * L.stage[5] / (L.iw * L.ih) * 100)}%)`);
  for (const b of L.btns) say(b.r[0] >= -1 && b.r[2] <= L.iw + 1 && b.r[1] >= -1 && b.r[3] <= L.ih + 1, `${where}: the button "${b.t}" is off the screen`);
  say(L.taskScroll <= 2, `${where}: the task on the desk needs scrolling (${L.taskScroll}px hidden)`); say(L.wordsScroll <= 2, `${where}: the word rows need scrolling (${L.wordsScroll}px hidden)`); say(L.deskScroll <= 2, `${where}: the desk overflows by ${L.deskScroll}px`);
  if (L.read) say(L.read[0] >= L.stage[0] - 1 && L.read[2] <= L.stage[2] + 1 && L.read[1] >= L.stage[1] - 1 && L.read[3] <= L.stage[3] + 1, `${where}: the reading card is outside the picture`);
  for (const b of L.btns) say(b.r[5] >= 34, `${where}: the button "${b.t}" is only ${Math.round(b.r[5])}px tall`); }

(async () => {
  const b = await chromium.launch();
  for (const [w, h, name, seed] of [[1180, 745, 'iPad sideways', 7], [820, 1180, 'iPad upright', 23], [390, 760, 'phone', 41]]) {
    console.log(`--- ${name} (${w} x ${h}), child ${seed}`);
    const p = await open(b, w, h, seed);
    const tag = SHOTS ? `${w}x${h}_` : '';
    let s = await st(p); const NUM = await p.evaluate(() => window.__bw.NUM());
    say((await p.evaluate(() => window.__bw.check())).length === 0, `${name}: the world check finds faults: ${await p.evaluate(() => window.__bw.check().join(' | '))}`);

    // 1. the story first
    say(s.reading && s.pages === 6, `${name}: the story at the start has ${s.pages} pages, not 6`); await layout(p, `${name}, the first page`); await shot(p, tag + '01_story');
    const intro = await readAll(p); say(intro.length === 6 && /broken/.test(intro[0]) && /S\.S\. Infinity/.test(intro[2]) && /mission/i.test(intro[4]), `${name}: the story pages are not as written`); say(!intro.some(t => /\d\s*[×+−÷]\s*\d/.test(t)), `${name}: there is a sum in the story`);
    s = await st(p); say(!s.reading && s.x === 13 && s.y === 82 && s.place === 'Tindle Meadow', `${name}: after the story the cadet is not at the ship in the Tindle Meadow`); await layout(p, `${name}, the map`); await shot(p, tag + '02_map');

    // 2. a machine before the elder
    await useThing(p, 'm_pond'); s = await st(p); say(s.reading && !s.task, `${name}: a machine opened before the elder was met`); let pg = await readAll(p); say(pg.some(t => /Elder Rivet first/.test(t)), `${name}: the machine did not send the cadet to the elder`);
    // 3. the pan before the pouch
    await useThing(p, 'pan'); s = await st(p); say(s.reading && !s.task && s.pic === 'The bridge over the Rill', `${name}: the pan should show itself and wait`); await shot(p, tag + '03_pan_first'); pg = await readAll(p); s = await st(p); say(pg.some(t => t.indexOf(String(NUM.target)) >= 0) && s.S.needs.some(n => n.id === 'pan'), `${name}: the pan did not say its number or go on the Needs list`); say(!s.task && s.S.pouch === null, `${name}: the pan opened a task without a pouch`);

    // 4. the village and the elder
    await useThing(p, 'village'); s = await st(p); say(s.S.at === 'village' && s.place === 'Tindle Village', `${name}: the village did not open`); await readAll(p); await p.waitForTimeout(500); await shot(p, tag + '04_village'); await layout(p, `${name}, the village`);
    await word(p, 'rstone'); pg = await readAll(p); say(pg.some(t => /dark/.test(t)), `${name}: the Rule Stone should be dark`);
    await word(p, 'elder'); s = await st(p); say(s.reading, `${name}: the elder says nothing`); pg = await readAll(p, 6); say(pg.length === 6 && /plate/.test(pg[4]), `${name}: the elder's story is not 6 pages ending in the job`);
    s = await st(p); say(s.reading && s.pic === 'The painted wall', `${name}: the finished example does not follow the elder's story`); await p.click('#readok'); await p.click('#readok'); await p.click('#readok'); await shot(p, tag + '05_example_pump'); await layout(p, `${name}, the finished example`); pg = await readAll(p);
    s = await st(p); say(s.S.flags.metElder && s.S.bag.indexOf('notebook') >= 0 && s.S.needs.some(n => n.id === 'plates'), `${name}: after the elder there is no notebook or no need`);
    say(NUM.rule.times.n !== 4 && NUM.rule.plus.n !== 6, `${name}: the example's rules are this child's rules`);
    await word(p, 'door'); s = await st(p); say(s.S.at === 'map', `${name}: could not leave the village`);

    // 5. a machine: tests
    const sites = ['pond', 'wall', 'hill', 'orchard'], first = sites.find(x => NUM.at[x].op === 'times') , rule = NUM.at[first];
    await useThing(p, 'm_' + first); pg = await readAll(p); say(pg.length >= 3 && /burnt/.test(pg.join(' ')), `${name}: a machine's first look`); s = await st(p); say(s.task && s.task.kind === 'machine' && s.task.phase === 'test', `${name}: the machine did not open for tests`);
    say(s.tasktext.indexOf(SIGN[rule.op] + ' ' + rule.n) < 0, `${name}: the desk shows the rule before it is found`); await layout(p, `${name}, a machine`); await shot(p, tag + '06_machine_start');
    await press(p, 'pull'); s = await st(p); say(/1 to 20/.test(s.task.msg), `${name}: pulling with no number should ask for one`);
    let msg = await testStones(p, 25); say(/1 to 20/.test(msg), `${name}: 25 test stones should be refused`);
    msg = await testStones(p, 3); say(msg === `3 went in. ${ruleOut(rule, 3)} came out.`, `${name}: 3 test stones gave "${msg}"`); await shot(p, tag + '07_machine_tested'); await layout(p, `${name}, a machine after a test`);
    s = await st(p); say(!(s.S.notes[first] || []).length, `${name}: the game wrote in the notebook by itself`); await press(p, 'write'); s = await st(p); say((s.S.notes[first] || []).length === 1 && s.S.notes[first][0][0] === 3, `${name}: "Write it in my notes" did not write`);
    const shareSite = sites.find(x => NUM.at[x].op === 'share');
    // 6. a wrong plate: add, with the number that fits the one test
    const wrong = { op: 'plus', n: ruleOut(rule, 3) - 3 }; pg = await plate(p, wrong); await shot(p, tag + '08_plate_wrong'); say(pg.length === 3 && /Not the rule yet/.test(pg[2]), `${name}: a wrong plate was not shown wrong: ${pg.join(' / ')}`); say(!pg.join(' ').includes(SIGN[rule.op] + ' ' + rule.n), `${name}: the right rule was said after a wrong plate`);
    { const m = /drops in (\d+) test stones\. Your plate says (\d+) will come out\. Out come (\d+)/.exec(pg[1] || ''); say(m && +m[2] === ruleOut(wrong, +m[1]) && +m[3] === ruleOut(rule, +m[1]) && m[2] !== m[3], `${name}: the test that shows the plate wrong is not right: ${pg[1]}`); }
    s = await st(p); say(s.task.phase === 'test' && !s.S.mach[first].ok && s.S.mach[first].tries === 1, `${name}: after a wrong plate the machine should be back at tests`);
    // 7. close the page in the middle, and open it again
    await p.goto(p.seedUrl); await p.waitForFunction(() => window.__bw && window.__bw.S());  s = await st(p); say(s.task && s.task.kind === 'machine' && s.task.site === first && (s.S.notes[first] || []).length === 1 && !s.reading, `${name}: after closing and opening, the machine and the notes are not back`); say(s.S.seed === seed, `${name}: the child's numbers changed after opening again`);
    // 8. the right plate
    msg = await testStones(p, 4); pg = await plate(p, rule); say(pg.length >= 4 && /true/.test(pg[2]), `${name}: the right plate was not accepted: ${pg.join(' / ')}`); s = await st(p); say(s.S.mach[first].ok && s.S.cards.length === 0, `${name}: the plate is not marked true`); await shot(p, tag + '09_plate_right');
    say(/1 of 4/.test(s.S.needs.find(n => n.id === 'plates').text), `${name}: the Needs list does not count the plate`); await press(p, 'leave');
    // the pouch
    await useThing(p, 'village'); await readAll(p); await word(p, 'elder'); pg = await readAll(p); s = await st(p); say(s.S.pouch === NUM.start && pg.some(t => t.indexOf(String(NUM.target)) >= 0), `${name}: the elder did not give the pouch and the pan's number`);
    await word(p, 'kid'); pg = await readAll(p); s = await st(p); say(s.S.needs.some(n => n.id === 'spinner'), `${name}: Pim did not ask for the spinner`); await word(p, 'door');
    // the other three plates. A machine that hands test stones back says so.
    for (const site of sites.filter(x => x !== first)) { const r = NUM.at[site]; await useThing(p, 'm_' + site); await readAll(p); msg = await testStones(p, 1); const o1 = ruleOut(r, 1); say(o1 === null ? /hands them back/.test(msg) : msg === `1 went in. ${o1} came out.`, `${name}: ${site}: 1 test stone gave "${msg}"`); if (site === shareSite) await shot(p, tag + '10_handed_back'); msg = await testStones(p, 12); await press(p, 'write'); pg = await plate(p, r); say(/true/.test(pg.join(' ')), `${name}: ${site}: the right plate was refused`); await press(p, 'leave'); }
    s = await st(p); say(sites.every(x => s.S.mach[x].ok), `${name}: not all four plates are true`);
    // 12 (part). the half plate names the share machine; the spinner; the coin
    await useThing(p, 'rubble'); pg = await readAll(p); s = await st(p); say(s.S.hint === shareSite && pg.some(t => t.indexOf('÷') >= 0), `${name}: the half plate does not name the share machine`);
    await useThing(p, 'spin'); await readAll(p); s = await st(p); say(s.S.bag.indexOf('spinner') >= 0, `${name}: the spinner was not picked up`);
    await useThing(p, 'keeper'); await readAll(p); await word(p, 'keeper'); await readAll(p); s = await st(p); say(s.S.needs.some(n => n.id === 'coin'), `${name}: the keeper did not speak of the coin`);
    await useThing(p, 'log'); await readAll(p); await useThing(p, 'keeper'); pg = await readAll(p); { const more = NUM.at.orchard.op === 'times' || NUM.at.orchard.op === 'plus'; say(pg.some(t => t.indexOf(more ? 'gave back more' : 'gave back less') >= 0), `${name}: the keeper's fact does not fit the Orchard Machine: ${pg.join(' / ')}`); }
    // 9. real pips
    const way = NUM.ways[0], siteOf = op => sites.find(x => NUM.at[x].op === op);
    // 10 (part). the pan with the wrong number of pips
    await useThing(p, 'pan'); pg = await readAll(p); say(pg.length === 4 && /order/i.test(pg[3]), `${name}: the carving (the second finished example) did not show before the pan`); s = await st(p); say(s.task && s.task.kind === 'pan', `${name}: the pan task did not open`); await shot(p, tag + '11_pan'); await layout(p, `${name}, the pan`);
    await press(p, 'pour'); s = await st(p); say(/springs back/.test(s.task.msg) && !s.S.gates.bridge && s.S.pouch === NUM.start, `${name}: the pan took the wrong number of pips`); await press(p, 'leave');
    // a wrong guess: the machine does not run, and does not tell
    let pouch = NUM.start; await useThing(p, 'm_' + siteOf(way[0])); s = await st(p); say(s.task.phase === 'real', `${name}: a true machine with a pouch should ask for real pips`); const out0 = ruleOut(NUM.rule[way[0]], pouch, 100);
    say(s.tasktext.indexOf(' ' + out0 + ' ') < 0 || out0 === NUM.target || out0 === pouch, `${name}: the desk shows what will come out`); await layout(p, `${name}, real pips`); await shot(p, tag + '12_real_pips');
    await press(p, 'pour'); s = await st(p); say(/First say/.test(s.task.msg), `${name}: pouring with no guess`);
    await pad(p, out0 + 1); await press(p, 'pour'); await p.waitForTimeout(100); s = await st(p); say(s.S.pouch === pouch && s.S.runs === 0 && /not what the plate says/.test(s.task.msg) && s.task.msg.indexOf(String(out0)) < 0, `${name}: a wrong guess ran the machine, or gave the answer away`);
    // a run that cannot work: find a machine that cannot take this pouch, if there is one
    { const stuck = ['times', 'plus', 'minus', 'share'].find(o => ruleOut(NUM.rule[o], pouch, 100) === null); if (stuck) { await press(p, 'leave'); await useThing(p, 'm_' + siteOf(stuck)); await pad(p, 1); await press(p, 'pour'); await idle(p); await p.waitForTimeout(80); s = await st(p); say(s.S.pouch === pouch && /hands them back/.test(s.task.msg), `${name}: a run that cannot work changed the pouch: ${s.task.msg}`); await shot(p, tag + '13_cannot_run'); await press(p, 'leave'); await useThing(p, 'm_' + siteOf(way[0])); } }
    // spoil the pouch on purpose, then ask the elder for a fresh one
    await pad(p, out0); await press(p, 'pour'); await idle(p); await p.waitForTimeout(80); s = await st(p); say(s.S.pouch === out0 && s.S.runs === 1, `${name}: the right guess did not run the machine`); await shot(p, tag + '14_real_ran'); await press(p, 'leave');
    await useThing(p, 'village'); await word(p, 'elder'); s = await st(p); if (s.reading) { pg = await readAll(p); await word(p, 'elder'); s = await st(p); } say(s.task && s.task.kind === 'fresh', `${name}: the elder did not offer a fresh pouch`); await layout(p, `${name}, a fresh pouch`); await press(p, 'yes'); s = await st(p); say(s.S.pouch === NUM.start && s.S.runs === 0, `${name}: the fresh pouch is not ${NUM.start}`);
    // the Rule Stone
    await word(p, 'elder'); pg = await readAll(p); s = await st(p); if (!s.S.flags.stoneLit) { await word(p, 'elder'); pg = await readAll(p); s = await st(p); } say(s.S.flags.stoneLit && s.S.lit === 1 && s.S.cards.some(c => c.job === 'plates'), `${name}: four true plates did not light the Rule Stone`); await p.waitForTimeout(300); await shot(p, tag + '15_stone_lit'); await word(p, 'door');
    // the right way, three runs, each said first
    for (const op of way) { await useThing(p, 'm_' + siteOf(op)); const o = ruleOut(NUM.rule[op], pouch, 100); await pad(p, o); await press(p, 'pour'); await idle(p); await p.waitForTimeout(80); s = await st(p); say(s.S.pouch === o, `${name}: ${pouch} ${op} should give ${o}, the pouch holds ${s.S.pouch}`); pouch = o; await press(p, 'leave'); }
    say(pouch === NUM.target, `${name}: the way in the page's own list does not reach the pan's number`);
    // 10. the bridge
    await useThing(p, 'pan'); await press(p, 'pour'); s = await st(p); say(s.reading && s.S.gates.bridge === 1, `${name}: the right pips did not bring the bridge down`); await p.waitForTimeout(1300); await shot(p, tag + '16_bridge_down'); pg = await readAll(p); say(pg.some(t => /Three machine runs/.test(t)), `${name}: three runs were not noticed: ${pg.join(' / ')}`); s = await st(p); say(s.S.cards.some(c => c.job === 'bridge') && s.S.pouch === null && !s.task, `${name}: after the bridge: card, pouch, task`);
    // 11. over the bridge
    say(await walkTo(p, 52, 74), `${name}: could not walk over the bridge`); await shot(p, tag + '17_far_bank'); await useThing(p, 'guard'); pg = await readAll(p); say(/bridge down/.test(pg.join(' ')), `${name}: the guard does not know about the bridge`); await word(p, 'guard'); await readAll(p);
    await useThing(p, 'lookout'); s = await st(p); say(s.pic === 'The lookout hill', `${name}: the lookout shows no picture`); await p.click('#readok'); await p.click('#readok'); await shot(p, tag + '18_lookout'); await layout(p, `${name}, the lookout`); await readAll(p);
    await walkTo(p, 70, 74); s = await st(p); say(s.x <= 58, `${name}: the cadet got past the reed gate, to ${s.x},${s.y}`);
    // Pim's spinner
    await useThing(p, 'village'); await word(p, 'kid'); pg = await readAll(p); s = await st(p); say(s.S.flags.spinGiven && s.S.cards.some(c => c.job === 'spinner') && /old stones/.test(pg.join(' ')), `${name}: Pim did not take the spinner and give the clue`); await word(p, 'door');
    // 15. the big map, the Needs list, the ship
    await p.click('#b_map'); await p.waitForTimeout(200); s = await st(p); say(s.big, `${name}: the big map did not open`); await shot(p, tag + '19_big_map'); await layout(p, `${name}, the big map`); await p.click('#b_map');
    await p.click('#b_needs'); s = await st(p); say(s.panel === 'needs' && /What I still need/.test(s.tasktext) && /hedge|Rillfolk road/.test(s.tasktext), `${name}: the Needs list`); await shot(p, tag + '20_needs'); await p.click('#b_needs');
    await p.click('#b_ship'); await layout(p, `${name}, the ship panel`); await press(p, 'report'); s = await st(p); say(/Mission report/.test(s.tasktext) && /Rule Stone/.test(s.tasktext) && s.S.log.length >= 12, `${name}: the mission report is thin (${s.S.log.length} lines)`); await shot(p, tag + '21_report'); await press(p, 'ship'); await press(p, 'home'); await p.waitForTimeout(600); s = await st(p); say(s.x === 13 && s.y === 82 && !s.panel, `${name}: "Go back to my ship" did not`);
    say((s.S.rattles || 0) + (s.S.miss || 0) >= 1 && s.S.log.some(l => /not right/.test(l.result)), `${name}: the report does not hold the wrong tries`);
    say(!p.errs.length, `${name}: errors: ${p.errs.join(' | ')}`); say(p.reqs.every(u => u.split('?')[0] === URL), `${name}: the page asked the network for something`);
    await p.context().close();
  }

  // 13, 14. a second child: the old stones only
  console.log('--- the old stones, iPad sideways and phone');
  for (const [w, h, name, seed] of [[1180, 745, 'stones, iPad sideways', 101], [390, 760, 'stones, phone', 202]]) { const p = await open(b, w, h, seed); const tag = SHOTS ? `${w}x${h}_` : '';
    await readAll(p); await useThing(p, 'post'); let s = await st(p); say(s.reading && s.pic === 'The old picture on the post', `${name}: the finished example (another river) did not come first`); await p.click('#readok'); await p.click('#readok'); await shot(p, tag + '22_stones_example'); let pg = await readAll(p);
    s = await st(p); say(s.task && s.task.kind === 'stones', `${name}: the stones did not open`); await layout(p, name); await shot(p, tag + '23_stones');
    const rounds = await p.evaluate(seed => [0, 1, 2].map(r => window.__bw.stones(seed, r)), seed);
    say(s.tasktext.indexOf(rounds[0].shown.join(', ')) >= 0, `${name}: the post's numbers are not on the desk`);
    // one right step, then a wrong one: splash, and a new pattern
    await press(p, 's' + rounds[0].rows[0].right); s = await st(p); say(s.S.st.row === 1, `${name}: a right stone did not hold`);
    await press(p, 's' + ((rounds[0].rows[1].right + 1) % 3)); s = await st(p); say(s.reading && /Splash/.test(s.page), `${name}: a wrong stone did not splash`); await shot(p, tag + '24_splash'); await readAll(p); s = await st(p); say(s.S.st.round === 1 && s.S.st.row === 0 && s.tasktext.indexOf(rounds[1].shown.join(', ')) >= 0 && rounds[1].shown.join() !== rounds[0].shown.join(), `${name}: after a splash the pattern is not new`);
    // tap the stones on the picture this time; close and open in the middle
    for (let i = 0; i < 2; i++) { const hit = await p.evaluate(() => { const c = document.getElementById('cv').getBoundingClientRect(); return window.__bw.pic().hit.map(q => [c.left + q[0], c.top + q[1], q[3]]); }); const k = rounds[1].rows[i].right, q = hit.find(x => x[2] === k); await p.mouse.click(q[0], q[1]); await p.waitForTimeout(60); }
    s = await st(p); say(s.S.st.row === 2, `${name}: tapping a stone on the picture did not step (${s.S.st.row})`);
    await p.goto(p.seedUrl); await p.waitForFunction(() => window.__bw && window.__bw.S());  s = await st(p); say(s.task && s.task.kind === 'stones' && s.S.st.row === 2 && s.S.st.round === 1, `${name}: after closing and opening, the cadet is not on the same stone`);
    for (let i = 2; i < 5; i++) await press(p, 's' + rounds[1].rows[i].right); s = await st(p); say(s.reading && s.S.gates.stones === 1, `${name}: five right stones did not get across`); await readAll(p); s = await st(p); say(s.x === 50 && s.y === 60 && !s.task && s.S.cards.some(c => c.job === 'stones') && !s.S.gates.bridge, `${name}: after the stones the cadet should stand on the far bank`);
    await useThing(p, 'guard'); pg = await readAll(p); say(/old stones/.test(pg.join(' ')), `${name}: the guard does not know about the stones`); say(await walkTo(p, 46, 60), `${name}: could not walk back over the stones`); await shot(p, tag + '25_back_over_stones');
    s = await st(p); say(s.S.lit === 0 && !s.S.flags.metElder, `${name}: crossing by the stones should not need the elder or light a stone`);
    say(!p.errs.length, `${name}: errors: ${p.errs.join(' | ')}`); await p.context().close(); }

  await b.close();
  console.log(bad.length ? `FAILED: ${bad.length} faults\n  ` + bad.join('\n  ') : 'ok: the big world plays through on three screens, by taps only: the story, the elder, four machines, the pouch and the pan, the bridge, the far bank, the small quests, the old stones, closing and opening again');
  process.exit(bad.length ? 1 : 0);
})();
