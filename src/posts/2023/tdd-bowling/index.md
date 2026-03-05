---
title: "TDD Intro: CEO Bowling"
description: "A quick introduction to Test Driven Development, why you do it, how you do it, and a kata for practice"
date: 2023-03-09
thumb: "michelle-mcewen-yk2VUa5vtA0-unsplash.jpg"
thumbCaption: "Credit: Michelle McEwen via Unsplash"
thumbCaptionHref: "https://unsplash.com/photos/yk2VUa5vtA0"
tags: 
    - tdd
    - testing
    - katas
---
I sometimes joke that we at factor10 have test driven development as company policy.

Now, it isn't really that serious, but we are strong believers in testing and test-driving development.

I recently gave a TDD workshop at JFokus 2023 where I taught TDD to about 40 people.
This is the blog-post version of that workshop with a short intro and a kata to practice TDD.
If you're just here for the kata it's at the bottom of this post.

## What is Test Driven Development?

Test Driven Development is the act of writing your tests before you write your code,
and (apart from testing the code) we do this because of two major reasons:

1. Ensuring that we write testable code
2. Ensuring that the test is actually meaningful

Number 1 is quite self-explanatory;
since you start with the test you can't write the code unless it is testable.

Number 2 might not be that obvious. What do I mean by a _meaningful_ test?

Take this test as an example:

#### call_method.py
```python
def call_method(method, *args):
    method(*args)
```

#### test_call_method.py
```python
class Tests(unittest.TestCase):

    def test_call_method(self):
        # Given a method to call
        mock = MagicMock()

        # when the call_method method is called
        call_method(mock, (1, 2, 3))

        # the mock is called with the expected arguments
        assert mock.called_with(1, 2, 3)
```

Seasoned Python testers may spot the error here,
but if you're not familiar with mocking in Python you'll probably miss it -
this test can't fail.

Let's try commenting out the method body of `call_method` and run the test:

#### call_method.py
```python
def call_method(method, args):
    pass
```
```shell
$ python -m unittest discover
.
----------------------------------------------------------------------
Ran 1 test in 0.001s

OK
```

As you can see, even without an implementation the test passes.
This is because `assert mock.called_with(1, 2, 3)` is not how you verify that a mock has been called.
The correct way to assert the mock was called is this:

```python
mock.assert_called_with(1, 2, 3)
```

And now the test fails:
```shell
$ python -m unittest discover
F
======================================================================
FAIL: test_call_method (tests.test_main.DemoTests)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "tests/test_main.py", line 19, in test_call_method
    mock.assert_called_with(1, 2, 3)
  File "/usr/lib/python3.10/unittest/mock.py", line 920, in assert_called_with
    raise AssertionError(error_message)
AssertionError: expected call not found.
Expected: mock(1, 2, 3)
Actual: not called.

----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (failures=1)
```

Because of this, we write our test before we write our code,
and we ensure that the test fails - **for the right reason** - before we are allowed to implement the code.

The right reason is equally important as making the test fail.
This should be an assertion error to make sure that your assertions are correct -
**not** a compilation error or other, unrelated, error.

Keep adding things to your code until you get a test run that fails for the right reason,
then implement the code to make the test pass.

## TDD Distilled
Summing up the above we can get this TDD-distilled algorithm that you can follow whenever you add features to your codebase:

1. Write a test
1. Make it fail
1. Make it pass
1. Refactor
1. Repeat

The reason we have both a step for implementing the code (make it pass) and refactoring the solution is that the initial
implementation in step 3 should be as simple as possible - hardcode the response if possible.

We then make our solution pretty by refactoring it -
confident in the knowledge that since the test is correct we can be certain that everything still works if all the
test pass when we're done.

## Prototyping
But what if you're new to TDD and you forget yourself and write some code before you write your test?
Or you don't know where to start or what test to write?
Maybe you're excited because you've already figured out the solution and are eager to get started.

All this is fine.
We call it prototyping and as long as you step back and return to TDD there's no problem with it.

The important part is to treat your code as a prototype,
throw it away (or at least comment it out) and then start from step 1.

I call this revised algorithm _TDD For Cheaters_:

1. Be too excited to remember to write the test first
1. Write a bunch of code
1. Remember that you should have started with the test
1. Remove your code
1. Write a test
1. Make sure it fails for the right reason
1. Make it pass
1. Refactor your code
1. Repeat (from 5)

And with this list you don't have any reason to _not_ do TDD anymore.
Either you know where to start and write your test first,
or you run ahead - for some reason or the other - and write a _prototype_.
Just make sure that you discard the prototype in some way before you start your _implementation_,
and then start with the test!

## Ready to try your hand at some TDD?

For my TDD workshop I have prepared a kata that suits TDD well,
the format of the kata is inspired by [Advent of Code](https://adventofcode.com).

It works by presenting a problem that you solve and the solution unlocks the next part in the kata where the problem
changes or expands.

You can find the kata [here](https://raniz85.github.io/tdd-katas/ceo-bowling/).
