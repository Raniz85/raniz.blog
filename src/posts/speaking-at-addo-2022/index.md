---
title: "Upcoming Speaking Engagement: All Day DevOps 2022-11-10"
description: "I'm going to be speaking at All Day DevOps on November 10"
date: 2022-10-25
thumb: "Daniel Raniz Raneland_MI_ADDO2022.png"
thumbCaption: "Credit: All Day DevOps"
thumbCaptionHref: "https://alldaydevops.com"
tags: 
    - java
    - conference
    - aws
    - speaking
---
I'm going to be giving my talk on speeding up Java on AWS Lambda with Micronaut and GraalVM.

[All Day DevOps](https://alldaydevops.com) is an online conference by [SonaType](https://www.sonatype.com/) with 6
different tracks spanning 24 hours.

My [session](https://www.alldaydevops.com/addo-speakers/daniel-raniz-raneland) is in the _Modern Infrastructure_ track
and I'm on at 12:30 GMT+1.

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


