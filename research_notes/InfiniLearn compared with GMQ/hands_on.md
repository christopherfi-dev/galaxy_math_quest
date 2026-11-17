# InfiniLearn (infinilearn.com): hands-on look without an account

**Date of visit:** 2026-11-17. All times and screens below are from that day.
**Product:** "Infinilearn", a math RPG at `www.infinilearn.com` (marketing) and `play.infinilearn.com` (the game). This is not "Infinity Learn by Sri Chaitanya".
**How I looked:** Chromium driven by Playwright, at 820 x 1180 (iPad portrait), 1180 x 820 (iPad landscape) and 1366 x 768 (laptop), device scale 1. The site was reachable. No network block.
**What I did not do:** I did not create an account, sign in, or submit any form. I typed nothing into any field.

**The short version**

- The real game is fully behind an account wall. A child cannot play one second of it without signing up.
- The only thing a visitor can "play" is one fake battle question on the home page. It is a marketing mock-up, not the game.
- There is no video anywhere on the site.
- So everything below about the real game comes from three kinds of evidence. I label each line:
  - **[Seen]** I saw it myself in the browser.
  - **[Site claim]** The company says so in its own pages. I could not test it.
  - **[Inference]** My reading of the evidence.
  - **[Conflict]** The company's own pages disagree with each other.

---

## 1. What is on the home page, and what can be tried without logging in?

### Takeaway
The home page is a parent-and-teacher sales page with one clickable mock battle question and two looping animations. Every "Get started", "Log in" and "Explore the adult dashboard" link goes to the same sign-up chooser at `play.infinilearn.com`, and the next screen asks for a first name, a grade and a 6-digit PIN. That is the wall.

### Cited Findings

**Home page, in order from top to bottom (iPad portrait, 820 wide)** — [Seen] at [infinilearn.com](https://www.infinilearn.com/)

- The page is 10,304 pixels tall at iPad portrait. That is about 9 screens of scrolling. It holds about 999 words in total.
- Hero (68 words): headline "MATH CLASS, BUT IT'S AN ADVENTURE". One sentence: "Infinilearn is a multiplayer RPG where 3rd–9th graders build skills, gain confidence, and have fun doing math." One big button "GET STARTED". Small line: "Safe · Free game · No ads".
- Hero mock battle (35 words): a pixel-art garden in a tilted wooden frame. A knight called LUNA (LVL 14) faces a green SLIME (LVL 8). A card says "YOUR TURN — Solve for x: x ÷ 3 = 9" with four buttons: A 12, B 18, C 27, D 36. A bar at the bottom says "Choose an answer to charge your spell."
- Counters: "100,000+ signups", "5,600+ teachers", "8,200+ parents".
- Three sales blocks: "BATTLE WITH MATH", "PLAY WITH FRIENDS", "PROOF IT'S WORKING". Each has a link that only scrolls down the same page.
- "EXPLORE. QUEST. LEVEL UP." (60 words): a looping animation of a town square (see section 4).
- "MATH IS HOW YOU WIN." (74 words): three steps (Find a quest, Solve real math, Earn the win) and a second looping animation (see section 4).
- "BUILT FOR TEACHERS AND PARENTS" (100 words): a mock "Parent Portal" with fake children "Luna, 6th" and "Kai, 7th". Its buttons can be clicked but only change the mock.
- "Same adventure. Different adult questions." Three cards linking to `/parents`, `/teachers`, `/homeschool`.
- Pricing (150 words): Free "$0 forever" and Premium "$9.99 / month or $59.99/year".
- Five teacher quotes (252 words). Three of the five name a grade: grade 5, grade 6, and grades 6 to 8. None names grade 3 or 4.
- Founder note, a last "GET STARTED" button, and the footer.

**Every "try / demo / play / start" link I followed** — [Seen]

| Link text | Where it goes | What happens |
|---|---|---|
| GET STARTED (4 places), Log in, Explore the adult dashboard | `play.infinilearn.com/?lang=en` | Chooser: "I'm a Student / I'm a Parent / I'm a Teacher". 30 words. |
| I'm a Student | `play.infinilearn.com/signup/student` | Form: First Name, Grade (3rd to 9th), "Choose a 6-digit PIN", "Create Account!", or Google, or Clever. **This is the wall. I stopped here.** |
| Log in (from the form) | `play.infinilearn.com/login/student` | Username + PIN + "Play!". Also a wall. |
| SEE HOW BATTLES WORK, EXPLORE THE WORLD, SEE THE DASHBOARD | `#battle`, `#world`, `#for-teachers` | Scrolls down the home page. Nothing to play. |
| "Let your kid try it first" (on `/after-prodigy`) | `play.infinilearn.com/signup/student` | The same sign-up form. Not a trial. |
| "Ask for a demo" (on `/teachers`) | a `mailto:` link | Opens an email to the founder. |

- I also tried three guessed addresses. `play.infinilearn.com/demo` shows "Private demo — This page needs a private demo link. If you were sent one, open it exactly as it was shared." `play.infinilearn.com/play` and `/login` show a "Lost — 404" page. `play.infinilearn.com/game` bounces back to the chooser. — [Seen] at [play.infinilearn.com/demo](https://play.infinilearn.com/demo)
- The sign-up form opens with "6th" already highlighted as the grade. A child who taps "Create Account!" without touching the grade row would be set to grade 6. — [Seen] at [play.infinilearn.com/signup/student](https://play.infinilearn.com/signup/student)
- The developer's itch.io page for the game says "Play in browser" on his profile, but the game page itself says "The developer has not uploaded a game yet..." So there is no open copy there either. — [Seen] at [theadrianm.itch.io/infinilearn-math-game](https://theadrianm.itch.io/infinilearn-math-game)

**The one clickable thing: the hero mock battle** — [Seen] at [infinilearn.com](https://www.infinilearn.com/)

- I tapped a wrong answer first (A 12). The button turned red. The bottom bar changed to "MISS! Try multiplying both sides by 3." The message was still there after 2.5 seconds and had reset to "Choose an answer to charge your spell." by 5 seconds.
- I then tapped the right answer (C 27). The button turned green. The bar said "CRITICAL HIT! Brain Blast lands. +18 MATH XP". It was still there after 2.5 seconds and had reset by 5 seconds.
- Nothing else changes. There is only this one question. It never moves on to a second question.
- The HP numbers and the sword-swing animation loop every 4 seconds on their own, whether or not anyone taps. The page code marks the buttons simply `data-answer="wrong"` or `data-answer="correct"`. Nothing is sent to a server.
- I checked the sum: 27 ÷ 3 = 9, so C is right.
- The wrong-answer hint ("Try multiplying both sides by 3") is algebra language. The question itself ("Solve for x") is grade 6 material in the US, not grade 3.

### Inferences
- [Inference] The home page is written for adults. A child of 8 landing on it would see a picture of a game, tap one answer, and then hit a form.
- [Inference] The mock battle shows the sales pitch of the real loop (question, four choices, hit or miss), but its exact wording and its hint cannot be taken as the real game's behaviour.
- [Inference] The sample content on the home page is aimed at grades 6 to 7 (solve for x, "Luna, 6th grade", "Kai, 7th", "6.RP Ratios"). Grade 3 is named in the headline only.

### Gaps
- I could not play the real game. Everything past the sign-up form is unseen.
- I did not open the Parent or Teacher sign-up forms beyond confirming they exist as links. A teacher account might allow a "play as student" preview (the app's public code names files `PlayAsStudent` and `TeacherDemo`), but that needs an account, so I did not test it.

---

## 2. If a playable part is reachable: what does the child see and do, screen by screen?

### Takeaway
No playable part of the real game is reachable. What follows is rebuilt from the company's six Steam store screenshots [Seen as images] and from its own written descriptions [Site claim]. It shows a top-down pixel world you walk around, short story lines you tap through, and battles where each attack is a multiple-choice question with a "Hint" button and a "Cast Spell" button.

### Cited Findings

**The six official screenshots** — [Seen] as still images at the [Steam store page](https://store.steampowered.com/app/3513130/Infinilearn_Math_Game/?l=english). They are 1920 x 1075 landscape. The Steam page has no trailer.

1. **Dorm room.** A small bedroom seen from above: bed, desk, bookshelves, a door at the top. The player stands in the middle with a label "Lv.2 testing2070". A box top-right reads "Find Headmaster Aldric / Exit the dorm room" (7 words). Three small square buttons bottom-right: a gift, a star, a question mark.
2. **Courtyard with story.** The player stands below a wizard labelled "Headmaster Aldric". A dark bar across the bottom reads: "Something has happened. The Seal that protects Numeria... it's breaking." (10 words) with "tap to continue ▼" at the right.
3. **Forest path.** Grass and trees. A frog-like monster labelled "Mossback Toad" has a red "!" over it. Quest box: "Mossy Trail / Defeat creatures 0/4".
4. **Battle menu.** A side-on view. "You" on the left with a green HP bar. "Gatekeeper Construct", a tall armoured figure, on the right with its own HP bar. A panel asks "What will you do?" with two buttons: "Attack" and a greyed-out "Run".
5. **Battle question.** The scene dims. A topic label at the top says "Unit Rates". The question in large serif type: "If 5 apples cost $40, what is the cost per apple?" (11 words). Four wide answer buttons in a 2 x 2 grid: "$40", "$7", "$9", "$8". Below them a greyed "Cast Spell" button and a smaller "Hint" button with a light-bulb. Bottom-left: a pencil button, an eraser button and "Clear".
6. **Village.** A cobbled square with stalls and a signpost "IRONVALE". An armoured figure labelled "Guard Tomas". Bottom bar in italics: "Ironvale. A mining village at the edge of Whisperwood." (9 words) and "tap to continue ▼".

- I checked the sum in screenshot 5: 40 ÷ 5 = 8, and "$8" is one of the four choices.

**How the company describes the flow** — all [Site claim]

- First 0 to 3 minutes: "a new character." Minutes 3 to 8: "the first battles... Problems are mostly multiple choice, and every correct answer is an attack. A miss is not a dead end; the game simply serves something they can handle next." — [Switching from Prodigy playbook](https://www.infinilearn.com/blog/switching-from-prodigy)
- "Typed answers only appear at grade 9. If your child is in grades 4-8, every problem is multiple choice." — [Switching from Prodigy playbook](https://www.infinilearn.com/blog/switching-from-prodigy)
- "Most Infinilearn problems are multiple choice; typed free-response answers show up mainly on the harder 9th grade problems." — [Founder's comparison post](https://www.infinilearn.com/blog/infinilearn-vs-prodigy)
- "When a student attacks with their weapon in battle, the problems are pulled from their weakest subjects." — [Founder's comparison post](https://www.infinilearn.com/blog/infinilearn-vs-prodigy)
- Difficulty "rises and falls with answers. A rough stretch drops the game into Foundations practice", described as "real grade 2-3 skills like facts, place value, telling time, and fractions of a shape". — [Switching from Prodigy playbook](https://www.infinilearn.com/blog/switching-from-prodigy)
- "Kids answer about 20 problems in a typical 10-minute session, a typical full session runs about 14 minutes and 23 problems, and accuracy sits at 76%." The company says this is its own server data since July 2026. — [Founder's comparison post](https://www.infinilearn.com/blog/infinilearn-vs-prodigy)
- "Core math questions are untimed." Timed parts exist only in "optional challenge content (speed bounties, player-versus-player battles)". — [Accessibility report](https://www.infinilearn.com/accessibility)
- The game is "a fantasy role-playing game rendered on an HTML5 canvas, in which students explore a world and battle enemies by solving math problems." — [Accessibility report](https://www.infinilearn.com/accessibility)
- World: "15 explorable zones" ([homeschool page](https://www.infinilearn.com/homeschool)). Named places I saw in text or pictures: the Academy, Academy Garden, Market Square, Hollow Grove, Arcane Causeway, Whisperwood, Ironvale, Mossy Trail, and the land "Numeria".
- Characters named: Headmaster Aldric, Guard Tomas, a shopkeeper "Vella", and a paid-for pet "Finny the Axolotl". Monsters named: Slime, Fractured Slime, Mossback Toad, Gatekeeper Construct, Grove Warden (a picture file name).
- Rewards named: XP, levels, gold, gear (staffs, wands, armour), a parent's "daily gift" (the gift button in the screenshots), pets, emotes. — [Premium page](https://www.infinilearn.com/premium)
- Multiplayer: "Team up in a shared world." Chat is "preset quick-chat lines" only; players "can't type messages to each other". Friends can fight each other in "PvP". — [Home page](https://www.infinilearn.com/), [Support Center](https://play.infinilearn.com/support?lang=en)
- It is "practice, not lessons... If a concept is brand new, your child needs a teacher, a video, or you." — [Founder's comparison post](https://www.infinilearn.com/blog/infinilearn-vs-prodigy)

**On wrong answers and guessing** — all [Site claim]

- Teacher FAQ, "Can students just guess?": "The game tracks accuracy by topic over time, so repeated guessing shows up in the data and triggers more practice on weak areas." It does not say guessing is blocked. — [Teachers page](https://www.infinilearn.com/teachers)
- The 9th-grade typed answers exist "so students cannot guess their way through, but a younger player will not see those." — [Switching from Prodigy playbook](https://www.infinilearn.com/blog/switching-from-prodigy)

### Inferences
- [Inference] Maths is not built into the action. The child walks to a monster, picks "Attack", and a separate question screen covers the scene. The question is a plain word problem or equation. Answering it is what makes the attack happen. This is the same shape as Prodigy.
- [Inference] The flow in a battle is: tap "Attack" → read the question → tap one of four answers → tap "Cast Spell" to confirm. "Cast Spell" is greyed in the screenshot, which suggests it lights up after a choice is made. I could not confirm this.
- [Inference] The pencil, eraser and "Clear" buttons look like a scratchpad for working out on screen. I could not confirm this.
- [Inference] With four choices and no typed answers below grade 9, a grade 3 child can guess through. A blind guess is right one time in four. The only stated cost of guessing is that the topic comes back more often.
- [Inference] A "Hint" button exists. What it shows, and whether it gives the answer away, is unknown. The home-page mock's hint ("Try multiplying both sides by 3") names the method without giving the number, but that mock is not the game.
- [Inference] There is a story (a "Seal" protecting "Numeria" is breaking) and a quest tracker, but no sign in any evidence of choices that change the story. Dialogue is "tap to continue".
- [Inference] Rough pace from the company's own numbers: 20 problems in 10 minutes is one problem every 30 seconds. But 23 problems in 14 minutes is one every 37 seconds. The two figures do not quite match (23 ÷ 14 × 10 = 16.4 per 10 minutes). They may be medians of different things.

### Gaps
- I did not see what happens on a wrong answer in the real game. I do not know if the right answer is shown, if the same question repeats, or how much HP is lost.
- I did not see the Hint text, the character creator, the tutorial, the shop, or any grade 3 question.
- I do not know how many words a child must read before the first battle.
- What would prove my reading wrong: a single account-holder session recorded at grade 3 would settle all of these in ten minutes.

---

## 3. Is the content generated by AI on request?

### Takeaway
No. Nothing on the site or in the pre-login screens asks for a topic or a prompt, and no page I read mentions AI-made questions. The child picks a grade, and the company says the game then picks questions from a standards-mapped bank and adapts.

### Cited Findings
- The only inputs before the wall are First Name, Grade (3rd to 9th buttons) and a 6-digit PIN. There is no topic box. — [Seen] at [play.infinilearn.com/signup/student](https://play.infinilearn.com/signup/student)
- I searched the text of the home, parents, teachers, homeschool, about, premium, security, privacy, accessibility, support and membership pages for "AI". I found no statement that questions or story are AI-generated. — [Seen] across [infinilearn.com](https://www.infinilearn.com/)
- "Every problem maps to Common Core and to the state standards of Texas, Florida, Indiana, Virginia, Georgia..." plus the Australian and Ontario curricula. — [Site claim], [Support Center](https://play.infinilearn.com/support?lang=en)
- Adults can choose "the full grade-level path, Traditional for core math without statistics/probability, or Custom to pick exactly which topics students practice." For parents this is a Premium feature. — [Site claim], [Teachers page](https://www.infinilearn.com/teachers), [Premium page](https://www.infinilearn.com/premium)
- "A built-in diagnostic finds each student's level as they play, then keeps adapting." — [Site claim], [Teachers page](https://www.infinilearn.com/teachers)

### Inferences
- [Inference] This is a fixed or template-driven question bank with an adaptive picker, not on-demand generation. Because there was no prompt box, I did not need the neutral test topic.
- [Inference] I saw no visible checking of content either way, because I saw only four questions in total (three on the home page, one in a Steam screenshot). All four are arithmetically correct.

### Gaps
- Whether question numbers are randomised per student, and whether the bank has errors, cannot be judged from four samples.
- Some third-party tool directories list "Infinilearn" under AI tools. I did not rely on them. They may describe a different product with a similar name.

---

## 4. Demo videos and animated previews

### Takeaway
There is no video on the site at all. There are two short looping CSS animations on the home page that stage a fake play-through. I stepped through both frame by frame.

### Cited Findings
- No `<video>` or `<iframe>` element exists on the home page or on `/parents`, `/teachers`, `/homeschool`, `/premium`, `/about`, `/after-prodigy`, `/security`, `/accessibility` or `/blog`. — [Seen] at [infinilearn.com](https://www.infinilearn.com/)
- The company's own accessibility report agrees: "The product contains no prerecorded audio-only or video-only content." — [Accessibility report](https://www.infinilearn.com/accessibility)

**Animation A: "Market Square run" — 12-second loop** — [Seen] at [infinilearn.com/#world](https://www.infinilearn.com/#world)

| Time in loop | What shows |
|---|---|
| 0.0 s | Cobbled town square with a fountain, stalls and barrels. A shopkeeper stands by the fountain. A green slime sits lower right. Above the picture a card reads "NEW QUEST ADDED! Defeat 10 Fractured Slimes in Hollow Grove — 6 / 10". |
| about 1.5 to 4 s | The player sprite walks to the shopkeeper. A card pops up: "VELLA'S SHOP — Alethian gear equipped". The sprite changes from plain clothes to blue armour. |
| about 4.5 to 6 s | The armoured player walks down towards the slime. |
| about 6 to 9.5 s | A parchment bubble appears over the player: "SOLVE TO STRIKE — 72 ÷ 6 = ?". Then a green tag fills in: "12 Correct". |
| about 10.5 s | A red "-7 HP" pops over the slime. Then the loop restarts. |

- A fixed caption sits in the corner: "MARKET SQUARE RUN — QUEST, SHOP, BATTLE, KEEP EXPLORING".
- I checked the sum: 72 ÷ 6 = 12.

**Animation B: "Arcane Causeway" — 8-second loop** — [Seen] at [infinilearn.com/#battle](https://www.infinilearn.com/#battle)

| Time in loop | What shows |
|---|---|
| 0 to 1 s | A stone bridge in a purple starry sky, with floating rocks and blue crystals. A player sprite stands in the middle. Two pale blue figures stand lower down. A caption bar: "ARCANE CAUSEWAY — One more equation opens the gate." |
| about 2 to 3 s | A parchment bubble over the player: "OPEN THE GATE — 4x = 28". |
| about 4 to 5 s | A green tag is added: "x = 7 Correct". |
| 6 to 8 s | The bubble fades. Loop restarts. |

- I checked the sum: 4 × 7 = 28.

**Videos off the site**

- The Steam page links the developer's YouTube channel. It lists a 1:06 video titled "16yo pitches his startup to over 2000 people. Yep, that's me…" and a Short titled "kinda bored so I made math fun". Most other videos on the channel are about other subjects. — [Seen] at [youtube.com/@the.adrianm](https://www.youtube.com/@the.adrianm/videos)

### Inferences
- [Inference] Both animations are staged adverts drawn with page code over still map pictures. They are not recordings of play. In the real game (by the Steam screenshots) the question fills a dimmed battle screen. It does not float in a bubble over the map.
- [Inference] Animation B suggests that maths also opens gates outside of battles ("One more equation opens the gate"). The site text supports this: players "attack, craft, unlock areas". I could not see how that works in the game.

### Gaps
- I could not play the two YouTube videos. The player did not load a stream in the headless browser (no duration was reported). I cannot describe their content or give timestamps. They are also not linked from infinilearn.com itself.

---

## 5. How does it look and work at iPad size?

### Takeaway
The marketing site and the sign-up screens fit an iPad cleanly, with no sideways scrolling and large main buttons. The game itself I could not test. The company's own pages disagree about iPad: one says it runs in "Safari on an iPad", another says an iPad family is better served by a rival.

### Cited Findings

**What I measured** — [Seen]

- No horizontal overflow at 820 x 1180, 1180 x 820 or 1366 x 768, on the home page or the sign-up form. — [infinilearn.com](https://www.infinilearn.com/), [play.infinilearn.com/signup/student](https://play.infinilearn.com/signup/student)
- iPad portrait: the top menu collapses to a "hamburger" button. The hero stacks: headline, then button, then the mock battle below. Laptop: headline on the left, mock battle on the right, with "Español | Français" and "Parents / Teachers / Homeschool" in the top bar.
- Chooser buttons ("I'm a Student" and so on) are 384 x 60 pixels. Easy to tap.
- Sign-up form: "Create Account!" is 442 x 62. The PIN box is 438 x 60. The grade buttons are 45 x 41 each, in two rows. That is close to Apple's 44-point minimum, so small for a child's finger but usable.
- Home-page mock battle at iPad portrait: the answer buttons are only 118 x 25 pixels with 13-pixel text. The feedback line is 12.8-pixel text. That is too small for an 8-year-old to tap or read comfortably. This is the advert, not the game.
- The game site sets `user-scalable=no, maximum-scale=1.0`. Pinch-zoom is switched off on every page of `play.infinilearn.com`, including the sign-up form. — [play.infinilearn.com](https://play.infinilearn.com/)
- The sign-up form needs the on-screen keyboard twice: once for the first name, once for six digits.
- The Steam screenshots are landscape (16:9). The question text and the four answer buttons are large in that frame. Each answer button is about a quarter of the screen width.

**What the company says** — [Site claim]

- "The Game scales to fit either orientation." It is "a fixed-aspect canvas". — [Accessibility report](https://www.infinilearn.com/accessibility)
- Touch control: an "optional virtual thumbstick" with "single-tap (tap to move)" as an alternative. Keyboard: "arrow keys or WASD". — [Accessibility report](https://www.infinilearn.com/accessibility)
- "Several in-game menus and dialogue interactions currently require a pointer or touch." — [Accessibility report](https://www.infinilearn.com/accessibility)
- Built-in "Large Text mode", "High Contrast mode", and "read-aloud of math problems via text to speech". None is a paid feature. — [Accessibility report](https://www.infinilearn.com/accessibility)
- "Browsers block game audio until you click or tap once inside the game." — [Support Center](https://play.infinilearn.com/support?lang=en)
- "Progress saves to the cloud automatically." Do not open the game "in two tabs or on two devices at once". — [Support Center](https://play.infinilearn.com/support?lang=en)
- "The game won't load... try Chrome or Edge." — [Support Center](https://play.infinilearn.com/support?lang=en)

**[Conflict] Does it suit an iPad?**

- "Infinilearn runs in any modern browser, including Safari on an iPad, with nothing to install." — [After Prodigy page](https://www.infinilearn.com/after-prodigy)
- "Platforms: Browser only (Chromebooks, laptops, desktops)... If math practice in your house happens on an iPad in the back seat of the car, Prodigy fits your life better than my game does right now." — [Founder's comparison post](https://www.infinilearn.com/blog/infinilearn-vs-prodigy)
- "No native app yet", and "the game is not designed for phone-sized screens." — [Switching from Prodigy playbook](https://www.infinilearn.com/blog/switching-from-prodigy)
- The Support Center says "mobile apps are on the way." — [Support Center](https://play.infinilearn.com/support?lang=en)

### Inferences
- [Inference] The product is built first for school Chromebooks with a keyboard and trackpad. iPad Safari is supported but is not the main target. The troubleshooting advice names Chrome and Edge, not Safari.
- [Inference] For grades 3 to 8 the child should not need a keyboard after sign-up: movement is tap or thumbstick, answers are taps. I could not confirm this in play.
- [Inference] On an iPad held upright, a fixed 16:9 game picture would be letter-boxed and small. Landscape is the sensible way to hold it. I could not test this.
- [Inference] With pinch-zoom off, a child who finds the text small has only the in-game Large Text setting to fall back on.

### Gaps
- I could not test load time, frame rate, touch movement, the thumbstick, text size in the game, or whether anything breaks in Safari. My browser was Chromium, not Safari, so even the marketing-site results are not a true iPad Safari test.
- The Steam screenshots may be from a desktop build. Tablet layout could differ.

---

## 6. Reading level, and would an 8-year-old learning English manage?

### Takeaway
The real game text I could see is short (9 to 11 words per screen) but uses fantasy names and maths vocabulary well above a typical grade 3 English learner. More important: the company itself says in several places that the game really starts at grade 4, and that a child in "3rd grade or below" should use something else.

### Cited Findings

**Words I could see from the actual game** — [Seen] in the [Steam store screenshots](https://store.steampowered.com/app/3513130/Infinilearn_Math_Game/?l=english)

- Story line: "Something has happened. The Seal that protects Numeria... it's breaking." 10 words. Hard words: Seal (in an unusual sense), protects, Numeria.
- Place line: "Ironvale. A mining village at the edge of Whisperwood." 9 words. Hard words: mining, village, edge, two invented names.
- Quest lines: "Find Headmaster Aldric / Exit the dorm room". "Defeat creatures 0/4". Hard words: Headmaster, exit, dorm, defeat, creatures.
- Question: "If 5 apples cost $40, what is the cost per apple?" 11 words. Hard words: cost per. Topic label: "Unit Rates". This is a grade 6 skill in the US.
- Buttons: "Attack", "Run", "Cast Spell", "Hint", "Clear", "tap to continue".
- Monster names: "Mossback Toad", "Gatekeeper Construct".

**Words on the home-page mock** — [Seen] at [infinilearn.com](https://www.infinilearn.com/)

- "Solve for x:", "Choose an answer to charge your spell.", "MISS! Try multiplying both sides by 3.", "CRITICAL HIT! Brain Blast lands. +18 MATH XP".

**Language options** — [Seen]

- The marketing site has Spanish and French versions (`/es`, `/fr`). The game's entry screen offers "English · Français". I tapped "Français" and the chooser changed to French ("Je suis élève / Je suis parent / J'enseigne"). — [play.infinilearn.com](https://play.infinilearn.com/)
- The accessibility report, dated 9 September 2026, says "All content is in English." So the French option may be newer, or may cover menus only. — [Site claim], [Accessibility report](https://www.infinilearn.com/accessibility)
- There is no Thai option.

**Supports that could help a weak reader** — [Site claim]

- "Math problems can be read aloud with built-in text to speech." This is stated for maths problems. It is not stated for story or quest text. — [Accessibility report](https://www.infinilearn.com/accessibility)
- "Quest and tutorial text intentionally avoids compass directions and describes landmarks." — [Accessibility report](https://www.infinilearn.com/accessibility)

**[Conflict] Is grade 3 really covered?**

- "3rd–9th graders" — [Home page](https://www.infinilearn.com/). The sign-up form has a "3rd" button. — [Seen] at [signup form](https://play.infinilearn.com/signup/student)
- "Infinilearn focuses on math for grades 4, 5, 6, 7, 8, and 9." — [Parents page FAQ](https://www.infinilearn.com/parents)
- "Infinilearn starts at 4th grade." "Grade 4 is the floor. For a child in 3rd grade or below, Prodigy or another elementary game is still the better choice, and we say so plainly." — [After Prodigy page FAQ](https://www.infinilearn.com/after-prodigy)
- Comparison table: "Grades covered: 4-9". "If your child is seven... Infinilearn doesn't cover grades that young at all." — [Founder's comparison post](https://www.infinilearn.com/blog/infinilearn-vs-prodigy)
- "A strong 3rd grader can start at 4th... but expect multi-digit multiplication, fractions, angles, and remainders within the first week." — [After Prodigy page](https://www.infinilearn.com/after-prodigy)
- The Steam page and the itch.io page still say "grades 6-8" and "6–8th graders". — [Steam store page](https://store.steampowered.com/app/3513130/Infinilearn_Math_Game/?l=english), [itch.io profile](https://theadrianm.itch.io)

**[Conflict] Is the whole game free?** (matters if a class is to use it)

- "Every student gets the complete game: every zone, quest, battle, and math problem." — [Home page](https://www.infinilearn.com/)
- "Free students get full access to Zone 1 (the Academy)... Premium students get access to all zones beyond the Academy (Whisperwood, and future zones)." — [Membership page inside the game site](https://play.infinilearn.com/membership)
- "Playing is free, and free students get the full Academy zone. Premium... unlocks the rest of the adventure." — [Support Center](https://play.infinilearn.com/support?lang=en)
- Premium is $9.99 a month or $59.99 a year. I checked "save 50%": 12 × $9.99 = $119.88, and $59.99 is 50.04% of that. Schools: "$10 per student, per year". — [Premium page](https://www.infinilearn.com/premium)

**Other points a teacher would want to know** — [Seen] unless marked

- The founder says he is "a high school student in Orange County, California" and that he ships fixes himself. — [Site claim], [About page](https://www.infinilearn.com/about)
- The accessibility report is "a good-faith self-assessment" with "no third-party audit". — [Site claim], [Accessibility report](https://www.infinilearn.com/accessibility)
- The marketing home page loads a Facebook (Meta) tracking script, `connect.facebook.net/.../fbevents.js`. The game's entry page did not: it made requests only to `play.infinilearn.com`. — [Seen] at [infinilearn.com](https://www.infinilearn.com/)
- A student account needs a first name, a grade and a PIN. "Students never need an email address or password." Teachers "can view PINs for students in their class". — [Seen] form; [Site claim], [Support Center](https://play.infinilearn.com/support?lang=en)

### Inferences
- [Inference] Sentence length is fine for an 8-year-old: 9 to 11 words, one idea each. Vocabulary is the problem. In the handful of real lines I could see (about 45 words in all), I count at least 15 words that are invented names or above-level words (Numeria, Ironvale, Whisperwood, Aldric, Headmaster, Seal, protects, mining, village, edge, exit, dorm, defeat, creatures, per). The sample is tiny, so treat this as a signal, not a measurement.
- [Inference] Story text can probably be tapped past without understanding it, since it is "tap to continue". If so, a weak reader could still play, but the story would not carry meaning for them. Quest instructions ("Exit the dorm room") do have to be understood to move on, unless the game also shows a marker. I saw no marker in the still images except a red "!" over a monster.
- [Inference] The word problems are the real reading test. "What is the cost per apple?" needs the phrase "cost per". Read-aloud would help with decoding but not with meaning.
- [Inference] For a grade 3 class of English learners in Bangkok, three things point the same way: the company says grade 4 is the true floor, the visible sample content is grade 6 to 7, and the only languages are English and French. My judgement is that most 8-year-old English learners would not manage it alone. A strong reader at or above grade level might.
- [Inference] What could prove this wrong: the "Foundations" mode (stated as grade 2 to 3 facts, place value, time, fractions of a shape) may have much simpler wording than the samples I saw. I saw no Foundations question.

### Gaps
- I saw no grade 3 or Foundations question, so I cannot grade their wording.
- I do not know how much text the opening tutorial has, or whether story text is read aloud.
- I did not test the Spanish or French pages beyond the entry screen.
- I do not know whether a grade 3 account is quietly given grade 4 content, or its own grade 3 bank. The site's statements conflict.

---

## Evidence files

Screenshots and page text from this visit are in this folder (a scratch folder that may be cleared, so copy anything worth keeping):

`/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/`

Most useful files there:

- `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/home_ipad_top.png` — home page hero at iPad portrait
- `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/home_ipad_full.png` — whole home page at iPad portrait
- `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/home_laptop_top2.png` — home page hero at laptop size
- `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/hero_wrong_300ms.png` and `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/hero_right_300ms.png` — mock battle after a wrong and a right tap
- `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/world_anim_sheet.png` and `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/battle_anim_sheet.png` — the two animations, frame by frame
- `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/play_ipad_landing.png` — the Student / Parent / Teacher chooser
- `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/infinilearn_handson/signup_student_ipad.png` — the sign-up form where I stopped
- `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/il_steam/steam_1.jpg` to `steam_6.jpg` in the same folder — the six official game screenshots

What I could not read or reach:

- The game itself (account wall).
- The two YouTube videos on the developer's channel (the stream did not load in the headless browser).
- A true iPad Safari session (I used Chromium at iPad window sizes).
