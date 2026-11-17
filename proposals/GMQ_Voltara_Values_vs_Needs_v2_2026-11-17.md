# GMQ — Voltara: your "values on every place" idea, compared with my "nine needs" — v2 — 2026-11-17

**Stage:** analysis. Nothing in this file is built. The sketch is still version 20.
**Tags:** [Source] = your words or your material. [Proposal] = my suggestion.
**New in v2:** section 0. You corrected how I read your idea. Sections 1 to 8 are v1, kept as they were, with one note in section 6.
**Check file:** `checks/voltara_values_model_check.py`. It tries all 2,097,152 plans.

---

## 0. Your correction, and what it changes [Source: Marc, 2026-11-17]

### What you said

- "Factory could make more power. But make people unhappy because of pollution."
- "Amusement park makes people happy. But doesn't provide any power."
- "Things like that as well."

### What I had wrong

- I read your values as: happy **if a place is lit**, unhappy **if it is dark**.
- You mean something stronger: **one place can be good for one number and bad for another while it is running.**
- So the trade-off sits inside the place itself. That is a better idea than the one I analysed.

### The kinds of place this gives [Proposal: the grouping]

| Kind | Energy | People | Examples |
|---|---|---|---|
| Fun | uses it | happy | Amusement Park, Zoo, Parks |
| Needed | uses it | unhappy if it is dark | Hospital, Neighborhoods, Supermarket |
| Clean power | costs some today, gives more tomorrow | no effect | Solar Power Plant |
| Dirty power | gives a lot | unhappy while it runs, from pollution | Factory |

"Things like that as well": I take the first two rows to stay, and the last row to be the new one.

### One thing your sources disagree on [Conflict]

- Your City List says the Factory **needs** 200 energy. [Source]
- Your new idea says the Factory **makes** power. [Source]
- Options:
  - **A.** The Factory uses 200 today and gives more back tomorrow, like the solar plant, but with smoke. The City List stays true.
  - **B.** The Factory only makes power and needs none. Then the city needs 2,020, not 2,220, and the "570 short" sum changes.
  - **C.** Add a new place, such as a coal plant, and leave the Factory alone. Then there are 22 places.
- I tested with A, because it changes none of your numbers.

### What I tested, and what I found

Draft numbers, mine: the Factory uses 200 today and gives 400 tomorrow. While it runs, 60 people are unhappy from smoke. The goal allows up to 60 unhappy people.

| Day 1 choice | Happy on day 1 | Tower on day 2 | Most happy on day 2 |
|---|---|---|---|
| no power places | 780 | 1,380 | 720 |
| solar only | 720 | 1,680 | 780 |
| factory only | 740 | 1,750 | 800 |
| solar and factory | 650 | 2,050 | 840 |

**What this shows:**

- **The short-term and long-term pull is real.** Lighting no power place gives the best day 1 and the worst day 2.
- **But the Factory beats the solar plant on every number.** More happy today, a bigger tower tomorrow. If the smoke fits under the limit, it is free.
- **If the smoke does not fit under the limit, the Factory is banned.** I tried 100 unhappy from smoke with a limit of 60. No plan with the Factory passes.
- So with a simple limit on unhappy people, pollution is either **free or forbidden**. Neither is a choice.

### How to make pollution a real choice [Proposal]

| Option | How it works | Cost |
|---|---|---|
| **1. Smoke builds up.** | Day 1 with the Factory: 20 unhappy. Day 2: 40. Day 3: 60. A day with it off clears some. | One more rule. But the question becomes "how many days can I run it?", and that is a real sum. The sky over Factory Row can show the smog. |
| **2. Smoke lands on the neighbours.** | The places next to the Factory lose happy people while it runs. | Students must know where places are. That suits a world you walk in. |
| **3. Unhappy people take away from happy people.** | One total: happy minus unhappy. | Simple. But my v1 test showed the fault: a mall can then make up for a dark hospital. |

- I lean to **option 1**. It is the mirror of the solar plant. The solar plant costs today and pays tomorrow. The Factory pays today and costs tomorrow.
- It also gives your "leave the planet worse off" ending a picture: a rich tower under a brown sky.
- I have not tested option 1 in code yet. I will before building it.

### What stays true from v1

- Your idea is the better core.
- Keep the numbers apart. Do not add them into one score.
- Keep my days. Your correction needs them even more: pollution only matters if tomorrow comes.

---

## 1. Your idea, as I understand it [Source: Marc, 2026-11-17]

- Students can look at each place, again and again. You know that takes time.
- Each building, or each thing you build, has values. For example:
  - how much energy it uses or gives
  - how many people it makes happy
  - how many people are unhappy without it
  - maybe one or two more
- The goal is to get **enough energy** and **enough happy people**.
- The game checks that correctly.

Your voice text ended "and you correctly". I read that as "and you check it correctly". Tell me if that is wrong.

---

## 2. The short answer

- **Your idea is the better core.** It is better than my nine needs in four ways. Section 3 lists them.
- **My days are still worth keeping.** Your idea says what a plan is worth. Mine says what happens next. They fit together.
- **I push back on one thing only:** do not add the numbers into one score. Keep them side by side. Section 5 shows why, with numbers.
- **Yes, the game can check the goal correctly.** It is three sums and three comparisons. Code does that.

---

## 3. The two ideas side by side

| | **Your idea: values on every place** | **Mine, built in version 20: nine needs** |
|---|---|---|
| How a place counts | by numbers: energy, happy, unhappy | yes or no: a need is met, or not |
| The goal | reach a target on each number | meet as many needs as you can |
| Maths in the choice | **a lot.** Adding and comparing two or three totals. | **little.** Only the energy is added. The needs are ticks. |
| Is the Hospital worth more than the Bus Stop? | **yes,** if you give it bigger numbers | **no.** Every need counts the same. That is a fault in mine. |
| Places that count for nothing | none | Hotels and Warehouse |
| A reason to walk to each place | **yes.** The numbers are found by looking. | weak. The street board lists everything. |
| Works on other planets | **yes.** "Each thing you build has values" is one rule for every mission. | no. I would write a new needs list for every planet. |
| What the student reads | 21 places × 3 numbers = 63 numbers | 9 ticks or crosses |
| The story of what happened | weaker. "40 unhappy" does not say who, or why. | **stronger.** "The schools stayed shut." |
| What I must write and check | 63 numbers, and targets | 9 rules |

**Where yours wins:** more maths in the decision, fair weights, a reason to explore, and one system for every planet.
**Where mine wins:** less to read, and each effect is told as a small story.

The first of those matters most. You said the maths must be "necessary to advancing". In my version the needs involve no maths at all. In yours they do.

---

## 4. What I tested

I gave all 21 places draft numbers for happy and unhappy people. **These numbers are mine and are only for the test.** [Proposal] The energy numbers are your City List. [Source] Then code tried every plan.

Some of the draft values:

| Place | Energy | Happy if lit | Unhappy if dark |
|---|---|---|---|
| Hospital | 50 | 40 | 100 |
| Neighborhood 1 | 200 | 80 | 80 |
| Supermarket | 100 | 70 | 80 |
| Shopping Mall | 250 | 90 | 0 |
| Amusement Park | 80 | 60 | 0 |
| Solar Power Plant | 250 | 0 | 0, but it gives 300 energy tomorrow |

**What the code found:**

| Way of scoring | Result |
|---|---|
| **One score: most happy people** | The best plan makes 780 happy. **It never lights the Solar Power Plant.** Not one of the 35 best plans does. |
| | A simple rule, "biggest happy number first", gets 760. So there is little to think about. |
| **Happy and unhappy added into one number** | Of 121,057 plans with a "good" score, **14,600 leave the Hospital dark** and 30,311 leave a Neighborhood dark. A mall makes up for a dark hospital. |
| **Three numbers kept apart, each with its own target** (600 happy, at most 60 unhappy, tower not weaker tomorrow) | **6,084 plans pass.** Only 4 places are lit in every one. So students will find different answers and can argue. |
| **The price of thinking ahead** | With nobody unhappy, the most happy people is 760. Keep the tower strong as well, and it is 670. **Caring about tomorrow costs 90 happy people today.** |

That last line is the lesson of the whole mission, as one subtraction.

**A warning about this test:** the results depend on my draft numbers. With your numbers they will move. The check takes four seconds to run again.

---

## 5. Where I push back

### 5.1 Keep the numbers apart. Do not make one score.

- With one score there is a best answer. Students stop asking "who needs this?" and start hunting the top number.
- One score lets a fun place cancel out a harm. The test shows it: thousands of "good" plans with the Hospital dark.
- One score for today ignores tomorrow. The test shows that too: the solar plant is never lit.

**So your instinct was right when you said two goals: enough energy and enough happy people.** I would add "few unhappy people" as a third, kept apart from the second.

### 5.2 Three numbers for each place is the most I would use

- 63 numbers is already a lot on an iPad.
- Every extra value adds 21 more.
- If you want a fourth, I would put it on a few places only. For example, only the Recycling Plant has a "clean" value.

### 5.3 Who does the adding?

This is the real cost of your idea. Three options:

| Option | Cost |
|---|---|
| **A. The student adds every total.** | Most maths. But that is about 15 numbers, three times, every day. I think it turns into a chore by day 2. |
| **B. The game shows running totals as you tap. The student does the sums that matter in the morning.** For example: "640 happy, 60 unhappy. How many more are happy?" and "Your goal was 600. How many over?" | Less adding. The thinking stays. This is how the energy total works now. |
| **C. The game does all of it.** | No maths in the choice. I would not do this. |

I lean to B. It is your decision.

### 5.4 Keep a sentence for the big harms

- "100 unhappy" is a number. "The sick could not be treated" is a reason.
- I would keep both: the number, and one line for each dark place that has unhappy people.
- That costs nothing. The lines are already written.

---

## 6. What I would build: both ideas together [Proposal]

**From your idea:**
- Every place has three values: energy, happy if lit, unhappy if dark.
- **v2 note:** after your correction, a place can also make energy, and can make people unhappy while it runs. See section 0.
- **You find the values by looking at the place.** The street board gives only the energy. A notebook fills in as you look, so nobody has to write 63 numbers down.
- The Council sets a goal with three targets. For example: 600 happy, no more than 60 unhappy, and a tower no weaker than when you came.
- The plan table shows three running totals, not nine ticks.

**From my version 20:**
- A plan lasts one day. Morning comes. The tower is filled by the same rule as now.
- The morning report gives the three totals against the three targets, and a line for each harm.
- You can plan again the next day. The planet can be left worse off.
- The missing 240 and the Nomads work as now. Nomad Hollow gets values of its own.

**What goes:** the nine needs as ticks. The harms they named stay, as sentences.

**"Did I pass?" becomes clear:** all three targets met is a good day. That also gives you a clean rule for "failed, and left the planet worse off".

**What it would take:** it changes the plan table, the morning report, what each place says, the test and the number check. The days, the tower rule and the story stay as they are.

---

## 7. What could prove this wrong

| Claim | Test |
|---|---|
| Three numbers a place is not too much for Grade 3 | Give five students the plan table. Watch whether they use all three totals, or only one. |
| Looking at 21 places is exploring, not a chore | Count how many places a student looks at before making a first plan. |
| Separate targets make students argue | Put two students' plans side by side. See whether they differ, and whether each can say why. |
| The solar plant choice is felt | Ask: "Why did you light a place that makes nobody happy?" |
| My draft numbers are fair | You read the table and change what looks wrong. Then I rerun the check. |
| Option B keeps enough maths | Compare with one group doing option A. See which group is still thinking on day 2. |

---

## 8. Decisions for you

1. **Which core?** Your values, my nine needs, or both together as in section 6?
2. **Which values?** I suggest energy, happy if lit, and unhappy if dark. You may want others.
3. **Who sets the numbers?** I can draft all 63 for you to correct, or you can give them.
4. **Who does the adding?** Option A, B or C in section 5.3.
5. **What are the targets?** And is "meet all three" the rule for a good day?
6. **Should the numbers be found by looking at each place?** Or listed on the street boards, which is faster?
7. **Still open from the guide:** should saving have a limit?
