# GMQ — Planet Chronosia as one whole quest: a design — v1 — 2026-11-17

**Stage:** a design on paper. **Nothing here is built.** I would build it only after you have read it.
**Why Chronosia:** it is your most complete quest. Four tasks, printed, with videos, and no wrong sums. [Source: my review, `reviews/chronosia.md`]
**Tags:** [Source] = from your material. [Proposal] = my design. [Conflict] = your sources disagree.
**Numbers checked by:** `checks/chronosia_quest_design_check.py`. All pass.

---

## 1. The short version

- It is built on the same bones as Voltara: a job, a question, see it first, each stage feeds the next, a twist, a decision with a price, an ending you can read.
- **Your Tasks 1 and 2 go in almost as they are.** They are good.
- **Your Task 4 changes most.** In my review it had almost no time maths. I replace it with **quake day**: two calm half-hours, seven jobs, and not enough minutes for all of them.
- **The decision matters.** After the quake you see who was safe and whether time was healed. There are four endings, as on Voltara.
- **Your four people each want something different.** That is the "room to disagree".

---

## 2. What is yours, and what I would add

| | [Source] yours | [Proposal] mine |
|---|---|---|
| The planet | a sky in colour bands, mountains that grow young as you climb, fast and slow rivers, Temporal Tortoises, Clockwork Cougars, TimeTweak fruit | the places you walk between |
| The clock tower | eight broken clocks, a gear for each one fixed | three clocks are fine all along. Finding which is part of the task. |
| The Time Quakes | six quakes, your rule, the seventh "Explosion Time Quake", the Time Stabilizers | what you do before it comes |
| The people | Sara, Tim, Alex and Zara, with their jobs and quirks | each one asks you for a different job |
| The timetable | the Council of Timekeepers' Annual Timetable | used for reading only, with the tied questions left out |

---

## 3. The story, and where the maths sits

| # | What happens | What blocks you | The maths that opens it | Shown first |
|---|---|---|---|---|
| 1 | You land. The sky is striped. A Temporal Tortoise walks backward. | nothing | none: look, taste a TimeTweak, talk | — |
| 2 | The clock tower. Eight clocks show times that cannot be. | The tower door stays shut until every clock is right. | **Minutes past 59 roll into the next hour.** 3:67 is 4:07. 7:99 is 8:39. | One clock is done for you, on a ring of 60 minutes. |
| 3 | Inside: the Time Quake log. Six quakes. | The Council will not listen until you can say when the next one comes. | **How long between two times.** Then a pattern: each quake is 5 minutes longer. | One quake is measured for you on a time line. |
| 4 | **The twist.** The seventh quake will be the longest: 5:34 to 6:09. And one more comes first. | | **Predict:** start, length and end of quake 7. | — |
| 5 | **Quake day.** It is 4:04. There are two calm half-hours left. Four people want four things. | Seven jobs need 125 minutes. You have 60. | **Add minutes to a time. Does the job end before the next quake?** | The first job is laid on a time line for you. |
| 6 | The quake. Then the morning after. | | Read the report: who was safe, and is time healed? | — |
| 7 | A real-life step, for the gold card. | your code | Make your quake-day plan as a paper time line, in 5-minute marks. Say why you chose it. | — |

---

## 4. The clocks [Source, checked]

| Clock shows | Right time | |
|---|---|---|
| 3:67 | 4:07 | broken |
| 12:15 | 12:15 | fine |
| 14:75 | 15:15, or 3:15 in the afternoon | broken. Two right answers. |
| 9:42 | 9:42 | fine |
| 25:00 | 1:00 | broken |
| 7:99 | 8:39 | broken |
| 5:30 | 5:30 | fine |
| Clock 8 | [Conflict] one print says 0:00, the other says 00:90 | your decision |

- **24-hour time** is in your Advanced strand, not the Grade 3 one. [Source] Two clocks need it. Your decision.

---

## 5. The quakes [Source, checked]

| Quake | Starts | Ends | Lasts |
|---|---|---|---|
| 1 | 12:49 | 12:54 | 5 |
| 2 | 1:24 | 1:34 | 10 |
| 3 | 2:04 | 2:19 | 15 |
| 4 | 2:49 | 3:09 | 20 |
| 5 | 3:39 | 4:04 | 25 |
| 6 | 4:34 | 5:04 | 30 |
| **7** | **5:34** | **6:09** | **35** |

Your rule: each quake lasts 5 minutes longer, and the next starts 30 minutes after the last one ended. My code rebuilt your whole table from that rule.

**What I noticed:** the rule leaves exactly **two calm half-hours** before quake 7. One is 4:04 to 4:34. The other is 5:04 to 5:34. Quake day is built on that.

---

## 6. Quake day [Proposal, checked]

### The jobs

| Job | Minutes | Kept safe | Who asks for it |
|---|---|---|---|
| Empty the school | 10 | 90 | the Council |
| Close the river gates | 15 | 80 | the Council |
| Move the Temporal Tortoises to the high grove | 25 | 40 | Alex, who loves creatures |
| Tie down the market | 20 | 60 | the traders |
| Carry the time capsule to the vault | 20 | 30 | Sara, the historian |
| Ring the great bell | 5 | 50, **but** the Clockwork Cougars bolt: 30 are lost | Zara does **not** want it rung. She must sleep. |
| Charge the Time Stabilizer | 30 | 0 today. **It heals time.** | Tim, the engineer |

- A job must fit inside one calm half-hour. It cannot run through a quake.
- **The bell has its trade-off inside it,** like your Factory. Rung alone, 50 are warned and 30 creatures run off. If the tortoises are moved first, the grove is shut and nothing is lost.
- **The Stabilizer is the solar plant of this planet.** It takes a whole half-hour and saves nobody today. Without it, the clocks break again tomorrow.

### The two goals

1. **Safe:** 170 or more kept safe.
2. **Time healed:** the Stabilizer is charged.

### The four endings

| | Time healed | Time still broken |
|---|---|---|
| **170 or more safe** | Chronosia is whole | Most are safe. But the clocks drift again. |
| **Fewer safe** | Time is healed. But too few were safe. | Worse off |

### What the code found

- There are 180 ways to fill the two half-hours, and 59 different sets of jobs.
- **Only 2 sets reach both goals.** Both need the school, the river gates and the Stabilizer.
- 16 sets keep people safe and leave time broken. 14 heal time and leave too few safe. 27 do neither.
- The most you can keep safe is 260, without the Stabilizer. With it, 190. **Healing time costs 70 people's safety today.**
- My first goal was 200 safe. The code showed nobody could reach both goals then. So I lowered it to 170.

### The maths a child does

- "It is 4:04. Moving the tortoises takes 25 minutes. When does it end?" 4:29.
- "The quake starts at 4:34. Is there time for the bell as well?" 4:29 and 5 minutes is 4:34. Just.
- Every end time is a real elapsed-time sum, and the answer decides whether the job can be done.

---

## 7. What I would leave out, and why

| Your material | What I would do | Why |
|---|---|---|
| Task 1's Restoration Report, 33 blanks | leave out | It is two thirds of the task's time, and it is writing, not time. |
| Task 3, the five exam questions | keep 2, as reading on the Council's wall | Two questions have tied answers. One needs 21 hours 15 minutes across midnight. |
| Task 4, "Plan the Perfect Day" | replaced by quake day | It had one number comparison in the whole task. The four people stay. |

---

## 8. What could prove this wrong

| Claim | Test |
|---|---|
| Quake day is a better Task 4 | Ask your class what they remember of "Plan the Perfect Day". If they loved it, I am wrong to replace it. |
| Two half-hours is the right size | Give five students the job list on paper. See whether they finish a plan in ten minutes. |
| The bell's trade-off is understood | Ask: "Why did the cougars run?" |
| A goal of 170 is fair | Only 2 sets of jobs reach both goals. That may be too hard. With 150 it is easier. |
| It can be built faster than Voltara | It should reuse the walking, the panels, the day report and the ending summary. If it does not, the pattern is not a pattern. |

---

## 9. Decisions for you

1. **Shall I build it?**
2. **24-hour time:** in or out? If out, clocks 14:75 and 25:00 change.
3. **Clock 8:** 0:00 or 00:90?
4. **Replace "Plan the Perfect Day" with quake day,** or keep your task?
5. **The jobs and their numbers** are mine. Change any.
6. **The reward:** your page says both "an advanced Engine Core" and "an upgraded Weapons System". [Conflict] Which?
