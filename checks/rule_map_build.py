"""Build skills/rule_map.csv: every rule in the sketch, the Math Skills statement it covers, and its lowest band.

[Source] the statements and bands are Marc's (engines/math-skills, read through skills/skill_map.csv).
[Proposal] the matching of a rule to a statement, the star names, the groups and the maths words are Claude's.
Marc asked for explicit maths vocabulary (2026-11-16). Each rule names one maths word and says what it means.

The trainer asks skills in band order, lowest first. This file is where that order comes from.

Run:  python3 checks/rule_map_build.py      (standard library only)
"""
import csv, os, collections

HERE = os.path.dirname(os.path.abspath(__file__))
# rule, star name, group, how it is answered, statement, the maths word, what the word means
RULES = [
    ("pv_order", "Order numbers to 1,000", "Place value", "number", "Compares whole numbers within 1,000 using terms", "greatest", "The greatest number is the biggest one. The least is the smallest."),
    ("pv_partition", "Expanded form", "Place value", "number", "Reads and writes whole numbers within 1,000 in expanded form", "expanded form", "Expanded form shows a number as hundreds + tens + ones."),
    ("round10", "Round to the nearest 10", "Place value", "number", "Rounds whole numbers within 1,000", "round", "To round to the nearest 10, find the closest ten."),
    ("round100", "Round to the nearest 100", "Place value", "number", "Rounds whole numbers within 1,000", "round", "To round to the nearest 100, find the closest hundred."),
    ("count_on", "Skip count on", "Counting", "number", "Counts by 10s within 1,000", "skip count", "To skip count is to count in equal jumps."),
    ("odd_one_out", "Odd and even", "Counting", "number", "Determines if sets of objects are even or odd", "odd and even", "Even numbers make pairs with none left over. Odd numbers leave one over."),
    ("add_1digit", "Add small numbers", "Add and subtract", "number", "Adds whole numbers with sums within 20", "sum", "The sum is the answer when you add."),
    ("sub_1digit", "Subtract small numbers", "Add and subtract", "number", "Subtracts whole numbers within 20", "difference", "The difference is the answer when you subtract."),
    ("add_2digit_plain", "Add 2-digit numbers", "Add and subtract", "number", "Adds whole numbers with sums within 100, no regrouping", "sum", "The sum is the answer when you add."),
    ("sub_2digit_plain", "Subtract 2-digit numbers", "Add and subtract", "number", "Subtracts whole numbers within 100, no regrouping", "difference", "The difference is the answer when you subtract."),
    ("add_2digit_regroup", "Add with regrouping", "Add and subtract", "number", "Adds whole numbers with sums within 100, with regrouping", "regroup", "To regroup is to swap 10 ones for 1 ten."),
    ("sub_2digit_regroup", "Subtract with regrouping", "Add and subtract", "number", "Subtracts whole numbers within 100, with regrouping", "regroup", "To regroup is to swap 1 ten for 10 ones."),
    ("mult_repeated", "Equal groups", "Multiply", "number, with a picture", "Represents arrays with repeated addition expressions and finds the total number of objects", "equal groups", "Equal groups all have the same number in them. To multiply is to add equal groups."),
    ("array_expr", "Arrays as a sum", "Multiply", "tap a choice", "Represents arrays with repeated addition expressions or equations", "array", "An array is rows with the same number in each row."),
    ("mult_2_5_10", "Times 2, 5 and 10", "Multiply", "number", "Multiplies basic facts", "product", "The product is the answer when you multiply."),
    ("mult_facts", "Times tables to 10", "Multiply", "number", "Multiplies basic facts", "product", "The product is the answer when you multiply."),
    ("div_share", "Share equally", "Divide", "number", "Understands division as equal sharing", "divide", "To divide is to share into equal groups."),
    ("div_2_5_10", "Divide by 2, 5 and 10", "Divide", "number", "Divides basic facts", "quotient", "The quotient is the answer when you divide."),
    ("div_facts", "Division facts", "Divide", "number", "Divides basic facts", "quotient", "The quotient is the answer when you divide."),
    ("ten_more_less", "10 more, 10 less", "More and less", "number", "Finds 10 more or 10 less than a given number", "tens digit", "The tens digit is the second digit from the right."),
    ("hundred_more_less", "100 more, 100 less", "More and less", "number", "Finds 100 more or 100 less than a given number", "hundreds digit", "The hundreds digit is the third digit from the right."),
    ("count_back", "Skip count back", "More and less", "number", "Counts backward by 100s within 1,000", "skip count", "You can skip count backwards too. The jumps stay equal."),
    ("sub_tens", "Take away tens", "More and less", "number", "Subtracts multiples of 10 from multiples of 10 within 100", "multiple of 10", "A multiple of 10 ends in 0, like 30 or 70."),
    ("add_three", "Add three numbers", "Bigger sums", "number", "Adds three or more whole numbers with sums within 100, with regrouping", "sum", "The sum is the answer when you add."),
    ("add_3digit_plain", "Add 3-digit numbers", "Bigger sums", "number", "Adds whole numbers with sums within 1,000, no regrouping", "sum", "The sum is the answer when you add."),
    ("sub_3digit_plain", "Subtract 3-digit numbers", "Bigger sums", "number", "Subtracts whole numbers within 1,000, no regrouping", "difference", "The difference is the answer when you subtract."),
    ("add_3digit_regroup", "Add 3-digit with regrouping", "Bigger sums", "number", "Adds whole numbers with sums within 1,000, with regrouping", "regroup", "To regroup is to swap 10 ones for 1 ten, or 10 tens for 1 hundred."),
    ("mult_tens", "Times tens", "Find the missing number", "number", "Multiplies one-digit whole numbers by multiples of 10", "multiple of 10", "A multiple of 10 ends in 0, like 30 or 70."),
    ("missing_add", "Missing part of a sum", "Find the missing number", "number", "Determines unknown parts in addition equations with whole numbers, sums within 20", "unknown", "The unknown is the missing number."),
    ("missing_factor", "Missing times number", "Find the missing number", "number", "Determines unknown factors in multiplication equations with whole numbers and products within 100", "factor", "Factors are the numbers you multiply."),
    ("frac_halves", "Find the halves", "Fractions", "tap a choice", "Identifies shapes that are divided into halves", "halves", "Halves are 2 equal parts of one whole."),
    ("frac_thirds", "Find the thirds", "Fractions", "tap a choice", "Identifies shapes that are divided into thirds", "thirds", "Thirds are 3 equal parts of one whole."),
    ("frac_fourths", "Find the fourths (quarters)", "Fractions", "tap a choice", "Identifies shapes that are divided into fourths", "fourths and quarters", "Fourths are 4 equal parts of one whole. They are also called quarters. Both names are right."),
    ("frac_model_unit", "Make one part", "Fractions", "cut and light a bar", "Models unit fractions using area models", "unit fraction", "A unit fraction is one equal part, like 1/4."),
    ("frac_model", "Make a fraction", "Fractions", "cut and light a bar", "Models non-unit fractions using area models", "denominator", "The denominator is the bottom number. It counts the equal parts."),
    ("frac_parts", "Name the fraction", "Fractions", "two numbers", "Identifies the fractional parts of shapes", "numerator", "The numerator is the top number. It counts the parts you use."),
    ("frac_set", "Fraction of a set", "Fractions", "number", None, "fraction", "A fraction is some equal parts of a whole or of a set."),
    ("nl_frac", "Fractions on a line", "Fractions", "tap the line", "Locates non-unit proper fractions on a number line", "number line", "On a number line, equal jumps show equal parts."),
    ("nl_unit", "One part on a line", "Fractions", "tap the line", "Locates unit fractions on a number line", "number line", "On a number line, equal jumps show equal parts."),
    ("clock_hour", "Clock: the hour", "Clocks", "a time", "Reads analog clocks to the nearest hour", "hour hand", "The short hand is the hour hand."),
    ("clock_half", "Clock: half hours", "Clocks", "a time", "Reads analog clocks to the nearest half hour", "half past", "Half past means 30 minutes after the hour."),
    ("clock_five", "Clock: to 5 minutes", "Clocks", "a time", "Reads analog clocks to the nearest five minutes", "minute hand", "The long hand is the minute hand. Each number is 5 more minutes."),
    ("clock_minute", "Clock: to the minute", "Clocks", "a time", "Reads analog clocks to the nearest minute", "analog clock", "An analog clock has hands. Each small mark is 1 minute."),
    ("clock_elapsed", "Elapsed time on clocks", "Clocks", "number, with a picture", "Determines elapsed time across either minutes or hours using clocks", "elapsed time", "Elapsed time is how much time has passed."),
    ("time_forward", "Elapsed time", "Measure", "number", "Solves elapsed-time word problems involving counting forward by either hours or minutes", "elapsed time", "Elapsed time is how much time has passed."),
    ("perimeter_rect", "Perimeter of a rectangle", "Measure", "number", "Solves problems involving perimeters of rectangles within a real-world or mathematical context", "perimeter", "The perimeter is the distance all the way round a shape."),
    ("area_rect", "Area of a rectangle", "Measure", "number", "Determines the area of rectangles with whole-number sides, formula not provided", "area", "Area is the space inside a flat shape. We count it in squares."),
    ("money_change", "Change from 100 baht", "Money", "number", "Solves one-step money word problems involving whole number addition or subtraction", "change", "Change is the money you get back when you pay too much."),
    ("coins_whole", "Value of coins", "Money", "number, with a picture", "Determines the whole number value of a collection of coins given as pictures", "value", "The value of a coin is how much it is worth. The number is on the coin."),
    ("coins_spend", "Spend and change", "Money", "number, with a picture", "Solves word problems involving amount spent or change received, whole numbers, and coin names or pictures", "amount", "An amount is how much money there is."),
    ("coins_equal", "Equal sets of coins", "Money", "tap a choice", "Identifies equivalent sets of coins", "equal value", "Sets with an equal value are worth the same, even with other coins."),
    ("coins_decimal", "Coins with a point", "Money", "an amount of money", "Solves money word problems involving decimals and coins and/or bills given as pictures", "decimal point", "The decimal point splits whole dollars from cents. 1.50 is 1 dollar and 50 cents."),
    ("area_count", "Area: count the squares", "Area and edges", "number, with a picture", "Determines the area of figures composed of whole unit squares", "area", "Area is the space inside a flat shape. We count it in squares."),
    ("area_tile", "Area: tile a floor", "Area and edges", "tap tiles, then a number", "Determines the area of figures by tiling with whole unit squares", "square unit", "A square unit is one square tile. Area is counted in square units."),
    ("area_expr", "Area as a times sum", "Area and edges", "two numbers", "Represents the area of rectangles composed of whole unit squares using multiplication expressions or equations", "area", "The area of a rectangle is rows times the squares in one row."),
    ("perim_labeled", "Perimeter: add the sides", "Area and edges", "number, with a picture", "Determines the perimeter of basic polygons with all sides labeled", "perimeter", "The perimeter is the distance all the way round a shape. Add every side."),
    ("picto_read", "Read a pictograph", "Graphs", "number, with a picture", "Reads pictographs with single-unit scales to determine how many in a category", "pictograph", "A pictograph is a graph made of pictures. It is also called a picture graph."),
    ("bar_build", "Build a bar graph", "Graphs", "build the bars", "Represents data in bar graphs with single-unit scales", "bar graph", "A bar graph uses bars to show how many."),
    ("bar_build_multi", "Build a graph in jumps", "Graphs", "build the bars", "Represents data in bar graphs with multi-unit scales", "scale", "The scale is the numbers up the side of a graph."),
    ("bar_read", "Read a bar graph", "Graphs", "number, with a picture", "Reads bar graphs with single-unit scales to determine how many in a category", "bar graph", "A bar graph uses bars to show how many."),
    ("picto_addsub", "Pictograph sums", "Graphs", "number, with a picture", "Adds and subtracts to answer questions about pictographs with single-unit scales", "pictograph", "A pictograph is a graph made of pictures. It is also called a picture graph."),
    ("bar_addsub", "Bar graph sums", "Graphs", "number, with a picture", "Adds and subtracts to answer questions about bar graphs with single-unit scales", "data", "Data is facts you count and collect."),
    ("bar_multi", "Bar graphs in jumps", "Graphs", "number, with a picture", "Adds and subtracts to answer questions about bar graphs with multi-unit scales", "scale", "The scale is the numbers up the side of a graph."),
    ("picto_multi", "Pictographs with a key", "Graphs", "number, with a picture", "Adds and subtracts to answer questions about pictographs with multi-unit scales", "key", "The key tells you how many each picture stands for."),
    ("shape_sides", "Sides and vertices", "Shapes", "number, with a picture", "Identifies the number of sides or corners of 2-D shapes, given pictures", "vertex", "A vertex is a corner. Two or more are called vertices."),
    ("shape_basic", "Name the shape", "Shapes", "tap a choice", "Identifies and names triangles, squares, rectangles, and circles", "2-D shape", "A 2-D shape is flat. You can name it by its sides."),
    ("sym_line", "Is it a line of symmetry?", "Shapes", "tap a choice", "Recognizes lines of symmetry in 2-D figures", "line of symmetry", "A line of symmetry is a fold line. Both halves match."),
    ("sym_count", "Count lines of symmetry", "Shapes", "number, with a picture", "Determines the number of lines of symmetry in 2-D figures", "line of symmetry", "A line of symmetry is a fold line. Both halves match."),
    ("shape_more", "Name harder shapes", "Shapes", "tap a choice", "Identifies and names nonbasic shapes, such as trapezoids, hexagons, etc.", "polygon", "A polygon is a flat shape with straight sides."),
    ("coord_what", "What is at the point?", "Star maps", "tap a choice", "Interprets points with whole number coordinates in the first quadrant within the given context", "coordinates", "Coordinates are two numbers for a point: along first, then up."),
    ("coord_read", "Read a star map", "Star maps", "two numbers", "Determines the coordinates of points in the first quadrant of a coordinate plane", "coordinates", "Coordinates are two numbers for a point: along first, then up."),
    ("coord_plot", "Mark a star map", "Star maps", "tap the map", "Plots the coordinates of points in the first quadrant of a coordinate plane", "coordinates", "Coordinates are two numbers for a point: along first, then up."),
]
NO_STATEMENT_BAND = {"frac_set": 181}   # [Proposal] from Marc's 2026 tracker, not the engine. Placed with the other fraction work.


def build():
    rows = list(csv.DictReader(open(os.path.join(HERE, "..", "skills", "skill_map.csv"), encoding="utf-8")))
    bands, galaxy = collections.defaultdict(set), {}
    for r in rows:
        bands[r["skill"]].add(int(r["band"].split("-")[0])); galaxy[r["skill"]] = r["galaxy"]
    out, bad = [], []
    for rule, name, group, how, text, word, meaning in RULES:
        if text is None:
            out.append([rule, name, group, "Numerix", how, NO_STATEMENT_BAND[rule], "", "(Marc's 2026 tracker: fraction of a set)", word, meaning]); continue
        if text not in bands: bad.append(f"{rule}: statement not in the engine: {text}"); continue
        b = sorted(bands[text]); out.append([rule, name, group, galaxy[text], how, b[0], " ".join(map(str, b)), text, word, meaning])
    return out, bad


def main():
    out, bad = build()
    path = os.path.join(HERE, "..", "skills", "rule_map.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["rule", "star_name", "group", "galaxy", "answered_by", "lowest_band", "all_bands", "statement", "maths_word", "meaning"]); w.writerows(out)
    names = [r[1] for r in out]
    for n in set(names):
        if names.count(n) > 1: bad.append("two stars share the name: " + n)
    states = {r[7] for r in out if r[6]}
    print(f"{len(out)} rules cover {len(states)} different Math Skills statements, plus 1 from the tracker.")
    print("By lowest band:", dict(sorted(collections.Counter(r[5] for r in out).items())))
    print("By galaxy:", dict(collections.Counter(r[3] for r in out)))
    print("With a picture or a toy:", sum(r[4] != "number" for r in out))
    for b in bad: print("  PROBLEM", b)
    for r in out:
        if not r[8] or not r[9] or len(r[9].split()) > 22: bad.append(f"{r[0]}: maths word missing or too long")
    print("RESULT:", "PASS" if not bad else "FAIL")


if __name__ == "__main__":
    main()
