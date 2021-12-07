---
title: "Isolated Browser Tabs with Firefox Multi-Account Containers"
description: "Log in to different accounts in different tabs"
date: 2021-12-06
thumb: "1280px-Container_Ship.jpg"
thumbCaption: "Credit: Muhammad Mahdi Karim, GPL 1.2 via Wikimedia Commons"
thumbCaptionHref: "https://commons.wikimedia.org/wiki/File:Container_Ship.jpg"
tags: 
    - firefox
    - containers
    - development
    - privacy
    - linux
---
As a software consultant I get to log in to all kinds of different services online. Some of these are unique per
customer but quite a lot of them collide - things like cloud or hosting providers, document collaboration, issue
trackers and communication software. Since I often work with multiple clients in a single week (or even day) logging in
and logging out of all accounts is not practical.

---

A few years ago I ran across [Firefox Multi-Account Containers](https://support.mozilla.org/kb/containers). At the time
I used it to be able to log in to our development and production AWS accounts at the same time. I now use it to keep
customer logins separate from each other. This means tha I can for example have multiple tabs with Microsoft Teams open
for different customers. This is especially good when working with large corporations whose SSO have a tendency to log
you in everywhere automatically. If you can pinpoint those sites to specific domains you can even pin them to a
container so that they always open there!

I'm not going to go into more detail here since Mozilla's own page does it much better so head over there and give it a
spin.

Just keep tabs of your tabs and which account belongs in which tab because if you accidentally log in to the wrong
account in the wrong container you can get _very_ confused until you realize what's up.
