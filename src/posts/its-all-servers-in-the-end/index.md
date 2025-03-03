---
title: "It's all servers in the end"
description: ""
date: 2025-03-04
thumb: "4589476034_078d71918e_k.jpg"
thumbCaption: "Server park at CERN; Nicolas Nova via Flickr, CC-BY-NC 2.0"
thumbCaptionHref: "https://www.flickr.com/photos/nnova/4589476034/"
tags:
  - cloud
  - eurostack
  - servers
---

# "The Cloud" has switched directions

When Amazon launched EC2 in 2006 it changed the world.
Before that we either had our own servers,
or we hosted them in a co-location data centre.
Provisioning new servers typically involved calling your supplier and ordering new hardware - with a wait time from days to months.
A customer I worked with a few years ago had to wait for six months before the three servers they ordered arrived.

With EC2, you could open a web application and provision a new server within minutes.
And if the underlying hardware broke down you'd either not notice or could restart your crashed server on different hardware without any data loss - 
managing the hardware and making sure that your virtual server was running was Amazon's problem.
The rest of the world soon followed and the number of providers have since exploded.

However, the main share of our cloud computing remains with three providers: Amazon Web Services, Microsoft Azure and Google Cloud Platform.
According to a report from [AAG](https://aag-it.com/the-latest-cloud-computing-statistics/),
these three together had 65 % of the cloud computing market in 2023.
[Another report](https://www.statista.com/chart/18819/worldwide-market-share-of-leading-cloud-infrastructure-service-providers/) puts them at 63% in Q4 2024.
I don't think this is good for us as customers
— especially not with the current ongoing situation in the White House and the relations between the US and the rest of the world being decidedly uncertain.

In the beginning of cloud computing, all the focus were on the servers.
Everyone were competing to offer the best virtual servers and help you move your physical (or virtualised) servers from your data centre to the cloud.
The few services that were added that wasn't pure servers were often touted with their standards compliance as their main selling point.

Managed databases could replace your in-house databases and your engineers wouldn't need to take care of the servers anymore.
All the databases on offer were what you were already running in your data centre.

Then, as time went on, the focus shifted.
As we moved our workloads to the cloud, arguing that whatever we were already using were also available in the cloud grew less relevant since the cloud was now where people started building.
These days, the focus is more on diversification and _not_ being compatible with the competition
—  it's all about _lock-in_.

Amazon, Microsoft and Google have nothing to gain from being compatible anymore;
Amazon sure wants you to move from Google, Microsoft, OVH, Cleura, and Exoscale
— but they don't want you moving back.

If you've used any of the big provider's services you've seen this.
Their product catalogs are _huge_ and most of it is provider-specific products.
Even if they all have distributed key-value store databases and messaging systems,
they all have different names and different APIs.

All these specialised services are very _convenient_
— I've definitely spun up a Fargate Container or AWS Lambda connected to Serverless DynamoDB before.
But it also locks you in;
the more provider-specific products you pick, the harder it'll be to change providers.

Given two systems built on Amazon Web Services, solving the same problems with different products from the catalogue:
one built on AWS Lambda, DynamoDB, SQS, Kinesis and ApiGateway.
The other built using VMs, Amazon RDS for Postgresql, Amazon (Active)MQ, and Kafka.

Ask yourself this:

* When negotiating discounts, which system is going to get the most discounts?
* When the current EU-US Data Privacy Framework breaks down, who is going to move their data to Europe the fastest and avoid GDPR-related penalties?

Spoiler: It's the latter one for both, because moving that stack somewhere else will be a lot less work than for the former.

# About those servers then

One consequence of everyone moving to the cloud is that a lot of developers now have developed something I'd like to refer to as _sysadminophobia_.
where the concept of administrating an operating system causes the developer to become paralysed from fear.

I'm fairly old-school. I've been running my own server at home since the end of the 90's,
and as I type this there's a small server running 10 virtualised or containerised workloads sitting underneath my desk.
I'm definitely not afraid of a bit of operating system management.
When doing it professionally, though, I want to automate all of it.

Since cloud computing exploded, there has also been a lot of development in the operating system space and the tooling surrounding it.
These days, there are Linux distributions focused on being as light-weight as possible and being managed as part of a fleet.
Some of them are even geared towards booting into containers.
This makes sense,
because even if _you_ aren't managing the operating system,
your provider has to,
and they probably want to automate that management themselves.

Building and managing operating system images doesn't need to be much harder than managing container images. 
You can of course also go the route of maintaining one minimal OS image that runs a container on startup instead of building one OS-image per service.
Servers managed in this way is best handled as cattle and not pets -
i.e. instead of updating them,
deprovision them and then provision a new running the updated software.

# The helm-shaped elephant in the room

These days, it's impossible to talk about cloud-provider-agnostic service implementation without mentioning Kubernetes.

Kubernetes has been called "the operating system of the cloud",
and that is its greatest benefit
— it has gained enough traction that Amazon and Microsoft has been forced to adopt it (it originated at Google, so there's no surprise that they offer it).
And Kubernetes wouldn't be Kubernetes if it was incompatible, so even Amazon and Microsoft need to stay compatible with their competition here.

This gives us a major benefit if we build our system on top of Kubernetes
— it is very portable between providers.

But even if you can run a Kubernetes cluster without having to worry about the servers it runs on with most providers today,
Kubernetes is not the end-all, be-all solution to all your problems.

While Kubernetes gets rid of the complexities of managing servers,
it introduces new complexities
— and most of that complexity is _very_ specific to Kubernetes.

A vanilla Kubernetes cluster (which is what you get from most providers) is not something you should build your services on.
It can run your workloads, but it'll throw away the logs, you'll have no metrics about your containers and there won't be any backups.
Just have a look at what [OpenShift](https://docs.redhat.com/en/documentation/openshift_container_platform/4.13/html/about/oke-about#oke-about)
or [Elastisys Welkin](https://elastisys.io/welkin/) adds on top of Kubernetes to get a rough idea about what you need to add to get a usable platform
(you don't need _all_ of that, but maybe about half of it).

You can spend weeks setting these things up before you're ready to run your first workload.
And then you need to figure out how your workload fits into this platform,
and avoid
[all](https://home.robusta.dev/blog/stop-using-cpu-limits)
[of](https://medium.com/@portainerio/why-restricting-access-to-the-default-namespace-is-key-to-running-a-secure-kubernetes-environment-3d112bcde4c8)
[the](https://www.panoptica.app/research/walking-the-risky-path-the-threat-of-hostpath-to-your-kubernetes-cluster)
[footguns](https://www.nextplatform.com/2024/03/04/kubernetes-clusters-have-massive-overprovisioning-of-compute-and-memory/).

# So where do we go from here?

I've helped set up Kubernetes clusters on both bare metal and virtual machines.
I've set up a platform on Kubernetes,
and I've run workloads on Kubernetes.

I think Kubernetes has its place,
but so do virtual servers.
Which you should choose depends entirely on _your_ situation.

I won't tell you that you should use all VMs or go all-in and migrate all your services to Kubernetes.
I will however tell you to not fear the server,
because whatever you're building,
it's running on a server somewhere and sometimes managing that directly is the best choice.

If you're in that 60+ percent of customers using US-based cloud services,
you really should have an exit plan for when the shit starts hitting the fan,
and that exit plan is likely to involve running some servers.

But why wait, when you can start moving today?

I've started migrating my things away from US-based services and infrastructure and I think you should too!