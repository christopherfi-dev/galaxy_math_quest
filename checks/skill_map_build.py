"""Build the GMQ skill map from Marc's Math Skills engine.

Reads every skill statement in engines/math-skills/current-v1.1/api/constraints/skills/
(48 files: 8 level bands x 6 maths areas) and writes:
  skills/skill_map.csv   one row per skill: band, area, galaxy, how it can be asked, statement
  (prints a summary used in skills/SKILL_MAP.md)

The "how it can be asked" column is a keyword sort, not a judgement by a teacher.
It is a first pass for Marc to correct.        [Proposal]

Run:  python3 checks/skill_map_build.py        (standard library only)
"""
import csv, glob, os, re, collections

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "engines", "math-skills", "current-v1.1", "api", "constraints", "skills")
OUT = os.path.join(HERE, "..", "skills", "skill_map.csv")

GALAXY = {"NumberSense": "Numerix", "Computation": "Numerix", "AlgebraicConcepts": "Patternox",
          "Measurement": "Metrica", "Geometry": "Geometrica", "Data": "Databa"}
# Bands a Grade 3 class is likely to need. [Assumption: check against your own test data.]
ROLE = {"161-170": "gap", "171-180": "gap", "181-190": "core", "191-200": "core",
        "201-210": "stretch", "211-220": "beyond", "221-230": "beyond", "231-240": "beyond"}

HANDS = r"protractor|\bdraws?\b|constructs?|\bbuilds?\b|measures? (the |an? )?(length|angle|mass|weight|volume|liquid)|using (a )?(ruler|tools|scale|thermometer)|sketch|creates? (a |an )?(graph|plot|chart|table|net)"
PICTURE = r"model|number line|graph|plot|pictograph|chart|table|array|diagram|figure|shape|polygon|triangle|quadrilateral|rectangle|circle|angle|line|symmetr|clock|grid|coordinate|net\b|solid|prism|cube|tiling|tessellat|picture|tally|ruler|coin|bills|map|pattern"
NUMBER = r"\badds?\b|subtract|multipl|divid|rounds?\b|counts?\b|sum|difference|product|quotient|finds? |calculat|determin|solves?|estimat|convert|area|perimeter|volume|elapsed|how many|value|factor|multiple|mean|median|mode|range|probabilit|ratio|rate|percent|equation|expression|missing|compar|orders?\b|decompos|compos|evaluat|simplif|writes?"


def kind(text):
    t = text.lower()
    if re.search(HANDS, t):
        return "hands-on"
    if re.search(PICTURE, t):
        return "picture"
    if re.search(NUMBER, t):
        return "number"
    return "word"


def main():
    rows, junk = [], []
    for path in sorted(glob.glob(os.path.join(SRC, "*.txt"))):
        band, area = os.path.basename(path)[:-4].split("_")
        for line in open(path, encoding="utf-8"):
            raw = line.strip()
            if not raw:
                continue
            if not raw.startswith("*"):
                junk.append((os.path.basename(path), raw[:90]))
                continue
            text = raw.lstrip("*").strip().replace("‑", "-")
            rows.append({"band": band, "role": ROLE[band], "area": area, "galaxy": GALAXY[area], "ask": kind(text), "skill": text})
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["band", "role", "area", "galaxy", "ask", "skill"]); w.writeheader(); w.writerows(rows)

    print(f"Skill statements read: {len(rows)} in {len(glob.glob(os.path.join(SRC, '*.txt')))} files.")
    uniq = {r["skill"] for r in rows}
    print(f"Different statements: {len(uniq)} (many repeat across bands).")
    print("\nBy galaxy and role (statements):")
    c = collections.Counter((r["galaxy"], r["role"]) for r in rows)
    print(f"{'galaxy':12} {'gap':>5} {'core':>5} {'stretch':>8} {'beyond':>7}")
    for g in ["Numerix", "Patternox", "Metrica", "Geometrica", "Databa"]:
        print(f"{g:12} {c[(g,'gap')]:5d} {c[(g,'core')]:5d} {c[(g,'stretch')]:8d} {c[(g,'beyond')]:7d}")
    g3 = [r for r in rows if r["role"] in ("gap", "core", "stretch")]
    u3 = {}
    for r in g3:
        u3.setdefault(r["skill"], r)
    print(f"\nFor a Grade 3 class (gap + core + stretch bands): {len(g3)} statements, {len(u3)} different.")
    k = collections.Counter((r["galaxy"], r["ask"]) for r in u3.values())
    print(f"{'galaxy':12} {'number':>7} {'picture':>8} {'word':>5} {'hands-on':>9} {'all':>5}")
    for g in ["Numerix", "Patternox", "Metrica", "Geometrica", "Databa"]:
        tot = sum(k[(g, a)] for a in ("number", "picture", "word", "hands-on"))
        print(f"{g:12} {k[(g,'number')]:7d} {k[(g,'picture')]:8d} {k[(g,'word')]:5d} {k[(g,'hands-on')]:9d} {tot:5d}")
    tot = collections.Counter(r["ask"] for r in u3.values())
    print(f"{'all':12} {tot['number']:7d} {tot['picture']:8d} {tot['word']:5d} {tot['hands-on']:9d} {len(u3):5d}")
    if junk:
        print(f"\nLines that are not skills ({len(junk)}), found in:")
        for name in sorted({j[0] for j in junk}):
            print("  ", name, "-", sum(1 for j in junk if j[0] == name), "lines, e.g.", repr([j[1] for j in junk if j[0] == name][0]))
    print("\nWrote", os.path.relpath(OUT, os.path.join(HERE, "..")))


if __name__ == "__main__":
    main()
