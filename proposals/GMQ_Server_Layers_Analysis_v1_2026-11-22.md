# Class worlds and a shared space: analysis

**Date:** 22 November 2026. **For:** Marc. **Nothing here is built.** Everything is **[Proposal]** unless it says [Source].

[Source: Marc, 22 November] He shared another AI's (Grok's) answer about servers and asked: "Analysis?"

**Grok's idea, in short:**
- **Each class (or grade) gets its own copy of the planets.** Children in it see each other's traces: landings, messages, solved tasks, changed places. The AI adds new small places inside that copy, kept to the standards.
- **A wider layer for space and battles:** children from other classes or schools meet, trade coordinates, battle with their cards, and find hidden planets. The first finder gets credit others can see.
- **One cadet record** works on both layers.
- **Scale:** a planet with 50 to 100 quests, many of them filled in by the AI from the kit.

---

## 1. Where it is right

- **The split is the normal, sound way to build this.** Most of the data belongs to one class; a little (battles, public finds) is shared. A class is also the right size for a teacher to watch.
- **It fits your MUD vision.** "Someone was here before me" is the persistent world you described from the start.
- **One cadet record** for both layers is right.
- **AI-filled quests from the kit** is the constraint architecture in CLAUDE.md: the AI writes inside the rules, and code checks every number.

## 2. What it leaves out

### A. Children's safety and privacy: the biggest gap

- **The wider layer means children who do not know each other, from other classes or schools, meeting and messaging.** For 8-year-olds, that needs:
  - the school's approval
  - parents' knowledge
  - the rules on children's data where your children live. Thailand has a data protection law; the school's IT or data person will know what it asks.
- **Safer shape** [Proposal]:
  - No typed messages between classes. Only fixed actions: a battle, a shared coordinate as numbers, a few set greetings.
  - Cadet code names on the wider layer, never real names.
  - A class joins the wider layer only when its teacher turns it on.
- **Inside a class:** messages are seen by the teacher, and the AI checks them before other children see them. The server already holds a new ship name until you approve it [Source: `engines/gmq-world/server`]. The same idea fits messages.

### B. Your turn, and their turn

- **If one child mends the bridge, the next child must still do the maths.** Otherwise the first child takes the task away from everyone else.
- So the world needs two kinds of state:
  - **traces everyone sees:** "Cadet Comet7 mended this bridge on Tuesday" (a made-up code name)
  - **each child's own progress:** every child still makes their own plate
- Grok's "a quest that one student finishes can leave a visible trace" is right only if the trace never does the next child's maths.

### C. Competition

- **"The first finder gets credit," battles across schools, and leaderboards all reward speed.**
- **Your rule is learning before speed.** A Grade 3 child who is slow at multiplication would see others always first.
- **Kinder shapes** [Proposal]:
  - credit as "found by" with no ranking
  - firsts counted inside a class
  - rewards for helping (a hint that worked for someone else)

### D. AI-made quests need the same checks as ours

- The Meadow took one night and three independent reviews for one region. AI-filled quests will not get that by themselves.
- **Every AI-made quest must pass the same checker before a child sees it:**
  - its number rule on thousands of seeds
  - one right answer
  - nothing that gives the answer away
  - short sentences
- **Plus a "teacher approves" step,** at least at first.

### E. Cost, and how far away it is

- **Today:** the server (version 0.1, PHP files on your site) has never run, and the AI has never answered a child.
- **A live space where children from several schools battle at the same moment is a different kind of server.** It needs instant messages between iPads, and someone to keep it running.
- **Every AI answer costs a little money.** Many children, every day, adds up.
- **The game must keep working when the server is down.** It does now: it saves on the iPad.

## 3. What could prove the split wrong

- **14 children on many different planets leave few traces for each other.** A grade (all Grade 3 classes together) may be the better size for "someone was here".
- **A wider layer is worth nothing until there are other classes.** Until then, it has nobody to meet.

## 4. An order to build it [Proposal]

| Step | What | Already there? |
|---|---|---|
| 1 | **Run the class server with your 14:** class code, name and a 4-digit number; saves on the server; your view of the class | **Built, never run** [Source: the server's version 0.1 has all three] |
| 2 | The AI answers a child, inside the constraint file, checked before the child sees it | Built, never run |
| 3 | **Traces inside the class:** who mended what, seen by all; each child's own maths kept separate | Not built |
| 4 | AI-made places from the kit: the checker, plus your approve button | The checker exists for Chronosia's finds (`fCheck`) and Algora's world (`bwCheck`) |
| 5 | A grade layer, if more Grade 3 classes join | Not built |
| 6 | **The wider layer** (space, battles, public finds): no typed messages, code names, the teacher's switch, the school's approval | Not built |

**My recommendation: step 1 next, when you are ready to try the server.** It is built and waiting. Everything else stands on it.

## 5. Your decisions

1. **Is the split the long-term shape?** (I think yes.)
2. **One class, or a grade, per world copy?**
3. **When to try step 1:** it needs the server files on your site, and a class code.
4. **What the wider layer may let children do with each other.** Ask the school before any of it is built.
