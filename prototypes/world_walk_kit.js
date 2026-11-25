/*WORLD-WALK-BEGIN  Hold to keep walking.   [Proposal, 25 November 2026]
  [Source: Marc, 25 November: "Especially my phone even on the iPad like I can only tap to the edge of the screen so he walks like four steps then I need to tap again
   and tap again. Is it possible to have it so that like… You tap in a direction he just keeps walking that direction until you… Well, I don't know how you would make it stop."]
  - A tap does what it always did: walk to that square, or use the thing there.
  - Keep the finger down (a quarter of a second or more) and the cadet keeps walking towards the finger. The picture follows him, so the place under the finger
    keeps moving ahead of him: he walks on until the finger lifts. Slide the finger to steer; he finds his way round water, trees and walls.
  - Lift the finger: he finishes the step he is on, and stops.
  - Holding never uses a thing. He only walks. (A thing is still used by a tap on it.)
  - Only on the walking map, and never while words wait to be read, a task is open, or the big map is up. */
const HOLD = (() => {
  let down = null, holding = false, fx = 0, fy = 0;
  const at = e => { const r = cv.getBoundingClientRect(); fx = e.clientX - r.left; fy = e.clientY - r.top; };
  cv.addEventListener('pointerdown', e => { down = { t: performance.now(), id: e.pointerId }; holding = false; at(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
  cv.addEventListener('pointermove', e => { if (down && e.pointerId === down.id) at(e); });
  const end = e => { if (!down || (e && e.pointerId !== down.id)) return; down = null; if (holding) { holding = false; if (P.route.length > 1) P.route.length = 1; P.then = null; } };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end); cv.addEventListener('lostpointercapture', end);
  function tick() {
    if (down && S && S.at === 'map' && !reading() && !PIC && !TASK && !BIG && performance.now() - down.t > 250) {
      holding = true; geo();
      const tx = Math.floor(V.ox + fx / V.ts), ty = Math.floor(V.oy + fy / V.ts);
      if (Math.hypot(tx - P.px, ty - P.py) > .8 && P.route.length < 2) { const r = pathTo(tx, ty); if (r.length) { P.route = r; P.then = null; } }
    } else if (holding && (!down || reading() || PIC || TASK || BIG)) holding = false;
    requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
  return { get holding() { return holding; } };
})();
/*WORLD-WALK-END*/
