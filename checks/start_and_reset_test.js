// Starting the game, and the reset of 23 November (version 93).
// [Source: Marc, 2026-11-23: "There's just that little pop-up that shows up, but it still runs"; "I need a link that resets everything so all students
//  get the brand new version. All their previous progress should be erased right now."]
//   1. A normal start: the start-up message never shows, even for a moment, in the first 11 seconds.
//   2. No JavaScript at all: the noscript words say the code is blocked.
//   3. The game's code is cut off (as on a page that did not finish loading): after 10 seconds the message shows, and says so.
//   4. The reset: a game saved in the class copy (version 81, under the old save key) is erased when the new version opens. The cadet starts fresh.
//      Settings kept apart from the save (reading cards on or off, music) are not touched.
// Run: node checks/start_and_reset_test.js [old copy, default docs/index.html] [new copy, default prototypes/kis_station_sketch.html]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs'); const os = require('os');
(async () => {
  const OLD = path.resolve(process.argv[2] || path.join(__dirname, '..', 'docs', 'index.html')), NEW = path.resolve(process.argv[3] || path.join(__dirname, '..', 'prototypes', 'kis_station_sketch.html'));
  const b = await chromium.launch(), bad = [], ok = (c, what) => { if (!c) bad.push(what); };
  // 1. a normal start
  { const p = await b.newPage(); let seen = false; await p.goto('file://' + NEW); for (let i = 0; i < 22; i++) { if (await p.isVisible('#toold')) seen = true; await p.waitForTimeout(500); }
    ok(!seen, 'the start-up message showed during a normal start'); ok(await p.evaluate(() => window.GMQ_RAN === true), 'the game should have started'); await p.close(); }
  // 2. no JavaScript
  { const c = await b.newContext({ javaScriptEnabled: false }), p = await c.newPage(); await p.goto('file://' + NEW); const t = await p.textContent('body');
    ok(/JavaScript is turned off or blocked on this device/.test(t), 'with no JavaScript, the noscript words should show'); ok(!(await p.isVisible('#toold')), 'with no JavaScript, the other message stays hidden'); await c.close(); }
  // 3. code cut off
  { const h = fs.readFileSync(NEW, 'utf8'), i = h.lastIndexOf('</script>'), tmp = path.join(os.tmpdir(), 'gmq_cut_' + process.pid + '.html'); fs.writeFileSync(tmp, h.slice(0, i - 200000) + h.slice(i));
    const p = await b.newPage(); await p.goto('file://' + tmp); await p.waitForTimeout(3000); ok(!(await p.isVisible('#toold')), 'a cut-off page should wait before it says anything'); await p.waitForTimeout(8000);
    ok(await p.isVisible('#toold'), 'a cut-off page should show the message after 10 seconds'); ok(/did not finish loading/.test(await p.textContent('#toold')), 'the message should say the code did not finish loading'); await p.close(); fs.unlinkSync(tmp); }
  // 4. the reset
  { const c = await b.newContext(), p = await c.newPage(); await p.goto('file://' + OLD); await p.waitForTimeout(500);
    const before = await p.evaluate(() => { skipIntro(); S.secrets = ['locker']; S.cards = [{ r: 'common', n: 'Laser Cannon' }]; save(); localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-music', 'on'); return { key: KEY, has: !!localStorage.getItem(KEY) }; });
    ok(before.key === 'gmq-station-sketch-v5' && before.has, 'the old copy should save under the old key');
    await p.goto('file://' + NEW); await p.waitForTimeout(800);
    const after = await p.evaluate(() => ({ key: KEY, old: localStorage.getItem('gmq-station-sketch-v5'), oldS: sessionStorage.getItem('gmq-station-sketch-v5'), cards: S.cards.length, secrets: S.secrets.length, mode: S.mode, cardsSetting: localStorage.getItem('gmq-cards'), music: localStorage.getItem('gmq-music') }));
    ok(after.key === 'gmq-station-sketch-v6', 'the new copy should save under the new key'); ok(after.old === null && after.oldS === null, 'the old save should be erased'); ok(after.cards === 0 && after.secrets === 0, 'the cadet should start fresh: ' + JSON.stringify(after));
    ok(after.cardsSetting === 'off' && after.music === 'on', 'settings apart from the save should be kept'); console.log('after the reset:', JSON.stringify(after)); await c.close(); }
  await b.close();
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'Start and reset: every check passed.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
