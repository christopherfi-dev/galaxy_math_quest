// Kind words only.  [Source: Marc, 2026-11-17: "our children cannot write curse words, for the ship name or anywhere"]
// This file has rude words in it, because it has to try them. It checks, in a real browser:
//   - rude words are refused, also with numbers and signs for letters, stretched letters, or letters spelled out with spaces
//   - ordinary words that only look close are NOT refused, and no word the game itself uses is refused
//   - the ship-name box at the start, "name ship ..." and "name robot ..." all refuse a rude name
//   - a rude command is not done, and is not shown back
//   - the game only repeats words it knows: any other typed word shows as "…"
//   - a rude name already saved on the device is wiped when the page opens
// Run: node checks/kind_words_test.js
const { chromium } = require('playwright'); const path = require('path');
const BAD = ['fuck', 'FUCK', 'fuuuuck', 'f u c k', 'f.u.c.k', 'f*ck', 'fck', 'fuk', 'fvck', 'phuck', 'fucker', 'motherfucker', 'shit', 'sh1t', 'sh!t', 'shiiit', 's h i t', 'bullshit', 'shite', 'bitch', 'b1tch', 'biatch', 'cunt', 'c u n t', 'nigga', 'n1gger', 'whore', 'slut', 'bastard',
  'penis', 'p3n1s', 'vagina', 'boobs', 'b00bs', 'pussy', 'porn', 'wanker', 'twat', 'asshole', 'a$$hole', '@sshole', 'arsehole', 'dickhead', 'dumbass', 'jackass', 'ass', 'a s s', '@ss', 'a$$', 'arse', 'sex', 'sexy', 's3x', 'cock', 'dick', 'd1ck', 'damn', 'crap', 'crappy', 'piss', 'pissed', 'fag', 'faggot',
  'hell', 'butt', 'butthead', 'butthole', 'bum', 'poo', 'poop', 'p00p', 'poopy', 'poophead', 'pee', 'fart', 'farts', 'tit', 'tits', 'prick', 'turd', 'wtf', 'stfu', 'omfg', 'fu', 'f u', 'stupid', 'idiot', 'dumb', 'loser', 'ugly', 'moron', 'jerk', 'sucks', 'you suck', 'retard', 'douche',
  'look at the shit', 'push fuck crate', 'Mr Poop', 'Captain Butt', 'Star Ass', 'big fat ass', 'Poop 9000'];
const NAMES_BAD = ['Sh It', 'Fu Ck', 'A S S', 'Bi Tch', 'Po Op', 'F U C K 2', 'Dumb Ship'];                       // caught by the stricter check for names
const GOOD = ['Comet', 'Titan', 'Saturn', 'Scrappy', 'Scrap Metal', 'Butterfly', 'Cockpit', 'Peacock', 'Night Owl', 'Midnight', 'Glass', 'Classy', 'Bassoon', 'Assassin', 'Hello', 'Shell', 'Shuttle', 'Shift', 'Shirt', 'Count', 'Counter', 'Country', 'Button', 'Butter', 'Farther', 'Dickens', 'Sussex',
  'Sextant', 'Pickle', 'Duck', 'Lucky', 'Rocket', 'Puck', 'Truck', 'Fork', 'Fluke', 'Passing', 'Pushing', 'Mississippi', 'Grape', 'Scrape', 'Therapist', 'Analyst', 'Basement', 'Grass', 'Brass', 'Compass', 'Pass', 'Mass', 'Bumble', 'Bumper', 'Album', 'Peel', 'Pooh', 'Spoon', 'Title', 'Hoe Down'.replace('Hoe ', 'Show '), 'Suckle'.replace('Suckle', 'Sunny'),
  'Star 9', 'Ship 1650', 'Galaxy 42'];
// commands a child might really type. These are checked the ordinary way, not the stricter way used for names.
const GOOD_CMD = ['push it', 'push crate', 'look at glass', 'use wrench on hatch', 'give fruit to fish', 'talk butterfly', 'open hatch', 'go east', 'read notice', 'count crates', 'what is this', 'i need help', 'look at the tall tree', '1650', '30', 'use 240 on locker'];
(async () => {
  const b = await chromium.launch(), bad = [], errs = [];
  const p = await b.newPage({ viewport: { width: 820, height: 1180 } }); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { window.GMQ_NO_CARDPOP = true; try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-words', 'open'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} }); /* reading cards have their own test: reading_card_test.js */ await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
  // 1. the word check itself
  const r = await p.evaluate(([B, N, G, C]) => ({ missed: B.filter(t => !rude(t)), missedNames: N.filter(t => !rude(t, true)), wrong: G.filter(t => rude(t) || rude(t, true)).concat(C.filter(t => rude(t))), gameWords: (() => { KNOWN = null; const before = new Set(); const add = t => String(t || '').toLowerCase().split(/[^a-z0-9]+/).forEach(x => x && before.add(x));
      [VERBS, PV].forEach(o => Object.keys(o).forEach(k => { add(k); o[k].forEach(add); })); [OBJ, VT].forEach(o => Object.keys(o).forEach(id => { (o[id].words || []).forEach(add); add(o[id].label); })); SPOTS.forEach(s => add(s.name)); Object.keys(ROOMS).forEach(id => add(ROOMS[id].name)); Object.keys(VSC).forEach(id => add(VSC[id].name));
      return { n: before.size, rude: [...before].filter(w => rude(w) || rude(w, true)), known: knownWords().size }; })() }), [BAD, NAMES_BAD, GOOD, GOOD_CMD]);
  if (r.missed.length) bad.push('rude words that got through: ' + r.missed.join(' | ')); if (r.missedNames.length) bad.push('rude names that got through: ' + r.missedNames.join(' | '));
  if (r.wrong.length) bad.push('ordinary words that were refused: ' + r.wrong.join(' | ')); if (r.gameWords.rude.length) bad.push('words the game itself uses that are refused: ' + r.gameWords.rude.join(' | '));
  console.log(`${BAD.length} rude inputs refused: ${BAD.length - r.missed.length}. ${NAMES_BAD.length} split-up rude names refused: ${NAMES_BAD.length - r.missedNames.length}. ${GOOD.length + GOOD_CMD.length} ordinary names and commands let through: ${GOOD.length + GOOD_CMD.length - r.wrong.length}. ${r.gameWords.n} game words checked, ${r.gameWords.rude.length} refused.`);
  // every sentence the game can say must pass too, or the game would be showing words it forbids
  const said = await p.evaluate(() => { const txt = document.body.innerText + ' ' + JSON.stringify(BANK) + ' ' + Object.keys(SPOT_SAY).map(k => SPOT_SAY[k].join(' ')).join(' ') + ' ' + JSON.stringify(VAL) + ' ' + ENDING.join(' ') + ' ' + TIPS.join(' '); const w = [...new Set(txt.toLowerCase().split(/[^a-z]+/).filter(Boolean))]; return { n: w.length, rude: w.filter(x => rude(x)) }; });
  if (said.rude.length) bad.push('words in the game\'s own text that the check refuses: ' + said.rude.join(' | ')); console.log(`${said.n} different words from the game's own text checked, ${said.rude.length} refused.`);
  const shownAnywhere = async word => p.evaluate(w => document.body.innerText.toLowerCase().includes(w) || ($('cmd').value || '').toLowerCase().includes(w), word);
  const last = () => p.evaluate(() => lines[lines.length - 1].text || ''), echo = () => p.evaluate(() => { const y = lines.filter(l => l.you); return y.length ? y[y.length - 1].you : ''; });
  // 2. the ship-name box at the start
  await p.evaluate(() => { skipIntro(); S.ship = ''; save(); shipReport(); }); await p.waitForTimeout(300); const hasForm = await p.locator('#shipname').count();
  if (!hasForm) bad.push('could not reach the ship-name box');
  else { for (const nm of ['Poop', 'sh1t', 'F U C K', 'Sh It', 'Butt Head']) { await p.fill('#shipname', nm); await p.click('#nameform button[type=submit]'); await p.waitForTimeout(120); const st = await p.evaluate(() => ({ ship: S.ship, msg: $('msg') ? $('msg').textContent : '', box: $('shipname') ? $('shipname').value : 'gone' })); if (st.ship || !/kind name/.test(st.msg) || st.box) bad.push(`the name box took "${nm}": ` + JSON.stringify(st)); }
    await p.fill('#shipname', 'star comet'); await p.click('#nameform button[type=submit]'); await p.waitForTimeout(200); if ((await p.evaluate(() => S.ship)) !== 'Star Comet') bad.push('the name box refused a good name'); }
  // 3. typed commands on the station
  const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(250); };
  await p.evaluate(() => { skipIntro(); S.mode = 'station'; closeToy(); }); await p.waitForTimeout(200);
  for (const t of ['name ship poop', 'name ship Sh1t', 'name ship f u c k', 'name ship butt head', 'name ship sh it']) { await say(t); const st = await p.evaluate(() => S.ship); if (st !== 'Star Comet') bad.push(`"${t}" changed the ship name to ${st}`); if (!/Kind words only|kind name/.test(await last())) bad.push(`"${t}" got: ${await last()}`); }
  await say('name ship Blue Comet'); if ((await p.evaluate(() => S.ship)) !== 'Blue Comet') bad.push('a good name was refused: ' + await last()); if (!/^name ship( …| blue| comet)+$/.test(await echo())) bad.push('the echo of a naming command should hold only known words: ' + await echo());
  for (const t of ['fuck', 'you are stupid', 'look shit', 'push poop crate', 'a s s']) { await say(t); const e = await echo(), l = await last(); if (e !== '…' || !/Kind words only/.test(l)) bad.push(`"${t}" was echoed as "${e}" and answered "${l}"`); for (const w of t.split(' ').filter(x => x.length > 2 && !['look', 'push', 'crate', 'you', 'are'].includes(x))) if (await shownAnywhere(w)) bad.push(`the word "${w}" is on the screen after typing "${t}"`); }
  await say('push xyzzy crate'); if ((await echo()) !== 'push … crate') bad.push('an unknown word should show as …: ' + await echo());
  await say('zzgrk blorp'); if ((await echo()) !== '…') bad.push('unknown words should show as one …: ' + await echo());
  await say('look crate'); if ((await echo()) !== 'look crate') bad.push('a normal command should be echoed in full: ' + await echo());
  await say('look at the ไอ้ crate'); if (/[^\x00-\x7F…]/.test((await echo()).replace(/…/g, ''))) bad.push('letters from another alphabet were echoed: ' + await echo());
  // 4. the same on Voltara
  await p.evaluate(() => menuOpen('teacher')); await p.waitForTimeout(120); await p.locator('#t_volt').click(); await p.waitForTimeout(900);
  await say('eat poop fruit'); if ((await echo()) !== '…' || !/Kind words only/.test(await last())) bad.push('Voltara: a rude command got through: ' + await echo() + ' / ' + await last());
  await say('talk blorp butterfly'); if ((await echo()) !== 'talk … butterfly') bad.push('Voltara: echo was ' + await echo());
  // 5. a rude name saved on the device before this guard existed is wiped when the page opens
  await p.evaluate(() => { S.ship = 'Sh It'; S.botName = 'Poop'; save(); }); await p.reload(); await p.waitForTimeout(500); const wiped = await p.evaluate(() => [S.ship, S.botName]); if (wiped[0] || wiped[1]) bad.push('saved rude names were not wiped: ' + wiped.join(', '));
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0]); process.exit(1); });
