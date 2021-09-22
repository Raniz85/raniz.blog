---
title: "The Search for a GDPR Compliant Webinar Platform"
description: "How hard can it be to host a GDPR-compliant webinar?"
date: 2021-09-21
thumb: "800px-EU_flag_in_Italy.jpg"
draft: true
tags: 
    - gdpr
    - webinar
---
So, we're hosting a webinar about GDPR compliance. The premise of the webinar is that you should assume that
using american cloud providers isn't legal when dealing with data about EU citizens, even though you're storing the data
in the EU.

So, of course we're going to host that webinar on Zoom like we've always done, right?

Maybe not, so let's take a moment and write down a few reasonable requirements:

1. GDPR compliant
2. Recording of webinars
3. Multiple speakers
4. No registration for attendees (i.e. we don't want your email address)

Let's dig a bit deeper into the first requirement: GDPR compliance. By this I mean that any company involved in providing
the webinar needs to follow GDPR as well as based in Europe or any of the countries on the
[list of recognized countries that provide adequate data protection](https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en).
This does _not_ include the United States, which means that _all_ US companies will be disqualified.

Since we require any company that touches the webinar to be GDPR compliant and restricts the countries they operate in
we also disqualify any platforms that use service providers from countries not inside the EU or on the list I linked to
above - such as the big three cloud providers; Amazon Web Services, Microsoft Azure, and Google Cloud Platform. As you
will see below, this complicates things quite a bit.

# Let's Ask the Internet
I found a list [here](https://www.ventureharbour.com/webinar-software-10-best-webinar-platforms-compared/) of the 10 best
webinar software platforms in 2021. If that link is dead, no worries, I'll go through the list below and see how they 
match up against our requirements.

## 1. Demio
[Demio](https://www.demio.com) is run by Demio Holding, Inc. Being run by an American company immediately disqualifies
it for us, so no need to look at their actual product.

## 2. Livestorm
The description of [Livestorm](https://livestorm.co) says that it's based in France and that they're GDPR compliant so
this looks promising. Visiting their site shows a contact address in Woburn, Massachusetts and their footer says that
the copyright belongs to Livestorm, Inc. Looking at their [Legal Notice](https://livestorm.co/legal-notice) however says
that the platform is run by Livestorm SAS in France.

It also reveals that they are using AWS, which means that all data goes through an American company, which means that
Livestorm is disqualified.

## 3. Ever Webinar
[Ever Webinar](https://www.everwebinar.com) is run by Genesis Digital LLC out of Las Vegas, Nevada, United States.

## 4. WebinarJam
[WebinarJam](https://www.webinarjam.com) is run by the same company as Ever Webinar (Genesis Digital LLC) and as such
isn't GDPR compliant either.

## 5. Webinar Ninja
[Webinar Ninja](https://webinarninja.com) is run by Team ON PTY Ltd. based in Sydney, Australia. Australia is unfortunately not
on the list of approved contries so it's probably not OK to use. Regardless of that, their privacy policy says that
their servers are located in the US so even if Australia would be OK, the US is not so Webinar Ninja is out.

## 6. Webex
[WebEx](https://www.webex.com) is made by Cisco Webex. Cisco Webex is an American company owned by another American
company - Cisco Systems, Inc. which means they're disqualified.

## 7. GetResponse
[GetResponse](https://www.getresponse.com) is a Polish email marketing platform that apparently also has webinar support.
Being Polish, they aren't immediately disqualified and reading their privacy policy reveals the following tidbit:

> Recipients who we transfer the data to are based mainly in Poland and other countries of the European Economic Area
> (EEA), e.g., France. Some of them are based outside of the EEA. We’ve made sure that our service providers guarantee a
> high level of personal data protection. We comply with the applicable data protection laws and GetResponse confirms
> that the conditions set in the GDPR are met. 

"Mainly" isn't good enough for us and I never bothered to investigate this further because they wanted me to enter my
physical address and phone number when I tried to sign up.

## 8. ClickMeeting
[ClickMeeting](https://clickmeeting.com) is actually the most interesting platform on this list. They're a Polish company
and are very transparent with what services they're using.

Looking [here](https://knowledge.clickmeeting.com/uploads/2020/06/2020.09.Sub-contractros_list_EN.pdf) we can see that
they're using GetResponse for email marketing but also AWS for some hosting. 

I saw a list of supported regions somewhere when I investigated them and it seems that you can select a region served
by OVH Cloud (which is a French cloud provider) which would land them in "not sure" territory, which sadly isn't good
enough.

## 9. Livestream
[Livestream](https://livestream.com) is a webinar platform owned by Vimeo Inc. which is an American company.

## 10. Webinars On Air
Seems to have disappeared so I'm not sure if this list really was for 2021. Visiting www.webinarsonair.com makes Firefox
throw up a warning about the SSL certificate not being valid for that host and searching for them only returns other
sites mentioning them.

They were probably American anyways.

# Ok, Let's Look Ourselves
So, that didn't bear any fruit. Can we come up with some alternatives ourselves?

The obvious Zoom competitors Microsoft Teams and Google Meet are American companies so aren't GDPR compliant. That
leaves non-american companies then of which I came up with one: Zoho

## 11. Zoho
[Zoho](https://www.zoho.com) is an Indian company that provides more services than you can dream up. They probably have
an alternative to whatever other app you're using and their offerings seem decent, albeit navigating them can be a bit
messy.

Unfortunately India isn't on the list of recognized countries that provide adequate data protection, so we can't be sure
if using services from Indian companies are OK or not. I also could not find any way of disabling email registration for
attendees when I tried it out - you have to enter your email address to get an email containing the link to the actual 
webinar.

Because of both the above, Zoho is out.

# Is This the End?
So, that's 14 platforms (counting Google Meet, MS Teams and Zoom) that don't fit our requirements. Are there any other
alternatives?

Sure, hang tight while I author the next post where I will explore open source options - both self-hosted and SaaS
offerings. Rest assured, there is hope!