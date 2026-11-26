# Wiring the cards into the game

**Date:** 26 November 2026. **From:** the cards thread. **For:** the main thread.
**What:** how to put the card pop-up and the card book (`docs/cards/index.html`) into the game.
Everything here is **[Proposal]**. My choices without Marc are marked **[pick]**.
**Wait for Marc** on decisions 1, 2, 3 and 5 in the report (`GMQ_Cards_Report_v1_2026-11-26.md`, section 7) before you wire the parts they touch. The piece works with every option.

---

## 1. What you are wiring in

- **One piece of code, `GMQCards`,** between two marked lines in `docs/cards/index.html`:
  - `/* ===== GMQ CARDS: start =====`
  - `/* ===== GMQ CARDS: end ===== */`
- **The card list:** the battle thread's `docs/battle/cards.json` (93 battle cards, 20 ship parts, 5 upgrades, and its starter pack rule). The page holds a copy in `<script id="gmqc-list">` (`window.GMQC_LIST = {...};`). **The game should hold the list once.** If the battle piece (`GMQBattleOwn`) is in the game, use `GMQCards.use(GMQBattleOwn.cardList())` and do not copy the list again. If not, copy the page's list script.
- Copy both, as they are, into the game's script. Do not copy the page's third script: it is a stand-in for the game.
- The block uses no optional chaining and no nullish operator. Its comments do not even write their two signs, so `checks/parse_check.js` passes.
- The block puts its own small style sheet in the page when it is first used (`#gmqc-style`). Every class it uses starts with `gmqc-`.

## 2. What the piece needs from the game

One object, made once, and the list read once at start-up:

```js
GMQCards.use(typeof GMQBattleOwn !== 'undefined' ? GMQBattleOwn.cardList() : window.GMQC_LIST);
const CARDS_HOST = {
  stage: () => document.querySelector('.stage'),   // the picture: the piece adds its own layer in it
  toy: h => toy(h), closeToy: () => closeToy(),   // the desk: the piece puts only buttons there
  save: () => save(), beep: (f, d, t) => beep(f, d, t), speak: t => speak(t),
  cards: () => S.cards,
  get calm() { return calm; }                      // no motion: the card is shown at once
};
```

- **The layer** goes first in `.stage`, at `z-index: 6`. So it covers the canvas, the place name (5) and `#stageview` (4). The reading card `#card` (also 6, later in the page) stays above it: a message is never hidden. The fly-in canvas (7) stays above too.
- **The desk:** the piece calls `toy()` with its buttons inside `<div id="gmqc-desk">`. If anything else takes the desk (another `toy()`, or `closeToy()`), the piece notices within 0.6 seconds, leaves the picture, and calls `done('gone')`. The card stays waiting (`unseen`) and can be shown again.
- **done(why)** is called once: `'added'` (Add to my cards), `'closed'` (Close my cards), `'ok'` (a card that left), or `'gone'`.

## 3. The changes, in order

### 3.1 A card is earned: `card(force, why)`

Today `card(force)` pushes `{ r, n }`. The new one keeps `r` and `n` (so `drawCards`, `menuCounts` and old code still work) and adds the card's id and why:

```js
function card(force, why) {
  setTimeout(drawStatus, 0); let r = force; if (!r) { let x = rnd(100); for (const [k, w] of ODDS) { if (x < w) { r = k; break; } x -= w; } }
  const c = GMQCards.record(GMQCards.pick(rnd(2147483647), r, S.cards), why || cardWhy());
  S.cards.push(c); save(); drawCards(S.cards.length - 1); cardsSoon();
}
```

- `record` gives `{ id, r, n, why, unseen: 1 }`. `r` is the game's own word: `'gold'` for epic.
- The card is **saved at once**, marked `unseen`. If the child closes the game before Add, the card is safe and shows again.
- `ODDS` stays the game's (70, 25, 5). `DECK` is no longer used for new cards.

### 3.2 When the card shows: `cardsSoon()`

The card waits until the reading card is closed and no task is open, as `pvSoon` does:

```js
function cardsSoon() { if (window.GMQ_NO_CARDPOP) return; let n = 0; const tm = setInterval(() => {
    if (++n > 900) return clearInterval(tm); if (GMQCards.isOpen()) return; const c = GMQCards.unseen(S.cards)[0]; if (!c) return clearInterval(tm);
    if (READ.open || widget || FLY) return; clearInterval(tm); widget = { kind: 'cards' };
    GMQCards.show(CARDS_HOST, c, c.why, why => { if (widget && widget.kind === 'cards') widget = null; drawCards(); drawStatus(); if (GMQCards.unseen(S.cards).length) cardsSoon(); });
  }, 400); }
```

- Call `cardsSoon()` once at start-up too: a card left waiting shows when the game opens.
- `widget = { kind: 'cards' }` tells the rest of the game a task is open (taps, `pvSoon`, the hazards).
- **`window.GMQ_NO_CARDPOP`:** for the play tests that play the station or tap the picture, as `GMQ_NO_PV`. Without it, a card would cover the picture after each task and those tests would tap the card.
- **Order with "Choose your part"** (`pvSoon`): both wait for `!widget`. Whichever comes first opens; the other waits. **[pick]** Leave it so. If the card should always come first, start `pvSoon`'s check with `if (GMQCards.unseen(S.cards).length) return;`.

### 3.3 The station's 15 cards: the starter pack

[Source: Marc, 23 November: 15 cards on the KIS Station, always with 1 Spy, 1 Policeman, 1 epic and 1 rare.] The rule is the battle thread's (`starter_pack` in `cards.json`): the Spy, the Policeman, an epic, a rare, 4 attack, 4 shield, 3 repair. The piece draws a child's pack with the battle thread's own code (its STARTER block, copied as it is), so **the cards the station gives are exactly the pack the battle lends from.**

**One seed that never changes.** `S.seed` changes every time the game calls `rnd()`. A pack drawn from `S.seed` would be a different pack each time. So keep one more number in the save, once, and give it to both pieces:

```js
if (!S.packSeed) S.packSeed = rnd(2147483646) + 1;      // once; old saves get it the first time they open
```

The battle's wiring note (`GMQ_Card_Battle_Wiring_v1_2026-11-26.md`, section 2 `opts.seed`, section 3 steps 4 and 5) passes `S.seed`. **Pass `S.packSeed` there too,** or the battle lends from a different pack than the one the child was given.

Two places give a station task's card: `taskWon` (line 860) and `win()` (line 1696). In both, replace `card()` with `stationCard(id)`:

```js
const BAY = { Shield: 'Shield Bay', 'Engine Core': 'Engine Bay', Weapons: 'Weapons Bay', Navigation: 'Navigation Bay', Power: 'Power Bay' };
function stationCard(id) { const t = TASKS.find(x => x[0] === id), why = `For the ${t[2]} task, in the ${BAY[t[1]]}.`;
  const c = GMQCards.record(GMQCards.starterNext(rnd(2147483647), S.cards, 15 - tasksDone() + 1, S.packSeed), why, { st: 1 });
  S.cards.push(c); save(); drawCards(S.cards.length - 1); cardsSoon(); }
```

- `taskDone` has already marked this task done when the card is given, so the tasks left, this one included, are `15 - tasksDone() + 1`.
- `{ st: 1 }` marks a station card. The piece deals the pack's cards not yet dealt, in a random order. Secrets found between tasks do not change the pack.
- **A child part-way through the station** when this arrives (an old save) has fewer tasks left than the pack has cards. The piece then deals the sure cards first when there is no other way to give them all.
- **If Marc picks "one pack after the last task"** (report, decision 1, option B): give no card in `taskWon` and `win()`. When `tasksDone()` reaches 15: `const ids = GMQCards.starterPack(S.packSeed)`, push `GMQCards.record(id, why, { st: 1 })` for each, save, and `GMQCards.showPack(CARDS_HOST, recs, 'Your starter pack: 15 cards from the KIS Station', done)`.

### 3.4 Why each card was given

Every `card()` call should pass its why. Where one is missing, `cardWhy()` makes one from what the game has just logged:

```js
function cardWhy() { const l = S.log[S.log.length - 1]; return l && l.what ? `For ${l.what}.` : 'For your work.'; }
```

Better words, place by place **[pick]** (line numbers are version 100's):

| Line | Where | Why words |
|---|---|---|
| 860, 1696 | a station task | `stationCard(id)`: "For the Energy Grid task, in the Shield Bay." |
| 919, 970 | the vent, the floor plate | "For finding a secret: a lost star chip." |
| 929 | the robot | "For mending the robot's arm." |
| 939 | the bolt | "For finding a secret: the lost bolt." |
| 947 | the chest | "For finding a secret: the old chest." |
| 960 | the junk room drone | "For waking the old drone with oil." |
| 1460 | a skill star | "For a star on your skills chart: ${nm}." |
| 2705 | space hazards | "For getting through ${the hazard} for the first time." |
| 3831 | the market (`MARKET_HOST.card`) | "For Voltara's supplies, bought at the market." |
| 3915 | a star seed | "For the star seed on ${k.name}." |
| 4116, 4163, 5036, 5741, 5743 | secrets on the planets | "For finding a secret: ${what}." (the coin, the glow stone, the sundial, the giant's hum, the leaf print) |
| 4135 | the zebra | "For feeding the six-legged zebra." |
| 4233, 4263 | Voltara's survey, plan | "For Voltara's street survey." "For Voltara's energy plan." |
| 4521 | the lantern's glass | "For the glass for the Clockmaker's lantern." |
| 4756, 4845, 4868 | a Chronosia job | "For Chronosia: ${q.title}." |
| 4757, 4847, 4869 | the last Chronosia job (epic) | "For finishing every job on Chronosia." |
| 4989, 5004 | the tide table, the gear door | "For finding when the passage is dry." "For opening the gear door." |
| 5303, 5328, 5493 | finds, the case, the portal | the find's or the case's own name |
| 5637, 5730, 5785 | Xylophora | "For Xylophora: ${what}." "For the key to the colony's map." "For the paths that keep boots dry." |
| 6293, 6425, 6449, 6458 | Stardust | "For Stardust: ${what}." "For your report to Project Second Home." "For clearing Stardust for launch." "For answering the signal." |
| 4826 | practice credits | "For ${n} practice credits, turned in." |

`creditBuy` (line 4826) also pushes a card itself: give it `GMQCards.record(GMQCards.pick(rnd(2147483647), r, S.cards), ...)` and `cardsSoon()`.

### 3.5 My cards opens the book

The More row's **My cards** button (`#m_cards`) opens the book in the picture:

```js
widget = { kind: 'cards' }; GMQCards.book(CARDS_HOST, S.cards, () => { if (widget && widget.kind === 'cards') widget = null; }, { extra: CREDITS });
```

- **The practice credits** (today in the `#cards` panel) can sit on the book's desk: `CREDITS = { html: '...', wire: deskEl => {...} }` puts their words and buttons under the book's own. Or keep them in the panel, with an "Open my cards" button. **[pick]** On the book's desk: one place for everything about cards.
- The old `#cards` list (`drawCards`) can stay for the teacher, or go. It still draws the new cards by name.

### 3.6 Old saved games

Before wiring this, ask Marc (report, decision 2). Then, once, after the save is read:

```js
if (S.cards.some(c => c && !c.id) && !S.cardsMoved) { const m = GMQCards.migrate(S.cards, WAY, rnd(2147483647)); S.cards = m.cards; S.cardsMoved = true; save();
  if (m.changed.length) GMQCards.showPack(CARDS_HOST, m.changed, 'The cards are new! Each of your old cards is a new card now, of the same kind.', () => {}); }
```

- `WAY` is `'keep'`, `'swap'` or `'map'`. With `'keep'`, nothing changes: the book shows the old cards under "First cards", with the game's own small pictures (`CARD_ART`).
- `migrate` never changes a card that has an id, so running it twice changes nothing.

### 3.7 Start again, and tidy

- In `tidy()` (line 6658): `GMQCards.close(true);` (it closes without calling `done`).
- `restart()` makes `S` fresh; nothing else is needed.

## 4. What does not change

- **The save key** (`gmq-station-sketch-v6`). New fields sit inside `S.cards`. `checks/cards_in_game_test.js` checks the key.
- **The odds** (70, 25, 5) and **QCOST**.
- **What a card does.** The words come from the battle thread's list; the faces are its drawing.

## 5. Tests to run after wiring

| Test | Why |
|---|---|
| `node checks/parse_check.js` | The game still parses, with neither of the two signs |
| `node checks/cards_sync_check.js` | The faces and the list are still the battle thread's |
| `node checks/cards_in_game_test.js` | The piece in the game at three sizes. It uses the game's own `GMQCards` once it is there |
| `node checks/cards_pick_check.js 20000` | The picking rule, the starter pack and old saves, on 20,000 made-up children (about 8 minutes) |
| `node checks/class_update_test.js docs/index.html prototypes/kis_station_sketch.html` | Saved games from the class link open in the new version |
| Tests that play the station or tap the picture | Set `window.GMQ_NO_CARDPOP = true` in their start-up, as they set `GMQ_NO_PV` |
| `station_playthrough_test.js`, `lucky_draw_test.js`, `trade_market_test.js` | They count or give cards. Check each still passes |

**What this cost if you skip the full run:** the pop-up sits on the picture after almost every task. Any test that taps the picture after a task, without the switch, will tap the card. Run the full set once after wiring.

## 6. When the battle thread changes its list, its drawing or its starter rule

The list landed on 26 November, while this was built; the page already reads it.
1. Run `node checks/cards_sync_check.js`. It fails when the page's copies of the battle thread's list, DRAW block or STARTER block are out of date. `--write` brings them up to date (the cards thread's job; it changes only `docs/cards/index.html`).
2. Run `node checks/cards_pick_check.js 20000` and `node checks/cards_page_test.js`.
3. If the game holds its own copy of the list, copy it again (not needed if the game uses `GMQBattleOwn.cardList()`).
- The piece reads both shapes: `cards`, `parts`, `upgrades` (today's `cards.json`) and one flat list (`group: 'battle card' | 'ship part' | 'upgrade'`). A made-up flat list of 140 cards passes every check.
- A list with no `starter_pack` uses the piece's stand-in rule (the report, section 3).
- Saved cards keep their ids. If a card's id leaves the list, the book still shows it (under "Other cards", with a plain face).
