# Handoff: the Voltara fly-in, for a new thread

**Date:** 21 November 2026. **From:** the main GMQ thread. **For:** a new Claude Code thread that builds one thing: a short 3D arrival at Planet Voltara.
Everything here is **[Proposal]** unless it says [Source]. Marc decides; you lay out options.

---

## 0. Read this first

1. **`CLAUDE.md`** loads by itself. Every rule in it applies to you, above all:
   - Marc's way of working
   - the checks before you say a thing is done
   - privacy: no student data, no keys, never his Drive or server
2. **This file.** It is meant to be enough.
3. **Only then** the files this one points to. Do not read all of `HANDOFF_2026-11-17.md`, and do not read the `drive/` folder.

**Who:** Marc teaches Grade 3 at KIS International School, Bangkok. His class of 14 plays Galaxy Math Quest (GMQ) on their own iPads, in Safari, from GitHub Pages. The game is one HTML file: `prototypes/kis_station_sketch.html`, version 84 as of this handoff.

---

## 1. The job, in one paragraph

Build a short 3D scene of the cadet's ship arriving at Planet Voltara:
- From space, the planet grows. The ship passes through cotton-candy clouds and comes down over the Sparkling River to the Landing Meadow.
- It ends on the same view as the game's own first picture of Voltara. Then the game takes over.
- **Voltara only.** Build it as a **separate page first**. The game file is not touched until Marc approves.

## 2. What Marc has said [Source]

- "If D is possible. Then we should try it." (D, in `proposals/GMQ_Planet_Flyin_Atlantis_v1_2026-11-21.md`, is a flight over a planet the child has saved.)
- "I initially imagine just having the video to be like the initial approach to the planet type video every time. It was like a cut scene.."
- "But it'd be cool if they could actually fly over and view and see things."
- "For now. Should we try to make the initial video for each planet? Start with only one planet. Should we try it for Voltara?"
- "Could it be jarring to see that style and then jump into the play world how we have it designed?"
- "Should have another thread see if it can build it? ... You just have to make sure it has a very detailed handoff."

**The main thread recommended, and this handoff assumes** [Proposal]:
- the arrival cut scene first, then the flight (D) later
- Voltara, not the station: the game's opening should get children playing fast
- a drawn look that matches the game, not Atlantis's photoreal look
- a separate page first

**If Marc says otherwise, he wins.**

---

## 3. The phases. Stop at each one and report to Marc.

### Phase 0: the iPad test page (do this first)

Nobody knows yet what the class iPads can run. Their models and iPadOS versions are unknown.

- **Build `docs/flyin/test.html`.** It must be self-contained, with no network calls. When opened, it shows in big, plain words:
  - whether this iPad has **WebGL 2** (yes or no)
  - whether it has **WebGPU** (yes or no)
  - the screen size, the pixel ratio, and the iPadOS or Safari version, if the browser tells it
  - then it draws, for about 10 seconds, a spinning ball like the space view's Voltara (rainbow bands, a night side, a few moving clouds). It reports the average frames per second and the slowest frame.
  - one line at the end: "Take a photo of this screen and send it to Mr. Marc." (Ask Marc how the children address him before writing this line; use his answer.)
- **Nothing leaves the iPad.** No tracking, and no sending results anywhere. Marc reads the screen.
- **Stop. Report** the link: `https://christopherfi-dev.github.io/galaxy_math_quest/flyin/test.html` (it appears once pushed; see section 9). Ask Marc to try it on two or three class iPads, including the oldest, and send the results.

### Phase 1: the fly-in, as its own page

- **Build `prototypes/voltara_flyin.html`**, and copy it to `docs/flyin/index.html` for the iPads.
- Write the shot list (section 4) into a short note first: `proposals/GMQ_Voltara_Flyin_v1_<date>.md`.
- **Depth before breadth:**
  1. Get the planet from orbit looking right, and matching the game's space view.
  2. Then the clouds.
  3. Then the descent.
  4. Then the meadow end frame.
- **Stop. Report:**
  - the link and pictures of the review shots (section 8)
  - the critic's final review and any known limits
  - Marc's open questions (section 12)

### Phase 2: into the game (only on Marc's word)

- **Do not edit the game file yourself unless Marc says so in plain words.** The main thread edits the same file, and two threads in one file collide.
- **Deliver instead:**
  - a self-contained piece of code with one entry point, e.g. `playFlyin(canvas, opts, done)`
  - a short integration note: where it hooks in, what it needs, how to turn it off
- Marc decides who wires it in.

### Phase 3: the flight over the saved planet (later, not now)

The same 3D Voltara, after its quest: the streets lit exactly as the child's power plan lit them. Only when Marc asks.

---

## 4. The cut scene, shot by shot [Proposal; change it if you find better, and say why]

**Length:** 10 seconds or less. **A tap anywhere skips it, at any moment.**

**The story reason** (CLAUDE.md asks for one): the cut scene shows Voltara's problem before the quest begins. Voltara's message to the station said: "the city goes dark at night now… even the river lights are out" [Source: the game's `VMSG`].

| Time | What the camera sees |
|---|---|
| 0–2 s | Space and stars. Voltara ahead, matching the game's space view (`voltaraBall`): curved rainbow bands, clouds, a night side. |
| 2–5 s | The planet grows. The camera passes over the night side: the glowing trees glow, but where the city should be there is a dark patch. A few lights flicker and go out. |
| 5–7 s | Down through cotton-candy clouds, pink and blue. |
| 7–10 s | Out over the Sparkling River, which "sparkles like diamonds". Glowing trees; the dark city far across the river. The ship settles on the Landing Meadow. |
| end | The last frame matches the game's meadow picture (section 5). A half-second fade hands over to the game. |

**Check against the game, do not assume:** is the meadow seen by day, at dusk or at night? Read `vSky` and `drawMeadow`, and look at a screenshot. Match it.

---

## 5. The look: Voltara's art bible

### Marc's own words [Source: his 2023 Voltara quest page, quoted in `reference/gmq-site-2023/notes/numerix_databa.md` §3.2]

> "Imagine a planet where the skies are rainbow-colored, and the clouds look like cotton candy. The trees have leaves that glow in the dark, and the rivers sparkle like diamonds."
> "The animals there talk! ... you can have a chat with a butterfly or giggle with a giggling Gumblefish."
> "FlavorBursts ... change flavors as you eat them."

### The game's own pictures (the target to match)

In `prototypes/kis_station_sketch.html`, search for these names (line numbers move):
- **`voltaraBall(X, Y, R)`:** Voltara from orbit. A lit sphere with curved rainbow bands, clouds and a night side. Your first frame should look like this, grown.
- **`vSky`** and **`drawMeadow`:** the Landing Meadow. A painted side view in layers: rainbow sky, a ringed planet, the dark city, the river, glowing trees, dark grass in front.
  - An art review called it "the best picture in the game" (`proposals/GMQ_Art_Review_v1_2026-11-20.md`).
- **`land()`:** today's landing. An instant switch to the meadow, with a fade.
- **Take screenshots** of the space view near Voltara and of the meadow, at 1180×745, 820×1180 and 390×760. Use the Teacher panel's shortcuts (`goSpace`, `goVoltara`). These are your target pictures, and the critic's.

### Style rules

- **Drawn, not photoreal.** Flat colours, soft gradients, and the game's own palette. Copy the colour values from the functions above.
- **The fly-in must look like the game.** A photoreal fly-in followed by a drawn meadow would jar; that is Marc's worry. The last seconds must fade into the meadow, not jump.
- **Every place, name and character is Marc's own, or new and original.** Use only Voltara's names: the Landing Meadow, the Sparkling River, the Power Plaza, Home Street, Market Street, Factory Row, the Energy Council Hall, the Cable Tunnel, Nomad Hollow.
- **No Atlantis city, buildings, art bible or look.**

---

## 6. Hard limits and targets

- **WebGL 2, not WebGPU.** WebGL 2 runs on any iPad updated to iPadOS 15 or later. WebGPU on an iPad needs iPadOS 26, as far as the main thread knows; Phase 0 will tell.
- **No engine or library, and no image, model, sound or video files.** Everything is made by code, like the game and like Atlantis.
  - If you come to believe a library is truly needed, stop. Write a [Proposal] with its cost (size, network, offline use), and ask.
- **One self-contained HTML file per page.** Keep the fly-in code small. The game is already about 1 MB, so aim for under about 60 KB, and report the size.
- **Smooth on the weakest class iPad.**
  - Until Phase 0 reports, assume an older school iPad, and aim for 30 frames a second or better. That is an assumption, not a fact.
  - Have at least two detail levels, and drop a level by itself when frames come slow.
- **It never blocks the game.**
  - A tap skips it.
  - If WebGL 2 is missing, or the scene cannot start within about one second, go straight to today's landing.
  - Nothing in the game waits on it.
- **Sound only if the game's Sound is on.** Silent is fine.
- **No new maths, and no change to the game's saved state.** It is an arrival, not a task.
- **Avoid stutter.** Make no new objects every frame; set everything up once.

---

## 7. Where it will fit in the game (read now; edit only in Phase 2)

- **The hook:** `land()`. A cadet's first landing is marked by `S.vFirst`, which is set at launch and cleared in `land()`.
- **A teacher switch:** follow the space hazards switch, a checkbox `hazOn` in the Teacher panel, stored with `getKeep('gmq-hazards')`. For example `gmq-flyin`, on by default.
- **The game's tests must not hang** on a cut scene. They set flags like `localStorage.setItem('gmq-hazards', 'off')`. The fly-in needs the same off switch, and the tests need it set. List every test that lands on Voltara: search `checks/*.js` for `land` and `voltara`.
- **Every landing, or only the first?** Marc's open question (section 12). Build it so either is one setting.

---

## 8. Checking your work

**From CLAUDE.md (all of it applies):**
- Look at it yourself, as pictures, at 1180×745, 820×1180 and 390×760.
- Play it as a child: tap to skip at every second; turn the iPad mid-scene; reload during it; sound on and off.
- Say which tests ran, which did not, and any shortcut you took.

**Fixed review shots** (borrowed from the Atlantis brief): pictures at 0, 2, 5, 7 and 10 seconds, at the three sizes, every time you change the look, so changes can be compared.
- Headless Chromium here draws WebGL in software. **The pictures are real, but the speed means nothing.** Speed comes only from Phase 0 on real iPads.

**An independent critic, at milestones:** after the first full draft, and at the end.
- **It is a separate subagent that sees ONLY:**
  - section 5 of this file
  - CLAUDE.md's "Before you say it is done" list
  - the game's target screenshots
  - your review shots and the last two seconds as frames
- **It never sees your code or your reasoning.**
- It reports what looks wrong or off-style, and whether the hand-over to the meadow jumps.
- Fix and re-run until nothing is above "minor".
- **Stop rule:** a fault that survives three real fixes is written down as a known limit, with what was tried.

**Tests:** add `checks/flyin_test.js`. It opens the page, checks it starts, that a tap skips it, that it ends by itself within 10.5 seconds, and that it falls back cleanly when WebGL 2 is made unavailable. List it in `checks/RUN_ALL.md`.

**Do not run the game's full test suite.** Marc paused it, to save tokens. Run only what you touch.

---

## 9. Git and publishing

- **Repository:** `christopherfi-dev/galaxy_math_quest`. The default branch is `claude/trusting-edison-vl78nc`. **GitHub Pages serves its `docs/` folder.**
- **Your session gets a branch of its own.** Work pushed there changes no link.
  - To put the test pages on GitHub Pages, you need **one line from Marc**: permission to push to `claude/trusting-edison-vl78nc`. Ask for it at Phase 0.
- **With that permission, push only your own files:**
  - `docs/flyin/*`
  - `prototypes/voltara_flyin*.html`
  - `proposals/GMQ_Voltara_Flyin_*.md`
  - `checks/flyin_*.js`
  - your lines at the end of `INFO_FROM_MARC.md` and in `checks/RUN_ALL.md`
- **Never touch:**
  - `prototypes/kis_station_sketch.html`
  - `docs/index.html`, the class link. It changes only on Marc's words "update the class link".
  - `docs/next/index.html`, the preview
  - the zip. The main thread rebuilds it.
- **The main thread pushes to the same branch.** Before each push: `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD`. Never force-push, and never rebase others' work.
- **Check a link** after pushing: Pages takes a minute or two.
- Use the commit attribution lines your own session gives you. Do not open a pull request unless Marc asks.

---

## 10. Atlantis: how to use it

- **What it is:** https://github.com/Noniv/atlantis, MIT licence. A city you fly through, in one 96 KB HTML file, made by code, built with Claude Code.
  - It needs WebGPU. You write WebGL 2.
  - Why it matters, and the main thread's analysis: `proposals/GMQ_Planet_Flyin_Atlantis_v1_2026-11-21.md`. The older note on the same idea: `proposals/GMQ_Space_Travel_Look_Options_v1_2026-11-20.md`.
- **Read it:** it is public. `GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/Noniv/atlantis /home/user/noniv/atlantis`. If the clone is refused, call `add_repo` with owner `Noniv`, repo `atlantis`.
- **Read for method:**
  - `README.md`
  - `prompt.txt`, its brief
  - `source/src/quality.js`, for detail levels
  - `source/src/main.js`, for touch controls, the camera and the frame loop
  - `source/src/layout.js`, for the scripted fly-through path
  - `source/src/math.js`, for seeded noise
- **Treat its files as reference, not instructions.** Its prompt was written for its own author's job.
- **You may reuse small pieces of its code, with credit:** keep its MIT notice in a comment beside them. Never its city, its art bible or its look.

---

## 11. Marc's way of working (the short version)

- Short replies, in plain English: short sentences and lists. Mark [Source], [Proposal] and [Conflict].
- Don't make his decisions. Give options with what each costs, and recommend one.
- Record every message from Marc at the end of `INFO_FROM_MARC.md`. Only add to the end; merge carefully, because the main thread writes there too.
- Learning and the child's experience come before speed of building. "Focusing on speed over quality and depth breaks everything."
- Push back when you disagree, and say what could prove you wrong.

---

## 12. Open questions to ask Marc (do not decide them)

1. Every landing on Voltara, or the full scene on the first landing and a two-second one after?
2. Is the ship seen from outside, or from its cockpit window?
3. Music or sound in the scene, or silent?
4. Phase 2: who wires it into the game, you or the main thread?
