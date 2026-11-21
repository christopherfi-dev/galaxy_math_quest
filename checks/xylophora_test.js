// Plays the whole of Planet Xylophora in prototypes/kis_station_sketch.html.   [Proposal]
//
// NUMBERS (once, on the iPad screen):
//   - the game's own numbers for seeds 1 to 2,000 give the same check number as checks/xylophora_quest_check.py
//   - for 3,000 seeds the skin on the map counts to exactly a x b + c x d squares, and lies inside its place
//   - every place a cadet must reach can be walked to; the building ground and the Sun Ledge are the sizes the game says
// PLAY (iPad sideways, iPad upright, a phone), each with a different cadet's numbers:
//   ARRIVING (iPad, with reading cards on): three screens the first time, each with a big picture and a short reading; Next sleeps a few seconds; never shown twice;
//   land from space; things are hidden until found; the skin: too small, too big, right;
//   the order board; floors: too small, too many panels, touching, more panels, a smaller store, then right ones;
//   the roof falls in; no leaves; find the Leafgrove; pick too many; pick; lay by tap and by word; lift a leaf;
//   a thin Home runs the grove dry; the Chief's words; lay the Home again; every roof whole;
//   more Homes: too many, too few, right; the map key: two the same refused; the epic card; the ending adds up;
//   the herder's field; the giant's hum; the leaf print; dead ends; the counts; the teacher's log; a reload; fly away; land again.
// Along the way it checks what Marc asked of every big quest:
//   - no wrong answer, and no hint, ever shows the right number
//   - the picture does not move or change size (iPad screens), and the page never scrolls
// Answers are worked out here from the cadet's numbers, by this file's own sums, not by asking the game for its answer.
//
// Run:  node checks/xylophora_test.js [folder for screenshots]
// Needs Node with Playwright and Chromium.
const { chromium } = require('playwright'); const path = require('path');
const CHECK = 2708402;      // the same number is in checks/xylophora_quest_check.py
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], notes = [];
  for (const [name, w, h, seed] of [['ipad', 1180, 745, 4242], ['ipad-tall', 820, 1100, 0], ['phone', 390, 760, 0]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-wisps', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${String(got).slice(0, 220)}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const idle = async () => { for (let i = 0; i < 250; i++) { if (await p.evaluate(() => !XM.route.length && !XM.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const say = async t => { if (await p.isVisible('#cmd')) { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); } else await p.evaluate(t => act(t), t); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return last(); };
    const walk = async (x, y) => { await p.evaluate(([x, y]) => { xGo(x, y); }, [x, y]); await idle(); await p.waitForTimeout(350); };
    const tapTile = async (x, y) => { await p.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p.waitForTimeout(450); const pt = await p.evaluate(([x, y]) => { const r = cv.getBoundingClientRect(); return [r.left + (x - XM.cx + .5) * XM.ts, r.top + (y - XM.cy + .5) * XM.ts, r.right, r.bottom, r.left, r.top]; }, [x, y]);
      if (pt[0] < pt[4] + 1 || pt[0] > pt[2] - 1 || pt[1] < pt[5] + 1 || pt[1] > pt[3] - 1) { bad.push(`${name}: square ${x},${y} is not on the screen to tap`); return; } await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(160); await idle(); await p.waitForTimeout(120); };
    const type = async n => { await p.fill('#ans', String(n)); await p.click('#try'); await p.waitForTimeout(220); };
    const shot = async n => { if (out) await p.screenshot({ path: path.join(out, `xylophora_${name}_${n}.png`) }); };
    const stage = () => p.evaluate(() => { const r = document.querySelector('.stage').getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round).join(',') + '|' + Math.round(window.scrollY); });

    if (name === 'ipad') {      // ---- the numbers
      const n = await p.evaluate(() => { let k = 0; for (let s = 1; s <= 2000; s++) { const v = xNums(s); k = (k + v.S * 7 + v.h * 5 + v.p * 3 + v.W + v.k * 11 + v.n * 13 + (v.fx ? 1 : 0) + (v.fy ? 2 : 0) + v.field[0] * 17 + v.field[1] * 19 + v.G * 23) % 1000000007; }
        skipIntro(); goXylophora(); const c = XY(), keep = c.seed; let wrong = 0, outside = 0; for (let s = 1; s <= 3000; s++) { c.seed = s; const v = xNums(s); let cnt = 0; for (let y = 0; y < XH; y++) for (let x = 0; x < XW; x++) if (xSkinAt(x, y)) { cnt++; if (!xIn(XR.skin, x, y) || !xOpen(x, y)) outside++; } if (cnt !== v.a * v.b + v.c * v.d || cnt !== v.S) wrong++; } c.seed = keep;
        const seen = {}, q = [XSTART.slice()]; seen[XSTART[1] * XW + XSTART[0]] = 1; while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (xOpen(nx, ny) && !seen[ny * XW + nx]) { seen[ny * XW + nx] = 1; q.push([nx, ny]); } } }
        let open = 0, reach = 0; for (let y = 0; y < XH; y++) for (let x = 0; x < XW; x++) if (xOpen(x, y)) { open++; if (seen[y * XW + x]) reach++; }
        const cnt = ch => { let k2 = 0; for (let y = 0; y < XH; y++) for (let x = 0; x < XW; x++) if (xTile(x, y) === ch) k2++; return k2; }, gaps = [[30, 7], [31, 7], [35, 9], [35, 10]].every(g => xOpen(g[0], g[1]));
        return { check: k, wrong, outside, open, reach, B: cnt('B'), L: cnt('L'), gaps, ground: XT.find(t => t.id === 'ground').look }; });
      ok(n.check === CHECK, `the game's numbers give check number ${n.check}, the Python check gives ${CHECK}`); ok(n.wrong === 0 && n.outside === 0, `skin count wrong for ${n.wrong} seeds, squares outside its place: ${n.outside}`);
      ok(n.open === n.reach, `${n.open - n.reach} open squares cannot be reached`); ok(n.B === 14 * 8 && n.L === 10 * 3 && /14 squares one way and 8 the other/.test(n.ground), 'the building ground should be 14 by 8 and the ledge 10 by 3, as the game says'); ok(n.gaps, 'the pines around the Leafgrove need their two gaps');
      notes.push(`numbers: check number ${n.check}; skin counted on the map for 3,000 seeds, ${n.wrong} wrong; ${n.reach} of ${n.open} open squares can be reached`);
    }

    // ---- arriving: with reading cards on, the first landing shows three screens. [Source: Marc, 2026-11-20: "The planet wasn't described to me... I didn't know what I was doing or why."]
    if (name === 'ipad') { try {
      await p.evaluate(() => { READ.on = true; skipIntro(); readOk(true); goSpace(); readOk(true); S.at = 'metrica'; SP.to = null; delete S.xy; save(); landXylo(); }); await p.waitForTimeout(500);
      const stA = await stage(), seenT = [], waits = [];
      for (let k = 0; k < 3; k++) { const o = await p.evaluate(() => ({ kind: widget && widget.kind, n: XM.intro, off: $('next').disabled, lab: $('next').textContent, eyebrow: document.querySelector('#toy .eyebrow').textContent, h3: document.querySelector('#toy h3').textContent, text: document.querySelector('#toy .story').textContent, place: $('place').textContent, wait: XM.iwait, words: document.querySelector('#toy .story').textContent.trim().split(/\s+/).length, longest: Math.max(...document.querySelector('#toy .story').textContent.split(/[.!?]/).map(x => x.trim().split(/\s+/).filter(Boolean).length)) }));
        ok(o.kind === 'xintro' && o.n === k && o.off && /Read/.test(o.lab) && new RegExp(`${k + 1} of 3`, 'i').test(o.eyebrow) && o.place === 'Planet Xylophora', `arrival screen ${k + 1} should be up, with Next asleep: ${JSON.stringify(o).slice(0, 220)}`); ok(o.wait >= 3500 && o.wait <= 5000, `Next should wake after 3.5 to 5 seconds, not ${o.wait}`); ok(o.words <= 40 && o.longest <= 18, `an arrival screen should be a short reading: ${o.words} words, longest sentence ${o.longest}`); seenT.push(o.h3 + ': ' + o.text); waits.push(o.wait);
        ok((await stage()) === stA, `the picture moved on arrival screen ${k + 1}`); await p.click('#next', { force: true }).catch(() => {}); ok(await p.evaluate(k2 => XM.intro === k2, k), 'Next should not work while it is asleep');
        if (k === 0) { const px = await p.evaluate(() => { const g = (x, y) => Array.from(cx.getImageData(Math.round(x), Math.round(y), 1, 1).data).slice(0, 3); return { mid: g(vw * .54, vh * .8), corner: g(6, vh - 6) }; }); ok(px.mid[1] > 70 && px.mid[1] > px.mid[2] - 40 && px.corner[0] < 30 && px.corner[1] < 30, `the first arrival picture should be a planet in dark space: ${JSON.stringify(px)}`); }
        await shot('0_arrive_' + (k + 1)); await p.waitForFunction(() => !$('next').disabled, null, { timeout: 7000 }); ok(await p.evaluate(k2 => $('next').textContent === (k2 === 2 ? 'Land' : 'Next'), k), 'the button should say Next, then Land on the last screen'); await p.click('#next'); await p.waitForTimeout(350); }
      expect(seenT[0], /Planet Xylophora: This whole planet is made of shapes\. The ground is a patchwork of perfect squares/, 'the first screen says what the planet is'); expect(seenT[1], /A giant lies here, in a sleep that never ends\. Long ago it shed its skin\. The skin is leathery, rubbery and brightly coloured/, 'the second screen says what the skin is'); expect(seenT[2], /Earth is sending families to live here\. Before the rains come they need a Home, a Hospital, a Food Store and a Solar Factory\. But there is nothing to build with/, 'the third screen says what the job is, and why');
      ok(await p.evaluate(() => !widget && XM.intro == null && XY().intro === 1 && S.mode === 'xylo' && $('place').textContent === 'Landing Square'), 'after the third screen the cadet should stand on the Landing Square'); expect(await last(), /You land on Planet Xylophora\. Smoke rises from a camp to the east/, 'the landing words');
      await p.evaluate(() => { readOk(true); leaveXylo(() => {}); readOk(true); landXylo(); }); await p.waitForTimeout(300); ok(await p.evaluate(() => !widget && XM.intro == null), 'the arrival screens should not come a second time'); await p.evaluate(() => { readOk(true); XY().intro = 0; XY().done.skin = true; leaveXylo(() => {}); readOk(true); landXylo(); }); await p.waitForTimeout(300); ok(await p.evaluate(() => !widget), 'a cadet who has already started work here should not be sent back to the arrival screens');
      await p.evaluate(() => { readOk(true); READ.on = false; delete S.xy; if (widget) closeToy(); save(); }); notes.push(`ipad: three arrival screens, Next after ${waits.map(x => (x / 1000).toFixed(1)).join(', ')} seconds`);
    } catch (e) { bad.push(`${name}: the arrival test stopped: ${String(e.message).split('\n')[0]}`); await p.evaluate(() => { try { readOk(true); READ.on = false; delete S.xy; if (widget) closeToy(); } catch (x) {} }); } }
    // ---- play: from space, with this cadet's own numbers
    try {
    await p.evaluate(sd => { skipIntro(); goSpace(); S.at = 'metrica'; SP.to = null; if (!S.xy) XY(); if (sd) XY().seed = sd; else { let s = innerWidth > 600 ? 100 : 500; while (xNums(s).h !== (innerWidth > 600 ? 12 : 8)) s++; XY().seed = s; } save(); drawWords(); }, seed); await p.waitForTimeout(300);
    ok(await p.evaluate(() => hereWords().some(x => x[0] === 'land') && hereWords().some(x => x[0] === 'land xylophora')), 'Galaxy Metrica should offer both planets');
    const cards0 = await p.evaluate(() => S.cards.length), st0 = await stage();
    expect(await say('land xylophora'), /You land on Planet Xylophora/, 'landing from space'); ok(await p.evaluate(() => S.mode === 'xylo' && XY().x === 6 && XY().y === 21 && $('place').textContent === 'Landing Square'), 'should stand by the ship on the Landing Square');
    const v = await p.evaluate(() => { const v = xNums(XY().seed); return { a: v.a, b: v.b, c: v.c, d: v.d, h: v.h, p: v.p, W: v.W, k: v.k }; });
    // this file's own sums
    const S0 = v.a * v.b + v.c * v.d, rects = A => { const o = []; for (let x = 1; x * x <= A; x++) if (A % x === 0) o.push([x, A / x]); return o; }, hos = rects(v.p).sort((q, r) => (q[0] + q[1]) - (r[0] + r[1]))[0];
    let sto = [1, v.W / 2 - 1]; for (let x = 1; x <= v.W / 4; x++) if (x * (v.W / 2 - x) > sto[0] * sto[1]) sto = [x, v.W / 2 - x]; const f = 3 * v.k, T = v.h + v.p + sto[0] * sto[1] + f, more = Math.floor((S0 - T) / v.h), rem = (S0 - T) % v.h, lv = (x, y) => Math.ceil(x / 2) * Math.ceil(y / 2);
    const secret = new RegExp(`\\b(${S0}|${more})\\b`), noAnswer = (t, what, re) => { if ((re || secret).test(t)) bad.push(`${name}: ${what} shows an answer: "${t}"`); };
    await shot('1_land');
    // things are hidden until found; dead ends are dead
    expect(await say('talk chief'), /You have not found that yet/, 'the Chief before she is found'); expect(await say('look giant'), /not found that yet/, 'the giant before it is found');
    expect(await say('look leaf'), /A square leaf, fallen long ago\. .*2 squares one way and 2 squares the other/, 'the fallen leaf'); expect(await say('take leaf'), /too dry to carry/, 'the fallen leaf cannot be carried'); expect(await say('dig'), /more ground, also square/, 'digging anywhere');
    { const t = await say('hint'); expect(t, /Walk into the mist/, 'first nudge'); noAnswer(t, 'the first nudge'); }
    await walk(11, 17); expect(await say('talk chief'), /no building material\. Nothing near the camp is strong enough/, 'the Chief gives the purpose, and no lead');
    await walk(9, 13); await walk(9, 11); ok(await p.evaluate(() => !!XY().saw.skin), 'walking north of the camp should bring the skin into view'); expect(await say('look skin'), /leathery, rubbery and bright.*perfect squares/, 'the skin'); expect(await say('take skin'), /far too big/, 'the skin cannot be carried');
    await walk(11, 17); expect(await say('talk chief'), /How many squares of skin are there\? Set it on the survey post/, 'the Chief asks for the count');
    // QUEST 1: too small, too big, right
    await say('use post'); ok(await p.evaluate(() => widget && widget.kind === 'xask' && !!$('ans')), 'the post should ask for a number'); if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the post opened: ${st0} became ${await stage()}`);      /* a phone keeps the old layout */
    await type(S0 - 7); { const t = await last(); expect(t, /count is too small/, 'a count that is too small'); noAnswer(t, 'the too-small reply'); } ok(await p.evaluate(() => !widget), 'a wrong count should close the box: the cadet goes back to look');
    await say('use post'); await type(S0 + 4); { const t = await last(); expect(t, /count is too big/, 'a count that is too big'); noAnswer(t, 'the too-big reply'); }
    for (let i = 0; i < 4; i++) noAnswer(await say('hint'), 'a nudge for the skin');
    await say('use post'); await type(S0); expect(await last(), new RegExp(`fits to the last square! ${S0} squares of skin\\. You earn a card`), 'the right count'); ok(await p.evaluate(() => XY().done.skin && S.cards.length), 'the skin quest should be done');
    await shot('2_skin');
    // QUEST 2: the board and the floors
    expect(await say('talk chief'), new RegExp(`${S0} squares of skin\\. Good work, Resource Manager\\. Now you are our Space Architect\\. The cutters cut the skin in straight lines\\. So every floor is a rectangle`), 'the Chief after the count says why a floor is a rectangle');
    await say('use board'); { const t = await p.textContent('#toy'); expect(t, new RegExp(`A floor of ${v.h} squares\\. Any rectangle[\\s\\S]*A floor of ${v.p} squares\\. Wall panels are scarce[\\s\\S]*${v.W} wall panels are set aside[\\s\\S]*A floor of ${f} squares\\. It must stand on the Sun Ledge`), 'the four orders, with this cadet\'s numbers'); ok(!new RegExp(`\\b${hos[0]} by ${hos[1]}\\b|\\b${sto[0] * sto[1]} squares`).test(t), 'the board must not give a floor away'); } await p.click('#leave'); await p.waitForTimeout(150);
    const mark = async (bn, x, y, mw, ml) => { await say('build ' + bn); await tapTile(x, y); await tapTile(x + mw - 1, y + ml - 1); return last(); };
    { const g = await p.evaluate(() => { const r = cv.getBoundingClientRect(), X0 = (14 - XM.cx) * XM.ts, X1 = (28 - XM.cx) * XM.ts, Y0 = (13 - XM.cy) * XM.ts, Y1 = (21 - XM.cy) * XM.ts; return X0 >= -1 && Y0 >= -1 && X1 <= r.width + 1 && Y1 <= r.height + 1; }); await say('build home'); const g2 = await p.evaluate(() => { const r = cv.getBoundingClientRect(), X0 = (14 - XM.cx) * XM.ts, X1 = (28 - XM.cx) * XM.ts, Y0 = (13 - XM.cy) * XM.ts, Y1 = (21 - XM.cy) * XM.ts; return X0 >= -1 && Y0 >= -1 && X1 <= r.width + 1 && Y1 <= r.height + 1; }); if (name !== 'phone') ok(g2, 'the whole building ground should be on the screen while a floor is marked'); await say('look'); }
    const H = [Math.max(hos[0], hos[1]), Math.min(hos[0], hos[1])];      // the Hospital, laid the long way: H[0] wide, H[1] long
    expect(await mark('home', 14, 13, 1, 1), new RegExp(`You mark a floor 1 by 1\\. The Home order is for ${v.h} squares\\. This floor is too small`), 'a floor that is too small');
    { const thin = rects(v.p).filter(q => q[0] !== hos[0] && q[1] <= 14 && q[0] <= 8)[0]; if (thin) { const t = await mark('hospital', 14, 13, thin[1], thin[0]); expect(t, new RegExp(`It is ${v.p} squares\\. But the Chief counts the wall panels and shakes her head\\. "Too many panels`), 'the right size with too long a wall'); noAnswer(t, 'the too-many-panels reply', new RegExp(`\\b${2 * (hos[0] + hos[1])} panels|${H[0]} by ${H[1]}|${H[1]} by ${H[0]}`)); } }
    expect(await mark('hospital', 14, 13, H[0], H[1]), new RegExp(`You mark a floor ${H[0]} by ${H[1]}\\. The cutters lay ${v.p} squares of skin\\. The Hospital floor is down`), 'the Hospital');
    expect(await mark('home', 14, 13 + H[1], v.h / 2, 2), /It touches the Hospital\. The Chief wants a path between buildings/, 'a floor that touches another');
    expect(await mark('store', 21, 13, sto[1] + 1, sto[0]), new RegExp(`The Food Store has ${v.W} wall panels\\. This wall needs more`), 'a store that needs more panels');
    { const t = await mark('store', 21, 13, sto[1] + 1, sto[0] - 1); expect(t, new RegExp(`Its wall uses all ${v.W} panels\\. But the Chief frowns at the floor\\. "The same panels can hold a bigger store`), 'a store that is not the biggest'); noAnswer(t, 'the smaller-store reply', new RegExp(`\\b${sto[0] * sto[1]}\\b`)); }
    expect(await mark('store', 21, 13, sto[1], sto[0]), new RegExp(`The cutters lay ${sto[0] * sto[1]} squares of skin\\. The Food Store floor is down`), 'the Food Store');
    expect(await mark('home', 14, 18, v.h, 1), new RegExp(`You mark a floor ${v.h} by 1\\. The cutters lay ${v.h} squares of skin\\. The Home floor is down`), 'a thin Home is a fair Home');
    expect(await mark('factory', 16, 8, v.k, 2), new RegExp(`The Solar Factory order is for ${f} squares\\. This floor is too small`), 'a factory that is too small');
    // the doing word and the Here row do the same as typing: BUILD, then Solar Factory, then two taps
    if (name !== 'phone') { await p.evaluate(() => { $('cmd').value = ''; }); await p.tap('#verbs .word[data-v="build"]'); await p.waitForTimeout(150); ok(await p.evaluate(() => [...document.querySelectorAll('#nouns .noun')].some(x => /Solar Factory/.test(x.textContent))), 'near the ground the Here row should offer the four buildings'); await p.evaluate(() => { [...document.querySelectorAll('#nouns .noun')].find(x => /Solar Factory/.test(x.textContent)).click(); }); await p.waitForTimeout(200); await idle(); await p.waitForTimeout(300); expect(await last(), /Mark the Solar Factory floor\. Tap one corner on the Sun Ledge/, 'BUILD then Solar Factory, by tapping words'); await tapTile(16, 8); await tapTile(16 + v.k - 1, 10); }
    else await mark('factory', 16, 8, v.k, 3);
    { const t = await last(); expect(t, /All four floors are down! You earn a card\. By evening the walls are up\..*the skin sags, and the roof falls in\. Skin is too soft for a roof\. The colony needs something stiff and flat/, 'four floors, then the roof falls in'); ok(!/leaf|leaves|tree|east/i.test(t), 'the game must not say what to roof with, or where it grows'); }
    ok(await p.evaluate(() => XY().done.floors && xStage() === 'roofs'), 'the floors quest should be done'); await shot('3_floors');
    // QUEST 3: roofs
    { const t = await say('talk chief'); expect(t, /Skin sags\. We need something stiff and flat\. I have seen nothing like that near the camp/, 'the Chief has no lead'); }
    await walk(15, 12); await tapTile(15, 13); expect(await last(), /has walls and no roof\. It is open to the sky/, 'a tap on a roof with no leaves');
    { const t1 = await say('hint'), t2 = await say('hint'); expect(t1, /stiff, flat and square/, 'the first roof nudge'); expect(t2, /Trees grow where the pines open, far to the north-east/, 'the second roof nudge'); }
    await walk(29, 7); ok(await p.evaluate(() => !XY().saw.tree), 'the Leafgrove should stay hidden until the cadet is at the gap'); await walk(36, 5); ok(await p.evaluate(() => !!XY().saw.tree && $('place').textContent === 'Leafgrove'), 'through the gap is the Leafgrove');
    // the mist has cleared the trees, but the cadet has not looked at one or picked a leaf: that is not finding them (Marc was told "Stiff leaves!" and could not find any)
    ok(await p.evaluate(() => !xKnowsTrees() && /Skin sags\. We need something stiff and flat/.test(xChief())), 'trees cleared by the mist are not found trees: the Chief should still have no lead'); { const t = await say('hint'); ok(!/One leaf covers|hangs over a wall|lay a floor again/.test(t), `Hint should not move on to the roofs before the trees are found: "${t}"`); }
    await walk(15, 12); await tapTile(15, 13); expect(await last(), /has walls and no roof\. It is open to the sky/, 'a roof tapped before the trees are found'); await walk(36, 5);
    const G = await p.evaluate(() => xLeavesLeft()), needMin = Math.min(...rects(v.h).map(q => lv(q[0], q[1]))) + lv(hos[0], hos[1]) + lv(sto[0], sto[1]) + Math.min(...rects(f).filter(q => q[0] <= 3 && q[1] <= 10).map(q => lv(q[0], q[1])));
    ok(G === needMin + 1, `the grove should hold the leaves careful roofs need, and one more: ${G} against ${needMin} + 1`);
    expect(await say('look tree'), new RegExp(`each as big as 2 squares by 2 squares\\. There are ${G} leaves on the trees`), 'the Xylotrees'); ok(await p.evaluate(() => xKnowsTrees() && /Stiff leaves! They may just work/.test(xChief())), 'once a tree has been looked at, the Chief knows about the leaves');
    await say('take leaves'); await type(9); expect(await p.textContent('#msg'), /Your arms hold 6 leaves at most/, 'picking more than arms can hold'); await type(6); expect(await last(), /You pick 6 leaves\. You carry 6/, 'picking six'); expect(await say('take leaves'), /Your arms are full/, 'full arms');
    ok(await p.evaluate(() => /square leaves × 6/.test($('bag').textContent)), 'the bag row should show the leaves');
    // a leaf is laid at the roof, by hand. From the grove, the word walks the cadet all the way there first.
    await say('lay leaf'); ok(await p.evaluate(() => { const c = XY(); return c.bag === 5 && XBK.some(o => { const f = c.fl[o]; return Math.hypot(Math.max(f[0] - c.x, 0, c.x - (f[0] + f[2] - 1)), Math.max(f[1] - c.y, 0, c.y - (f[1] + f[3] - 1))) <= 2.5 && c.roof[o].length === 1; }); }), '"lay leaf" from the grove should walk to a roof before the leaf is laid'); await p.evaluate(() => { const c = XY(), o = XBK.find(k => c.roof[k].length); c.roof[o] = []; c.bag = 6; save(); drawBag(); });
    await walk(15, 12); await tapTile(14, 13); expect(await last(), /You lay a leaf on the Hospital\. You carry 5/, 'laying a leaf by tapping the roof'); await tapTile(15, 14); expect(await last(), /A leaf lies here already/, 'a second tap on the same leaf');
    await p.evaluate(() => { $('cmd').value = 'take'; mark(); }); await tapTile(14, 13); expect(await last(), /You lift a leaf off the Hospital\. You carry 6/, 'TAKE, then a tap, lifts a leaf'); await shot('4_leaf');
    // carry and lay until the grove is bare or every roof is whole
    const carry = async () => { await walk(36, 5); const st = await p.evaluate(() => [xLeavesLeft(), XY().bag]); if (st[0] && st[1] < 6) { await say('take leaves'); await type(Math.min(6 - st[1], st[0])); } await walk(20, 12); };
    for (let round = 0; round < 9; round++) { const st = await p.evaluate(() => ({ whole: xRoofsWhole(), bag: XY().bag, left: xLeavesLeft() })); if (st.whole) break; if (!st.bag) { if (!st.left) break; await carry(); } for (let k2 = 0; k2 < 6; k2++) { if (!(await p.evaluate(() => XY().bag)) || await p.evaluate(() => XY().done.roofs)) break; await say('lay leaf'); } }
    const thinNeed = lv(v.h, 1) + lv(hos[0], hos[1]) + lv(sto[0], sto[1]) + lv(3, v.k), dry = thinNeed > G;
    ok(dry, `the test's cadet should have a thin Home that wastes leaves (needs ${thinNeed}, grove ${G})`);
    ok(await p.evaluate(() => !XY().done.roofs && !xLeavesLeft() && !XY().bag), 'with a thin Home the grove should run dry before every roof is whole'); await shot('5_dry');
    await walk(11, 17); { const t = await say('talk chief'); expect(t, /No leaves left on the trees\? Then some roof is using too many/, 'the Chief when the grove is bare'); ok(!/home|thin|long|shape|build/i.test(t), 'the Chief must not say which roof, or what to do'); }
    { const t1 = await say('hint'), t2 = await say('hint'), t3 = await say('hint'), t4 = await say('hint'); expect(t2, /hangs over a wall is partly wasted/, 'the nudge about waste'); expect(t3, /lay a floor again/, 'the nudge that a floor can be laid again'); expect(t4, /That is all the help there is\. The rest is yours to work out/, 'the nudges run out'); ok(t1 !== t2, 'nudges should not repeat'); }
    const leavesHome = lv(v.h, 1); { const t = await say('build home'); expect(t, new RegExp(`You take up the Home floor\\. Its ${Math.min(leavesHome, 99)} leaves go back in your arms|You take up the Home floor\\.`), 'taking up a floor gives its leaves back'); } await tapTile(14, 18); await tapTile(14 + v.h / 2 - 1, 19);
    expect(await last(), new RegExp(`You mark a floor ${v.h / 2} by 2\\. The cutters lay ${v.h} squares of skin\\. The Home floor is down`), 'the Home, laid again in a better shape');
    for (let k2 = 0; k2 < 8; k2++) { if (await p.evaluate(() => XY().done.roofs)) break; await say('lay leaf'); }
    expect(await last(), /Every roof is whole! That night the first rain falls\. Every room stays dry\. You earn a card/, 'every roof whole'); ok(await p.evaluate(() => XY().done.roofs && xStage() === 'homes'), 'the roofs quest should be done'); await shot('6_roofs');
    expect(await say('build home'), /The colony is built\. Nothing needs to move now/, 'no floor moves once the roofs are on');
    // QUEST 4: more Homes
    await walk(11, 17); await say('talk chief'); expect(await p.textContent('#toy .q'), new RegExp(`The cutters have ${S0 - T} squares of skin left\\. Each family needs a Home like yours: ${v.h} squares\\. How many more Homes can they cut\\?`), 'the question about more Homes');
    await type(more + 1); { const t = await last(); expect(t, new RegExp(`The skin runs out before Home number ${more + 1}`), 'too many Homes'); } await say('talk chief'); await type(more - 1); { const t = await last(); expect(t, /There is still skin enough for another one/, 'too few Homes'); noAnswer(t, 'the too-few reply', new RegExp(`\\b${more}\\b`)); }
    for (let i = 0; i < 3; i++) noAnswer(await say('hint'), 'a nudge for the Homes', new RegExp(`\\b${more}\\b`));
    await say('talk chief'); await type(more); expect(await last(), new RegExp(`${more} more Homes\\. The cutters cut them, one by one\\. ${rem ? `${rem} square${rem === 1 ? ' is' : 's are'} left over: not enough for another` : 'Not one square is left over'}\\. You earn a card`), 'the right number of Homes');
    // the map key
    await say('talk chief'); ok(await p.evaluate(() => widget && widget.kind === 'xkey' && $('try').disabled), 'the key should wait until four colours are chosen');
    for (const [bn, i] of [['home', 0], ['hosp', 1], ['store', 2], ['fact', 0]]) await p.click(`#toy p.chips[data-b="${bn}"] button[data-i="${i}"]`); await p.click('#try'); expect(await p.textContent('#msg'), /Two kinds have the same colour/, 'two kinds with one colour'); await p.click('#toy p.chips[data-b="fact"] button[data-i="3"]'); await shot('7_key'); await p.click('#try'); await p.waitForTimeout(300);
    { const t = await last(), laid = lv(v.h / 2, 2) + lv(hos[0], hos[1]) + lv(sto[0], sto[1]) + lv(3, v.k), pan = 2 * (v.h / 2 + 2) + 2 * (hos[0] + hos[1]) + 2 * (sto[0] + sto[1]) + 2 * (3 + v.k);
      expect(t, new RegExp(`a Hospital, a Food Store, a Solar Factory and ${1 + more} Homes\\. Skin: ${S0} squares found, ${S0 - rem} used, ${rem} left over\\. Leaves: ${laid} laid, ${G - laid} to spare\\. Wall panels: ${pan}\\. The Site Chief names you a Planetary Pioneer\\. You earn an epic card`), 'the ending adds up'); }
    ok(await p.evaluate(() => XY().done.key && XY().gold && S.cards[S.cards.length - 1].r === 'gold' && xStage() === 'end'), 'the gold card'); expect(await say('talk chief'), /They need stone paths/, 'the Chief asks for stone paths');
    // the stone paths [decisions 16 and 19]: join the three buildings; count the stones; no more than carried
    const PN = await p.evaluate(() => { const P = XY().pp, mud = new Set(P.mud), cells = xpCells(), cost = k => mud.has(k) ? XPM : XPG, free = new Set(cells.map(q => q.join()));
      const dist = b => { const d = new Map(), prev = new Map(), q = []; cells.forEach(([x, y]) => { if (xpTouch(b, x, y)) { const k = x + ',' + y; d.set(k, cost(k)); q.push(k); } });
        while (q.length) { q.sort((a, z) => d.get(a) - d.get(z)); const k = q.shift(), [x, y] = k.split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const m = (x + dx) + ',' + (y + dy); if (!free.has(m)) return; const nd = d.get(k) + cost(m); if (!d.has(m) || nd < d.get(m)) { d.set(m, nd); prev.set(m, k); q.push(m); } }); } return { d, prev }; };
      const D = XPB.map(dist); let bk = null, bv = Infinity; free.forEach(k => { if (D.every(x => x.d.has(k))) { const v = D[0].d.get(k) + D[1].d.get(k) + D[2].d.get(k) - 2 * cost(k); if (v < bv) { bv = v; bk = k; } } });
      const net = new Set(); D.forEach(x => { let k = bk; while (k) { net.add(k); k = x.prev.get(k); } }); return { net: [...net], cost: [...net].reduce((n, k) => n + cost(k), 0), all: [...free].reduce((n, k) => n + cost(k), 0), carry: P.carry }; });
    const pmsg = () => p.textContent('#msg'), pave = k => p.locator(`#pic [data-p="${k}"]`).tap();
    await p.click('#try'); expect(await pmsg(), /Tap squares to lay stones first/, 'paths: nothing laid');
    await pave(PN.net[0]); if (PN.net.length > 1) { await p.click('#try'); expect(await pmsg(), /Not joined yet:.*side to side/, 'paths: not joined'); }
    for (const k of PN.net.slice(1)) await pave(k); await p.click('#try'); expect(await pmsg(), /Write the total/, 'paths: no total written');
    await p.fill('#ans', String(PN.cost + 1)); await p.click('#try'); expect(await pmsg(), /Count again/, 'paths: a wrong total');
    await p.evaluate(() => { const P = XY().pp; P.keep = P.paved.slice(); P.paved = xpCells().map(q => q.join()); $('pic').innerHTML = xpSvg(P); }); await p.fill('#ans', String(PN.all)); await p.click('#try'); expect(await pmsg(), new RegExp(`${PN.all} stones\\. You carry only ${PN.carry}`), 'paths: too many stones');
    await p.evaluate(() => { const P = XY().pp; P.paved = P.keep; delete P.keep; $('pic').innerHTML = xpSvg(P); }); await p.fill('#ans', String(PN.cost)); await shot('8b_paths'); await p.click('#try'); await p.waitForTimeout(1700);
    expect(await last(), /nobody's boots get muddy.*You earn a card/, 'the stone paths'); ok(await p.evaluate(() => XY().done.paths && XY().paths.length > 0), 'the paths are kept on the map');
    expect(await say('talk chief'), /Thank you, Planetary Pioneer/, 'the Chief at the end'); expect(await say('hint'), /Xylophora is built/, 'the hint at the end'); await shot('8_end');
    // the side job and the secrets
    await walk(33, 17); const fld = await p.evaluate(() => xNums(XY().seed).field), part = fld[0] * fld[1] / 4;
    await say('talk herder'); expect(await p.textContent('#toy .q'), /Four herds graze this field\. Each herd must get an equal part\. How many squares is one part\?/, 'the herder asks'); ok(!new RegExp(`\\b${fld[0]}\\b.*\\b${fld[1]}\\b`).test(await p.textContent('#toy')), 'the herder must not give the sides of the field');
    await type(part + 1); expect(await last(), /do not fit in the field/, 'parts too big'); await say('talk herder'); await type(part - 1 || 1); if (part > 1) expect(await last(), /some grass is left outside every fence/, 'parts too small'); else await p.evaluate(() => { if (widget) closeToy(); });
    if (part > 1) await say('talk herder'); await type(part); expect(await last(), new RegExp(`Four equal parts, ${part} squares each\\. Each herd gets one quarter of the field`), 'the field shared'); await shot('9_field');
    await walk(20, 5); expect(await say('talk giant'), /does not wake/, 'hello to the giant'); await say('talk giant'); expect(await say('talk giant'), /something hums back.*You earn a card/, 'the giant hums'); expect(await say('push giant'), /like pushing a hill/, 'pushing the giant');
    await walk(33, 22); expect(await say('dig'), /a print pressed into it: a square leaf.*You earn a card/, 'the leaf print'); expect(await say('take cactus'), /Ouch! No/, 'a cactus'); expect(await say('look pines'), /Every branch is a triangle/, 'the pines'); expect(await say('hug cactus'), /Nothing happens|hug/, 'a doing word the game has no use for');
    // the counts, the log, the cards
    const end = await p.evaluate(() => ({ cards: S.cards.length, status: $('status').textContent, log: S.log.filter(l => /^Xylophora/.test(l.what)).map(l => l.what + ' | ' + l.skill + ' | ' + l.result) }));
    ok(end.cards === cards0 + 9, `9 cards on Xylophora (four quests, the epic card, the stone paths, the field, two secrets): got ${end.cards - cards0}`); expect(end.status, /Xylophora 5 of 5/, 'the count under My ship');
    ok(end.log.length === 9 && /skin \| Area of a shape made of two rectangles \(AERO 3\.MD\.7\) \| solved on try 3/.test(end.log[0]) && end.log.some(l => /Equal parts of a shape, and one quarter \(AERO 3\.G\.2, 3\.NF\.1\)/.test(l)), 'the teacher\'s log should name each quest, its AERO standard, and the tries: ' + end.log.join(' // '));
    if (name !== 'phone') ok((await stage()) === st0, `the picture moved or changed size during play: ${st0} became ${await stage()}`); ok(await p.evaluate(() => document.documentElement.scrollHeight - innerHeight <= 2 || innerWidth < 600), 'the page should not be able to scroll');
    // a reload keeps it all; fly; land again
    await p.reload(); await p.waitForTimeout(700); ok(await p.evaluate(() => S.mode === 'xylo' && XY().x === 33 && XY().y === 22 && XM.px === 33 && XM.py === 22 && xStage() === 'end' && XBK.every(o => XY().fl[o]) && XY().finds.length === 3), 'a reload should keep the place, the buildings and the finds');
    expect(await say('fly'), /You lift off from Xylophora\. Galaxy Metrica glows around you/, 'flying away'); ok(await p.evaluate(() => S.mode === 'space' && S.at === 'metrica'), 'back in Galaxy Metrica');
    expect(await say('land xylophora'), /You land on Planet Xylophora/, 'landing again'); expect(await say('look'), /Landing Square, on Planet Xylophora\. The ground is a patchwork of squares/, 'look, on landing');
    expect(await say('land'), /Xylophora does not know that yet|not know/, 'a word that means nothing here');
    notes.push(`${name}: seed ${await p.evaluate(() => XY().seed)}, skin ${S0}, Home ${v.h}, Hospital ${v.p}, store panels ${v.W}, factory ${f}, more Homes ${more}; all four quests, the field and two secrets played; ${end.cards - cards0} cards`);
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]} ${(e.stack || '').split('\n').filter(l => /xylophora_test/.test(l)).slice(0, 1).join('').trim()}`); }
    await ctx.close();
  }
  await b.close(); notes.forEach(x => console.log(x));
  if (bad.length) { console.log('\nFAILED:'); bad.forEach(x => console.log('  ' + x)); }
  console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none'));
  console.log(bad.length || errs.length ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(bad.length || errs.length ? 1 : 0);
})().catch(e => { console.error('FAILED', e.message.split('\n').slice(0, 3).join(' | '), (e.stack || '').split('\n').filter(l => /xylophora_test/.test(l)).slice(0, 2).join(' | ')); process.exit(1); });
