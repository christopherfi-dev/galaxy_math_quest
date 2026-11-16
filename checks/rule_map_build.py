"""Build skills/rule_map.csv: every rule in the sketch, the Math Skills statement it covers, and its lowest band.

[Source] the statements and bands are Marc's (engines/math-skills, read through skills/skill_map.csv).
[Proposal] the matching of a rule to a statement, the star names and the groups are Claude's.

The trainer asks skills in band order, lowest first. This file is where that order comes from.

Run:  python3 checks/rule_map_build.py      (standard library only)
"""
import csv, os, collections

HERE = os.path.dirname(os.path.abspath(__file__))
# rule, star name, group, how it is answered, statement
RULES = [
    ("pv_order", "Order numbers to 1,000", "Place value", "number", "Compares whole numbers within 1,000 using terms"),
    ("pv_partition", "Split a number into parts", "Place value", "number", "Reads and writes whole numbers within 1,000 in expanded form"),
    ("round10", "Round to the nearest 10", "Place value", "number", "Rounds whole numbers within 1,000"),
    ("round100", "Round to the nearest 100", "Place value", "number", "Rounds whole numbers within 1,000"),
    ("count_on", "Count on in steps", "Counting", "number", "Counts by 10s within 1,000"),
    ("odd_one_out", "Odd and even", "Counting", "number", "Determines if sets of objects are even or odd"),
    ("add_1digit", "Add small numbers", "Add and subtract", "number", "Adds whole numbers with sums within 20"),
    ("sub_1digit", "Subtract small numbers", "Add and subtract", "number", "Subtracts whole numbers within 20"),
    ("add_2digit_plain", "Add 2-digit numbers", "Add and subtract", "number", "Adds whole numbers with sums within 100, no regrouping"),
    ("sub_2digit_plain", "Subtract 2-digit numbers", "Add and subtract", "number", "Subtracts whole numbers within 100, no regrouping"),
    ("add_2digit_regroup", "Add with regrouping", "Add and subtract", "number", "Adds whole numbers with sums within 100, with regrouping"),
    ("sub_2digit_regroup", "Subtract with regrouping", "Add and subtract", "number", "Subtracts whole numbers within 100, with regrouping"),
    ("mult_repeated", "Equal groups", "Multiply", "number, with a picture", "Represents arrays with repeated addition expressions and finds the total number of objects"),
    ("array_expr", "Rows as a sum", "Multiply", "tap a choice", "Represents arrays with repeated addition expressions or equations"),
    ("mult_2_5_10", "Times 2, 5 and 10", "Multiply", "number", "Multiplies basic facts"),
    ("mult_facts", "Times tables to 10", "Multiply", "number", "Multiplies basic facts"),
    ("div_share", "Share equally", "Divide", "number", "Understands division as equal sharing"),
    ("div_2_5_10", "Divide by 2, 5 and 10", "Divide", "number", "Divides basic facts"),
    ("div_facts", "Division facts", "Divide", "number", "Divides basic facts"),
    ("ten_more_less", "10 more, 10 less", "More and less", "number", "Finds 10 more or 10 less than a given number"),
    ("hundred_more_less", "100 more, 100 less", "More and less", "number", "Finds 100 more or 100 less than a given number"),
    ("count_back", "Count back in steps", "More and less", "number", "Counts backward by 100s within 1,000"),
    ("sub_tens", "Take away tens", "More and less", "number", "Subtracts multiples of 10 from multiples of 10 within 100"),
    ("add_three", "Add three numbers", "Bigger sums", "number", "Adds three or more whole numbers with sums within 100, with regrouping"),
    ("add_3digit_plain", "Add 3-digit numbers", "Bigger sums", "number", "Adds whole numbers with sums within 1,000, no regrouping"),
    ("sub_3digit_plain", "Subtract 3-digit numbers", "Bigger sums", "number", "Subtracts whole numbers within 1,000, no regrouping"),
    ("add_3digit_regroup", "Add 3-digit with regrouping", "Bigger sums", "number", "Adds whole numbers with sums within 1,000, with regrouping"),
    ("mult_tens", "Times tens", "Find the missing number", "number", "Multiplies one-digit whole numbers by multiples of 10"),
    ("missing_add", "Missing part of a sum", "Find the missing number", "number", "Determines unknown parts in addition equations with whole numbers, sums within 20"),
    ("missing_factor", "Missing times number", "Find the missing number", "number", "Determines unknown factors in multiplication equations with whole numbers and products within 100"),
    ("frac_halves", "Find the halves", "Fractions", "tap a choice", "Identifies shapes that are divided into halves"),
    ("frac_thirds", "Find the thirds", "Fractions", "tap a choice", "Identifies shapes that are divided into thirds"),
    ("frac_fourths", "Find the fourths", "Fractions", "tap a choice", "Identifies shapes that are divided into fourths"),
    ("frac_model_unit", "Make one part", "Fractions", "cut and light a bar", "Models unit fractions using area models"),
    ("frac_model", "Make a fraction", "Fractions", "cut and light a bar", "Models non-unit fractions using area models"),
    ("frac_parts", "Name the fraction", "Fractions", "two numbers", "Identifies the fractional parts of shapes"),
    ("frac_set", "Fraction of a set", "Fractions", "number", None),
    ("nl_frac", "Fractions on a line", "Fractions", "tap the line", "Locates non-unit proper fractions on a number line"),
    ("nl_unit", "One part on a line", "Fractions", "tap the line", "Locates unit fractions on a number line"),
    ("clock_hour", "Clock: the hour", "Clocks", "a time", "Reads analog clocks to the nearest hour"),
    ("clock_half", "Clock: half hours", "Clocks", "a time", "Reads analog clocks to the nearest half hour"),
    ("clock_five", "Clock: to 5 minutes", "Clocks", "a time", "Reads analog clocks to the nearest five minutes"),
    ("clock_minute", "Clock: to the minute", "Clocks", "a time", "Reads analog clocks to the nearest minute"),
    ("clock_elapsed", "Two clocks: how long?", "Clocks", "number, with a picture", "Determines elapsed time across either minutes or hours using clocks"),
    ("time_forward", "How long did it take?", "Measure", "number", "Solves elapsed-time word problems involving counting forward by either hours or minutes"),
    ("perimeter_rect", "All the way round", "Measure", "number", "Solves problems involving perimeters of rectangles within a real-world or mathematical context"),
    ("area_rect", "Area of a rectangle", "Measure", "number", "Determines the area of rectangles with whole-number sides, formula not provided"),
    ("money_change", "Change from 100 baht", "Measure", "number", "Solves one-step money word problems involving whole number addition or subtraction"),
    ("area_count", "Count the squares", "Area and edges", "number, with a picture", "Determines the area of figures composed of whole unit squares"),
    ("area_tile", "Tile a floor", "Area and edges", "tap tiles, then a number", "Determines the area of figures by tiling with whole unit squares"),
    ("area_expr", "Area as a times sum", "Area and edges", "two numbers", "Represents the area of rectangles composed of whole unit squares using multiplication expressions or equations"),
    ("perim_labeled", "Add all the sides", "Area and edges", "number, with a picture", "Determines the perimeter of basic polygons with all sides labeled"),
    ("picto_read", "Read a picture graph", "Graphs", "number, with a picture", "Reads pictographs with single-unit scales to determine how many in a category"),
    ("bar_build", "Build a bar graph", "Graphs", "build the bars", "Represents data in bar graphs with single-unit scales"),
    ("bar_build_multi", "Build a graph in jumps", "Graphs", "build the bars", "Represents data in bar graphs with multi-unit scales"),
    ("bar_read", "Read a bar graph", "Graphs", "number, with a picture", "Reads bar graphs with single-unit scales to determine how many in a category"),
    ("picto_addsub", "Picture graph sums", "Graphs", "number, with a picture", "Adds and subtracts to answer questions about pictographs with single-unit scales"),
    ("bar_addsub", "Bar graph sums", "Graphs", "number, with a picture", "Adds and subtracts to answer questions about bar graphs with single-unit scales"),
    ("bar_multi", "Bar graphs in jumps", "Graphs", "number, with a picture", "Adds and subtracts to answer questions about bar graphs with multi-unit scales"),
    ("picto_multi", "Picture graphs with a key", "Graphs", "number, with a picture", "Adds and subtracts to answer questions about pictographs with multi-unit scales"),
    ("shape_sides", "Sides and corners", "Shapes", "number, with a picture", "Identifies the number of sides or corners of 2-D shapes, given pictures"),
    ("shape_basic", "Name the shape", "Shapes", "tap a choice", "Identifies and names triangles, squares, rectangles, and circles"),
    ("sym_line", "Is it a line of symmetry?", "Shapes", "tap a choice", "Recognizes lines of symmetry in 2-D figures"),
    ("sym_count", "Count lines of symmetry", "Shapes", "number, with a picture", "Determines the number of lines of symmetry in 2-D figures"),
    ("shape_more", "Name harder shapes", "Shapes", "tap a choice", "Identifies and names nonbasic shapes, such as trapezoids, hexagons, etc."),
    ("coord_what", "What is at the point?", "Star maps", "tap a choice", "Interprets points with whole number coordinates in the first quadrant within the given context"),
    ("coord_read", "Read a star map", "Star maps", "two numbers", "Determines the coordinates of points in the first quadrant of a coordinate plane"),
    ("coord_plot", "Mark a star map", "Star maps", "tap the map", "Plots the coordinates of points in the first quadrant of a coordinate plane"),
]
NO_STATEMENT_BAND = {"frac_set": 181}   # [Proposal] from Marc's 2026 tracker, not the engine. Placed with the other fraction work.


def build():
    rows = list(csv.DictReader(open(os.path.join(HERE, "..", "skills", "skill_map.csv"), encoding="utf-8")))
    bands, galaxy = collections.defaultdict(set), {}
    for r in rows:
        bands[r["skill"]].add(int(r["band"].split("-")[0])); galaxy[r["skill"]] = r["galaxy"]
    out, bad = [], []
    for rule, name, group, how, text in RULES:
        if text is None:
            out.append([rule, name, group, "Numerix", how, NO_STATEMENT_BAND[rule], "", "(Marc's 2026 tracker: fraction of a set)"]); continue
        if text not in bands: bad.append(f"{rule}: statement not in the engine: {text}"); continue
        b = sorted(bands[text]); out.append([rule, name, group, galaxy[text], how, b[0], " ".join(map(str, b)), text])
    return out, bad


def main():
    out, bad = build()
    path = os.path.join(HERE, "..", "skills", "rule_map.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["rule", "star_name", "group", "galaxy", "answered_by", "lowest_band", "all_bands", "statement"]); w.writerows(out)
    names = [r[1] for r in out]
    for n in set(names):
        if names.count(n) > 1: bad.append("two stars share the name: " + n)
    states = {r[7] for r in out if r[6]}
    print(f"{len(out)} rules cover {len(states)} different Math Skills statements, plus 1 from the tracker.")
    print("By lowest band:", dict(sorted(collections.Counter(r[5] for r in out).items())))
    print("By galaxy:", dict(collections.Counter(r[3] for r in out)))
    print("With a picture or a toy:", sum(r[4] != "number" for r in out))
    for b in bad: print("  PROBLEM", b)
    print("RESULT:", "PASS" if not bad else "FAIL")


if __name__ == "__main__":
    main()
