# The Reach: design for region 2 of Planet Algora

**Date:** 22 November 2026. **For:** Marc. **From:** the big world thread.
**Nothing here is built.** Everything is **[Proposal]** unless it says [Source] or [built].
Read `GMQ_Big_World_Design_v1_2026-11-22.md` first. This note fills in its outline for the Reach.

**Why this note exists:** the Meadow was built before you saw its design, because you said to work on. The reviewer was right to mark that. For the Reach I stopped at the design. **Please read it before I build.**

---

## 1. The story, told before any maths

The cadet crosses the Rill and meets the Rillfolk: river people who live in houses on legs.

Told by the harbour keeper, on the fleet dock, in short pages:

1. "Everything here moves by raft. Every raft carries the same load."
2. "The high water is coming. After it, no raft can sail for a season."
3. "Three towns have sent for baskets of river rice: Stilt Town, Reed Town and Mud Town."
4. "Each town's dock has a load dial. It tells us how many rafts to send. When the Gate broke, a window burnt out on every dial."
5. "We do not know how many rafts each town needs. And I do not think we have rafts for all three."
6. "Go to each town. Mend its dial. Then come back, and choose where the fleet goes."

**What is wrong:** three dials with a burnt window, and a fleet too small for everyone.
**What the cadet fixes:** the dials. Then the cadet decides who gets the rice.

---

## 2. What the child does

### Part 1: three towns, three dials

The child walks to each town. They are places on the map, a short walk apart.

- **What the child looks at:** the town's dock fills the picture. The load dial has three windows:

  **RAFTS × BASKETS ON EACH RAFT = BASKETS**

  One window is burnt. The dock shows what the other two say, as things: rafts tied up, a load on one raft, or the town's order written on a board.
- **The three dials ask in three ways,** mixed for each child:

| Dial | What is burnt | The child finds |
|---|---|---|
| rafts | ? × 7 = 42 | how many rafts |
| total | 5 × 7 = ? | how many baskets |
| share | 28 ÷ 7 = ? | how many rafts, written as sharing |

- **What the child does:** taps the number for the burnt window. The dock crew then loads by the dial.
- **A wrong number is shown wrong by the loading,** in words only: "They run short of baskets" or "Baskets are left on the dock." No number is given back.
- **The picture must not give the answer.** Baskets are drawn stacked in tens, so the order can be read but the answer cannot be counted off. The rafts for the unknown are not drawn until the dial is right. *This was the reviewer's warning.*
- **What the child takes away:** how many rafts each town needs. It goes in the notebook when the child taps "Write it down", as in the Meadow.

### Part 2: the fleet (the open problem that lights the Rule Stone)

- **What the child looks at:** the harbour fills the picture. The fleet's rafts are tied up in a row: 8 to 16 of them, to count. Three channels lead away, one to each town.
- **The facts, and nothing else:** the fleet. The three towns' needs, if the child has found them. No steps.
- **What the child decides:** how many rafts go to each town. Three boxes. Then "Send the fleet".
- **Nobody can feed all three.** For every child:
  - all three towns together need more rafts than there are
  - **the two biggest towns together do not fit.** A child who picks them without adding sends one town short
  - the other two pairs do fit. So more than one plan works. The choice is the child's
- **What happens:** the rafts sail. A town is fed if it gets all it asked for. The picture shows each town: fed, or short.
- **The choice stays.** [Your rule 4: your decision must matter. A place can be left worse off.]
  - The town left out says so when the child visits. Its people are thinner on words, not on drama: "No rice this season. We will fish."
  - A town sent rafts it did not need has rafts rotting at its dock.
  - The report tells you what each child chose, and whether they checked the sum first.
- **The stone lights when the fleet has sailed and at least two towns are fed.** If only one is fed, the keeper says: "The tide is not here yet. Call the rafts back. Think again." That costs a walk, not a dead end.

### How long

A guess: 30 to 40 minutes. Three walks, three dials, the fleet, and the towns' thanks.

---

## 3. The finished example

Shown by the baker in the harbour village, before the first dial. About **loaves and trays**, not baskets and rafts.

- "I bake 24 loaves. A tray holds 6."
- "How many trays? I ask: what times 6 makes 24?"
- "4 times 6 is 24. So 4 trays."
- Picture: the oven wall. The loaves in rows. The trays appear only on the last page.

No child gets a town with 4 rafts of 6. The number check tests that.

**A second example, for the choice?** I would not give one. A finished example of "choose who goes short" would be the answer. The keeper's words carry it.

---

## 4. The numbers, checked on 20,000 children

`checks/bigworld_reach_numbers_check.js`. The rule is in that file until the Reach is built.

| | |
|---|---|
| Baskets on each raft | 4, 6, 7, 8 or 9. The same for every raft |
| Rafts each town needs | three different numbers from 3 to 9 |
| The fleet | 8 to 16 rafts |
| All three towns | always more than the fleet |
| The two biggest | never fit |
| The other two pairs | always fit |
| Spare rafts | never enough for the town left out |
| Every sum | a Grade 3 fact. Nothing over 81 |
| Plans that feed two towns | exactly two pairs, for every child |

**One cadet, as a picture of it:** 7 baskets on a raft. Stilt Town needs 6 rafts (42 baskets). Reed Town 5 (35). Mud Town 3 (21). The fleet is 10 rafts.
- All three need 14. Too many.
- Stilt and Reed need 11. One too many.
- Stilt and Mud need 9. That works, with 1 raft spare.
- Reed and Mud need 8. That works, with 2 spare.

---

## 5. The maths, against the standards

| What the child does | Standard | How sure |
|---|---|---|
| ? × 7 = 42 | 3.OA.4: find the unknown in a × or ÷ equation with three numbers | sure |
| 28 ÷ 7 = ? as "what times 7 makes 28" | 3.OA.6 | sure |
| Equal groups in a story | 3.OA.3 | sure |
| Add two towns' rafts and compare with the fleet | 3.OA.8: a two-step problem | sure |

This is the standard the game has only once (Xylophora's Solar Factory) [Source: the AERO map].

---

## 6. People, finds and secrets

| Who or what | Kind | What happens |
|---|---|---|
| The harbour keeper | asker, giver | The story, the fleet, the Rule Stone, the raft |
| The baker | teller | The finished example |
| A dock hand in each town | asker | The dial |
| A net mender, a child on a raft, an old singer | greeters | They say hello. The singer sings the song the Mender with big ears missed |
| The Rillfolk guard [built] | teller | "The road is open again." |
| A message in a bottle, in the reeds | secret | A note from a Rillfolk child to a friend in the Meadow. Carry it to Pim: a card. It links two regions; it helps no maths |
| A sunk raft, seen from the long pier | secret, a pointer | Something shines under it. It needs a way to dive: a link for later |

- Two secrets for one job and three dials. Neither helps with a number.
- Some people only say hello [Source: Marc, 21 November].

---

## 7. The map, the borders and the raft

- **The Reach is already painted** on the map: reeds, channels, about 30 by 35 squares. The three towns and the harbour go on it, each a short walk from the next. The map check will measure the walks.
- **The reed gate** [built, shut] opens when this region is built.
- **The raft is the keeper's thanks.** It is a tool: it opens short cuts on the lake and the coast. By the law of the road it is never the only way anywhere.
- **Borders out of the Reach,** each a lock at the door:
  - north, to the Lake's shore: an open path
  - east, to the Hills: the lift. It rises on the right skip count
- **When this is built,** the page's check gets the law of the road: leave the Rillfolk's job undone, and every other people can still be reached.

---

## 8. What could prove this wrong

- **Children may send the fleet without visiting all three towns.** Then they do not know a town's need. The keeper should say plainly which dials are not mended, and let them sail anyway. A town they never visited goes short. Is that fair?
- **"Who goes short" may upset some children,** or be a joke to others. You said children know the story is not real. Watch the first class.
- **The trap may feel like a trick.** The two biggest towns do not fit, and nothing warns the child. The keeper's line 5 is the warning: "I do not think we have rafts for all three."
- **A wrong dial costs nothing.** With answers from 3 to 9, three guesses find any dial. The loading says "short" or "left over", which narrows it. Decision 2.
- **Three dials may be too few to practise the missing number.** One job, three questions. The other regions do not practise it at all.
- **The picture may still give the answer,** if a child counts stacked baskets one by one and deals them out in their head. That is the maths done slowly, not a leak.
- **Nobody has seen it.** No picture exists yet.

---

## 9. Your decisions

| | Decision | Options, with costs | I would choose |
|---|---|---|---|
| 1 | Is "who goes short" the right open problem? | Yes: a real choice with a cost. No: make the fleet enough for all, and the problem is only to load it right. That is safer and smaller | yes |
| 2 | A wrong dial | Free (as the Meadow's plates). Or the tide goes out: a short wait. Or the crew say only "not right", with no "short" or "left over" | free, and watch |
| 3 | A town the child never visited | Sails anyway and goes short. Or the keeper will not let the fleet sail until all three dials are mended | sails anyway: the choice was to go without knowing |
| 4 | Can the child send the fleet again? | Once only: the choice is final, as on Voltara. Or call the rafts back any time before the high water | once two towns are fed, it is final |
| 5 | The towns' names | Stilt Town, Reed Town, Mud Town; or yours | |
| 6 | Build it? | Yes, after you have played the Meadow. Or change the Meadow first | after you have played the Meadow |
