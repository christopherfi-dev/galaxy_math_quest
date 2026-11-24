# Wiring the market into the game

**Date:** 24 November 2026. **From:** the trade thread. **For:** the main thread.
**What:** how to put Galactic Trade, rebuilt as a market (`docs/trade/index.html`), into the game in place of version 97's trading season.
Everything here is **[Proposal]**. Choices made without Marc are marked **[pick]**.

---

## 1. What you are wiring in

- One piece of code, `GMQTrade`, between two marked lines in `docs/trade/index.html`:
  - `/* ===== GMQ TRADE: start =====`
  - `/* ===== GMQ TRADE: end ===== */`
- Copy the whole block, as it is, into the game's script. Do not copy the page's stand-in (the second `<script>`): the game has its own versions of everything in it.
- The block uses no optional chaining and no nullish operator. `node checks/parse_check.js` will confirm it inside the game.
- It draws on the game's canvas, and writes its words, boxes and buttons with the game's `toy()`. It gives one item: `'stone'`.

## 2. What the piece needs from the game

One object, made once. The last four are read on every frame, so give them as getters.

```js
const MARKET_HOST = {
  say, beep, card, give, has, save, toy, closeToy,
  get cx() { return cx; }, get vw() { return vw; }, get vh() { return vh; }, get tNow() { return tNow; }
};
```

- `toy(html)`: the game's own. Its number pad already serves the market's boxes: they are `<input inputmode="numeric">` in `#toy`, and the main button is `#try`, so the pad's OK key presses it.
- `card()`: called once, when the child buys Voltara's supplies. **[pick]** That is the market's card. Change it if a card should come at another moment.
- `give('stone')`: when the child buys the glow stone on Planet R.
- `has('stone')` and `has('lantern')`: a child who dug up the tall tree's stone is told so, and needs only the supplies.

## 3. The changes, in order

1. **Copy the block** into the game, after the old Galactic Trade section. Keep the old section for now; the steps below stop calling it.
2. **Make `MARKET_HOST`** (above).
3. **Open the market where the beacon opens trade.** In `tradeTry()`, after its two checks (at Numerix, and `tradeOpen()`), replace the rest with:
   ```js
   S.market = S.market || { seed: S.seed };
   if (S.trade && S.market.lastSeason === undefined) S.market.lastSeason = S.trade.best || S.trade.gems || 0;
   widget = { kind: 'market' };
   GMQTrade.open(MARKET_HOST, S.market, why => { widget = null; closeToy(); save(); say(why === 'finished' ? 'Your work at the market is done.' : 'You leave the trade beacon. Come back when you are ready.'); });
   return 'You hail the trade beacon. The trade board opens.';
   ```
4. **Draw it.** Beside line 2628 (`if (widget && widget.kind === 'trade') return drawTrade(dt);`), add:
   `if (widget && widget.kind === 'market') return GMQTrade.frame(dt);`
5. **Taps on the picture.** Beside line 3175 (`... return tradeTap(x, y);`), add:
   `if (widget && widget.kind === 'market') return GMQTrade.tap(x * vw, y * vh);`
   (The game passes fractions of the picture; the piece wants CSS pixels.)
6. **The glow stone is now sold on Planet R, through the market.** Change three places:
   - `tradeStone()` and the word "buy glow stone" (line 748, line 3165): send the child to the market. For example: "Planet R sells glow stones, for 300 gems. Open the trade beacon to earn them."
   - The glassmaker's line (line 3949): "Voltaran traders sell glow stones at the trade beacon, for 200 gems" becomes "Planet R sells glow stones, for 300 gems. Trade at the beacon to earn them."
   - `LANPRICE` (200) is no longer used.
7. **The small worlds.** Version 97 opened them from the trade plan ("Just visit: Land on B", after a planet was scanned by rounding). The market has no scans and no "Land on" buttons. **Someone must choose a new way in** (section 5, choice 1). The piece offers `GMQTrade.visited(S.market)`: the planets a child has sold to, and R once they have flown there.
8. **Remove the old season's traces** where a child sees them: the status pill "Trip N of 3 · gems", mission lines about the season, and the 7,000-gem record.
9. **Old saves.** `S.trade` (version 97) is left as it is. **[pick]** The market starts fresh, with the Council's gift, and the old season's gems show as one line in the ship's log: "Last season, before the market: 2,000 gems." Marc decides (section 5, choice 3).

## 4. Tests to run after wiring

| Test | Why |
|---|---|
| `node checks/parse_check.js` | The game still parses, with no optional chaining and no nullish operator |
| `node checks/trade_market_check.js 20000 prototypes/kis_station_sketch.html` | The rule inside the game is still the checked rule (it reads between the markers). About one minute |
| `node checks/trade_market_test.js` | The market's own play test, on its page. Run it again if the block changes |
| `checks/galactic_trade_test.js` | **Must be rewritten.** It plays version 97's season, which is gone. The market's test shows how to drive the new one (it reads the board from the saved state and works out the best plan itself) |
| `checks/lantern_chain_test.js` | **Must change.** Its "trader (too few gems, then bought)" step bought the stone at the beacon for 200 gems. Now the stone comes from Planet R through the market, or from the tall tree |
| `checks/small_worlds_test.js` | Whichever way into the small worlds is chosen, it must still reach them |
| A play in the game, at the three sizes | Open the beacon, play one trip, close the game in mid-flight, open it again, buy the stone, check the lantern chain takes it |

## 5. What the main thread must decide, or ask Marc

1. **The way into the small worlds** (step 7). My pick: **A**.
   - **A:** a planet a child has sold to can be landed on (`GMQTrade.visited`). Trading opens the galaxy. Small cost.
   - **B:** keep version 97's scan (round its distance and pay) as a separate "Land on a planet" list at the beacon. Rounding stays in the small worlds. More to keep.
   - **C:** all 20 are open from the start. Simplest. Loses the reason to go.
2. **The card** for buying the supplies (step 2). My pick: one card, then.
3. **Old saves** (step 9): fresh start, with the old season kept as a log line. Marc's choice 6 in the handoff.
4. **The Power Module:** left out of the market's list. It waits on the plan's decision 1.
5. **The far planet's name:** "Planet R" until Marc names it. If he does, change the letter in the words only. The rule uses `K.stone = 'R'` for its place and distance (60 light-years, 120 gems of fuel).
