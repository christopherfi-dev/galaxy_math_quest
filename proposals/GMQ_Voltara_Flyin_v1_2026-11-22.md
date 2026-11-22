# The Voltara fly-in, version 1: shot list and notes

**Date:** 22 November 2026. **From:** the fly-in thread. **For:** Marc.
**Phase 1** of `HANDOFF_Voltara_Flyin_2026-11-21.md`: the arrival at Planet Voltara, as its own page. **The game file is not touched.**
Everything here is **[Proposal]** unless it says [Source].

- **The page:** `prototypes/voltara_flyin.html`. The same file is copied to `docs/flyin/index.html` for the iPads.
- **The link, once it is on the main branch:** https://christopherfi-dev.github.io/galaxy_math_quest/flyin/
- **Its test:** `checks/flyin_test.js`.

---

## 1. The story reason

The cut scene shows Voltara's problem before the quest begins. Voltara's message said: "the city goes dark at night now… even the river lights are out" [Source: the game's `VMSG`]. So the child sees the city's windows go out from above, and then lands beside the river with the dark city across it.

No words are shown in the scene. The pictures carry it. (A caption is an open question: section 8.)

## 2. The shot list, as built

The scene is 9.5 seconds. Then a half-second fade hands over to the game: 10 seconds in all. **A tap anywhere skips it, at any moment.**

| Time | What the camera sees |
|---|---|
| 0 – 1.5 s | Space, as the game draws it: the same stars, the same Voltara in the same place, the trade beacon, the ship at the game's angle. The ship flies at the planet. |
| 1.5 – 3 s | The dive. The planet grows past the edges of the picture. The camera heads for the night side, to the spot where the game shows the city's small lights. The trade beacon is left behind. |
| 3 – 4.5 s | Over the night side. **The city is the same skyline the child will see from the meadow:** twelve dark towers, with the three streets' colours on their roofs (Home Street, Market Street, Factory Row). Its windows are lit. They flicker and go out, one by one. By 4.5 s none is left. The Sparkling River runs in front. Glowing trees dot the dark land. |
| 4.4 – 6.4 s | Down through cotton-candy clouds: pink, blue and white, the game's own cloud shape. At 5.5 s the picture is all cloud; behind it the scene changes from space to sky. |
| 6.4 – 9 s | Out over the Sparkling River, looking down. The ship comes down ahead and to the left, on its flame. Glowing trees below; the dark city far across the river. The camera comes down and tips up to the horizon. |
| 9 – 9.5 s | The ship stands on the Landing Meadow. The picture is now the game's own meadow picture. |
| 9.5 – 10 s | The hand-over: the fly-in fades out over the game's meadow. |

**Changed from the handoff's table, and why:**
- The handoff gave the clouds 5–7 s and the descent 7–10 s. I moved the clouds a little earlier (4.4–6.4 s). The descent must end softly on the game's picture, and it needed the extra half second.
- The handoff said "where the city should be there is a dark patch". I show the city itself, lit, and then going dark. The critic's first review found that a patch (and my first try, a grid of houses) did not read as the city across the river. A child now sees the same skyline twice: going dark from the air, then dark from the meadow.
- **The meadow is at dusk, not night** [Source: the game's `vSky`: indigo at the top, through pink and orange to pale green at the horizon, with stars only at the top]. So the story is: we cross the night side, where the city has gone dark, and land at the edge of night.

**The short one** (for later landings, if you want it): the last 2 seconds only, from a cloud-white start. It is one setting.

## 3. How it is made

- **WebGL 2. No library. No picture, sound or video files.** Everything is drawn by code.
- **Space and the planet** are one small program on the graphics chip. It uses the colours, the curved bands, the eleven drifting clouds and the swirls of the game's own `voltaraBall`, and the night colours of the game's `spaceBack`.
- **Everything else is the game's own drawing.** I copied the shapes and colours of `spaceBack`'s stars, `rocket`, the trade beacon, `farCity`, `towerDraw`, `vSky`, `vFar`, `drawMeadow`, `alienTree`, `fluff` and `frontMeadow` into the page. Each thing is painted once as a flat card, **at this picture's own size and with the game's own line weights**.
- **For the landing the cards stand in 3D, like a paper theatre,** at the distances the game's picture implies. The camera flies down to the exact view the game draws. **That is why the last frame matches: it is the same picture, seen from the same place.**
- **It looks drawn because it is the game's drawing**, not a 3D model of it.
- **Size:** the piece the game would use is 52.5 KB (the target was under 60 KB). The whole page is 59 KB.
- **Nothing is made anew in a frame.** One texture, one buffer, three small programs. The cards are painted again only if the picture changes size (an iPad turned).

## 4. For the older iPad

[Source: your photos of the test page, and `proposals/GMQ_Flyin_iPad_Results_2026-11-22.md`. The older iPad, sideways: window 1080 × 690; the small picture ran at 60 frames a second, the sharp one at 45, the hard test at 31.]

- **It does not start at the sharpest size.** It starts at 1.5 dots for each screen point (the iPad's screen has 2). That is a little over half the dots of the test's "sharp picture".
- **It steps down by itself.** If the last 16 frames average slower than about 45 a second, it steps down: 1.5, then 1.25, then 1, then 0.75. It does not step back up while things move, so the picture does not flicker between sizes.
- **It does not shrink for nothing.** If two steps down bring no gain, the browser is holding the speed (Low Power Mode holds 30 frames a second). Then it steps back up and stays.
- **The last 0.7 seconds are drawn as sharp as the screen,** unless the iPad was already struggling. By then almost nothing moves and the picture is cheap to draw. This makes the hand-over to the game's sharp picture clean.
- **The heavy part is short.** The planet program fills the screen only from about 2 to 5.5 seconds. The landing is cheap: flat cards.
- **In the game it will be lighter than on this page.** The game's picture on that iPad is about 674 × 553 points, about half the page's full window.
- **The numbers under the picture after the scene** show the real speed: frames a second, the slowest frame, the picture size it ended on, and how long set-up took. **Those are what I need from the older iPad, held sideways.**

**I have not seen it run on any iPad.** This machine draws WebGL in software, so its speed means nothing. Set-up took about 50 ms here; on the older iPad I expect a few times that, and the page will say.

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

**Looked at, as pictures:**
- the five review shots (0, 2, 5, 7 and 10 s) at the game's three picture sizes (748×598, 768×581, 338×485)
- about thirty moments in between, and the night-city scene at all three sizes
- the first and last frames beside the game's own pictures, also at an iPad's real sharpness (two dots for each point)
- the page itself at 1080×690 (the older iPad's window sideways), 810×960, 1366×892 and 320×634 (the windows in your photos)

**`checks/flyin_test.js` passes.** It checks:
- it starts, and ends by itself on time, on four screens, and the last picture is the meadow
- a tap skips it at every second
- no WebGL 2, a slow set-up, a hidden page, a lost picture
- the short one
- an iPad turned in the middle
- Watch again
- no network
- the size

**`checks/flyin_testpage_test.js` passes** (the iPad test page, with its fixes).

**Not checked:**
- **Speed on a real iPad.** Only you can.
- **Sound.** There is none.
- **The real hand-over.** The page cannot fade into the real game. I compared my first and last frames with the game's pictures side by side. The true fade can only be seen in Phase 2.
- **The game's own test suite.** Not run: I did not touch the game.

**Shortcuts and known limits:**
- **The moving things run on a clock that starts at zero** on this page: clouds, moons, sparkles, fireflies, butterflies, the FlavorBursts' colours. So in the comparison pictures they are in other places than in the game's. The piece takes the game's clock as a setting (`clock`); with it they carry on from where the game has them. **That is built but untested**, because it needs the game.
- **The game's picture box is a little shorter in space than on the meadow** on a phone (460 against 485 points: the words under it take more room). If the fly-in is laid over the meadow's box, its first frame sits about 12 points lower than the game's last space frame on a phone. On the iPad sizes I measured no difference. Phase 2 decides how to lay it.
- **"Even the river lights are out" is not shown.** The Sparkling River still sparkles at night. The meadow has no river lamps to put out, and I did not invent any.
- **The rock is always in its first place, there are no dug holes, and the cadet is not shown.** On a first landing that is right.
- **The city can be painted lit** (`lit`, `tower`), for landings after the quest. I checked that by eye, once.
- **From the air, the land has soft patches and the river has glints** that fade away as the camera lands. They are not in the game's picture. They are there so the land is not an empty green slab from above.
- **On a screen with one dot for each point** (not an iPad), the last frame is a little softer than the game's.
- **I did not read all of Atlantis.** I read only its detail-level file and the hooks of its frame loop, for method. I did not read its README, its brief or its other files. I reused none of its code.

## 7. The independent critic

A separate reviewer saw only the art rules, the done-list, the game's own pictures and my pictures. It never saw the code or my reasoning.

**Round 1** (the first full draft): no blocker; six findings above minor. All six were taken:

| Its finding | What I did |
|---|---|
| The night-side city was "a grid in a box": it read as an array to count, not as the city across the river | The city is now the meadow's own skyline, with its windows going out |
| The change from 2 s to 3 s was not in its pictures | It is one zoom; I gave it the frames |
| The last frame was softer than the game's; trunk bases were cut; grass lay over the rock | Every card is now painted at the picture's own size with the game's line weights; trunks and rock are right |
| On the phone the tower was squeezed and pale | The tower is now drawn from lines and a round lamp, as the game does |
| The start was not the game's picture: other clouds on the planet, no trade beacon, another ship angle, other stars, dark specks | The planet's clouds, the stars, the beacon and the ship's angle are now the game's; the specks were a fault of mine and are gone |
| The phone start was a different height | That is the game's own picture box (see the limits above); at the game's height it matches |

**Round 2** (the same reviewer, new pictures): **"Nothing above MINOR remains."** It measured the last frame against the game: every fixed thing within half a pixel at all three sizes, colours within 1–2 levels.

Its minors, and what happened to each:
- **Taken:** the glowing-tree dots were brighter than the windows (now fewer and dimmer, and none in front of the city); the tower's legs were too thin (now the game's widths); the top of each trunk lacked the game's soft light (added); the ship sat on a building at 2.6 s (it is gone into the planet before the city shows); far lights showed as blocks at 2.2 s (they fade sooner); the pale path on the grass showed as an oval from above (it shows only at the very end); the city was lit only briefly (the windows now stay lit about a quarter second longer).
- **Left, written down as limits:** the river stays lit; from high up the far bank is a wide green plain and the buildings lean outward (true perspective on flat art; it called both taste); the ship looks small beside the trees while high and bigger once landed.
- **I checked these last fixes myself, as pictures.** The critic has not seen them.

## 8. Decisions for you

1. **Every landing on Voltara, or the full scene on the first landing and the two-second one after?** Both are built. It is one setting (`short`).
   - Full every time: 10 seconds on each landing. A child who lands five times in a lesson waits 50 seconds, or learns to tap.
   - **Recommended:** full on the first landing, the short one after. A tap skips either.
2. **Is the ship seen from outside, or from its cockpit window?** I built **outside**: the game's own ship, flying in and landing. A cockpit would be a window frame drawn over the same scene, and the child would not see their ship land. Outside is recommended. Changing it later is small.
3. **Music or sound, or silent?** It is silent now. The game's `beep` could mark the landing if Sound is on. Recommended: one soft landing beep, nothing else, until you want more.
4. **A caption?** For example "The city lights are going out…" for two seconds. It would help a child notice the story. It would also ask a Grade 3 reader to read during two seconds of fast pictures. Recommended: no caption; the game's own words after landing already say "the city across the river is dark".
5. **Phase 2: who wires it into the game, the main thread or this one?** See section 9. Recommended: the main thread, since it owns the game file. This thread hands over the piece and the note.

## 9. Phase 2, when you say so: how it would fit in (read only; nothing is done)

- **The piece:** everything between `GMQ FLY-IN: start` and `GMQ FLY-IN: end` in the page. One entry point: `GMQFlyin.play(canvas, opts, done)`. Its settings are listed at the top of the piece.
- **It needs a canvas of its own,** laid exactly over the game's picture. The game's own canvas is a 2D canvas and cannot be shared.
- **The hook:** `land()`. Today it switches to the meadow at once. With the fly-in: `land()` does everything it does today first, so the game is already on the meadow and saved. Then the fly-in plays on top and fades out (`fade`). If anything goes wrong, the meadow is already there.
- **Pass the game's clock** (`clock: tNow`), the ship's place on the space map (`sp`), and whether the beacon is open (`beacon`), so the first frame is the game's own picture and the moving things carry on.
- **The switch:** a Teacher checkbox like `hazOn`, kept as `gmq-flyin`, on by default. Off means today's landing.
- **Also skip it** when the device asks for less motion (the game's `calm`).
- **Tell the child it can be skipped,** in the game's words box: for example "Tap to skip."
- **The game's tests must set `gmq-flyin` to `off`,** as they set `gmq-hazards`. These tests land on Voltara or use the Teacher shortcut:
  `chronosia_test.js`, `class_update_test.js`, `galactic_trade_test.js`, `mud_rats_test.js`, `number_pad_test.js`, `one_screen_test.js`, `small_keyboard_test.js`, `small_worlds_test.js`, `space_hazards_test.js`, `still_picture_test.js`, `street_signs_test.js`, `tap_words_test.js`, `voltara_quest_test.js`, `xylophora_test.js`.
  (The Teacher shortcut `goVoltara` does not call `land()`, so it would not play the scene. Tests that type or tap `land` would.)
- **In the game the piece can be smaller.** It could call the game's own drawing functions instead of carrying copies.
