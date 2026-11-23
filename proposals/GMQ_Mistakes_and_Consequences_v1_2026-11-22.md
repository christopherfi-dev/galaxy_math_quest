# Mistakes that show themselves, then a step down, then back up

**Date:** 22 November 2026. **For:** Marc, the main thread and the big world thread.
Everything is **[Proposal]** unless it says [Source].

---

## 1. What Marc said [Source: Marc, 22 November]

> "If they make a mistake, we shouldn't say no that's not right. We should let it happen, and they will see negative consequences of it and then we need to go back and do it again... simpler but a different problem, a smaller one, and they can see that it does work... Then we step back to an easier scaffolding if they want to continue the quest... and then even you go back to the harder one and maybe even go one past that."

> "It is similar to the skills that we do in the math skills engine. If they miss a problem, we don't just say wrong. We then go back or go down one or two levels and find where their understanding is breaking and then we teach that and then work back up."

> "There might be some... the student does bad math... they choose the wrong size for the house, then they find out a little bit later that it was too small, that they did not cut or use enough."

**Where it applies** [Source: Marc, 22 November]: "for quests outside of the initial space station, it's OK for the students to fail and be invested in this world and see something happen."
- **Every quest after the KIS Station.** The station is where children learn how to play.
- [Proposal, my reading] The station keeps its gentler help.

## 2. The Math Skills engine already does this. It is in the repository.

**Where:** `engines/math-skills/`
- `current-v1.1`: its newest page, server and constraint file (v4.1), and the 48 skill files
- `bluehost-snapshot-2026-11-11`: the older live copy

Its student records and its keys were left out on purpose.

**Its steps** [Source: `math-skills.txt` v4.1]:
1. **A wrong answer is not judged at once.** One probe question: a slip, or a real gap? "Do not classify the error from a single wrong answer."
2. **Check the step below.** One question on the skill it builds on.
3. **Teach in small steps.**
4. **A mastery gate:** three new problems, all right in a row. If one is missed, re-teach only the piece that broke.
5. **If the step below is missing too,** the engine marks it (FAILED-FOUNDATIONAL), moves on, and the teacher sees it. **The child is never trapped.**

**The ladder already exists:** `skills/skill_map.csv` lists all 1,835 skills from the 48 files, by band, area and galaxy. It can tell a world task what "one or two levels down" is.

## 3. The same idea, in a world: five rules

**A. The mistake shows itself, and shows why.**
- Don't say "wrong". Let the plan happen, and let the picture show the cause:
  - the roof does not reach the far wall
  - the rice runs out on day 9 of 12
  - the dam is 2 stones short where the water comes over
- **This is the hard part.** A failure that does not show its cause is just "wrong" with extra steps.
  - The big world's first reviewer found exactly this blocker: a kind child's plan failed "for a reason nobody told them".

**B. Something really happens, and the child can always recover.**
- [Source: Marc] Children should "be invested in this world and see something happen." So the world may change because of the mistake: a field floods, a town waits a day for its rice.
- [Proposal] Nothing the child earned is taken away. The villagers help patch the dam, and the child can always put it right.
- They are 8 years old. The consequence teaches; it does not punish.

**C. A short delay, linked back.**
- "Find out a little later" is powerful, but a child may not link it back.
- Keep it inside the same visit, and say the link: "Remember the 6 planks you cut? The roof needed 8."

**D. Then the steps, as the engine does them:**

| | What happens | Like the engine's |
|---|---|---|
| 1 | The plan happens, and the picture shows the cause | |
| 2 | **One more try** at the same problem: it may have been a slip | the probe |
| 3 | If it goes wrong again: **"Want to try a smaller one first?"** A different, simpler problem of the same kind, with its own small story | the step below |
| 4 | It works, and the child sees why | teaching in small steps |
| 5 | **Back to the big one** | the mastery gate |
| 6 | **One past it**, if the child wants: a harder version, for a bonus | |
| 7 | If even the smaller one goes wrong twice: someone in the world helps finish the quest, so the child is not stuck. The mission report tells you which skill broke | FAILED-FOUNDATIONAL |

**E. The answer is never shown.** [Source: Marc, 21 November: "We shouldn't show them the adding for them. They should do that on their own."]
- The consequence shows the result of the child's own numbers, never the right ones.

## 4. Where the game is already close

- **Chronosia's seventh quake** [built]: switch the Stabilizer on too early, and "it burns out before the quake begins. Too early." That is a consequence that shows why.
- **The finds** say only "That is not it." That is closer to "wrong". They are one-step locks, so that is acceptable for small finds. Big quests should use the rules above.
- **The Reach's fleet** (Algora, designed): "The order is not right. Its rafts come back." That is still a plain "wrong". Better: the town's people show what they got, such as "36 baskets came. We needed 42. Six families wait for tomorrow's boat."

## 5. Who does what

- **The code** keeps the numbers, checks the plan, picks the consequence, and chooses the smaller problem from the ladder. It writes everything in the mission report.
- **The AI,** later, inside its constraint file, tells the consequence in the place's own words, and can make the smaller problem fresh each time. The code checks its numbers first. This is CLAUDE.md's constraint architecture.

## 6. What could prove this wrong

- **Children may just try again without thinking** (guess, see, guess). The second try must need thought. For example, the numbers change a little, or the child must say first what went wrong.
- **A consequence can be funny enough to want on purpose.** Then children fail for fun. Keep consequences mild.
- **Some children never ask for the smaller problem.** The teacher view should show who failed twice and did not step down.

## 7. Your decisions

1. **The five rules** (section 3): yes, or change?
2. **Offer the smaller problem, or go to it?** Your words say "if they want". I agree: offer it, and the child chooses.
3. **Which quests get this first:** Algora's big quests are being designed now. The game's existing big quests could follow later.
