# Handoff: the battle thread, starting again

**Date:** 26 November 2026. **From:** the main thread (conductor). **For:** a new battle thread. The old battle thread ran on another model, which Marc cannot use for a few days. You take over its work and its files.
Everything is **[Proposal]** unless it says [Source]. Your own choices without Marc: mark them **[pick]**.

---

## 0. The message that starts you

> You are the battle thread for Galaxy Math Quest, taking over from the old battle thread. Read `CLAUDE.md`, then `HANDOFF_Battle_2026-11-26.md`, and do its section 6. You may push your own files to `claude/trusting-edison-vl78nc`, merging first.

## 1. Your part

- **The battle:** Marc's card battle between two ships, built as a practice battle against the computer. **The rules are Marc's.** Never change a rule on your own; lay out options and let him choose (CLAUDE.md).
- **The cards:** the set of battle cards, ship parts and upgrades: their names, what they do, their look.
- **Your files** (no one else edits them):
  - `docs/battle/index.html` (the practice battle; source `prototypes/card_battle.html`)
  - `docs/battle/cards.html` (the card set; source `prototypes/card_battle_cards.html`)
  - `proposals/GMQ_Card_Battle_*`, `proposals/GMQ_Cards_Review_*`
  - `checks/battle_*` (`battle_engine_test.js`, `battle_page_test.js`, `battle_cards_page_test.js`, `battle_cards_set_check.py`, `battle_cards_review_check.py`)
  - new: `docs/battle/cards.json` (section 6)
- **Never edit** the game file (`prototypes/kis_station_sketch.html`, `docs/index.html`, `docs/next/index.html`). The main thread wires your work in.

## 2. Read first, in this order

1. `CLAUDE.md` (Marc's rules for every thread).
2. This file.
3. `HANDOFF_Next_Threads_2026-11-26.md`: the plan for all threads, and where you fit.
4. `proposals/GMQ_Card_Battle_Rules_Sheet_v1_2026-11-21.md`: Marc's rules, as first written down.
5. `proposals/GMQ_Card_Battle_Practice_v1_2026-11-22.md`: the practice battle, and every ruling since (sections 1 to 1h). **Where it and the rules sheet differ, the later ruling wins.**
6. `proposals/GMQ_Card_Battle_New_Set_v1_2026-11-22.md` and `.csv`: the new card set. `proposals/GMQ_Card_Battle_Kind_Rule_v1_2026-11-22.md`: which card can stop which.
7. Background, only if you need it: `HANDOFF_Card_Battle_2026-11-22.md` and `HANDOFF_Card_Battle_Brief2_2026-11-22.md` (the first briefs), `proposals/GMQ_Cards_Review_v1_2026-11-22.md` (the review of the 2023 cards).
8. In `INFO_FROM_MARC.md`, search for "battle thread": every message Marc sent it, with what was done.

## 3. What is built

- **The practice battle** (`https://christopherfi-dev.github.io/galaxy_math_quest/battle/`): Marc against the computer. Two ships fill the screen; the five parts are places on each ship; the Main Shield is a bubble; a card is an order to the ship. Sound is made by the page itself.
- **The card set** (`.../battle/cards.html`): 47 battle cards (with three dodge cards: Wormhole Zip, common; Triple Illusion, rare; Vanishing Act, epic), 20 ship parts (5 parts in 4 kinds: Standard, Guardian, Striker, Lucky Draw), 5 Level 2 upgrades, and ideas that wait for a rule from Marc.
- **Tests:** all five pass (the main thread's full run, 25 November). `battle_engine_test.js` plays computer against computer on every switch.

## 4. Marc's rulings so far [Source: `INFO_FROM_MARC.md`, 22 and 23 November]

Read them in the practice note; in short:
1. **It should feel like a space battle,** not a card table.
2. **Each deck holds the whole set,** shuffled; cards come out at random. One Spy and two Guards in each deck.
3. **One player leads:** their card is on the table before the other chooses. **Strikes do not land in turn order;** going second only lets a player answer the card they have seen.
4. **Shields:** a lower shield still stops the other ship's regular AP. **A higher attack card's own part goes through a lower shield.** The two epic cards that multiply the AP (Doubling Drive, Hundred Cannon) go through with all of it. A shield put back up by a card has that card's kind. Shield Reborn (epic) brings back a full shield. Shield cards need the Shield Generator.
5. **The look of a card:** shield cards show a shield and say DEFENCE; repair cards show a heart; dodge cards have their own picture.
6. **A dodge card still fires** that round.
7. **The split rule** (rules sheet 4) stays exactly as it is: when a hit gets past the shield, the defender chooses which parts take it.
8. **A tie is a tie:** if both ships lose their last part in the same round, nobody wins.
9. **Two kinds of battle, later:** a **friendly battle** has nothing at stake. In a **challenge battle**, both players put up one rare or epic card, chosen at random from their deck. The winner gets both; in a tie, nobody does. The card put up may still be played, and each player sees it before agreeing.
10. **The starter pack:** every child earns 15 cards on the KIS Station, always with 1 Spy, 1 Policeman, 1 epic and 1 rare. **[Conflict]** Marc says "Policeman"; the set calls the card "Guard". Ask him which name.

## 5. Still open, for Marc

- **The plan's decision 1** [Conflict]: is a ship upgrade from a big quest lasting, or a card for one battle? Your Level 2 upgrade cards last one battle; his words sound lasting. Build so that either works.
- Spy and Policeman (or Guard): the name; and whether the Spy's seven designs stay.
- Whether the battle now feels like a space battle: only children playing can show it.

## 6. Your next jobs, in order [Source: Marc, 26 November: "We need the cards planned out and has like a vast number of different ones made with different names."]

1. **The card catalogue.**
   - Grow the set to a large one. Propose the number (about 100 to 150) from how many cards a child earns in the whole game. Count the earning moments in the game file (read it, never edit it): 33 places call `card()` and 6 call `card('gold')`, plus practice credits (`QCOST`) and the starter pack of 15.
   - Original names. One rule for the numbers (common one small number; rare about double, or two things; epic does something no other card does).
   - Words short enough for a Grade 3 reader, many of them learning English.
   - Change no rule. A new kind of card that needs a new rule goes to Marc first, as an idea.
2. **One data file: `docs/battle/cards.json`.** One entry for each card: id, name, kind (battle card, ship part, upgrade), rarity (common, rare, epic), the words on the card, its numbers, and a picture key. The cards thread (the pop-up and the card book) and the game read it. Keep the CSV for Marc. Check the file with your set check.
3. **The starter pack of 15** as a rule in that file: which cards a new child gets, with 1 Spy, 1 Policeman (or Guard), 1 epic and 1 rare.
4. **A battle with a child's own cards:** the practice battle, played with the cards a child has collected (or the starter pack, if they have fewer), as a piece the game can open. Put it between two markers, `/* ===== GMQ BATTLE: start =====` and `/* ===== GMQ BATTLE: end ===== */`, with a wiring note, as the trade thread did (`proposals/GMQ_Trade_Wiring_v1_2026-11-24.md`). No `?.` and no `??`: older iPads cannot read them.
5. **Later, with the server thread:** challenge battles between classmates, the computer playing the absent child's saved deck (`HANDOFF_Server_2026-11-26.md`).

## 7. Who you work with

- **The cards thread** (`HANDOFF_Cards_2026-11-26.md`) builds the pop-up when a card is earned and the card book. It reads your `cards.json`. It never changes what a card does.
- **The visual design thread** will draw the card pictures, in one style, from your picture keys.
- **The server thread** keeps decks on the server, later.
- **The main thread** wires everything into the game, and passes messages through Marc.

## 8. Limits and how to push

- Push only your own files: `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD`, then push. Never force-push.
- `INFO_FROM_MARC.md` and `checks/RUN_ALL.md` are shared: only add lines at the end. In a merge conflict, keep both sides.
- No student data, ever. Every name and picture original.
- Before you say a job is done: look at every screen as pictures (iPad sideways 1180 × 745, upright 820 × 1180, a phone 390 × 760); play it as a child (wrong choices, leaving, coming back); run your tests and say which ran.

## 9. Report

What a child can do now, what you checked and how, what you did not check, your [pick]s, decisions for Marc, and a short message for the main thread to paste.
