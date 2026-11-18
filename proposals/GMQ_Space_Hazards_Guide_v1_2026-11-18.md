# GMQ — space hazards: quick sums on the way — v1 — 2026-11-18

**Stage:** built in sketch version 31. Played by tests only. No child has tried it.
**Tags:** [Source] = your words. [Proposal] = my suggestion, yours to change.

---

## 1. What you asked for [Source: Marc, 2026-11-18]

- Fluency practice as space dangers: asteroids, space worms, solar winds, a wormhole that pulls.
- "You need to answer really quickly." Hit a target speed or you do not pass.
- Levels that move on as a student passes: add within 10, add within 20, 2-digit with no regrouping, 2-digit with regrouping. Later: subtraction, multiplication, division.
- A record for each player of where they are.
- Teach the mental way: "I do the tens first and then the ones and then just add them."
- A really good card for passing.
- These can happen while travelling, and on planets, with people giving quests.
- Separate: at a tree you typed "cut down the tree" and "dig a hole". The game said to use a verb.

---

## 2. What is built

### 2.1 The four hazards

| Level | Hazard | Skill | Sums | Time [Proposal] | First pass earns [Proposal] |
|---|---|---|---|---|---|
| 1 | Asteroid field | add within 10 | 10 | 40 seconds | a rare card |
| 2 | Space worms | add within 20 (sums 11 to 20) | 10 | 50 seconds | a rare card |
| 3 | Solar wind | 2-digit + 2-digit, no regrouping | 10 | 80 seconds | a rare card |
| 4 | Wormhole pull | 2-digit + 2-digit, with regrouping, to 99 | 10 | 110 seconds | a gold card |

### 2.2 How one plays

1. A cadet flies from one galaxy to another. A hazard is in the way.
2. **First screen:** the story, and one quick way to do the sums. For levels 3 and 4 it is yours: "Tens first. Then ones. Then add. 34 + 25: 30 + 20 = 50. Then 4 + 5 = 9. Then 50 + 9 = 59."
3. The cadet taps **Go!** The clock starts only then.
4. One sum at a time, with the number pad. There is no Check button. The game checks as soon as the answer is typed.
5. A bar shows a race. The rocket moves with each right answer. The hazard comes up behind as time passes.
6. A wrong answer shakes and clears. The clock keeps running.
7. **Passed:** a card, and the next flight meets the next hazard.
8. **Too slow:** the ship is bumped and creeps out. No card. The quick way is shown again. The same hazard is back on the next flight.
9. **The flight always goes on.** A child can also tap "Fly around it". Nobody can get stuck.

### 2.3 Other ways in

- In space, tap **quick sums** in the Here row, or type `practice`. `practice 1` picks an old level.
- An old level again gives a card only for a new best time.
- When all four are passed, flights are clear.

### 2.4 What is recorded for each player

- The level they are on, their best time on each level, and how many tries each took.
- A line in the log for every try: passed or not, the time, the slips, and **the slowest sum**. Example: "passed: 10 sums in 31 s (goal 40 s), 1 slips, slowest: 4 + 5".
- With the server, the Commander's Desk shows "2 of 4 hazards" for each cadet.
- This is the same kind of record your maths skills dashboard would need. Joining them is for later, as you said.

### 2.5 The teacher switch

Teacher section: **Space hazards** on or off. It is remembered on the device.

### 2.6 "Cut down the tree"

- The game now knows about 60 more doing words it has no use for: cut, chop, climb, hug, paint, kick and so on.
- A tool word: "You have no tool to cut the tree. It stays as it is. Here you can: look, take, push, use, talk or dig."
- A rough word: "Cadets do no harm. You leave the tree alone."
- Any other: "You try to hug the tree. Nothing happens."
- "Dig a hole" on a small world: "You dig a small hole. Nothing is under it. You fill it in again."
- A word the game has never heard still gets "Start with a doing word".

**The honest limit:** this is a longer list, not understanding. A child will always find a word that is not on it. A real answer to anything needs the AI on the server. That is built and switched off.

---

## 3. How it was checked

| Check | Result |
|---|---|
| 5,000 rounds for each level, 200,000 sums: every sum fits its level, and no sum comes twice in a round | 0 wrong |
| A hazard played with the number pad on an iPad size and a phone size: passed, a slip, too slow, flown around | passes |
| The record is kept after a reload | passes |
| `practice 4` cannot skip ahead | passes |
| The teacher switch | passes |
| The doing words in all three kinds of place | passes |

The test is `checks/space_hazards_test.js`. It found one real fault, now fixed: typing in the command box during a hazard hid the number pad.

---

## 4. What I looked up, and how sure it is

I ran two quick searches. This is not deep research.

- **Do timed sums cause maths worry?** People who study this disagree. Jo Boaler says timed tests cause it. Others say there is no proof, and that short timed practice helps. I found no strong study that settles it. [EdWeek](https://www-edweek-org.ezproxy.baylor.edu/ew/articles/2012/07/03/36boaler.h31.html), [KQED MindShift](https://www.kqed.org/mindshift/61712/do-math-drills-help-children-learn), [Joanne Jacobs on the Shanks review](https://www.joannejacobs.com/post/mad-minutes-don-t-cause-math-anxiety-and-kids-learn-more)
- **How fast is fluent?** The numbers I found are for answers written by hand: about 3 seconds a fact in class tests, and 20 to 40 a minute. I found nothing for tapping on a tablet. [Rocket Math](https://www.rocketmath.com/2020/02/15/math-benchmarks-writing-speed-matters/)
- **So my times are a guess.** 4 seconds a sum at level 1, 11 seconds at level 4. Tapping two digits is slower than saying them.

**What this means for the design [Proposal]:** I kept three things gentle on purpose. Failing costs nothing. The clock is a picture, not a number counting down. A child can always fly around.

---

## 5. Ideas beyond a quiz with a timer [Proposal]

You said you are building something that does not exist yet. These are the ideas I think are worth more than the timer. None is built.

1. **The speed is the child's own.** The first run sets a time. The goal after that is "beat your own time", not one number for the whole class. A slow, careful child can still win. Cost: your "must hit a target to pass" becomes softer.
2. **The hazard needs the strategy, not only the answer.** In the wormhole, the cadet fires two engines: first the tens engine (40 + 30), then the ones engine (7 + 8), then joins them. The picture is the method. Cost: slower, so it is teaching, not fluency. It could be the first visit to each level, before the timed one.
3. **Hazards that fit the place.** A worm on the way to Metrica asks about time. Solar wind near Voltara asks about hundreds. The fluency set grows with the galaxies. Cost: more sum makers to write and check.
4. **People give the practice.** A trader on a small world: "Count my crates before the tide comes in." Same engine, a reason in the story. This is your "people give them quests".
5. **The ship shows it.** Each hazard passed adds a mark to the cadet's ship that others can see in space. Cost: small.
6. **Slow facts come back.** The game knows each cadet's slowest sums. Those come up more often next time. Cost: needs a little more record keeping. This is what the paid fluency apps do well.
7. **A class hazard.** With the server: the whole class must clear 500 asteroids this week. Every cadet's right answers count. Nobody is ranked.

---

## 6. Decisions for you

1. **The times.** 40, 50, 80 and 110 seconds are guesses. Time your daughter, then tell me.
2. **The cards.** Rare for levels 1 to 3 and gold for level 4? Gold was only for big quests until now.
3. **How often.** Now: every flight between galaxies, until all four are passed. Options: every second flight, or only when the cadet chooses.
4. **Failing.** Now: no cost, try again next flight. Options: lose some fuel, or the flight turns back. Both risk a child who cannot travel.
5. **One target for all, or each child's own best time?** See idea 1.
6. **What next:** subtraction levels, or hazards on planets from people?

---

## 7. What could prove this wrong

| Claim | Test |
|---|---|
| The times are fair | Your daughter plays level 1 three times. If she never passes, or passes with 20 seconds left, the time is wrong. |
| A hazard feels like part of the journey | Listen to whether she says "asteroids" or "sums". |
| The quick way is read | Ask her how she did 34 + 25. If she counts on her fingers, the first screen is not teaching. |
| No Check button is clearer | Watch a wrong first digit. With auto-check she must delete it. If that confuses her, bring Check back. |
| The clock does not upset anyone | Watch the child who is slowest at sums, not the fastest. |
| Children want it more than once | See whether anyone types `practice` without being asked. |
