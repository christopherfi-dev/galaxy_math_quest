# GMQ — a bigger universe: what is possible, and a first proof — v1 — 2026-11-17

**Stage:** an answer to your message, with two things built to back it up (sketch version 27).
**Tags:** [Source] = your words or your material. [Proposal] = my suggestion.

---

## 1. What you said [Source: Marc, 2026-11-17]

- Galactic Trade could be more of a game. It should not be static. "It's a huge universe. They should be able to explore things."
- You sent your Novus engine again, "for a true MUD experience".
- Typing is hard for children on iPads. Idea: after a child taps a doing word, show the words for the things in that place, to tap.
- Your daughter finished most of the station in 30 or 40 minutes. You want a deeper game.
- To cover every skill, each galaxy needs several planets. "Could there be five or six or ten worlds in each one?"
- You do not know how well the AI can make up new worlds, or how we would give them pictures.
- "I don't know the limits of technology... I don't know if we're just limiting ourselves."
- These are ideas, not orders. You want to know what can work.

---

## 2. The short answer

- **We have been limiting ourselves in one way.** Every place so far was drawn by hand, in code, one at a time. Voltara took a day. Ten worlds a galaxy would take months that way.
- **There is a way out, and it fits your architecture.** A world does not have to be drawn. It can be **data**: this sky, these far hills, this ground, these plants, this creature, a secret here. Code draws any world from a kit of parts. The AI's job is to write the data, inside your constraints. Code checks it before a child sees it.
- **I built a first proof tonight.** All 20 of your trade planets can now be landed on. Each one is a small world made from the kit. Nothing in them was drawn by hand.
- **I also built your tap-the-words idea.** It works for every command the game knows.
- **What is not possible today:** the AI painting new pictures live, for each child, in a style that matches. Section 6 says why.

---

## 3. What I built

### 3.1 Tap the words [Source: your idea]

- Under the doing words there is now a row called **Here**. It lists the things in the place you are in.
- Tap a doing word, then a thing. The command runs. No keyboard.
- Tap a thing by itself and you look at it.
- It works on the station, on Voltara, on the small worlds and in space.
- The keyboard still works, for children who want it.

**One cost:** a child no longer has to notice a thing in the picture to know its name. That takes away a little of the finding. Hidden things still stay off the list until they can be seen.

### 3.2 Small worlds from a kit [Proposal]

**How to see it:** Teacher bar, **Go to space**. Tap the trade beacon. Scan a planet. Then tap **Land on** it.

Each of the 20 trade planets is now a world with:

| Part | How many kinds in the kit |
|---|---|
| A sky, with moons and sometimes a ring | 8 skies |
| Far land: peaks, dunes, table rocks, towers, arches, floating islands | 6 |
| Ground | 6 |
| Three plants | from 6 kinds, in 10 colours |
| A rock | 3 kinds |
| A creature: body, legs, eyes, horns, colour, how it moves | 4 × 4 × 3 × 3 × 10 × 3 |
| Its own name, and the creature's name | made from sounds, checked to be kind and never used twice |
| A trade post that shows the planet's own distance and profit | your numbers [Source] |
| **One secret**, hidden under one of four things | |
| **Three or four dead ends** | |
| **One lock**, from Galaxy Numerix's own maths: round to the nearest 10, round to the nearest 100, add, or find the difference | |

**How a world plays. This part is from Novus.** [Source: your engine]
- **Describe, don't label.** Nothing on the world is marked as important.
- **Most things lead nowhere.** A puff ball lets out dust. A fan leaf folds shut. That is all they do.
- **The creature does not use words.** It only does things. The second time you talk to it, it looks at one thing, then looks at you. That is the only clue.
- Touch that thing and you find a shell box with a number lock. Open it and you have a **star seed**. There are 20 to find.

**What it is not, yet:** deep. Each world is one screen and one secret, about three minutes. It is a proof that worlds can be made from parts. It is not yet the big game.

---

## 4. How this could cover every skill in the scope and sequence [Proposal]

You have two things already that fit together.

| You have | What it is |
|---|---|
| **The skills bank** | 72 skills with problem makers, pictures, maths words and 234 short stories. I built it earlier. You said it was "too much" as a trainer, and it is hidden now. |
| **The world kit** | new tonight |

Put together:

- **A galaxy is a strand.** Numerix is numbers. Metrica is measuring.
- **Each small world carries three to five skills from its galaxy,** as locks on things you find. A lock is a reason to do a sum, not a quiz.
- **Ten worlds in a galaxy cover its whole strand,** in order.
- **The big planets stay hand-made:** Voltara, Chronosia. They are your projects, with real-life tasks, a decision that matters and a gold card.

So the universe has two kinds of place. **A few deep planets, and many small worlds around them.**

---

## 5. Who makes the worlds? Three ways

| Way | How it works | Good | Cost |
|---|---|---|---|
| **A. Made by a rule** (built tonight) | The planet's letter picks the parts. | Free. Works with no server. Every child sees the same world, so they can talk about it. | The words are plain. Worlds differ in looks more than in ideas. |
| **B. Written ahead by the AI, checked by you** | I, or your own AI, write each world as data: its parts, its facts, its creature, its secret, its dead ends. Code checks the rules. You read them once. They are stored. | Richer and stranger worlds. Each one has an idea. Still the same for every child. | Your time to read them. Perhaps 10 minutes a world. |
| **C. Made live for each child** | A child flies somewhere new. The server asks the AI for a world, inside the constraint file. Code checks it. It is saved, so it stays that child's world. | A truly endless universe. "I discovered a planet." This is Novus. | Needs the server and the AI running. Costs a little each time. A weak world can slip through. No two children can compare notes. |

**My advice:** B for the galaxies, then C for one place only: an edge of the map called something like "uncharted space", where a cadet can discover a world that is theirs.

**Why not C everywhere:** you said yourself that an endless made-up world can feel thin. A checked world is better than an endless one. And a class needs places in common.

---

## 6. The limits, plainly

| Question | Answer |
|---|---|
| Can the AI make up new worlds? | **Yes, as data.** It is good at that, inside rules. Novus already shows it in words. |
| Can it give them pictures? | **Yes, from a kit of parts.** Not by painting. The more parts in the kit, the more worlds look different. Tonight's kit is small. |
| Can it paint a new picture for each world, live? | **Not well enough yet.** Picture-making AI is slow, costs more, cannot keep one style across a game, and is hard to keep safe for children. I would not build on it now. |
| Can a child type anything and get an answer? | **Yes, with the server and the AI on.** That is built, behind a check. It is switched off until you add a key. |
| Can the AI change the world when a child does something new? | **Not yet.** Now it can only describe. Letting it change things safely is the next step for the server. |
| Can the AI mark the maths? | **It should not, and it does not.** Code does. That is your own rule, and it is the right one. |
| Is typing a wall for Grade 3? | **Less of one now.** Tap-the-words covers every command the game knows. Free typing is for the unexpected. |

**What from Novus I would not bring over:** the fuel clock and "Earth is dying" pressure, the three-tier judgment, and locks that need two kinds of test. They suit older students. For Grade 3 I kept three things: describe don't label, dead ends are real, and discovery comes from doing.

---

## 7. Galactic Trade as more of a game [Proposal]

Tonight's change: every trade planet is a place you can land on.

Ways to go further, cheapest first:

1. **Trade news.** Three of your scenario cards are sound: Meteor Shower, Alien Investors, Resource Scarcity. They arrive before a trip, and you may change your route.
2. **Goods.** Each world sells something: glow moss, star salt, cloud silk. Buy low on one world, sell high on another. That is real trade, and it is subtraction.
3. **Star seeds matter.** A seed could be planted on Voltara, or traded for fuel.
4. **Creatures ask for things.** A creature on one world wants something from another. That gives a reason to fly.
5. **Other cadets.** With the server, a class could share one market. Prices fall when everyone sells the same thing.

I have built none of these. Each is one to three days.

---

## 8. What could prove this wrong

| Claim | Test |
|---|---|
| Small worlds feel like exploring | Your daughter lands on three. See whether she wants a fourth. |
| The creature's clue is found | Watch whether she talks to it twice, or gives up. |
| Dead ends are fun, not annoying | Listen for a laugh at the puff ball, or a sigh. |
| Worlds from a kit do not all feel the same | Ask her to tell two worlds apart from memory. |
| Tap-the-words does not kill the reading | See whether she still reads the words on the chips, or taps them all in turn. |

---

## 9. Decisions for you

1. **Is this the right direction?** A few deep planets, and many small worlds made from a kit.
2. **Who makes the worlds:** A, B or C in section 5?
3. **Should small worlds carry the skills bank,** so that ten worlds cover a strand?
4. **Which of the five trade ideas** in section 7 do you want first?
5. **Star seeds:** what are they for?
6. **The Here row:** keep it always, or only after a child has looked around?
