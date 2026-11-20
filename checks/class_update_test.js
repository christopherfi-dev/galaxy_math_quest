// Before the class link is updated: games in progress must survive.   [Proposal]
//
// Marc's students play the class copy (docs/index.html). Their games are saved in the browser, under one web address.
// When the class link is updated, the page behind that address is swapped for the preview copy (docs/next/index.html),
// and each child's next load opens an old saved game in the new page.
// This test does exactly that, ten times: a small web server serves the class copy at one address, a game is put into
// one of ten states (station, a task open, cards and credits earned, Voltara, space, two galaxies, Chronosia fresh,
// Chronosia in the middle of every quest, Chronosia with quests done), the server swaps to the preview copy, and the page reloads.
// It checks: the new version is showing; the cadet is in the same place; cards, credits and finished quests are unchanged;
// looking and asking for a hint work; quests that changed shape between versions still open; new places are offered and can be entered;
// nothing is lost on a second reload; the page reports no error.
//
// Run it BEFORE copying docs/next/index.html over docs/index.html. After the copy the two files are the same and the test proves little.
// Run:  node checks/class_update_test.js [class copy] [new copy]
// Needs Node with Playwright and Chromium. It starts its own server on this machine and touches nothing else.
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs'), http = require('http');
const OLD = fs.readFileSync(path.resolve(process.argv[2] || path.join(__dirname, '..', 'docs', 'index.html'))), NEW = fs.readFileSync(path.resolve(process.argv[3] || path.join(__dirname, '..', 'docs', 'next', 'index.html'))); let serving = OLD;
const verOf = buf => (String(buf).match(/id="t_ver">([^<]*)</) || [0, '?'])[1], VOLD = verOf(OLD), VNEW = verOf(NEW);
(async () => { const srv = http.createServer((q, r) => { r.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); r.end(serving); }); await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const URL = `http://127.0.0.1:${srv.address().port}/galaxy_math_quest/`;
  const b = await chromium.launch(), bad = [], notes = [];
  const makers = {
    'station, a few moves in': async p => { await p.evaluate(() => { skipIntro(); }); await p.waitForTimeout(300); await p.evaluate(() => { act('look'); act('north'); }); await p.waitForTimeout(1500); },
    'station, a task open': async p => { await p.evaluate(() => { skipIntro(); startBattle(); }); await p.waitForTimeout(500); },
    'station, parts and cards earned': async p => { await p.evaluate(() => { skipIntro(); S.cards.push({ r: 'common', n: 'Laser Cannon' }, { r: 'rare', n: 'Void Vortex' }, { r: 'gold', n: 'Nebula Nova' }); S.q4 = 7; save(); }); await p.waitForTimeout(300); },
    'Voltara': async p => { await p.evaluate(() => { skipIntro(); goVoltara(); }); await p.waitForTimeout(800); await p.evaluate(() => { act('look'); }); },
    'space': async p => { await p.evaluate(() => { skipIntro(); goSpace(); }); await p.waitForTimeout(800); },
    'space, in Galaxy Metrica': async p => { await p.evaluate(() => { skipIntro(); goSpace(); S.at = 'metrica'; SP.to = null; save(); }); await p.waitForTimeout(500); },
    'space, in Galaxy Databa': async p => { await p.evaluate(() => { skipIntro(); goSpace(); S.at = 'databa'; SP.to = null; save(); }); await p.waitForTimeout(500); },
    'Chronosia, just landed': async p => { await p.evaluate(() => { skipIntro(); goChronosia(); }); await p.waitForTimeout(800); },
    'Chronosia, in the middle of every step quest': async p => { await p.evaluate(() => { skipIntro(); goChronosia(); const c = C(); c.seen = new Array(400).fill('1').join(''); Object.keys(CQ).forEach((q, i) => { c.prog[q] = 1 + (i % 2); }); c.miss = { clocks: 2, match: 1 }; save(); }); await p.waitForTimeout(500); },
    'Chronosia, two quests done': async p => { await p.evaluate(() => { skipIntro(); goChronosia(); const c = C(), ks = Object.keys(CQ); c.done[ks[0]] = true; c.done[ks[1]] = true; save(); }); await p.waitForTimeout(500); },
  };
  for (const name of Object.keys(makers)) { serving = OLD; const ctx = await b.newContext({ viewport: { width: 1180, height: 745 }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    try { await p.goto(URL); await p.waitForTimeout(600); await p.evaluate(() => { try { localStorage.setItem('gmq-cards', 'off'); } catch (e) {} }); await makers[name](p);
      const before = await p.evaluate(() => { save(); return { ver: $('t_ver').textContent, mode: S.mode, room: S.room, cards: S.cards.length, q4: S.q4 || 0, cdone: S.c ? Object.keys(S.c.done).length : 0, stored: !!localStorage.getItem(KEY) }; }); if (before.ver !== VOLD || !before.stored) bad.push(`"${name}": the old game was not "${VOLD}" or was not stored (${before.ver})`);
      serving = NEW; await p.reload(); await p.waitForTimeout(900);
      const after = await p.evaluate(() => ({ ver: $('t_ver').textContent, mode: S.mode, room: S.room, cards: S.cards.length, q4: S.q4 || 0, cdone: S.c ? Object.keys(S.c.done).length : 0, place: $('place').textContent })); if (after.ver !== VNEW) bad.push(`"${name}": the new page is not "${VNEW}" (${after.ver})`);
      for (const k of ['mode', 'room', 'cards', 'q4', 'cdone']) if (before[k] !== after[k]) bad.push(`"${name}": ${k} was ${before[k]}, is ${after[k]} after the update`);
      await p.evaluate(() => { act('look'); }); await p.waitForTimeout(500); await p.evaluate(() => { act('hint'); }); await p.waitForTimeout(400);
      if (after.mode === 'chrono') { const open = await p.evaluate(() => ({ clocks: !C().done.clocks, match: !C().done.match, plan: !C().done.plan })); for (const [f, q] of [['startClocks', 'clocks'], ['startMatch', 'match'], ['startDay', 'plan']]) { if (!open[q]) continue; await p.evaluate(f => { closeToy(); (0, eval)(f + '()'); }, f); await p.waitForTimeout(500); if (!(await p.evaluate(() => !!widget && !$('toy').hidden))) bad.push(`"${name}": ${f} did not open`); const tr = await p.$('#try'); if (tr) { await tr.click(); await p.waitForTimeout(300); } await p.evaluate(() => closeToy()); } }
      if (after.mode === 'space') { const here = await p.evaluate(() => hereWords().map(x => x[0]).join(',')); if (/Metrica/.test(name)) { if (!/land xylophora/.test(here)) bad.push(`"${name}": Xylophora is not offered: ${here}`); await p.evaluate(() => act('land xylophora')); await p.waitForTimeout(900); if ((await p.evaluate(() => S.mode)) !== 'xylo') bad.push(`"${name}": could not land on Xylophora`); }
        if (/Databa/.test(name)) { if (!/dock/.test(here)) bad.push(`"${name}": the mission ship is not offered: ${here}`); await p.evaluate(() => act('dock')); await p.waitForTimeout(900); if ((await p.evaluate(() => S.mode)) !== 'star') bad.push(`"${name}": could not dock`); await p.evaluate(() => act('look')); await p.waitForTimeout(400); } }
      await p.evaluate(() => { menuOpen('ship'); }); await p.waitForTimeout(300); await p.evaluate(() => { menuOpen('cards'); }); await p.waitForTimeout(300);
      const mid = await p.evaluate(() => { save(); return { mode: S.mode, cards: S.cards.length }; }); await p.reload(); await p.waitForTimeout(800); const again = await p.evaluate(() => ({ mode: S.mode, cards: S.cards.length })); if (mid.mode !== again.mode || mid.cards !== again.cards) bad.push(`"${name}": after a second reload the game was ${again.mode} with ${again.cards} cards, not ${mid.mode} with ${mid.cards}`);
      notes.push(`${name}: ${before.ver} -> ${after.ver}, still at ${after.place} (${after.mode}); ${after.cards} cards, ${after.q4} quarter credits, ${after.cdone} Chronosia quests done; kept after another reload`);
    } catch (e) { bad.push(`"${name}": stopped: ${String(e.message).split('\n')[0]}`); }
    if (errs.length) bad.push(`"${name}": errors on the page: ${errs.slice(0, 3).join(' | ')}`); await ctx.close(); }
  await b.close(); srv.close(); console.log(`class copy: ${VOLD}. new copy: ${VNEW}.${OLD.equals(NEW) ? ' The two files are the same, so this run proves little.' : ''}`); notes.forEach(x => console.log(x)); if (bad.length) { console.log('\nFAILED:'); bad.forEach(x => console.log('  ' + x)); }
  console.log(bad.length ? 'RESULT: FAIL' : 'RESULT: PASS'); process.exit(bad.length ? 1 : 0); })().catch(e => { console.error('FAILED', String(e.message).split('\n')[0]); process.exit(1); });
