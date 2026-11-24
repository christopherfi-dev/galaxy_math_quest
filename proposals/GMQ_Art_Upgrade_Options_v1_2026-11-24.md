# Making GMQ look better: what AI can and cannot do

**Date:** 24 November 2026. **For:** Marc. **Nothing in the game was changed.**

**Marc's question** [Source: Marc, 24 November, with a 3.5-second phone clip of Prodigy on an iPad]: "How possible / difficult would it be to upgrade our appearance to make it more attractive? Our POV is different than [Prodigy], but it does look better? I think with AI today that AI can actually make … individual art and characters and aliens a bit better if it's focused on doing that? … Push back if you have to."

Read as (voice): "math prodigies" = the game Prodigy Math. "POV" = point of view, the angle the world is seen from.

---

## 0. The short answer

- **Yes, it is possible.** Starting is easy. Doing it well across the whole game is the hard part.
- **The biggest win is the characters and aliens.** Today they are almost missing.
- **I (Claude) cannot paint pictures.** I draw with code. An image AI can paint (Gemini, which you already use, is one of the best). I can direct it, check every picture, and fit the pictures into the game.
- **My proposal: paint the world, keep the maths drawn in code.** Clocks, grids, coins and number lines must stay exact and plain.
- **Pushback:** eight points in section 6. The main one: Prodigy's look comes with hooks you do not want, and a half-painted game looks worse than a plain one.

---

## 1. What your clip shows

I looked at 7 still frames from the clip. I did not listen to it.

- **The screen:** Prodigy's level map. A painted scene from the side: green hills, a log bridge with rope, flags, purple crystal rocks, a pink and purple sky, a hot-air balloon, a floating island. A cute blue pet stands on level 139.
- **How it is drawn:**
  - thick dark outlines on everything
  - soft colour that fades from light to dark on each shape
  - three or four layers of depth (rocks in front, hills, far mountains, sky)
  - glow and sparkle on the things to tap (gold trophies, a glowing portal)
  - one strong colour family (purple, pink, gold)
- **The hooks around it:**
  - a green **"Play (16s)"** button that counts down and starts the next level by itself
  - a **Weekly Leaders** board with "Claim reward"
  - **High Scores**, "Silver winner", a trophy on every level
  - **Badges** and a **Stable** of pets
- **What I could not see:** any movement (the clip is too short), the sound, and what happens when you tap Play.

---

## 2. Why GMQ looks plainer today

I checked the game file (version 97) and took pictures at iPad sideways size (1180 × 745). [Source: the game file]

- **There is no picture file in the game.** Every picture is drawn by code: shapes, lines and colour fills.
- **Where one picture got real time, it is good.** Voltara's meadow has depth, light, a rainbow, a ringed planet and glowing trees.
- **Where a place was drawn fast, it looks like a board.** Chronosia, Xylophora and the mission ship are flat squares, one tree stamp in a row, and a lot of dark mist. The art review of 20 November said the same (`proposals/GMQ_Art_Review_v1_2026-11-20.md`). It is still true.
- **The people:**
  - The cadet is the only real character.
  - Most aliens are a coloured oval with two eyes (`alienGuy`). Chronosia's people are that oval with a name label (`cPerson`).
  - The Site Chief is drawn the same shape as the cadet.
- **So the gap with Prodigy is not "AI against people".** It is "shapes typed as code" against "paintings made by a team of artists".

---

## 3. The point of view is not the problem

- Prodigy's map is seen from the side. GMQ has two views:
  - **from the side:** Voltara, the 20 small worlds
  - **from above:** the station, Chronosia, Xylophora, the mission ship
- **A view from above can look rich.** Most such games use a "three-quarter view":
  - the ground is seen from above
  - trees, buildings and people stand up and show their fronts
  - shadows, light, and things in clumps, not in rows
- **The squares can stay underneath** for walking.
- **On Xylophora the squares must stay visible.** There, the squares are the maths.
- The station already does a little of this. Chronosia and Xylophora do none of it.

---

## 4. What AI can do today

There are two kinds of AI here. They do different jobs.

### An image AI paints

Examples: Gemini's image models (Nano Banana Pro, Nano Banana 2), ChatGPT images, Midjourney, Leonardo.

- **Good at:** painted scenes, glowing light, cute or strange creatures, at a finish close to Prodigy's.
- **Better than a year ago:** keeping one character the same across many pictures, from a reference picture. Google says up to five characters can stay the same in one picture. [Source: web reviews, many written by the tool makers. **I have not tested this.**]
- **Still weak at:**
  - exact counts (7 crates may come out as 8)
  - clock hands, squares that line up, numbers, words on signs
  - the same place drawn twice from another angle
  - a set of 30 pictures that truly match each other
  - frames for movement (walking, blinking)

### Claude writes code

- **I cannot make a painting.** My best is what you see on Voltara's meadow.
- **What I can do in an art job:**
  - write the **art bible**: the colours, light and line for the game, and the shapes for each planet and each people
  - write the prompts, so every picture follows the bible
  - look at each picture and list its faults: an extra door, a sign with nonsense words, a hand with six fingers, a picture that disagrees with the words
  - cut the pictures into the game, put the tappable things on them, and test at three sizes

**You are right on one point.** A thread whose only job is the art does better. Two signs of it:
- Voltara's meadow, where a thread spent its time on one picture.
- The Atlantis project you sent (21 November): a brief, an art bible, concept pictures from an image AI, code by Claude, and a critic who saw only the bible and the pictures.

---

## 5. Paint the world, draw the maths [Proposal]

| Painted by an image AI | Drawn in code, as now |
|---|---|
| each place's background | clocks, number lines, grids, the area mat |
| each people and each alien, with 3 or 4 faces (happy, worried, thinking) | coins, charts, scales, weights |
| arrival screens | anything a child counts or reads |
| card art | the walking squares and the tappable spots |

**Why the line falls there:**
- **Your rule:** the picture shows the task. The maths object must be clear and exact. An image AI cannot promise either.
- **What research says** (check it yourself; I give the gist):
  - **Real-looking money:** children did word problems with real-looking bills and coins. The money helped them understand some problems, but they made more counting slips. Later papers cite it as showing children get caught up in the details of rich-looking objects. [Source: McNeil, Uttal, Jarvin & Sternberg, 2009. **I could not read the full paper.**]
  - **A busy classroom:** kindergarten children in a heavily decorated room looked away more and learned less than in a plain room. [Source: Fisher, Godwin & Seltman, 2014.]
- **So:** a beautiful world around a plain maths object is fine. A beautiful maths object is not.

---

## 6. Pushback

1. **Prodigy's beauty is paid for by its business.**
   - In 2021, 22 child-advocacy groups asked the US Federal Trade Commission to look into Prodigy. In one 19-minute session they counted 16 ads for the paid membership and 4 maths problems. [Source: the complaint, as reported by Education Week and Axios]
   - Your clip shows the hooks: a countdown that starts the next level for the child, a weekly leaderboard, a trophy for every level.
   - Your rules point the other way: struggle is the point; no running totals; the child decides.
   - **Borrow the craft, not the hooks.**
2. **Do not copy Prodigy's look.**
   - Never write "Prodigy" in a prompt. Never give an image AI its screenshots as a reference.
   - Describe the qualities instead: thick outlines, soft shading, layers of depth, glow on what can be tapped.
   - GMQ's look must be yours (CLAUDE.md).
3. **Half-painted looks worse than plain.**
   - One painted planet beside three board planets makes the boards look poorer.
   - Plan the whole set before painting the first place.
   - Characters first avoids this. A cast works in every view, painted or not.
4. **Every painted picture must agree with the words.**
   - An image AI adds things nobody asked for: a second door, a path, a sign.
   - A child will tap each one, and ask about it.
   - Every picture needs the word check ("if the words say under, look"). That is real work for each picture.
5. **It costs your time, if you make the pictures.**
   - A good picture may take 5 to 15 tries. [Proposal: my estimate]
   - The whole game needs about 40 to 60 pictures (backgrounds, people, faces, cards). [Proposal: my estimate]
   - The other way: I make them through the Canva connection this session has. I have not tried it, so I do not know if its pictures are good enough. They would be saved in your Canva account.
6. **Who owns the pictures.**
   - The US Copyright Office said in January 2025: a picture made only from a prompt is not protected by copyright. Your changes to it, and how you put pictures together with your words, can be. [Source: the Office's report, part 2, as summarised by law firms]
   - The game, the story, the names and the characters' designs stay yours.
   - This matters only if you want to protect or sell the art. Read each tool's terms for school use too.
7. **The game stops being one small file.**
   - Today the whole game is 1.2 MB.
   - A painted picture is about 100 to 300 KB at iPad size. [Proposal: my estimate] 50 pictures come to about 5 to 15 MB.
   - They must load one place at a time, or the first start on school wifi will be slow.
   - The push steps change (an art folder beside each copy), and the class update check must cover it.
8. **The children may not care as much as we think.** The art review said it: they may like the board. Watch them first.

---

## 7. Options [Proposal]

### A. The cast first
- **What:** one people for each planet, and the named characters (the Keeper, the Council, the Site Chief, the Supply Chief, the glassmaker, the giant). Each gets a design sheet and 3 or 4 faces. They stand in the scene where they are, and fill the picture when they speak at length.
- **Cost:** the smallest. About 10 to 15 characters, 4 to 5 pictures each.
- **Gain:** the game feels alive. Works with every view, painted or not.
- **Risk:** a painted character on a code-drawn board may look pasted on. A soft shadow and an outline in the game's own ink colour help.
- **To check:** a talking face must not cover the task (rule 8). When a child is working, the face goes.

### B. Painted backgrounds for the side views
- **What:** Voltara's places, the 20 small worlds, and every arrival screen.
- **Cost:** middle. About 25 to 30 pictures. Each is painted **without** the things to tap. Those are separate cut-outs, placed by code, so taps still work.
- **Risk:** small worlds made from one kit may still look alike. Each needs its own picture.

### C. Repaint the maps seen from above
- **What:** the station, Chronosia, Xylophora and the mission ship, in three-quarter view.
- **Cost:** the largest.
  - A painted map must line up with the walking squares.
  - The mist and the dark must still hide what they hide.
  - Chronosia's map changes as the story moves (the day turns, the crack fades). Each change needs its own picture, or a code layer on top.
  - Xylophora keeps visible squares.
  - The walking and tapping tests must be checked again.
- **Another way:** do it in code (the art review's choice 1), with painted trees and buildings as cut-outs.

### D. Not now
- Keep the code art. Use the art review's choice 1 (dress the squares) when there is time.

**A, then B, can be done together.** C is last, and only if A and B work.

**My pick, as a test before anything else:** one people and one Voltara background, in a copy of the game. Not on the class link. Look at it at the three sizes, beside today's version. Then decide.

### Two questions for you

1. **Who makes the pictures?**
   - You, in Gemini. I write each prompt and check each result.
   - Me, through the Canva connection. The pictures land in your Canva account.
2. **Which people first?** Voltara's (the first planet every child meets), Chronosia's Council (the most talking), or Algora's Twinseers and Eights (their look is still yours to decide, so nothing drawn today would be thrown away)?

---

## 8. What could prove this wrong

- **The image AI may not hold a character steady.** Test: one alien, 10 poses. Count what changes (colour, number of eyes, the shape of the head).
- **Painted backgrounds may hide what can be tapped.** Test: can a child find the rock in 5 seconds, on the painted picture and on today's?
- **Speed.** Time the first load of a painted place on the older iPad, on school wifi, not at home.
- **The children.** Show two versions of one place. Watch which they lean towards, and whether the maths gets slower or faster.

---

## 9. What I did not check

- **I made no picture.** Everything about image AIs comes from web reviews, many written by the tool makers.
- **I could not read the McNeil paper in full.** I give its widely cited finding only.
- **I did not listen to the clip.** I looked at 7 frames.
- **My pictures of GMQ came from Chromium on a server,** not Safari on an iPad.
- **The big world page:** I saw only its first screen (the wormhole).

---

## Sources

- Prodigy complaint: [Education Week, Feb 2021](https://www.edweek.org/technology/popular-interactive-math-game-prodigy-is-target-of-complaint-to-federal-trade-commission/2021/02); [Axios](https://www.axios.com/2021/02/19/prodigy-math-game-ftc-complaint); [the complaint (PDF)](https://fairplayforkids.org/wp-content/uploads/2021/02/Prodigy_Complaint_Feb21.pdf)
- Real-looking money: [McNeil et al. 2009 (PDF)](https://groups.psych.northwestern.edu/uttal/documents/McNeiletal2009.pdf)
- Copyright: [Jones Day summary of the Copyright Office report](https://www.jonesday.com/en/insights/2025/02/copyrightability-of-ai-outputs-us-copyright-office-analyzes-human-authorship-requirement); [Skadden summary](https://skadden.com/insights/publications/2025/02/copyright-office-publishes-report)
- Image AIs and keeping characters the same (reviews, many by tool makers): [Ideogram blog](https://ideogram.ai/blog/best-ai-image-generators-consistent-characters/); [Toonystory test of 140 images](https://toonystory.com/blog/best-ai-for-character-consistency-2026)
- The busy classroom: Fisher, Godwin & Seltman (2014), *Psychological Science*, "Visual environment, attention allocation, and learning in young children". From memory; not looked up today.
