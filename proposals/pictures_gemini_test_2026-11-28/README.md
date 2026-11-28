# Gemini test, 28 November 2026

Made by Marc with Google Gemini in about one minute, from the main thread's three prompts (in `INFO_FROM_MARC.md`, 28 November). Saved here as WebP (2730 × 1536); Gemini gave PNGs of about 5 MB each.

1. `1_docking_bay_power_off.webp`: Tally Station's Docking Bay, emergency lights.
2. `2_hangar_same_style.webp`: the Hangar, "in exactly the same style".
3. `3_docking_bay_power_on.webp`: the Docking Bay again, with the power on.

**Measured by the main thread:** pictures 1 and 3 line up exactly (their lines match best at a shift of 0 pixels; a 50% blend shows no doubled edges), so the game can fade a room from dark to lit. Picture 2 reuses picture 1's back wall, door and lamps: the same style, but not yet a room of its own. At 1180 pixels wide, each picture is about 64 to 87 KB as WebP.

## Second test (28 November)

4. `4_greenhouse_own_room.webp`: the Greenhouse, asked to look clearly different. It does (a round glass roof, green grating, plant beds, a ladder), in the same style.
5. `5_things_on_magenta.webp`: six things on one flat magenta (254, 0, 123), so they can be cut out.
6. `6_test_things_in_greenhouse.webp` and `7_test_cadet_in_docking_bay.webp`: **made by the main thread**, not by Gemini. The six things were cut out by colour (`cutouts/`, with see-through edges, no pink left at the edges), given a soft shadow, and stood in the rooms at iPad size (1180 × 664). The cadet at the back of the Docking Bay is drawn smaller, to show depth. Not yet done: darkening a thing to match a dim room; a cadet that walks.
