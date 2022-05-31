---
title: "Upcoming Speaking Engagement: Craft Conference, Budapest, 2022-06-03"
description: "I'm going to be on stage at Craft Conference in Budapest, talking about AWS Lambda and Java"
date: 2022-05-31
thumb: "1280px-craft-conf-2022.png"
thumbCaption: "Credit: Background image from craft-conf.com"
thumbCaptionHref: "https://craft-conf.com"
tags: 
    - java
    - conference
    - aws
    - speaking
---
In an interesting turn of events (this was decided today, I'm speaking on friday), I'm going to be speaking at
[Craft Conf](https://craft-conf.com) in Budapest on June 3. I'll be giving the same talk I did at
[JFokus](/2022-04-12_speaking-at-jfokus), which is about Java on AWS Lambda and how to reduce the cold start times of a
_very_ simple function from 11 seconds to less than a second.

My [session](https://craft-conf.com/speaker/daniel-raniz-raneland) is on the Blue Stage at 16:40.

---

Abstract follows:

> ## Thawing Java on AWS Lambda: Reducing cold start times from 11 seconds to 1
> 
> Java has never been a perfect fit for Function as a Service platforms such as AWS Lambda or Azure Functions. While
> both platforms have official support for Java, Java functions unfortunately suffer from significantly longer cold
> start times than many other runtimes.
>
> In this talk I will show a simple Spring Cloud Java function running on AWS Lambda with fairly horrible cold start
> times of around 11 seconds and then show how we can fix this by replacing Spring Cloud with Micronaut and use GraalVM
> Native Image to perform most of the work during compile time. The end result is cold start times of less than a
> second, making Java a viable, though not without drawbacks, choice for FaaS platforms that support custom runtimes.


