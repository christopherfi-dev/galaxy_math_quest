# What the look thread did overnight (26 November)

**For:** Marc, in the morning. **Your brief:** "Push what you can. Keep checking for updates. You have 3 hours to work. While I'm sleeping."

**Your class game is not changed.** Everything below is on the demo links or in notes. The master thread puts it into the game when you say so.

---

## 1. Look at these (each takes a minute)

| Link | What it is |
|---|---|
| https://christopherfi-dev.github.io/galaxy_math_quest/lookdemo/cards/ | **Every card's picture** (all 118), beside its name and words |
| https://christopherfi-dev.github.io/galaxy_math_quest/lookdemo/worlds/ | **Chronosia's map and Stardust's ship in a new look.** Open Teacher, tap "Go to Chronosia" or "Go to Stardust". "World look: new/old" compares |
| https://christopherfi-dev.github.io/galaxy_math_quest/lookdemo/ | Algora with the Menders and the Rillfolk (unchanged tonight) |

Pictures, if you would rather not open links:
- `proposals/GMQ_Card_Face_Option_A_v1_2026-11-26.jpg`: a card's face with its own picture;
- `proposals/GMQ_Chronosia_Old_New_v1_2026-11-26.jpg`: Chronosia old and new;
- `proposals/GMQ_Stardust_Old_New_v1_2026-11-26.jpg`: Stardust old and new.

---

## 2. What was done

1. **Card pictures, all 118** (93 battle cards, 20 ship parts, 5 upgrades).
   - **Why now:** the battle thread's card list landed tonight, and the master thread's plan said the card pictures start then.
   - **How:** drawn in code, in one style, 36 KB in all.
   - **Every number is exact:** a check counts what each picture shows against the card's words (50 numbers).
   - **The countable-group rule:** when a picture shows a group you could count, it is the card's own number. Moon Rock Wall blocks 11, so 11 rocks; Rally Cry adds 5, so 5 hearts.
   - Note: `GMQ_Card_Art_v1_2026-11-26.md`.
2. **Chronosia's map in the new look:** soft grass, a rounded path, river banks, a railed bridge, mountains with snow, round trees. Every square, ripple and place is as before. The game's own Chronosia tests pass on it. Note: `GMQ_Worlds_Look_v1_2026-11-26.md`.
3. **Xylophora left as it is, on purpose:** "The ground is a patchwork of squares", and its area tasks count those squares.
4. **Kept up to date:** your class link moved to version 101 during the night, so the worlds copy was rebuilt on 101 and tested again. The battle thread reworded its card list, so the card check ran again and passed.
5. **Gemini prompts for Voltara's and Chronosia's characters:** see section 4.

---

## 3. Decisions waiting for you

1. **Where a card's picture goes on its face** (`GMQ_Card_Art_v1_2026-11-26.md`, section 5b):
   - **A:** in place of the type's symbol (my pick);
   - **B:** the picture, with the symbol small in a corner;
   - **C:** only in the card book.
2. **The "count your working parts" cards** (All Hands Fire, Five-Part Swarm) show five things, true only at full health. Keep the words, or ask the battle thread to name no count?
3. **The card pictures' style and the rule for numbers:** keep them?
4. **Chronosia and Stardust:** should the master thread put the new looks into the class game?
5. **Still from before:** pictures 18 (the Rillfolk, happy) and 19 to 21 (Stardust's objects and the Supply Chief).

---

## 4. For the morning: Gemini prompts for Voltara's and Chronosia's characters

*(Section filled in below when the prompts are written.)*

---

## 5. Tests run tonight

| What | Result |
|---|---|
| `checks/card_art_check.js` | passes: 118 pictures, 50 numbers |
| The game's `chronosia_test.js`, `chronosia_story_test.js`, `chronosia_links_test.js`, `stardust_test.js`, on the worlds copy (versions 100 and 101) | all pass |
| Each demo link opened live on a phone and an iPad | no errors; the same file as the tested copy |

---

## 6. One thing I got wrong tonight, and fixed

- **The fault:** my push script treated a refused push as a success. Another thread had pushed in the same minute, so the worlds page did not go up the first time.
- **How it was caught:** the live check showed the page had not changed.
- **The fix:** the script now checks that the main branch really has the commit. Every page above was checked live after its push.
