---
title: "Continuous Integration and development flow"
description:
date: 2024-09-10
thumb: "robert-bye-cKBsq-5U17A-unsplash.jpg"
thumbCaption: "Photo by Robert Bye via Unsplash"
thumbCaptionHref: "https://unsplash.com/photos/man-standing-on-rock-cliff-overlooking-river-near-mountain-nature-photography-cKBsq-5U17A"
tags:
  - ci
  - development
  - methodology
---

# Continuous Integration

Continuous Integration,
sometimes referred to as Trunk Based Development,
is a development methodology where everyone integrates their work into the main branch at least daily.
The idea is that by continuously integrating with each other's changes, it becomes easier to build upon each other's work
while avoiding major surprises and integration issues such as divergent test suites and merge conflicts.

To achieve this,
we need two things:

1. Small batch sizes
2. Short integration cycles

These two go hand in hand, requiring us to think differently about how and when we share our work.

# Shorter cycles by splitting batches

A common way to add new features is to refactor existing code to accommodate the new functionality or separate common concerns into reusable components.
A commit adding a new repository to a project might look like this:

```git
commit 30ae2416692a88010061508e6f1d507680156591
Author: Daniel Raniz Raneland <raniz@raneland.se>
Date:   Thu Aug 22 08:18:37 2024 +0200

    Add PostgresToppingRepository.

    * Broke out shared functionality of PostgresIceCreamRepository into AbstractPostgresRepository
    * Added PostgresToppingRepository
```

This commit is a bit large since it includes both the refactoring _and_ the new functionality.
Breaking it up into two parts is a good idea.

```git
commit 5beffac210132be766c82a62a9d5ea28c14c5c7f
Author: Daniel Raniz Raneland <raniz@raneland.se>
Date:   Thu Aug 22 08:14:56 2024 +0200

    Add AbstractPostgresRepository.

    Broke out shared functionality of PostgresIceCreamRepository into AbstractPostgresRepository.
    
commit e15ed42cf12503b79493d3ec40b48c1dd641023c
Author: Daniel Raniz Raneland <raniz@raneland.se>
Date:   Thu Aug 22 08:19:37 2024 +0200

    Add PostgresToppingRepository.
```

Once it has been broken up,
integrating the refactoring step as soon as possible is a good idea so other team members can utilise or adapt to the new functionality.
Depending on how frequently the refactored code changes,
sitting on the changes in a private branch for too long may cause complex merge conflicts once they are to be integrated.

Imagine what happens if two developers break out the common functionality into _AbstractPostgresRepository_ simultaneously in separate branches:
You will need to choose which implementation to use,
and whoever wrote the implementation that didn't get picked will have to refactor their changes to use the chosen implementation.

As you get used to integrating more often,
it becomes second nature to make a commit once you've finished the refactoring and submit that to the main branch,
then continuing with the new feature once the prerequisites have been integrated.

# Fast integration with quick builds

A requirement for short integration cycles is that the build is fast.
The common recommendation is under 10 minutes,
but the faster,
the better.

For a lot of projects,
this means that the build pipeline needs some serious optimisation work.
I have a [talk](https://www.youtube.com/watch?v=mYBkSg1dz2Y) on pipeline patterns and antipatterns that might be helpful.

If you are unable to bring the build down to under 10 minutes,
you will have to start making compromises.
Heavier test suites (such as integration, E2E or performance tests) might not have to run on every commit -
one or two times a day is likely enough if you have good unit-test coverage.

# Asynchronous teamwork

GitHub didn't invent reviewing changes before accepting them,
but it did coin the term Pull Request and popularised the format we're so used to today.

To contribute changes to an open-source project back before pull requests were a thing,
you would send a patch to the project’s mailing list, and any review would take place over emails until the maintainers thought your contribution was good enough and brought it in to their repository.
This is, in fact, still how you submit patches to the Linux kernel.

In essence, a pull request is this workflow repackaged into a more convenient interface that speeds up reviewing and integrating changes from non-trusted contributors.

The main point of a pull request is to act as a gate so that people like me can contribute code to a project where the maintainers have idea about who I am.
It is a bit strange that pull requests are so common in commercial software development as well since we have no untrusted contributors there,
but I guess people get used to working one way in open source and feel comfortable using the same tools in their day jobs.

So, how do pull requests fit into Continuous Integration?

That's the main issue with pull requests: _they don't_.

Pull requests, stemming from email conversations, is an inherently asynchronous workflow.
Asynchronous workflows work great for open-source projects because maintainers and contributors are likely active at different times.
Many people do open source work in their spare time and are distributed throughout various time zones.
This makes synchronous work a lot harder because we'd need to schedule it at a time when all involved parties are available.

This is generally not the case in a corporate setting.
While there are teams with geographically distributed members,
the overwhelming majority are located in the same time zone -
if not the same office.

Below are two value stream mappings of code changes in two different projects.

| Activity        | Delay         | Total time elapsed |
|-----------------|---------------|--------------------|
| Create PR       |               | 0                  |
| Add comments    | 23 h 56 m     | 23 h 56 m          |
| Update code     | 2 d 19 h 27 m | 3 d 19 h 23 m      |
| Add comments    | 2d 5 h 10 m   | 6 d 33 m           |
| Update code     | 22 h 47 m     | 6 d 23 h 10 m      |
| Approve changes | 3 h 7 m       | 7 d 2 h 17 m       |
| Update code     | 10 m          | 7 d 2 h 27 m       |
| Merge changes   | 2h 39 m       | 7 d 5 h 6 m        |

| Activity        | Delay     | Total time elapsed |
|-----------------|-----------|--------------------|
| Create PR       |           | 0                  |
| Approve changes | 16 h 57 m | 16 h 57 m          |
| Merge changes   | 0 h 39 m  | 17 h 36 m          |

It is important to note that this does _not_ include the time it takes to write the code -
it only measures when the developer thinks the code is ready for integration until it has been integrated.

As can be seen above,
asynchronous teamwork means waiting.
And waiting either means not doing anything
or context-switching to something else.
Both result in lower productivity and higher lead times.

# Code quality

A common crutch when arguing for pull requests is that it is used to uphold code quality and stop bad design from entering the main branch.

If asynchronous code review was the only way of achieving this, then surely we should have higher quality software these days than before GitHub popularised the pull request.
Yet, I don't recall either extremely buggy software,
or sending all code changes as patches over email
(in fact, the overall quality of software seems to be in decline, but that's a topic for a future blog post).
There must be other ways of achieving this that don't lower productivity.

# Upholding quality through synchronous teamwork

Synchronous teamwork means that we work together at the same time.
Instead of sending diffs and comments back and forth we collaborate in real time.

There are, generally, two kinds of synchronous collaboration in development: code review and peer programming.

## Synchronous code review

Instead of sending someone a diff and then waiting for them to read it and come back with feedback,
the more efficient way of conducting code review is to set up a quick meeting (in person or via video call) and then walk through the changes together.

This means that any issues can be resolved immediately,
and after the review has concluded,
the changes can be integrated into the main branch.
Another benefit is that since everyone is present at the same time,
the author of the changes can guide the reviewer(s) through them.

A typical synchronous review takes between 5 and 15 minutes,
vastly faster than the asynchronous variant, which can span days.

## Peer programming

Peer programming is a collective term for pair programming or group programming.
It happens when two or more developers sit down and develop the same changes together - on one screen.

The most important part of peer programming is that everyone involved should focus on the task.
If you're not currently active in producing the code,
you pay attention to the process and review code and design as they emerge.

Peering has multiple benefits over solo development.
Chief among them is that the collaborative process means that code quality is higher and the development gets stuck less often.
Another benefit is that once the code has been committed,
it can be integrated straight into main since it was reviewed as it was written.

A common fear about peer programming is that it takes more time than solo development,
but I think this is unfounded.
The wall-clock time from when you start developing a change until it is completed _can_ be shorter for solo development than for peering for certain tasks.
However, since peering bakes in review and collaborative design, which results in code that is easier to maintain,
it will be faster in the long run.

Peering also comes with side benefits such as increased awareness of the code base and knowledge sharing -
helpful in avoiding knowledge silos.
It is also the fastest way of training juniors,
or introducing new team members to the code base.

### Remote peering

Peer programming doesn't have to be co-located.
I actually think that pair programming is more effective in a screen-sharing session than with two persons sitting in front of the same computer.
This is because whoever isn't currently coding can use their computer (preferably with a multiscreen setup, so they can still see their peer's screen)
to look up specifics or browse documentation.

Ensembles work best in a conference room in front of a projector or large screen.
This is mainly because video meetings can only accommodate one simultaneous conversation,
something that isn't an issue when everyone is physically in the same room.
Ensembles still work very welll with screen-sharing -
they're just even better in person.

# Builds and four-eyes policies

Two common requirements easily satisfied with pull requests are build stability and four-eyes policies.

The former means that the build must pass before changes can be integrated.
The latter that at least two people must have seen the code.

## Builds

A passing build is a common requirement before a pull request can be merged.
Without a pull request,
there is nothing that can implement this requirement.
The easiest solution is to skip this requirement altogether.

Have the build run automatically when changes have been integrated.
If the build breaks,
make the system notify whoever broke it,
so they can fix it quickly.

At first glance, this may seem like a chaotic environment.
However, breaking the main build is a lot more embarrassing and potentially disruptive than having a build failure in a pull request,
so people will quickly start being more careful with what they push and make sure it works.
Build failures will probably be more common in the beginning,
but will become less frequent as everyone adjusts.

As a bonus,
only triggering builds when the main branch changes will likely result in fewer builds,
slightly easing the pressure on both the environment and the corporate wallet.

## Four eyes policy

Depending on your requirements, we might be unable to do away with pull requests completely.

If it's just a policy,
and you trust your developers to adhere to it,
you mandate peer programming or code review and then let everyone integrate into main as they see fit.

If you _can't_ trust your developers to voluntarily adhere to your policies (this may be because of regulatory reasons),
you might need to keep pull requests around just for gate-keeping.
What you typically do then is develop everything synchronously,
create a pull request,
have the other participant(s) approve,
and then merge immediately.

# Getting started with CI


The next project I start will not use pull requests;
the focus will be on peering,
and when that doesn't fit,
we'll go solo and trust each other to schedule a synchronous code review if necessary and write high-quality code with proper tests when it's not.


If you're not ready to jump into the deep end of the CI pool and forego pull requests and pre-merge builds,
here are a few tips to get started by dipping your toes a bit:


1. Start pair programming by default. Once you complete your current task,
  pair with a colleague on their task instead of starting a new one.
  Pull requests for pair-programmed code can be approved immediately and set to auto-merge once the build passes.
2. Make smaller changes and integrate them often -
  if the task calls for multiple individual changes,
  make several small pull requests as you go instead of a big one at the end.
3. Optimize your build so that it can run in under 10 minutes.
  If that is impossible, break out the longer steps and run them on a schedule instead.

Do these, and you will soon find that your flow improves. Hopefully, that will convince you that going further and making synchronous collaboration the default for all work is a good idea.