---
title: "The Hats of Test Driven Development"
description: ""
date: 2023-11-01
thumb: "stephen-hocking-QxeihtV-5Kk-unsplash.jpg"
thumbCaption: "Credit: Stephen Hocking via Unsplash"
thumbCaptionHref: "https://unsplash.com/photos/five-brown-straw-nesting-hats-on-white-textile-QxeihtV-5Kk"
tags:
  - tdd
  - testing
  - requirements
  - methodology
---
A while ago I held an internal TDD-workshop at one of our customer's offices.
We took on a simple task together where the solution turned out to be a lot more complex than it initially seemed.

When initially looking at the task and the existing code,
it looked very much like it would be enough to modify an if-statement and add another condition.
That would have been a two-minute fix:
add the condition, open the browser and test that it works.

Commit, push, close ticket, done.

Except that we didn't just add the condition and call it a day &mdash; we were test-driving this.

We started out with the problem outlined in the ticket,
wrote a test case for that and implemented it.

While writing the test case, however,
we started discussing and wrote a list of other cases to test that weren't mentioned in the ticket.

In the end we found multiple edge-cases that would have triggered the wrong functionality.
The actual solution ended up being complex enough that a helper method was introduced to keep the if-statement short.

This is one of the strengths I see in TDD: Thinking about which tests to write puts you (it does for me at least) in a different state of mind.

I often think of the two major phases of TDD (writing a test and writing the implementation) like me wearing different hats: one tester hat and one programmer hat.

(The hats are metaphorical and I don't actually have any, maybe I should fix that...)

When wearing the tester hat I think about the requirements of the implementation.
I analyze what's in the ticket,
see if it makes sense and try to figure out if I can come up with edge-conditions that will make the code misbehave.
This not only helps identify issues with the specification,
it also means the end-result will be more robust
(and errors will likely be better handled).

When wearing the programmer hat I write code to make the tests pass,
but I also think about the quality of the implementation,
how it fits in with the rest of the program,
and try to adhere to all the principles about code that I value &mdash;
I adhere to these while writing tests as well, but tests tend to be a lot more independent, so they're easier to keep clean.

The ability to switch between these two ways of thinking about the implementation &mdash;
or switching hats if you will &mdash;
is, in my view, one of the things that makes me a _software engineer_ and not just a _programmer_.
