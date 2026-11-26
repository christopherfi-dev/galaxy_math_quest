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
- `opts.seed`: the child's seed (`S.seed`). It picks which starter cards are lent to a child with fewer than 15.
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
       { cards: S.cards, seed: S.seed, upgrades: 'card', back: 'Back to the station' },
       r => { widget = null; drawStatus(); say(r.why === 'finished' ? 'Back at the station after the practice battle.' : 'You leave the practice battle. It is saved, to finish later.'); });
     return 'The other crew is ready. The battle begins.';
   }
   ```
3. **Pause what runs under it** (optional, for the iPad's battery): in the draw loop, `if (widget && widget.kind === 'battle') return;`. Stop the game's music while it is open, and start it again in `done`: the battle has its own sounds and its own Sound button.
4. **The cards.** Today `S.cards` holds `{ r, n }` with the 6 old names; the piece skips those, so every child is lent the starter cards until the cards thread's new cards arrive. When they do, pass the new cards (ids or names both work).
5. **The starter pack** (when the cards thread wires its part): `GMQBattleOwn.starter(S.seed)` gives the 15 ids, in this order: the Spy, the Policeman, the epic, the rare, 4 attack, 4 shield, 3 repair.

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
