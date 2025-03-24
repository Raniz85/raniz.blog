---
title: "Repatriating documents: replacing Google Docs and Office 365 with European services"
description: "Exploring, and selecting, European alternatives to Google Docs and Microsoft Office 365"
date: 2025-03-24
thumb: "anete-lusina-rFKBUwLg_WQ-unsplash.jpg"
thumbCaption: "Photo by Anete Lūsiņa via Unsplash"
thumbCaptionHref: "https://unsplash.com/photos/man-standing-inside-airport-looking-at-led-flight-schedule-bulletin-board-rFKBUwLg_WQ"
tags:
  - eurostack
  - data-sovereignty
---


{% collapsible "TL;DR (spoilers)" %}
Both factor10 and I went with [kDrive from Infomaniak](https://www.infomaniak.com/en/ksuite/kdrive).
It has feature parity with both OneDrive and Google Drive (except for the photo handling of OneDrive) and
uses [OnlyOffice](https://www.onlyoffice.com/) as document editors.

I pay EUR 11.11 per month for 3 TiB storage and 6 users.

factor10 pays EUR 6.58 per month per user for [kSuite pro](https://www.infomaniak.com/en/ksuite/ksuite-pro),
which includes 3 TiB of storage per user.
That also includes the rest of kSuite,
if you go with just kDrive Pro it's EUR 7.40 per month but includes 6 TiB of storage per user.
{% endcollapsible %}

I've been dissatisfied with most of the "free" services that we use day-to-day for quite a while now.
I shut down my Facebook account in 2018 and abandoned my Instagram account not too long after.
I've never used GMail, and I've been using alternative search engines for almost a decade now
(though these are also free, and unfortunately often source their results from either Google or Microsoft).

Another aspect is GDPR.
The EU-US Data Privacy Framework is built on very shaky grounds, and it is going to be challenged in court on April 1
&mdash; and I think it is likely to fall.

At factor10, we started talking about replacing all our US-based services with European alternatives because of GDPR.
While there has always been some sort of framework or agreement in place between the EU and the US,
they have always fallen, and we're surprised that the current one has held up this long.
We moved our webinars to [Jitsi Meet](https://meet.jit.si) in [2021](/http://localhost:8080/2021-10-11_gdpr-webinar-platform2/),
and have been serving the recorded sessions with [Solidtango](https://solidtango.com) since the same time.
[factor10.com](https://factor10.com) and the other sites we've done has been made with GDPR in mind too,
with hosting at [GleSYS](https://glesys.se) and usage statistics via [Plausible](https://plausible.io).
But we never really got started with migrating the software that runs our day-to-day.

Fast-forward until mid-January 2025 and it has become a priority.

# What we're replacing.

## Me

Personally, I've had all my files in OneDrive for quite a while.
When my wife entered the picture we got an Office 365 family account and moved all her files from iCloud to OneDrive 
so we could keep track of everything together.

When I acquired a server running TrueNAS, I set it up with bidirectional sync via RClone 
&mdash; this has unfortunately not worked for a couple of months because OneDrive seems to tell RClone some files have different sizes than what is then sent,
causing RClone to raise a data validation error.

## factor10

We have all our company files in Google Drive.
We frequently collaborate on documents by writing in them together, commenting and making suggestions.
We have several shared drives as well as a few (legacy) shared folders.
Some folders and drives are shared with everyone, some with specific people.

# The requirements

<div class="two-columns">

<div>

## Me

### Must haves

* Bidirectional sync with TrueNas or RClone
* At least 3 TiB of storage - most of which are photos in both JPEG and RAW formats.
* Personal storage areas
* Folders shared between me and my wife

### Bonus

* "On this day" - where we get a notification every day with the photos take on that date previous years.
* Dedicated photo viewer

</div>
<div>

## factor10

### Must haves

* At least 500 GiB of storage
* Personal storage areas
* Shared storage areas
* File and folder sharing with read/write permissions with external people
* Online document editors with multiple simultaneous editors
* Comments in documents

### Bonus

* Edit-suggestions in documents
* More storage
* Synchronization with a local folder

</div>
</div>

# The alternatives
I've made heavy use of [European Alternatives](https://european-alternatives.eu) when researching alternatives.
I've also used good old web search (though not Google!), and probably asked Mistral's Le Chat once or twice.

Here are all the relevant alternatives that I/we considered, in no particular order.

## OnlyOffice

[OnlyOffice](https://www.onlyoffice.com/) is an Office suite from the Latvian company Ascensio System SIA.
It is open source and can be used standalone or integrated with other services.
There are installable desktop editors for all three major operating systems as well as mobile apps for iOS and Android.
It comes with editors for text documents, spreadsheets, and presentations.
They focus on MS Office compatibility which means that they use the MS Office document formats (.docx, .xslx, and .pptx).
They support both comments and suggestions as well as granular sharing where you can have multiple public links with different permissions.

Ascensio also sells a SaaS solution (also called OnlyOffice) that includes cloud storage, the OnlyOffice editors, email, calendar, project management, CRM, team messaging, and a wiki.

The SaaS solution is offered in a few different varieties:

* DocSpace
* Docs Enterprise
* Workspace
* Docs Developer
* DocSpace Developer
* Docs Home Server
* Docs Family Pack

And I can't really tell what the difference between them is.
They all also have different pricing structures and hosting options.
Some are billed by the number of users and some by the number of concurrent "connections", which I think is open documents.
Some are hosted in their SaaS whereas others are licenses for self-hosting.

We created an account a few years ago which is still active on their free tier.
If I choose to upgrade it to a paid plan,
I'll get the "business" plan for USD 6 per month.
An offer I can find nowhere on their official site.

I like the OnlyOffice editors, they are capable and feel like a solid alternative to Microsoft Office.
More so than Google Docs.

I'm not very impressed by their SaaS though. 
The pricing structure and the available offers are confusing and all services except the document storage and editing does not feel like something we would have use for.
Both the CRM and the chat are too simple to suit our needs.
If you use only the document storage and editors it's a solid choice
&mdash; if you can figure out which package to get...

## Proton for business

[Proton AG](https://proton.me) is a Swiss company with an outspoken focus on privacy.
It was started as a crowdfunding campaing by a few scientists at CERN,
but since 2024 it is owned by the Proton Foundation, a non-profit whose purpose is "to serve the world".
All their source code is open,
they have Sir Tim Berners-Lee as an advisor to the board,
and they contribute funds towards that goal of serving the world by protecting privacy, freedom of speech, and democracy.

They're most famous for Proton Mail, which is their encrypted email service where mails sent to other Proton users are fully encrypted.

Since the launch of Mail in 2015,
Proton has been adding services and the full suite now includes: email, calendar, VPN, password management, cloud storage and an online text editor.

Proton for business is priced at EUR 12.99 per user per month and include all of the above with 1 TiB of storage per user.

Proton Family costs EUR 23.99 per month and includes 3 TiB of storage and up to six users.
There is also a Duo option which costs EUR 14.99 for up to two users with 1 TiB of storage.

I like Proton, but their document editor is too basic for factor10 (not to mention that they have no support for spreadsheets or presentations).

## Infomaniak kDrive

[Infomaniak](https://www.infomaniak.com) is a Swiss cloud provider that prides itself on being ethical and environmentally conscious.
It started as a user group in the '90s in Geneva and then went from building custom computers to offering webhosting services.
All their datacentres run on certified renewable energy and use outside air for cooling &mdash; no airconditioning anywhere.
The latest one even recycles the excess heat as district heating for about 6000 homes.

While their primary business is as a webhost, domain registrar and public cloud provider,
they also offer a SaaS called kSuite which is marketed as a secure collaboration suite for businesses.

It consists of: email, calendar, video meetings (kMeet), team messaging (kChat), cloud storage (kDrive), document editors,
encrypted note sending (kPaste), encrypted file transfer (SwissTransfer) and a QR-code generator (Chk).

As Proton, Infomaniak is also working with open source &mdash; though not all their software is released as open source.
Instead of developing their own solutions and releasing them as open source, however,
they have opted to use existing solutions to build their software portfolio.
kMeet is [Jitsi Meet](https://meet.jit.si/),
kChat is [Mattermost](https://mattermost.com/),
and the document editors are OnlyOffice.

kDrive offer both private and shared folders and both files and folders can be shared with internal and external users with read and write permission (no restrictions to only comment or suggest).
An odd quirk is that files can only be shared from the kDrive interface and not from inside the document editors.

For syncing, Infomaniak has their own graphical sync application as well as WebDAV support (which works for TrueNAS).

While kSuite is their main offering, both kDrive and email can be purchased separately without access to the rest of the suite
(though kPaste, SwissTransfer and Chk seem to be open to the public without registration).

kDrive Team is offered at EUR 11.11 per month and includes 3 TiB of storage and up to six users.
Additional storage can be purchased for EUR 36 per month per 5 TiB, up to a maximum of 18 TiB.

kDrive Pro is offered at EUR 7.40 per user per month and includes 6 TiB of storage with additional storage available for the same price as for Team, but with a maximum of 106 TiB.

kSuite Pro is offered at EUR 6.85 per user per month with 3 TiB of storage per user and includes the rest of the software portfolio in the price.

I like Infomaniak as a company.
Their values seem to align with mine and the fact that they're using excess heat from the latest datacentre as district heating gets them a gold star in my book.

I also like kDrive.
The interface is nice, it has almost all the functionality I could ask for and I like the OnlyOffice editors.
I'm assuming they have some sort of Enterprise license with OnlyOffice,
so I would think that paying for kDrive indirectly also funds the development of OnlyOffice
(I will check this with them and report back here).

## Nextcloud

[Nextcloud](https://nextcloud.com/) is a fork of [OwnCloud](https://nextcloud.com/).
Both are open-source collaboration suites developed by German companies. 
The history is a bit messy, but the end result seems to be that Nextcloud is the more popular choice.

Unlike all other services I've considered, Nextcloud is not a SaaS, but only available for self-hosting.
You (or someone else) host a Nextcloud instance that is solely for you and your team.

By default, it includes document storage, document editors, team messaging, tasks, and a whiteboard application.
In addition to this, there is an "app store" where you can install additional applications that provide further functionality.

Since it is open-source and self-hosted, there is really no limit on the amount of storage or users you can have (there is clustering support for running multiple instances as one system).
Nextcloud Gmbh sells licenses for Nextcloud Enterprise.
The enterprise version gives you access to security updates for older releases if you're one of those who don't upgrade their software on a regular cadence,
as well as access to some enterprise applications and some certifications for compliance and GDPR.

Apart from the document storage and editing, Nextcloud isn't really that interesting to factor10.
The team messaging, tasks and whiteboard applications are too simple for our use-cases.

The document storage is solid and supports fine-grained sharing and shared folders. The document editors (Nextcloud Office) are based on [Collabora](https://www.collaboraonline.com/) by default,
but OnlyOffice and Microsoft Office (requires an Enterprise license and an available Office Online Server) can be set up as editors instead.
I'm not a huge fan of the default Nextcloud Office based on Collabora.
I like that Collabora is built on [LibreOffice](https://www.libreoffice.org/), but the UI is low on contrast and difficult to navigate.
If we were to pick Nextcloud, I'd probably opt for replacing Nextcloud Office with OnlyOffice.

As for running Nextcloud, I could easily set it up in a VM on my home server and use it over VPN.
While pretty much all of us at factor10 could run our own instance of Nextcloud on a public cloud provider, that is not something we want to do. We'd rather focus on our customers and buy the hosting from someone else,
and luckily for us, there are several options available.

I'm not going to go into a detailed cost analysis here, but self-hosting Nextcloud on a public cloud runs anywhere from about EUR 450 to EUR 200 a month for a server that can store 500 GiB of data to 20 users.

Paid-for hosting of Nextcloud is available from several providers and the ones I've looked up are:

* [RedPill-Linpro](https://www.redpill-linpro.com/en) - A Swedish cloud/SaaS provider that specialises in hosting open source software
* [Safekloud](https://safekloud.eu) - Hosted Nextcloud from the Swedish webhost WebbPlatsen.
* [ITSL](https://itsl.se/) - The hosting branch of IT-Säkerhetsbolaget, a Swedish consultancy focused on data security.
* [NetWays](https://nws.netways.de/en/saas/nextcloud/) - A German IT company that provides consulting services as well as hosting of a lot of open source software
* [Stellar](https://www.stellarhosted.com/nextcloud/) - A Dutch company that hosts open source software

Prices and configuration of these differ a lot and some are Nextcloud Enterprise while some are not.
If you're interested in hosted Nextcloud I urge you to check out the above and talk to their sales departments about price.

## Jottacloud

[Jottacloud](https://jottacloud.com/en/) is a Norwegian company focused on cloud storage.
They offer various plans for both persons and business and have a strong focus on backing up your devices.
Their data centres are located in the Norwegian mountains (which is easy, Norway is mostly mountains...), powered by 100% renewable energy and cooled with sea water.
They claim to be fully carbon-neutral with zero CO2 emissions.

For document editing, they use Microsoft Office Online, which sends your documents to Microsoft's servers while editing and then syncs the changes back to Jottacloud.
This makes them a no-go for factor10, unfortunately.

Syncing on Linux is done via their own CLI application and as far as I can tell, it's immediate and not scheduled.

They offer various plans for both personal and business use.
One of the more interesting ones offer unlimited storage capacity for one user,
though they throttle the upload speeds once you go past 5 TiB.
The one that would suit me is SEK 149 (about EUR 13.5) for 5 TiB of storage with up to five users.
What that offer doesn't say however is that you only get 1 TiB of storage per user
&mdash; i.e. you can not have two users and store 4 TiB on one and 1 TiB on the other.

## pCloud

[pCloud](https://pcloud.com) is a Swiss cloud storage provider that offers lifetime storage for a one-time fee.
They have plans for personal, family and business use and the family plan includes up to 5 users and comes in a 2 TiB and 10 TiB flavour for EUR 595 and EUR 1499 respectively.

They don't have any collaboration features as far as I can tell and the 2/10 TiB plans are either too small or excessively large.
Paying EUR 1499 is also a lot of money even if it's a one-time payment for a lifetime of storage &mdash; you're also betting that pCloud will outlive you.

# The decision

## Me

I've gone with Infomaniak kDrive Team.
The 3 TiB storage fits perfectly and with 6 users I can also give my parents their own accounts so they can store their stuff there as well.
EUR 11.11 per month is cheaper than what I pay for OneDrive, which is a nice bonus.

kDrive has no photo management so we'll lose "On this day", I'll have to replace that with something else.
Probably something running on the home server.

## factor10

factor10 is also going with Infomaniak, but with kSuite Pro and not kDrive.
The price is lower than for kDrive Pro and in the end will give us more storage (not that we need it).
Going with kSuite also allows us to check out their other offerings and evaluate whether they can replace any other services
(spoiler: we've already switched from Slack to kChat and from Google Meet to kMeet).

# Final notes

Personally, kDrive was the best offer both feature-wise and price-wise.
I actually signed up for Jottacloud and I like their service in general &mdash; from what I saw, they have very good photo management.
Their sharing is too limited for me though, and the fact that I won't be able to use 2 TiB of storage on one of the five accounts is a deal-breaker.

factor10 went with Infomaniak because of several reasons. Chief among them though, is that they give off a good impression.
Both as a company and with their services.
While I think OnlyOffice is the better document management system,
kSuite is a close second and with the additional services being built on other open source solutions we're considering,
kSuite is the overall better choice for us.

The choice also isn't that big of a deal.
If we discover something better 
&mdash; or something better is created,
we've already switched once and this means we can switch again.