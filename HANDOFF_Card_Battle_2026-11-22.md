# Handoff: the card battle table, for a new thread

**Date:** 22 November 2026. **From:** the main GMQ thread. **For:** a new Claude Code thread that builds one thing: a card battle that Marc can try with his own children, on its own page.
Everything here is **[Proposal]** unless it says [Source].

---

## 0. Read this first

1. **`CLAUDE.md`** loads by itself. Every rule in it applies to you. Two matter most here:
   - **"The battle rules are his."** You build Marc's rules. **You never invent a missing rule.** Where his rule is open, you build a switch with each choice he has named, and he decides by playing.
   - **Privacy:** never open, copy or quote student data. Never edit Marc's Google Drive. Never copy API keys.
2. **This file.**
3. **`proposals/GMQ_Card_Battle_Rules_Sheet_v1_2026-11-21.md`:** Marc's rules as they stand, with every open point marked [Open]. This is your rule book.
4. **`proposals/GMQ_Card_Battle_What_Is_Known_v1_2026-11-19.md`:** where the rules came from, the numbers worked out, the conflicts, and the four old card sets.
5. Nothing else unless this file points to it.

## 1. The job, in one paragraph

**A battle table:** two space ships, each made of five parts, fight with cards by Marc's rules, on one page that runs on an iPad.
- Marc plays it with his own children to find out which rules work.
- It is built as **a separate page** (`docs/battle/index.html`), never inside the game, until Marc says so.
- **Every open rule is a switch on the page.** That way, playing decides the rules, not you.

## 2. What Marc has said [Source]

- 22 November: "Should we have another thread work on the battle mechanics mini-game? So I could try that with my kids as well?"
- 22 November, about the cards: "I need to... probably redo a lot of cards because again they were made with AI like 3 1/2 years ago. ... A lot of them are good, but some of them were just like don't make much sense. There must be a clear difference between the common and the rare and the epic cards."
- 22 November, as typed by his voice-to-text: "We do the Spy we do need the policeman." **The main thread read this as a question:** "Do we need the Spy? Do we need the Policeman?" **Confirm with him.**
- 20 November: "Shields 100 hp. Turn those are same. They go same time. Defender chopped. All parts zero. Common, rare., epic. We will remake card set."
- Earlier rules: in the rules sheet, with dates.

---

## 3. The phases. Stop at each one and report to Marc.

### Phase 0: the cards (a document, no game yet)

The old card sets were made with AI in 2023. Marc wants to remake many of them.
- **Find the four old sets** [Source: `SOURCES_Index.md`]: in Marc's Google Drive, folder "Galaxy Math Quest / Card Prints and Images": Booster Cards, Booster 2, Booster Cards - November, Engine Cores, and "FINAL DECK NOVEMBER CARDS DECK.pdf".
  - Read them **read-only** through the Google Drive connector, if your session has it.
  - **Open only that folder.** Never open "Users Info", "Galaxy Math Quest - Users", "Math Assessment Test", "API information", or anything with student names, passwords or results.
  - If you cannot reach them, ask Marc to upload the deck PDF. Do not guess cards.
- **Make a spreadsheet** (`proposals/GMQ_Cards_Review_v1_<date>.csv`, plus a short `.md` note). One row per card:
  - name, kind (common, rare, epic), set, effect in plain words, its numbers
  - which part of the ship it works with
  - duplicates
  - **a mark where a card "doesn't make much sense"**, with the reason: an effect the rules cannot do, numbers out of scale, a name that does not fit GMQ, or the same as another card
- **Propose a clear difference between common, rare and epic.** Give two or three options; Marc chooses. For example:
  - common: one simple effect with a small number
  - rare: a bigger number, or one extra choice
  - epic: an effect that bends a rule, such as bringing a lost part back
  - Check each option against the existing cards: how many would move kind.
- **Spy and Policeman:** lay out the choices with what each costs. One idea to offer (it is yours, not his):
  - In a same-time round, a Policeman could be **played blind**, as a guess. If the other player plays a Spy that round, the Spy is caught. If not, the Policeman is wasted.
  - That keeps both cards, fits "They go same time", and needs no leader.
- **Stop. Report** the note and the spreadsheet. Marc picks the cards to keep, the rarity rule, and Spy and Policeman.

### Phase 1: the battle table

- **Build `prototypes/card_battle.html`,** and copy it to `docs/battle/index.html` for the iPads.
- **A test deck** of about 20 cards, from the cards Marc keeps in Phase 0. It is labelled "test deck" on the page.
- **Who plays:**
  - **Against the computer:** one child plays a simple, honest opponent. It sees only its own hand.
  - **Two children on one iPad:** each picks a card in secret. "Pass the iPad" screens hide each hand from the other player.
- **Marc's rules, from the rules sheet,** in order:
  1. A ship of five parts with HP and AP, and a Main Shield of 100 HP.
  2. A hand of 5.
  3. Both players put down a card together; both take effect; both ships attack.
  4. Damage hits the shield first; nothing carries over.
  5. Once the shield is gone, **the defender splits each attack** across their parts.
  6. A lost part's penalty, from his board.
  7. A win when all five parts are at 0, and "nobody wins" when neither player can win any more.
  8. Played cards go to the bottom of the deck.
- **A switch for every [Open] point in the rules sheet.** The default is his latest words. The switches:
  - Section 1: does the shield grow with level? Does the hand grow?
  - Section 3: same time, or one leads?
  - Section 5: does "lose 1 card" happen once, or shrink the hand? Does "cannot defend" turn off the shield too?
  - Section 6: when a Spy may be played
  - Section 9: do upgrade bonuses add up?
  - and any choice Marc gives in Phase 0
- **The maths is the child's.** [Source: Marc, 21 November: "students should have to click check. We shouldn't show them the adding for them. They should do that on their own."]
  - The child works out their ship's attack: the parts' AP added up, plus the card's bonus.
  - The child works out the shield or the HP left after a hit.
  - When defending, the child splits the attack across their parts.
  - The page checks each answer, and never shows the sum first.
  - **A switch "show the sums", for adults trying rules,** off by default.
- **A round log** on the page: what each player played, the numbers, what changed. Marc can read it after a game.
- **The picture shows the battle:** both ships, their parts and HP, and the shield. It fills the picture area. The side holds the hand, the boxes and the buttons.
- **Stop. Report** the link, pictures at the three screen sizes, the independent review, and what is still open.

### Phase 2: into the game (only on Marc's word)

The player's own cards, fun battles and challenge battles. **Do not start this.** The main thread edits the game file, and two threads in one file collide.

---

## 4. Hard limits

- **One self-contained HTML file.** No library, no image files, no network. Ships and cards are drawn by code.
- **Names and pictures** are Marc's or new and original.
- **Touch-first on an iPad.** Test at 1180×745, 820×1180 and 390×760.
- **No student data.** Nothing is sent anywhere. A game in progress may be saved in the iPad's own browser storage only.

## 5. Checking your work

- **All of CLAUDE.md's "Before you say it is done" list.**
- **The rules engine, on thousands of computer-against-computer battles, for every combination of switches:**
  - no battle runs forever
  - "nobody wins" is found when it should be, and only then
  - HP and the shield never go below 0, and nothing carries over
  - a lost part's penalty always applies
  - each deck keeps its number of cards
- **A play test that plays as a child would:** wrong sums, a wrong split, leaving half-way and opening the page again, the two-player hand-over.
- **An independent reviewer at milestones:** a separate subagent that sees only the rules sheet, CLAUDE.md's checklist and your screenshots, never your code or reasoning. Fix until nothing is above "minor". Stop rule: a fault that survives three real fixes is written down as a known limit.
- **Do not run the game's full test suite.** It is paused.

## 6. Git and publishing

- **Repository:** `christopherfi-dev/galaxy_math_quest`. The default branch is `claude/trusting-edison-vl78nc`; GitHub Pages serves its `docs/` folder.
- **Your session has its own branch.** To put `docs/battle/` on the site, you need **one line from Marc**: permission to push your own files to the main branch.
- **Push only your own files:**
  - `docs/battle/*`
  - `prototypes/card_battle*.html`
  - `proposals/GMQ_Cards_Review_*`, `proposals/GMQ_Card_Battle_*` (new files)
  - `checks/battle_*`
  - your lines at the end of `INFO_FROM_MARC.md` and in `checks/RUN_ALL.md`
- **Never touch:**
  - `prototypes/kis_station_sketch.html`
  - `docs/index.html` (the class link)
  - `docs/next/index.html` (the preview)
  - the zip
- **Before each push,** merge the main branch: `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD`. Never force-push.
- **Another thread** (the Voltara fly-in) also adds files and lines at the end of `INFO_FROM_MARC.md`. When both add lines, keep both, in date order.

## 7. Marc's way of working (short)

- Short replies, plain English, short sentences, lists. Mark [Source], [Proposal] and [Conflict].
- Don't make his decisions. Give options with costs, and recommend one.
- Record every message from Marc at the end of `INFO_FROM_MARC.md`.
- Push back, and say what could prove you wrong.

## 8. Ask Marc first

1. "We do the Spy we do need the policeman": did you mean "Do we need the Spy and the Policeman?"
2. **Rules sheet, section 3:** same time, or does one player lead? (The page will have a switch, but your answer sets the default.)
3. **Against the computer, two children on one iPad, or both?**
4. **The cards:** may I read the "Card Prints and Images" folder in your Drive, read-only? Or will you upload the deck?
5. Which name do the children use for you, for messages on the page?
