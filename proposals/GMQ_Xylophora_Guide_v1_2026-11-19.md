# Planet Xylophora: the guide

**Date:** 2026-11-19 (built overnight)
**For:** Marc
**What it is:** your second planet in Galaxy Metrica, playable on the preview link. Built as sketch version 45. The preview link is now version 48.
**Marks:** [Source] is from your material. [Proposal] is mine. [Conflict] means your sources disagree.

You said: "You choose. You have the standards now." This is what I chose, why, and exactly what I built.

---

## Changed 23 November (version 89, preview link): the skin makes the walls

[Source: Marc, 23 November] "Lay out the area of the house first, and then have the student click and build the walls around it and they say how much is needed for the actual walls."

**The four materials, each with one meaning:**
- **The skin's survey:** area (two rectangles joined), as before.
- **Floors:** flattened ground, marked with two taps. Area.
- **Walls:** pieces of skin, one piece for each square of edge. Perimeter.
- **Roofs:** leaves, 2 by 2. Area.

**The wall step,** for every building, the Home too (before, only the Hospital and the Food Store counted the wall):
1. A tap on the floor asks how many pieces of skin its wall needs.
   - The floor fills the picture, square by square.
   - A finished example about something else: the cutters' tool box, 2 by 1, needs 6 pieces.
2. **Too few** [Proposal]: the wall goes up and stops. The gap shows. Nothing is lost.
3. **Too many** [Proposal]: the wall goes up. The spare pieces lie beside it, cut too short to use: that skin is wasted, and the map key's last words count it.
4. **After two misses on one wall** [Proposal]: the Site Chief offers a smaller wall first, in the sand: 3 by 1, 2 by 2 or 1 by 3, which is 8 pieces. That is never the answer, because every building's wall is 10 or more. The child chooses.
5. **If the skin runs short,** the herder finds more. Nobody is stuck.

**The walls are drawn** as thick red pieces on the edges, so a child can count them. The floor is tan.

**"More Homes"** is now: the herder found more skin, the number of pieces is a whole number of your Home's walls, and it is never over 100. So the division stays a Grade 3 one.

**Numbers:**
- **New games use rule 2.** The skin is enough for the four shortest walls, with 10 to 36 pieces to spare. Checked on 20,000 seeds in `checks/xylophora_quest_check.py`.
- **Games begun before version 89 keep rule 1,** so their numbers never change. Checked: 3,000 seeds give the same numbers as the class link.

**A number to check, from your message:** a 3 by 2 house has a perimeter of 10 (3 + 2 + 3 + 2), not 8.

## Changed 21 November (versions 76 to 80, preview link)

- **A Mission panel** lists the five jobs and names the next one.
- **Stone paths** (your job C, decision 16): after the colony stands, the Site Chief asks for paths joining the Home, the Hospital and the Food Store before the rains. Grass squares need 3 stones, mud squares 5. The child counts and writes the total before building. The stones carried are always enough for a good network and never for stones everywhere (`checks/stone_paths_check.js`, 3,000 layouts). If the child's floors wall a building off, the job is not offered.
- **A report home** when leaving the finished planet.

## Changed 20 November (version 54, preview link): arriving, and short readings. A trial.

You wrote: "The planet wasn't described to me. The dead skin wasn't really described. I didn't know what I was doing or why." And you asked for an intro screen on arriving, with a better view of the planet, two or three short readings, and Continue after 4 to 5 seconds. And for speech in three or four short pieces, with OK between.

**1. Three arrival screens, the first time a cadet lands.** Each has a big picture in place of the map, and a short reading on the desk. **Next** is asleep for 5 seconds, then wakes. There is a **Read to me** button.

| Screen | The picture | The words |
|---|---|---|
| Planet Xylophora | the planet from space, a ball of squares | "This whole planet is made of shapes. The ground is a patchwork of perfect squares. Even the pines and the cacti grow in neat shapes." |
| The gentle giant | the giant asleep, and its skin on the fields | "A giant lies here, in a sleep that never ends. Long ago it shed its skin. The skin is leathery, rubbery and brightly coloured. It stretches across the fields." |
| Your job | the camp, four empty outlines, rain coming | "Earth is sending families to live here. Before the rains come they need a Home, a Hospital, a Food Store and a Solar Factory. But there is nothing to build with. Find the Site Chief at the camp." |

- The words are cut from your quest pages. [Source] "Before the rains" and "Long ago it shed its skin" are mine. [Proposal]
- They come once. A cadet who has already started work here does not get them.
- A teacher who switches the reading cards off switches these off too.

**2. Short readings, in every place.** A long speech used to come as one block. Now it comes on cards of about 25 words. Each card waits to be read. The button says **Next**, and **OK** on the last one. A small "2 of 3" shows where you are.

- The Site Chief's welcome: two cards.
- The Supply Chief on the mission ship, the one you called "one giant block of text": three or four cards.

**3. Why a floor is a rectangle.** You said you did not know whether a house had to be a rectangle. The order board said so, in small print. Now the Chief says it too: "The cutters cut the skin in straight lines. So every floor is a rectangle."

**Not built, and yours to decide [Proposal]:**

| Choice | Cost |
|---|---|
| Arrival screens for the mission ship, Chronosia and Voltara | about an evening each: three pictures and the words from your pages |
| Better pictures | these are drawn in the game's flat style. A painted or photo-like planet would need pictures from you, or from Canva. |
| Questions with answers to choose from, when a character speaks | a day for the first one. It changes how every speech is written. |
| Stone paths between the buildings: fetch stones, lay them down | your idea. An evening or two. It could carry length or perimeter. |

**Settled 21 November: asleep.** Marc agreed: the giant sleeps, and the skin it shed is the dead skin. The game already says this everywhere. The question as it was asked: **[Conflict]** Your page says the giant rests "in eternal slumber". Your plan calls the skin "the dried skin of a giant alien creature". You called it "the dead skin" today. The game says the giant is asleep and shed its skin long ago. Tell me which it is.

**What could prove this wrong:** three screens of reading before a child can move is a wait. Your daughter did not like waiting. Watch whether children read them or just watch the button.

---

## Changed 20 November (version 52, preview link): finding the trees

You stood at the camp. The Chief said "Stiff leaves! They may just work. Cover every roof." You wrote: "Where do I get these leaves? I can only find one leaf on the ground."

**What was wrong, and it was mine.** The game counted the Xylotrees as seen as soon as the mist cleared one tree square. That happens at the gap in the pines, before you go in. From then on:

- the Chief talked as if you knew about the leaves;
- the Hint button stopped saying where trees grow, and moved on to roofs.

So the game had taken away its own help, and you had not found anything.

**Now:** the trees count as found when a cadet looks at one or picks a leaf. Until then the Chief still says she has seen nothing stiff and flat near the camp, and Hint still gives its two nudges. The second one now says "far to the north-east", which is where the grove is. It used to say "far to the east".

**Not changed:** the Chief still has no lead. The grove is still behind the pines. A child must still go and look.

**Where the leaves are, for you:** east to the meadow, then north through the gap in the pines. Four Xylotrees stand in the top right corner of the planet.

---

## 1. The short version

- **Planet Xylophora is built.** It is your quest "Planetary Pioneers: Constructing Xylophora". [Source]
- **It is on the preview link only.** The class link is still version 43.
- **It has four big quests.** They follow your four tasks. Each one is an open problem: a purpose, bare facts, no steps.
- **The map is the maths.** The whole planet is a grid of squares that you walk on. One square of ground is one square of area.
- **It fills the biggest hole in the standards.** Seven AERO Grade 3 standards that had nothing in the game now have a quest.
- **Every cadet gets their own numbers.** I checked 20,000 of them. Every one gives a planet that can be finished.
- **No child has played it.** That is the real test, and it has not happened.

### How to get there

- On the preview link: tap **More**, then **Teacher**, then **Go to Xylophora**.
- Or fly: from space, fly to Galaxy Metrica, then tap **land on Xylophora**.
- Preview link: https://christopherfi-dev.github.io/galaxy_math_quest/next/

---

## 2. Why this planet

I read your Xylophora pages and my review of them again first.

| Reason | Detail |
|---|---|
| It is yours | Galaxy Metrica, Quest 2, next after Chronosia. Four tasks. [Source] |
| The standards | Area and perimeter had nothing in the game. That is four AERO standards (3.MD.5 to 3.MD.8). |
| Your tasks needed rebuilding anyway | My review found Task 1 above Grade 3 (triangle areas, decimals), Tasks 2 and 3 with no sheets and numbers that cannot work, and Task 4 never written. [Source: `reviews/xylophora.md`] |
| It can follow your new rules from the start | Bigger world, big quests that make them think, dead ends that stay dead. |

**What I did not choose, and why:**

- **The card battle.** The rules are yours and I have never been given the card set.
- **Space travel.** It is built. More of it would not teach more.
- **Chronosia's other three quests.** Still step lists. I would open them up next. See section 12.

---

## 3. What is yours and what is mine

| In the game | Whose |
|---|---|
| Xylophora, a planet of shapes, with ground "a patchwork of perfect squares" | [Source] |
| The four buildings: Home, Hospital, Food Store, Solar Factory | [Source] |
| The sleeping giant, and its shed skin as the building material | [Source] |
| The skin fails as a roof ("It's collapsing"). Xylotree leaves, stiff squares 2 by 2, save the colony. | [Source] |
| A colony map with a key | [Source] |
| Polygonal Pines, Circular Cacti, creatures "resembling living origami", the Modular Meadows, the Leafgroves | [Source] |
| The roles: Resource Manager, Space Architect, Resource Innovator. The title Planetary Pioneer. | [Source] |
| One square of the map is one square of area. The child builds by tapping squares. | [Proposal] |
| The Site Chief, the survey post, the order board, the Sun Ledge, the origami herder and its field | [Proposal] |
| Where every place sits on the map | [Proposal] |
| Every number, and the rule that makes each cadet's numbers | [Proposal] |
| What each order asks for (shortest wall, biggest floor, on the ledge) | [Proposal] |
| The Leafgrove having only just enough leaves | [Proposal] |

**What I left out of yours:** the magnetic tiles and the triangle tiles. Triangle areas are above Grade 3, and your own strand plan puts them in an advanced quest. [Source: " Updated Quests - Measurement Universe."] See section 11 for a way to bring the real tiles back.

---

## 4. The map

The planet is 40 squares wide and 26 squares tall. A screen shows about 16 by 12 of them. The picture follows the cadet. Mist hides what has not been seen.

| Place | Where | What is there |
|---|---|---|
| Landing Square | south-west | The ship. A fallen leaf, 2 squares by 2. |
| The Camp | west | The Site Chief. The order board. A tent. |
| The Giant's Skin | north-west | A great sheet of skin, in squares. The survey post beside it. |
| The Sleeping Giant | north | As long as a street. It breathes once a minute. |
| Sun Ledge | middle, north | A shelf of rock, 10 squares by 3. |
| Building Ground | middle | Flat clay, 14 squares by 8. |
| Leafgrove | north-east | Four Xylotrees, hidden behind pines. Two gaps lead in. |
| Modular Meadows | east | Bright patches. The origami herder and a fenced field. |
| The ring of cacti | south-east | Six Circular Cacti around soft sand. |
| A square pond, pines, rocks | here and there | Only what they are. |

Big flat things (the skin, the building ground, the ledge, the giant, the field) are seen whole once any part is seen. Everything else comes out of the mist square by square.

---

## 5. The four quests

Each one has a purpose in the story. None has steps. A wrong try is answered with what happened, never with what to do. Nudges come only when the child taps **Hint**, and they run out.

### Quest 1. The skin (your Task 2, first half)

- **Purpose:** the colony has nothing to build with. The cadet finds the giant's skin. The cutters need one number before they cut: how many squares?
- **What the child must work out:** the area of the skin. It is two rectangles joined in an L. Nothing says so. They can count every square, or see the rows.
- **How they answer:** a number, set on the survey post.
- **A wrong answer:** "You set the wheel to 62. The cutters measure out 62 squares. There is skin left over. The count is too small." Or too big. Nothing more. The box closes and they go back to look.
- **Nudges (2 to find the skin, 3 to count it):** walk into the mist; something big lies north; rows help; it is two rectangles; squares in a row, and rows.
- **Size:** 54 to 95 squares. Each rectangle is inside the 10 × 10 facts.
- **Standards:** AERO 3.MD.5, 3.MD.6, 3.MD.7.

### Quest 2. Four floors (your Tasks 1 and 4)

- **Purpose:** four buildings before the rains. The orders are on the board at the camp.
- **The four orders** (the numbers change for each cadet):

| Building | The order | What is hard about it |
|---|---|---|
| Home | "A floor of 8 squares. Any rectangle will do." | Finding sides that multiply to 8 |
| Hospital | "A floor of 24 squares. Wall panels are scarce: use as few as you can." | Many rectangles hold 24. Only one has the shortest wall. |
| Food Store | "12 wall panels are set aside for it. Use them all. Make the floor as big as you can." | Many floors use 12 panels. Only one is biggest. |
| Solar Factory | "A floor of 24 squares. It must stand on the Sun Ledge." | The ledge is narrow. 3 times what is 24? |

- **How they answer:** they type or tap **build hospital**, then tap two corners on the ground. That is the floor.
- **What the game says back:** only the size they marked, and one fact.
  - "You mark a floor 12 by 2. It is 24 squares. But the Chief counts the wall panels and shakes her head. 'Too many panels. The same floor can sit inside a shorter wall.'"
  - "You mark a floor 4 by 3. The Food Store has 12 wall panels. This wall needs more."
  - "It touches the Hospital. The Chief wants a path between buildings."
- **The layout is theirs.** Where they put each floor is the colony's plan. That is your Task 4.
- **Any floor can be laid again** in a new shape. This matters in Quest 3.
- **Nudges (3):** read the board; many rectangles hold the same squares but their walls differ; try some on paper.
- **Standards:** AERO 3.MD.7, 3.MD.8, 3.OA.4. The shortest wall and the missing side reach into Grade 4 (4.MD.3).

### Quest 3. The roofs (your Task 3)

- **Purpose:** the crew stretches skin over the Home. In the night it sags and falls in. "The colony needs something stiff and flat. And the rains are coming."
- **The game does not say what to use or where it grows.** The child has to remember the fallen leaf by the ship, or find the Leafgrove behind the pines.
- **What the child must work out:** how many leaves each roof needs. A leaf covers 2 squares by 2. Arms hold 6 leaves. The grove is a long walk.
- **How they answer:** by doing it. They pick a number of leaves, carry them, and tap a roof to lay each one.
- **The sting in it:** the grove grows only just enough. A long thin Home wastes leaves, because each leaf hangs over the wall. If the grove runs dry, the Chief says only: "No leaves left on the trees? Then some roof is using too many."
- **The way out is always there:** lay the Home again in a better shape. Its leaves come back.
- **Nudges (2 to find the leaves, 3 for the roofs):** something stiff, flat and square; trees to the east; a leaf covers 2 by 2; a leaf over a wall is partly wasted; a floor can be laid again.
- **Standards:** AERO 3.MD.5, 3.MD.6, 3.OA.3.

### Quest 4. More Homes, and the map key (your Tasks 2 and 4)

- **Purpose:** more families are coming.
- **The question:** "The cutters have 18 squares of skin left. Each family needs a Home like yours: 8 squares. How many more Homes can they cut?"
- **A wrong answer:** "The skin runs out before Home number 3." Or: "There is still skin enough for another one."
- **Then the key:** the child chooses a roof colour for each kind of building. Two kinds may not share a colour. The roofs on the map take those colours.
- **The ending** adds up what they did: skin found, used and left over; leaves laid and spare; wall panels. The Chief names them a Planetary Pioneer. A gold card.
- **Standards:** AERO 3.OA.2, 3.OA.3. A remainder that must be thrown away reaches into Grade 4 (4.OA.3).

---

## 6. Other things to find

- **The herder's field** (Modular Meadows). "Four herds graze this field. Each herd must get an equal part. How many squares is one part?" The sides of the field are not given: the child reads them off the ground. When it is right, the field is fenced into four parts and the game says "Each herd gets one quarter of the field." A card. AERO 3.G.2, and 3.NF.1 by name.
- **The giant hums.** Talk to it three times. A card.
- **The leaf print.** Dig in the soft sand inside the ring of cacti. A card.
- **Dead ends.** The pines, the cacti, the pond, the tent, the rocks and the old leaf do nothing useful. Your Novus law says most things should not. [Source]

**Cards on this planet:** 8. Four quests, the gold card, the field, two secrets.

---

## 7. Each cadet's own numbers

The game makes the numbers from a seed, once, when the cadet first lands.

| Number | Chosen from |
|---|---|
| Skin, first rectangle | 8, 9 or 10 wide; 6, 7 or 8 tall |
| Skin, second rectangle | 3, 4 or 5 wide; 2 to 5 tall |
| Home | 6, 8 or 12 squares |
| Hospital | 12, 16, 20 or 24 squares |
| Food Store | 10, 12, 14, 16 or 18 wall panels |
| Solar Factory | 15, 18, 21 or 24 squares |
| Which way round the skin lies | four ways |
| The herder's field | eight sizes |

The game keeps the first draw where the skin left over makes 2 to 6 more Homes.

**Checked on 20,000 seeds** (`checks/xylophora_quest_check.py`, which shares no code with the game):

- 6,312 different sets of numbers.
- The skin on the map counts to exactly the right number, every time.
- The Hospital always has exactly one shape with the shortest wall.
- The Food Store always has exactly one biggest floor.
- The floors always fit on the ground, with paths.
- The grove always holds enough leaves for careful roofs, and one more.
- Every times fact a child needs is inside 10 × 10.
- More Homes: 2 in 8,153 seeds, 3 in 5,483, 4 in 3,449, 5 in 1,956, 6 in 959.
- In 16,698 seeds some skin is left over at the end. In 3,302 none is.
- A thin Home runs the grove dry in 10,461 seeds. In the rest, the one spare leaf saves it.

---

## 8. A key for you

You cannot look up one child's answers here, because each child has their own. These tables give every answer there can be.

**The skin:** first rectangle (wide × tall) plus second rectangle. Count the two on the child's screen.

**Hospital, the shortest wall:**

| Squares | Floor | Wall panels |
|---|---|---|
| 12 | 3 by 4 | 14 |
| 16 | 4 by 4 | 16 |
| 20 | 4 by 5 | 18 |
| 24 | 4 by 6 | 20 |

**Food Store, the biggest floor:**

| Wall panels | Floor | Squares |
|---|---|---|
| 10 | 2 by 3 | 6 |
| 12 | 3 by 3 | 9 |
| 14 | 3 by 4 | 12 |
| 16 | 4 by 4 | 16 |
| 18 | 4 by 5 | 20 |

**Solar Factory, on the ledge:**

| Squares | Floor |
|---|---|
| 15 | 3 by 5 |
| 18 | 3 by 6, or 2 by 9 |
| 21 | 3 by 7 |
| 24 | 3 by 8 |

**Leaves for a roof:** halve each side, rounding up, then multiply. A 4 by 6 roof needs 2 × 3 = 6. A 3 by 8 roof needs 2 × 4 = 8.

**More Homes:** skin left, shared into Homes. What is left over is thrown away.

**The Teacher's log** (More, Teacher) shows each quest when it is finished: the try it was solved on, and how many nudges were used.

This guide is in a public repository. A student who finds it has the tables. I told you the same about the station codes.

---

## 9. The standards

| AERO Grade 3 | In short | Before tonight | Now |
|---|---|---|---|
| 3.MD.5 | what area is | nothing | Quests 1 and 3 |
| 3.MD.6 | area by counting squares | nothing | Quests 1 and 3 |
| 3.MD.7 | area and multiplication; shapes made of rectangles | nothing | Quests 1 and 2 |
| 3.MD.8 | perimeter; same area with different walls; same wall with different areas | nothing | Quest 2 |
| 3.OA.2 | ÷ as sharing or grouping | nothing | Quest 4, once |
| 3.OA.4 | find the unknown in 3 × ? = 24 | nothing | Quest 2, once |
| 3.G.2 | cut a shape into equal parts | nothing | the herder's field, once |
| 3.NF.1 | unit fractions | named, not asked | named again ("one quarter"), still not asked |

**Still nothing:** fractions on a number line and comparing fractions (3.NF.2, 3.NF.3), litres and grams (3.MD.2), measuring lengths and line plots (3.MD.4), kinds of shapes (3.G.1), properties of × (3.OA.5).

"Has a quest" is not the same as "strong". One quest shows whether a child can do it once, with time to think.

---

## 10. How it follows your rules

| Your rule | How this planet keeps it |
|---|---|
| Big quests must make them think and struggle | No quest has steps. The Hospital and the Food Store cannot be done by one guess. |
| Try and fail | Every wrong try costs only a walk. The game says what happened and stops. |
| Dead ends are real | Most things on the planet do nothing. The Chief has no lead on the leaves. |
| Do not smooth what is hard | A thin Home is accepted. Its cost arrives later, at the grove. |
| A purpose and a story | Families are coming. The rains are coming. The roof falls in. |
| Planets must be bigger | Four times the squares of Chronosia, with a moving picture. Six places, four quests, a side job, two secrets. |
| The picture stays still | Checked: the same six-screen test now walks Xylophora too. |
| Code holds the facts | Every number, check and reward is in code. Nothing is left to an AI. |

**Tested by a script, not by a child:** no wrong answer and no nudge ever shows the right number. The play test checks each one.

---

## 11. What is not done, and what it costs

- **No child has played it.** Everything below is a guess until one does.
- **No AI.** A word the game does not know gets the same reply as on the other planets.
- **Your magnetic tiles are not in it.** [Proposal] One real-life step would bring them back: "Build your Hospital with real tiles. Show your teacher." Then a code, as on the station. It needs a code from you and a line in this guide.
- **Xylophora is not locked.** Your plan locks it behind Shapes Quest 1, which was never built. [Conflict] On the preview anyone can land.
- **The unit is "squares".** Your sheet said "meters", and should have said square metres. I used "squares" so the word matches what the child sees. One line would add "Each square is 1 metre by 1 metre."
- **No quick practice here.** Chronosia has wisps. Xylophora has nothing to catch yet. The origami creatures could be that.
- **The class view on the server** does not know about Xylophora.
- **On a phone** the ground is small. It works, and the test plays it, but it is built for an iPad.
- **The Chief's speeches are long.** Five or six short sentences. With reading cards on, each new one waits for OK.

---

## 12. What could prove this wrong

- **Marking a floor by two taps may not be obvious.** If children do not find it, the whole of Quest 2 stalls. Watch the first child at the building ground.
- **The Hospital may be too hard.** "Use as few as you can" needs several tries and a comparison. That is Grade 4 thinking. If nobody gets it without a nudge, it is a stretch task, not a Grade 3 one.
- **The grove running dry may feel unfair.** The cost of a thin Home arrives twenty minutes later. A child may not connect the two. That is the point of it, but watch whether they rebuild or give up.
- **Counting the skin square by square works.** Nothing forces rows × columns. A child may count to 83 and be right. That is honest Grade 3 (3.MD.6), but it does not show 3.MD.7.
- **I cannot tell how long it takes.** My guess is 40 to 70 minutes over two sittings. [Estimate]
- **The Leafgrove may be too well hidden.** Two nudges point east. After that there is nothing.

**What I would watch with one child:** do they mark a floor without help; what do they try first for the Hospital; do they pick a number of leaves or just grab six; what do they do when the grove is bare.

---

## 13. Decisions for you [Proposal]

| Decision | Choices | What each costs |
|---|---|---|
| The lock | Open to all · Open after Voltara · Open after Chronosia | A lock keeps the galaxy in your order. Open lets you test it now. |
| Real tiles | None · One real-life step with a code | The step keeps the hands-on part you built. It needs you in the room. |
| The unit | "squares" · "square metres" | Square metres is the real word. It is longer to read. |
| The tight grove | One spare leaf (built) · Three spare · Plenty | Fewer spares means more children must rebuild. Plenty means the shape of a floor never matters. |
| What the game says about a marked floor | The sides only (built) · The sides and the squares | Telling the squares does the multiplying for them. |
| Names | Site Chief, Sun Ledge, origami herder | All mine. Change any of them. |
| Quick practice on Xylophora | None (built) · Origami creatures to catch | Practice with area facts for a quarter of a credit, as on Chronosia. |
| Next | Open up Chronosia's three other quests · Fractions (a new place) · You say | See section 9 for what still has nothing. |

---

## 14. The tests

| File | What it does |
|---|---|
| `checks/xylophora_quest_check.py` | 20,000 seeds worked out again in Python: the nine checks in section 7 |
| `checks/xylophora_test.js` | Plays the whole planet on an iPad sideways, an iPad upright and a phone, each with a different cadet's numbers. Wrong tries, the dry grove, laying the Home again, the key, the field, the secrets, a reload, flying away. Checks that no reply shows an answer. |
| `checks/still_picture_test.js` | Now 30 moments on six screens, six of them on Xylophora. The picture never moves or changes size. |

The first two share one check number, so the game's rule and the Python rule cannot drift apart unseen.
