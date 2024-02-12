---
title: "The art of testing: failing gracefully"
description: ""
date: 2024-02-13
thumb: "hadija-jCfDzOQ2-C8-unsplash.jpg"
thumbCaption: "Credit: Hadija via Unsplash"
thumbCaptionHref: "https://unsplash.com/photos/a-sign-that-is-on-the-side-of-a-hill-jCfDzOQ2-C8"
tags:
  - testing
  - development
  - tdd
  - methodology
---
When writing tests, we should always write them so that when (not if) they fail,
they do so gracefully,
with as much information regarding _why_ as possible.

Doing this increases the chances that whoever is investigating the test failure can zone in on the issue quickly,
instead of spending time trying to understand _why_ the test fails.

---

# Equality failures

Let's illustrate this with a small example.
Our example function (`evaluate_predictions`) takes a list of dates and amounts as well as a list of monthly predictions and aggregates these into a list that contains some statistics about the predictions and how they fell out.

Here's a simple test for the method:

```python
class PredictionTests(unittest.TestCase):

    def test_that_single_amount_and_prediction_is_correctly_evaluated(self):
        # Given a single amount of 2000 for 2024-01-10
        amount = Amount(2024, 1, 10, 2000)

        # And a prediction of 1000 for 2024-01
        prediction = Prediction(2024, 1, 1000)

        # When the prediction is evaluated against the single amount
        results = evaluate_predictions([amount], [prediction])

        # Then the difference is -1000 for 2024-01
        self.assertEqual(results[0], PredictionResult(2024, 1, -1000, 1, 2000))
```

Now, imagine that we introduce a bug somewhere and then run the test:

```
>       self.assertEqual(differences[0], PredictionResult(2024, 1, -1000, 1, 2000))
E       AssertionError: PredictionResult(year=2024, month=1, diff=3000, amounts=1, avg_amount=2000.0) != PredictionResult(year=2024, month=1, diff=-1000, amounts=1, avg_amount=2000)
```

How long does it take you to spot the difference? Imagine if we had 20 fields instead of just 5,
it would be quite inefficient to inspect each and every field to see if they match.

We can rewrite the test to assert on each individual field instead
(or we could switch to another framework - like pytest - which automatically drills down and reports the differences for us)
which will tell us which field differ:

```python
        # Then the difference is -1000 for 2024-01
        result = results[0]
        self.assertEqual(result.year, 2024)
        self.assertEqual(result.month, 1)
        self.assertEqual(result.diff, -1000)
        self.assertEqual(result.amounts, 1)
        self.assertEqual(result.avg_amount, 2000)
```

```
>       self.assertEqual(result.diff, -1000)
E       AssertionError: 3000 != -1000
```

Much better,
we can clearly see that the issue is with the _diff_ field and can investigate and fix our bug.
One drawback with this is that if there is also a bug in how we calculate _avg_amount_,
we will not see that until we have corrected the _diff_ field.
This can lead to loops where we fix one bug and then discover the next,
but given the alternative of having to compare string representations manually to figure out what is wrong I think this is preferable.

Now, some might argue that this breaks the rule "one assertion per test" because there are 5 separate assertions.
I argue that this is a bit misinterpreted.
We're asserting the exact same things as if we would use `self.assertEqual(result, PredictionResult(...))` but the error we get tells exactly what field has the wrong value.

What the "one assertion per test" rule is really about,
is that you should not assert non-related effects or results in the same test (one _concept_ per test).
A good rule of thumb is that if you can't describe the assertion without the word "and" you are testing too much -
but there are of course exceptions to this rule as well.

# Singling out one value from many results

Let's look at another example,
this one heavily inspired by a test case I recently came across in a project.

In this test we're loading test data stored in JSON-files - 
I commonly do this when I want to keep the data from cluttering up the test -
and then we want to ensure that a single row of the results is as expected:

```python
    def test_that_multiple_amounts_are_correctly_aggregated_for_the_correct_prediction(self):
        # Given multiple amounts
        amounts = load_amounts("amounts.json")

        # And mulitple predictions
        predictions = load_predictions("predictions.json")

        # When the predictions are evaluated against the amounts
        results = evaluate_predictions(amounts, predictions)

        # Then the difference is -2248 for 2023-08
        result = next((r for r in results if r.year == 2023 and r.month == 8 and r.diff == -2248 and r.amounts == 28 and r.avg_amount == 116))
        self.assertEqual(result.year, 2023)
        self.assertEqual(result.month, 8)
        self.assertEqual(result.diff, -2248)
        self.assertEqual(result.amounts, 28)
        self.assertEqual(result.avg_amount, 116)
```

What's happening here is that we're locating a single prediction result among many and then asserting that it was correctly evaluated.
We are using individual assertions for each field, so all is well and good, right?

Well, let's have a look at what happens if we introduce the same bug that messes up the diff calculation again:

```
>       result = next((r for r in results if r.year == 2023 and r.month == 8 and r.diff == -2248 and r.amounts == 28 and r.avg_amount == 116))
E       StopIteration
```

That is not very informative at all.

What happens here is that the condition for locating the result contains tests for all the values,
and as the results does not contain such a row, we get a `StopIteration` error and never reach the actual assertions.

To fix this we need to think about the search condition and reduce that to the bare minimum that uniquely identifies our row.
In this case it's the year and month,
so let's reduce the condition to that and try again:

```python
        result = next((r for r in results if r.year == 2023 and r.month == 8))
```

```
>       self.assertEqual(result.diff, -2248)
E       AssertionError: 4248 != -2248
```

Much better.
However,
there is still one situation where we can get the `StopIteration` error:
if we mess something up so that the row isn't actually present.
Let's fix that as well:

```python
        result = next((r for r in results if r.year == 2023 and r.month == 8), None)
        self.assertIsNotNone(result, "Expected result for 2023-08 but it is not present")
```

Now, instead of a `StopIteration` error if the row is not found `next` will return `None`.
Using this, we add another assert that checks that the row should not be `None`,
with a custom error message that explains what we are asserting.

```
>       self.assertIsNotNone(result, "Expected result for 2023-08 but it is not present")
E       AssertionError: unexpectedly None : Expected result for 2023-08 but it is not present
```

Terrific.
All our tests now fail with descriptive error messages that tells us what is wrong instead of requiring us to debug the tests before we know where to start.

# Frameworks can make the difference
I briefly mentioned _pytest_ above as an alternative to rewriting the assertions to be per field.
_pytest_ automatically drills down into dataclasses to explain which fields differ.
Rewriting the first test with _pytest_ looks like this:

```python
def test_that_single_row_is_counted():
    # Given a single amount of 2000 for 2024-01-10
    amount = Amount(2024, 1, 10, 2000)

    # And a prediction of 1000 for 2024-01
    prediction = Prediction(2024, 1, 1000)

    # When the prediction is evaluated against the single amount
    results = evaluate_predictions([amount], [prediction])

    # Then the difference is -1000
    assert results[0] == PredictionResult(2024, 1, -1000, 1, 2000)
```

And when it fails it gives us this:

```
>       assert results[0] == PredictionResult(2024, 1, -1000, 1, 2000)
E       AssertionError: assert PredictionRes...amount=2000.0) == PredictionRes...g_amount=2000)
E         
E         Omitting 4 identical items, use -vv to show
E         Differing attributes:
E         ['diff']
E         
E         Drill down into differing attribute diff:
E           diff: 3000 != -1000
```

Which is clear and informative and one of the reasons I typically use _pytest_ over _unittest_ when developing in Python.

Here is a short list of frameworks that help with this that I typically reach for when writing tests in different languages:

* [AssertJ](https://assertj.github.io/doc/) - Fluent assertion library for Java
* [pytest](https://pytest.org) - Python testing library
* [Fluent Assertions](https://fluentassertions.com) - Fluent assertion library for C#
* [jest](https://jestjs.io) - Testing library and fluent assertions for TypeScript and JavaScript

# See also

If you want even more arguments on why you should focus on how your tests fail
my colleague [Per](https://programmaticallyspeaking.com/) held a presentation during [Swetugg](https://www.swetugg.se/) 2018.
You can watch it on [YouTube](https://www.youtube.com/watch?v=jJRgSy2vVF8).