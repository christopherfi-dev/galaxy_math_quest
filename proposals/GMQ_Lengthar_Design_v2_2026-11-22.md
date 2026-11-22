# Planet Lengthar, version 2: metric

**Date:** 22 November 2026. **For:** Marc. It replaces `GMQ_Lengthar_Design_v1_2026-11-21.md`.
Everything is **[Proposal]** unless it says [Source].

[Source: Marc, 2026-11-22] "We learn the metric system." Version 1 measured in quarter inches. This version uses centimetres and metres.

---

## 1. What changes with metric

A metric ruler has no quarter marks. It is marked in centimetres and millimetres, and the half-centimetre mark is the longer one. So the fractions move to a different tool:

| Standard | Version 1 (inches) | Version 2 (metric) |
|---|---|---|
| 3.MD.4: measure, then a line plot | to the nearest quarter inch | **to the nearest half centimetre**, on a centimetre ruler. The line plot is marked in whole and half centimetres. |
| 3.NF.2 and 3.NF.3: fractions on a number line; equal fractions | the ½ and ¼ inch marks | **the Measuronians' measuring rod: one metre long, marked in halves and quarters.** The child finds where ½, ¼ and ¾ go, and that 2/4 lands on ½. |

**One rule, all the way through: no changing units.** The game never asks how many centimetres make a quarter metre. Changing units is Grade 4 work (4.MD.1). The rod is in metres, and the ruler is in centimetres.

**[Check]** If your AERO 3.MD.4 says "nearest centimetre", or "millimetre", tell me. The half centimetre is my reading of "halves", the metric twin of the Common Core's half inch.

---

## 2. What is yours [Source: your Magnificent Measurements drafts]

- the Measuronians
- an energy anomaly that throws lengths into chaos
- Planet Lengthar (and Planet Massar later)
- the Unit Alignment Matrix
- the task names "Unit Alignment" and "Space Ruler"
- the Chaos Guardian, "a creature feeding on imprecision"

Everything else here is mine [Proposal]: the places, the objects, the numbers and the link to the station's storm.

## 3. The story

- The cosmic storm that wrecked the KIS Station passed Lengthar too [Proposal: it links to the station's story]. It carried the energy anomaly [Source]. The anomaly shook every number off the Measuronians' measuring rods and rulers. Now nobody knows how long anything is.
- The Measuronians build by exact lengths. Their Unit Alignment Matrix keeps the planet's lengths true. It needs true measurements fed back into it.
- The cadet brings a ruler whose marks the storm did not touch. That is the cadet's job: true lengths, one place at a time.
- **The Chaos Guardian** feeds on careless measuring. Every exact measurement weakens it [Source: "feeding on imprecision"].

## 4. The places, in order from the landing, each a picture you stand in

| Place | Task | What the child does | The maths |
|---|---|---|---|
| **The Landing Strip** | a finished example first | A Measuronian measures one rod out loud, on a different object: "Zero at the start. The end is at 9½. So it is 9½ centimetres." | reading a ruler from 0 |
| **The Workshop** | **Space Ruler** [Source: the name] | The measuring rod has lost its marks. The child taps where ½ goes, then ¼ and ¾. Then: "Where is 2/4?" It lands on ½. Then a rod 2 metres long: where is 1½? | 3.NF.2, 3.NF.3 |
| **The Long Hall** | **Unit Alignment** [Source: the name] | Eight objects lie on a bench, drawn at true scale. The child slides the ruler so 0 meets the start, reads the end, and types it. The first four end exactly on a mark. The last four end just next to one: "nearly 7½, so 7½". | 3.MD.4 |
| **The Unit Alignment Matrix** [Source: the name] | the line plot | The child puts an X above each length on a line marked in half centimetres. Then one question from it: the most common length, or how many are longer than 7 cm. | 3.MD.4 |
| **The Guardian's Rift** | **the Chaos Guardian** | Three things, each with a length the Guardian claims. The child measures each and says which claims are true. True ones weaken the Guardian. | 3.MD.4 |

**The picture shows the task** in every place. The ruler, the rod or the plot fills the picture; the desk holds only the boxes and buttons.

**Nothing gives the answer away:**
- The ruler has marks and numbers, and no reading.
- The line plot has no running count.

---

## 5. Number rules, checked on thousands of cadets before building

- **The objects:** each cadet's eight lengths lie in one window of five neighbouring half-centimetre values. For example, 6, 6½, 7, 7½ and 8 cm. That way the line plot has real stacks.
- **One most common length,** with no tie.
- At least one whole and one half length.
- **Lengths from 3 to 12 cm,** so the longest fits the picture on a phone, with the half-centimetre marks far enough apart to read and tap. The check measures this on each screen size.
- **The "nearly" objects** end 1 mm from a mark, never 2.5 mm. So they are never halfway between two marks, and never read two ways.
- **The question on the plot has exactly one answer.** "Longer than 7" means 7 itself does not count; the words say so.
- **The rod:** ½, ¼ and ¾ of 1 metre, then 1½ of 2 metres. The taps must land within a fixed distance of the true mark. The distance is checked on every screen size.
- **Picture centimetres:** the ruler grows with the screen. A real ruler held to the iPad will not match, and the game says so once.

## 6. How it joins the world web [Proposal; your laws]

- **Lengthar gives:** the Measuronians thank the cadet with **a true ruler**. In strand A, the Nomads' glassworks on Voltara cut their lantern's glass panes to exact centimetres, so the cadet measures again on another planet. Lengthar's skill travels.
- **Lengthar needs nothing from elsewhere** for its own jobs (law 7).
- **Massar** (grams and kilograms, 3.MD.2) stays for later. It could take the world web's sand sack.

## 7. The build, in order

1. **The number rules in code, and their check** (`checks/lengthar_check.py`), on thousands of seeds.
2. The planet in the game:
   - landing from Galaxy Metrica, beside Chronosia and Xylophora
   - the five places, walking between them, the words to tap
   - the mission panel and the hint
   - the report home
3. The Workshop and the Long Hall, each with its finished example.
4. The Matrix and the Guardian.
5. **Checking:**
   - pictures at 1180×745, 820×1180 and 390×760
   - a play test that plays it as a child would: wrong answers, leaving and coming back, closing and opening again
   - the independent reviewer at the first full draft and at the end

**About two working sessions.** Preview link only. The class link stays as it is until you say.

## 8. Your decisions, only if you want to change mine

1. Half centimetres for 3.MD.4, and the metre rod for fractions. Right for your class?
2. The storm carried the anomaly: yes, or keep them apart?
