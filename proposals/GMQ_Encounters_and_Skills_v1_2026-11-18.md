# GMQ — things that pop up as you walk, the card swap, and a skills record — v1 — 2026-11-18

**Stage:** a small trial is built on Chronosia (sketch version 34). Played by tests only.
**Tags:** [Source] = your words. [Proposal] = my suggestion, yours to change.

---

## 1. What you said [Source: Marc, 2026-11-18]

- Your daughter was a little annoyed by the pop-up that makes her wait before OK. She says she reads fast. You said she was not reading before the pop-up. "I'm not sure who won that."
- You have a maths skills dashboard, zipped. It takes papers a teacher has marked and shows which skills each student is missing. You wonder if the game could do this more automatically, with tabs for skill domains. For that, students need enough practice on enough problems.
- So: little surprise things that pop up as you travel through space or walk around a planet, like the old overhead Nintendo games. Extra chances to practise.
- A dynamic to try: each win is one common card. Save 12 for a rare card. Or save 24 for a gold card.
- "This should go back to having an overhead system where you walk around, and the world has to be a little bit bigger."
- You are spitballing, and I may push back.

---

## 2. The reading pop-up: what the numbers say

- The wait is half a second, plus 0.16 seconds for each word. It never goes above 3.5 seconds.
- 0.16 seconds a word is **375 words a minute.** A quick adult reads about 250. [From memory, not looked up today.]
- So the wait is always **shorter** than the time it takes to read the words. If the button is still asleep when she wants to tap it, she has not read it all yet.
- She is still right about one thing. A button that does nothing feels like being held back, even for two seconds.

**Options [Proposal]:**

| Option | Good | Cost |
|---|---|---|
| A. Leave it | It is working: she reads now. | She stays a little annoyed. |
| B. Show the wait | The OK button fills up like a bar. Waiting feels fair when you can see it. | Small. |
| C. No wait, but a question now and then | "What did the keeper ask you to fix?" Reading has a reason. | More to build. A wrong answer needs a kind reply. |
| D. A shorter wait | Less annoying. | She is already faster than the wait allows. Shorter means skimming again. |

I have changed nothing. I would like to hear her idea.

---

## 3. Your dashboard zip

- **Give it to me here, in the chat.** I will put it in a folder that is not sent to GitHub.
- **Please do not put it in the Git yourself.** Your repository is public now. If the zip holds any student names or marks, anyone could read them.
- **Before you send it:** take out any file with real student names or results. My standing rule is that I do not open those. If you cannot take them out, tell me which files they are and I will leave them shut.
- What I need from it is the list of skills and their codes. Then the game's record can use **your** codes, and the two can join later.

---

## 4. What I built: time wisps [Proposal]

On Chronosia's map, three small swirls of light drift about. They are time wisps.

- **Tap a wisp, or type `catch wisp`.** The cadet walks to it and it asks three quick questions.
- The questions: one sum at the cadet's own level from the space hazards, and time questions. What time is it 20 minutes later? How many minutes from 2:40 to 3:05? What time does this clock show?
- **Three right: the wisp turns into one common card.** [Source: your rule]
- One slip is allowed. Two slips, or stepping away, and the wisp slips off. No card. Nothing is lost.
- A new wisp drifts in about 20 seconds later.
- Teacher switch: **Chronosia: time wisps**, on or off.

### Where I pushed back: you can see it coming

You asked for surprise pop-ups. I built something you can see and choose.

- **Why:** your daughter's one complaint today was about being stopped and made to wait. A sum that jumps out while she is walking to the Clock Tower is the same thing, ten times an hour.
- In the old games, the fights that came from nowhere are what many players remember as the annoying part.
- In this build a wisp never steps onto the cadet. Walking past one does not start it. Only going for it does.
- **What is lost:** the surprise. And a child who dislikes sums can walk around every wisp.

**What could prove me wrong:** if children never go for a wisp, they are too easy to avoid. Then the wisps should come to the child. That is a small change.

### The card swap [Source: your numbers]

- In the card panel: with 12 common cards, a button says "Swap 12 for 1 rare card". Beside it: "Or save them. 11 more make a gold card."
- With 24: "Swap 24 for 1 gold card".
- It asks "Are you sure? Tap again" first.
- It takes the newest common cards, so a cadet's first cards stay.

**Where I push back:**

1. **Gold may get cheap.** My guess is that a wisp takes under a minute. So 24 wins is about half an hour of quick sums. A gold card from Voltara takes a whole quest and a hard choice. Options: keep your numbers and see; or raise them; or wins give "sparks" and several sparks make one common card.
2. **Any common card counts,** even ones from station tasks. If those are meant for your battles, the swap eats them. Option: only cards won from wisps can be swapped.
3. **Which is worth more, two rares or one gold?** That is the real choice you are giving a child, and it is a good one. It depends on your battle rules, which I have not touched.

### The skills record

- Every wisp answer is now tallied by skill: sums at levels 1 to 4, time later, time between, reading a clock. Right and wrong are counted for each cadet.
- Nothing shows it yet. I held back on purpose. If I see your dashboard's skill codes first, the game can use the same ones.
- The space hazards, the six Chronosia quests and Voltara's tasks do not feed the tally yet. They could.

---

## 4b. Added the same day: mud rats, your way (sketch version 35)

After reading the above you wrote: "Even the sideways scrolling one. You're walking into the dark neighborhood and suddenly something pops up, and it says a band of mud rats attack you from the dark. You have one minute to defeat them all or you run back to your ship." [Source: Marc, 2026-11-18]

So the surprise is built too, on Voltara. Now both kinds exist and you can compare them: wisps you choose, and rats that jump out.

**How it plays:**
- A cadet walks into a street on Voltara that has no lights. About two seconds later: "A band of 10 mud rats attacks you from the dark! You have one minute to beat them all. Or you run back to your ship."
- The cadet taps **Fight!** The one-minute clock starts only then. Or they tap **Run to your ship**.
- Each right sum scares one rat off. The rats are in the street, and they leave one by one.
- **Beaten:** a common card. That street is safe for the rest of the day.
- **Too slow, or running:** the cadet is back at the ship in the Landing Meadow, and walks back.

**What I added to your idea [Proposal], and why:**

| Rule | Why |
|---|---|
| Rats come only where a street has **no light at all**. | The dark means something. And your energy plan ends it: light a street and the rats are gone. The plan now matters in one more way. |
| A band that is beaten stays away **for that day**. If the street is still dark the next day, they are back. | Leaving a street dark has a cost that returns. |
| After any attack the rats **rest for two minutes**. | Nobody can be trapped. A child who loses can walk back through. |
| The band fits the cadet's level: 10 rats for sums within 10 or 20, 7 for 2-digit sums, 5 for 2-digit sums with regrouping. | One minute stays one minute, as you said. The harder the sum, the fewer rats. |
| The rats wait while a reading card or a task is open. | They never land on top of something the child is doing. |
| Teacher switch: **Voltara: mud rats.** | You may want a calm lesson. |

**What I still think you should watch for:** the first attack comes the first time a child walks into Home Street, before they have met the board. If it feels like being thrown out of the story, the rats could wait until after the Council has asked for help.

**Checked by** `checks/mud_rats_test.js`: the attack, a win, running, too slow, light, the next day, band sizes for each level, the rest, and the switch.

---

## 5. "The world has to be a little bit bigger"

Not done. Chronosia's map is one screen.

- A bigger map needs a view that follows the cadet. That part is small.
- The real work is filling it: more places, more people, more to find. An empty big map is worse than a full small one.
- [Proposal] Try the wisps on this map first. If walking around feels good, I would make Chronosia two or three screens wide and add quake day.

---

## 6. How it was checked

| Check | Result |
|---|---|
| 60,000 wisp questions: every answer worked out again from the words of the question | 0 wrong |
| A wisp is only on open ground, never on a door, and can always be walked to | yes, 300 rounds |
| A wisp never steps onto a cadet who stands still. Walking past one does not start it. | yes |
| Three right gives one common card. Two slips or stepping away gives none. | yes |
| The swap: 12 for a rare, 24 for a gold, and it asks first | yes |
| The catches, the tally and the cards are kept after a reload | yes |

The test is `checks/time_wisps_test.js`.

---

## 7. Decisions for you

1. **Seen or surprise?** Both are built now: wisps you choose on Chronosia, and mud rats that jump out on Voltara. Play both and say which you want where.
2. **The swap numbers:** 12 and 24 as you said, or dearer?
3. **Which cards can be swapped:** any common card (built), or only ones won from wisps?
4. **The reading pop-up:** A, B, C or D in section 2. Or your daughter's idea.
5. **The dashboard:** send the zip here, without student data.
6. **Wisps elsewhere:** in space, and on Voltara too?
