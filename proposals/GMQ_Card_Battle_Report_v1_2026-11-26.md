# Battle thread report, 26 November

**From:** the new battle thread. **For:** Marc and the main thread.
The full note: `GMQ_Card_Battle_Catalogue_v1_2026-11-26.md`. The wiring note: `GMQ_Card_Battle_Wiring_v1_2026-11-26.md`.

## What is new

1. **The card catalogue: 118 cards.** 93 battle cards (46 new), 20 ship parts, 5 upgrades. Plus 9 ideas that wait for a rule from Marc (2 new: Triple Drive, Echo Shot).
2. **One card list,** `docs/battle/cards.json`: id, group, name, rarity, type, words, badge, what it does (`ops`), what the child works out, where it came from, and a picture key with a few words for the picture. The two battle pages and the game's piece carry exactly this list; the set check proves it. The list for Marc: `GMQ_Card_Battle_Catalogue_v1_2026-11-26.csv`.
3. **The starter pack as a rule in that list:** 1 Spy, 1 Policeman, 1 epic, 1 rare [Marc], and 4 attack, 4 shield, 3 repair commons [pick]. Each child's pack comes from their seed.
4. **A battle with your own cards,** as a piece for the game (`GMQBattleOwn`, `docs/battle/own.html`), with a wiring note.

## What a child can do now (on the demo page)

- Open the battle over the whole screen. Read the story first.
- See their ship and their deck. Tap a card to read it large.
- Choose which of their Spy cards flies (one per deck, Marc's rule), and which part card to fit.
- Fly with 15 cards even if they own fewer: the station lends cards from their starter pack, marked "lent".
- Play the practice battle with Marc's rules against a computer deck of the same shape.
- Leave in the middle, close the game, come back: the same battle goes on.
- At the end: battle again, or go back. The game is told who won.

## What I checked, and how

| Check | What it does | Result |
|---|---|---|
| `python3 checks/battle_cards_set_check.py` | the list: counts, no two cards alike, every epic unique, the number rule, words against numbers, 20,000 random ships for each card, 10,000 starter packs, the pages and the piece carry the same list | ALL OK |
| `node checks/battle_engine_test.js` | every combination of switches with the bigger decks; 10,000 starter packs; 4,000 made-up children's own decks, 600 played to the end; the two new epics by hand | ALL OK |
| `node checks/battle_own_test.js` (new) | the piece as a child, at three sizes | ALL OK |
| `node checks/battle_page_test.js` | the practice battle as before | ALL OK (1,643 checks), after a fix to the test: its Spy with two targets |
| `node checks/battle_cards_page_test.js` | the cards page | ALL OK |
| `python3 checks/battle_cards_review_check.py` | the review of the 2023 cards | ALL OK |
| By eye | every new screen as pictures at iPad sideways, iPad upright and phone: the own-cards setup (4 cards, 3 Spies, 86 cards), a card opened large, the battle, the end; the cards page's rule table, the NEW cards, the starter pack | fixed what I saw |

## What I did not check

- A real iPad, a real finger, a real child. The frame (`iframe srcdoc`) works in Chromium; it has never run on an iPad.
- The game itself: I never edited it, and the piece is not wired in.
- Whether children read 93 different cards, or whether the enemy's same-shape deck feels fair.
- The sounds (I cannot hear them).

## My picks (each is Marc's to change)

- The size: 118 now, not 150, because more cards under today's rules would differ only by a number.
- The number ranges, wider than on 22 November (common attack 4 to 14, rare 15 to 30, and so on).
- The starter pack's 11 commons (4, 4, 3) and its common Spy.
- A child with fewer than 15 battle cards is lent cards from their own starter pack.
- The child chooses which Spy flies; at first one is drawn at random.
- The enemy's deck has the same shape as the child's.
- A child cannot change the rules in the game.
- A win gives nothing yet.

## Decisions for Marc

See the catalogue note, section 6: the size; epics; Spy cards; the starter pack's commons; Policeman or Station Guard; decision 1 (both built); where the battle opens; Comeback Crew and Star Harbour.

## Added later on 26 November, while Marc slept: job 5, the battle's side

- **A battle against a classmate's saved deck,** ready for the server thread's `battle_start` (wiring note, section 8). The computer flies the classmate's own deck and ship. Nobody has to be online at the same time.
- **A challenge shows both cards at stake first** [Marc, 23 November], with the rule in words: the winner gets both, a tie moves nothing, your card stays in your deck. "I agree: start the battle" or "Back out".
- **The result goes back from the child's side** (won, lost, tie) with a short log for the teacher. The deal comes from the server's seed, so the battle could be played again later to check who won.
- **A battle left in the middle** is saved by its id; a practice battle left open is kept apart.
- **For Marc:** in a classmate's battle the page still calls their ship "the enemy" (the first screen says so). It could carry the classmate's ship name instead. [pick: keep "the enemy" for now: long names could break the phone's top bar]
- **Tests:** `battle_own_test.js` plays a friendly battle and a challenge against a made-up classmate at the three sizes.

## Added later: the independent review, and what it changed

A second reviewer saw only the rules, the card list and the pictures. It found 16 points. Fixed: the enemy's dodge cards said the wrong thing ("It still fire"); "Or bring back a broken shield" read as a choice (19 cards); dodge cards did not say what still hits; the child had to count the enemy's hidden hand; Rounding Rover's "next ten"; "lent" (now "borrowed"); "shield" in the deck line (now "defence"); the challenge words. Found while fixing: six cards' words were cut off above the ships. Left for Marc: badges that read two ways (2× and ×2), one card with three names, the word "order", the phone's top bar, and whether Star Harbour and Comeback Crew are unique enough to be epics. Details: the catalogue note, section 8.

## Added later: the cards thread's points, and the ship parts

- **The starter pack's seed:** the cards thread is right: `S.seed` changes, so the pack would change. Both pieces should get `S.packSeed`. The wiring note says so (section 9).
- **Ship parts:** the game's station gives each child a ship with the 2023 site's numbers (green: 70 HP, 40 AP); the battle's part cards use the chat table (100 HP, 55 AP). Same names, different numbers. The station's red Pulsar Phaser has 0 HP: in a battle that ship could never attack. Measured and laid out for Marc (catalogue note, decision 10). The piece can now fly the child's station ship, so any choice works.
- **For the cards thread** (its eight lines of words for each type, `TYPEW`), checked against Marc's rules: six are right. Two could mislead:
  - defence: "it keeps your ship safe from an attack". A block card stops part of an attack (Dust Screen stops 8). Suggest: "In a battle, it blocks some of an attack, or makes your Main Shield stronger."
  - dodge: "the other ship's attack misses you". Marc's rulings: the dodging ship still fires, and a rare or epic attack card can still hit through the two cheaper dodge cards. Suggest: "In a battle, the other ship's attack misses you, and you still fire."
- **"Count the other cards in your hand"** (the cards thread's note): the cards now say "Block 4 for each other card in your hand", which is a battle word, but the card says what it does. No change.

## Added later: a challenge's result can be checked

The server thread's known gap: the server cannot tell who won, so a child could claim a win. The page now sends a record of the battle (its start and the child's choices), and `GMQBattle.replay` plays it again exactly. 1,500 battles replayed the same. The server or the teacher's Desk can use it (wiring note, section 10). For the server thread.
