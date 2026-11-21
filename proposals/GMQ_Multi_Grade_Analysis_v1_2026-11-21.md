# Grades 3 to 6 in one galaxy: analysis and pushback

**Date:** 21 November 2026. **For:** Marc, for later. **Nothing here is built, and nothing should be built yet.** Everything is **[Proposal]** unless it says [Source].

[Source: Marc, 2026-11-21] He shared a summary of his multi-grade idea and asked: "An idea or suggestion for us to worry about later? Analysis of this? Do you have any pushback or feedback?"

**The idea, in one line** [Source]: one persistent galaxy for Grades 3 to 5 (maybe 6). Everyone starts with the Grade 3 tasks. Children move up by mastery, not by school grade. The galaxy grows, and nothing resets. Children can always go back. AI-made small worlds fill in, and a teacher dashboard keeps it honest.

---

## 1. What is strong

- **One world that grows, and never resets.** This fits your vision of a persistent world with a server. Cards, places and first landings keep their meaning for years, not weeks.
- **Mastery, not age.** A strong Grade 3 child can go further, and a Grade 5 child with gaps can fill them without shame. This is the right principle.
- **The maths stays the way you travel and act.** The core loop does not change as the numbers grow. That keeps your rule: the maths serves the task, and the task serves the story.
- **Your galaxies already match the strands** [Source: the five galaxies]: Numerix (numbers), Patternox (patterns), Metrica (measurement), Geometrica (shapes) and Databa (data). That makes the growth easy to picture: **each galaxy grows outward by band.** Number work at Grade 5 lives further out in Numerix, not on a new map.

---

## 2. Pushback

### A. "Everyone starts with the Grade 3 tasks" works against "the same topics, in layers"

- **The summary says both.**
  - Standards are layers on the same topics, so the places and the story stay and only the maths changes.
  - Every child starts with the Grade 3 tasks.
- **If the topics are layered, the station itself can be layered.**
  - Cargo Load at Grade 3: 7 crates that make exactly 30 tons.
  - At Grade 4: the crates weigh thousands of kilograms.
  - At Grade 5: they weigh 2.75 tons and 1.5 tons.
  - The same hold, the same picture and the same story.
- **The cost of the plan as written:** the station is 15 tasks of Grade 3 maths. That is hours of work. A Grade 5 child doing it reads it as baby work, and the first impression is the one that sticks.
- **[Proposal]** Keep apart two things the summary joins:
  - **Learning the game:** moving, tapping, the desk and the picture, a first lock. This is short, the same for everyone, and nearly free of maths.
  - **The station tasks:** each one has a version for each band. A Grade 5 child repairs the same ship with Grade 5 numbers.

### B. Bands by whole grade are too coarse. Use one band per strand.

- A child can be Grade 4 in multiplication and Grade 3 in fractions. One grade label hides that.
- **[Proposal]** Keep a band for each strand. The galaxies already are the strands, so it is natural: "Numerix: band 4. Metrica: band 3."
- The teacher sees exactly where each child is. A child is never held back in every strand by a gap in one.

### C. "Finished the quests" is weak evidence of mastery

- Today a quest can be finished with nudges, hints and retries. The game logs them, but finishing is not the same as knowing.
- **[Proposal]** A **band check**, told as part of the story: "The beacon to the outer ring opens only for a navigator who can work out…"
  - It has fresh numbers, no hints, and a few short items.
  - Fail it, and the game sends the child to practise where it helps, not back to the start.
- **The same check can place newcomers.** A Grade 5 child takes a short check per strand and starts where they are. That is better than "a Grade 3 quest plus a few Grade 4 quests", which costs them hours.

### D. Shared coordinates can turn into a ladder that leaves children out

- "Classmates who can solve the matching math can reach it" [Source] means a Grade 3 child is locked out of a place an older or faster friend found. In a mixed class that becomes a visible pecking order.
- **[Proposal]** **The lock adapts to the reader.** A shared place stays one place, but each child meets its lock at their own band. Everyone can visit; the maths fits each of them. First-landing credit still goes to the finder.

### E. Easy cards: fix it in the design, not only on the dashboard

- The summary asks the dashboard to stop easy-card collecting from hiding a lack of progress. That puts the job on you, every week.
- **[Proposal]** Put it in the rules instead:
  - A card comes only the first time a quest is done. This is already true for most quests.
  - Repeats earn practice credits, as Chronosia's time wisps already do.
  - Cards from a higher band are rarer or stronger.
  - Then going back is for curiosity, and it never pays better than moving on.

### F. Grade 6 is a different audience, not just bigger numbers

- **Reading level, art and tone are built for 8-year-olds:** short sentences, friendly creatures, a bright cartoon look. An 11-year-old may reject it however good the maths is.
- **What can be shared across ages:** your Novus engine already has reading levels [Source: `reference/novus_txt v3_4 …md`], so the words can scale by band. The art may need to as well.
- **Test before building:** show a Grade 5 or 6 class one place and ask them, before writing any content for them.

### G. Every band multiplies the work, and AI cannot carry the numbers

- Grade 3 alone has taken weeks of careful building and checking. Three more bands could be three times that.
- **AI-made small worlds can fill space,** but only within your constraint architecture:
  - Code makes and checks every number.
  - The AI narrates and never sets an answer.
  - Many of your 2023 answer keys, drafted with AI, had errors (`design/GMQ_World_Handoff_2026-11-16_v8.md` §8). Higher bands mean harder numbers, so the risk grows.
- **A cheaper first step:** layer the tasks that exist before making new places (point A). Each existing task with a Grade 4 number rule is one new band for almost no new world-building.

### H. Who are the Grade 4 to 6 users?

- **You teach Grade 3.** The other bands need other teachers, their classes and their trust. They also need their own standards checked against AERO, and the server running on your site, which it has never done.
- **Shared play across classes raises new questions:**
  - accounts
  - messages between children of different ages, and who reads them
  - what data the server keeps
- **[Source: your rules]** No student data goes in this repository.

---

## 3. What to do now: small, cheap, and keeps the door open

None of these change what a child sees.

1. **Tag every task with its strand and its standard.** The logs already name the AERO standard. Make it a field, not just text.
2. **Give every number rule a band setting,** with only Grade 3 filled in for now. Example: `fuelPlan(band)`. When Grade 4 comes, it is new numbers in an existing task, not a new task.
3. **Keep cards for first completions only,** and practice credits for repeats. Write it down as a rule for every new quest.
4. **Keep learning the game apart from the Grade 3 maths** in the opening. It is already nearly so: the locker and the crates come first.
5. **Do not build bands, checks or the dashboard** until your class has played the Grade 3 game and you know what worked.

---

## 4. What could prove this note wrong

- **Older children may love the Grade 3 world as it is.** Children often enjoy feeling expert in an easier world. Ask a Grade 5 class before deciding that the tone must change.
- **Per-strand bands may be too fiddly for a teacher.** If one grade label is easier to manage, the dashboard could show one label and keep the strands underneath.
- **A band check could feel like a test and kill the fun.** Watch whether children who fail one come back to it.
- **Layering existing tasks may not stretch enough.** Some Grade 5 ideas (volume, the coordinate plane, decimals) need new pictures, not just new numbers. Coordinate Plotting is actually a Grade 5 standard (5.G.1) that you run in Grade 3. Bands will not line up neatly with the galaxies everywhere.

---

## 5. Decisions for later (not now)

1. Learning the game, then the same tasks with numbers per band (A), or the Grade 3 tasks first for everyone, as written?
2. One band per strand (B), or one per grade?
3. A band check (C), or completed quests?
4. A lock that adapts to each reader (D), or one lock per place?
5. Whether Grades 5 and 6 are worth testing with a real class before any content is written for them (F).
