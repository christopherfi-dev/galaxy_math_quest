# Note — a space travel view, later — 2026-11-16

**Stage:** a note for the future. Nothing is decided or built.
**Why:** you saw "Abyssal Garden" online and liked it as a model for travelling through space and choosing where to go. It is saved in `reference/third-party/abyssal-garden/`.

---

## What Abyssal Garden is [Source: its README]

- An underwater world you fly through in a browser.
- One HTML file of about 96 KB. No images, no models and no sound files. Code draws everything.
- It uses WebGPU directly, with no game engine.
- It is by Maksymilian Dendura, under the MIT licence. You may use and change it, if the licence notice stays with it.
- It includes `prompt.txt`: the brief its author gave an AI to build it.

## What is useful for GMQ [Proposal]

1. **The brief is the most useful part.** `prompt.txt` shows how to ask for a scene like this: priorities in order, hard limits, a target device, and two tests it must pass. A GMQ space scene would need its own brief in that shape.
2. **Space is an easier scene than a kelp forest.** Stars, six galaxies and a few planets are simple shapes. The underwater scene draws about two million leaves.
3. **The world map is ready for it.** Every place already has a `position` line (galaxy / planet / landmark) for a later 3D layer.
4. **Mini battles fit travel.** An asteroid field on the way to Voltara is an interruption that makes sense.

## What to check first

- **Your class iPads.** The README says desktop Chrome or Edge, and calls touch "experimental". A low-end phone ran it at about 20 frames a second on Low. **Test:** open `index.html` on one student iPad. If it fails or stutters, a simpler 2D star map is the safer plan.
- **"Everything is typed."** That was your rule for the MUD (MUD handoff §1). A fly-through view moves by finger or keys. **Options:**
  - **(a)** The view only shows. The student still types "fly to Voltara", and the camera flies there.
  - **(b)** The student steers freely between planets, and types once they land.
  - (a) keeps your rule. (b) is more like the game you saw.
- **Reuse or rewrite.** Its world and shaders are all underwater. A space scene would reuse its method and its controls, not its content.

## Where it sits in the order of work

After the text world runs. The text world does not depend on it.
