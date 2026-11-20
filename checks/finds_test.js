// Finds from a kit: caves and other things a child can come across on a map.  [Source: Marc, 2026-11-20: "things that they could just find in the
// world like a cave to go in and discover something new and they all have like math things involved in them"]
//   THE DATA
//     - the game's own check (fCheck) finds no fault in Chronosia's finds
//     - the check is tried on purpose with broken finds: each fault below must be caught
//     - every lock question is worked out again here, a different way, on 5,000 cadets for each find
//   PLAY, at iPad size and at phone size
//     - a find near the ship is seen on landing; a find in the mist is not known to the game's words
//     - walk to a find by typing, by tapping its square and by tapping its word; the cadet stands beside it, never on a place
//     - a dead end stays a dead end; a wrong answer says no more than "That is not it"; the right answer changes the find for good
//     - a find that waits on another find cannot be seen, typed or tapped until the first one is done
//     - "look" on the map gains a sentence for a find that left a mark (the two newest); cards are given only by finds that say so
//     - the game is closed and opened again: what was done is still done. A game saved before the kit existed still opens.
//   WITH THE READING CARDS ON, as a child has them: one find is done by tapping only.
// Run: node checks/finds_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  const open = async (name, w, h, cards) => { const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(c => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); localStorage.setItem('gmq-cards', c); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-wisps', 'off'); } } catch (e) {} }, cards ? 'on' : 'off');
    await p.goto(FILE); await p.waitForTimeout(300); return p; };
  for (const [name, w, h] of [['ipad', 1180, 745], ['phone', 390, 760]]) {
    const p = await open(name, w, h, false);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const idle = async () => { for (let i = 0; i < 250; i++) { if (await p.evaluate(() => !CM.route.length && !CM.then && PL.to == null && !PL.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return last(); };
    const tapTile = async (x, y) => { await p.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p.waitForTimeout(60); const pt = await p.evaluate(([x, y]) => { const g = cGeo(), r = cv.getBoundingClientRect(); return [r.left + g.ox + (x + .5) * g.ts, r.top + g.oy + (y + .5) * g.ts]; }, [x, y]); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); };
    const at = () => p.evaluate(() => [C().x, C().y]), here = () => p.evaluate(() => [...document.querySelectorAll('#nouns .noun')].map(x => x.textContent));
    const answer = async v => { await p.fill('#ans', String(v)); await p.click('#try'); await p.waitForTimeout(200); };
    const shot = async n => { if (out) { await p.waitForTimeout(500); await p.screenshot({ path: path.join(out, `finds_${name}_${n}.png`) }); } };

    if (name === 'ipad') {      // ---- the data
      const d = await p.evaluate(() => { skipIntro(); goChronosia(); const L = FINDS.chrono, good = fCheck('chrono'), copy = () => JSON.parse(JSON.stringify(L)), rudeWord = ['stupid', 'idiot', 'dumb', 'hate', 'ugly'].find(x => rude(x)) || '';
        const tries = { 'on a place': [l => { l[0].at = [3, 5]; }, /something else is on that square/], 'off the map': [l => { l[0].at = [40, 2]; }, /not on the map/], 'walled in': [l => { l[0].at = [0, 0]; }, /nowhere to stand/], 'on the path': [l => { l[0].at = [4, 3]; }, /something else is on that square/],
          'a word that is taken': [l => { l[0].words.push('tower'); }, /already means something/], 'a word used twice': [l => { l[1].words.push(l[0].words[0]); }, /also used by/], 'a long sentence': [l => { l[0].see = 'This is a very long sentence that goes on and on for far too many words.'; }, /over 10 words/],
          'unkind words': [l => { l[0].see = 'A ' + rudeWord + ' burrow.'; }, /unkind/], 'no such lock': [l => { l[0].lock = { kind: 'magic' }; }, /no lock of kind/], 'a lock with no words': [l => { l[0].lock = { kind: 'less' }; }, /bad question/], 'needs a find that is not there': [l => { l[0].needs = 'nothing'; }, /needs a find that is not there/],
          'a ring of needs': [l => { l[2].needs = 'door'; }, /round in a ring/], 'a card with no lock': [l => { l[1].card = true; }, /only a find with a lock/], 'too many cards': [l => { l.forEach(f => { if (f.lock) f.card = true; }); }, /more than half/], 'an id twice': [l => { l[1].id = l[0].id; }, /used twice/],
          'no drawing': [l => { l[0].kind = 'castle'; }, /no drawing/], 'a dead end that gives': [l => { l[8].tells = 'The stump sings.'; }, /dead end cannot give/], 'a mark that is too long': [l => { l[3].tells = 'A lamp burns far away in the cold north-east hills.'; }, /"tells" must be one sentence/], 'no words after it is done': [l => { delete l[0].done; }, /needs "done"/], 'two on one square': [l => { l[1].at = l[0].at.slice(); }, /shares a square/], 'a share of a standing square': [l => { l[1].at = [9, 12]; }, /shares a standing square/] };
        const missed = []; Object.keys(tries).forEach(k => { const l = copy(); tries[k][0](l); const r = fCheck('chrono', l); if (!r.some(m => tries[k][1].test(m))) missed.push(k + ' -> ' + (r.join('; ') || 'no fault found')); });
        // the locks, worked out again a different way
        const lockBad = [], kinds = {}; let n = 0; L.filter(f => f.lock).forEach(f => { const seen = {}; for (let i = 1; i <= 5000; i++) { const k = fQ('chrono', f, i * 13 + 5), nums = (k.q.replace(/\d+:\d\d/g, ' ').match(/\d+/g) || []).map(Number), tm = (k.q.match(/(\d+):(\d\d)/g) || []).map(t => { const m = t.split(':'); return +m[0] * 60 + +m[1]; }); let want = null; n++; seen[k.q] = 1; kinds[f.lock.kind] = 1;
            if (f.lock.kind === 'times') want = nums[0] * nums[1]; else if (f.lock.kind === 'share') want = nums[0] % nums[1] ? -1 : nums[0] / nums[1]; else if (f.lock.kind === 'mins') want = tm.length === 2 && tm[1] > tm[0] && tm[1] - tm[0] < 60 ? tm[1] - tm[0] : -1;
            else if (f.lock.kind === 'next') want = nums.length === 4 && nums[1] - nums[0] === nums[2] - nums[1] && nums[2] - nums[1] === nums[3] - nums[2] && nums[1] > nums[0] ? nums[3] + nums[3] - nums[2] : -1;
            else if (f.lock.kind === 'round') { const to = /hundred/.test(k.q) ? 100 : 10, lo = nums[0] - nums[0] % to; want = nums[0] !== nums[1] || nums[0] % to === 0 ? -1 : nums[0] - lo >= to / 2 ? lo + to : lo; } else if (f.lock.kind === 'sum') want = nums[0] + nums[1]; else if (f.lock.kind === 'less') want = nums[0] > nums[1] ? nums[0] - nums[1] : -1;
            if (want !== k.a || k.a < 1 || k.a > 999 || k.a !== Math.floor(k.a)) { if (lockBad.length < 6) lockBad.push(`${f.id}: "${k.q}" game says ${k.a}, this test says ${want}`); } }
          if (Object.keys(seen).length < 40) lockBad.push(`${f.id}: only ${Object.keys(seen).length} different questions for 5,000 cadets`); });
        return { good, missed, n: Object.keys(tries).length, lockBad, lockN: n, kinds: Object.keys(kinds).length, finds: L.length, cards: L.filter(f => f.card).length, dead: L.filter(f => !f.lock && !f.open).length, drawn: Object.keys(FDRAW).length, rudeWord }; });
      if (d.good.length) bad.push('the game\'s own check finds faults: ' + d.good.join(' | ')); if (d.missed.length) bad.push('the check missed broken finds: ' + d.missed.join(' | ')); if (d.lockBad.length) bad.push('lock questions: ' + d.lockBad.join(' | ')); if (!d.rudeWord) bad.push('no unkind word to test with');
      console.log(`Chronosia: ${d.finds} finds (${d.cards} give a card, ${d.dead} dead end), ${d.drawn} kinds drawn, ${d.kinds} kinds of lock. The check caught ${d.n - d.missed.length} of ${d.n} broken finds. ${d.lockN.toLocaleString()} lock questions worked out again, ${d.lockBad.length} bad.`);
    } else await p.evaluate(() => { skipIntro(); goChronosia(); });
    await p.waitForTimeout(400); await idle();
    const F = await p.evaluate(() => { const o = {}; FINDS.chrono.forEach(f => { o[f.id] = { at: f.at, stand: fStand('chrono', f), a: f.lock ? fQ('chrono', f).a : null, w: f.words[0], name: f.name, see: f.see, done: f.done, tells: f.tells || '' }; }); return o; });
    // ---- on landing: the burrow is in sight, the cave is not
    ok(await p.evaluate(() => fVis('chrono', FINDS.chrono[0])), 'the burrow should be in sight from the ship'); ok(!(await p.evaluate(() => FINDS.chrono.some(f => f.id !== 'burrow' && f.id !== 'cave' && fVis('chrono', f)))), 'no far find should be in sight on landing');
    ok(!(await here()).includes('small burrow'), 'a find is not a word to tap until the cadet stands beside it'); await shot('1_landing');
    expect(await say('look stump'), /do not see that here/, 'a find in the mist is not known');
    expect(await say('look burrow'), /Two eyes blink/, 'look at a find from far away'); expect(await say('go burrow'), /Two eyes blink/, 'walking to a find tells what you see'); ok(String(await at()) === String(F.burrow.stand), 'the cadet stands beside the burrow, not on it: ' + await at());
    ok((await here()).includes('small burrow'), 'beside a find, its word can be tapped: ' + await here()); expect(await say('hint'), /Try: use burrow/, 'the hint beside a find');
    expect(await say('talk burrow'), /does not answer/, 'talk to a find'); expect(await say('take burrow'), /stays where it is/, 'take a find'); expect(await say('dig burrow'), /You dig a small hole/, 'dig at a find that does not want digging');
    // ---- the lock: a wrong answer, then the right one
    await say('use burrow'); ok(await p.locator('#ans').count() === 1, 'use opens the question'); const qText = await p.locator('#toy').innerText(); expect(qText, /lost some seeds[\s\S]*How many are gone\?/, 'the story, then the question'); await shot('2_question');
    await answer(F.burrow.a + 1); expect(await p.locator('#msg').innerText(), /^That is not it\. Read it again\.$/, 'a wrong answer gets no more than this'); ok(!new RegExp('\\b' + F.burrow.a + '\\b').test(await p.locator('#msg').innerText()), 'a wrong answer must not show the right one');
    const cardsBefore = await p.evaluate(() => (S.cards || []).length); await answer(F.burrow.a); expect(await last(), new RegExp(`You say ${F.burrow.a}\\. The digger nods`), 'the right answer'); ok(!/You earn a card/.test(await last()), 'the burrow gives no card');
    ok(await p.evaluate(() => (S.cards || []).length) === cardsBefore, 'no card for a find that does not say so'); expect(await say('use burrow'), /waves a paw/, 'a find that is done stays done'); expect(await say('look burrow'), /waves a paw/, 'look after it is done');
    expect(await p.evaluate(() => JSON.stringify(S.log[S.log.length - 1])), /Chronosia: the small burrow.*Subtracting within 1,000.*solved on try 2/, 'the teacher\'s log'); await shot('3_done');
    // ---- a find that waits on another: the door is not there until the cave is done
    await p.evaluate(() => { C().seen = new Array(CW * CH).fill('1').join(''); }); expect(await say('look door'), /do not see that here/, 'the door is hidden before the cave'); const before = await at(); await tapTile(16, 0); ok(String(await at()) === String(before) || !/stone door/i.test(await last()), 'tapping the hidden door does nothing with it');
    await tapTile(F.cave.at[0], F.cave.at[1]); ok(String(await at()) === String(F.cave.stand), 'tapping the cave walks beside it: ' + await at()); expect(await last(), /A dark cave in the rock/, 'arriving by tap'); await shot('4_cave');
    await tapTile(F.cave.at[0], F.cave.at[1]); ok(await p.locator('#ans').count() === 1, 'tapping the cave again opens it'); expect(await p.locator('#toy').innerText(), /started at \d+:\d\d\. It stopped at \d+:\d\d\./, 'the cave asks about time');
    await p.evaluate(() => act('go north')); await p.waitForTimeout(150); expect(await last(), /Finish this first/, 'a question holds the cadet'); ok(await p.locator('#ans').count() === 1, 'the question stays open'); await answer(F.cave.a); expect(await last(), /The back wall slides away.*door in the north-east hills/, 'the cave opens');
    expect(await say('look door'), /A stone door in the hillside/, 'the door is there after the cave'); expect(await say('use door'), /./, 'walk to the door'); ok(String(await at()) === String(F.door.stand), 'the cadet stands under the door: ' + await at()); ok(await p.locator('#ans').count() === 1, 'the door asks its question on arrival');
    const c0 = await p.evaluate(() => (S.cards || []).length); await answer(F.door.a); expect(await last(), /An old lamp lights by itself.*You earn a card\.$/, 'the door gives a card'); ok(name !== 'ipad' || await p.evaluate(() => (S.cards || []).length) >= c0, 'the card count does not fall');
    // ---- the mark on the world
    expect(await say('look'), /Mist hides the rest\. A lamp burns in the hills\.$/, 'look on the map tells of the lamp'); ok(!/tortoise sits|arch/.test(await last()), 'only finds that are done leave a mark');
    // ---- a free secret, and a dead end
    expect(await say('use pool'), /one second late/, 'the pool is a free secret'); ok(!/card/.test(await last()), 'the pool gives no card'); ok(String(await at()) === String(F.pool.stand), 'beside the pool');
    expect(await say('use stump'), /There are too many/, 'the stump is a dead end'); expect(await say('use stump'), /There are too many/, 'and it stays one'); expect(await say('look stump'), /many rings/, 'look at the dead end'); ok(!(await p.evaluate(() => !!C().fk.stump)), 'a dead end is never marked done');
    // ---- the other four, each by its word in the Here row or by typing
    for (const id of ['stone', 'hollow', 'nest', 'arch']) { await say('go ' + F[id].w); ok(String(await at()) === String(F[id].stand), `beside the ${F[id].name}: ` + await at()); ok((await here()).includes(F[id].name), `the ${F[id].name} is a word to tap`);
      await say('use ' + F[id].w); ok(await p.locator('#ans').count() === 1, `the ${F[id].name} asks`); await answer(F[id].a); ok(await p.locator('#ans').count() === 0, `the ${F[id].name} takes its right answer`); expect(await say('look ' + F[id].w), new RegExp(F[id].done.slice(0, 18).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `the ${F[id].name} is changed`); }
    expect(await say('look'), /Mist hides the rest\. A baby tortoise sits by its nest\. A white arch stands again\.$/, 'the two newest marks on the world'); await shot('5_all_done');
    // ---- nothing here stopped the planet's own things
    expect(await say('go to tower'), /Clock Tower/, 'the places still work'); await say('leave'); expect(await say('taste fruit'), /TimeTweak/, 'the fruit still works'); await say('go east'); ok(true, '');
    // ---- close the game and open it again
    await p.reload(); await p.waitForTimeout(500); ok(await p.evaluate(() => S.mode === 'chrono' && Object.keys(C().fk).sort().join() === 'arch,burrow,cave,door,hollow,nest,pool,stone'), 'what was done is still done after the game is opened again: ' + await p.evaluate(() => Object.keys((S.c || {}).fk || {}).join()));
    expect(await say('look door'), /stands open/, 'the door is still open');
    // ---- a game saved before the kit existed
    await p.evaluate(() => { delete S.c.fk; delete S.c.ft; save(); }); await p.reload(); await p.waitForTimeout(500); expect(await say('look burrow'), /Two eyes blink/, 'an old saved game opens, with every find new'); ok(!errs.length, 'no script error');
    await p.context().close();
  }
  { // ---- as a child has it: reading cards on, taps only
    const name = 'cards-on', p = await open(name, 1180, 745, true); await p.evaluate(() => { skipIntro(); goChronosia(); }); await p.waitForTimeout(400);
    const read = async () => { for (let i = 0; i < 12; i++) { if (!(await p.evaluate(() => READ.open))) return; const dis = await p.locator('#cardok').isDisabled().catch(() => true); if (!dis) await p.locator('#cardok').tap().catch(() => {}); await p.waitForTimeout(500); } bad.push(name + ': a reading card would not close'); };
    const idle = async () => { for (let i = 0; i < 250; i++) { if (await p.evaluate(() => !CM.route.length && !CM.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const tapTile = async (x, y) => { const pt = await p.evaluate(([x, y]) => { const g = cGeo(), r = cv.getBoundingClientRect(); return [r.left + g.ox + (x + .5) * g.ts, r.top + g.oy + (y + .5) * g.ts]; }, [x, y]); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(200); };
    await read(); await tapTile(10, 11); await idle(); await p.waitForTimeout(300); if (!/Two eyes blink/.test(await p.evaluate(() => lines.map(l => l.text || '').join(' ')))) bad.push(name + ': tapping the burrow should walk there and say what is seen'); await read();
    await tapTile(10, 11); await p.waitForTimeout(400); if (await p.locator('#ans').count() !== 1) bad.push(name + ': tapping the burrow again should open its question'); else { const a = await p.evaluate(() => fQ('chrono', FINDS.chrono[0]).a); await p.fill('#ans', String(a)); await p.click('#try'); await p.waitForTimeout(300); if (!(await p.evaluate(() => !!C().fk.burrow))) bad.push(name + ': the burrow should be done'); }
    if (out) { await p.waitForTimeout(400); await p.screenshot({ path: path.join(out, 'finds_cards_on.png') }); } await p.context().close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'Finds from a kit: every check passed.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
