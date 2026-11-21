# Flying into the planets: what Atlantis changes

**Date:** 21 November 2026. **For:** Marc. **Nothing is built.** Everything is **[Proposal]** unless it says [Source].

[Source: Marc, 2026-11-21] He sent https://github.com/Noniv/atlantis : "I still think it'd be interesting. Would you do something like this for like flying into the actual planets. But the other thread said no we should not. Or could not? Analysis?"

---

## 1. What the other thread said

The earlier note was `GMQ_Space_Travel_Look_Options_v1_2026-11-20.md`, about Exolune. It said three different things:
- **Could not: Exolune itself.** It is a C++ program for Windows gaming PCs. It does not run in a browser or on an iPad, and its licence forbids building a rival product from it.
- **Could: a small cousin of it.**
  - Choice B: living planets, drawn the way the game already draws, with a zoom down to the landing place.
  - Choice C: a real 3D fly-in.
- **Not yet: your own words were "not now".** The note's advice was B first, and C only if the moment of arriving turns out to matter to your students.

So it was never "should not, ever". It was "not that program, and not yet".

## 2. What Atlantis is [Source: its README and code; I read them, I did not run it]

- **A city you fly through in a browser.** It is one HTML file of 96 KB, with no images and no libraries. Everything is made by code when the page opens.
- **It is the same kind of thing GMQ is:** one file, in a browser, with touch controls. Hold a finger down to fly, and slide it to steer.
- **It is free to reuse.** The MIT licence allows its code to be used, with credit.
- **It was built with Claude Code** from a prompt, an art bible and eight concept pictures. A second Claude, which saw only the art bible, the concept pictures and the renders, reported what looked wrong.
- **It has nothing to do in it.** Like Exolune, it is a place, not a game.

## 3. Can it run on your students' iPads?

**Maybe. That is the one thing to check first.**
- **Atlantis needs WebGPU,** a newer way for a web page to use the graphics chip. It has no fallback: without WebGPU, it shows an error.
- **On an iPad, WebGPU comes only with iPadOS 26** (Safari 26, autumn 2025), as far as I know. An iPad that has not been updated, or is too old to update, cannot open it at all.
- **WebGL 2,** the older way, works on any iPad updated to iPadOS 15 (2021) or later. A GMQ fly-in should use WebGL 2, so that every child in the class sees it.
- **Atlantis is heavy.** It draws shadows, reflections and glowing light every frame. On a cheap phone, its lowest setting runs at about 28 frames a second, on a small screen. A GMQ fly-in would be much lighter: one planet, clouds, a landing place, about 10 seconds.
- **I could not test any of this here.** There is no iPad or graphics chip in this workspace.

## 4. Three ways to fly into a planet

| | What a child sees | What it serves | Cost |
|---|---|---|---|
| B | **Living planets.** Each planet is a lit ball with slow clouds. On landing, the picture zooms in until the landing place fills the screen. | arriving feels like arriving | an evening or two; works on every iPad |
| C | **A 3D arrival.** The planet grows, you pass through its clouds, and come out over the landing place. Then the game's own picture takes over. Under 10 seconds, and a tap skips it. | the same, more strongly | several sessions for the first planet; a second kind of drawing code in the game |
| D | **A flight over the planet you saved,** after its quest is done. Voltara's streets are lit exactly as your power plan lit them. Xylophora's colony stands, with the floors you designed, and the paths you laid. | **your maths made this.** The child sees their own decisions as a world. | like C, plus one more session per planet |

**D is the one I would argue for.** You asked for a world where the maths is not the reason for the experience, "but the math is necessary to advancing and complete things and find things" [Source: Marc, 2026-11-17]. A flight over the colony a child designed shows that the maths built something real. A fly-in on every landing is only decoration.

## 5. How Atlantis would help, and how it would not

- **Help: the method.** Atlantis shows how a whole world can be built:
  - in one file
  - from code, with no images
  - with detail levels for weaker machines
  - with a second check that compares every picture to an art bible
  - Your planets have their own art bibles already: your descriptions of rainbow skies, square leaves and striped suns.
- **Help: its code, if we want it.** The MIT licence allows us to use some of it, with credit.
- **No help: its city.** Atlantis is someone else's place. Your rule is that every place is original or yours, so GMQ would draw Voltara, Chronosia and Xylophora, never Atlantis.

## 5b. How it was made, and what we can borrow even without 3D

[Source: the author's own description, which Marc pasted, and `prompt.txt` in the repository, read as reference only]

**The prompt is the useful part.** It is a brief in a clear shape:
- **Ranked priorities** for when goals conflict: looks first, then smooth frames, then file size. You already rank yours: learning and the child's experience first.
- **Hard limits:** no game engine, no image files, one HTML file. GMQ already works this way.
- **A target machine, and a number to meet on it:** a frame time on the author's own PC. **For GMQ, the target is your class's iPads.** We do not know their models or iPadOS versions yet, which is why the test page comes first.
- **Fixed review shots:** six camera positions, pictured every time, so changes can be compared. GMQ checks three screen sizes. Fixed shots of each planet would be a good addition.
- **Depth before breadth:** get one building looking right before filling the city.
- **A stop rule:** if a fault survives three real attempts to fix it, write it down as a known limit and move on.
- **An independent critic.** A separate Claude sees only the art bible, the reference pictures and the screenshots. It never sees the code or the builder's reasoning, and it lists what is wrong.

**The independent critic is the idea I would borrow first, for everything, not only 3D** [Proposal]:
- You said you should not have to find the faults yourself. Today I check my own work. The builder checking itself misses what it expects to see.
- **A GMQ critic would see only:**
  - the CLAUDE.md checklist
  - your rules and your words about the place
  - screenshots at the three sizes
  - It would never see the code or my reasoning.
- It reports what a child would trip on: words that do not match the picture, something that gives the answer away, a question that can be read two ways.
- **The cost** is more tokens on each check. Like the Atlantis prompt, it runs at milestones, not after every small edit.

**What does not carry over:**
- the look's source (accounts given under hypnosis)
- the photoreal goal: GMQ is drawn, on purpose
- the gaming-PC target

## 6. What could prove this wrong

- **A free flight can swallow a lesson.** Children may fly instead of working. That is why D comes after a quest, and could have a time limit.
- **Steering is hard for some eight-year-olds,** and fast flight on a screen can make some children feel sick. D could be a slow, guided flight that the child steers only a little.
- **It is not maths.** Every session spent on it is a session not spent on Lengthar, the world web, or the four standards with nothing.
- **Testing is harder.** The game's checks take pictures in a browser with no graphics chip. 3D drawing needs a different kind of check.

## 7. A cheap first step, if you want one

**A 2-minute test on the class iPads** [Proposal]:
- I make a small test page on the preview site (about an hour).
- A child opens it on their iPad, and it says three things:
  - whether this iPad has WebGPU
  - whether it has WebGL 2
  - how smoothly it draws a spinning planet with clouds, in frames a second
- Then we know which iPads can run which choice, before anything is built.

## 8. Your decisions

1. Make the test page?
2. If the iPads can run it: B, C or D, and when? Before or after Lengthar and the world web?
3. Use an independent critic (section 5b) at each milestone, for all GMQ work?
