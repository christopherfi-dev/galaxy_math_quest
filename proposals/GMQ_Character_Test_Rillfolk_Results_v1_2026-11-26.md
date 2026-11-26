# Character test 4 results: the Rillfolk, in the Reach

**Date:** 26 November 2026. **For:** Marc. **Changed:** only the sample copy of the big world (`prototypes/world_look_sample.html`). The class game and the big world page are not touched.

**What Marc sent** [Source: Marc, 26 November]: six pictures from the prompts in `GMQ_Character_Test_Rillfolk_v1_2026-11-25.md`, at full size (2730 × 1536). Saved in `content/art_test_2026-11-25/`:
- `rill_12_keeper_sheet.png`: the harbour keeper, four views
- `rill_13_keeper_feelings.png`: her four feelings
- `rill_14_baker.png`, `rill_15_weaver.png`, `rill_16_singer.png`: four feelings each
- `rill_17_reach_calm.png`: the guard, the three speakers and the child, calm

**Still to come:** picture 18 (the same five, happy). Until it comes, the five stay calm.

**Tries:** one each, about 2 minutes at most [Source: Marc, 26 November: "1 each. One prompt. About 2 min max"]. As with the Menders, the time goes into checking, cutting out and fitting, not into Gemini.

**In the game:** `GMQ_Rillfolk_In_Game_v1_2026-11-26.jpg`.

---

## 1. The verdict

**Five of the six pictures are right, or close enough to use. The baker is the one that is off.** Every picture kept the Menders' drawing style, the green background cut away cleanly, and no picture has a word, a letter or a number in it.

---

## 2. Picture by picture

Checked against the prompts, and against the game's own words: "tall and smooth, like a drop of water, with a fin at each side and wide orange feet" [Built].

| Picture | Right | Off |
|---|---|---|
| 12, the keeper's sheet | Fins with no fingers; orange webbed feet with three toes; pale belly; navy cap with a peak; all four views | **She looks like an egg, not a drop.** The prompt hid the drop's point under her cap: my fault, not Gemini's |
| 13, her feelings | Happy and waving; worried with fins together; thinking with a fin at her chin; surprised with fins at her cheeks. The same size and look as picture 12 | — |
| 14, the baker | Baker's hat; apron; flour on the fins; the loaf; all four feelings | **Not a drop:** a tall bottle shape with long blue legs. Taller and thinner than the keeper; the prompt said "shorter and rounder". He looks like another people |
| 15, the net weaver | **The best of the six:** a clear drop; the net over her shoulders with her face and belly showing; the coil of rope; all four feelings | — |
| 16, the old singer | A drop; grey-blue; sleepy eyelids; white eyebrows; lines by her eyes; shawl; shells; her stick in every picture; sad, remembering, singing with her eyes shut and no notes in the air | Not "a little bent forward" (small). The shawl is cream, not white (fine) |
| 17, the five | The guard's reed helmet and his rope ("The Rillfolk guard beside it holds the rope" [Built]); red, yellow and brown sashes; Stilt Town's speaker tallest; Mud Town's roundest; the child small, with a raft pole | **The child's fin on the pole has a thumb.** About 60 pixels tall on the map, so hard to see. The sashes go round the middle, not from a shoulder (fine) |

**Penguins?** The keeper, the baker and the guard have flipper fins, orange feet and pale bellies. A child may say "penguin". None has a beak, feathers or a white face. I see no copy of a famous character, but **ask one other adult**, as the prompts note says. The drop-shaped ones (the net weaver, the singer, the speakers, the child) read as drops of water.

---

## 3. What is in the sample now

- **The harbour:** the keeper, the baker, the net weaver and the old singer, from your pictures, where the game drew them.
- **They move like Elder Thimble.** They breathe and blink, hop at each new page they say, and their faces follow their words. For example, the keeper is happy at "A visitor from the sky!", worried at "The high water is coming", and thinking at "Three towns have sent…".
- **The old singer** is sad at "My throat is dry". Once the fleet has sailed, she sings while she stands there: what the child did shows in the picture.
- **The net weaver** stands at her bench in the rope task.
- **On the map:**
  - the guard, the three speakers and the child, each keeping their size from the picture (the tall Stilt Town speaker, the small child)
  - each grows a little while talking
  - the keeper also marks the harbour on the map, where the game drew a small keeper before
- **"Look: old"** on the Ship panel still shows the game's own drawing.
- **The page grew by 256 KB,** to 943 KB.

**Built on big world 15,** the big world thread's newest, brought into this branch unchanged.

---

## 3b. The baker, again (26 November)

- **Marc sent the redo** from the prompt in section 5. Saved as `rill_14_baker.png`; the first is kept as `rill_14_baker_first.png`, and the game no longer uses it.
- **What changed:** the blue legs are gone. His round bottom now sits on short orange legs, like the others.
- **What did not:** everything above the apron. Only 2.9% of the pixels differ from the first picture. He is the same height and still bottle-shaped, not drop-shaped.
- **Why:** Gemini edits the last picture in a chat rather than drawing again. It changed what the prompt named most plainly (the legs) and kept the rest.
- **In the game:** at harbour size he now reads as one of the same people, slimmer than the net weaver and the keeper. In the sample now; the Rillfolk and look checks pass.
- **If a drop-shaped baker is wanted** [Proposal]: use that editing habit. Ask Gemini to start from the net weaver (picture 15) and turn her into the baker. The prompt is in the chat of 26 November.

## 3c. The baker, a third time (26 November): the one in the game

- **Marc sent a third baker.** This one has the drop shape: a rounded point under the hat, shorter and rounder than the keeper, with short orange legs. He keeps his apron, the flour on his fins, the loaf and his four feelings. Saved as `rill_14_baker.png`; the second is kept as `rill_14_baker_second.png`.
- **Found while cutting him out:** the loaf in the second figure overlaps the first figure's fin from left to right, so the cutter (which splits a picture at empty columns) saw 3 figures, not 4. It now separates figures by shape when that happens, and cuts each one out without its neighbour's loaf. No other character's cut-out changed (checked).
- **In the game:** the harbour now reads as one people. The Rillfolk and look checks pass.

## 4. Tests

- `checks/world_rill_test.js` passes on three screens, with your pictures.
- `world_opening_test.js`, `world_walk_test.js` and `world_look_check.js` pass. The look check expected five faces for every character; the Rillfolk have one to five, so the check now asks the right question of each.
- The big world thread's tests on this copy: `bigworld_reading_test.js`, `bigworld_signs_test.js`, `bigworld_board_test.js` and `bigworld_picture_words_check.js` all pass.
- `bigworld_play_test.js`: only the 3 known faults (section 7).

---

## 5. Decisions for you

1. **Redo the baker?** Done: the third picture is in (section 3c). He stands next to the net weaver in the harbour, and he looks like another people. The prompt is below.
2. **The keeper's egg shape:** keep it, or redo pictures 12 and 13 with the drop's point showing? [Proposal: keep. She reads well as the boss, and the drops around her make the people clear.]
3. **The child's thumb:** redo picture 17, or let it be? [Proposal: let it be. It is too small to see on the map.]
4. **The baker in the oven picture** (from the prompts note): put him there, so his faces are seen? Or keep only his calm picture in the harbour?
5. **The demo link:** shall I put this on it?

### Prompt 14, again (the baker), if you want it

```
PICTURE 14 AGAIN: THE BAKER.
Please redraw the baker from picture 14. Keep his white baker's hat, his white apron, the flour on his fins, his light sky blue and his four feelings. Change only his body: give him the same water-drop body as the net weaver in picture 15 (a rounded point at the top, here under the hat, widening to a full, round bottom), shorter and rounder than the harbour keeper. No blue legs: the same short orange legs and wide orange webbed feet as the other Rillfolk, coming straight out from under the round bottom.

One wide picture (16:9), plain flat bright green background (#00FF00), no shadow, no words. Show him four times in a row, all the same size, whole body, turned three-quarters to the right:
1. CALM: a gentle smile, fins resting at the sides
2. HAPPY: a big smile, holding up one round loaf of brown bread in one fin
3. WORRIED: eyebrows raised in the middle, a small frown, both fins held together in front of the apron
4. THINKING: eyes looking up and to one side, the tip of one fin touching the chin
Fins only: no fingers, no hands, no thumbs.
```

---

## 6. What could prove this wrong

- **A child may call them penguins.** Ask your class, "What are these?", before telling them.
- **The page is near 1 MB.** Open it on the oldest iPad in the class, over the school's Wi-Fi.
- **The faces are my reading of each line.** If one feels wrong, say which, and it is one line to change.

---

## 7. The play test

`bigworld_play_test.js` on this copy, at all three sizes: **only the 3 known faults**, one for each screen: "no lesson at the ship after the story". That is the new start (the welcome on the meadow comes first), by design. Everything else passes.
