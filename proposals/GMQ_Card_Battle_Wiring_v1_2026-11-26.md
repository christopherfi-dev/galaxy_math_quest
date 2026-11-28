# Wiring the battle with your own cards into the game

**Date:** 26 November 2026. **From:** the battle thread. **For:** the main thread.
**What:** how to put the practice battle, played with a child's own cards, into the game.
Everything here is **[Proposal]**. Choices made without Marc are marked **[pick]**.

---

## 1. What you are wiring in

- One piece of code, `GMQBattleOwn`, between two marked lines in `docs/battle/own.html` (the same file is `prototypes/card_battle_own.html`):
  - `/* ===== GMQ BATTLE: start =====`
  - `/* ===== GMQ BATTLE: end ===== */`
- Copy the whole block, as it is, into the game's script. Do not copy the page's second `<script>` (the made-up cadets): it is the stand-in for the game.
- **It is big: about 204 KB.** It carries the whole battle page inside it (`PAGE`), so the game stays one file. The game grows from about 1.27 MB to about 1.47 MB.
- It uses no optional chaining and no nullish operator. It never writes `</script` (the set check tests both). `node checks/parse_check.js` will confirm it inside the game.
- **How it shows:** it puts a `div#gmqbattle` over the whole screen, with the battle inside a frame (`iframe srcdoc`). The battle's words, styles and ids never touch the game's. The frame is the same origin as the game.

## 2. What the piece needs from the game

Only the child's cards, a seed, and what to do at the end.

```js
GMQBattleOwn.open(host, opts, done)
```
- `host.root`: where the battle goes. Leave it out: `document.body`.
- `host.over(result)`: optional. Called when a battle ends, before the child taps out. `result = { winner, rounds }`.
- `opts.cards`: what the child owns. Each may be a card id (`'A01'`), a name (`'Spark Shot'`), or an object with `id` or `n`. Unknown names are skipped (the 6 old cards, for now). Ship part cards are used for the ship; upgrade cards as section 5 says.
- `opts.seed`: the child's starter-pack seed, one that never changes (`S.packSeed`, section 9). It picks which starter cards are lent to a child with fewer than 15.
- `opts.upgrades`: `'card'` (as built) or `'lasting'`. The plan's decision 1, Marc's.
- `opts.back`: the words on the way out. For example `'Back to the station'`.
- `done(result)`: when the battle closes. `result.why` is `'finished'` or `'left'`; `result.winner` is `0` (the child), `1` (the computer), `-1` (nobody) or `null` (left in the middle; it is saved).

Also:
- `GMQBattleOwn.starter(seed)`: the 15 card ids of a child's starter pack (section 4).
- `GMQBattleOwn.cardList()`: the whole catalogue, the same as `docs/battle/cards.json`. The cards thread can read it here instead of carrying the list a second time.
- `GMQBattleOwn.isOpen()`, `GMQBattleOwn.close()`.

## 3. The changes, in order

1. **Copy the block** into the game's script.
2. **Open it** from wherever Marc chooses (section 6). For example:
   ```js
   function battleOpen() {
     widget = { kind: 'battle' };
     GMQBattleOwn.open(
       { over: r => { S.log.push({ what: 'Practice battle', skill: 'A battle with your own cards', result: r.winner === 0 ? 'won' : (r.winner === 1 ? 'lost' : 'nobody won') + ', ' + r.rounds + ' rounds' }); save(); } },
       { cards: S.cards, seed: S.packSeed, upgrades: 'card', back: 'Back to the station' },
       r => { widget = null; drawStatus(); say(r.why === 'finished' ? 'Back at the station after the practice battle.' : 'You leave the practice battle. It is saved, to finish later.'); });
     return 'The other crew is ready. The battle begins.';
   }
   ```
3. **Pause what runs under it** (optional, for the iPad's battery): in the draw loop, `if (widget && widget.kind === 'battle') return;`. Stop the game's music while it is open, and start it again in `done`: the battle has its own sounds and its own Sound button.
4. **The cards.** Today `S.cards` holds `{ r, n }` with the 6 old names; the piece skips those, so every child is lent the starter cards until the cards thread's new cards arrive. When they do, pass the new cards (ids or names both work).
5. **The starter pack** (when the cards thread wires its part): `GMQBattleOwn.starter(S.packSeed)` gives the 15 ids, in this order: the Spy, the Policeman, the epic, the rare, 4 attack, 4 shield, 3 repair.

## 4. The starter pack

- [Source: Marc, 23 November] 15 cards, always 1 Spy, 1 Policeman, 1 epic and 1 rare.
- The rule is data, `starter_pack` in `cards.json`. The code that reads it is the same in three places (the battle page, the cards page, this piece); the set check compares them.
- Checked on 10,000 seeds in Python and in JavaScript; both make the same pack.

## 5. What the battle does with the cards (cards.json, `deck_rules`)

- Every battle card the child owns goes in. A card owned twice is in twice.
- **One Spy** [Marc, 22 November]. If the child owns several, they choose which on the first screen (kept for next time); at first one is drawn at random.
- **At least as many Policemen as Spies** [Marc, 22 November]. If there are none, the station lends one.
- **Fewer than 15 battle cards:** the station lends cards from the child's own starter pack, until there are 15. **[pick]**
- **Upgrades:** `'card'`: in the deck; `'lasting'`: those parts start every battle at Level 2, and the cards stay out of the deck.
- **The computer's deck has the same shape**: for each of the child's cards, a card of the same type and kind, at random. **[pick]**
- **The rules are Marc's defaults.** A child cannot open the Rules switches.
- **Saving:** the battle saves itself under its own key, `gmq_battle_own_v1`. It never reads or writes the game's save (`gmq-station-sketch-v6`). A battle left in the middle goes on when opened again.

## 6. What the main thread must decide, or ask Marc

1. **Where the battle opens.** My suggestion only: at the station (a training room, or the Launch Bay), after the station's 15 tasks. Marc's choice.
2. **What a win gives.** **[pick]** Nothing yet: every card must still come from a task. The game is told the result (`host.over`), and can log it.
3. **The cards thread's part:** how the 15 starter cards arrive, and what the 6 old cards become. The battle works either way.
4. **Decision 1** (upgrades): pass `'lasting'` if Marc rules that an upgrade lasts.

## 7. Tests to run after wiring

| Test | Why |
|---|---|
| `node checks/parse_check.js` | the game still parses, with no `?.` and no `??` |
| `node checks/class_update_test.js docs/index.html prototypes/kis_station_sketch.html` | saved games still open |
| `node checks/battle_own_test.js` | the piece's own play test, on its page |
| `python3 checks/battle_piece_build.py --check` | the piece carries the current battle page |
| A play in the game, at the three sizes | open the battle, play a round, leave, close the game, open it again, finish |

**If the battle thread changes the battle page later,** it rebuilds the piece (`python3 checks/battle_piece_build.py`). Copy the block again. To see if the game's copy is current, compare the text between the markers in the game with the same text in `docs/battle/own.html`.

---

## 8. Added later on 26 November: a battle against a classmate's saved deck (section 6, job 5, the battle's side)

The server thread built the other side (`proposals/GMQ_Server_Wiring_v1_2026-11-26.md`, section 3). The piece now takes what the server's `battle_start` answers, as `opts.rival`. Marc's rules [Source: 23 November]: in a challenge each side puts up one rare or epic card, picked at random; the winner gets both; in a tie nobody does; the card put up may still be played; each player sees it before agreeing.

**How the server's calls meet the piece:**

| The server | The piece |
|---|---|
| `battle_start` answers `{ battle, kind, seed, minutes, you: { deck, stake }, rival: { name, deck, stake } }` | `GMQBattleOwn.open(host, { cards: S.cards, seed: S.packSeed, back: 'Back', rival: { name: r.rival.name, cards: r.rival.deck, kind: r.kind, stake: { mine: r.you.stake, theirs: r.rival.stake }, battle: r.battle, seed: r.seed, minutes: r.minutes } }, done)` |
| a challenge is `offered` | The first screen shows both cards at stake, the rule in words, "I agree: start the battle" and "Back out". Friendly: "Nothing is at stake". |
| `battle_accept` | `host.accept(battle)` is called when the child agrees. Call `battle_accept` then. If the server refuses, call `GMQBattleOwn.close()` and say the server's words. |
| `battle_cancel` | `done({ why: 'backed out' })`. Call `battle_cancel`. |
| `battle_end`, `result`, `log` | `done({ why: 'finished', result: 'won' / 'lost' / 'tie', log })`: the result is from the child's side, as the server wants; the log is what happened, in words, under 19,000 letters. `host.over(...)` gets the same when the battle ends, before the child taps out. |

**What the piece does:**
- The computer flies the classmate's own deck, by the same deck rules as the child's (one Spy, at least as many Policemen, lent cards up to 15). Their ship uses the part cards in their deck.
- The deal comes from the server's `seed`, so the server could play the battle again later and check who won (the server thread's known gap).
- The classmate's cards are not shown before the battle; only how many of each kind.
- A battle left in the middle is saved by its `battle` id. It goes on only when the same battle is opened again. A practice battle left open is kept apart, and goes on too. `done` says `saved: true`.
- After a classmate's battle there is no "Battle again": a new one starts on the server.
- A card at stake opens large when tapped. One that is not in the catalogue (one of the 6 old cards) shows as a plain box with its name and kind.
- **Not tested in Safari.** Only Chromium is in this workspace. The frame (`iframe srcdoc`) and its messages are standard and old (iOS 6 and later), but the first real iPad is the first real test.

**Still for Marc** (the battle thread's report): in a classmate's battle, the page still calls their ship "the enemy" (the story says so first). It could carry the classmate's ship name instead.

**Test:** `node checks/battle_own_test.js` now also plays a friendly battle and a challenge against a made-up classmate (Blue Fox) at the three sizes.


---

## 9. Added later on 26 November: two points from the cards thread

**The starter pack's seed** (the cards thread found it). `S.seed` changes every time the game picks a number, so a child's starter pack would change. Keep one seed that never changes in the save, `S.packSeed`, and give it to both pieces: `GMQBattleOwn.open(host, { cards: S.cards, seed: S.packSeed, ... })` and `GMQBattleOwn.starter(S.packSeed)`. The cards thread's wiring note says how to make it. Section 3's example should read `seed: S.packSeed`.

**The ship a child fitted at the station** (`opts.ship`). Optional: five parts, each `{ part, name, hp, ap, tier, colour }`, with the game's part names ('Engine Core', 'Navigation', 'Shield', 'Weapons', 'Power') or the battle's. From the game today: `PARTS.map(p => { const o = pvOf(p), v = o ? PVER[p][o.i] : null, t = o ? PTIER[o.i] : null; return v ? { part: p, name: v[0], hp: v[1], ap: v[2], tier: t[0], colour: t[1] } : null; })`, given only when all five are fitted. **Do not pass it until Marc chooses** (the catalogue note, decision 10): the station's numbers and the battle's part cards disagree, and the station's red Pulsar Phaser has 0 HP, which in a battle means no attack at all. A classmate's ship can come the same way, as `rival.ship`.


---

## 10. Added later on 26 November: checking who won (the server thread's known gap)

The server cannot tell who won a challenge: the page says so, and a child with the know-how could claim a win and take a classmate's card. The battle side now makes the result checkable.

- **The record.** `done(result)` and `host.over(result)` carry `result.record = { start, rec }`:
  - `start`: the battle's seed, rules, both ships, both decks as played (with any borrowed cards and the Spy chosen) and any lasting upgrades;
  - `rec`: for each finished round, the card the child played (its place in the hand) and each choice the child made (which parts a Spy hits, how a hit is shared, and so on).
  - It is small: a few thousand letters for a long battle with big decks.
- **Playing it again.** `GMQBattle.replay(record.start, record.rec)` plays the battle again. The computer's side plays exactly as it did, because its choices come from the seed. The answer's `over` says who won. A choice in the record that the rules do not allow is replaced, and counted in `bad`: a record with `bad` above 0 was changed.
- **Checked:** 1,500 battles played by a made-up child, then played again from their records, end exactly the same (winner, round, every HP and shield). A round played on the screen, played again, ends the same at the three sizes.
- **Where it could run:** `GMQBattle` is in the battle page, and inside the piece. The server is PHP, so it cannot run it. The teacher's Desk (a web page) could: for each challenge, check the record's seed and decks against what the server holds, play it again, and compare the winner with the one claimed. That is the server thread's to wire. [Proposal]
- **Limits:** only "one player leads" (Marc's rule, the default). A battle left in the middle and finished later still checks: the page saves at the start of each round, so a round left half-way is played again from its start.


---

## 11. Added 28 November: Marc's answers, and two things for rationed battles

[Source: Marc, 28 November, "Yes" to the main thread's picks: Station Guard; the battle at the Launch Bay. And: "you only get the battle like two or three times and then you have to go and do more quests."]

- **Station Guard, one name everywhere.** The card list, both battle pages and the piece now say Station Guard; the card's type label says GUARD (it was POLICE). **The drawing code changed** (`TYPE.guard.name`, inside the `DRAW` block), so the cards thread's copy of the drawing and the game's copy of `GMQCards` must take the new label too. Copy the piece again.
- **`again: false`.** Pass it in `opts`: the end of a battle then offers no "Battle again", so every battle starts from the game and the game can count it. Without it, the piece offers "Battle again" as before.
- **`GMQBattleOwn.inProgress()`**: is a practice battle saved half-way on this iPad? It answers `{ round, rounds }` or `null`. `GMQBattleOwn.inProgress(battleId)` asks the same about a classmate's battle. Use it in place of reading `gmq_battle_own_v1` yourself: the battle saves itself at the start of each round, and a finished battle answers `null`.
- **Counting a battle** (the main thread's pick: a battle counts only when it finishes): count it in `done` when `result.why === 'finished'`. A child who left half-way (`why: 'left'`, `saved: true`) started it while they still had a battle. [pick] Let them finish it even if none are left now; it counts when it finishes. `inProgress()` tells the game when to offer "Finish your battle".
