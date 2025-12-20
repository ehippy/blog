---
title: "Game Dev with Microsoft Makecode Arcade"
featured_image: princessLastStandScreenShot01.png
tags: [Game Design, Personal Growth]
---

My five year old has been taking some online programming classes that teach fundamentals using block programming. He's using this awesome iPad app [ScratchJr](https://apps.apple.com/us/app/scratchjr/id895485086) that focuses on movement and animation. It has some really neat fundamental concepts and sneaks in some clever stuff like interprocess messaging. 

<!--more-->

### Block Programming
Block programming is all about _seeing_ what you're doing. You aren't looking up method names in a wiki somehwere, you're dragging and dropping legos to make things happen. ScratchJr got me interested in where he should go next, and I quickly found Microsoft's MakeCode project. This is an awesome browser-based programming experience that's extensible and super-well supported. They even have a game-development-centric version called [MakeCode Arcade](https://arcade.makecode.com/). 

![Block programming example](/images/princessLastStandBlockExample.png)

### Princess' Last Stand
What started as a casual looksee quickly spiraled out into a weeklong game jam that in the end yielded this fun little shooter game, Princess' Last Stand! Editing pixel art, mixing sounds, editing little 8-bit tunes?! What a playground! I had a super-fun time putting together this quick little game. After a few rounds of practice, you should be able to beat the game in about two minutes. Give it a try below: *WASD* to move, *space* to shoot, and *E* to use your super-weapon, "Truth's Light!".
<br /><br />

<div style="position:relative;height:0;padding-bottom:117.6%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://arcade.makecode.com/---run?id=_PHvbrtU1K5bU" allowfullscreen="allowfullscreen" sandbox="allow-popups allow-forms allow-scripts allow-same-origin" frameborder="0" title="Princess' Last Stand game"></iframe></div>

### Hardware, tho!
Turns out, it doesn't stop in the simulator in your browser, you can also run these apps on some tailor-built microcontrollers. Adafruit makes this great little board called the [Pygamer](https://www.adafruit.com/product/4242) that actually connects a COM port _through Chrome_ straight to MakeCode Arcade, letting you download your into the machine super-easily.


![Pygamer running MakeCode Arcade](/images/pygamer.png)

### You gotta try this!
Even if you've just got a passing interest, head over to [MakeCode Arcade](https://arcade.makecode.com/) and take some of their tutorials for a spin! They're pretty great, and it's really fun to play with. Little things like your xbox controller just working with the simulator, to the easy sharibility and [GitHub](https://github.com/ehippy/princesslaststand) integration make it a super-tidy package. What can you throw together in a couple evenings?