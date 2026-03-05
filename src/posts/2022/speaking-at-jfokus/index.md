---
title: "Upcoming Speaking Engagement: JFokus, Stockholm, 2022-05-03"
description: "I'm going to be on stage at JFokus, talking about AWS Lambda and Java"
date: 2022-04-12
thumb: "1280px-jfokus-2022.jpg"
thumbCaption: "Credit: Screenshot from JFokus promo video"
thumbCaptionHref: "https://youtu.be/w7OMia47k7I"
tags: 
    - java
    - conference
    - aws
    - speaking
---
I'm going to be speaking at [JFokus](https://www.jfokus.se) in Stockholm on May 3. I'll be talking about Java on AWS
Lambda and how to reduce the cold start times of a _very_ simple function from 11 seconds to less than a second.

My [session](https://www.jfokus.se/talks/822) is in room C4 from 13:00 to 13:50.

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


