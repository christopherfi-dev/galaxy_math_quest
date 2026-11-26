# Who does what next: the conductor's plan

**Date:** 26 November 2026. **From:** the main thread, as conductor. **For:** Marc, and every thread.
Everything is **[Proposal]** unless it says [Source].

[Source: Marc, 26 November: "I need a conductor. See what needs to be done. We have the battle game that can be integrated into the main game somehow? We need the cards planned out and has like a vast number of different ones made with different names. We need to do something so when people do get cards and the space station that it shows what card they received like it pops up or something and they can actually read the card and see like what it does... It'd be cool if they can actually start collecting their own cards in their demo play through while they can't battle each other yet unless we can start trying to set a test server for that.. So we need to be moving forward always. Do you need more threads working concurrently?"]

So Stage 4 of the plan (cards and the battle) starts now, and Stage 5 (the class server) starts its next step.

---

## 1. The threads, and one job each

| Thread | Next job | Files it owns |
|---|---|---|
| **Main** (this one) | Version 100: the trade market wired in, and the number pad's clearer words. Then the words beside the picture (behind a Teacher switch). Then Chronosia's stages 5 to 7. Wires in each piece below as it lands. | the game file, the class link, the preview, the handoff, the plan, the zip |
| **Battle** | The card catalogue: about 100 to 150 cards with original names, in one data file. Then a battle played with a child's own cards. | `docs/battle/*`, `prototypes/card_battle*`, `proposals/GMQ_Card_Battle_*`, `checks/battle_*` |
| **Cards (new)** | The pop-up when a card is earned, and the card book: a child collects and reads their cards. | `docs/cards/*`, `prototypes/cards*`, `proposals/GMQ_Cards_*` (after 26 November), `checks/cards_*` |
| **Server (new)** | The built server, on a test folder of Marc's site that he uploads himself. Then the first thing a class does together: see classmates' cards, and challenge a classmate's deck. | `engines/gmq-world/*`, `proposals/GMQ_Server_*`, `checks/server_*` |
| **Visual design** | The Rill characters (now). Then pictures for the cards, in one style. | its own files, as Marc set them |
| **Big world** and **story** | Algora, as now. Two or three children play it first. | as now |
| **Trade** | Done. Its market goes into the game in version 100. | — |
| **Fly-in** | Waits. | — |

**How the pieces fit:** each new thread builds its part as a piece on its own page, like the trade market (`GMQTrade`). It writes a wiring note. The main thread puts it into the game. No thread but the main thread edits `prototypes/kis_station_sketch.html` or `docs/index.html`.

**One card list for everything.** The battle thread owns it: `docs/battle/cards.json`. The pop-up, the card book, the battle and the game all read it. Today the game has only 6 old card names (`DECK`, with no words for what they do). The battle thread's new set has 45 battle cards, 20 ship parts and 5 upgrades.

## 2. The order

1. **Now, side by side:** main (version 100), battle (the catalogue), cards (the pop-up and the book, built first on the 70 cards that exist), server (the test folder).
2. **When the catalogue lands:** the cards thread switches to it. The visual design thread starts the card pictures.
3. **When the pop-up and book land:** the main thread wires them in. Children start collecting real cards in their play-through.
4. **When the battle with your own cards lands:** the main thread wires it in, at the station (where is a choice for Marc).
5. **When the server works on the test folder:** challenge battles between classmates, played by the computer for the absent player. Live battles come after that, if ever.

## 3. Messages to paste

### To the battle thread

> From the main thread (conductor), 26 November. Marc's word: the cards and the battle come into the game (the plan's Stage 4). He said: "We need the cards planned out and has like a vast number of different ones made with different names." Read `HANDOFF_Next_Threads_2026-11-26.md`. Your jobs, in order:
> 1. **The card catalogue.** Grow your set to a large one: propose the number (about 100 to 150) from how many cards a child earns in the whole game. Count the earning moments in the game file: station tasks, secrets, mini quests, mini battles, projects, practice credits, big quests. Original names. Your one rule for the numbers (common one small number; rare about double or two things; epic does something no other card does). Words short enough for a Grade 3 reader, many learning English. Marc's rules stay his: change no rule.
> 2. **One data file:** `docs/battle/cards.json` (id, name, kind, rarity, the words on the card, the numbers, a picture key). The new cards thread and the game read it. Keep the CSV for Marc.
> 3. **A battle with a child's own cards:** your practice battle, played with the cards a child has collected (or a starter deck if they have too few), as a piece between `GMQ BATTLE` markers with a wiring note, like the trade thread's (`proposals/GMQ_Trade_Wiring_v1_2026-11-24.md`). The plan's decision 1 (is an upgrade lasting, or for one battle?) is still Marc's: build so that either works.
> Never edit the game file. Push your own files to `claude/trusting-edison-vl78nc`, merging first.

### To start the cards thread (a new thread)

> You are the cards thread for Galaxy Math Quest. Read `CLAUDE.md`, `HANDOFF_2026-11-20.md` section 2b, then `HANDOFF_Cards_2026-11-26.md`, and build from it. You may push your own files to `claude/trusting-edison-vl78nc`, merging first.

### To the visual design thread (after the Rill characters)

> From the main thread (conductor), 26 November. After the Rill characters: pictures for the cards. The battle thread is writing a catalogue of about 100 to 150 cards (`docs/battle/cards.json` when it lands; until then `docs/battle/cards.html`). One style for all of them. They must be small enough to live inside one game file (SVG, or drawn on the canvas), readable at the size of a card in a child's card book on a phone, and original. Read `HANDOFF_Next_Threads_2026-11-26.md` first. Agree the picture keys with the battle thread through Marc.

### To start the server thread (a new thread)

> You are the server thread for Galaxy Math Quest. Read `CLAUDE.md`, `HANDOFF_2026-11-20.md` section 2b, then `HANDOFF_Server_2026-11-26.md`, and build from it. You may push your own files to `claude/trusting-edison-vl78nc`, merging first.

## 4. What could prove this plan wrong

- **Too many threads for Marc to carry messages between.** If it is, pause the server thread first: it matters least until cards are collected.
- **The catalogue is too big for children to read.** 150 cards is a lot of words. Watch whether children read the pop-up or tap past it.
- **Cards become the point, not the maths.** Every card must still come from doing a task. No card for nothing.
