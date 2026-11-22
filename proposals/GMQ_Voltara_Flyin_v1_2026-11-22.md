# The Voltara fly-in, version 1: shot list and notes

**Date:** 22 November 2026. **From:** the fly-in thread. **For:** Marc.
**Phase 1** of `HANDOFF_Voltara_Flyin_2026-11-21.md`: the arrival at Planet Voltara, as its own page. **The game file is not touched.**
Everything here is **[Proposal]** unless it says [Source].

- **The page:** `prototypes/voltara_flyin.html`. The same file is copied to `docs/flyin/index.html` for the iPads.
- **The link, once it is on the main branch:** https://christopherfi-dev.github.io/galaxy_math_quest/flyin/
- **Its test:** `checks/flyin_test.js`.

---

## 1. The story reason

The cut scene shows Voltara's problem before the quest begins. Voltara's message said: "the city goes dark at night now… even the river lights are out" [Source: the game's `VMSG`]. So the child sees the city's lights go out from above, and then lands beside the river with the dark city across it.

No words are shown in the scene. The pictures carry it. (A caption is an open question: section 7.)

## 2. The shot list, as built

The scene is 9.5 seconds. Then a half-second fade hands over to the game: 10 seconds in all. **A tap anywhere skips it, at any moment.**

| Time | What the camera sees |
|---|---|
| 0 – 1.5 s | Space, as the game draws it. Voltara ahead: the same ball as the game's space view, in the same place. The ship flies at it. |
| 1.5 – 3 s | The dive. The planet grows past the edges of the picture. The camera heads for the night side. |
| 3 – 4.4 s | Over the night side. Glowing trees glow in clumps. The Sparkling River sparkles. The city sits beside it, three streets in their three colours (Home Street, Market Street, Factory Row). Its windows flicker and go out, block by block. By 4.3 s the city is dark. |
| 4.4 – 6.4 s | Down through cotton-candy clouds: pink, blue and white, the game's own cloud shape. At 5.5 s the picture is all cloud; behind it the scene changes from space to sky. |
| 6.4 – 9 s | Out over the Sparkling River, looking down. The ship rides just ahead, on its flame. Glowing trees below; the dark city far across the river. The camera comes down and tips up to the horizon. |
| 9 – 9.5 s | The ship stands on the Landing Meadow. The picture is now the game's own meadow picture. |
| 9.5 – 10 s | The hand-over: the fly-in fades out over the game's meadow. |

**Changed from the handoff's table, and why:**
- The handoff gave the clouds 5–7 s and the descent 7–10 s. I moved the clouds a little earlier (4.4–6.4 s). The descent is the part that must end softly on the game's picture, and it needed the extra half second.
- **The meadow is at dusk, not night** [Source: the game's `vSky`: indigo at the top, through pink and orange to pale green at the horizon, with stars only at the top]. So the story is: we cross the night side, where the city has gone dark, and land at the edge of night.

**The short one** (for later landings, if you want it): the last 2 seconds only, from a cloud-white start. It is one setting.

## 3. How it is made

- **WebGL 2. No library. No picture, sound or video files.** Everything is drawn by code, once, when the scene is set up.
- **The planet from orbit** is one small program on the graphics chip. It uses the colours and the curved bands of the game's own `voltaraBall`.
- **The landing is the game's own meadow.** I copied the shapes and colours of `vSky`, `vFar`, `farCity`, `towerDraw`, `drawMeadow`, `alienTree`, `fluff`, `rocket` and `frontMeadow` into the page. Each thing is painted once as a flat card. The cards stand in 3D, like a paper theatre, at the distances the game's picture implies. The camera flies down to the exact view the game draws. **That is why the last frame matches: it is the same picture, seen from the same place.**
- **It looks drawn because it is the game's drawing**, not a 3D model of it.
- **Size:** the piece the game would use is about 46 KB (the target was under 60 KB). The whole page is about 50 KB.
- **Nothing is made anew in a frame.** One texture, one buffer, three small programs.

## 4. For the older iPad

[Source: `proposals/GMQ_Flyin_iPad_Results_2026-11-22.md`: the older iPad drew the test's sharp picture at 45 and the small picture at 60 frames a second.]

- **It never starts at the sharpest size.** It starts at 1.5 dots for each screen point (the iPad's screen has 2). That is a little over half the dots of the test page's "sharp picture".
- **It drops by itself.** If the last 16 frames average slower than about 45 a second, it steps down: 1.5, then 1.25, then 1, then 0.75. It never steps back up in the middle of a scene, so the picture does not flicker between sizes.
- **The heavy part is short.** The planet program fills the screen only from about 2 to 5.5 seconds. The landing is cheap: flat cards.
- **The numbers after the scene** show the real speed: frames a second, the slowest frame, the picture size it ended on, and how long set-up took. **Those are what I need from the older iPad, held sideways.**

**I have not seen it run on any iPad.** This machine draws WebGL in software, so its speed means nothing.

## 5. It never blocks the game

| If… | then… |
|---|---|
| the child taps | it ends at once (`skip`) |
| the device has no WebGL 2 | it ends at once, before drawing anything (`nowebgl`) |
| set-up takes longer than one second | it ends at once (`slowstart`) |
| the page is hidden, or the picture is lost | it ends (`hidden`, `lost`) |
| the browser stops drawing | a timer ends it at 10.45 seconds anyway |

In every case the game would simply do today's landing.

## 6. What I checked, and what I did not

**Looked at, as pictures:** the five review shots (0, 2, 5, 7 and 10 s) at the game's three picture sizes (748×598, 768×581, 338×485); sixteen moments in between; the page itself at 1080×700 (the older iPad sideways), 820×1180 and 390×760.

**`checks/flyin_test.js` passes.** It checks:
- it starts, and ends by itself on time, on four screens, and the last picture is the meadow
- a tap skips it at every second
- no WebGL 2, a slow set-up, a hidden page, a lost picture
- the short one
- an iPad turned in the middle
- Watch again
- no network
- the size

**Not checked:**
- **Speed on a real iPad.** Only you can.
- **Sound.** There is none.
- **The real hand-over.** The page cannot fade into the real game. I compared my last frame with the game's meadow picture side by side. The true fade can only be seen in Phase 2.
- **The game's own test suite.** Not run: I did not touch the game.

**Shortcuts I took:**
- The meadow's moving things (clouds, sparkles, fireflies, butterflies) run on the scene's own clock, not the game's. At the hand-over they will be in slightly different places than the game's. The half-second fade covers it.
- The rock is always in its first place, there are no dug holes, and the cadet is not shown. On a first landing that is right.
- The city can be painted lit (`lit`, `tower`), for landings after the quest, but I only checked that by eye, once.
- From the air, the land has soft patches and far glowing trees that fade away as the camera lands. They are not in the game's picture. They are there so the far bank is not an empty green slab from above.

## 7. Decisions for you

1. **Every landing on Voltara, or the full scene on the first landing and the two-second one after?** Both are built. It is one setting (`short`).
   - Full every time: 10 seconds on each landing. A child who lands five times in a lesson waits 50 seconds, or learns to tap.
   - **Recommended:** full on the first landing, the short one after. A tap skips either.
2. **Is the ship seen from outside, or from its cockpit window?** I built **outside**: the game's own ship, flying in and landing. A cockpit would be a window frame drawn over the same scene, and the child would not see their ship land. Outside is recommended. Changing it later is small.
3. **Music or sound, or silent?** It is silent now. The game's `beep` could mark the landing if Sound is on. Recommended: one soft landing beep, nothing else, until you want more.
4. **A caption?** For example "The city lights are going out…" for two seconds. It would help a child notice the story. It would also ask a Grade 3 reader to read during two seconds of fast pictures. Recommended: no caption; the game's own words after landing already say "the city across the river is dark".
5. **Phase 2: who wires it into the game, the main thread or this one?** See section 8. Recommended: the main thread, since it owns the game file. This thread hands over the piece and the note.

## 8. Phase 2, when you say so: how it would fit in (read only; nothing is done)

- **The piece:** everything between `GMQ FLY-IN: start` and `GMQ FLY-IN: end` in the page. One entry point: `GMQFlyin.play(canvas, opts, done)`.
- **It needs a canvas of its own,** laid exactly over the game's picture. The game's own canvas is a 2D canvas and cannot be shared.
- **The hook:** `land()`. Today it switches to the meadow at once. With the fly-in: `land()` does everything it does today first, so the game is already on the meadow and saved. Then the fly-in plays on top and fades out. If anything goes wrong, the meadow is already there.
- **The switch:** a Teacher checkbox like `hazOn`, kept as `gmq-flyin`, on by default. Off means today's landing.
- **Also skip it** when the device asks for less motion (the game's `calm`).
- **The game's tests must set `gmq-flyin` to `off`,** as they set `gmq-hazards`. These tests land on Voltara or use the Teacher shortcut:
  `chronosia_test.js`, `class_update_test.js`, `galactic_trade_test.js`, `mud_rats_test.js`, `number_pad_test.js`, `one_screen_test.js`, `small_keyboard_test.js`, `small_worlds_test.js`, `space_hazards_test.js`, `still_picture_test.js`, `street_signs_test.js`, `tap_words_test.js`, `voltara_quest_test.js`, `xylophora_test.js`.
  (The Teacher shortcut `goVoltara` does not call `land()`, so it would not play the scene. Tests that type or tap `land` would.)
- **In the game the piece can be smaller.** It could call the game's own drawing functions instead of carrying copies.
- **To make the hand-over exact,** the game can pass its own clock, so clouds and sparkles are in the same places.

## 9. The critic

See section 10 for the independent critic's review and what was done about it.
