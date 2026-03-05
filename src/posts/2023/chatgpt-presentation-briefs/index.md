---
title: "Writing Presentation Briefs With ChatGPT"
description: >-
  Exploring the Potential and Pitfalls of Using ChatGPT for Crafting Engaging Talk Descriptions:
  A Linguistic Adventure from a Swedish Perspective
  (yes I used ChatGPT for that).
date: 2023-06-16
thumb: "lyman-hansel-gerona-TVCDj_fFvx8-unsplash.jpg"
thumbCaption: "Photo by Lyman Hansel Gerona via Unsplash"
thumbCaptionHref: "https://unsplash.com/photos/TVCDj_fFvx8"
tags:
  - ai
  - ml
  - llm
  - chatgpt
  - presentations
---
I found myself with some unexpected time on the train (customer laptop not powering on :/) and started looking over my
[Sessionize profile](https://sessionize.com/raniz/), going through my talks and trying to improve the descriptions.

A lot of people are posting that ChatGPT has improved their productivity by a lot,
but I haven't experienced that yet.
I've tried using it for problem solving but have had less than convincing results.

However, manipulating text is what LLMs are supposed to be good at,
so I tried making ChatGPT rewrite my briefs for me,
and it turns out that it's really quite good at that - most of the time.

---
For two of the talks that I gave it,
it produced good results that I tweaked a bit.

My prompts were on this format:

> Rewrite the following talk summary about the [topic of presentation].
> Keep the overall writing style and flesh it out with more details and a summary of what you'll learn,
> avoid too complex words and formulations.
> 
> "[My current brief]"
 
This produced a "lagom" chunk of text with some added details. I modified it a bit,
but probably used about 90% of the text ChatGPT output - which I think is great.

On the third presentation however,
all it did was change the wordings of what I'd written but didn't add any further details.

Here's the original description:

> I'm a huge fan of Infrastructure as Code,
> but regardless of how many developers put JSON or YAML as skills on their LinkedIn profiles I don't think of those
> when I think "Code".
>
> In this session I'll show what Pulumi is and how it brings actual Code to IaC by setting up a Kubernetes kluster using
> Java and installing a few Helm charts on it.
>
> I will also briefly compare it to the similar,
> but still fundamentally different,
> Cloud Development Kits from both AWS and HashiCorp/Terraform."

and here's ChatGPT's take:

> I am an ardent admirer of Infrastructure as Code (IaC),
> but irrespective of the number of developers that list JSON or YAML as competencies on their LinkedIn profiles,
> these don't come to my mind when I ponder upon the concept of 'Code'.
>
> In the forthcoming session,
> I will unveil what Pulumi is and elucidate how it integrates real 'Code' into IaC,
> by demonstrating a hands-on setup of a Kubernetes cluster using Java, and subsequently installing a handful of Helm charts on it.
>
> In addition to this,
> I will provide a succinct comparison between Pulumi and other Cloud Development Kits like those from AWS and HashiCorp/Terraform,
> highlighting their similarities yet fundamental differences.

And this brings me to the main issue I have with using ChatGPT like this: _It doesn't write like **me**_.

I'm a Swede (the nationality, not the vegetable) and as such my mother tongue is Swedish and not English.
While I do consider my English skills fairly good, how I speak and write is definitely coloured by my Swedish.

This might have been fine,
but I haven't written enough material online for ChatGPT to "know" my writing style so telling it to "write in the style of Raniz"
doesn't improve on things (it actually made it worse).

This results in GhatGPT generating the "standard" language, which uses words and formulations that I wouldn't use
(at least not right now).

An example, I could probably sit rewording the above brief without ever coming up with the sentence

> I am an ardent admirer of Infrastructure as Code (IaC),
> but irrespective of the number of developers that list JSON or YAML as competencies on their LinkedIn profiles,
> these don't come to my mind when I ponder upon the concept of 'Code'.

I wouldn't describe myself as _ardent_, nor do I ever _ponder_
(I _do_ use the word "irrespective" though, because doing that makes me feel like I'm good at English :)).

In the end, I've used two of the briefs that ChatGPT wrote for me, changing them some to make them feel more like "me".
I still need to rewrite the brief for my IaC though...

If you want to see the results, you can view all my talks on my [public profile at Sessionize](https://sessionize.com/raniz).
Can you spot the ones I used ChatGPT to write?
