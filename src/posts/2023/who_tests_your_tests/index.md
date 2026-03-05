---
title: "Who Tests your Tests?"
description: "Can we learn anything about testing from Sam Vimes of the Discworld novels?"
date: 2023-06-26
thumb: "leptos-tests.png"
tags:
  - tdd
  - testing
  - development
  - methodology
---
We write tests to ensure that our code is correct, but who ensures that our tests are correct?

Tests that can't fail are worse than no tests at all in that it gives us a false sense of confidence.
We go ahead and refactor thinking that the tests have our back when they don't.
Hopefully errors introduced by faulty refactorings are caught before they reach production!

---

# Turning to Literature

Some years ago I read through the Discworld series by Terry Pratchett (amazing books!)
and the following passage from _Thud!_ has been stuck in my head since:

<div class="quote max-w-2xl">
    'Quis custodiet ipsos custodes? Your grace.'<br/>
    'I know that one,' said Vimes. 'Who watches the watchmen? Me, Mr. Pessimal.'<br/>
    'Ah, but who watches you, your grace?' said the inspector, with a brief smile.<br/>
    'I do that, too. All the time,' said Vimes. 'Believe me.'<br/>
    <div class="source">
        Terry Pratchett, Thud!, 2005
    </div>
</div>

Now, Pratchett didn't come up with the phrase _"Quis custodiet ipsos custodes?"_.
According to [Wikipedia](https://en.wikipedia.org/wiki/Quis_custodiet_ipsos_custodes%3F),
[Juvenal](https://en.wikipedia.org/wiki/Juvenal) did when writing about the impossibility of enforcing moral behaviour on women when the enforcers are corrupt.
In modern times it is better applied to discuss accountability of political power or corrupt law enforcement in general.

Leaving the philosophical discussion about power and corruption aside and getting back to software development,
we can rephrase this into:

> Who tests your tests?

And this is a question I spent a long time thinking about.
I toyed with the idea of writing tests for the tests, but apart from being an incredibly _silly_ idea,
that only moves the issue one step higher up the chain,
and now we must instead ask ourselves:

> Who tests your tests' tests?

I eventually settled on _code review_ being the answer and continued writing my tests as before,
relying on myself
(I always review my own code before opening a PR/MR)
and my peers to ensure any faulty tests are caught by looking at them intently.

# Enter: Test Driven Development

Fast-forward a few years to when I start practicing Test Driven Development and it all clicks.

It turns out Vimes was right all along.

<div class="quote max-w-2xl">
    'Who tests your tests? Your grace.'<br/>
    'I do that. All the time,' said Raniz. 'Believe me.'
    <div class="source">
        Raniz, <a href="https://raniz.blog">raniz.blog</a>, 2023
    </div>
</div>

## Failing Tests First

In TDD we start by writing the test,
and before we are allowed to implement the code we make sure that it _fails_.

By failing the test before implementing the code we make sure that the test can actually fail,
and by doing this for _every_ test we build a safety net of proven test cases that we can trust when doing rework
(this isn't the only thing required for a good safety net, but I'll elaborate on that in another post shortly).

## Failing Correctly

Ok, so the test has failed. There is an angry, red crossmark in the test panel in your IDE.
Now we can go ahead and write the implementation, right?

Not so fast. Did you figure out _why_ the test failed?
Did you read the error message and make sure that it was the assertion that failed and not something else?

Here's an example of a Python test that has failed for the _wrong_ reason:

<!--
    The fact that it's self.assertEqual and not self.assert_equal in Python's built-in unittest framework really bugs me by the way
-->

```
======================================================================
ERROR: test_add (testfail.Tests.test_add)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "testfail.py", line 9, in test_add
    self.assertEqual(5, add(2, 3))
                        ^^^^^^^^^
  File "testfail.py", line 4, in add
    return a + beta
               ^^^^
NameError: name 'beta' is not defined
```

The test _should_ fail with a message stating that we expected _5_ but that it was something else.
This test hasn't proven its correctness because we never actually reached the assertion.
To fail tests correctly I usually start with a hardcoded implementation that returns a value I'm _not_ expecting:

```python
def add(a, b):
    return 0
```

In languages with static typing this avoids compilation errors (those are _absolutely not_ correct failures) and means
I don't do any implementation before I'm happy with the test.
I also try to avoid throwing exceptions or returning `null`, `nil`, `None`, etc. because those generally come with their own issues.
If my function is supposed to return an instance of something I try to return the most basic instance I can conjure up
so that my asserts work as intended but fail because the values are wrong.

This also gives us another good reason to keep the number of asserts per test case minimal.
Because if you have multiple asserts, _you need to ensure they can all fail_.
If you only fail the first one, the second and third have never been proven correct.

After you've made sure that your test case fails as expected in all the ways it is expected to fail,
you have tested your test enough that you can confidently implement the functionality and earn that green checkmark!

Armed with this knowledge, go out there and _make your tests fail!_
