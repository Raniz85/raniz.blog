---
title: "The Search for a GDPR Compliant Webinar Platform"
description: "How hard can it be to host a GDPR-compliant webinar?"
date: 2021-09-21
thumb: "800px-EU_flag_in_Italy.jpg"
# TODO: credit för bilden
draft: true
tags: 
    - gdpr
    - webinar
---
So, we're hosting a webinar about GDPR compliance. The basic premise is that a lot of people (and companies) assume that
it's legal to use services from American providers (such as Amazon Web Services, Microsoft OneDrive, or
Google Workspace) if they just store data about EU citizens in the EU or the service provider says they're
GDPR compliant. **This is not the case.**

So, of course we're going to host that webinar on Zoom like we've always done, right?

Maybe not, so let's take a moment and write down a few reasonable requirements for our new webinar platform:

1. GDPR compliant
2. Recording of webinars
3. Multiple speakers
4. Up to 200 attendees
5. No registration for attendees (i.e. we don't want your email address)

Let's dig a bit deeper into the first requirement: GDPR compliance. By this I mean that any company involved in providing
the webinar needs to follow GDPR as well as be based in Europe or any of the countries on the
[list of recognized countries that provide adequate data protection](
https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en).

To take the US as an example and show _why_ it is important to be on that list (the US is _not_), I refer to the following
quote from [this assessment from the EU Data Protection Board](
https://edpb.europa.eu/sites/default/files/files/file2/edpb_edps_joint_response_us_cloudact_annex.pdf):

> The US CLOUD Act thus states an extraterritorial reach of powers under the US Stored
Communication  Act.  Therefore,  service  providers  controlling  personal  data  whose  processing  is
subject to the GDPR or other EU or Member States’ law will be susceptible to facing a conflict of
laws between US law and the GDPR and other applicable EU or national law of the Member States.

You can read about the US CLOUD Act [here](https://en.wikipedia.org/wiki/CLOUD_Act), you can also [search for articles
on the _Schrems II_ ruling](https://www.qwant.com/?q=schrems+II+GDPR&t=web) if you're interested in digging a bit deeper.

Basically US federal law enforcement can demand data from any American company regardless of where it is stored - i.e.
the FBI can compel Google to hand over all data stored in IKEA's GCP account, regardless of which regions IKEA are
using. I'm not a privacy law expert so will be deferring to those that are, which means that if you're not on _the list_
you're _out_.

Since we require any company that touches the webinar to be GDPR compliant and restricts the countries they operate in
we also disqualify any platforms that use service providers based in countries outside the EU and not on _the list_ -
such as the big three cloud providers: Amazon Web Services, Microsoft Azure, and Google Cloud Platform. As you will see
below, this complicates things quite a bit.

# Let's Ask the Internet
I found a list [here](https://www.ventureharbour.com/webinar-software-10-best-webinar-platforms-compared/) of the 10 best
webinar software platforms in 2021. If that link is dead, no worries, I'll go through the list below and see how they 
match up against our requirements.

## 1. Demio
[Demio](https://www.demio.com) is run by Demio Holding, Inc. Being run by an American company immediately disqualifies
it for us, so there's no need to look at their actual product.

## 2. Livestorm
The description of [Livestorm](https://livestorm.co) says that it's based in France and that they're GDPR compliant so
this looks promising. Visiting their site shows a contact address in Woburn, Massachusetts however and their footer says
that the copyright belongs to Livestorm, Inc.

Their [Legal Notice](https://livestorm.co/legal-notice) however says that the platform is "published by" Livestorm SAS
in France. It also reveals that they are using AWS, which means that all data goes through an American company,
which means that Livestorm is disqualified.

## 3. Ever Webinar
[Ever Webinar](https://www.everwebinar.com) is run by Genesis Digital LLC out of Las Vegas, Nevada, United States and
as such isn't GDPR compliant.

## 4. WebinarJam
[WebinarJam](https://www.webinarjam.com) is run by the same company as Ever Webinar (Genesis Digital LLC) and as such
isn't GDPR compliant either.

## 5. Webinar Ninja
[Webinar Ninja](https://webinarninja.com) is run by Team ON PTY Ltd. based in Sydney, Australia. Australia is
unfortunately not on _the list_, so it's probably not OK to use. Regardless of that, their privacy policy says that
their servers are located in the US so even if Australia would be OK, the US is not so Webinar Ninja is out.

## 6. WebEx
[WebEx](https://www.webex.com) is made by Cisco WebEx, which is owned by Cisco Systems, Inc. - which I'm sure you've
heard of. Since Cisco is an American company, WebEx is disqualified.

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
they're using GetResponse for email marketing, and OVH Cloud (a French cloud provider, which at the moment of writing is
actually hosting this blog) and AWS for hosting. 

I saw a list of supported regions somewhere when I investigated them and it *seems* that you can select a region served
by OVH Cloud for your account which would land them in "not sure" territory (since we can't know for sure if any of our
data _do_ pass through AWS regardless of server choice), which sadly isn't good enough.

## 9. Livestream
[Livestream](https://livestream.com) is a webinar platform owned by Vimeo Inc. which is an American company.

## 10. Webinars On Air
Seems to have disappeared so I'm not sure if this list really was for 2021. Visiting www.webinarsonair.com makes Firefox
throw up a warning about the SSL certificate not being valid for that host and searching for them only returns other
sites mentioning them.

They were probably American anyways.

# There Must Be Others
So, that didn't bear any fruit. Can we come up with some alternatives ourselves?

The obvious Zoom competitors Microsoft Teams and Google Meet are American companies so aren't GDPR compliant. That
leaves non-american companies then of which I came up with two: Zoho and a Swedish cloud provider we're already using
named City Cloud.

## 11. Zoho
[Zoho](https://www.zoho.com) is an Indian company that provides more services than you can dream up. They probably have
an alternative to whatever other app you're using and their offerings seem decent, albeit navigating them can be a bit
messy.

Unfortunately India isn't on _the list_, so we can't be sure if using services from Indian companies is OK. I also
could not find any way of disabling email registration for attendees when I tried it out - you have to enter your email
address to get an email containing the link to the actual webinar.

Because of both of the above, Zoho is out.

## 12. City Cloud
[City Cloud](https://citycloud.se) is a Swedish cloud provider that runs [OpenStack](https://www.openstack.org/). They
also have a few additional offerings and among those is video meetings. Being Swedish with their own servers is great -
the GDPR is happy. Unfortunately they state on their product page that they only support up to 70 attendees which isn't
enough for us.

# Is This the End?
So, that's 15 platforms (counting Google Meet, MS Teams and Zoom) that don't fit our requirements. Are there any other
alternatives?

Sure, hang tight while I author the next post where I will explore two open source options ([BigBlueButton](
https://bigbluebutton.org/) and [Jitsi Meet](https://meet.jit.si/)), looking at both self-hosting and any SaaS offerings
I can find. Rest assured, there is some hope!
