# Elder Thimble and Pim, alive in the big world (sample)

**Date:** 24 November 2026. **For:** Marc. **Nothing in the game, or in the big world's own page, was changed.**

**Marc's ask** [Source: Marc, 24 November]: "You can do this: 'Put Elder Thimble and Pim into my copy of the big world now, with breathing, blinking, a hop when they talk, and faces that change with their words.'"

**Where to see it:** the sample of the big world (private page in my message; in this folder `prototypes/world_look_sample.html`). Walk to Mender Village. "Look: old" on the Ship panel shows the game's own drawing, as today.
- **On GitHub (25 November, with Marc's OK):** https://christopherfi-dev.github.io/galaxy_math_quest/lookdemo/ (`docs/lookdemo/index.html` on the main branch; add #skip to jump past the start). Nothing else on the main branch changed.

---

## 1. What they do

- **They stand where the game drew them,** in the village: Pim by the door, Elder Thimble by the pip store. Nothing they say, and nothing a child does, has changed.
- **Breathing:** a slow, small stretch up from the feet.
- **Blinking:** every 2.5 to 5 seconds. The eyelids are the face's own copper, with a dark line where they close.
- **A hop** at each new page of their words, with a small squash when they land, and a gentle bob while their words are up.
- **Their face follows their words.** Each line in the game has a feeling (section 3). A new line that is not in the table falls back on its last mark: "?" thinking, "!" happy.
- **Pim, until his spinner is given back: sad. After: playing with it.** [Proposal] What the child did shows in the picture (rule 4). Before, his sad face may make a child want to ask him what is wrong.

Seen in pictures at iPad sideways (1180 × 745), iPad upright (820 × 1180) and a phone (390 × 760), while each one talks and while they rest. A blink and a hop were checked frame by frame.

---

## 2. How it was made

- **From Marc's Gemini pictures:** Elder Thimble's calm front view and his four feelings; Pim's front view, his four feelings and his spinner picture. Eleven frames.
- **Cut out in code** (`prototypes/world_cast_build.py`):
  - white background: flood from the corners, then the white closed inside a handle loop (a white piece with no pupil inside it is a hole; a piece with a pupil is an eye)
  - green background: by colour, with the green tint taken off the edges
  - a thicker dark outline round each figure, to match the game's own line weight
  - one scale for all of a character's frames (the gold knob is the same size in every frame), feet on one line, a jump kept as a jump
  - the eyes found for blinking, and the face colour beside them
- **Size:** 145 KB of pictures in all. The sample grew from 305 KB to 505 KB (pictures are held inside the page as text).
- **On screen:** Elder Thimble about 130 pixels tall on an iPad held sideways, Pim about 95.

---

## 3. Their lines and faces [Proposal: the feelings are my reading of each line; change any]

**Elder Thimble** (five faces: calm, happy, worried, thinking, surprised)

| Line | Face |
|---|---|
| Sky visitor! Welcome. I am Elder Thimble. | happy |
| The Makers built machines for us, long ago… | thinking |
| When the Gate broke, every rule plate burnt black… | worried |
| One machine ate some of our pips! We do not dare to use them. | worried |
| Four machines stand in our meadow… | calm |
| You know how already: test it, write it down, then label it… | happy |
| You found a rule! Now I can trust you with these. | surprised |
| Here are our last … pips. Gold ones. Real ones. | calm |
| The bridge over the Rill went up when the Gate broke… | worried |
| The bridge has a lock: its pan… / The Makers made it so… | thinking |
| Use only a machine with a true plate. And our law… | calm |
| All four plates are true! We can use our machines again. | surprised |
| Those machines sort and count. The Year Machine… burnt. | worried |
| Look: our Rule Stone is glowing… | happy |
| Its light flies to the Gate on the mountain… | thinking |
| The other four are with the other peoples of Algora… | calm |
| And for you: (a card) | happy |
| What is that? Let me see. | surprised |
| This is no machine's plate. It is far too thick. | thinking |
| It is a piece of the Gate's own plate… | surprised |
| Keep it safe. One day you may stand at the Gate. | calm |
| You have made … of the 4 plates… | happy |
| The Rillfolk are over the river… | calm |
| The bridge pan still waits for its pips… | thinking |
| His painted board: Long ago I found the rule… / I poured in 2 buckets… / Was the rule "add 6"? Or "times 4"?… / So I poured in 3… / 3 times 4 is 12… / Now you… | happy / calm / thinking / thinking / happy / calm |

**Pim** (six faces: smiling, sad, overjoyed, secret, excited, playing with his spinner)

| Line | Face |
|---|---|
| Hello! I am Pim. | smiling |
| I lost my spinner by the pond. It is red. Have you seen it? | sad |
| Hello! I am Pim. Oh! That is my spinner! You found it! | overjoyed |
| Thank you! Want a secret? … / Push the old post, and the stones come up. Shh! | secret |
| Whee! Look at it spin! | playing with his spinner |
| The big kids cross the river north of the bridge… | secret |
| I can count to 100 by fives. Want to hear? | excited |
| A bottle? With a note? For ME? / "From Wim, of Mud Town." Wim! … | excited |
| Thank you, sky visitor! I will write back today. | overjoyed |

---

## 3b. The crowd [Marc's pictures 9 to 11, one try each]

**The pictures** (saved in `content/art_test_2026-11-24/`: `mender_9_sheet.png`, `mender_10_feelings.png`, `mender_11_things.png`):
- **The ordinary Mender** matches Elder Thimble and Pim: a lid that fits and sits straight, no beard, thin eyebrows, three fingers and a thumb in every frame (the thumbs-up and the hands on his cheeks too).
- **His copper** came out close to Pim's, not darker as asked. It does not matter: each Mender's copper is set in code.
- **The eight things** came out as separate pieces: straw hat (with a hole for the knob), apron, shawl, watering can, fishing rod (line and hook kept), a bundle of reeds (drawn with grain heads, like wheat), a basket of red fruit, a toolbox. They have a little more detail than the characters.
- **No words or numbers** anywhere.

**Made in code from one Mender** [Proposal]:

| Mender | Copper (the game's own) | Wears | Carries (on the ground beside) |
|---|---|---|---|
| the gardener | #c9793a | straw hat | watering can |
| the fisher | #b86a3a | | fishing rod |
| the Mender with big ears | #d08a4a | | |
| the old Mender | #a8683a | shawl, over the lid | |
| the reed cutter | #b8743a | | bundle of reeds |
| the orchard keeper | #c08040 | | basket of fruit |
| the Mender at the first lesson | #c9793a | | toolbox |

- **Their faces** follow their words by simple marks: thanks and welcomes happy; "Listen!" surprised; missing, tipping, losing worried; questions and "Shh" thinking.
- **Things they carry stand on the ground beside them,** so they stay put when the face and hands change. Worn things sit on the lid. The apron was not used: it would cover their hands.
- **Left as before:** the Mender with big ears has no big ears (a story question first); the Rillfolk (another people) and the well's Mender keep the game's drawing.

## 3c. The start, and talking on the map [Source: Marc, 24 November; built in the sample]

- **Land on the meadow first.** The story's last page ("You land in a green meadow…") shows the meadow: the ship, the cadet, and a Mender with his toolbox beside them. His welcome ("Welcome to Planet Algora…", "Before you go anywhere, let me show you how we work.") is said there. Then the practice machine with "We use machines like this one…", and the lesson as before. No new words. (`prototypes/world_opening_kit.js`)
- **"Skip the start"**, small, in the corner of the reading card: the story, the welcome and the first lesson at once. It shows only once this iPad has finished the start, so a child's first time keeps the story and the worked example; or when the link ends in #skip (for the teacher). After a skip, the Mender's last line of the lesson says where to go (Elder Thimble, in the village), and the skip is written in the mission report.
- **A Mender talking on the map grows about 1.35 times**, smoothly, and back when the words end, so the face and the hop can be seen. [Proposal, after Marc: "right now they're not really moving in any way"]
- **Waiting on Marc:** a short zoom to the speaker in the side scenes (the village, the first lesson).

## 3d. Hold to keep walking [Source: Marc, 25 November; built in the sample]

- **The trouble:** on a phone about ten squares show across, so a tap at the edge walks four or five steps, and a long walk is tap after tap.
- **Ways:** A hold to keep walking; B tap once and he walks on until something stops him (a wall, a fork, a sign, a person); C tap a place on the big map and he walks there.
- **Built: A** [Proposal: Claude's pick]. A tap works as before. A finger held a quarter of a second keeps him walking towards it; the view follows him, so the place under the finger keeps moving ahead and he walks on; slide to steer (he finds his way round water and trees); lift to stop. Holding never uses a thing. (`prototypes/world_walk_kit.js`)
- **Why A:** it answers "how would it stop" (the child lifts the finger); children know it from other games; nothing new on the screen; the child, not the game, decides where to stop. B lets the game decide (it may walk past what the child wanted). C skips the walk, where the finds are; it may still be good for long trips later.
- **Tests:** `checks/world_walk_test.js` passes on a phone and an iPad. With hold to walk in (25 November): `bigworld_reading_test.js` passes; `bigworld_signs_test.js` passes (48 walks); `bigworld_play_test.js` has only the 3 known faults ("no lesson at the ship after the story", the new start, by design) and passes everything else at all three sizes.

## 3e. The Rillfolk of the Reach: ready, waiting for pictures [Source: Marc, 25 November: "Can we try to upgrade the characters on the next village."]

- **Prompts 12 to 18:** `proposals/GMQ_Character_Test_Rillfolk_v1_2026-11-25.md`. Round 1 is the harbour (the keeper, the baker, the net weaver, the old singer). Round 2 is the map (the guard, the three speakers, the child).
- **Ready in the sample, before the pictures come** [Proposal]. Each one is drawn from a picture once its pictures are in; until then, the game's own drawing.
  - `prototypes/world_cast_build.py`: cuts them out. The Rillfolk have no knob, so the eyes set the scale and the middle. It builds only the characters whose pictures are in `content/art_test_2026-11-25/`.
  - `prototypes/world_cast_kit.js`: the same breathing, blinking, hop and faces by words as Elder Thimble. Their lines and faces are in the prompts note, section 4. The old singer sings once the rice is out.
  - `prototypes/world_look_build.js`: five lines changed: the four in the harbour, and the net weaver at her bench in the rope task.
- **Tried with stand-ins only:** the game's own Rillfolk drawing, drawn big on green and cut out the same way. Never published. `checks/world_rill_test.js` passes with them on three screens.
- **Found while checking:** the baker speaks only over his oven picture, so his faces are never seen in the harbour. Choice for Marc: put him in the oven picture too (as the net weaver is at her bench), or keep only his calm picture.

## 3f. A fault in "Skip the start", found and fixed (25 November)

- **The fault:** "Skip the start" showed on **every** reading card, even on a child's first time, and a tap on it later in the game started the skip again: it replaced the card being read and set the start as done. It was on the demo link.
- **Why it was missed:** my test checked the button's hidden setting, not whether it could be seen. My own style rule for the button overrode that setting.
- **Fixed:** the button is shown or hidden on each card by the kit itself, and a skip is refused after the start. `checks/world_opening_test.js` now checks what a child can see, on later cards too. It finds 10 faults in yesterday's copy, and none now.
- **The demo link was updated with Marc's OK** ("Update the demo link", 25 November; commit bd39c0b on the main branch, `docs/lookdemo/` only). Built on big world 13. Checked live at phone size: no skip button on a first time; with #skip it shows at the start, then never again; the pictures load; no errors. Big world 14 arrived during the tests; the demo follows it at its next update.

## 4. Tests

- `checks/world_look_check.js`: **passes.** Now also: both characters' pictures load and draw, and three lines get the right face.
- `checks/bigworld_reading_test.js` and `checks/bigworld_play_test.js` on the sample: see the end of this note.
- Not run: the game's own tests. The game was not touched.

---

## 5. What the big world thread would need, to take this in

1. **Its safety rule lets in no pictures at all** (`default-src 'none'`). Pictures held inside the page (`img-src data:`) must be allowed. Still, nothing is asked of the internet. (This is why the first try showed the old drawings.)
2. Paste `world_cast_sprites.js` and `world_cast_kit.js` into the page, and change two lines in the village scene (the build script shows which).
3. About 145 KB more in the page.

---

## 6. Decisions for you

1. **Do they look right in the village?** They are a different style from the drawn huts, bins and board around them. [Proposal: fine for now; the scene itself could be redrawn later.]
2. **The faces in section 3:** change any that feel wrong.
3. **Pim sad until his spinner comes back:** keep it?
4. **The crowd:** when your three pictures (9 to 11) come, I make the ordinary Menders from them, the same way.

---

## 7. What could prove this wrong

- **The children may watch the characters and not read.** Moving things pull the eye; the hop is short on purpose. Watch whether the reading card is still read.
- **A face that does not match the words** confuses more than no face. Check the table.
- **Speed on the older iPad:** the pictures are small, and each is drawn once a frame. Walk into the village on that iPad.
- **Mixed styles:** the drawn Mender at the first lesson, and the crowd on the map, still look like the old drawings.

---

## Results of the big world tests on this sample

- **With Elder Thimble and Pim** (24 November): `bigworld_reading_test.js` **passes** (59 s); `bigworld_play_test.js` **passes** at all three sizes, no faults (1074 s).
- **With the crowd as well** (24 November): `bigworld_reading_test.js` **passes** (60 s); `bigworld_signs_test.js` **passes** (48 walks); `bigworld_play_test.js` **passes** at all three sizes, no faults (1073 s).
- **With the new start** (the meadow welcome, Skip the start), 24 November:
  - `bigworld_reading_test.js` **passes**.
  - `bigworld_play_test.js`: **3 faults, one check, by design:** "no lesson at the ship after the story", at each size. That check expects the practice machine straight after the story; now the Mender's welcome on the meadow comes first. Everything after it passes at all three sizes (the lesson, the machines, the bridge, the old stones, closing and opening again).
  - `checks/world_opening_test.js` (new, mine) **passes** at all three sizes: it checks the new start in that check's place (the story; the welcome on the meadow, with no task and no walking away; then the practice machine and 3 making 5; Skip the start only once seen or with #skip, small inside the card; after a skip the cadet can walk, the Mender says where to go, and the report says it was skipped).
  - **If Marc takes the new start into the real big world,** the big world thread changes that one check to: after the story, two pages from "A Mender" on the meadow with no task open; then the lesson.
- `checks/world_look_check.js` **passes** with the crowd in.
- Pictures: `content/art_test_2026-11-24/cast_in_village.jpg` (the elder and Pim) and `content/art_test_2026-11-24/crowd_in_game.jpg` (the crowd).
