---
title: "Can you Test-Drive Music?"
description: "I think Martin Molin of Wintergatan is test-driving his Marble Machine 3. Here is why."
date: 2023-12-11
thumb: "wintergatan-testbench.jpg"
thumbCaption: "Screencap from the video on the Wintergatan YouTube channel showing Martin's test setup"
tags:
  - tdd
  - development
---

While I sat in the sofa, scrolling through my YouTube subscriptions yesterday I came upon this video by Wintergatan.

For those of you not familiar with Wintergatan, Martin of the band Wintergatan is creating his third version of a
machine that plays music with metal marbles. You can see the original machine from 2016 [here](https://www.youtube.com/watch?v=IvUU8joBb1Q).

He's currently developing the third installment of this machine after abandoning the second version (Marble Machine X).

What stood out to me in this video was the segment where he talks about his current development method:

> [...] but what I do know, is that my method of working now is absolutely amazing. Because on my previous machines, these were the things that came up as surprises when I've already finished building the whole machine.
> So now I'm finding these things out in the test-environment fast and cheap. It's brilliant.

To my ears, Martin is describing test-driven development. Let's analyze his workflow:

He starts out with a testbed - the vibraphone set up so that he can drop marbles on it.
Then he proceeds to fail the test by dropping a metal marble directly on a bar, concluding that the sound is terrible.

The next step is to make the test pass by using the adjustable forks to hold a rubber band over the metal bar at different heights.

When looking at this implementation, he comes up with another possible problem -
the variation in when the marble hits the bar -
and proceeds to devise a test for that in his MM3 test-bed.

He doesn't actually see the test fail before he concludes that it isn't an issue, but the amount of manual verification
involved and the fact that we can actually hear it for ourselves earns him a pass on this one :)

Now, this isn't software, nor is it automatable, but I found it interesting to note how similar his workflow is to
test-driven development.

You can see the whole video [here](https://www.youtube.com/watch?v=xTYnwKxlLIQ).
