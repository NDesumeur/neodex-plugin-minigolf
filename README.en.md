# Minigolf

A nine-hole minigolf course, with sand, water, obstacles and walls the ball bounces off. Pull back to aim and set the power, release to hit, and finish the course in as few strokes as possible.

*Version française : [README.md](README.md)*

## How to play

- **Click and hold** anywhere on the course, then **pull back**: dots show the direction of the shot, opposite to your gesture.
- The further you pull, the stronger the shot; the gauge at the bottom left goes from white to yellow, then red near the maximum.
- **Release** to hit. A gesture that is too short is ignored and does not count as a stroke.
- You cannot shoot while the ball is rolling.
- Once the ball is in the hole: **click**, **Space** or **Enter** to move on to the next hole.

## The course

- **Grass** slows the ball gently.
- **Sand** slows it a lot.
- **Water** goes "splash": the ball returns to where it was hit, with a one-stroke penalty.
- **Walls** and obstacles bounce the ball back, losing a little speed.
- The edge of the hole pulls in a slow ball a little; a ball that is too fast rolls over it.

## Holes

The standard course has nine fixed holes, from par 2 to par 5, for a total par of 31: a straight line, bends, a bunker in the middle, a stream to cross, a pond with a single way through, staggered posts…

With the **Random course** option, each new game creates nine new holes: a winding fairway, then sand, water or an obstacle placed without ever blocking the way. The par (2 to 5) depends on the length of the route, with one more stroke if there is water.

## Scoring

The top of the screen shows the hole number, its par and your strokes. Each finished hole gives its result: hole in one, albatross (−3), eagle (−2), birdie (−1), par, bogey (+1), double bogey (+2) or more. At the end, your total is compared with the course par.

## Statistics

Best round (fewest strokes over nine holes), rounds finished, holes in one and the current round's total.

## Data and sync

Your statistics and the random course choice are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Minigolf → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
