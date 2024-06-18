---
title: "Developing technology-agnostic services"
description: ""
date: 2024-08-23
thumb: "edge2edge-media-qHhJkxare7A-unsplash.jpg"
thumbCaption: "Credit: Edge2Edge Media via Unsplash"
thumbCaptionHref: "edge2edge-media-qHhJkxare7A-unsplash.jpg"
tags: 
    - architecture
    - cloud
    - kubernetes
    - EU-DORA
---


We (at factor10) have been discussing the EU's Digital Operational Resilience Act lately,
what it means, and what impact it might have.

What we have yet to discuss, though, is _how on earth_ you are supposed to comply with it.
I'm not going to do that here either,
but I want to address how you can develop software so you can somewhat flexibly move it between providers or swap out specific technologies,
which is one piece of that puzzle.

---

If your immediate reaction was: "That's easy, you just use Kubernetes",
you're on to something.
But you're also completely wrong.

Developing for Kubernetes means you're relatively free to move between Kubernetes providers
(details will differ, such as persistent volumes and load balancer routes).
But restricting yourself to Kubernetes means you're limited by what can run on Kubernetes,
which is not always what we want since many useful services exist outside the Kubernetes ecosystem.
For example, AWS SQS is a very powerful message queue that is also simple to use; it's a solid choice if you're running on AWS and need a message queue.
Another example is Azure CosmosDB for NoSQL. It is a schemaless, horizontally scalable database service that can automatically replicate data to multiple regions and has a "serverless" pricing tier - if you're on Azure, that sounds useful.

And what if something better than Kubernetes comes around in three years?

As it often does, the real answer lies in _loose coupling_ and abstraction.

Here's what [Wikipedia has to say about loose coupling](https://en.wikipedia.org/wiki/Loose_coupling):

> In computing and systems design, a loosely coupled system is one
> 1. in which components are weakly associated (have breakable relationships) with each other, and thus changes in one component least affect existence or performance of another component.
> 2. in which each of its components has, or makes use of, little or no knowledge of the definitions of other separate components. Subareas include the coupling of classes, interfaces, data, and services. Loose coupling is the opposite of tight coupling.

Generally, when we talk about loose coupling, we talk about the structure of our code.
Structuring it in a way that means that changes in one part of the code have minimal impact on other parts.
The same techniques can be applied to how we interact with the outside world
so that completely replacing one system does not cause profound changes within the codebase.

# Achieving loose coupling

Layered, Hexagonal, Onion, N-Tier, Clean, Ports and Adapters.
"Kärt barn har många namn", as we say in Sweden
(roughly: "a dear child has many names".)

<div class="flex flex-col justify-center items-center">
    <img src="hexagonal-architecture.png" />
    <div class="text-center">
        <em>Hexagonal Architecture, Credit: <a href="https://commons.wikimedia.org/wiki/File:Hexagonal_Architecture.svg">Cth027 via Wikimedia Commons, CC BY-SA 4.0</a></em>
    </div>
</div>

The architectural patterns mentioned above are not all the same,
but central to all of these is to separate your application's business logic from everything else.
By keeping all the business logic separate and hiding the outside world behind abstractions,
we are free to replace any part with minimal code changes -
regardless of whether it is the database server, the message queue, or the function as a service platform that invokes our code.

Below are two diagrams depicting the same application running on AWS Lambda with DynamoDB or Azure Kubernetes Service with CosmosDB.

<img src="layered architecture-AWS Lambda.svg" />
<img src="layered architecture-Azure AKS.svg" />

As can be seen, the application's core does not differ between the two deployments. Only the parts that interact with the outside world do.

Contrast this with a solution without layering, where we use the _LambdaContext_ and _DynamoDBClient_ within the application logic.
Replacing these require us to change the core,
where the application logic resides -
which is error-prone and complicated.
In the case of moving from an AWS Lambda function to a containerised service serving a REST API,
we likely need to introduce handling of the HTTP context into our core as well.

Breaking this functionality out into separate layers not only means we can leave the application logic alone when replacing infrastructure,
but we also gain the ability to test our application logic without involving any provider-specific dependencies.
There is no need to mock or interact with DynamoDB or CosmosDB when testing our core logic -
we can use in-memory implementations of our repositories instead.
We should still write provider-specific tests, of course, but they can be limited to interface implementations and need not concern business logic.

Should we want to,
we can even put the interface layers in separate modules and run the code at two different providers simultaneously.
Imagine having automatic failover not only between servers but also between cloud providers!