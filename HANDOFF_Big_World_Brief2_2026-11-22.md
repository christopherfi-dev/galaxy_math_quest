# Big world thread: Marc's second brief (22 November, evening)

**For:** the big world thread (Planet Algora). **From:** Marc, written up by the main thread.
Read `HANDOFF_Big_World_2026-11-22.md` and your own report first. This brief adds to them. Where they differ, this one wins.
Everything is **[Proposal]** unless it says [Source].

---

## 0. In one paragraph

Marc liked the first night and wants you to **push on: the next two regions**, built with more life in them:
- **big quests that upgrade the ship**
- **mini quests of 3 or 4 steps** that send the child between places, and later between planets, ending in an epic card
- **a world the child interacts with,** where things lead to each other

Be creative. Keep every rule in CLAUDE.md.

## 1. Marc's words [Source: Marc, 22 November]

> "I'm just trying to figure out what to add... So it understands how the students should be playing. How things should work. The interconnections. Interacting with the environment. Etc... push it to do the next two sections. Be creative. Etc. big quests and multi-step mini-quests."

> "Cuz the big quests on planets should result in upgrades to ship parts. Smaller mini-quests with 3-4 steps like... cave needs lantern. Any planet can make a lantern but needs special soft sand to make it. A third planet has that. Dig it up. Take it to the lantern makers. Use math to help build it. Take lantern back to cave. Gold epic card as reward inside after solving a problem."

Earlier words that still hold:
- [21 November] "Everything you find should possibly be able to solve a problem or a mini quest... You talk to some people nothing happens. They just say hi. You talk to some people and they give you a quest."
- [18 November] Surprises: walking somewhere, "suddenly something pops up".
- [22 November] "Gold" cards are **epic** cards. The game says "epic" (decision 36).

## 2. How a child should play

**The feel:** a world that answers back.
- **The child explores, looks, talks, takes, uses, digs and gives.** Every thing the child can touch does something, even if it only says why not yet.
- **Nothing is a dead end without a reason.** "The cave is too dark to go in" is a reason. "Nothing happens" is not, unless it is truly scenery.
- **Things lead to each other.** A child who finds something should soon meet the place, person or problem it is for.
- **People are different from each other:**
  - some only say hello
  - some give a quest
  - some say something new after the child has helped someone else
- **Surprises on the walk.** Your design note's decision 14 offers "a loose machine part that rolls away", caught with three quick sums. Marc wants surprises; build one or two. Never a creature in tall grass: that is another game's idea.
- **Every command is tappable.**
  - **Typing too, as in the game** [Proposal]: the main game lets a child type or tap. Typing is also how the AI will later talk with a child. If typing costs too much tonight, leave it, and say so.
- **The "what I still need" list is the child's memory.** Every quest step shows there until it is done, for example "The cave needs a light." [Source: the world web note, section 5: a Needs list, so children can remember]

**The maths is the work.** Every step that needs maths has a story reason, a finished example about something else, the picture showing the task, and nothing that gives the answer away. (CLAUDE.md's lists, as before.)

## 3. Three sizes of quest

### Big quests: one for each people, and they upgrade the ship [Source: Marc]

- **The region's open problem:** the Menders' plates and bridge, the Reach's fleet, and so on. It takes time, more than one try, and real thinking. It lights the people's Rule Stone, as now.
- **It also upgrades one ship part to Level 2.** [Source: Marc's "Ship Parts Upgrade" sheet: Level 2 is HP +4 and AP +3.] The ship has five parts: Engine Core, Navigation, Shield, Weapons and Power [Source: the game].
- **Which big quest upgrades which part:** propose a match with a story reason, and mark it as Marc's to change. For example:
  - the Menders' machines: the Engine Core
  - the Reach's fleet: Navigation
- **Do the Meadow too:** its stone should now also give its upgrade.
- **Only record it:** save "Navigation reached Level 2" in your own save, show it in the mission report, and say it in the story ("The Rillfolk fit a new star compass to your ship").
  - How an upgrade counts in a battle belongs to Marc and the battle thread. Do not set battle numbers.
  - **[Conflict] to tell Marc:** the battle thread has "Level 2 upgrade cards" that last one battle. Marc's words today sound like a lasting upgrade. Which is it? Build it as lasting in your save, and ask.

### Mini quests: 3 or 4 steps, ending in an epic card [Source: Marc's lantern example]

**The shape:**
1. **A place is closed for a reason you can see:** a dark cave, a locked tower, a pump with no handle.
2. **Something would open it** (a lantern, a key, a handle), but **it must be made**, and **making it needs a material** from somewhere else.
3. **Find the material:** dig it up, trade for it, or earn it. Usually with a small maths lock.
4. **Take it to the makers.** The child does the maths that builds it: how many panes, how long each side, how much of each part. The makers never do the sum for the child.
5. **Go back and open the place.**
6. **Inside, one real problem.** Solving it gives an **epic card**.

**How many:** two or three in each region you build.
- At least one crosses between two of Algora's peoples. For example, the Menders' machines could make the Reach's missing part.
- Each one is short enough for one or two lessons.

**Across planets, later:**
- Mini quests that need another planet are welcome [Source: Marc, 22 November].
- But you cannot edit the main game. So **build Algora's half**, and **write the other planet's half as a short spec**: a few rows in your world web spreadsheet and a paragraph. The main thread builds that half in the game later.
- Until then, the step shows in the Needs list as "Waiting: Voltara" and is never on the main road.

**Marc's lantern example is strand A in the main game:**
- Voltara's Nomads make the lantern.
- Xylophora has the soft sand.
- Chronosia's cave needs the light.
- The main thread builds that one.
- **Make Algora's own mini quests the same shape, with different things.**

### Small finds: one step

As now: a thing with a lock, a fact to read, a secret. Secrets may help a mini quest. They never help a main job.

## 4. The laws of the web, checked in `bwCheck()`

- **Every item is used** by something.
- **Every gate has a second way.**
- **No main job needs a secret,** and **no big quest needs another planet.**
- **Mini quests may need another planet.** They are never on the main road.
- **The law of the road:** leave any one people's job undone, and every people can still be reached. Add it now, before region 2 is built.
- **Every quest step appears in the Needs list.**
- **Each chain is checked end to end:** every step can be reached, and the reward comes last.

## 5. Tonight, in this order

Work as long as you can. **Quality first:** if only one region can be done well tonight, do one well. [Source: Marc: "Focusing on speed over quality and depth breaks everything."]

1. **Merge the main branch first:** `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD`. That brings in this brief.
2. **Quick fixes from the main thread's review:**
   - **The play test:** `--only` with a name that matches no screen must fail. Today it plays nothing and prints "ok" (`--only ipad`: the screens are named "iPad").
   - **Fonts:** load the same ones as the game.
   - **The law of the road** in `bwCheck()`.
   - **Music:** a tune for each region, made in code, like the game's version 88. See `proposals/GMQ_Music_v1_2026-11-22.md`: a Music switch, off until tapped, softer during tasks.
3. **The Reach (region 2):**
   - Have a fresh independent reviewer read its second version. Fix what it finds.
   - For its seven decisions, use your own recommendations, and list them for Marc to change.
   - Build it: the towns, the dials, the fleet as its big quest (with its ship upgrade), and two mini quests, one of them shared with the Meadow.
   - Run the full checks: numbers on thousands of children, the map check, the tap-only play test on three screens, pictures you look at yourself, and an independent reviewer of the pictures.
4. **Back in the Meadow:**
   - its stone's ship upgrade
   - one mini quest of the lantern shape, if the Reach's shared one does not already pass through the Meadow
5. **Region 3:**
   - Your choice: your outline suggests the Furrows (split and swap, 3.OA.5).
   - First a design note, then an independent review.
   - Build it only if steps 3 and 4 are done well and there is time.
6. **A one-page sheet for testing with Marc's children:**
   - what to watch for: where they get lost, bored or stuck, and what they skip reading
   - three questions to ask them afterwards
7. **The morning report:**
   - the links
   - pictures
   - what is built and what is designed
   - every choice you made that is Marc's, in one short list

**Not tonight:**
- the main game's file, the class link, the preview, the zip
- battle numbers
- a second Algora planet

## 6. Questions for Marc (ask in the report; do not wait for them)

1. Is a ship upgrade from a big quest **lasting**, or a **card** for one battle? **[Conflict]** with the battle thread's upgrade cards.
2. Your match of big quests to ship parts.
3. Typing on Algora: as in the game, or taps only?
4. The other choices from your design note's section 11, and the Reach's decisions you made for him.

## 7. Added later the same evening: mistakes that show themselves

[Source: Marc, 22 November] "If they make a mistake, we shouldn't say no that's not right. We should let it happen, and they will see negative consequences of it... then we step back to an easier scaffolding... and then even you go back to the harder one and maybe even go one past that." He compares it to his Math Skills engine.

- **Read** `proposals/GMQ_Mistakes_and_Consequences_v1_2026-11-22.md` before you design a big quest. It turns his words and the engine's steps into five rules for a world. The short version:
  1. The plan happens, and the picture shows the cause.
  2. One more try, in case it was a slip.
  3. Offer a smaller, different problem of the same kind.
  4. Back to the big one.
  5. One past it, if the child wants.
  - Kind consequences; nothing earned is lost; the answer is never shown; a child who is stuck twice gets help finishing, and the mission report says which skill broke.
- **The engine is in the repository:** `engines/math-skills/current-v1.1/api/constraints/math-skills.txt` (its rules) and `skills/skill_map.csv` (1,835 skills by band, area and galaxy: the ladder for "one or two levels down").
- **The Reach's fleet:** replace "The order is not right" with what the town got and what it lacked, shown in the picture.
