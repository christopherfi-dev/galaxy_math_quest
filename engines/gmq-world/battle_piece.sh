#!/bin/sh
# Prints the battle thread's piece (GMQBattleOwn), the lines between its two markers, exactly as they are.
# Used by build_test_folder.sh and the server checks. Usage: sh engines/gmq-world/battle_piece.sh docs/battle/own.html > battle-piece.js
set -e
awk '/\/\* ===== GMQ BATTLE: start =====/{on=1} on{print} /\/\* ===== GMQ BATTLE: end ===== \*\//{exit}' "$1"
