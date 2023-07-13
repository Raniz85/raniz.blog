---
title: "The Benefits of TDD"
description: 
date: 2023-08-17
draft: true
thumb: "ben-white-qDY9ahp0Mto-unsplash.jpg"
thumbCaption: "Photo by Ben White via Unsplash"
thumbCaptionHref: "https://unsplash.com/photos/qDY9ahp0Mto"
tags:
  - tdd
  - testing
  - development
  - methodology
---

<div class="quote text-4xl">
    There is never enough time to do it right,
    but there is always enough time to do it over.
    <div class="source mt-4">John W. Bergman</div>
</div>

I have always liked this quote because I think it embodies an issue I see a lot in the software industry:
We are in a hurry, so we take shortcuts. And then we pay the price of those shortcuts later - with interest.

In the end, taking these shortcuts almost always slow us down,
and we are slowed down more and more as time goes on.
Eventually we arrive at a point where we think the technical debt accumulated is so vast that it is a better idea to rewrite the project from scratch than fixing it.

The other solution is of course to be disciplined and not take as many shortcuts.
And _that_ is why I practice TDD.

I have written about TDD [before](2023-03-09_tdd-bowling/) on this blog, so I am not going to introduce the concept here,
but instead I want to focus on _why_ I practice TDD and the benefits I see.

# Design
This might surprise you, but _number of tests_ or _test coverage_ is not at the top of my list of benefits of TDD. 
When driving development with tests we naturally produce testable code,
which in turn improves the design by making our software loosely-coupled.

When writing the implementation first it is easy to write large methods with static dependencies,
but those methods are often hard to test and test cases may end up with convoluted setups to be able to influence the
code under test - or we might not be able to influence them at all, depending on the language used.

When writing the test first, however, no one (sane) is going to start with a convoluted setup which means that the
resulting code will be independent and thereby easier to grasp and change in the future.

# Incremental Problem Solving
Software development at its core is about solving problems.
Sometimes they are small problems that can be solved without much thought.
Other times they are large and complex problems that cannot be solved at a glance.

With TDD we do not need to solve everything at once.
Instead, we pick _one_ use case, write a test for that and solve it.
We then pick another use case, write a test for _that_ and solve it,
refactoring the code as necessary to support the new use case while ensuring that all previous use cases are still supported.

Not only does this mean that the code evolves naturally,
it also means that we train ourselves to be better at refactoring.

Refactoring changes from being a big deal to something we do _all the time_.

# Knowing When To Stop
I have been guilty of over-designing solutions in the past.
It is easy to think ahead towards what will be needed next week or even a few months from now.

The problem with this is that what we now _think_ we need later may not turn out to be true.
Requirements change and other parts of the software evolve.
This means that the code we write today to make the future easier may very well end up hindering us in the future.
The implementation we actually end up doing may be very different from the one we _thought_ we would be doing -
or we might end up dropping that feature completely, leaving us with an unnecessarily complex solution.
This is called _YAGNI_ - or You Aren't Going to Need It - i.e. do not write code that is not needed _right now_.

By driving the development with tests and only writing code to satisfy the tests we write,
we get a natural obstacle to running ahead of ourselves because if we want to do that fancy forward-thinking
implementation we need to write tests that require it first.

This also ties in with KISS - Keep It Simple Stupid, which means that one should not overcomplicate things but rather
keep it simple until complexity is required (by a test case).

# Tests, Tests, Glorious Tests
A side effect of driving the implementation forward by writing tests is that when we are finished we have all these tests lying around.

We _might_ throw them away (in fact, someone once told me they actually do this),
but I suggest keeping them around -
I am even going to go as far as suggesting to automate running them before any changes are accepted into the main branch.

If we are disciplined in our TDD-practice we will have test cases for every supported functionality of the software and this comes with a host of benefits.

## Tests are _Meaningful_ and _Correct_
By making sure that the tests fail before we implement the functionality,
we ensure that our tests actually assert functionality (instead of merely pretending to do so).
I think this is such an important aspect of TDD that I have written an entire [blog post](/2023-06-26_who_tests_your_tests/)
about it.

Moreover, because the tests are written to drive the implementation forward they are inherently _meaningful_.

## Improved Functional Quality
Since all the functionality has been implemented by testing it first we can be reasonably sure that it is also correct.
This, of course, requires us to write enough tests to assert correct behaviour from the code,
which in turn requires discipline in adhering to only driving development forwards by writing more tests.

Another benefit of TDD that contributes to this for me is that I have different mindsets when writing test cases and implementing the functionality they require.

When writing tests I am thinking more about inputs, outputs and error-conditions than I am when I am writing implementation code.
This leads to better handling of errors and edge-cases than if I were to just implement something without test-driving it.
Your mileage will vary here, but I think that the more tests you write, the better you get at this.

All this _should_ lead to fewer bugs and hotfixes,
improving our user's trust in us as well as the developers confidence in the software they produce.
With enough confidence we might actually deploy to production on a friday afternoon without risking the weekend.

## Bugs are Missing Tests
Bugs are no longer mistakes, they are test-cases we did not write to drive that specific functionality.

By thinking about bugs this way we get an opportunity to consider _why_ we never wrote that test from the beginning.
It might be because the specification was incomplete,
or it might be because we were not diligent enough in thinking about possible edge- or error-cases.
In any case, it is an opportunity to either fix our design process, or for personal growth - or a little bit of both.

## Tests are Documentation
The tests convey the assumptions we had about the implementation when we wrote it,
serving as a better form of documentation than external text documents -
or even text documents in the same repository.
This is because, unlike text documents, the tests need to change if the behaviour changes,
forcing us to keep the "documentation" up to date.

Now, I am not saying that external documentation is unnecessary,
but I think that the tests supplement any external documentation in a good way which leaves external documentation free to focus on higher-levels and leave out implementation details.

## Confident Refactoring
With high test coverage we can be confident that whatever changes we make are safe as long as all the tests pass when we are done.
The fact that test-driving code means it is looser coupled also makes it a lot easier to refactor.

This goes hand in hand with KISS and YAGNI because adhering to both require us to be able to make the necessary changes when they _are_ required.
If we are confident enough in our test coverage there is no need to overcomplicate things,
because we know that once we _need_ to make it more complex we can lean back against our tests.

# Velocity
All of the above combine to improve the velocity of _the whole team_ -
i.e. while each individual may not produce as much code as quickly as without TDD,
the project as a whole will move forward at a steadier pace if everyone practice TDD.

If you're familiar with [Theory of Constraints](https://www.goodreads.com/book/show/582174.Theory_of_Constraints),
TDD optimizes for a global maxima (velocity of the project) instead of a local (velocity of each individual member).

# Summing Up
In summary,
TDD does not only produce a lot of tests,
but leads to better design, higher quality, easier refactoring, natural documentation, and leads to us developers improving our ways of thinking about code.

With all these benefits, I think you should give TDD a go -
you might discover that it's not as difficult as you think :)


