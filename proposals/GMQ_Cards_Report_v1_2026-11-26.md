# Cards a child can earn, read and collect: what is built

**Date:** 26 November 2026. **From:** the cards thread. **For:** Marc, and the main thread.
**Link (once pushed):** https://christopherfi-dev.github.io/galaxy_math_quest/cards/ (its own page; the game is not changed)
**Zip:** `proposals/GMQ_Cards_v1_2026-11-26.zip` (the page, the four checks, this report, the wiring note, and pictures)
Everything is **[Proposal]** unless it says [Source]. My choices without you are marked **[pick]**.

[Source: you, 26 November: "when people do get cards and the space station that it shows what card they received like it pops up or something and they can actually read the card and see like what it does... It'd be cool if they can actually start collecting their own cards in their demo play through."]

**The card list is the battle thread's new catalogue** (`docs/battle/cards.json`, landed today): 93 battle cards (44 common, 40 rare, 9 epic), 20 ship parts and 5 upgrades. The faces are the battle thread's own drawing. This piece never changes what a card does.

---

## 1. What a child does

**When a card is earned**
1. The task ends as today. The game's words come first ("You earn a card.").
2. Then the card **fills the picture.** It rises face down, turns over, and its words appear. That takes 1.3 seconds. A tap on the picture skips it.
3. Beside the card (under it, when the picture is tall and narrow):
   - "A new card!" and the card's name
   - its kind: **Common card**, **Rare card** or **Epic card**, in the rim's colour (green, purple, gold, as on your 2023 cards). An epic card has gold rays behind it.
   - **What it does:** the card's own words, then one plain line: "An attack card. In a battle, it makes your ship hit harder."
   - **Why you got it:** "For the Energy Grid task, in the Shield Bay."
   - "Cards found: 9 of 93"
4. **The desk holds only two buttons:** "Add to my cards" and "Read to me". Add waits while a bar fills, for the game's own reading time (half a second, and 0.16 seconds a word, at most 3.5 seconds). [Source: your rule for reading cards, 24 November: they must wait, "to force them to read".]
5. Add: the card shrinks away into the book. The picture is the game's again.

**A double** says so: "A double! You already have this card. Now you have 2." Then what a double is for (decision 3). The count of cards found does not go up.

**Closed by mistake?** The card is saved the moment it is earned, marked "not yet seen". If the iPad closes the game before Add, the card shows again when the game opens. Once added, it does not.

**The card book** (what My cards opens)
- It fills the picture. "My cards" and "Cards found: 9 of 93" at the top.
- Grouped by kind: Common, Rare, Epic. In each, **the child's own cards first,** big, with their names under them. A double shows "×2". The newest card glows and says "New".
- Then **"Still to find: 38"** and a small empty shape with a "?" for each card not found. No name, no picture, no words: nothing of a card shows before it is earned. A check reads the whole page to make sure.
- Tap a card: it opens big, with what it does and how the child got it. "Before" and "Next" step through their own cards. "Back to my cards" returns to the same place.
- The desk: "Common", "Rare", "Epic" (jump there), and "Close my cards".
- With no cards: "No cards yet. Finish a task to earn your first card." It works with 0, 2 and 150 cards, on a phone.
- A card earned but not yet seen waits at the top, face down: "New! Tap it." Its name is not shown until it is turned.

**Challenge battles, later** [Source: you, 23 November: each child puts up one rare or epic card; the winner gets both]
- A card won shows like any card earned: "Won in a challenge battle."
- A card lost shows once, greyed, with a red band: "Goes to your classmate." Then "You still have 1", or "Its place in your book is empty again. You can find it again." After OK it leaves the book, and it can be found again later.

## 2. Which card a child gets

- **The kind** comes from the game's odds, as today: common 70, rare 25, epic 5 in 100. Projects still give an epic card.
- **The card** is random within its kind, so two children's books differ. After the station's 15 cards, all 20,000 made-up children had different books.
- **Fewer doubles [pick, rule B]:** 4 times in 5 the card is one the child does not have yet; the 5th time it is any card of that kind, so it may be a double. **And never two doubles in a row** of one kind while that kind has cards left to find. Rules A and C are below (decision 4).

**What 20,000 made-up children show** (`checks/cards_pick_check.js`, the 93 battle cards):

| Rule | Common cards needed to fill the 44 commons | Doubles on the way | Longest run of doubles while cards are left |
|---|---|---|---|
| A: never a double while cards are left | 44, always | 0 | 0 |
| **B: 4 in 5 new, never two doubles in a row [pick]** | **48.3 on average; 52 for 95 children in 100; 58 at most** | **4.3 on average** | **1** |
| C: any card (as the game does today) | 193 on average; 611 at most | 149 on average | 445 |

- **Nobody gets stuck on doubles under A or B.** Under C, today's rule, one made-up child needed 611 common cards to find all 44.
- **Without the "never two in a row" part,** rule B gave 8 children in 100 three or more doubles in a row near the end of the commons, and one made-up child 8 in a row. That is why it was added.
- **Over a whole game** (the station first; 6 epic cards from projects among them), under B: after 30 cards a child holds 22 of 44 commons, 5 of 40 rares and 2 of 9 epics. After 60 cards: 40, 11 and 5. After 100: all 44 commons, 20 rares, 8 epics. **After about 100 cards, every common card is a double.** How many cards a whole game gives is the battle thread's count; if it is near 100, the commons fill up before the end.

## 3. The starter pack: 15 cards on the KIS Station

[Source: you, 23 November: "every child earns 15 cards on the KIS Station, always with 1 Spy, 1 Policeman, 1 epic and 1 rare."]
- **The rule is the battle thread's** (in its card list): the Spy, the Policeman (Station Guard), 1 epic, 1 rare, 4 attack, 4 shield and 3 repair cards, no card twice. A child's pack is drawn from their own seed. The battle lends from that same pack to a child with fewer than 15 cards.
- **This piece uses the battle thread's own code to draw the pack** (copied as it is; a check compares them). So the station gives each child exactly the pack the battle knows.
- **One card after each task [pick, decision 1 A]:** the pack's cards come in a random order, one per task. Secrets found between tasks give their own cards and do not change the pack.
- **On 20,000 made-up children** (with 0 to 6 secrets found between tasks): the 15 station cards are always exactly the child's pack, the same pack the battle thread's code draws for that child. Every child gets the Spy, the Policeman, exactly 1 rare and exactly 1 epic, and no card twice. The epic comes at any task, about equally (1 child in 15 at each task).
- **As one pack** (decision 1 B): 15 cards face down fill the picture. Tap each to turn it, or "Turn them all". Tap a turned card to read it. Then "Add them to my cards".
- **One thing the game must add:** a seed that never changes, kept in the save (`S.packSeed`). The game's seed (`S.seed`) changes every time the game picks a number. The battle thread's wiring note passes `S.seed`, which would give a different pack each time. Both pieces should get `S.packSeed`. (Wiring note, 3.3.)
- A list with no starter rule (an older one) falls back to a stand-in of mine: the four sure cards at random tasks, the rest by the game's odds. It is checked too.

## 4. Old saved games

Your class started fresh on 23 November (version 93), so children hold only cards earned since then, with the 6 old names (Laser Cannon, Stealth Mode, Asteroid Assault, Quantum Quell, Void Vortex, Nebula Nova). Three ways, all built (decision 2):

| Way | What the child sees | Cost |
|---|---|---|
| **Keep** | Nothing changes. The book shows them under "First cards", with the game's own small pictures: "One of your first cards, from before the new set." | They have no battle words. A child part-way through the station may miss sure cards: with 13 tasks done, 47 in 100 still get all four; with 14 done, none. |
| **Swap [pick]** | Once, when the game opens: "The cards are new! Each of your old cards is a new card now, of the same kind." The cards come face down, as a pack. | The old names go. Each new card remembers its old name ("Your first card, Stealth Mode, is this card now"). |
| **Map** | As swap, but Laser Cannon becomes Spark Shot and Nebula Nova becomes Repair Bay (the battle thread's cards that grew from them). The other four are swapped. | Every child's Laser Cannon becomes the same card. |

- A swap never makes a double when it can avoid one, and it happens once. Old cards first fill the sure cards still missing (the Spy, the Policeman, a rare, an epic). So 99 to 100 children in 100 part-way through the station still end it with all four.
- A child part-way through the station gets the rest of their pack, one card per task left; the sure cards come first only when there are too few tasks left for them.

## 5. What the checks found, and what I looked at

**Ran, all pass:**
- `node checks/cards_pick_check.js 20000`: everything in sections 2 to 4, on the battle thread's list and on a made-up flat list of 140 cards with no starter rule. About 8 minutes.
- `node checks/cards_page_test.js`: 240 checks, at iPad sideways (1180 × 745), iPad upright (820 × 1180) and phone (390 × 760). A card earned (with the real animation: 1.3 seconds, under the 2 allowed), a tap to skip, the reading wait; the page closed and opened again; a double; the longest card's words with a long reason; **all 118 cards, one by one, at each size:** no line runs off a card, the words beside it need no scrolling, and they are the card's own; the book with 0, 2 and 150 cards; no name of a card not found anywhere in the page; a card waiting in the book; the station's 15 cards, one per task and as one pack, are the child's own pack; old saves (all three ways); a challenge won and lost; the desk taken by something else.
- `node checks/cards_in_game_test.js`: 57 checks. It opens **the real game file** (without changing it), adds the piece and a host made of the game's own functions, at the three sizes. The card covers the game's picture exactly, and its place name. The game's desk shows only the two buttons. A reading card opened meanwhile sits on top. After Add, the card is in the game's save, under the same save key, and the old My cards list still draws it. The book with 2 and 150 cards. The game closed and opened again: the card still waits. The game taking its desk back: the card steps aside and still waits.
- `node checks/cards_sync_check.js`: the card faces and the starter pack are drawn with the battle thread's own code, and the list is its list.
- `node checks/parse_check.js docs/cards/index.html`: parses, with neither of the two signs older iPads cannot read.

**Looked at, as pictures:** every screen of the page test at all three sizes (15 screens each), the in-game screens at all three sizes, and the animation frame by frame. **Found and fixed by looking:**
- On a phone, the card was laid out for a desk that had since shrunk: it now fits again whenever the picture changes size.
- The epic card's gold rays lay under the words beside it: they now stay round the card.
- A child with 2 cards saw a page of empty shapes and had to scroll to find them: their own cards now come first, and the shapes still to find are small.
- The "New" and "×2" marks covered parts of a card's name or its kind: "New" now sits beside the name under the card, and "×2" on the card's bottom corner.
- My own comment held the two signs the game's parse check rejects: reworded, or the game would have failed its check once the piece was copied in.

**Not run, and why:**
- The game's own play tests: the game is not changed. **When the piece is wired in, the pop-up will sit on the picture after almost every task;** tests that tap the picture need a switch (the wiring note, 3.2).
- A real old iPad. Only Chromium was used. The piece avoids features old Safari lacks (no `inset`, no flex `gap`); the turning card uses the `-webkit-` words too. Untested there.
- Sound and "Read to me" were not heard; they use the game's own `beep` and `speak`.
- The why words for each place in the game (wiring note, 3.4) were written from the code, not played.
- The battle thread's own checks: none of its files were changed.

## 6. What could prove this wrong

- **Children tap Add without reading.** Watch two or three children. Do they read "What it does"? If not, the wait does not help, and the words may be too many.
- **Fifteen pop-ups on the station may slow the start,** with "Choose your part" after each third task. Watch whether a child loses the thread of the station. Decision 1 B (one pack at the end) is the other way.
- **Cards may become the point, not the maths.** The empty shapes invite collecting. Every card still comes only from a task.
- **The words beside the card are mine.** "In a battle, it makes your ship hit harder" must match your rules. The battle thread should read all eight lines (`GMQCards.words.type`).
- **A double means little until battles come.** Its words promise something (decision 3).
- **118 drawn cards on an old iPad** may be slow to open. On this computer the book of 150 opened in under 3 seconds; an old iPad is slower.

## 7. Decisions for you

**Answered for you overnight by the main thread** [Source: you, 26 November, to the main thread: "Threads keep waiting for me to decide lots of things. How do I share that resposivikty with you..."; the main thread's rule: only answers that can be undone, never your battle rules or your names]. Each is marked **[Main thread for Marc, 26 November night: undo if you disagree]**. All match my picks; the piece already does each one, so nothing was rebuilt.

| # | Answer | Can be undone by |
|---|---|---|
| 1 | One card after each task (A). | Building option B or C instead; the pack screen is already built. |
| 2 | Old saved games: swap. Each new card keeps its old name (`was`). | Each swapped card keeps its old name (`was`), so it can be turned back; or choose keep or map before the game is wired. |
| 3 | A double is a spare (A): a rare or epic spare for a challenge battle, a common spare for your own deck. | Changing two lines of words (`GMQCards.words.dup`). |
| 4 | Doubles: B, 4 in 5 new, never two doubles in a row. | One word (`GMQCards.rule.doubles`: 'A' or 'C'). |
| 5 | The starter pack: exactly 1 epic and 1 rare, as built (the battle thread's rule). | Changing the rule in the battle thread's list. |
| 6 | The wait on Add: kept (your reading-card rule of 24 November). | One line (`GMQCards.rule.wait`). |

**The name, 28 November:** Station Guard [Source: your "Yes" of 28 November to the main thread's picks, as the main thread read it]. The battle thread changed the card's label to GUARD; the cards page took the new drawing and list, and the line beside the card now says "A Guard card. In a battle, it stops a Spy card."

**Still yours:** decision 7 (ship parts stay out of the book until the numbers agree).

The options as first laid out:

1. **How the station's 15 cards arrive.**
   - **A [pick]:** one card after each task, as today. The reward follows the work.
   - B: no card per task; one pack of 15 after the last task. A big moment, but 15 tasks with no reward.
   - C: a small pack of 3 when each ship part is fitted. The piece can do it (a pack of 3); not shown on the page.
2. **Old saved games:** keep, **swap [pick]**, or map (section 4).
3. **What a double is for.**
   - **A [pick, the words today]:** a spare. A rare or epic spare can be put up in a challenge battle without losing the card. A common spare goes in your own deck too. (The battle thread's deck rule already says a card owned twice is in the deck twice.)
   - B: a double can be given to a classmate who does not have it. Kind, but it needs the server, and it is near trading.
   - C: nothing special; the rule just makes doubles rare.
   - D: a double turns into practice credits. This goes against your rule that cards are not swapped.
4. **Doubles:** A (never while cards are left), **B (4 in 5 new, never two in a row) [pick]**, or C (as today).
5. **The starter pack.** The battle thread's rule gives exactly 1 rare and 1 epic, and 4 attack, 4 shield, 3 repair (its proposal). Is "1 epic and 1 rare" exactly one, as built? **[Conflict]** you say Policeman; the card says "Station Guard" and "POLICE". Which name?
6. **The wait on Add** (the game's reading time, up to 3.5 seconds): keep it?
7. **Ship parts in the book.** **[Conflict]** The game's ship parts (`PVER`) and the battle thread's 20 part cards have the same names but different numbers and kinds. Neutron Reactor is 15 HP and 0 AP in the game, 25 and 0 on its card. The game's four tiers are red, green, light blue and gold; the cards' are Standard, Guardian, Striker and Lucky Draw. The book can show a child's five parts, but not until the numbers agree. For you and the battle thread.

## 8. Found on the way, for other threads

- **The battle thread and the main thread: the starter pack's seed.** The battle's wiring note passes `S.seed`, which changes every time the game picks a number, so the pack would change too. Keep one seed in the save (`S.packSeed`) and give it to both pieces.
- **The battle thread:** "Count the other cards in your hand" (Card Wall, Nano Shield and others) is a battle word a child meets before any battle. The pop-up shows it on the first day.
- **The battle thread:** there is one Policeman card (Station Guard). Your deck rule lends one when a deck has fewer Guards than Spies, so a battle works. In the book, a child owns at most a few Guards; that is fine.
- **The main thread:** on an upright iPad the game's desk keeps its fixed size, so the picture is about 580 pixels tall while a card shows; the card still fits, about 340 pixels wide. On a phone, the word rows (Look, Take...) stay under the desk while a card shows. A tap there takes the desk; the card steps aside and waits.

## 9. Message for the main thread, to paste

> From the cards thread, 26 November. The card pop-up and the card book are built as one piece, `GMQCards`, on their own page (`docs/cards/index.html`, between the `GMQ CARDS` markers). It reads the battle thread's catalogue (`cards.json`: 93 battle cards) and draws the faces and the starter pack with the battle thread's own code. A card earned fills the picture, turns over, and says what it does and why it was given; the desk holds only "Add to my cards" and "Read to me". The book shows a child's own cards first, by kind, then small empty shapes for cards still to find; no card shows before it is earned. The station's 15 cards are exactly the child's starter pack, one per task. Checks: `cards_pick_check.js` (20,000 children), `cards_page_test.js` (240 checks, three sizes), `cards_in_game_test.js` (the piece inside the real game file, 57 checks), `cards_sync_check.js`. All pass. How to wire it: `proposals/GMQ_Cards_Wiring_v1_2026-11-26.md`. Two things before wiring: keep one seed in the save (`S.packSeed`) and pass it to the battle piece too, not `S.seed`; and use the answers to decisions 1 to 6 (section 7: given overnight by the main thread for Marc, undoable). Tests that tap the picture after a task need `window.GMQ_NO_CARDPOP`, or they will tap the card.
