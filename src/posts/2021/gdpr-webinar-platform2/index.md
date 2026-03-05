---
title: "The Search for a GDPR Compliant Webinar Platform: Open Source Edition"
description: "Are there any good open source webinar platforms out there?"
date: 2021-10-11
thumb: "1280px-OSI_flag_in_Italy.jpg"
thumbCaption: "Credit: Raniz, Tiia Monto via Wikimedia Commons, and the OSI, CC BY-SA 3.0"
tags: 
    - gdpr
    - webinar
    - opensource
---
In the [last post](/2021-09-24_gdpr-webinar-platform1) I wrote about our search for a commercial Webinar Platform that's
really GDPR compliant and not just says they are. Unfortunately, that search bore no fruit since most platforms are
either American or use American service providers which disqualifies them according to our requirements defined there.

In this post, we're going to explore open source alternatives, both commercially and self-hosted.

---

First though, let's review those requirements:

1. GDPR compliant
2. Recording of webinars
3. Multiple speakers
4. Up to 200 attendees
5. No registration for attendees (i.e. we don't want your email address)

If you want more details on the requirements, check out the [previous post](/2021-09-24_gdpr-webinar-platform1).

# Going Open Source
So, we found no suitable commercial platform to host our webinar on, but maybe there's a thriving open source project
that we can use?

This won't be a deep dive in technical solutions or in how to set up and operate any of these platforms,
though I will try to link to relevant information whenever possible.

# BigBlueButton
Our CEO [Jimmy](https://twitter.com/JimmyNilsson) found out about [BigBlueButton](https://bigbluebutton.org) (BBB)
from a post on [LinkedIn](
https://www.linkedin.com/posts/nordstrom86_idag-hade-vi-demo-nummer-tv%C3%A5-f%C3%B6r-referensgruppen-activity-6836652820310102016-w4c8/https://www.linkedin.com/posts/nordstrom86_idag-hade-vi-demo-nummer-tv%C3%A5-f%C3%B6r-referensgruppen-activity-6836652820310102016-w4c8/) 
and suggested I take a look at it.

BBB is an open source teaching platform developed by Blindside Networks and licensed under the LGPL. 

The client is responsive and pure HTMTL 5 and JavaScript, written using ReactJS. The backend is written in Java, Scala
and JavaScript and there's an optional front-end called [Greenlight](https://github.com/bigbluebutton/greenlight)
written in Ruby with some supportive JavaScript.

## Hosted Solutions
BBB has a [list of commercial hosting solutions](https://bigbluebutton.org/commercial-support/) on their site that -
at the time of writing - contains five commercial solutions. Of these, the only company operating in a country we
can work with (read the previous post) is [Blindside Networks](https://blindsidenetworks.com)  - i.e. the company
developing BBB - from Canada. Unfortunately they use AWS so we can't use them.

Searching the web I found another provider, [Big Blue Meeting](https://www.bigbluemeeting.com), which provides hosted
BBB. They're an American company though so no luck there.

## Self-Hosting
I've been running services in production for more than 15 years so I'm not afraid of running my own software when needed.
While a hosted solution would be ideal because it requires little effort on our side, hosting it ourselves means we 
control every part of the supply chain and get to chose service providers ourselves. We could even host it on an old
server in our office. [If we had an office](https://www.linkedin.com/pulse/kontanter-bensin-kontor-jimmy-nilsson/).

Installation of BBB is straightforward if you follow [the guide](https://docs.bigbluebutton.org/2.3/install.html) (may
not refer to the latest version, though there's a link in the sidebar that takes you there). Essentially, you spin up
an Ubuntu 18.04 server and run an installation script.

If you want to use another distribution or release of Ubuntu you're on your own so I suggest you go with the official
variant because installation is super-smooth. The same script is used for upgrading BBB or installing extra features
such as Greenlight.

### Testing in a Local VM or Container
BBB won't work properly without an SSL certificate and the installer uses [Let's Encrypt](https://letsencrypt.org/) by
default which solves this automatically. It does mean however that your BBB instance needs to be publicly reachable and
have a real domain name, something you rarely have for a local VM or container.

I tried installing BBB in an LXD container with a self-signed certificate but couldn't get it to work. It's possible -
even likely - that you can get it to work internally with a real certificate from a proper CA and a real domain name
with the instance only being reachable on an internal network. You could also be better than me at managing CA
certificates on Ubuntu and get it working with a self-signed certificate, though I gave up eventually and installed it
on a virtual server at [CityCloud](https://citycloud.se) (I've worked extensively with AWS for the past 10 years so it
was fun to work with [Open Stack](https://www.openstack.org/) for a change).

## Evaluation
So, with BBB up and running we tested it out and were quite happy initially. You can limit sign-ups to invite-only and
give users with emails belonging to a specific domain moderator privileges by default (this is all in Greenlight by the
way). Meetings can be joined anonymously and there is recording support out of the box.

One thing we found that we weren't completely happy with was that there is no built-in support for blurring or replacing
your background - if you want that you'll need to find an external tool.

When it came to the recordings though, it unfortunately fell apart completely. BBB "records" the meeting and then
replays all video and audio streams individually on the player page - there is no easy way of getting a video file out
of it that you can share online.

It may be possible to hack something together to get a video file from a recorded meeting, but that's out of scope for
us so we left BBB behind and moved on to the next contender:

# Jitsi Meet
I stumbled upon [Jitsi Meet](https://meet.jit.si/) while searching for ways to blur my background on BBB. In a thread
discussing BBB's lack of this someone mentioned that Jitsi Meet has that functionality, and maybe BBB could just build
on that since Jitsi Meet is open source.

Jitsi Meet is an open source video meeting platform currently developed by 8x8 Inc. but has previously been owned by
Atlassian and BlueJimp - which is the company the original author (Emil Ivov) founded. It is licensed under the
Apache License 2.0.

The client, like BBB, is pure HTML 5 and JavaScript. The backend consists of several services that work together to
provide a coherent video meeting experience. Most of these are developed under the Jitsi name but independent software
is also used - for example [Prosody](https://prosody.im) which is used for chat and authentication.

## Hosted Solutions
8x8 hosts Jitsi Meet themselves at [https://meet.jit.si](https://meet.jit.si), this is completely free to use and 
supports up to 100 participants per meeting. You can record meetings and upload them to DropBox (American company,
mind you) or live stream them over RTMP to a service of your choice (such as Twitch or YouTube Live).

Unfortunately, both the fact that 8x8 Inc. is an American company and the limit of 100 participants mean we need to look
elsewhere.

Looking around I found two providers of hosted Jitsi Meet in Europe. [bit](https://bit.nl) is a Dutch company that
provides (among other things) server hosting. They offer a private Jitsi Meet instance, unfortunately they haven't
responded to my emails so I can't say if they meet our requirements.

The other company I found is [Fairkom](https://www.fairkom.eu/fairmeeting). To be honest I don't really know what kind
of company they are since their _English_ site is half-German and my German is terrible. They seem to provide servers
and cloud-like functionality though so would probably meet our GDPR requirements. Their Jitsi Meet offering max out at
75 participants though which isn't enough for us so let's have a look at hosting Jitsi Meet ourselves.

I also discovered that [City Cloud](https://citycloud.se)'s video meeting platform is Jitsi Meet. They're actually
providing [IceWarp](https://www.icewarp.com) which is including Jitsi Meet as the video meeting platform. We've already
discussed City Cloud in the previous post however, so I'm not going to elaborate here.

## Self-Hosting
Installing Jitsi Meet isn't as straightforward as installing BBB, though the [documentation](
https://jitsi.github.io/handbook/docs/intro) does a good job of detailing the installation steps.

The only hangup I encountered was when we tested the service out and found out that recordings didn't work. It turns out
that for recordings to work you need to install an extra service called [Jibri](https://github.com/jitsi/jibri) that
handles recordings and livestreaming (to Twitch.tv, YouTube Live, or similar services). The installation
instructions for Jibri isn't as good as for Jitsi Meet, though with the help of a [forum post](
https://community.jitsi.org/t/jibri-setup-and-configuration-here-s-how-full-guide/90325) I managed to get everything
working - after messing up the passwords a few times.

## Evaluation
I _like_ Jitsi Meet. I think it's the best video meeting platform I've used. Given a choice I wouldn't hesitate to
choose Jitsi for meetings.

It works better than both Google Meet and Zoom on Firefox, has background blurring/replacement (on Firefox too!) and
even has push to talk if you're muted. The only issue we've had with Jitsi so far is the tiles jumping around in the
tiled layout from time to time. I have issues with the push to talk button not working properly for me - though I'm
fairly certain that's because I use [Synergy](https://symless.com/) to share the keyboard from my personal laptop.

### The Big Issue
The big issue with Jitsi Meet is the number of participants. At the time of writing, Jitsi Meet recommends no more than
35 participants on a single server (you can have more, but performance will likely degrade). This clearly isn't enough
for us so would disqualify Jitsi.

I _think_ there's a way to scale Jitsi Meet by breaking out the Video Bridge from the main Meet server and spreading the
participants between them. I know that you can host multiple separate conferences that way, but I think it's also
possible to have one big conference spanning multiple video bridges. Testing and implementing this is a bit too much
work for me at this point though. I'm sure I could figure it out eventually, but I haven't got the time so we need
something simpler that works with what we already have.

# Throwing More Services At The Problem
So, Jitsi Meet consists of several individual services that together form a complete video meeting platform. Can we
extend it by adding one more service?

I mentioned that Jibri supports livestreaming above and that's exactly what we're going to use. By only having the
relevant people (and me) in the meeting and then livestreaming that meeting to everyone else we can keep the number
of participants in the meeting low and still reach everyone who wants to watch. This not only allows us to reach our
targeted 200 participants, we can go way beyond that depending on which streaming provider we use.

## Streaming Platform
Obviously, we're not going to use Twitch.tv or YouTube to broadcast the webinar since both of these are American
services.

I do, however, know of a wholly Swedish streaming service called [Solidtango](https://www.solidtango.com/en/). I've
done some integration work with them at a previous job so I've got some experience with their service and a quick
check-in with them reveals that they're running their own servers which means we're in GDPR-compliant territory.

A few quick tests with Jibri livestreaming our meetings to Solidtango shows everything working fine so this is the
solution we went for. You can use Solidtango for selling access to your streams and videos with revenue sharing and
this requires your viewers to create an account and log in. Fortunately, you can make your videos and streams available
for free and not require an account to view. Viewers do have to have an account to participate in the chat though, but
we're fine with this since moderation would be hard otherwise - and you can still remain anonymous if you stay out of
the chat.

There are of course other GDPR-complaint streaming platforms out there ([PeerTube](https://joinpeertube.org/) was
mentioned on LinkedIn), but we found no reason to look beyond Solidtango since they're a good fit.

# Post-Webinar Thoughts
The webinar was held on the 5th of October and you can find the video [here](
https://factor10.solidtango.com/video/frukost-webinar-personuppgifter-i-molnet-vad-aer-egentligen-problemet). There were
more than 120 unique viewers and after the webinar was over we invited those who wanted to into Jitsi Meet for
discussion. We were at most 28 people in Jitsi with only one participant reporting issues with sound.

I count the webinar and the technology stack a success - and as far as I'm aware we were fully GDPR-compliant.

With our requirement of the number of participants greatly reduced, some of the services I've rejected would be in the
running again - most notably [CityCloud](https://citycloud.se) and [Fairkom](https://www.fairkom.eu/fairmeeting) which
are both running Jitsi Meet. When we reached that conclusion though, we already had our own Jitsi Meet server set up and
we decided to stick with that.

We're keeping the Jitsi Meet instance around and will probably move all our internal meetings over to it (just need to
scrub all old conferencing links from our calendars first). I'm not sure if we have decided on where to host the
[next webinar](
https://www.linkedin.com/posts/factor10-solutions-ab_den-1011-%C3%A4r-det-dags-f%C3%B6r-n%C3%A4sta-frukost-webinar-activity-6851414274007408640-Na_0)
but depending on the number of participants I think it's likely we're going with either Jitsi Meet or Jitsi Meet +
Solidtango.

## Honorable Mentions
The first post actually got a few comments on [LinkedIn](
https://www.linkedin.com/posts/raneland_the-search-for-a-gdpr-compliant-webinar-platform-activity-6847062419622170624-IK1e)
(I'm amazed and thrilled anyone even bothered to read it) and we've also gotten a few tips after the webinar. I have not
looked thoroughly at all of these but here's a short list if you want to dig a bit deeper yourself. All of these are
likely better candidates than the first 10 in the previous post.

### Eyeson
[Eyeson](https://www.eyeson.com) is a German webinar/meeting platform that has an interesting approach: instead of
broadcasting _everyone's_ camera feed to _everyone_ else in the meeting they encode _one_ video stream on their backend
and broadcast that to everyone. It's essentially the setup we did with Jitsi + Solidtango but with everyone's webcams
and completely integrated. I think it's an interesting approach but unfortunately everyone in the meeting can stop the
ongoing recording which makes hosting a webinar there that you intend to make available afterwards risky.

They also have an unusual billing structure (that I approve of) which forgoes tiers and instead charge you by the
minute regardless of the number of participants in the meeting.

I kind of like Eyeson, but they're not a good match for our webinar so maybe another time.

### Nextcloud Talk
[Nextcloud](https://nextcloud.com) is an open source (AGPL) "productivity platform" - think Google Workspace or Office
365 but you can host it yourself instead - or buy it hosted as a SaaS. I never bothered to look too deeply into this
because we had already decided that Jitsi + streaming was good enough for us.

### Switch
[Switch](https://www.switch.ch) is Swiss company that seems to specialize in IT infrastructure for educational
institutes. They have a public Jitsi Meet instance and you can order your own private instance as well. I'm assuming
that they run their own servers and are therefore GDPR-compliant, but I haven't actually verified it.

### Quickchannel
[Quickchannel](https://www.quickchannel.com) is a Swedish streaming, video and webinar platform. I haven't investigated
that much but the CEO assures me that they're running their own servers and their site says that you can run their
software completely on-prem so they do seem to fit our requirements.