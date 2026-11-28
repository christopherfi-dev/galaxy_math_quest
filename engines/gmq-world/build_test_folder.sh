#!/bin/sh
# Builds the zip Marc uploads to a TEST folder of his site: engines/gmq-world/GMQ_Server_Test_Folder.zip
# It holds the server, the Commander's Desk, the steps, and the game as play.html.
# The game is the class link's copy (docs/index.html) unless another file is named:  sh engines/gmq-world/build_test_folder.sh prototypes/kis_station_sketch.html
# It never holds api/config.php or a data folder. Run it from the repository's top folder.
set -e
GAME="${1:-docs/index.html}"
OUT="engines/gmq-world/GMQ_Server_Test_Folder.zip"
TMP="$(mktemp -d)"; DIR="$TMP/gmq-test"
mkdir -p "$DIR/api/constraints" "$DIR/tools"
cp engines/gmq-world/server/index.html engines/gmq-world/server/teacher.html engines/gmq-world/server/cards-test.html "$DIR/"
cp engines/gmq-world/server/api/gmq-world-api.php engines/gmq-world/server/api/gmq-world-cards.php engines/gmq-world/server/api/gmq-world-cardlist.php engines/gmq-world/server/api/config.sample.php "$DIR/api/"
# the battle thread's card list, and its battle piece (GMQBattleOwn), copied as they are
cp docs/battle/cards.json "$DIR/api/cards.json"
sh engines/gmq-world/battle_piece.sh docs/battle/own.html > "$DIR/battle-piece.js"
cp engines/gmq-world/constraints/gmq-world.txt "$DIR/api/constraints/"
cp engines/gmq-world/server/tools/set-teacher-password.php "$DIR/tools/"
cp engines/gmq-world/READ_ME_FIRST.md "$DIR/"
cp "$GAME" "$DIR/play.html"
VER="$(grep -o 'id="t_ver">[^<]*' "$DIR/play.html" | sed 's/.*>//')"
sed -i "s|<!--GAMEVER-->[^<]*<!--/GAMEVER-->|<!--GAMEVER-->$VER, copied on $(date +%Y-%m-%d)<!--/GAMEVER-->|" "$DIR/index.html"
if [ -e "$DIR/api/config.php" ] || [ -e "$DIR/api/data" ]; then echo "STOP: a settings file or saved games would be in the zip"; exit 1; fi
rm -f "$OUT"; (cd "$TMP" && zip -q -r -X gmq-test.zip gmq-test); mv "$TMP/gmq-test.zip" "$OUT"; rm -rf "$TMP"
echo "Built $OUT with the game: $VER"
echo "sha256: $(sha256sum "$OUT" | cut -d' ' -f1)   (the fingerprint Marc compares after downloading it)"
unzip -l "$OUT"
