// The lucky draw: choosing a ship part.  [Source: Marc, 2026-11-20: the middle version for sure, or the lucky draw: lucky 10%, middle 50%, below 20%, above 20%;
// four cards spin, one floats down and flips, colour bursts out (red, green, light blue, gold rainbow); LUCKY DRAW fills the screen; the part with its HP and AP.]
//   - the odds, worked out on 100,000 evenly spread numbers: exactly 10 / 20 / 20 / 50 in every 100
//   - Marc's 2023 versions: four for each part, his names and numbers
//   - finishing a part's third task offers the choice; "Not yet" leaves it in My ship; the bag shows 10 tokens
//   - each colour is drawn once (the gold one with the celebration); the sure choice gives the middle one
//   - the draw is saved before the cards spin, so opening the game again cannot change it; the log keeps what was chosen
//   - with "reduce motion", there is no spin, and the card is shown turned over
// Run: node checks/lucky_draw_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h, calm] of [['ipad', 1180, 745, false], ['phone', 390, 760, false], ['calm', 1180, 745, true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1, reducedMotion: calm ? 'reduce' : 'no-preference' }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(300); await p.evaluate(() => skipIntro()); await p.waitForTimeout(200);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || ''), shot = async n => { if (out) await p.screenshot({ path: path.join(out, `lucky_${name}_${n}.png`) }); };
    if (name === 'ipad') {      // ---- the odds and the data
      const d = await p.evaluate(() => { const c = [0, 0, 0, 0]; for (let k = 0; k < 100000; k++) c[pvPick((k + .5) / 100000)]++; return { c, parts: Object.keys(PVER), v: PVER }; });
      if (String(d.c) !== '20000,50000,20000,10000') bad.push('the odds should be red 20, green 50, blue 20, gold 10 in every 100: ' + d.c);
      if (d.parts.sort().join() !== 'Engine Core,Navigation,Power,Shield,Weapons' || d.parts.some(k => d.v[k].length !== 4)) bad.push('four versions for each of the five parts');
      const want = { 'Engine Core': ['Standard Reactor', 10, 10, 'Stellar Reactor', 30, 10], Navigation: ['Standard Navigator', 15, 5, 'Cosmic Navigator', 20, 15], Shield: ['Standard Shield', 20, 0, 'Nova Shield', 40, 10], Weapons: ['Standard Arsenal', 10, 15, 'Supernova Arsenal', 15, 30], Power: ['Standard Battery', 15, 10, 'Galaxy Battery', 30, 15] };
      Object.keys(want).forEach(k => { const v = d.v[k], x = want[k]; if (v[1][0] !== x[0] || v[1][1] !== x[1] || v[1][2] !== x[2] || v[3][0] !== x[3] || v[3][1] !== x[4] || v[3][2] !== x[5]) bad.push(`${k}: the middle and lucky versions should be Marc's own`); });
      console.log('Odds over 100,000 draws (red, green, blue, gold): ' + d.c.join(', ') + '.');
      // [Source: Marc, 2026-11-21] four real levels; the bag changes with each child's luck. 20,000 children draw all five parts; 20,000 more sometimes take the sure part.
      const k = await p.evaluate(() => { const keep = [S.pv, S.pvN, S.parts.slice()], res = { bad: [], lucky: [0, 0, 0, 0, 0, 0], streak: 0 }; S.parts = PARTS.slice();
        Object.keys(PVER).forEach(q => { const v = PVER[q], t = v.map(x => x[1] + x[2]); if (!(t[0] < t[1] && t[1] < t[2] && t[2] < t[3])) res.bad.push(`${q}: the four do not rise: ${t}`); });
        for (const mode of ['all', 'some']) for (let c = 0; c < 20000; c++) { S.pv = {}; S.pvN = 0; const order = PARTS.slice().sort(() => Math.random() - .5); let st = 0, top = 0;
          order.forEach(q => { if (mode === 'some' && Math.random() < .3) { S.pvN++; S.pv[q] = { i: 1, how: 'safe', n: S.pvN }; return; } const B = pvBag(q); if (B.reduce((a, b) => a + b, 0) !== 10 || B.some(x => x < 0)) res.bad.push('a bag without 10 tokens: ' + B);
            const i = pvPick(Math.random(), B); S.pvN++; S.pv[q] = { i, how: 'draw', n: S.pvN }; st = i === 0 ? st + 1 : 0; top = Math.max(top, st); });
          const L = Object.keys(S.pv).filter(q => S.pv[q].i === 3).length; if (mode === 'all') res.lucky[L]++; if (L > 2) res.bad.push('a child with ' + L + ' lucky parts'); if (mode === 'all' && L < 1) res.bad.push('a child who entered every draw with no lucky part'); res.streak = Math.max(res.streak, top); }
        [S.pv, S.pvN, S.parts] = keep; return res; });
      if (k.bad.length) bad.push('the bag: ' + [...new Set(k.bad)].slice(0, 4).join(' | ')); if (k.streak > 2) bad.push('a child drew red ' + k.streak + ' times in a row');
      console.log(`20,000 children who enter every draw: lucky parts 1: ${k.lucky[1]}, 2: ${k.lucky[2]}. Longest run of reds for anyone: ${k.streak}.`);
    }
    const finish = async part => { await p.evaluate(part => { const ts = TASKS.filter(t => t[1] === part); ts.slice(0, 2).forEach(t => { S.done[t[0]] = true; }); taskWon(ts[2][0], 'test', 1, 0, 'Done.'); }, part); await p.waitForTimeout(900); };
    const draw = async (x, part, safe) => { if (x != null) await p.evaluate(x => { Math.random = () => x; }, x); await p.click(safe ? '#pvsafe' : '#pvdraw'); };
    const reveal = async () => { for (let i = 0; i < 80; i++) { if (await p.evaluate(() => { const c = $('pvcard'); return !!c && c.style.display === 'flex'; })) return true; await p.waitForTimeout(100); } return false; };
    // ---- the Engine Core: the choice, "Not yet", My ship, then the lucky draw
    await finish('Engine Core'); expect(await last(), /The Engine Core part is fitted to your ship! Now choose which Engine Core\./, 'the part is fitted');
    const toy = await p.locator('#toy').innerText(); expect(toy, /Your Engine Core is ready[\s\S]*Take the Standard Reactor for sure\. Or enter the LUCKY DRAW!/, 'the choice opens'); await shot('1_choice');
    ok(await p.evaluate(() => [...document.querySelectorAll('#toy p span')].filter(s => s.textContent === '●').length) === 10, 'the bag shows 10 tokens');
    expect(toy, /2 gold tokens: you have no lucky part yet\.[\s\S]*4 green[\s\S]*Standard Reactor[\s\S]*2 red[\s\S]*Neutron Reactor[\s\S]*2 light blue[\s\S]*Quantum Reactor[\s\S]*2 gold[\s\S]*Stellar Reactor/, 'the first bag: one gold token more, and what each colour gives');
    await p.click('#leave'); expect(await last(), /Choose it from My ship/, 'not yet'); await p.evaluate(() => menuOpen('ship')); ok(await p.locator('#partsbox [data-pv="Engine Core"]').count() === 1, 'My ship offers the choice');
    await p.locator('#partsbox [data-pv="Engine Core"]').click(); await p.waitForTimeout(150); ok(await p.locator('#pvdraw').count() === 1, 'the choice opens again from My ship');
    await draw(.05, 'Engine Core'); ok(await p.evaluate(() => S.pv['Engine Core'].i === 3 && JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => /gmq-station/.test(k)) || '{}') || {}) !== null), 'the draw is kept at once');
    if (!calm) { await p.waitForTimeout(1200); ok(await p.evaluate(() => $('pvcard').style.display !== 'flex' && document.querySelectorAll('#pvfx .pvc').length === 4), 'four cards spin first'); ok(await p.evaluate(() => [...document.querySelectorAll('#pvfx .pvc')].every(c => c.lastElementChild.style.visibility === 'hidden')), 'no face shows while the cards spin'); await shot('2_spin'); }
    ok(await reveal(), 'the part is shown'); const big = await p.evaluate(() => [$('pvbig').textContent, +$('pvbig').style.opacity]); ok(big[0] === 'LUCKY DRAW!' && big[1] > .5, 'LUCKY DRAW fills the screen: ' + big);
    expect(await p.locator('#pvcard').innerText(), /Your new Engine Core · The lucky draw[\s\S]*Stellar Reactor[\s\S]*Health points \(HP\): 30\s+Attack points \(AP\): 10/i, 'the part and its numbers'); await shot('3_lucky');
    await p.click('#pvok'); ok(await p.locator('#pvfx').count() === 0, 'the show ends'); expect(await last(), /^LUCKY DRAW! Your Engine Core is fitted: the Stellar Reactor\. 30 health points, 10 attack points\.$/, 'the words');
    expect(await p.evaluate(() => JSON.stringify(S.log[S.log.length - 1])), /Ship part: Engine Core.*entered the lucky draw: Stellar Reactor \(gold\)/, 'the log');
    await p.evaluate(() => { menuOpen('ship'); drawStatus(); }); expect(await p.locator('#partsbox').innerText(), /Stellar Reactor ★: 30 HP, 10 AP/, 'My ship shows the part');
    // ---- the other colours, and the sure choice
    for (const [part, x, i, nm, col] of [['Shield', .2, 2, 'Neutron Wall', 'rgb(127, 211, 255)'], ['Weapons', .4, 0, 'Pulsar Phaser', 'rgb(255, 90, 77)'], ['Power', .7, 1, 'Standard Battery', 'rgb(63, 208, 106)'], ['Navigation', null, 1, 'Standard Navigator', 'rgb(63, 208, 106)']]) {
      await finish(part); await draw(x, part, x == null); ok(await reveal(), `${part}: the part is shown`); const r = await p.evaluate(() => [$('pvcard').innerText, getComputedStyle($('pvcard')).borderTopColor, +$('pvbig').style.opacity]);
      expect(r[0], new RegExp(nm), `${part}: ${nm}`); ok(r[1] === col, `${part}: the colour should be ${col}, not ${r[1]}`); ok(!(r[2] > 0), `${part}: no LUCKY DRAW for a ${['red', 'green', 'blue'][i]} card`); await p.click('#pvok');
      ok(await p.evaluate(([part, i, how]) => S.pv[part].i === i && S.pv[part].how === how, [part, i, x == null ? 'safe' : 'draw']), `${part}: kept`); }
    expect(await p.evaluate(() => JSON.stringify(S.log[S.log.length - 1])), /Ship part: Navigation.*took the Standard Navigator/, 'the sure choice in the log');
    // ---- open the game again in the middle of a show: the part stays what was drawn
    await p.evaluate(() => { delete S.pv.Weapons; save(); }); await p.evaluate(() => pvChoose('Weapons')); await draw(.05, 'Weapons'); await p.waitForTimeout(300); await p.reload(); await p.waitForTimeout(600);
    ok(await p.evaluate(() => S.pv.Weapons && S.pv.Weapons.i === 3 && !document.querySelector('#pvfx')), 'a reload keeps the draw');
    await ctx.close();
  }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The lucky draw: every check passed.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
