# The Reach: region 2 of Planet Algora, as built

**Date:** 22 November 2026, night. **For:** Marc. **From:** the big world thread.
**This is version 3.** Versions 1 and 2 were designs. Two independent reviewers each found blockers. This version is what is built, on your word to push on (Brief 2).
Everything is **[Proposal]** unless it says [Source] or [built].

**Your decisions are in section 8.** For each one I used my own recommendation, as the brief says. Every one can be changed.

---

## 1. The story, told before any maths [built]

The guard on the far bank opens the reed gate: "The harbour keeper needs every hand she can get."

In the harbour, the keeper says, in five short pages:

1. "A sky-walker! I am the harbour keeper. We need every hand."
2. "Everything here moves by raft. The high water is coming. After it, no raft can sail for a long time."
3. "Three towns have sent for baskets of river rice: Stilt Town, Reed Town and Mud Town."
4. "The Makers built us a board that worked out every load. When the Gate broke, it went dark. Now nobody can load the fleet."
5. "Go to each town. Its speaker will give you an order tag. Hang the tags on my board. Then load the fleet."

**What is wrong:** the loading board went dark with the Gate. Nobody can work out the loads.
**What the cadet does:** fetches three order tags, then plans the whole fleet.

---

## 2. The big quest: the fleet [built]

### First, three towns

- The towns are places on the map: north, east and south of the harbour, over plank bridges.
- Each town's speaker says the order in baskets and hands over a tag. The child carries it back and hangs it on the board.
- **The "last season" dials of version 2 are gone.** The reviewer showed they changed nothing and could mislead.

### The rules, in the keeper's words, each with its reason

- "My harbour has three kinds of raft. The number on a raft's sail says how many baskets it carries."
- "Rule one: a raft sails full. A raft that is part empty tips over."
- "Rule two: a town's rafts are tied in one line, nose to tail. So all of one town's rafts are the same kind. Two towns may use the same kind."
- "Rule three: send each town exactly its order. More would rot on the dock."
- "The water gate has a lamp for each town. It opens when all three are green. Until then, nothing sails, and you can change every line."

### The finished example: the baker's trays

About loaves, before the board opens the first time:
- "I bake 24 loaves. I have trays for 5, trays for 6 and trays for 8. A tray goes in full, or it burns."
- "Trays for 5? 4 trays hold 20. 5 trays hold 25. No number of full trays makes 24."
- "Trays for 6? 4 times 6 is 24. But I have only 3 trays for 6."
- "Trays for 8? 3 times 8 is 24. And I have 3 of them. So: 3 trays of 8."

It shows all three moves: a kind that cannot fit, a kind that fits but runs out, a kind that works. No child has an order of 24.

### What the child looks at and does

- **The picture is the harbour:** the rafts left of each kind, in rows, each with its number on its sail. Three channels, each with its town's name, its order tag and its line of rafts. The water gate with three lamps.
- **On the desk, one town at a time:** "Mud Town wants 72 baskets. Rafts of: 7, 8, 9." Tap a kind. "How many rafts of 8?" Type the number.
- The rafts move from the harbour into that town's channel as the child types.
- **Asking for more rafts than there are** is refused at once: "Only 3 rafts of 8 are left in the harbour."
- **"Send the fleet":** each town's lamp turns green or red. The game does not say "too few" or "too many".
- **Nothing sails until all three lamps are green.** So no line a child sets can ever make the job impossible. That was version 2's blocker.
- **The thinking:** for each town, which kinds can make its order with full rafts? "What times 8 makes 72? Does anything times 7?" And a lamp can be green and still be in the way: its line may use rafts another town needs.

### What happens when the gate opens

- The fleet sails. The Rillfolk's Rule Stone lights: two of five.
- **The ship's Navigation goes to Level 2:** "The Rillfolk fit a star compass to your ship." [Source: Marc, 22 November: big quests upgrade ship parts.]
- A card, and a raft of the child's own. The raft is for later: the north channels are still shut.
- The towns' speakers, the child on the raft and the old singer all say new things. The singer sings, and the Mender with big ears, over the river, already said he missed that song.

---

## 3. The numbers, on 20,000 children

`checks/bigworld_reach_numbers_check.js` reads the rule out of the page and does its own search of every line a child could set.

| | |
|---|---|
| Kinds of raft | three different numbers from 4, 6, 7, 8, 9 |
| Rafts of one kind | 1 to 9. A harbour holds 18 on average, 27 at most |
| Orders | three different numbers from 12 to 81. Never 24 |
| A plan that serves all three towns | always exists. Exactly one for 98.8% of children; two for the rest |
| Towns whose order two kinds can carry | 1.6 of 3 on average |
| Towns with two ways the harbour has rafts for | 1.1 of 3 on average |
| A trap | always: a line right for one town that no full plan uses |
| Every fact | inside 10 × 10. 72% of the lines in a right plan use a 7, 8 or 9 |

**It is hard on purpose.** One right plan, and the hard times tables. That is your decision 2.

---

## 4. A mini quest of the lantern shape: the thing in the well [built]

[Source: Marc, 22 November: "cave needs lantern... needs special soft sand... Take it to the lantern makers. Use math to help build it. Take lantern back to cave. Gold epic card as reward inside after solving a problem."]
Your lantern is the main thread's to build. This one has the same shape, with other things. It crosses the Meadow and the Reach.

| Step | Where | What happens | The maths |
|---|---|---|---|
| 1 | The Meadow's well | "Far down, something glints. Too deep to reach. A rope with a hook could do it. But how deep is the well?" | |
| 2 | The well's winch | The child turns the handle and counts the turns. Each turn lowers the bucket 3 arm-lengths. Tally marks on the picture are the child's turns. Nothing says how deep | a count |
| 3 | The net mender, in the harbour | "How deep is the well?" Then: "One bundle of long reeds makes 9 arm-lengths of rope. How many bundles must I have?" | 3 × 6 = 18. Then ? × 9 = 18 |
| 4 | The reed cutter, back in the Meadow | "2 bundles? I tie 10 reeds in a bundle. How many reeds must I cut?" | 2 × 10 |
| 5 | The net mender | She twists the rope | |
| 6 | The well | The rope brings up a Makers' box with two wheels | |
| 7 | Inside: one real problem | A rule in two steps: × ? then + ?. The child tests it with 1 to 10 pebbles and sets both wheels. A wrong pair is shown wrong by a test | a rule in two steps |
| | | **An epic card: Deep Finder.** And a note: "The Gate's code is five rules in a row. Each people keeps one." | |

- **Every step has its own line on the Needs list,** and the line changes as the child moves on.
- **The makers never do the sum.** A wrong answer gets "That does not come to 18", never the right number.
- **The rope's fact is a new one,** not the winch's fact turned round. The number check tests that.
- **Finished example for the box:** scratched on its lid: another box, long ago. 1 in showed 7. 2 in showed 12. 3 in showed 17. So × 5, then + 2. No child's box has that rule.
- **The box is a stretch:** a rule in two steps is past Grade 3. It is a mini quest, off the main road, and it has nudges.

**Two smaller things in the Reach:**
- **A bottle in the reeds** (a secret): a note from a Rillfolk child to Pim, over the river. Carry it to Pim: a card.
- **The sunk raft,** seen from the long pier: "Something shines under it. The water is too deep to wade." It needs a way to dive. For later.

---

## 5. The maths, against the standards

| What the child does | Standard | How sure |
|---|---|---|
| "What times 8 makes 72? Does anything times 7?" for three towns | 3.OA.4, with 3.OA.7 | sure |
| Rafts and baskets as equal groups | 3.OA.3 | sure |
| Planning three towns with rafts that run out | no content standard: problem solving | not claimed |
| The well: turns × arm-lengths; ? × 9 = 18; bundles × 10 | 3.OA.3, 3.OA.4, 3.NBT.3 | sure |
| The box: a rule in two steps | past Grade 3 | a stretch, off the main road |

---

## 6. The law of the road, now in the page's check [built]

- **Leave the Menders' quest undone:** the Rillfolk can still be reached, by the stepping stones. **Leave the Rillfolk's undone:** the Menders can.
- The check fails if a tool is ever one of a border's two ways, if a big quest needs a thing from another region, or if a mini quest step has no line for the Needs list.
- Fifteen broken copies of the world are fed to the check. It catches each one.

---

## 7. What could prove this wrong

- **Too hard.** One plan, hard tables, a trap. Watch whether a child finds the idea "write down every way for every town". The second nudge says it.
- **Lamps one at a time.** A child can try lines for one town until its lamp is green. With rafts of 7 that is: 7, 14, 21... by trying. It is slow, and it is skip counting. But it is not planning.
- **Sail numbers are small** when a line has 9 or 10 rafts, above all on a phone.
- **Six pages of rules and example** before the board opens the first time. "Read to me" is there. "The rules" button brings them back.
- **Words that may need you:** harbour, fleet, order, tag, nose to tail, high water, winch, arm-length, bundle.
- **The well quest is a lot of walking:** the well, the harbour, the reeds, the harbour, the well. About a minute of walking in all. Your lantern crosses planets; this crosses a river.
- **No child has played any of it.**

---

## 8. Your decisions. I used my own recommendation for each.

| | Decision | What is built | The other way, and its cost |
|---|---|---|---|
| 1 | Can every town be served? | Yes. A puzzle with a right plan | Too few rafts, and the child chooses who goes without. A real choice that stays; but a kind child can fail it, and the maths gets thinner |
| 2 | How hard are the numbers? | Kinds from 4, 6, 7, 8, 9. One right plan for nearly every child | Add 5s and more spare rafts: easier, quicker, less to think about |
| 3 | What a wrong line shows | A red lamp for that town. No "too few" or "too many" | One lamp for the whole fleet: no trying town by town, but a child cannot tell which line to check |
| 4 | A town the child never visited | Its tag is not on the board, and the fleet will not sail | The keeper tells the order: less walking, less of a world |
| 5 | Sending again | Free | Each try costs a tide: a wait that grows |
| 6 | Which ship part | Navigation, from the Rillfolk. Engine Core, from the Menders | Any other match. It is one table in the page |
| 7 | Is an upgrade lasting? | Yes: it is kept in the save and shown on the ship panel | **[Conflict]** The battle thread has Level 2 upgrade cards that last one battle. Your words today sound lasting. Which? |
| 8 | Names | Stilt Town, Reed Town, Mud Town. Cards: Fleet Planner, Deep Finder (epic), River Post | Yours |
| 9 | The mini quest's inside problem | A rule in two steps, past Grade 3 | A Grade 3 problem: safer, but less of a prize |

---

## 9. What the reviewers found, and what changed

| Reviewer | Fault | What I did |
|---|---|---|
| 1 | A kind plan (share the rafts) fed nobody, and nobody had said why | The three rules are the keeper's words, each with a reason |
| 1 | The fleet needed no Grade 3 maths | New problem: kinds of raft; the missing number many times |
| 2 | **A town served early could make the job impossible** | Nothing sails until all three lamps are green |
| 2 | "A town with only one way" could be read two ways | That nudge is gone. The nudges ask for every way for every town |
| 2 | The "last season" dials changed nothing and could mislead | Removed |
| 2 | "Type how many": rafts or baskets? May two towns share a kind? | The desk says "How many rafts of 8?" Rule two says two towns may share a kind |
| 2 | When does the keeper refuse too many rafts? | At once, as the child types |
| 2 | The baker never showed "it fits, but there are not enough" | Added: trays for 6, but only 3 of them |
| 2 | Difficulty was decided silently | Section 3 gives the figures. Decision 2 |
| 2 | The check's search stopped at 12 rafts | It searches to 20 now |
| 2 | No ship part, no mini quest, no surprise | Navigation; the well quest; a loose cog on the walk (in the Meadow) |

**Not answered:** the reviewer's point that trying lines one town at a time finds every fit without planning. It is true. Decision 3 is the choice.
**Not reviewed again as a note.** The built pages go to a reviewer as pictures.
