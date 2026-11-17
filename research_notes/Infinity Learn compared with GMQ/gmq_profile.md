# Galaxy Math Quest (GMQ): a profile from its own design documents

Source key (all files are under `/home/user/galaxy_math_quest/`; no web sources were used):

- **[CLAUDE]** = `CLAUDE.md`
- **[INFO]** = `INFO_FROM_MARC.md`
- **[Roadmap]** = `proposals/GMQ_Roadmap_v1_2026-11-17.md`
- **[Universe]** = `proposals/GMQ_Bigger_Universe_v1_2026-11-17.md`
- **[Voltara]** = `proposals/GMQ_Voltara_Quest_Guide_v3_2026-11-17.md`
- **[Trade]** = `proposals/GMQ_Galactic_Trade_Guide_v1_2026-11-17.md`
- **[Station]** = `proposals/GMQ_Station_Guide_v2_2026-11-16.md`
- **[Projects]** = `proposals/GMQ_Projects_Analysis_Atlantis_and_Moths_v1_2026-11-17.md`
- **[Chronosia]** = `proposals/GMQ_Chronosia_Quest_Design_v1_2026-11-17.md`
- **[Server]** = `engines/gmq-world/server/README.md`

Reader's caution, which applies to every section. These documents are GMQ's own. Almost all were written by an AI assistant (Claude) for the teacher, in two days (2026-11-16 and 2026-11-17). The teacher's words appear in them as voice messages "tidied by Claude". "Built" and "tested" below mean "the document says so, and names an automated test". I did not run the tests or open the game. Nothing in `drive/` was opened. Teacher access codes appear in two guides; the numbers are left out here on purpose.

---

## 1. Who is GMQ for, and who makes it?

### Takeaway
GMQ is one teacher's own project for his own Grade 3 class at an international school in Bangkok, played on the students' iPads. It is not a product. It is being rebuilt in November 2026 by the teacher working with an AI coding assistant.

### Cited Findings
- The maker is Marc, who "teaches Grade 3 at KIS International School in Bangkok. His students use their own iPads." — [CLAUDE] "Who and what"
- GMQ "is the space math adventure he built and ran in 2023–24." — [CLAUDE] "Who and what"
- The original 2023–24 version was mostly not on screen: "GMQ was visual and physical. Most things were print-offs or things students did with their hands." — [INFO] item 9
- The current project is to "rebuild GMQ as a persistent, typed text world (a MUD). An AI runs the world inside a constraint file, and a small PHP server keeps the facts." — [CLAUDE] "Who and what"
- The teacher later said he used the word "MUD" "because he did not know what was possible". He wants something visual and interactive, with commands of "three or four words (verb, thing, second thing), as in Zork, and the game mostly visual." — [INFO] "The rethink" and "Feedback on the first sketch"
- "GMQ is his work." Every place, name and character "must be original or Marc's own." — [CLAUDE] "Privacy and safety"
- Many original GMQ documents "were drafted with AI (mostly ChatGPT), and their answer keys contain errors." — [CLAUDE] "Facts and checking"
- The rebuild is done by an AI assistant under the teacher's direction. The teacher's own words: "Just go. Start working... I'm going to bed. Do as much as you can right now." Each choice the assistant made alone that night "is marked [Proposal]". — [INFO] entry "It's good. What do we need to work on now?"
- The teacher also opens the game on a classroom display: "in the pop-up window, on the BenQ board." A fix "also shows the game runs on the board." — [INFO] "Where he opens it", "The plan table"
- Students in 2023–24 worked alone or in pairs: galaxy tasks were done "sometimes in pairs, sometimes across different days." — [INFO] item 1
- Time per task in 2023–24: "Station tasks took about 5 to 15 minutes each. The other tasks usually took 30 to 40 minutes." — [INFO] item 1
- Language: the class includes children "still learning English" (the question is asked; the teacher has not answered with numbers). The word filter notes Thai words in English letters as a gap. — [INFO] item 7 and "No curse words"; [Station] "kind words only"
- The teacher already runs another engine on his own site: "Your Math Skills engine runs on your own site in PHP, with student files and a login." — [Roadmap] §5.1

### Inferences
- GMQ's scale is one teacher and one class. Its design choices (teacher codes, real-life tasks checked in person, a teacher who approves ship names) assume the maker is in the room with the players.
- "Grade 3" implies children of about 8 to 9, but no document states an age.

### Gaps
- **Class size is not stated.** The only number is a load-test target: "real load from a class of 20" and "20 cadets saving at once" in [Server]. That is a test size, not a stated class size.
- **Students' ages are not stated.**
- **Reading levels and the number of English learners are not stated.** [INFO] item 7 is blank.
- **Which quests the class did in 2023–24, and which they liked, are not stated.** [INFO] items 4 and 5 are blank. [Roadmap] §5.7: "Which tasks did your class love? I have never had an answer."
- No document says whether GMQ will be used at home, by other teachers or by other schools. "Class only, or at home too?" is an open question in [Roadmap] §5.1.

---

## 2. What does a child actually do in it?

### Takeaway
A child is a "cadet" who repairs a ship on a space station (15 short maths tasks), launches, then explores a planet where maths opens the way forward and their own energy plan changes what happens to the planet. Around this are a trading game in space and 20 small one-screen worlds. The child moves by tapping or by short typed commands such as `use wrench on vent`.

### Cited Findings

**How the child plays**
- Commands are short verb-and-thing phrases. The answer keys list them: `open hatch`, `read sign`, `push crate`, `use wrench on vent`, `give fruit to fish`, `talk council`. — [Station] §7; [Voltara] §7
- A "Here" row lists the things in the current place. "Tap a doing word, then a thing. The command runs. No keyboard." "The keyboard still works, for children who want it." — [Universe] §3.1
- Number answers use a floating number pad, because the teacher said "It's annoying that they get the full keyboard." — [INFO] "A number pad"; [Station] "the number pad"
- New words appear on a card over the picture. The child taps OK after reading. — [Station] "read, then OK"
- The game keeps in mind the thing the child last looked at, so `use wrench` works without naming the vent. "It does not solve puzzles for the child." — [Station] "the game remembers what you were doing"
- There is a "Hint" button. On the station "It names the next task." — [Station] §7
- The game opens with the teacher's own introduction ("the year, Earth in trouble"), then the station and the ship. — [INFO] "A better start"

**The KIS Station (the ship check)**
- "9 rooms, 15 tasks, 5 ship parts, 18 secrets, 4 real-life tasks with your codes." — [Roadmap] §2, row 1
- Five ship parts, each with three tasks and one maths topic: Engine Core (counting), Navigation System (add and subtract), Shield Generator (multiply and divide), Weapon System (odd and even), Power Module (place value). — [Station] §2
- "11 on screen, 4 in real life." The real-life ones: paint a star map and count stars on a path the teacher draws; share real tokens over 5 sections of a mat; throw at numbers 1 to 9 to reach an even total from 32 to 40; build four numbers with base-ten blocks, in pairs. — [Station] §2 and §3
- Example on-screen tasks: count four colours of artifacts and set four dials; tap to build a bar graph of alien kinds; subtract fuel over three legs, where "the fuel left carries to the next leg"; tap 7 crates to make 30 tons. — [Station] §2
- "A part is fitted when its three tasks are done. The ship cannot launch until all five parts are fitted." — [Station] §2
- The station's purpose, in the teacher's words: it "was only to test very basic foundation skills and to let students learn how Galaxy Math Quest works." — [INFO] "Scope reset"
- Each student gets different numbers in several station tasks ("Each student's counts differ"; "Each student gets their own" hops). — [Station] §5
- Exploring matters: "A thing found in one room often opens something in another." — [Station] §6

**Planet Voltara (the one finished big quest)**
- "Voltara is now nine places you walk between, with things to find, people to talk to and a story that turns." — [Voltara] §2
- The story is the teacher's: an energy crisis, the Energy Council, 21 city places, 1,650 energy. — [Voltara] §2
- "Every piece of maths opens something. You round to cross a river. You regroup crystals to open a count. You add to learn what a street needs. You subtract to find what is missing." — [Voltara] §2
- Maths steps in order: round to the nearest hundred four times; place value (150 sparks make 15 rods, giving 1,650); add many numbers (street totals 750, 880, 590); estimate then be exact (2,220 − 1,650 = 570); plan within a total; find differences; divide (240 over 8 hours is 30); rows of equal groups (5 rows of 6 houses). — [Voltara] §4
- The child chooses which places get power. "The city lights up by the student's own plan." Each place uses energy and makes people happy; some make people unhappy if left dark. — [Voltara] §2 and §5
- "A plan lasts one day. Next morning a report says how the people are and what the tower holds. Then you plan again." — [Voltara] §2
- Two goals (600 more happy than unhappy people; 1,650 or more in the tower) and four endings, from "Voltara shines" to "Voltara is worse off." — [Voltara] §5
- A twist: "The student's own morning sum does not match the tower: energy is vanishing." It leads to a hidden town. — [Voltara] §2 and §4
- "The last step is done in real life, with blocks and a spoken reason. You give a code. It earns the gold card." — [Voltara] §2
- Seven secrets. "Three of these depend on the student's own plan or on going back. That is the MUD part: the world remembers." — [Voltara] §6
- City numbers are the same for every student "so a class can argue about one plan and compare towers on day 2. The river numbers differ for each student." — [Voltara] §11, item 12

**Galactic Trade (in space)**
- It is the teacher's Voltara Task 2, set in space. "The 20 planets, their distances and their profits are your Trade Data Sheet, unchanged." — [Trade] §1
- "A student scans a planet by rounding its two numbers. Then plans a route with the fuel they have. Then flies it and counts the gems." — [Trade] §1
- The star map has rings at 10, 20, 30 light-years. "A planet 33 light-years away sits between the 30 ring and the 40 ring, nearer 30. So the rounding can be seen." — [Trade] §2
- Three trips. The first is free; later fuel costs gems ("9 lots of 200"). — [Trade] §1 and §3
- "The choice matters. Four far planets cost more in fuel than they pay. That trap is in your own numbers." — [Trade] §1
- Gems are "only a score" so far. — [Trade] §8

**The small worlds**
- "All 20 of your trade planets can now be landed on. Each one is a small world made from the kit. Nothing in them was drawn by hand." — [Universe] §2
- Each world has a sky, far land, ground, plants, a rock, a creature, "One secret", "Three or four dead ends" and "One lock" using rounding, adding or finding a difference. — [Universe] §3.2
- The play rules come from the teacher's older Novus engine: "Describe, don't label." "Most things lead nowhere." "The creature does not use words." — [Universe] §3.2
- Opening the lock gives a "star seed". "There are 20 to find." — [Universe] §3.2
- Their stated limit: "What it is not, yet: deep. Each world is one screen and one secret, about three minutes." — [Universe] §3.2

**Cards**
- "Each task gives exactly one card. 15 tasks, 15 cards." Six station secrets also give a card, so a full explorer "ends with 21". — [Station] §4
- The teacher's stated purpose: "By the end of the ship-part quests they should have about 15 cards, and then they can battle. 'That's also the point of these initial quests.'" — [INFO] "Three tasks for each ship part"
- "A major quest gives a gold card, 'the best one always'. Mini quests give a random card." — [INFO] "Decisions on projects, locks and cards"
- Battles are "Not built. The rules are yours. Students can battle with printed cards now." — [Roadmap] §2, row 6

### Inferences
- The child's loop is: explore, meet an obstacle, see an idea shown, do a sum to pass, find secrets, collect a card. On Voltara a second loop is added: plan, sleep, read a report, plan again.
- Much of the play is not maths. Several story steps are marked "none" for maths in [Voltara] §4 (feeding the fish, digging for the glow stone). This is by design: see the principle "the math is necessary to advancing" in section 3.

### Gaps
- How long the built game takes real children is unknown. The documents give guesses only: station "three to five lessons. That is a guess" [Station] §8; Voltara "three or four lessons, plus the block lesson. That is a guess" [Voltara] §9.
- These guesses conflict with the one real report: the teacher's daughter "finished most of the station in 30 to 40 minutes" [INFO] "A bigger universe". Whether she did the four real-life tasks in that time is not stated.

---

## 3. What are its stated design principles?

### Takeaway
The documents state a clear set of principles. The base one is the "constraint architecture": the AI keeps its full intelligence inside a defined world while code holds the facts and marks the maths. On top sit teaching principles the teacher stated in his own words: decisions must matter, show the idea before the doing, a job not a worksheet, and some tasks must be done with real hands in front of the teacher.

### Cited Findings

**The constraint architecture**
- "The constraint architecture is the foundation. The AI keeps its full intelligence inside a defined reality. Code holds memory and hard facts: numbers, answer checks and rewards. Never redesign code-first, and never shrink the AI's role to scripted output." — [CLAUDE] "How Marc works"
- Restated: "Your foundation is: the AI keeps its full mind inside a defined world, and code holds the facts." — [Roadmap] §1
- "Code marks and the AI tells the story." — [INFO] "Mini-quest decisions"
- "Can the AI mark the maths? It should not, and it does not. Code does. That is your own rule, and it is the right one." — [Universe] §6

**Maths is needed, not added**
- The teacher wants an immersive experience "that is not happening because of the math, but the math is necessary to advancing and complete things and find things." — [INFO] "One vertical slice"; [Voltara] §1
- "A lock is a reason to do a sum, not a quiz." — [Universe] §4

**Decisions must matter**
- "We're missing the part of the story where it actually has an effect... What happens to this planet?" "Your decision must matter." "We could even fail it, but we leave the planet worse off." — [INFO] "Decisions must matter"
- The assistant "takes this as a rule for every mission, not only Voltara." — [INFO] "Decisions must matter"
- Trade-offs inside a place: "Factory could make more power. But make people unhappy because of pollution. Amusement park makes people happy. But doesn't provide any power." — [INFO] "Correction: trade-offs inside a place"
- The ending is "the ending summary of your effect on this planet." — [INFO] "The endings, and freedom with the numbers"

**See the idea before doing it**
- The teacher's point is "showing students things so they understand the concepts behind them before they do things." It is "the lead principle". — [INFO] "Correction to the last message"
- "So no student uses a tool before they know what it is for." — [Projects] §4a
- Proposed rule: "every stage of a big quest opens with a short 'see it' moment before any answer is asked for." — [Projects] §4a
- On Voltara: "The fish rounds one first. Sparks bundle into a rod before the store opens. Number lines come before the estimate." — [Voltara] §8

**The "bones" of a big quest (from the teacher's own class projects)**
- Eleven bones are named: "A job, not a worksheet"; "A question the maths answers"; "Hands first"; "See the idea before you do it"; "Each stage feeds the next"; "Spiral back"; "Room to disagree"; "A twist"; "Wild ideas first, then steer"; "Every reader gets there"; "End by explaining". — [Projects] §4
- On the twist: "My own sketches end when the sum is right. Yours end when a student says 'wait, could it be...'. That is what makes a project a quest." — [Projects] §4
- The teacher's view of big quests: they "should be things students design in real life, like project-based learning, to show true understanding." — [INFO] item 9
- Big quests "can spiral back, can include different maths skills, and can be multi-step". "This is the kind of stuff that my class is capable of doing." — [INFO] "Two more of his projects"

**Real-life tasks with a teacher's code**
- "For tasks like the throwing one, he wants students to use real, physical skills. They come to see him, do the task, and type a code he gives them to show they passed." — [INFO] "Real-life tasks with a code"
- "The explanation is yours to judge. No code can mark 'why'." — [Projects] §6

**Cards**
- One card for each task; a gold card for a big quest; set odds for common, rare and gold. — [INFO] "Mini-quest decisions", "Decisions on projects, locks and cards"

**Kind words only**
- "You need to do something so that our children cannot write curse words. For the ship name or anywhere." — [INFO] "No curse words"
- Built: "A rude command is not done. The game answers 'Kind words only, cadet.'" The game shows back "Only words the game knows, and numbers. Any other typed word is shown as '…'." — [Station] "kind words only"

**Reading cards**
- After watching a child tap without reading: "We need to make sure they're reading everything because if they're not, there's no point in this." — [INFO] "Reading the words"
- Stated limit: "It can make a child stop. It cannot make a child read. What does that is needing the words to know what to do next." — [Station] "read, then OK"

**Tap the words**
- The teacher's idea: when a child touches the action word, show the other words common in that area "as possible words". — [INFO] "A bigger universe"
- Stated cost: "a child no longer has to notice a thing in the picture to know its name. That takes away a little of the finding." — [Universe] §3.1

**Explicit maths vocabulary**
- "Be very explicit about maths vocabulary. The perimeter question did not use the word 'perimeter', and it should." Both names count for quarters/fourths and trapezoid/trapezium. — [INFO] "Vocabulary", "Two names"

**Exploration rules (from Novus)**
- Kept for Grade 3: "describe don't label, dead ends are real, and discovery comes from doing." Left out as suited to older students: "the fuel clock and 'Earth is dying' pressure, the three-tier judgment, and locks that need two kinds of test." — [Universe] §6
- "He wants quite a few secrets in each place." — [INFO] "Feedback on the first sketch"

**Working rules for the project itself**
- "Don't copy features from other games or apps because they're common. Every borrowed feature needs a reason that applies to Grade 3 students on iPads." — [CLAUDE] "How Marc works"
- "Recompute every number." "Test every per-student number rule in code on thousands of random seeds before calling it solvable." — [CLAUDE] "Facts and checking"
- "Say what to check that could prove a claim wrong, not only what supports it." — [CLAUDE] "How Marc works". Every guide read here ends with a "What could prove this wrong" table.
- "Don't make his decisions. Lay out options with what each one costs." — [CLAUDE] "How Marc works"
- Privacy is "absolute": "Never open, copy or quote student data." — [CLAUDE] "Privacy and safety"

### Inferences
- The principles split into two kinds. Some limit the machine (code marks, the AI stays inside the world, kind words). Others are about teaching (see it first, a twist, a decision with a price, explain in words to the teacher).
- GMQ does not aim at fast, repeated practice. The teacher called a skills trainer "a bit too much" ([INFO] "Scope reset"). The stated aim is a few deep quests where maths is a means.
- The practice of checking every plan by code (for example, all 2,097,152 day-1 Voltara plans) is unusual care for a classroom project. It checks that the numbers work. It does not check that children learn.

### Gaps
- No document states a learning theory or cites research. The principles come from the teacher's practice and his two class projects.
- No principle covers assessment or reporting of mastery to parents or the school.

---

## 4. What role does AI play, and what is it forbidden to do?

### Takeaway
AI has two roles. In making the game, an AI assistant designs, codes and tests nearly everything, with the teacher deciding. Inside the game, the AI is meant to answer anything a child types, in the world's voice. That in-game AI is switched off and has never answered a child. When on, its replies pass a code check that stops numbers, answers, rewards, long or unkind text, and out-of-world talk.

### Cited Findings
- The AI's one in-game job: "answer anything a child types. Now the sketch says 'You do not see that here.'" — [Roadmap] §4
- Status: "A constraint file exists as a draft (version 0.3). It has never been run against a real model." — [Roadmap] §2, row 7
- "The AI is off until you set `provider` and a key in `config.php`." — [Server] "The AI, and how it is kept inside the world"
- "The AI has still never answered a real child. The server's stand-in AI proves the checks work, not that the constraint file works." — [Roadmap] §6
- When on, "the page sends only the lines the game does not understand." The server sends the AI "your constraint file, the place the cadet is in, and the cadet's words." — [Server]
- "The reply is checked before a child sees it. It is stopped if it: has a number the world did not give; marks an answer, or gives one; hands out a card or a reward; is longer than 4 sentences, or has a sentence over 16 words; has unkind words, or steps out of the world ('as an AI...')." — [Server]
- "If it is stopped, the game answers as it does today. Every stop is written to the log, so you can see what the AI tried." — [Server]
- "A cadet can ask at most 12 times a minute." — [Server]
- The AI cannot change the world yet: the server "does not yet act on the AI's tags (`[TRY]`, `[MOVE]`, `[TRACE]`): it removes them. So for now the AI can describe, and cannot change anything. That is the safe half of your design." — [Server]
- The AI key stays "in a config file that stays on the server". — [Server] "What it is"
- The AI does not mark maths: "It should not, and it does not. Code does." — [Universe] §6
- AI-made worlds are a proposal: a world "can be data... The AI's job is to write the data, inside your constraints. Code checks it before a child sees it." — [Universe] §2
- Three options for who makes worlds: A made by a rule (built); B "Written ahead by the AI, checked by you"; C "Made live for each child". The advice is B, then C for one place only. — [Universe] §5
- Stated risk of live worlds: "A weak world can slip through. No two children can compare notes." — [Universe] §5
- AI pictures are ruled out for now: "Picture-making AI is slow, costs more, cannot keep one style across a game, and is hard to keep safe for children. I would not build on it now." — [Universe] §6
- AI in development has produced errors before: the ChatGPT-drafted docs' "answer keys contain errors", hence "Recompute every number." — [CLAUDE] "Facts and checking"
- The assistant records its own misreadings of the teacher's voice messages, for example reading his "values" idea wrongly at first. — [INFO] "Correction: trade-offs inside a place"; [Projects] §1

### Inferences
- Today the game that a child plays contains no live AI. Every response is written ahead in code. The "AI runs the world" claim is a design goal, not a present fact.
- The safety design is "deny by default": a stopped reply falls back to the fixed game answer.
- The reply check is itself untested against a real model, so its strictness is unknown. The README's own test for this is "Type odd things for ten minutes. Read the log of stops." [Server]

### Gaps
- Which AI model or provider would be used is not stated in the files read.
- The constraint file itself (`engines/gmq-world/constraints/gmq-world.txt`) was not on my reading list, so its content is not described here.
- Cost per child of running the AI is not stated beyond "Costs a little each time" [Universe] §5.
- No document covers how a child's typed words sent to an outside AI provider would be handled for privacy.

---

## 5. What role does the teacher play?

### Takeaway
The teacher is inside the game as "Your Commander" and is the only judge of anything code cannot mark. He hands out codes for real-life tasks, hears spoken explanations, approves ship names, and sees the class on one page. He also owns every design decision.

### Cited Findings
- In the story the teacher is "Your Commander (your teacher)". — [Voltara] §4
- Real-life tasks: "The student uses the easel, the mat, the wall or the bench... They do the task with you. You say the code. They type it. They get the card." — [Station] §3
- There are 5 code-locked tasks in all (4 on the station, 1 on Voltara), and printed sheets for them. — [Roadmap] §2, row 10
- The Voltara gold card needs the teacher: the child builds the plan with blocks, says why, and "You give a code." — [Voltara] §2
- "The explanation is yours to judge. No code can mark 'why'." — [Projects] §6
- "He checks project designs himself." "No teacher key" for locks. — [INFO] "Decisions on projects, locks and cards"
- Teacher tools built: "shortcuts, the codes, a log of what a student did, the reading-card switch", plus "a class view page, with the server." — [Roadmap] §2, row 9
- The server "Holds a new ship name until you approve it" and "Shows you the whole class on one page." The teacher page is called "the Commander's Desk". — [Server]
- The teacher makes a class and gets a class code. He can give a cadet a new secret number. — [Server] "How a cadet logs in"
- The server "Keeps your codes for the real-life tasks, so they are not in the page." — [Server]
- Three ways to give a code are laid out: one fixed code (built), a code the teacher can change, or a tap on the teacher's own screen. Weakness of the built way: "Students can tell each other the code." — [Station] §3
- The teacher decides; the assistant proposes: "Don't make his decisions." "The battle rules are his." — [CLAUDE] "How Marc works"
- Proposed for AI-written worlds: "You read them once... Perhaps 10 minutes a world." — [Universe] §5
- The teacher tests the game himself (on his phone and the BenQ board) and with his daughter, and reports faults. — [INFO] "Stuck at the locker", "The plan table", "Reading the words"

### Inferences
- GMQ treats the teacher as part of the system, not as a user of a dashboard. A child cannot finish the station or earn Voltara's gold card without the teacher present.
- This limits use at home or without the maker. It also makes the hardest thing to automate (judging a reason) a human job.

### Gaps
- What the class view shows (which data about each child) is not described in detail in the files read.
- No document describes how the teacher would use game data for grading or reports.

---

## 6. What is built and tested, what is only designed, and what has not started? What is the evidence base?

### Takeaway
A browser "sketch" (prototype) of the station, Voltara, Galactic Trade and 20 small worlds exists and passes automated tests. A first server exists but has only run on the assistant's machine. The in-game AI, a second planet, cards and battles are not live. One child has played the current build.

### Cited Findings

**Built in the sketch, with automated tests**
- The station: "Built: 9 rooms, 15 tasks, 5 ship parts, 18 secrets, 4 real-life tasks with your codes." — [Roadmap] §2
- Test: `checks/station_playthrough_test.js` "plays the whole station at iPad size and phone size." — [Station] §8
- Voltara: "built in the sketch (version 21). One vertical slice." — [Voltara] header
- Voltara tests: the play test does "9 of 9 steps, 7 of 7 secrets, the gold card, and flying away", "plays five days and reaches all four endings". The number check "tried all 2,097,152 plans for day 1" and "ran 5,000 random students for 8 days each." — [Voltara] §9
- Galactic Trade: "built in the sketch (version 26)." The check "tried all 49 first trips, and every season of three trips from each one. No student can get stuck." — [Trade] header and §6
- Small worlds and the "Here" row: built in sketch version 27; test `small_worlds_test.js`. — [Roadmap] §6; [Universe] header
- Helps: number pad (version 23), reading cards (24), kind-words filter (22), command memory (28 and 29). — [INFO]; [Station] added sections
- Kind-words test: "110 rude inputs refused, 77 ordinary names and commands let through, and none of the game's own 819 words refused." — [Station] "kind words only"
- Pictures: "Built: drawn by code. No painted art. Simple beeps." — [Roadmap] §2, row 12
- The sketch is hosted as a claude.ai artifact link, not on the teacher's site. — [Station] header

**Built, but only tested on the developer's machine**
- The world server: "version 0.1", "a first version, tested only on Claude's machine. It has never run on your site." — [Server] header
- "40 checks. All pass." — [Server] "How it was tested"
- "Not tested: your host, real load from a class of 20, and a real AI model." — [Server]
- It does not yet mark maths ("The page still does that") or hold the world's facts. — [Server] "What it is"

**Drafted, never run**
- The AI constraint file: "a draft (version 0.3). It has never been run against a real model." — [Roadmap] §2, row 7

**Designed on paper only**
- Chronosia: "a design on paper. Nothing here is built." — [Chronosia] header
- A set of 14 mini quests and mini battles: "written, not built." — [Roadmap] §2, row 4
- The Seed Keepers quest: "an outline, not a finished quest." — [Projects] §6
- The five ideas to deepen Galactic Trade: "I have built none of these." — [Universe] §7

**Not started**
- Voltara's Final Boss; Xylophora (area); Zephyron (maps and scale); Operation Stardust (data); Patternox (patterns, "closed"). — [Roadmap] §3
- "Never built, plans only: Multiplo-Planet, Planet Lengthar, Geometria." — [Roadmap] §3
- Battles: "Not built." The real card set "is not chosen." — [Roadmap] §2
- Events on the way between galaxies: "Nothing happens on the way between galaxies yet." — [Roadmap] §2, row 2
- Reading at different levels: "Paused by you." — [Roadmap] §2, row 11
- Built but hidden: a skills bank of "72 skills with problem makers, pictures, maths words and 234 short stories... You said it was 'too much' as a trainer, and it is hidden now." — [Universe] §4

**The evidence base**
- "Only one child has played it. Your daughter. Every 'it works' in my reports means 'a test passes', not 'children enjoy it'." — [Roadmap] §1
- "This is the first report from a real child playing." — [INFO] "Reading the words"
- What that one child showed: "She did not notice the words at the bottom when she got to new places. 'She thinks it's just a click click click game.'" — [INFO] "Reading the words"
- She "finished most of the station in 30 to 40 minutes, 'which I guess is OK'." — [INFO] "A bigger universe"
- Each guide lists the same untested items: "Not tested: real children, a real iPad, and how long it takes." — [Voltara] §9; similar in [Station] §8 and [Trade] §6
- The number pad is "Not tested on a real iPad." — [INFO] "A number pad"
- The original paper-and-site GMQ did run with a real class in 2023–24: Voltara Tasks 1 and 2 "ran in class"; Operation Stardust "ran". — [Roadmap] §3
- One bug report was never reproduced: the teacher shortcut "takes me to the bay where I was before... Not confirmed fixed." — [INFO] "Shortcut report"

**A conflict between documents**
- [CLAUDE] says "Nothing has been built yet." [Roadmap] §2 and the guides list the station, Voltara and Galactic Trade as built in the sketch. [CLAUDE] appears to be an older standing note that was not updated. — [CLAUDE] "Who and what"; contradicted by [Roadmap] §2

### Inferences
- The honest summary is: a tested prototype, a class-of-zero trial, a sample of one child. There is no evidence yet of learning gains, of enjoyment across a class, or of use on real iPads.
- The 2023–24 classroom run is evidence for the teacher's original tasks on paper, not for the 2026 rebuild. No results from that year are in the files read.
- The whole current build was made in about two days (file dates 2026-11-16 and 2026-11-17, sketch versions up to 29). Speed of change is high; stability over time is unknown.

### Gaps
- No outcome data of any kind (test scores, time on task, completion rates) exists in the files read.
- The daughter's age and grade are not stated.
- I did not open the sketch or run the tests, so "passes" is the documents' claim.

---

## 7. What are its known weaknesses and open decisions, as its own documents state them?

### Takeaway
The documents are frank about limits. The two foundation pieces (AI and server) are unproven. Almost nothing has been tried with children. Many content and rule decisions wait for the teacher, including the card set, logins, and what unlocks what.

### Cited Findings

**Weaknesses the documents state**
- The core is half built: "Until tonight I had built only the code half." — [Roadmap] §1
- One player so far. — [Roadmap] §1
- Hand-building does not scale: "Voltara took a day. Ten worlds a galaxy would take months that way." — [Universe] §2
- Small worlds are shallow: "one screen and one secret, about three minutes." Under option A, "Worlds differ in looks more than in ideas." — [Universe] §3.2 and §5
- Typing is hard for young children on iPads. The teacher "said some things may just not be done." — [INFO] "A bigger universe"
- Reading is not guaranteed: a card "cannot make a child read." — [Station] "read, then OK"
- The word filter has gaps: "No word list is complete." "Thai words written in English letters are not on the list." "In the real game the server must do the check. A page can be changed by the person using it." — [Station] "kind words only"
- Fixed teacher codes can spread: "Students can tell each other the code." — [Station] §3
- Login strength is modest: first name plus "a 4-digit secret number". The guard is a lock after five tries. Test offered: "would a classmate guess it?" — [Server]
- The page, not the server, still marks the maths and builds the AI's "world slice". — [Server]
- Voltara may be too hard or too heavy: random play mostly fails ("Of 5,000 students tapping at random for 8 days: 170 shine"); "I also have not tested whether children can hold three numbers for each place in mind." — [Voltara] §5 and §9
- On day 1 only 186 of 2,025,758 fitting plans meet both goals. — [Voltara] §5
- The station tasks break the lead principle: "The station tasks start with doing." And "The 'Maths word' line tells. It does not show." — [Projects] §4a
- The assistant misjudged the class level: "I had set your class's level too low." — [Projects] §1 and §3
- Source material has errors and conflicts: Voltara Final Boss "totals reach 10,800, money can go below zero"; Xylophora "3 of 4 tasks need redoing"; Patternox "opens after 'Numbers Quest 2', which does not exist". — [Roadmap] §3
- Several of the 15 trade scenario cards "could not be carried out... one used percent, and one let luck beat skill by a wide margin." — [Trade] §4
- Possible rights problem: Zephyron's "maps may be someone else's art." — [Roadmap] §3
- A 2023–24 task was too long: the data handling task, "the planning and packing of all the food." — [INFO] item 3
- Pictures are plain: "drawn by code. No painted art." — [Roadmap] §2
- "The star map is small on a phone. It is made for an iPad." — [Trade] §6
- Voice messages get garbled, and several readings are "Not confirmed." — [INFO], several entries

**Open decisions (the teacher's to make)**
- Where the server runs; how students log in; "Class only, or at home too?" — [Roadmap] §5.1
- "Which card set is the real one? Four versions disagree." The card odds (70/25/5 is "my guess"). — [Roadmap] §5.2
- "What opens what?" Whether Voltara changes while the student is away. 24-hour time on Chronosia. — [Roadmap] §5.3
- Whether to keep the 14 mini quests. — [Roadmap] §5.4
- Painted art or the drawn look. — [Roadmap] §5.6
- The right direction for scale: "A few deep planets, and many small worlds made from a kit"? Who makes the worlds (A, B or C)? Should small worlds carry the skills bank? — [Universe] §9
- Ship naming: free typing with a filter, pick from lists, or teacher approval. — [Station] "kind words only"
- Whether reading cards need a "read it to me" button for children learning English. — [Station] "read, then OK"
- Shared data or own data for projects; whether every big quest has reading at three levels. — [Projects] §9
- What gems and star seeds are for. — [Trade] §8; [Universe] §9
- Should the ending change the reward? — [Voltara] §11
- Many items on the teacher's own information form are still blank: typing limit, what worked, what ran, curriculum, reading levels, approval, how far redesigns may go. — [INFO] items 2, 4, 5, 6, 7, 10, 11

### Inferences
- The project's biggest risk, by its own account, is that the unproven half (AI plus server) is the half that defines it.
- Many open decisions are basic product questions (logins, home use, rewards). This is normal for a two-day-old prototype and should be weighed as such in any comparison with a mature product.

### Gaps
- No document estimates the total work or time needed to reach a classroom-ready version.
- No document discusses accessibility beyond reading cards and a possible read-aloud button.

---

## 8. How does it cover (or not yet cover) a full Grade 3 maths scope and sequence?

### Takeaway
It does not yet cover a full scope and sequence. The built parts cover number work well (counting, place value, rounding, the four operations, odd and even) and touch bar graphs. Time is designed. Area, scale and maps, data, patterns, fractions, money and shapes have no playable quest. The plan is to map each of five galaxies to one strand and fill it with many small worlds, but that is a proposal.

### Cited Findings

**The intended structure**
- Five galaxies, each a strand: Numerix (numbers), Metrica (measuring), Geometrica (shapes), Databa (data), Patternox (patterns). — [Roadmap] §3
- "A galaxy is a strand. Numerix is numbers. Metrica is measuring." — [Universe] §4
- The teacher's material holds a scope: it is in "tasks / strand order" and "Pre-Requisite - Order of Strands". — [INFO] "Scope reset"

**What the built parts cover**
- Station: counting; add and subtract; multiply and divide; odd and even; place value; plus a tapped bar graph and a coordinate grid. — [Station] §2
- Station numbers are kept "inside the 10 by 10 tables". — [Station] §5
- Voltara: rounding to the nearest hundred; place value regrouping to 1,650; adding many three-digit numbers; estimating; subtraction; difference; division (240 ÷ 8); rows of equal groups. — [Voltara] §4
- Galactic Trade: rounding to the nearest 10 and 100; adding tens within a limit; "9 lots of 200"; adding hundreds to four-digit totals. — [Trade] §3
- Small worlds: one lock each "from Galaxy Numerix's own maths: round to the nearest 10, round to the nearest 100, add, or find the difference." — [Universe] §3.2

**Designed, not built**
- Chronosia (Metrica): fixing impossible clock times, elapsed time, a pattern in quake lengths, adding minutes to a time. — [Chronosia] §3
- The Seed Keepers outline (Metrica): length in cm and m, ml and litres, line graphs. — [Projects] §6

**Not started**
- Area (Xylophora), maps and scale (Zephyron), data (Operation Stardust), patterns (Patternox). — [Roadmap] §3
- "Multiplo-Planet, Planet Lengthar, Geometria" are "plans only". — [Roadmap] §3

**Built but hidden**
- A skills bank of "72 skills with problem makers, pictures, maths words and 234 short stories", now hidden. — [Universe] §4
- "34 picture skills (clocks, graphs, grids, fractions, shapes, star maps)". Generic coins with whole dollars and decimal cents. — [INFO] "Picture toys", "Coins"
- Level bands: "Bands 161 to 210 are right for starting. Eventually the game should go up to 240." A recommendation, "Not final", is to "let the teacher set each student's starting band from an NWEA score." — [INFO] "Level bands", "Trainer order"

**The plan for full coverage (proposal)**
- "Each small world carries three to five skills from its galaxy, as locks on things you find." "Ten worlds in a galaxy cover its whole strand, in order." "The big planets stay hand-made." — [Universe] §4
- "So the universe has two kinds of place. A few deep planets, and many small worlds around them." — [Universe] §4
- The teacher's wish: multiple planets in each galaxy, "five or six or ten worlds in each one", to cover every skill in the scope and sequence. — [INFO] "A bigger universe"

**The teacher's goal has shifted, and the documents record it**
- 2026-11-16, "The goal, restated": "Every maths skill is addressed, so students find their gaps and fix them. It is a maths skills builder and also a fun, creative, exploring adventure." — [INFO]
- 2026-11-16, "Scope reset": "We don't need every single little skill." The Math Skills engine was "a bit too much". — [INFO]
- 2026-11-17: he wants a deeper game that covers "every skill in the scope and sequence". — [INFO] "A bigger universe"
- Whether small worlds should carry the skills bank is an open decision. — [Universe] §9, item 3

**The curriculum document is missing**
- The teacher was asked to add "the KIS Grade 3 maths scope and sequence". The answer is blank. "Without it, Claude Code uses the strand docs, which ChatGPT drafted." — [INFO] item 6
- Level judgments have been wrong before: "above Grade 3" flags came from "a general list for the grade" and are now to be read as "check with Marc". — [Projects] §3
- "24-hour time is in your Advanced strand, not the Grade 3 one." — [Chronosia] §4

### Inferences
- Coverage today is strong in one strand of five (number) and absent as playable content in the other four. The data strand has only a bar-graph task on the station.
- GMQ's built content has no adaptive path through skills. The hidden skills bank had level bands; the visible game has per-student random numbers in some tasks and a fixed story order.
- The deep quests "spiral back" on purpose (rounding returns in the estimate; rows return in the hidden town), so one quest touches several skills. This makes skill-by-skill coverage hard to count, and it is not counted in any document read.
- A fair comparison should describe GMQ as depth-first on a small part of the curriculum, with breadth as a proposal.

### Gaps
- No document maps built tasks to a list of Grade 3 standards. A skill-by-skill coverage table does not exist in the files read.
- The real KIS scope and sequence has not been supplied, so nobody has checked GMQ against it.
- Whether fractions, money, geometry and measurement beyond time will get quests, and when, is not decided.
- I did not read the strand documents in `drive/` (the folder is off limits for this task), so the planned scope is known only through the summaries above.
