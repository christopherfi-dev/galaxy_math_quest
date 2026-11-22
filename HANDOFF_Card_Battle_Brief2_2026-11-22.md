# Battle thread: Marc's new brief (22 November)

**For:** the battle thread. Read `HANDOFF_Card_Battle_2026-11-22.md` first; this brief adds to it and changes its Phase 0. Where they differ, this one wins.
Everything is **[Proposal]** unless it says [Source].

---

## 1. What Marc asked for [Source: Marc, 2026-11-22]

> "I had the previous cards. But I need a remake. ... I think we can redesign the cards to make them better. The other thread needs to go through. Identify. Come up with like 50 cards. Mix of various kinds we can play with. The visuals. The mechanics. 5 cards. A shield, with HP. AP for the ship. The 5 engine parts. The kind (Standard, Lucky, etc., identified by colour border or colour card). The AP / HP of each. Etc. Something where I could practise playing against another CPU player."

In plain words, he wants:
1. **Go through the old cards** and identify which work and which do not.
2. **Design a new set of about 50 cards:** a mix of kinds, with their look (visuals) and what they do (mechanics), for him to choose from.
3. **A practice battle against a computer player,** using:
   - **a hand of 5 cards**
   - **a Main Shield with HP**
   - **the ship's AP:** the AP of its parts added up
   - **the 5 ship parts,** each of a **kind** (Standard, Lucky Draw and the others), **shown by the colour of its border or card,** with its own HP and AP

## 2. Where the old cards are: Marc's Google Drive, read-only

**Open only these.** Never open "Users Info", "Galaxy Math Quest - Users", anything in "Math Assessment Test", or "API information": they hold student data or keys. Never edit anything in the Drive.

**Folder "Galaxy Math Quest / Card Prints and Images"** (id `1d9On_iGCmCkYkWvVxcdHY_VJwAeO8yB8`):

| File | Kind | Id |
|---|---|---|
| ShipParts | sheet: 5 parts × 4 kinds, each with HP and AP | `16G2b-ZZSgBU9NlTOiBYBTBPJBB45fLeFSKMFdH4NWZA` |
| ShipParts.csv | the same, as a file | `17F1h2sR6NlZyl8IXHcf3Z-Os1bCsn16u` |
| Ship Parts Upgrade | sheet: Level 2 upgrade for each part (HP +4, AP +3) | `13-e_QOmqvMGE0PfdUKul5BXXdCpQLOTvdMXwMHxsJEY` |
| Cards.csv | the big card list (about 21 KB; probably July 2023) | `1BlbpJHdwxdwjE7M43Py396Y7kQU6hlBN` |
| Booster Cards - November | sheet | `148NqlChuZhza409BBMA-D-RZVIulOCjRTworBEAjph8` |
| Booster Cards | doc | `1QAfrrLs6-GX0gLGAOj6yvq6hA4pKncatqKqJ0ctZIgE` |
| Booster 2 | doc | `10pOF5P99pg4rfKB4rg3xCO62PcLW6ZvyOE51fzIeoa4` |
| Engine Cores | doc | `1IkOWQ5cbfYrX_GkAiIbjcCIvATfje4NVmazmgCgN9Gk` |
| Cards editing | doc | `1Sek_PWCKn8QjipYGFCKS-NMe-vkmBeJ9rb5p-8KvCHo` |
| Cards Print Out | sheet | `1rMgF3HZlg8A5lkCh_pcXQ1oLJn13H7mD9uviQ7vzomE` |
| FINAL DECK NOVEMBER CARDS DECK.pdf | the printed deck, Nov 2023 | `18xn5O9stm-WzhULu3yxvmgmiYvM-5Pn3` |
| New Cards.pdf | printed cards, Sept 2023 | `1KmMQkoo7S_wi9G64ypfKMDQ0pyXutRRH` |
| Booster Cards.pdf | printed booster cards, Aug 2023 | `1hMvYBhQQ9rJiELG1NsGAzG0GZh-IA13X` |
| ship parts print pdf.pdf | printed ship parts | `15RmTKHtSkXAATibngtll2VQJts8ciip9` |
| upgrade to level 2.pdf | printed upgrade cards | `1vRXzLnlXudLBuTrVl-w_spVyqWoyhGiq` |
| Universe Prints | folder | `1OWLcfMfDZG9zNTrs7QXMFHeGKSIVJ5qF` |

**Folder "Galaxy Math Quest / photos for cards"** (id `1WuqlQKW2jp11Vl6fja19FB3iOjinzq37`): the card pictures.
- shield.png
- HEART HEALTH.png
- a subfolder "spaceship parts" with navigation.png, shields.png and more, and an "old photos" folder
- More files are on later pages of the listing.

"It all adds up Daily Math problems" in the same folder is not about cards. Skip it.

## 3. What the main thread already noticed (check it; do not trust it)

**The ship parts** [Source: ShipParts sheet]. Four kinds for each part, for example the Engine Core:

| Kind | HP | AP |
|---|---|---|
| Quantum Reactor | 20 | 5 |
| Standard Reactor | 15 | 10 |
| Neutron Reactor | 25 | 0 |
| Lucky Draw: Stellar Reactor | 30 | 10 |

**[Conflict] A ship of five Standard parts.** From this sheet, Engine 15 + Power 15 + Weapons 10 + Navigation 15 + Shield Generator 20 = **75 HP**. Its AP is 10 + 10 + 15 + 5 + 0 = **40 AP**. The rules sheet says 100 HP and 55 AP. Recompute both, and ask Marc which is right.

**Descriptions that contradict their own numbers.** This is the "doesn't make much sense" problem:
- "Celestial Cartographer: the pinnacle of resilience" has HP 15, no more than the Standard Navigator.
- "Astrolabe Navigator... comes with reduced system resilience" has HP 25, more than the Standard.
- "Quantum Deflector... at the cost of slight durability" has HP 35, more than the Standard Shield's 20.
- Find every case like these, in every set.

**Upgrades:** Level 2 gives HP +4 and AP +3 to every part [Source: Ship Parts Upgrade]. Levels 3, 6 and 10 are in the rules sheet's open points.

## 4. What to make, in order. Stop and report after each.

### Step A: the review (a document)

- **Read every old set** (section 2). For the PDFs, look at the pages as pictures too: the old cards' look matters for the new visuals.
- **Make one spreadsheet** (`proposals/GMQ_Cards_Review_v1_<date>.csv`), one row per old card:
  - set, name, kind
  - effect, and numbers
  - which ship part it touches
  - **verdict:** keep, remake or drop, **with a reason**
- **Write a short note** (`proposals/GMQ_Cards_Review_v1_<date>.md`):
  - what works
  - what does not, with examples
  - the conflicts in section 3
  - **two or three options for a clear difference between common, rare and epic.** Marc: "There must be a clear difference."
  - Spy and Policeman: do they stay? (The first handoff, section 3, has the options and the "blind Policeman" idea.)

### Step B: the new set (a document and a picture page)

**About 50 cards** [Source: "like 50 cards. Mix of various kinds"], built from the cards Marc keeps, plus new ones where there are gaps.

- **Every card's mechanics fit Marc's rules sheet.** No card may need a rule he has not made. A card that needs a new rule is listed apart, as a question for him.
- **A suggested mix,** for him to change:
  - attack, defence, repair, upgrade, and Spy or Policeman if they stay
  - common, rare and epic in his old ratio (50%, 35%, 15%, if that still holds; it is an open point)
- **The ship-part cards:** 5 parts × their kinds (Standard, the two others, Lucky Draw).
  - **Each kind has one colour**, shown as the card's border or the whole card [Source: "identified by colour border or colour card"].
  - Fix the descriptions so they match the numbers.
- **The look:**
  - one card design, drawn by code (SVG), on a page Marc can open: `docs/battle/cards.html`
  - kind and rarity readable at a glance
  - numbers big enough for a child
  - **inspired by** his old cards' pictures, not copied
- **Stop. Report:** Marc picks and edits the set before any battle uses it.

### Step C: the practice battle against the computer

As in the first handoff's Phase 1, with Marc's set:
- **A hand of 5,** a Main Shield with HP, the ship's AP from its parts, and five parts with their kinds and colours.
- **Against a computer player.** Two children on one iPad can come later.
- **Every open rule is a switch.**
- **The child does the maths;** an adults' "show the sums" switch is off by default.

## 5. Unchanged from the first handoff

- **The rules are Marc's.**
- **Own files only** (`docs/battle/*`, `prototypes/card_battle*.html`, `proposals/GMQ_Cards_Review_*`, `proposals/GMQ_Card_Battle_*`, `checks/battle_*`). Never the game file, the class link, the preview, `HANDOFF_2026-11-20.md` or the zip. Section 2b of `HANDOFF_2026-11-20.md` explains why.
- **Before each push,** merge the main branch.
- **Pictures at three sizes, and an independent reviewer at milestones.**
