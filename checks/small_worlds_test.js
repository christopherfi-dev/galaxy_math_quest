// Small worlds from a kit, and the "tap the words" row.  [Source: Marc, 2026-11-17: a huge universe to explore; words to tap instead of type]
//   - all 20 trade planets make a world from the kit: different names, kind words only, short sentences, a secret in a real place
//   - every lock question has one right answer, worked out again here, on 2,000 tries for each world
//   - a world is played: land, look, watch the creature for its clue, meet dead ends, find the box, open the lock, earn a star seed, fly off
//   - the things in a place are shown as words to tap, on the station, on Voltara and on a small world; a doing word then a thing runs the command
// Run: node checks/small_worlds_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const last = () => p.evaluate(() => lines[lines.length - 1].text || ''), idle = async () => { for (let i = 0; i < 150; i++) { if (await p.evaluate(() => PL.to == null && !PL.then && !(S.mode === 'station' && ((P.route && P.route.length) || P.then)))) return; await p.waitForTimeout(100); } bad.push(name + ': still walking'); };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(120); return last(); };
    const expect = (got, re, what) => { if (!re.test(got)) bad.push(`${name}: ${what}: got "${got}"`); };
    if (name === 'ipad') {      // ---- the kit itself, for all 20 worlds
      const kit = await p.evaluate(() => { skipIntro(); const res = { names: [], long: [], rudeW: [], at: [], lockBad: 0, lockN: 0, kinds: {} }; const r10 = n => Math.floor((n + 5) / 10) * 10, r100 = n => Math.floor((n + 50) / 100) * 100;
        const sentences = t => t.split(/(?<=[.!?])\s+/).filter(Boolean), tooLong = t => sentences(t).filter(s => s.split(/\s+/).length > 10);
        Object.keys(TR).forEach(n => { const k = wKit(n), th = wThings(k); res.names.push(k.name, k.cr.name); res.kinds[k.far[0] + '/' + k.sky[2]] = 1; if (!th.some(t => t.id === k.at)) res.at.push(n);
          const texts = [wArrive(k), k.sky[2], k.far[1], k.rock[1], k.rock[2]].concat(k.cr.quirks, k.flora.reduce((a, f) => a.concat(WKIT.flora[f].slice(1)), []), th.map(t => wDo(k, t, 'look')));
          texts.forEach(t => { tooLong(t).forEach(s => res.long.push(n + ': ' + s)); if (rude(t)) res.rudeW.push(n + ': ' + t); }); if (rude(k.name, true) || rude(k.cr.name, true)) res.rudeW.push(n + ' name');
          for (let i = 0; i < 2000; i++) { const q = wLockQ(k, i), nums = (q.q.match(/\d+/g) || []).map(Number); res.lockN++; let want; if (k.lock === 0) want = r10(nums[0]); else if (k.lock === 1) want = r100(nums[0]); else if (k.lock === 2) want = nums[0] + nums[1]; else want = nums[0] - nums[1];
            if (q.a !== want || q.a <= 0 || q.a > 1000 || (k.lock < 2 && (nums[0] % (k.lock ? 100 : 10) === 0)) || tooLong(q.q).length) res.lockBad++; } if (widget) closeToy(); });
        return res; });
      if (new Set(kit.names).size !== 40) bad.push('world and creature names repeat: ' + kit.names.join(' ')); if (kit.long.length) bad.push('sentences over 10 words: ' + kit.long.slice(0, 4).join(' | ')); if (kit.rudeW.length) bad.push('unkind words in a world: ' + kit.rudeW.join(' | '));
      if (kit.at.length) bad.push('a secret sits on a thing that is not there: ' + kit.at); if (kit.lockBad) bad.push(kit.lockBad + ' bad lock questions of ' + kit.lockN); if (Object.keys(kit.kinds).length < 12) bad.push('the 20 worlds look too alike: only ' + Object.keys(kit.kinds).length + ' sky and land pairs');
      console.log(`20 worlds: 40 names all different, ${Object.keys(kit.kinds).length} sky-and-land pairs, ${kit.lockN.toLocaleString()} lock questions checked, ${kit.lockBad} bad.`);
    }
    // ---- tap the words: on the station
    await p.evaluate(() => { skipIntro(); }); await p.waitForTimeout(300); let words = await p.evaluate(() => [...document.querySelectorAll('#nouns .noun')].map(x => x.textContent));
    if (words.length < 3 || !words.some(x => /ship/.test(x))) bad.push(name + ': the station should show the things here as words: ' + words.join(', '));
    await p.locator('#verbs [data-v="look"]').tap(); await p.locator('#nouns .noun', { hasText: /ship/ }).first().tap(); await p.waitForTimeout(200); await idle(); expect(await last(), /Your ship|scrap|hull/i, 'a doing word then a thing word runs the command');
    await p.locator('#nouns .noun').nth(1).tap(); await p.waitForTimeout(200); await idle(); if (!(await last())) bad.push(name + ': tapping a thing word alone should look at it');
    // ---- a small world
    await p.locator('#t_space').tap(); await p.waitForTimeout(1500); await say('trade'); await p.click('#try'); await p.waitForTimeout(200);
    if (await p.locator('#toy .land').count()) bad.push(name + ': no planet can be landed on before it is scanned');
    await p.click('#toy .wire[data-n="C"]'); await p.fill('#ans', '30'); await p.fill('#ans2', '1200'); await p.click('#try'); await p.waitForTimeout(200); await p.click('#toy .land[data-land="C"]'); await p.waitForTimeout(400);
    const k = await p.evaluate(() => { const k = wKit('C'), th = wThings(k); return { name: k.name, cr: k.cr.name, at: k.at, things: th.map(t => ({ id: t.id, w: t.words[0], label: t.label })), mode: S.mode, place: $('place').textContent, q: wLockQ(k, 0) }; });
    if (k.mode !== 'world' || k.place !== k.name) bad.push(name + ': landing should put you on the world: ' + JSON.stringify([k.mode, k.place])); expect(await last(), new RegExp(`You land on ${k.name}, Planet C\\..*A creature watches you`), 'the arrival words');
    if (out) { await p.waitForTimeout(500); await p.screenshot({ path: path.join(out, `world_${name}_C.png`) }); }
    words = await p.evaluate(() => [...document.querySelectorAll('#nouns .noun')].map(x => x.textContent)); if (words.length !== 7 || !words.includes(k.cr)) bad.push(name + ': the world should show its seven things as words: ' + words.join(', '));
    expect(await say('look'), new RegExp(`${k.name}\\..*You see: your ship, trade post`), 'look'); expect(await say('look post'), /It pays 1,200 gems.*30 light-years/, 'the trade post carries the planet\'s own numbers');
    expect(await say('look ' + k.cr.toLowerCase()), new RegExp(`A ${k.cr}\\. It has \\d (eye|eyes) and`), 'look at the creature'); expect(await say('hint'), /Talk to it twice/, 'the hint before the clue');
    const t1 = await say('talk ' + k.cr.toLowerCase()), t2 = await say('talk creature'), secret = k.things.find(t => t.id === k.at); expect(t1, /does not use words/, 'the creature does not speak'); expect(t2, new RegExp(`It looks at the ${secret.label}\\. Then it looks at you`), 'the creature gives the clue by looking');
    for (const t of k.things.filter(t => /^p|rock/.test(t.id) && t.id !== k.at)) { const r = await say('touch ' + t.w); if (await p.evaluate(() => !!widget) || !r) bad.push(name + `: ${t.label} should be a dead end: ${r}`); }
    expect(await say('touch ' + secret.w), /Under it sits a shell box\. It has a number lock/, 'the secret thing'); if (!(await p.evaluate(() => widget && widget.kind === 'wlock'))) bad.push(name + ': the lock should open as a panel');
    await p.fill('#ans', String(k.q.a + 10)); await p.click('#try'); expect(await p.textContent('#msg'), /The lock stays shut/, 'a wrong answer'); if (out && name === 'ipad') await p.screenshot({ path: path.join(out, 'world_lock.png') });
    const cards = await p.evaluate(() => S.cards.length); await p.fill('#ans', String(k.q.a)); await p.click('#try'); await p.waitForTimeout(300); expect(await last(), /star seed! It glows in your hand\. You have 1 of 20 star seeds\. You earn a card/, 'the star seed');
    if ((await p.evaluate(() => S.cards.length)) !== cards + 1) bad.push(name + ': a star seed should give one card'); expect(await p.textContent('#status'), /Star seeds 1 of 20/, 'the star seed chip'); expect(await say('touch ' + secret.w), /./, 'the thing after the find'); if (await p.evaluate(() => !!widget)) bad.push(name + ': the lock opened twice');
    // tap a thing on the picture, and a word chip with a doing word
    const st = await p.locator('#cv').boundingBox(); await p.evaluate(() => window.scrollTo(0, 0)); const st2 = await p.locator('#cv').boundingBox(); await p.touchscreen.tap(st2.x + st2.width * .25, st2.y + st2.height * .8); await p.waitForTimeout(300); await idle(); expect(await last(), /trade post/, 'tapping the trade post on the picture');
    await p.fill('#cmd', 'touch'); await p.locator('#nouns .noun').nth(2).tap(); await p.waitForTimeout(300); await idle(); if (!(await last())) bad.push(name + ': a doing word and a word chip on a small world');
    await p.reload(); await p.waitForTimeout(500); if (!(await p.evaluate(() => S.mode === 'world' && S.w.finds.length === 1 && $('place').textContent === wKit('C').name))) bad.push(name + ': the world was not kept after a reload');
    expect(await say('fly'), /You lift off from/, 'fly away'); if ((await p.evaluate(() => S.mode)) !== 'space') bad.push(name + ': flying should return to space');
    await say('trade'); if (!/Land on C ★/.test(await p.textContent('#toy'))) bad.push(name + ': a planet whose seed is found should show a star'); await p.click('#leave');
    if (out) for (const n of ['A', 'F', 'G', 'I']) { await p.evaluate(n => { TRADE().scan.push(n); landWorld(n); }, n); await p.waitForTimeout(600); await p.screenshot({ path: path.join(out, `world_${name}_${n}.png`) }); }
    // ---- tap the words: on Voltara
    await p.locator('#t_volt').tap(); await p.waitForTimeout(800); words = await p.evaluate(() => [...document.querySelectorAll('#nouns .noun')].map(x => x.textContent)); if (!words.some(x => /butterfly/.test(x))) bad.push(name + ': Voltara should show its things as words: ' + words.join(', '));
    console.log(`${name}: a small world played, words tapped`); await ctx.close();
  }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0], '| at', (String(e.stack).match(/small_worlds_test.js:\d+:\d+/) || [''])[0]); process.exit(1); });
