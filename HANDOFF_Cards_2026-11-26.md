# Brief for the cards thread

**Date:** 26 November 2026. **From:** the main thread (conductor). **For:** a new thread that builds how children get, see and collect cards.
Everything is **[Proposal]** unless it says [Source]. Your own choices without Marc: mark them **[pick]**.

[Source: Marc, 26 November: "We need to do something so when people do get cards and the space station that it shows what card they received like it pops up or something and they can actually read the card and see like what it does and things like that. It'd be cool if they can actually start collecting their own cards in their demo play through while they can't battle each other yet."]

---

## 1. Read first

1. `CLAUDE.md` (Marc's rules: the picture shows the task; plain words; check every word against the picture; test on thousands of seeds).
2. `HANDOFF_2026-11-20.md`, section 2b: who owns what.
3. `HANDOFF_Next_Threads_2026-11-26.md`: the plan, and where you fit.
4. The battle thread's cards: `docs/battle/cards.html` (source `prototypes/card_battle_cards.html`) and `proposals/GMQ_Card_Battle_New_Set_v1_2026-11-22.md` and `.csv`. The rules sheet: `proposals/GMQ_Card_Battle_Rules_Sheet_v1_2026-11-21.md`.
5. As an example of a piece built for the game: the trade market, `docs/trade/index.html` (between the `GMQ TRADE` markers), its report `proposals/GMQ_Trade_Market_Report_v1_2026-11-24.md` and wiring note `proposals/GMQ_Trade_Wiring_v1_2026-11-24.md`.

## 2. What the game does today (version 99)

In `prototypes/kis_station_sketch.html` (read it; never edit it):
- `DECK` (line 409): 6 card names, with no words for what they do. Common: Laser Cannon, Stealth Mode, Asteroid Assault. Rare: Quantum Quell, Void Vortex. Epic: Nebula Nova.
- `ODDS`: common 70, rare 25, epic 5 (out of 100).
- `card(force)`: picks a rarity by the odds (or the one forced), picks a name, adds `{ r, n }` to `S.cards`, saves, and redraws the card list. Saved games store epic as `'gold'`; only the word a child reads says "epic".
- Where cards come from: 33 places call `card()` (secrets, mini quests, mini battles and more) and 6 call `card('gold')` (projects and big finds). Practice credits (a quarter for each time wisp or band of mud rats beaten) can be turned in for a card (`QCOST`).
- `drawCards()`: the MY CARDS list, each card with a small picture (`CARD_ART`). The newest is marked. **There is no pop-up.** A child does not see what card they got, or what it does.

## 3. What to build

One piece, `GMQCards`, on its own page `docs/cards/index.html` (a demo a child can play), between two markers:
`/* ===== GMQ CARDS: start =====` and `/* ===== GMQ CARDS: end ===== */`. No optional chaining (`?.`) and no `??`: older iPads cannot read them.

1. **The card, when it is earned.**
   - It fills the picture area, big enough to read on a phone. The desk holds only the button. [Source: the picture shows the task.]
   - It shows: the name, the kind (common, rare, epic: Marc's words), its picture, **what it does, in plain words**, and why the child got it ("For fixing the Shield Bay's wiring").
   - One button: "Add to my cards". [pick] Any animation is short (2 seconds at most), and a tap skips it.
   - A double (a card the child already has) says so, and what a double is for.
2. **The card book** (what MY CARDS opens).
   - Every card the child has, grouped by kind. Tap one to read it big.
   - How many of the set are found ("23 of 140"). Cards not found yet show as an empty shape, with no face: a card face must not show before it is earned.
   - It works with 2 cards and with 150, on a phone.
3. **Which card a child gets.**
   - Random within the kind, so two children's books differ.
   - [pick] Fewer doubles while a kind has cards left to find. Check it on thousands of made-up children: how many cards it takes to fill each kind, and that nobody gets stuck on doubles.
   - The odds stay the game's (70, 25, 5) unless Marc changes them.
4. **The starter pack** [Source: Marc, 23 November]: every child earns 15 cards on the KIS Station, always with 1 Spy, 1 Policeman (the set calls it Guard: ask Marc which name), 1 epic and 1 rare. The battle thread writes the rule in its data file; you show it: how the 15 arrive (one by one as the station's tasks are done, or as a pack) is a choice to lay out for Marc.
5. **Challenge battles, later** [Source: Marc, 23 November]: two children each put up one rare or epic card; the winner gets both. So the book must handle a card that leaves, and one that arrives from a classmate.
6. **Old saved games.** Children already hold the 6 old cards. Lay out options for Marc (keep them as "first cards", swap each for a new card of the same kind, or another way). Build so that any of them works.

**The card list:** the battle thread owns it and is growing it into a catalogue (`docs/battle/cards.json`, when it lands). Start with the 70 cards that exist today (45 battle cards, 20 ship parts, 5 upgrades). Read the list from one place, so the bigger list drops in. Never change what a card does: that is the battle thread's, and the rules are Marc's.

**How the game will call it:** write this in your wiring note. Something like:
- `GMQCards.show(host, card, why, done)`: the card, earned.
- `GMQCards.book(host, cards, done)`: the card book.
- `GMQCards.pick(seed, kind, owned)`: which card is given.
- `host` gives what you need from the game (`toy`, `closeToy`, `beep`, `save`, the canvas), as the trade market's `MARKET_HOST` does.

## 4. Checks

- A number check on thousands of made-up children: the picking rule (section 3, part 3).
- A play test at iPad sideways (1180 × 745), iPad upright (820 × 1180) and phone (390 × 760): a card earned, a double, the book with 0, 2 and many cards, the page closed and opened again.
- Look at every screen as pictures. Check every word on a card against the card. The words must not run off the card.
- `node checks/parse_check.js` style: no `?.`, no `??`.

## 5. Limits

- Never edit the game file (`prototypes/kis_station_sketch.html`, `docs/index.html`, `docs/next/index.html`). The main thread wires your piece in.
- Your files: `docs/cards/*`, `prototypes/cards*`, `proposals/GMQ_Cards_*` (dated after 26 November), `checks/cards_*`.
- Push to `claude/trusting-edison-vl78nc`: `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD` first. In `INFO_FROM_MARC.md`, keep both sides of a merge conflict.
- Every name and picture original. No student data, ever.

## 6. Report

As the trade thread's: what a child does, what the checks found, what you looked at, your [pick]s, what could prove it wrong, decisions for Marc, and a short message for the main thread to paste.
