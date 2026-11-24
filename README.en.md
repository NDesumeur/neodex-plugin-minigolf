# Minigolf

A nine-hole minigolf course, with sand, water, obstacles and walls the ball bounces off. Pull back to aim and set the power, release to hit, and finish the course in as few strokes as possible.

*Version française : [README.md](README.md)*

## Several players (new in 1.2.0)

The **Players** choice (1 to 4) lets several people play on the same PC, taking turns. Each player has their own ball (white, red, blue, yellow); when the ball stops, it is the next player's turn. A player who finished the hole waits for the others (10 strokes at most per hole). After each hole, a board shows everyone's strokes and total, then the winner at the end of the course.

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

The **Course** list also offers:

- **Pirate island**: a grass island in the middle of the sea, palm trees, a pirate flag, water everywhere and **drawbridges**;
- **Ice floe**: snow, fir trees, patches of **ice** where the ball slides far, windmills and conveyor belts;
- **Space station**: metal plates among the stars, **black holes** that pull the ball in and swallow it (one-stroke penalty), **void** that works like water, and conveyor belts;
- **Random**: each new game creates nine new holes, with sand, water, posts and moving obstacles, placed without ever blocking the way.

The three themed courses are always the same, so you can beat your record on each. The par (2 to 5) depends on the length of the route, with one more stroke if there is water or several moving obstacles.

## Moving obstacles

- **The windmill**: its four sails turn in front of the door; the ball gets through between two sails, otherwise it bounces back.
- **The drawbridge**: it rises regularly; a ball on the bridge, or arriving while it is up, falls into the water.
- **The conveyor belt**: its arrows move and push the ball, even when stopped, to the end of the belt.

## Scoring

The top of the screen shows the hole number, its par and your strokes. Each finished hole gives its result: hole in one, albatross (−3), eagle (−2), birdie (−1), par, bogey (+1), double bogey (+2) or more. At the end, your total is compared with the course par.

## Statistics

Best round (fewest strokes over nine holes), rounds finished, holes in one and the current round's total.

## Full screen

The **Full screen** button fills the whole screen with the course (Escape to leave). Otherwise it takes all the room the window leaves, from a small laptop to a big screen.

## Data and sync

Your statistics and the chosen course are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Minigolf → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
