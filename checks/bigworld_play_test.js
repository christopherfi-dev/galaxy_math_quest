// The big world, played as a child would play it.   [Handoff: HANDOFF_Big_World_2026-11-22.md, Phase 2 and section 8]
// Page: prototypes/big_world.html (Planet Algora: the overworld and the Mender Meadow).
//
// It only TAPS: the picture, the words, the boxes and the buttons. It never types and never reaches into the game to change it.
// (It reads the game's state to know what to expect, and it works every expected number out again by itself.)
//
// What it plays, on an iPad held sideways (1180 x 745):
//   1  the story comes first: six pages before the map; no maths on them
//   2  a machine before the elder: a Mender sends the cadet to the village; no task opens
//   3  the pan before the pouch: it goes on the Needs list; no task opens
//   4  the walk to the village (no mist on the walking screen since 23 November; about 16 squares across on an iPad); inside, Elder Rivet's story, then the finished example (the old pump)
//   5  a machine: nothing typed, a number too big, tests, "handed back", notes written only when the child taps
//   6  a wrong plate: it is shown wrong by a test, and the right rule is never said
//   7  closing the page in the middle of a machine and opening it again: the same machine, the same notes
//   8  the right plate; all four plates; the pouch; the Rule Stone
//   9  real pips: a wrong guess (the machine does not run and does not say the answer), a run that cannot work (pips handed back), the right way
//  10  the pan: the wrong number of pips, a fresh pouch from the elder, then exactly right: the bridge comes down
//  11  over the bridge: the guard, the lookout, and no way further
//  11b what the child did changes the place: the pip store fills, the Rule Stone glows, a Mender hears the Rillfolk sing again
//  12  the small quests and the secrets: Pim's spinner; the coin, the keeper's clue, the shard, the elder's story. No secret gives help with a rule.
//  12b a nudge comes only when asked, gives no number, and is written in the report
//  11c THE REACH: the guard opens the reed gate; the harbour; the keeper's story; the rules and the baker's example; three towns and their order tags;
//      the fleet: more rafts than there are, a wrong line (one red lamp, nothing sails), closing and opening mid-plan, the right plan; the Rule Stone, the card,
//      the raft and the ship's Navigation at Level 2; people say new things
//  12c THE WELL (a mini quest of five steps over two regions): the winch, the net mender (how deep, how many bundles), the reed cutter, the rope,
//      the Makers' box with its lid example, wrong wheels shown wrong, the right wheels: an epic card
//  1b  TYPING: the small keys on the desk and a real keyboard; push, take, dig, dance, help, hint, and a word the game does not know
//  +   a loose cog may roll out on any walk; the test catches it. Music is off at first, plays when switched on, stops when switched off.
//  13  a second child crosses by the old stones only: a splash gives a new pattern; five right stones get across
//  14  closing in the middle of the stones and opening again
//  15  the big map, the Needs list, the ship panel, the report, "Go back to my ship"
// On all three screens (1180 x 745, 820 x 1180, 390 x 760): nothing scrolls, nothing spills, every button of every task is on the screen,
// the reading card is in the middle of the screen, high up, the picture has at least 45% of the screen. The page asks the network for nothing but the game's two fonts.
//
// Run:  node checks/bigworld_play_test.js [--shots folder] [--only phone]     (--only plays the screens whose name holds that word)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const FILE = process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html');
const URL = 'file://' + path.resolve(FILE);
const ONLY = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : '';      // --only phone : play one screen only
const SHOTS = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
const ruleOut = (rule, v, cap) => { const n = rule.n; cap = cap || 1e9; return rule.op === 'times' ? (v > 0 && v * n <= cap ? v * n : null) : rule.op === 'plus' ? (v + n <= cap ? v + n : null) : rule.op === 'minus' ? (v >= n ? v - n : null) : (v > 0 && v % n === 0 ? v / n : null); };
const SIGN = { times: '×', plus: '+', minus: '−', share: '÷' };

async function open(b, w, h, seed) { const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: SHOTS ? 2 : 1, hasTouch: true }), p = await ctx.newPage(); p.errs = []; p.reqs = [];
  p.on('pageerror', e => p.errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') p.errs.push(m.text()); }); p.on('request', r => p.reqs.push(r.url()));
  p.seedUrl = URL + '?seed=' + seed + '&fastread=1';      /* fastread: OK wakes at once, so this test does not wait 4 to 5 seconds on every card. checks/bigworld_reading_test.js checks the real wait. */ await p.goto(p.seedUrl); await p.waitForFunction(() => window.__bw && window.__bw.S()); return p; }
const st = p => p.evaluate(() => { const b = window.__bw, S = b.S(); return { S: JSON.parse(JSON.stringify(S)), x: Math.round(b.P.px), y: Math.round(b.P.py), reading: b.READ.q.length > 0, page: b.READ.q[b.READ.i] || '', pages: b.READ.q.length, task: b.task() ? JSON.parse(JSON.stringify(b.task())) : null, panel: b.panel(), big: b.big(), pic: b.pic() ? b.pic().title : '', idle: b.idle(), place: document.getElementById('place').textContent, desk: document.getElementById('desk').innerText, tasktext: document.getElementById('task').innerText }; });
const idle = p => p.waitForFunction(() => window.__bw.idle(), null, { timeout: 30000 });
const shot = async (p, name) => { if (SHOTS) { await p.waitForTimeout(120); await p.screenshot({ path: path.join(SHOTS, name + '.png') }); } };
// read every page of a reading card, the way a child does: OK, OK, OK. Returns the pages.
async function readAll(p, max) { const got = []; for (let i = 0; i < (max || 30); i++) { const s = await st(p); if (!s.reading) break; got.push(s.page); await p.click('#readok'); await p.waitForTimeout(40); } return got; }
// tap a square of the map, if it is on the screen; otherwise tap toward it
async function tapSquare(p, x, y) { const g = await p.evaluate(() => { const c = document.getElementById('cv').getBoundingClientRect(); return { c: { l: c.left, t: c.top, w: c.width, h: c.height } }; });
  const cam = await p.evaluate(() => window.__bw.cam());
  const px = (x + .5 - cam.ox) * cam.ts, py = (y + .5 - cam.oy) * cam.ts; let cx = Math.max(6, Math.min(g.c.w - 6, px)), cy = Math.max(52, Math.min(g.c.h - 6, py));
  /* to walk, a child taps the ground: a tap that would land on a thing on the way (it would use it) moves one square toward the middle, up to three times */
  for (let k = 0; k < 3; k++) { const a = Math.floor(cam.ox + cx / cam.ts), b0 = Math.floor(cam.oy + cy / cam.ts); if (a === x && b0 === y) break;
    const busy = await p.evaluate(([a, b]) => !!SOLID[key(a, b)] || (!!GATEOF[key(a, b)] && !gateOpen(GATEOF[key(a, b)])) || MAP[b][a] === 'H' || (Math.abs(a - 13) <= 1 && b === 83), [a, b0]); if (!busy) break;
    cx += Math.sign(g.c.w / 2 - cx) * cam.ts; cy = Math.max(52, cy + Math.sign(g.c.h / 2 - cy) * cam.ts); }
  await p.mouse.click(g.c.l + cx, g.c.t + cy); return px >= 0 && py >= 0 && px <= g.c.w && py <= g.c.h; }
async function walkTo(p, x, y) { for (let i = 0; i < 70; i++) { let s = await st(p); if (s.S.at === 'map' && !s.reading && !s.task && s.x === x && s.y === y) return true;
    if (s.task && s.task.kind === 'cog') { for (let k = 0; k < 3; k++) { const q = (await st(p)).task; if (!q || q.kind !== 'cog') break; const c = q.qs[q.i], plus = c.b[1] - c.a[1] === c.b[0] - c.a[0], ans = plus ? c.x + (c.a[1] - c.a[0]) : c.x * (c.a[1] / c.a[0]); await pad(p, ans); await press(p, 'ok'); } const got = await readAll(p); if (/Cog Catcher/.test(got.join(' '))) p.cogs = (p.cogs || 0) + 1; continue; }      // a loose cog: three quick rules
    if (s.reading || s.task || s.panel || s.S.at !== 'map') {      // a tap on the way opened something: read it, leave it, step aside with the "go" words, and go on
      if (s.reading) await readAll(p); s = await st(p); if (s.task) await p.click('#task [data-b="leave"]').catch(() => {}); if (s.panel) await p.click('#task [data-b="close"]').catch(() => {}); s = await st(p); if (s.S.at !== 'map') { await p.click('#words [data-thing="door"]'); await idle(p); }
      s = await st(p); const dir = Math.abs(x - s.x) > Math.abs(y - s.y) ? (x > s.x ? 'east' : 'west') : (y > s.y ? 'south' : 'north'); await p.click('#words [data-verb="go"]'); await p.click(`#words [data-dir="${dir}"]`).catch(() => {}); await idle(p); continue; }
    await tapSquare(p, x, y); await p.waitForTimeout(60); await idle(p); } const s = await st(p); return s.x === x && s.y === y; }
// tap a thing word on the desk. If the thing is not close yet, walk beside it first (tapping the map).
async function word(p, thing, verb) { if (verb) await p.click(`#words [data-verb="${verb}"]`); try { await p.click(`#words [data-thing="${thing}"]`, { timeout: 4000 }); } catch (e) { const s = await st(p); throw new Error(`the word for "${thing}" is not on the desk. The cadet is at ${s.x},${s.y} in ${s.place}; reading: ${s.reading}; task: ${s.task && s.task.kind}; picture: ${s.pic}; desk: ${s.desk.replace(/\n/g, ' / ')}`); } await p.waitForTimeout(40); await idle(p); await p.waitForTimeout(40); }
async function goNear(p, id) { const t = await p.evaluate(id => { const t = window.__bw.things[id]; return { x: t.x, y: t.y, sx: t.stand[0], sy: t.stand[1] }; }, id); const okk = await walkTo(p, t.sx, t.sy); say(okk, `could not walk to ${id}`); return okk; }
// walk beside a thing by tapping the map, then tap its word. (A tap on the way may land on the thing itself: then it is already in use.)
async function useThing(p, id, verb) { await goNear(p, id); await word(p, id, verb); }
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
  if (L.read) say(L.read[0] >= -1 && L.read[2] <= L.iw + 1 && L.read[1] >= 0 && L.read[3] <= L.ih + 1 && Math.abs((L.read[0] + L.read[2]) / 2 - L.iw / 2) <= 3 && L.read[1] <= L.ih * .3, `${where}: the reading card is not in the middle of the screen, high up (it is at ${L.read.slice(0, 4).map(Math.round).join(', ')})`);      /* [Marc, 24 November] */
  for (const b of L.btns) say(b.r[5] >= 34, `${where}: the button "${b.t}" is only ${Math.round(b.r[5])}px tall`); }

(async () => {
  const b = await chromium.launch(); let played = 0;
  for (const [w, h, name, seed] of [[1180, 745, 'iPad sideways', 7], [820, 1180, 'iPad upright', 23], [390, 760, 'phone', 41]].filter(q => q[2].toLowerCase().indexOf(ONLY.toLowerCase()) >= 0)) { played++;
    console.log(`--- ${name} (${w} x ${h}), child ${seed}`);
    const p = await open(b, w, h, seed);
    const tag = SHOTS ? `${w}x${h}_` : '';
    let s = await st(p); const NUM = await p.evaluate(() => window.__bw.NUM());
    say((await p.evaluate(() => window.__bw.check())).length === 0, `${name}: the world check finds faults: ${await p.evaluate(() => window.__bw.check().join(' | '))}`);

    // 1. the story first
    say(s.reading && s.pages === 6, `${name}: the story at the start has ${s.pages} pages, not 6`); await layout(p, `${name}, the first page`); await shot(p, tag + '01_story');
    const intro = await readAll(p); say(intro.length === 6 && /broken/.test(intro[0]) && /S\.S\. Infinity/.test(intro[2]) && /mission/i.test(intro[4]), `${name}: the story pages are not as written`); say(!intro.some(t => /\d\s*[×+−÷]\s*\d/.test(t)), `${name}: there is a sum in the story`);
    s = await st(p); say(!s.reading && s.x === 13 && s.y === 82 && s.place === 'Mender Meadow', `${name}: after the story the cadet is not at the ship in the Mender Meadow`); await layout(p, `${name}, the map`); await shot(p, tag + '02_map');

    // 1b. TYPING. The small keys on the desk, then "Do it". Then a real keyboard. Words the game knows, and one it does not.
    say(await p.evaluate(() => MUS.on === false && MUS.count === 0), `${name}: music is on, or has played, before anyone tapped Music`);
    await p.click('#cmd'); await p.waitForTimeout(80); say(await p.evaluate(() => !document.getElementById('kb').hidden), `${name}: the small keys did not open`); await layout(p, `${name}, the small keys`);
    for (const ch of 'look sign') await p.click(ch === ' ' ? '#kb [data-k="space"]' : `#kb [data-k="${ch}"]`); await shot(p, tag + '02b_typing'); await p.click('#go'); await p.waitForTimeout(60); await idle(p); await p.waitForTimeout(60); let tp = await readAll(p); say(/MENDER VILLAGE/.test(tp.join(' ')), `${name}: typing "look sign" on the small keys did not read the sign: ${tp.join(' / ')}`);
    const type = async t => { await p.click('#cmd'); await p.keyboard.type(t); await p.keyboard.press('Enter'); await p.waitForTimeout(60); await idle(p); await p.waitForTimeout(60); const pages = await readAll(p); return pages.join(' / ') || (await st(p)).desk.replace(/\n/g, ' / '); };
    tp = await type('push the sign'); say(/wobbles/.test(tp), `${name}: "push the sign" gave: ${tp}`);
    tp = await type('take sign'); say(/stuck fast/.test(tp), `${name}: "take sign" gave: ${tp}`);
    tp = await type('look'); say(/You are in (the )?Mender Meadow/.test(tp) && /You can walk/.test(tp), `${name}: "look" alone gave: ${tp}`);
    tp = await type('dig'); say(/soil|roots|path|worm/i.test(tp), `${name}: "dig" gave: ${tp}`);
    tp = await type('dance'); say(/dance/.test(tp), `${name}: "dance" gave: ${tp}`);
    tp = await type('xyzzy'); say(/You see no/.test(tp), `${name}: a word the game does not know gave: ${tp}`);
    tp = await type('help'); say(/doing word/.test(tp), `${name}: "help" gave: ${tp}`);
    tp = await type('hint'); say(/village/.test(tp), `${name}: "hint" before the elder should point to the village: ${tp}`);
    // 2. a machine before the elder
    await useThing(p, 'm_pond'); s = await st(p); say(s.reading && !s.task, `${name}: a machine opened before the elder was met`); let pg = await readAll(p); say(pg.some(t => /Elder Rivet first/.test(t)), `${name}: the machine did not send the cadet to the elder`);
    // 3. the pan before the pouch
    await useThing(p, 'pan'); s = await st(p); say(s.reading && !s.task && s.pic === 'The bridge over the Rill', `${name}: the pan should show itself and wait`); await shot(p, tag + '03_pan_first'); pg = await readAll(p); s = await st(p); say(pg.some(t => t.indexOf(String(NUM.target)) >= 0) && s.S.needs.some(n => n.id === 'pan'), `${name}: the pan did not say its number or go on the Needs list`); say(!s.task && s.S.pouch === null, `${name}: the pan opened a task without a pouch`);

    // 4. the village and the elder
    await useThing(p, 'village'); s = await st(p); say(s.S.at === 'village' && s.place === 'Mender Village', `${name}: the village did not open`); await readAll(p); await p.waitForTimeout(500); await shot(p, tag + '04_village'); await layout(p, `${name}, the village`);
    await word(p, 'rstone'); pg = await readAll(p); say(pg.some(t => /dark/.test(t)), `${name}: the Rule Stone should be dark`);
    await word(p, 'elder'); s = await st(p); say(s.reading, `${name}: the elder says nothing`); pg = await readAll(p, 6); say(pg.length === 6 && /plate/.test(pg[4]), `${name}: the elder's story is not 6 pages ending in the job`);
    s = await st(p); say(s.reading && s.pic === 'The painted board', `${name}: the finished example does not follow the elder's story`); await p.click('#readok'); await p.click('#readok'); await p.click('#readok'); await shot(p, tag + '05_example_pump'); await layout(p, `${name}, the finished example`); pg = await readAll(p);
    s = await st(p); say(s.S.flags.metElder && s.S.bag.indexOf('notebook') >= 0 && s.S.needs.some(n => n.id === 'plates'), `${name}: after the elder there is no notebook or no need`);
    say(NUM.rule.times.n !== 4 && NUM.rule.plus.n !== 6, `${name}: the example's rules are this child's rules`);
    await word(p, 'door'); s = await st(p); say(s.S.at === 'map', `${name}: could not leave the village`);

    // 5. a machine: tests
    const sites = ['pond', 'wall', 'hill', 'orchard'], first = sites.find(x => NUM.at[x].op === 'times') , rule = NUM.at[first];
    await useThing(p, 'm_' + first); pg = await readAll(p); say(pg.length >= 3 && /burnt/.test(pg.join(' ')), `${name}: a machine's first look`); s = await st(p); say(s.task && s.task.kind === 'machine' && s.task.phase === 'test', `${name}: the machine did not open for tests`);
    say(s.tasktext.indexOf(SIGN[rule.op] + ' ' + rule.n) < 0, `${name}: the desk shows the rule before it is found`); await layout(p, `${name}, a machine`); await shot(p, tag + '06_machine_start');
    await press(p, 'pull'); s = await st(p); say(/1 to 20/.test(s.task.msg), `${name}: pulling with no number should ask for one`);
    let msg = await testStones(p, 25); say(/1 to 20/.test(msg), `${name}: 25 test pebbles should be refused`);
    msg = await testStones(p, 3); say(msg === `3 went in. ${ruleOut(rule, 3)} came out.`, `${name}: 3 test pebbles gave "${msg}"`); await shot(p, tag + '07_machine_tested'); await layout(p, `${name}, a machine after a test`);
    await press(p, 'nudge'); s = await st(p); say(s.reading && !/\d\s*[×÷]\s*\d/.test(s.page) && s.page.indexOf(SIGN[rule.op] + ' ' + rule.n) < 0, `${name}: the nudge is missing or says too much: ${s.page}`); await layout(p, `${name}, a nudge`); await readAll(p); s = await st(p); say(s.S.nudges && s.S.nudges.rule === 1 && s.S.log.some(l => /nudge/.test(l.what)) && s.task && s.task.kind === 'machine', `${name}: the nudge is not counted in the report`);
    s = await st(p); say(!(s.S.notes[first] || []).length, `${name}: the game wrote in the notebook by itself`); await press(p, 'write'); s = await st(p); say((s.S.notes[first] || []).length === 1 && s.S.notes[first][0][0] === 3, `${name}: "Write it in my notes" did not write`);
    const shareSite = sites.find(x => NUM.at[x].op === 'share');
    // 6. a wrong plate: add, with the number that fits the one test
    const wrong = { op: 'plus', n: ruleOut(rule, 3) - 3 }; pg = await plate(p, wrong); await shot(p, tag + '08_plate_wrong'); say(pg.length === 3 && /Not the rule yet/.test(pg[2]) && /fell off: not the rule/.test((await st(p)).task.msg), `${name}: a wrong plate was not shown wrong: ${pg.join(' / ')}`); say(!pg.join(' ').includes(SIGN[rule.op] + ' ' + rule.n), `${name}: the right rule was said after a wrong plate`);
    { const m = /drops in (\d+) test pebbles\. Your plate says (\d+) will come out\. Out come (\d+)/.exec(pg[1] || ''); say(m && +m[2] === ruleOut(wrong, +m[1]) && +m[3] === ruleOut(rule, +m[1]) && m[2] !== m[3], `${name}: the test that shows the plate wrong is not right: ${pg[1]}`); }
    s = await st(p); say(s.task.phase === 'test' && !s.S.mach[first].ok && s.S.mach[first].tries === 1, `${name}: after a wrong plate the machine should be back at tests`);
    { const md = await p.evaluate(() => window.__bw.MA.done), m = /(\d+) in, (\d+) out/.exec(s.task.msg || ''); say(md && m && md.n === +m[1] && md.out === +m[2], `${name}: after a wrong plate the machine's drums do not show the test the words speak of (${JSON.stringify(md)} against "${s.task.msg}")`); }
    // 7. close the page in the middle, and open it again
    await p.goto(p.seedUrl); await p.waitForFunction(() => window.__bw && window.__bw.S());  s = await st(p); say(s.task && s.task.kind === 'machine' && s.task.site === first && (s.S.notes[first] || []).length === 1 && !s.reading, `${name}: after closing and opening, the machine and the notes are not back`); say(s.S.seed === seed, `${name}: the child's numbers changed after opening again`);
    // 8. the right plate
    msg = await testStones(p, 4); pg = await plate(p, rule); say(pg.length >= 4 && /true/.test(pg[2]), `${name}: the right plate was not accepted: ${pg.join(' / ')}`); s = await st(p); say(s.S.mach[first].ok && s.S.cards.length === 0, `${name}: the plate is not marked true`); await shot(p, tag + '09_plate_right');
    say(/1 of 4/.test(s.S.needs.find(n => n.id === 'plates').text), `${name}: the Needs list does not count the plate`); await press(p, 'leave');
    // the pouch
    await useThing(p, 'village'); await readAll(p); await word(p, 'elder'); pg = await readAll(p); s = await st(p); say(s.S.pouch === NUM.start && pg.some(t => t.indexOf(String(NUM.target)) >= 0), `${name}: the elder did not give the pouch and the pan's number`);
    await word(p, 'kid'); pg = await readAll(p); s = await st(p); say(s.S.needs.some(n => n.id === 'spinner'), `${name}: Pim did not ask for the spinner`); await word(p, 'door');
    // the other three plates. A machine that hands test pebbles back says so.
    for (const site of sites.filter(x => x !== first)) { const r = NUM.at[site]; await useThing(p, 'm_' + site); await readAll(p); msg = await testStones(p, 1); const o1 = ruleOut(r, 1); say(o1 === null ? /hands (it|them) back/.test(msg) : msg === `1 went in. ${o1} came out.`, `${name}: ${site}: 1 test stone gave "${msg}"`); if (site === shareSite) await shot(p, tag + '10_handed_back'); msg = await testStones(p, 12); await press(p, 'write'); pg = await plate(p, r); say(/true/.test(pg.join(' ')), `${name}: ${site}: the right plate was refused`); await press(p, 'leave'); }
    s = await st(p); say(sites.every(x => s.S.mach[x].ok), `${name}: not all four plates are true`);
    // 12 (part). the half plate names the share machine; the spinner; the coin
    await useThing(p, 'rubble'); pg = await readAll(p); s = await st(p); say(s.S.bag.indexOf('shard') >= 0 && !/[×÷+−]/.test(pg.join(' ')), `${name}: the rubble should give a shard, and no help with a rule`);
    await useThing(p, 'spin'); await readAll(p); s = await st(p); say(s.S.bag.indexOf('spinner') >= 0, `${name}: the spinner was not picked up`);
    await useThing(p, 'keeper'); await readAll(p); await word(p, 'keeper'); await readAll(p); s = await st(p); say(s.S.needs.some(n => n.id === 'coin'), `${name}: the keeper did not speak of the coin`);
    await useThing(p, 'log'); await readAll(p); await useThing(p, 'keeper'); pg = await readAll(p); s = await st(p); say(/rubble by the old wall/.test(pg.join(' ')) && s.S.cards.some(c => c.job === 'coin') && !/more than|less than/.test(pg.join(' ')), `${name}: the keeper should give a clue to the rubble, and no fact about a machine: ${pg.join(' / ')}`);
    // 9. real pips
    const way = NUM.ways[0], siteOf = op => sites.find(x => NUM.at[x].op === op);
    // 10 (part). the pan with the wrong number of pips
    await useThing(p, 'pan'); pg = await readAll(p); say(pg.length === 4 && /order/i.test(pg[3]), `${name}: the carving (the second finished example) did not show before the pan`); s = await st(p); say(s.task && s.task.kind === 'pan', `${name}: the pan task did not open`); await shot(p, tag + '11_pan'); await layout(p, `${name}, the pan`);
    await press(p, 'pour'); s = await st(p); say(/springs back/.test(s.task.msg) && !s.S.gates.bridge && s.S.pouch === NUM.start, `${name}: the pan took the wrong number of pips`); await press(p, 'leave');
    // a wrong guess: the machine does not run, and does not tell
    let pouch = NUM.start; await useThing(p, 'm_' + siteOf(way[0])); s = await st(p); say(s.task.phase === 'real' && !/Test pebbles/.test(s.tasktext), `${name}: a true machine with a pouch should ask for real pips, with no test tray`); say((await p.evaluate(() => window.__bw.MA.done)) === null, `${name}: a machine opened for real pips still shows an old test on its drums`); const out0 = ruleOut(NUM.rule[way[0]], pouch, 100);
    say(s.tasktext.indexOf(' ' + out0 + ' ') < 0 || out0 === NUM.target || out0 === pouch, `${name}: the desk shows what will come out`); await layout(p, `${name}, real pips`); await shot(p, tag + '12_real_pips');
    await press(p, 'pour'); s = await st(p); say(/First say/.test(s.task.msg), `${name}: pouring with no guess`);
    await pad(p, out0 + 1); await press(p, 'pour'); await p.waitForTimeout(100); s = await st(p); say(s.S.pouch === pouch && s.S.runs === 0 && /not what the plate says/.test(s.task.msg) && s.task.msg.indexOf(String(out0)) < 0, `${name}: a wrong guess ran the machine, or gave the answer away`);
    // a run that cannot work: find a machine that cannot take this pouch, if there is one
    { const stuck = ['times', 'plus', 'minus', 'share'].find(o => ruleOut(NUM.rule[o], pouch, 100) === null); if (stuck) { await press(p, 'leave'); await useThing(p, 'm_' + siteOf(stuck)); await pad(p, 1); await press(p, 'pour'); await idle(p); await p.waitForTimeout(80); s = await st(p); say(s.S.pouch === pouch && /hands them back/.test(s.task.msg), `${name}: a run that cannot work changed the pouch: ${s.task.msg}`); await shot(p, tag + '13_cannot_run'); await press(p, 'leave'); await useThing(p, 'm_' + siteOf(way[0])); } }
    // spoil the pouch on purpose, then ask the elder for a fresh one
    await pad(p, out0); await press(p, 'pour'); await idle(p); await p.waitForTimeout(80); s = await st(p); say(s.S.pouch === out0 && s.S.runs === 1, `${name}: the right guess did not run the machine`); await shot(p, tag + '14_real_ran'); await press(p, 'leave');
    await useThing(p, 'village'); let told = []; for (let k = 0; k < 4; k++) { await word(p, 'elder'); s = await st(p); if (s.task && s.task.kind === 'fresh') break; told = told.concat(await readAll(p)); }      // the elder first says what is new (the Rule Stone, the shard), then offers the pouch
    s = await st(p); say(s.task && s.task.kind === 'fresh', `${name}: the elder did not offer a fresh pouch`); await layout(p, `${name}, a fresh pouch`); await press(p, 'yes'); s = await st(p); say(s.S.pouch === NUM.start && s.S.runs === 0, `${name}: the fresh pouch is not ${NUM.start}`);
    // the Rule Stone, and the shard
    say(s.S.flags.stoneLit && s.S.lit === 1 && s.S.cards.some(c => c.job === 'plates'), `${name}: four true plates did not light the Rule Stone`); say(/Gate's own plate/.test(told.join(' ')) && s.S.flags.shardSeen && s.S.cards.some(c => c.job === 'shard'), `${name}: the elder does not know the shard: ${told.join(' / ')}`);
    await p.waitForTimeout(300); await shot(p, tag + '15_stone_lit'); await word(p, 'store'); pg = await readAll(p); say(/piling up/.test(pg.join(' ')), `${name}: the pip store does not fill after the Rule Stone is lit`); await word(p, 'rstone'); pg = await readAll(p); say(/glows gold/.test(pg.join(' ')), `${name}: the Rule Stone does not glow`); await word(p, 'door');
    // the right way, three runs, each said first
    for (const op of way) { await useThing(p, 'm_' + siteOf(op)); const o = ruleOut(NUM.rule[op], pouch, 100); await pad(p, o); await press(p, 'pour'); await idle(p); await p.waitForTimeout(80); s = await st(p); say(s.S.pouch === o, `${name}: ${pouch} ${op} should give ${o}, the pouch holds ${s.S.pouch}`); pouch = o; await press(p, 'leave'); }
    say(pouch === NUM.target, `${name}: the way in the page's own list does not reach the pan's number`);
    // 10. the bridge
    await useThing(p, 'pan'); await press(p, 'pour'); s = await st(p); say(s.reading && s.S.gates.bridge === 1, `${name}: the right pips did not bring the bridge down`); await p.waitForTimeout(1300); await shot(p, tag + '16_bridge_down'); pg = await readAll(p); say(pg.some(t => /Three machine runs/.test(t)), `${name}: three runs were not noticed: ${pg.join(' / ')}`); s = await st(p); say(s.S.cards.some(c => c.job === 'bridge') && s.S.pouch === null && !s.task, `${name}: after the bridge: card, pouch, task`);
    await useThing(p, 'listener'); pg = await readAll(p); say(/singing again/.test(pg.join(' ')), `${name}: the Mender with big ears does not hear the Rillfolk after the bridge is down: ${pg.join(' / ')}`);
    // 11. over the bridge
    say(await walkTo(p, 52, 74), `${name}: could not walk over the bridge`); await shot(p, tag + '17_far_bank'); await useThing(p, 'guard'); pg = await readAll(p); say(/bridge down/.test(pg.join(' ')), `${name}: the guard does not know about the bridge`); await word(p, 'guard'); await readAll(p);
    await useThing(p, 'lookout'); s = await st(p); say(s.pic === 'The lookout hill', `${name}: the lookout shows no picture`); await p.click('#readok'); await p.click('#readok'); await shot(p, tag + '18_lookout'); await layout(p, `${name}, the lookout`); await readAll(p);
    // 11c. THE REACH. The guard opened the reed gate. The harbour, the keeper's story, the rules and the baker's example, three towns, the fleet.
    s = await st(p); say(s.S.gates.reeds === 1, `${name}: the guard did not open the reed gate`);
    const FL = await p.evaluate(() => FLEET), WL = await p.evaluate(() => WELL), TW = ['stilt', 'reed', 'mud'];
    await useThing(p, 'harbour'); s = await st(p); say(s.S.at === 'harbour' && s.place === 'The harbour', `${name}: the harbour did not open`); await readAll(p); await p.waitForTimeout(500); await shot(p, tag + '26_harbour'); await layout(p, `${name}, the harbour`);
    await word(p, 'board'); pg = await readAll(p); say(/talk to her first/.test(pg.join(' ')) && !(await st(p)).task, `${name}: the loading board opened before the keeper told the story`);
    await word(p, 'keeper2'); pg = await readAll(p); s = await st(p); say(pg.length === 5 && s.S.flags.metKeeper && s.S.needs.some(n => n.id === 'fleet') && s.S.needs.some(n => n.id === 'tags'), `${name}: the harbour keeper's story, or its lines on the Needs list`); say(!pg.some(t => /\d\s*[×+−÷]\s*\d/.test(t)), `${name}: there is a sum in the keeper's story`);
    await word(p, 'board'); pg = await readAll(p); say(pg.length === 10 && /Rule one/.test(pg[1]) && /24 loaves/.test(pg[5]), `${name}: the rules and then the baker's example should come before the fleet (${pg.length} pages)`); s = await st(p); say(s.task && s.task.kind === 'fleet' && /No order tag/.test(s.tasktext), `${name}: the board should say no tag hangs yet`); await layout(p, `${name}, the fleet with no tags`);
    await press(p, 'send'); s = await st(p); say(/no order from/.test(s.task.msg), `${name}: sending with no tags`); await press(p, 'leave'); await word(p, 'door');
    for (const tw of TW) { await useThing(p, 'sp_' + tw); pg = await readAll(p); say(pg.some(t => t.indexOf(String(FL.order[tw])) >= 0), `${name}: the speaker of ${tw} did not say the order`); if (tw === 'stilt') await shot(p, tag + '27_town'); }
    s = await st(p); say(TW.every(tw => s.S.bag.indexOf('tag_' + tw) >= 0), `${name}: the three order tags are not carried`);
    await useThing(p, 'bottle'); await readAll(p); s = await st(p); say(s.S.bag.indexOf('bottle') >= 0 && s.S.needs.some(n => n.id === 'letter'), `${name}: the bottle in the reeds`);
    await useThing(p, 'harbour'); await word(p, 'board'); s = await st(p); say(s.task && s.task.kind === 'fleet' && TW.every(tw => s.S.tags[tw] === 'hung') && !s.S.bag.some(i => /^tag_/.test(i)), `${name}: the tags were not hung on the board`); await layout(p, `${name}, the fleet`);
    // this test's own search for a plan that serves all three towns
    const fits = tw => FL.kinds.filter(k => FL.order[tw] % k === 0).map(k => ({ k, n: FL.order[tw] / k })); let full = null; for (const a of fits('stilt')) for (const b2 of fits('reed')) for (const c of fits('mud')) { const used = {}; for (const q of [a, b2, c]) used[q.k] = (used[q.k] || 0) + q.n; if (!full && FL.kinds.every(k => (used[k] || 0) <= FL.count[k])) full = [a, b2, c]; }
    say(!!full, `${name}: this test finds no plan for the fleet`);
    const line = async (tw, k, n) => { await p.click(`#task [data-tab="${tw}"]`); await p.click(`#task [data-b="k${k}"]`); await pad(p, n); await p.waitForTimeout(60); };
    await line('stilt', FL.kinds[0], 10); s = await st(p); say(/left in the harbour/.test(s.task.msg) && s.S.fleet.plan.stilt.n === 0, `${name}: more rafts than the harbour has were accepted`);
    await line('stilt', full[0].k, full[0].n); await line('reed', full[1].k, full[1].n - 1); await line('mud', full[2].k, full[2].n); await shot(p, tag + '28_fleet'); await layout(p, `${name}, the fleet with a plan`);
    s = await st(p); say(s.tasktext.indexOf('●') < 0, `${name}: lamps show before the fleet is sent`);
    await p.goto(p.seedUrl); await p.waitForFunction(() => window.__bw && window.__bw.S()); s = await st(p); say(s.task && s.task.kind === 'fleet' && s.S.fleet.plan.mud.n === full[2].n && s.S.fleet.plan.stilt.k === full[0].k, `${name}: after closing and opening, the fleet's plan is not back`);
    await press(p, 'send'); s = await st(p); say(/Reed Town.s lamp is red/.test(s.task.msg) && !s.S.flags.fleetDone && s.S.fleet.lamps.reed === false && s.S.fleet.lamps.stilt === true, `${name}: a wrong line should leave the gate shut with one red lamp: ${s.task.msg}`); say(s.task.msg.indexOf(String(full[1].n)) < 0 || full[1].n === 1, `${name}: the red lamp's words give the answer`); await shot(p, tag + '29_fleet_red');
    await line('reed', full[1].k, full[1].n); s = await st(p); say(s.S.fleet.lamps === null, `${name}: the lamps should go dark when the plan changes`); await press(p, 'send'); s = await st(p); say(s.reading && s.S.flags.fleetDone, `${name}: the right plan did not open the water gate`); await p.waitForTimeout(1300); await shot(p, tag + '30_fleet_sails'); pg = await readAll(p);
    s = await st(p); say(/Navigation: Level 2/.test(pg.join(' ')) && s.S.parts.nav === 2 && s.S.parts.engine === 2 && s.S.lit === 2 && s.S.cards.some(c => c.job === 'fleet') && s.S.bag.indexOf('raft') >= 0 && !s.task, `${name}: after the fleet: the stone, the card, the raft, the ship's Navigation`);
    await word(p, 'singer'); pg = await readAll(p); say(/La, la/.test(pg.join(' ')), `${name}: the old singer does not sing after the fleet has sailed`); await word(p, 'door');
    await useThing(p, 'sp_mud'); pg = await readAll(p); say(/rice came/.test(pg.join(' ')), `${name}: Mud Town does not say the rice came`);
    // Pim's spinner
    await useThing(p, 'village'); await word(p, 'kid'); pg = await readAll(p); s = await st(p); say(s.S.flags.spinGiven && s.S.cards.some(c => c.job === 'spinner') && /old stones/.test(pg.join(' ')), `${name}: Pim did not take the spinner and give the clue`);
    await word(p, 'kid'); pg = await readAll(p); s = await st(p); say(s.S.flags.bottleGiven && s.S.cards.some(c => c.job === 'letter') && /Wim/.test(pg.join(' ')), `${name}: Pim did not take the bottle from over the river`); await word(p, 'door');
    // 12c. THE WELL: a mini quest of the lantern shape. A place closed for a reason you can see; a thing that must be made; a material from elsewhere; the makers' maths; back; one real problem inside; an epic card.
    const w0 = (await st(p)).S.well.step;      /* a tap on the walk may already have begun it: that is allowed */ if (w0 >= 1) console.log(`  (${name}: the well's quest had begun before the test reached it)`); await useThing(p, 'well'); pg = await readAll(p); s = await st(p); say(s.S.well.step >= 1 && s.S.needs.some(n => n.id === 'well') && s.S.log.some(l => /glint/.test(l.what)), `${name}: the well does not start its quest`);      /* the pages may have been read on the walk (a tap beside the well lands on it), so the mission report is the proof */
    if (!(s.task && s.task.kind === 'well')) await word(p, 'well'); s = await st(p); say(s.task && s.task.kind === 'well', `${name}: the winch did not open`); await layout(p, `${name}, the well`); for (let i = 0; i < WL.turns; i++) await press(p, 'turn'); s = await st(p); say(/Clunk/.test(s.task.msg) && s.S.well.hit && s.S.well.turns === WL.turns, `${name}: the bucket did not land after ${WL.turns} turns`); say(!new RegExp('\\b' + WL.depth + '\\b').test(s.tasktext) || WL.depth === WL.per, `${name}: the well says how deep it is`); await shot(p, tag + '31_well'); await press(p, 'turn'); s = await st(p); say(/slack/.test(s.task.msg), `${name}: one turn too many`); await press(p, 'leave');
    s = await st(p); say(/net weaver/.test(s.S.needs.find(n => n.id === 'well').text), `${name}: the Needs list does not send the child to the net mender`);
    await useThing(p, 'harbour'); await word(p, 'netmender'); s = await st(p); say(s.task && s.task.kind === 'rope' && s.task.phase === 1, `${name}: the net mender did not ask how deep`); await layout(p, `${name}, the net mender`); await shot(p, tag + '32_rope');
    await pad(p, WL.depth + 1); await press(p, 'ok'); s = await st(p); say(/does not sound right/.test(s.task.msg) && s.task.phase === 1, `${name}: a wrong depth was taken`); await pad(p, WL.depth); await press(p, 'ok'); s = await st(p); say(s.task.phase === 2, `${name}: the right depth was refused`);
    await pad(p, WL.bundles + 1); await press(p, 'ok'); s = await st(p); say(/does not come to/.test(s.task.msg) && s.task.msg.indexOf(' ' + WL.bundles + ' ') < 0, `${name}: wrong bundles were taken, or the answer was told`); await pad(p, WL.bundles); await press(p, 'ok'); pg = await readAll(p); s = await st(p); say(/reed cutter/.test(pg.join(' ')) && s.S.well.step === 3, `${name}: the net mender did not send the child for reeds`); await word(p, 'door');
    await useThing(p, 'cutter'); s = await st(p); say(s.task && s.task.kind === 'reedcut', `${name}: the reed cutter did not ask`); await layout(p, `${name}, the reed cutter`); await shot(p, tag + '33_cutter'); await pad(p, WL.bundles * 10 + 10); await press(p, 'ok'); s = await st(p); say(/Ten reeds/.test(s.task.msg), `${name}: wrong reeds were taken`); await pad(p, WL.bundles * 10); await press(p, 'ok'); await readAll(p); s = await st(p); say(s.S.bag.indexOf('reeds') >= 0 && s.S.well.step === 4, `${name}: the reeds were not given`);
    await useThing(p, 'harbour'); await word(p, 'netmender'); pg = await readAll(p); s = await st(p); say(s.S.bag.indexOf('rope') >= 0 && s.S.bag.indexOf('reeds') < 0 && s.S.well.step === 5, `${name}: the rope was not made`); await word(p, 'door');
    await useThing(p, 'well'); pg = await readAll(p); s = await st(p); say(s.task && s.task.kind === 'box' && /another box/.test(pg.join(' ')) && s.S.bag.indexOf('rope') < 0, `${name}: the rope did not bring up the box, or the lid's example did not come first`); await layout(p, `${name}, the Makers' box`);
    await pad(p, 1); await press(p, 'drop'); s = await st(p); say(s.task.msg === `1 went in. The box shows ${WL.a + WL.b}.`, `${name}: the box's test: ${s.task.msg}`); await press(p, 'write'); await pad(p, 2); await press(p, 'drop'); await shot(p, tag + '34_box');
    const wheels = async (a, b2) => { await press(p, 'set'); await p.click('#task [data-box="a"]'); await pad(p, a); await p.click('#task [data-box="b"]'); await pad(p, b2); await press(p, 'fit'); return readAll(p); };
    pg = await wheels(WL.a, WL.b + 1); say(pg.length === 3 && /Not the rule yet/.test(pg[2]) && pg.join(' ').indexOf('+ ' + WL.b + '.') < 0, `${name}: wrong wheels were not shown wrong: ${pg.join(' / ')}`);
    pg = await wheels(WL.a, WL.b); s = await st(p); say(/EPIC/.test(pg.join(' ')) && s.S.cards.some(c => c.job === 'well' && c.epic) && s.S.well.step === 7 && s.S.needs.find(n => n.id === 'well').done && !s.task, `${name}: the box did not open with an epic card`);
    // 15. the big map, the Needs list, the ship
    await p.click('#b_map'); await p.waitForTimeout(200); s = await st(p); say(s.big, `${name}: the big map did not open`); await shot(p, tag + '19_big_map'); await layout(p, `${name}, the big map`); await p.click('#b_map');
    await p.click('#b_needs'); s = await st(p); say(s.panel === 'needs' && /What I still need/.test(s.tasktext) && /I carry/.test(s.tasktext) && /raft/.test(s.tasktext) && /The Makers. box/.test(s.tasktext) && /Rule Stones lit: 2 of 5/.test(s.tasktext), `${name}: the Needs list: ${s.tasktext.slice(0, 300)}`); await shot(p, tag + '20_needs'); await p.click('#b_needs');
    await p.click('#b_ship'); await layout(p, `${name}, the ship panel`); s = await st(p); say(/Engine Core Level 2/.test(s.tasktext) && /Navigation Level 2/.test(s.tasktext) && /Level 1: Shield/.test(s.tasktext) && /EPIC/.test(s.tasktext), `${name}: the ship panel does not show the two upgrades and the epic card`);
    await press(p, 'music'); await p.waitForTimeout(900); say(await p.evaluate(() => MUS.on && MUS.count > 0), `${name}: Music on plays nothing`); const tune = await p.evaluate(() => MUS.tune); await press(p, 'music'); await p.waitForTimeout(200); const cnt = await p.evaluate(() => MUS.count); await p.waitForTimeout(500); say(await p.evaluate(c => !MUS.on && MUS.count === c, cnt), `${name}: Music off still plays`); say(tune === 'meadow' || tune === 'reach' || tune === 'village', `${name}: the tune here is "${tune}"`);
    await press(p, 'report'); s = await st(p); say(/Mission report/.test(s.tasktext) && /Rule Stone/.test(s.tasktext) && s.S.log.length >= 12, `${name}: the mission report is thin (${s.S.log.length} lines)`); await shot(p, tag + '21_report'); await press(p, 'ship'); await press(p, 'home'); await p.waitForTimeout(600); s = await st(p); say(s.x === 13 && s.y === 82 && !s.panel, `${name}: "Go back to my ship" did not`);
    say((s.S.rattles || 0) + (s.S.miss || 0) >= 1 && s.S.log.some(l => /not right/.test(l.result)), `${name}: the report does not hold the wrong tries`);
    say(!p.errs.length, `${name}: errors: ${p.errs.join(' | ')}`); say(p.reqs.every(u => u.split('?')[0] === URL || /^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u)), `${name}: the page asked the network for something that is not the game's two fonts: ${p.reqs.filter(u => u.split('?')[0] !== URL && !/^https:\/\/fonts\./.test(u)).join(', ')}`);
    await p.context().close();
  }

  // 13, 14. a second child: the old stones only
  console.log('--- the old stones, iPad sideways and phone');
  for (const [w, h, name, seed] of [[1180, 745, 'stones, iPad sideways', 101], [390, 760, 'stones, phone', 202]].filter(q => q[2].toLowerCase().indexOf(ONLY.toLowerCase()) >= 0)) { played++; const p = await open(b, w, h, seed); const tag = SHOTS ? `${w}x${h}_` : '';
    await readAll(p); await useThing(p, 'cutter'); let pg0 = await readAll(p); say(/reeds/.test(pg0.join(' ')), `${name}: the reed cutter says nothing about reeds`); await useThing(p, 'post'); let s = await st(p); say(s.reading && s.pic === 'The old post', `${name}: the finished example (the old rope) did not come first`); await p.click('#readok'); await p.click('#readok'); await shot(p, tag + '22_stones_example'); let pg = await readAll(p); say(/go down/.test(pg.join(' ')), `${name}: the example does not say a pattern can go down`);
    s = await st(p); say(s.task && s.task.kind === 'stones', `${name}: the stones did not open`); await layout(p, name); await shot(p, tag + '23_stones');
    const rounds = await p.evaluate(seed => [0, 1, 2].map(r => window.__bw.stones(seed, r)), seed);
    say(s.tasktext.indexOf(rounds[0].shown.join(', ')) >= 0, `${name}: the post's numbers are not on the desk`);
    // one right step, then a wrong one: splash, and a new pattern
    await press(p, 's' + rounds[0].rows[0].right); s = await st(p); say(s.S.st.row === 1, `${name}: a right stone did not hold`);
    await press(p, 's' + ((rounds[0].rows[1].right + 1) % 3)); s = await st(p); say(s.reading && /Splash/.test(s.page) && s.S.st.row === 0 && s.S.st.round === 1, `${name}: a wrong stone did not splash and send the cadet back at once`); await shot(p, tag + '24_splash'); await readAll(p); s = await st(p); say(s.S.st.round === 1 && s.S.st.row === 0 && s.tasktext.indexOf(rounds[1].shown.join(', ')) >= 0 && rounds[1].shown.join() !== rounds[0].shown.join(), `${name}: after a splash the pattern is not new`);
    // tap the stones on the picture this time; close and open in the middle
    for (let i = 0; i < 2; i++) { const hit = await p.evaluate(() => { const c = document.getElementById('cv').getBoundingClientRect(); return window.__bw.pic().hit.map(q => [c.left + q[0], c.top + q[1], q[3]]); }); const k = rounds[1].rows[i].right, q = hit.find(x => x[2] === k); await p.mouse.click(q[0], q[1]); await p.waitForTimeout(60); }
    s = await st(p); say(s.S.st.row === 2, `${name}: tapping a stone on the picture did not step (${s.S.st.row})`);
    await p.goto(p.seedUrl); await p.waitForFunction(() => window.__bw && window.__bw.S());  s = await st(p); say(s.task && s.task.kind === 'stones' && s.S.st.row === 2 && s.S.st.round === 1, `${name}: after closing and opening, the cadet is not on the same stone`);
    for (let i = 2; i < 5; i++) await press(p, 's' + rounds[1].rows[i].right); s = await st(p); say(s.reading && s.S.gates.stones === 1, `${name}: five right stones did not get across`); await readAll(p); s = await st(p); say(s.x === 50 && s.y === 60 && !s.task && s.S.cards.some(c => c.job === 'stones') && !s.S.gates.bridge, `${name}: after the stones the cadet should stand on the far bank`);
    await useThing(p, 'guard'); pg = await readAll(p); say(/old stones/.test(pg.join(' ')), `${name}: the guard does not know about the stones`); say(await walkTo(p, 46, 60), `${name}: could not walk back over the stones`); await shot(p, tag + '25_back_over_stones');
    s = await st(p); say(s.S.lit === 0 && !s.S.flags.metElder, `${name}: crossing by the stones should not need the elder or light a stone`);
    say(!p.errs.length, `${name}: errors: ${p.errs.join(' | ')}`); await p.context().close(); }

  await b.close();
  if (!played) { console.log(`FAILED: --only "${ONLY}" matches no screen, so nothing was played. The screens are: iPad sideways, iPad upright, phone.`); process.exit(1); }
  console.log(bad.length ? `FAILED: ${bad.length} faults\n  ` + bad.join('\n  ') : `ok: the big world plays through ${ONLY ? 'on the screens named "' + ONLY + '"' : 'on three screens'}, by taps and typing: the story, the elder, four machines, the pouch and the pan, the bridge, the far bank, the small quests, the old stones, closing and opening again`);
  process.exit(bad.length ? 1 : 0);
})();
