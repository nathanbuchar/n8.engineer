# Tic-tac-toe strategies
###### Mar 23, 2018

---

#### Table of Contents

[[toc]]

## Background

In March of 2018, my office had a Tic-Tac-Toe tournament as part of our annual Office Olympics. Our team took it very seriously (well, I did at least). The following is a curation of Tic-Tac-Toe strategies that I learned in high school, where nearly every day during lunch for almost two years I would play non-stop Tic-Tac-Toe with a friend of mine.

TL;DR: Whether you start or not, it's impossible to lose if you play correctly. Those who start have the advantage, and some starting moves are better than others.

## Basic Rules

Follow these basic rules:

1. **Always play the center if you can**
1. **Play only corners except if...**
     * You encounter the dangerous "Diagonal" case, mentioned in the section below.
     * Playing an edge will allow *you* to win immediately.
     * Playing an edge will prevent *your opponent* from winning immediately.
     * There are no remaing corners to play.
1. **It may sometimes be necessary to play a *specific* corner** to prevent your opponent from winning immediately, or from having an opportunity to win later in the game (see [Notable Cases and Exceptions](#notable-cases-and-exceptions)).

If played properly, it is impossible to lose. The worst you can do is tie with your opponent. When playing first, play aggresively. When playing second, play defensively. The player that goes first has all the power!


## Notable Cases and Exceptions

Assuming you follow the basic rules outlined above, there are a few special cases to be aware of which may indirectly allow your opponent to have an opportunity to win later in the game.

### The Diagonal

⚠️ This is the most dangerous case! ⚠️

Following the basic rules, if your opponent (⭕️) plays first and plays two opposite corners (this will form a long diagonal line), you **MUST BREAK THE RULES AND PLAY ANY EDGE**, otherwise your opponent will win.

```
⭕️|❔|❔      ⭕️|❔|🛑 <-- do not play either corner!
❔|❌|❔  ->  ❔|❌|❔
❔|❔|⭕️      🛑|❔|⭕️
```

If you play **second** and your opponent creates a diagonal, play an edge!

```
⭕️|❔|❔      ⭕️|❔|❔
❔|❌|❔  ->  ❔|❌|❌ <-- play an edge!
❔|❔|⭕️      ❔|❔|⭕️
```

### The Wedge

Following the basic rules, if your opponent (⭕️) plays first and plays an edge followed by an adjacent edge (this will form a "wedge shape"), you **MUST NOT** play the corner opposite the wedge, otherwise your opponent has an opportunity win.

```
❔|⭕️|❔      ❔|⭕️|❔
⭕️|❌|❔  ->  ⭕️|❌|❔
❔|❔|❔      ❔|❔|🛑 <-- do not play here!
```

If you see a wedge, fill in the square!

```
❔|⭕️|❔      ❌|⭕️|❔ <<-- fill in the square!
⭕️|❌|❔  ->  ⭕️|❌|❔
❔|❔|❔      ❔|❔|❔
```

```
❔|⭕️|❔      ❔|⭕️|❌ <-- You may also want to play one of the other
⭕️|❌|❔  ->  ⭕️|❌|❔     two remaining corners, as your chance to win
❔|❔|❔      ❔|❔|❔     is less noticeable.
```

### The L

Following the basic rules, if your opponent (⭕️) plays first and plays a corner followed by a non-adjacent edge (this will form an "L shape"), you **MUST NOT** play the corner opposite the "L", otherwise your opponent has an opportunity win.

```
⭕️|❔|❔      ⭕️|❔|🛑 <-- do not play here!
❔|❌|❔  ->  ❔|❌|❔
❔|⭕️|❔      ❔|⭕️|❔
```

If you see an L, fill in the corner!

```
⭕️|❔|❔      ⭕️|❔|❔
❔|❌|❔  ->  ❔|❌|❔
❔|⭕️|❔      ❌|⭕️|❔ <<-- fill in the L!
```

## Winning Strategies

### Opposite Corner

Following the basic rules, if you (❌) play first and your opponent plays an edge, play either corner opposite their edge to have an opportunity to win.

```
❔|❔|❔      ❔|⭕️|❔      ❔|⭕️|❔      ❔|⭕️|⭕️      ❌|⭕️|⭕️
❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔
❔|❔|❔      ❔|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❔
```

### The Diagonal

Following the basic rules, if you (❌) play first and your opponent plays a corner, play the corner opposite their's to increase your odds of winning. Playing the other two corners will likely result in a tie (if played correctly).

If they then play any edge, you will have an opportunity win. Note the following variants:

**Variant A** - The adjacent edge
```
❔|❔|❔      ❔|❔|⭕️      ❔|❔|⭕️      ❔|⭕️|⭕️      ❌|⭕️|⭕️
❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔
❔|❔|❔      ❔|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❔
```

**Variant B** - The opposite edge
```
❔|❔|❔      ❔|❔|⭕️      ❔|❔|⭕️      ❔|❔|⭕️      ❔|❔|⭕️
❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔  ->  ⭕️|❌|❔  ->  ⭕️|❌|❔
❔|❔|❔      ❔|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❌
```

### Playing the Corner

This strategy is a departure from the basic rules, but unlike playing the center first wherein you have a 50% base chance of winning, with this strategy you will instead have a **91.67%** chance of winning. This is because—if played properly—the only square your opponent may play without setting themselves up to lose is the center, and even if they play the center they still have a 33% chance to lose. This means your opponent only has a 8.33% chance of not losing if they play without strategy. However, this method requires a bit more thought, and **it will only work if you are first to play**. If played properly, your opponent can never win, and they will only tie less than 10% of the time.

The basic rules for this method are as follows.
1. Play any corner first
1. If they first play an edge, play the center. After they block you…
    * if the edge they first played was *adjacent* to your corner, play the opposite corner from their edge

        adjacent edge = opposite corner
    * if the edge they first played was *opposite* your corner, play the adjacent corner to their edge (to stop them from winning)

        opposite edge = adjacent corner
1. If they first play the opposite corner, play both corners.
1. If they first play an adjacent corner, play the edge next to your corner but opposite their's. When they block you, block them.

**Variant A** - The adjacent edge

If they (⭕️) play an adjacent edge to your corner, play the center. When they block your win, play the corner farthest from their first edge.

Adjacent edge = opposite corner

```
❌|❔|❔      ❌|⭕️|❔      ❌|⭕️|❔      ❌|⭕️|❔      ❌|⭕️|❔
❔|❔|❔  ->  ❔|❔|❔  ->  ❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔
❔|❔|❔      ❔|❔|❔      ❔|❔|❔      ❔|❔|⭕️      ❌|❔|⭕️
```
```
❌|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❌
❔|❔|❔  ->  ⭕️|❔|❔  ->  ⭕️|❌|❔  ->  ⭕️|❌|❔  ->  ⭕️|❌|❔
❔|❔|❔      ❔|❔|❔      ❔|❔|❔      ❔|❔|⭕️      ❔|❔|⭕️
```

**Variant B** - The opposite edge

If they (⭕️) play an opposite edge to your corner, play the center. When they block your win, block their win by playing the corner closest to their edge, and this will put you in a winning position.

Opposite edge = adjacent corner

```
❌|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❔
❔|❔|❔  ->  ❔|❔|❔  ->  ❔|❌|❔  ->  ❔|❌|❔  ->  ❔|❌|❔
❔|❔|❔      ❔|⭕️|❔      ❔|⭕️|❔      ❔|⭕️|⭕️      ❌|⭕️|⭕️
```
```
❌|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❌
❔|❔|❔  ->  ❔|❔|⭕️  ->  ❔|❌|⭕️  ->  ❔|❌|⭕️  ->  ❔|❌|⭕️
❔|❔|❔      ❔|❔|❔      ❔|❔|❔      ❔|❔|⭕️      ❔|❔|⭕️
```

**Variant C** - The opposite corner

If they (⭕️) play the corner opposite yours, retaliate by playing any of the other two corners. When they block your win, play the last corner, and this will put you into a winning position.

Opposite corner = play all corners

```
❌|❔|❔      ❌|❔|❔      ❌|❔|❌      ❌|⭕️|❌      ❌|⭕️|❌
❔|❔|❔  ->  ❔|❔|❔  ->  ❔|❔|❔  ->  ❔|❔|❔  ->  ❔|❔|❔
❔|❔|❔      ❔|❔|⭕️      ❔|❔|⭕️      ❔|❔|⭕️      ❌|❔|⭕️
```

**Variant D** - The adjacent corner

If they (⭕️) play a corner adjacent yours, retaliate by playing the corner opposite your first corner. When they block your win, play the remaining corner, and this will put you into a winning position.

Adjacent corner = play diagonally, and play only corners

```
❌|❔|❔      ❌|❔|⭕️      ❌|❔|⭕️      ❌|❔|⭕️      ❌|❔|⭕️
❔|❔|❔  ->  ❔|❔|❔  ->  ❔|❔|❔  ->  ❔|⭕️|❔  ->  ❔|⭕️|❔
❔|❔|❔      ❔|❔|❔      ❔|❔|❌      ❔|❔|❌      ❌|❔|❌
```
```
❌|❔|❔      ❌|❔|⭕️      ❌|❔|❔      ❌|❔|❔      ❌|❔|❌
❔|❔|❔  ->  ❔|❔|❔  ->  ❔|❔|❔  ->  ❔|⭕️|❔  ->  ❔|⭕️|❔
❔|❔|❔      ⭕️|❔|❔      ⭕️|❔|❌      ⭕️|❔|❌      ⭕️|❔|❌
```

**Variant E** - The center

If they (⭕️) play the center, you have a 33% chance of winning (67% chance of tieing). Play the opposite corner of your first corner (see the Diagonal Case). If they then play a corner, play the remaining corner, and this will put you into a winning position.
```
❌|❔|❔      ❌|❔|❔      ❌|❔|⭕️      ❌|❔|⭕️
❔|❔|❔  ->  ❔|⭕️|❔  ->  ❔|⭕️|❔  ->  ❔|⭕️|❔
❔|❔|❔      ❔|❔|❌      ❔|❔|❌      ❌|❔|❌
```
```
❌|❔|❔      ❌|❔|❔      ❌|❔|❔      ❌|❔|❌
❔|❔|❔  ->  ❔|⭕️|❔  ->  ❔|⭕️|❔  ->  ❔|⭕️|❔
❔|❔|❔      ❔|❔|❌      ⭕️|❔|❌      ⭕️|❔|❌
```
