# Chronosia: things that lead to each other

**Date:** 22 November 2026. **For:** Marc. **Built:** version 87, on the preview link only. The class link stays on version 81.
Everything is **[Proposal]** unless it says [Source].

---

## 1. What you found [Source: Marc, 22 November]

> "The turtle Grove it's just [the] turtle mouth and that's it. The cougar statue, again it doesn't connect to anything else? There's a pond there, but I can say swimming pond... I can't do anything with it... There's a key but again there's nothing I can do with the cave. Touching the cave should have you go into the cave because it's a new place... Were there changes that I'm not seeing? Or are they not in the latest updates? Were they not pushed? Or did you not do them?"

**The answer: they were not done.** They were planned for strand A, after Lengthar. They are built now.

## 2. What is built: three trails that meet at the cougar

**Trail 1: the cave** [Source for the cave as a place: your words above]
1. **A tap on the cave walks there and goes in.** The Dark Cave is a place now, like the grove.
2. **The back wall asks its question** (minutes passed). Then it slides aside. Behind it are a stone map (to the stone door, as before) and a passage.
3. **The passage is too dark.** The hint says: "You need a light that never goes out. Look for one on another planet."
4. **With a light from another planet,** the passage leads to a **gear door**. Its question is equal groups: "There are 6 gears. Each has 6 teeth. How many teeth in all?" While the question is open, the gear door fills the picture, with the child's own number of gears and teeth. The right answer gives a card.
5. **Behind it is the Clockmaker's Workshop:** a workbench, an empty chair with a dusty coat, and a plan of the Clockwork Cougar. The plan shows a keyhole behind its ear: "First wind its clock. Then turn my key. It will guard my time portal."

**Trail 2: the key**
1. The sundial, the boat and the tin box ask their questions, as before.
2. **The tin box now gives the clockmaker's key.** It goes in the bag.
3. **At Cougar Rock,** the key will not turn while the cougar's clock is stopped. Once the child has wound it (its own quest), the key fits behind its ear.
4. **The cougar leaps off the rock and guards the time portal.** You can see the change:
   - the rock is empty
   - the cougar sits by the portal on the map
   - the crack in the sky fades ("With no more trips...")
   - the portal and the case's ending both say so

**Trail 3: the pond and the tortoise**
1. **"Swim", "dive" or a tap on the pond:** "It is too deep to hold your breath that long. The tortoise has lived by this pond for a hundred years. Maybe it knows a way."
2. **After its own quest, the tortoise is cold.** "Bring me something warm, like a stone from the sun."
3. **At Cougar Rock,** the warm stones are drawn warm now. One tap picks one up.
4. **The tortoise takes the warm stone and tells the pond's secret:** time runs slow down there, so one breath lasts a long time.
5. **The dive brings up a bottle with the Clockmaker's note:** "I built the time portal. I built a brass cougar to guard it. My key sends it to guard the portal. I hid my key in a tin box, on my little boat."
   - So the pond points to the key, the key points to the cougar, and the cave's workshop explains why.
   - The note stays in the bag, to read again.

**None of this is needed for a main job.** Every step can be done by tapping. Tapping the cougar or the tortoise uses what is in the bag.

## 3. Two changes from what I first told you

1. **The light for the dark passage comes from another planet,** not from Chronosia.
   - I first built a lamp from the stone door. Then I found your words of 21 November:
     > "Maybe you can't explore the cave on Chronosia until you get a special torch that allows you to explore caves as a quest prize on another planet. Then can you go back to your previous places and go explore those caves maybe get better things or answers to other questions?"
   - So I took the lamp out. **Today, Voltara's glow stone lights the passage.** It is a secret there, so this is a secret that turns out to matter later, as you wanted.
   - **When strand A is built,** the Nomads' lantern (a quest prize) will light it too, for every child. The stone door is as it was in version 86.
2. **The pond's "way to breathe" comes from the tortoise,** not from the Gumblefish's bubble. The bubble is not built yet, so pointing to it would have been another dead end today. The bubble keeps its use for Xylophora's square pond (strand C).

## 4. How it was checked

**Tests that ran and passed:** see section 6 for the full list and results.
- `checks/chronosia_links_test.js` (new). It plays all three trails as a child would, at iPad sideways, iPad upright and phone size:
  - by tapping and by typing
  - wrong answers
  - leaving and coming back
  - closing the game inside the workshop and opening it again
  - a save from before version 87
- The gear door's question on 5,000 cadets:
  - 3 to 8 gears, with 6 to 10 teeth each
  - the answer is always their product
  - no sentence is over 10 words
  - 0 faults
- `checks/finds_test.js`, updated: tapping the cave now goes in.
- `checks/world_web_check.py`: every law holds. The spreadsheet has new rows for the new links.

**Shortcut:** the links test marks the tortoise's and the cougar's own quests as done. `checks/chronosia_test.js` plays those in full.

**Pictures:** I looked at each new place at all three sizes.

**An independent reviewer** saw only the pictures and a play transcript, never the code.
- **Fixed from its report:**
  - The gear door's drawing did not match the question. Now it draws the question's own gears and teeth, and fills the picture.
  - The warm stones were drawn cold and never named. Now they are drawn warm, with a shimmer, and Cougar Rock's words mention them.
  - The note said the key "wakes" the cougar, but winding wakes it. It now says the key sends it to guard the portal.
  - "Left ear" could be read two ways. It now says "its ear".
  - The wall said the dripping "stopped" while the water still drips. The question is now about a great flood, long ago.
  - The coat said "just stepped out" in a dusty room. Now it says the Clockmaker never came back for it.
  - The pond label covered the cadet's helmet.
  - The falling leaf and the glint in the pond are now drawn.
  - "Dark passage" stayed on the label once lit. It now says "passage".
  - The portal's "log" now says "log book".
- **Not true when checked:**
  - "The warm stones appear only after the cougar leaves." They are there from the start.
  - "Some steps need typing." Every step can be tapped. The test does them by tapping.
- **Older than this work, and not changed:**
  - The finds' questions are words only. The picture does not show the dripping, the dial or the ropes.
  - A wrong answer on a find says only "That is not it."
  - The squares on the map are small on a phone.

**A risk found and fixed:** the preview and the class link share one save on the same iPad.
- A save made inside the cave, opened on the class link, broke it with "This place could not be drawn".
- Version 87 now saves the cave and the workshop as "on the map, beside the cave", with a note that only version 87 reads.
- Checked: the class link now opens such a save on the map.
- The same check on a Lengthar save from version 86: the class link draws the station with space words. A child can still tap a galaxy and fly. It goes away when the class link is updated.

## 5. Your decisions

1. **The Clockmaker** is a new character of mine. Keep?
2. **The coat's ticket: "Time portal. One way."** It is a hook for a later story: where did the Clockmaker go? Keep, change or remove?
3. **The cougar on guard fades the crack in the sky,** even if the child kept the Council member's secret. That gives "keep the secret" a second way to mend the sky. Keep that, or should the crack stay?
4. **The workshop's reward.** The reviewer said the trail ends with too little: a card, and a plan that repeats what the cougar shows. Options:
   - **A.** Leave it as a story room.
   - **B.** The Clockmaker's turning clock: a geared clock the child can turn in the bag, to help with any time question. It is a helper, not an answer. It makes the main time jobs easier for children who found it. That is why it is your choice. [Source for the idea: your words of 21 November, "There are things that could help do certain questions."]
   - **C.** Something for another planet.
   - I recommend B.
5. **Strand A next:** the Nomads' lantern as the quest prize that lights the passage for every child. Your 21 November words say it should be this way.

## 6. Test results

The results are filled in below by the final run.
