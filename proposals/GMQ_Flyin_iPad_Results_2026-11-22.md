# The iPad test page: first results

**Date:** 22 November 2026. **For:** Marc and the fly-in thread (`HANDOFF_Voltara_Flyin_2026-11-21.md`, Phase 0).
**Page:** https://christopherfi-dev.github.io/galaxy_math_quest/flyin/test.html
**Source:** Marc ran it on three of his family's devices and sent photos [Source]. The photos are not kept in the repository.

## The numbers [Source: the photos]

| Device | System, browser | WebGL 2 | WebGPU | Small picture | Sharp picture | Hard test |
|---|---|---|---|---|---|---|
| Marc's iPhone | iOS 18.7; Safari 18.7 and Chrome 158 | YES | NO | 60 | 60 | 60 |
| An older iPad, bought used from the school. Marc: "an older model than what they use now". 10.2-inch screen (810 × 1080). | iPadOS 17.6; Chrome 148 | YES | NO | 60 | 45 sideways, 51 upright | 31 sideways, 36 upright |
| His daughter's iPad Pro, "from like six years ago". 12.9-inch screen (1024 × 1366). | iPadOS 26.7; Chrome 158 | YES | **YES** | 60 | 58 upright, 60 sideways | 60 |

- The slowest single frames: up to 42 ms on the older iPad and 56 ms on the iPad Pro. Elsewhere they were 17 to 25 ms.
- **Chrome on an iPad uses Safari's engine underneath,** so these numbers stand for Safari too.
- **Low Power Mode was not on:** the speeds were not all near 30.

## What they mean [Proposal]

1. **WebGL 2 works on all three, so the plan stands.** The fly-in uses WebGL 2, as the handoff says.
2. **WebGPU appears only on iPadOS 26.** The iPad Pro has it; the iPad on 17.6 does not. A WebGPU-only scene, like Atlantis, would leave out the older iPad, and probably many class iPads.
3. **The older iPad is the one to design for.**
   - At the sharp, full screen size it drew this simple picture at 45 to 51 frames a second. The four-layer hard test ran at 31 to 36.
   - A real 3D scene costs more than this flat picture in some ways and less in others. So, on weaker iPads, draw the fly-in at a lower picture size: the "Small picture" ran at 60. Use the sharp size only where it is smooth.
   - Drop the detail by itself when frames come slow, as the handoff says.
4. **The class iPads should be at least this good.** Marc says the older iPad is older than what his students use now. One class iPad is still worth testing before Phase 2.
5. **Test Phase 1 on the older iPad, sideways.** It is the slowest case seen so far.

## Small fixes for the test page (for the fly-in thread)

- On the older iPad held sideways in Chrome, the **Test again** button is half off the bottom of the screen. Chrome's tab bar takes room, and the page's own check did not catch this. The results and the photo line are still visible, so it does not block anything.
- The page says "What this iPad has" on an iPhone too. This hardly matters.
- When Safari hides the iPadOS number, say that Safari's own number is the iPadOS number.
