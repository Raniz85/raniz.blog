---
title: "The GDPR Compliant Webinar Platform Failed Us"
description: "Turns out that video processing on the CPU isn't very fast"
date: 2022-09-21
thumb: "1280px-video-glitch.webp"
thumbCaption: "Credit: Blake Patterson via Flickr,  CC BY 2.0"
thumbCaptionHref: "https://www.flickr.com/photos/blakespot/"
draft: true
tags: 
    - gdpr
    - webinar
    - ffmpeg
    - obs
---
Last year, I detailed our search for a GDPR-compliant webinar platform in [two](/2021-09-24_gdpr-webinar-platform1)
[posts](/2021-10-11_gdpr-webinar-platform2).

We actually held the webinar before the second post went live and I detailed my thoughts on the setup afterwards in the
second post. Everything was all well and good and when it came time to do another GDPR-related webinar last week we
went with the exact same setup - why fix something that isn't broken?

It turns it out it was indeed a bit broken, and it did completely break down on us during the webinar.
---

During the webinar we received complaints about the stream lagging and being choppy. This is something that we saw
during our technological dress-rehearsal earlier in the week but that I resolved by doubling the number of CPUs and
memory of the instance - we had scaled it down after the previous webinar to save on monthly costs.

To explain what actually happened here I need to go into some detail about how the video broadcasting setup works in
Jitsi Meet first.

# Meet Jibri
[Jibri](https://github.com/jitsi/jibri) is the Jitsi BRoadcasting Infrastructure. It is the piece of the Jitsi puzzle
that handles video streaming and recording. On a high level, it is a separate service that joins the meeting using a
remote-controlled Chromium instance and virtual X-screen. It then runs [ffmpeg](https://ffmpeg.org/) in screen-capture
mode to record or stream the meeting.

On the whole I think this is a pretty clever solution because it means that none of the UI needs to be duplicated in a
video renderer, and you're recording what a silent and hidden participant would see.

# Breaking it Down
So what went wrong then? Looking at the end of the ffmpeg logs that Jibri makes available we see a lot of the same kind
of message (you may need to scroll the code block below horizontally):

```
2022-09-15 06:49:49.306 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21313 fps= 26 q=23.0 size=  230237kB time=00:11:50.41 bitrate=2654.9kbits/s speed=0.853x
2022-09-15 06:49:50.335 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21324 fps= 26 q=23.0 size=  230391kB time=00:11:50.78 bitrate=2655.3kbits/s speed=0.853x
2022-09-15 06:49:51.337 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21340 fps= 26 q=23.0 size=  230557kB time=00:11:51.30 bitrate=2655.3kbits/s speed=0.853x
2022-09-15 06:49:51.337 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21351 fps= 26 q=24.0 size=  230666kB time=00:11:51.66 bitrate=2655.2kbits/s speed=0.853x
2022-09-15 06:49:52.337 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21365 fps= 26 q=24.0 size=  230816kB time=00:11:52.22 bitrate=2654.8kbits/s speed=0.853x
2022-09-15 06:49:52.337 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21379 fps= 26 q=23.0 size=  230989kB time=00:11:52.60 bitrate=2655.4kbits/s speed=0.853x
2022-09-15 06:49:53.337 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21397 fps= 26 q=23.0 size=  231159kB time=00:11:53.24 bitrate=2655.0kbits/s speed=0.853x
2022-09-15 06:49:53.338 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21403 fps= 26 q=22.0 size=  231214kB time=00:11:53.43 bitrate=2654.9kbits/s speed=0.852x
2022-09-15 06:49:54.344 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21414 fps= 26 q=24.0 size=  231307kB time=00:11:53.76 bitrate=2654.7kbits/s speed=0.852x
2022-09-15 06:49:54.620 INFO: [402] LoggingUtils$Companion$OutputLogger$1$1.call#42: frame=21424 fps= 26 q=23.0 size=  231419kB time=00:11:54.10 bitrate=2654.8kbits/s speed=0.852x
```

If you're not fluent in ffmpeg, the important part is the last part, the _speed_ at which ffmpeg is encoding. 0.853x
means that in one elapsed second, ffmpeg encodes 0.853 video seconds. This means that we're either dropping frames or
building up a queue and in this case Jibri is telling ffmpeg to encode with a fixed framerate so ffmpeg isn't allowed to
drop frames but will instead build up a queue.

Another thing we can see is that the log suddenly ends without ffmpeg saying anything about exiting (it usually spits
out a summary of what has been done before exiting), and looking at the kernel messages (`dmesg`) these lines
immediately stand out:

```
[302626.850611] Out of memory: Kill process 4191 (ffmpeg) score 470 or sacrifice child
[302626.852045] Killed process 4191 (ffmpeg) total-vm:5333272kB, anon-rss:4798592kB, file-rss:0kB, shmem-rss:8104kB
[302626.920219] oom_reaper: reaped process 4191 (ffmpeg), now anon-rss:16kB, file-rss:80kB, shmem-rss:8104kB
```

Taken together it's quite obvious that ffmpeg couldn't keep up with encoding the video, started building up a queue and
eventually ran out of memory at which point the kernel killed it, thereby stopping the broadcast.

# The Fallout
Unfortunately, ffmpeg being killed means that Solidtango stopped receiving any data which also means that not only did
the stream end, the recording that we were to put up for those who missed the webinar also weren't available.

Fortunately, there were only about 40 people watching the stream at this point so the immediate remedy was that we
invited everyone watching the webinar to the meeting in Jitsi so they could partake directly until the end of the
webinar.

The long-term fix is that [Daniel Melin](https://www.linkedin.com/in/danielmelin/) _very_ kindly agreed to do a repeat
of the webinar the next day so that we could record it and get it out.

# "Insanity is Repeating the same Mistakes and Expecting Different Results"
The above quote has been attributed to, among others, Einstein, but seems to have
[different origins](https://quoteinvestigator.com/2017/03/23/same/). Regardless, I think it applies here: running the
recording using Jibri and expecting that it'd work this time would be foolish (that said, when getting the above log
outputs I had troubles recreating the issue and eventually had to force ffmpeg to encode slower by taxing the system
synthetically).

To ensure that everything went smoothly on the recording session we needed a more reliable approach. Now, at my last
job - at [Spiideo](https://www.spiideo.com) - I worked quite a lot with video coding and if I had really thought about
it, I _know_ that live-encoding video on plain servers is shaky at best. This is because while your run-of-the-mill
cloud servers usually have fast memory and processors that runs circuits around most consumer gear, they lack one thing
that a lot of consumer gear have: hardware accelerated video encoding and decoding.

## Hardware vs Software
Encoding video is an intense process. Depending on the codec, various techniques are employed to encode as little
information as possible while retaining video quality (which those techniques are is out of scope of this post,
but the Wikipedia entry for
["Video" on the "Data Compression" page](https://en.wikipedia.org/wiki/Data_compression#Video) serves as a good starting
point if you want to go down that rabbit hole).

### Software

To get an idea of how intense video coding is, I've transcoded (decoded and then encoded again) the
[Big Buck Bunny](https://peach.blender.org/) short film (1080p, 60 fps) using ffmpeg and
the [x264](https://www.videolan.org/developers/x264.html) codec on my laptop (an Intel Core i7-1165G7 with 4 physical
cores at 2.8 GHz) and timed it:

```shell
time ffmpeg -hide_banner -loglevel error -i bbb_sunflower_1080p_60fps_normal.mp4 -c:v h264 bbb_sunflower_1080p_60fps_normal-soft.mkv
ffmpeg -hide_banner -loglevel error -i bbb_sunflower_1080p_60fps_normal.mp4    7335.25s user 53.58s system 654% cpu 18:49.75 total
```

The video itself is 10 minutes and 34 seconds long and it took my laptop 18 minutes and 50 seconds to re-encode it. That
gives us an encoding speed of 0.56, which is almost half speed.

To compare this, let's encode the same video on a cloud server. I've picked a _c5d.4xlarge_ on AWS for this. It has an
Intel XEON Platinum 8275CL processor with 24 physical cores (of which we'll have access to 8) running at 3.0 GHz. That
is twice the number of cores of my laptop and 7 % higher clock frequency per core. Being a server processor it'll have
better caches as well.

```shell
$ time ffmpeg -hide_banner -loglevel error -i bbb_sunflower_1080p_60fps_normal.mp4 -c:v h264 -preset slow -y bbb_sunflower_1080p_60fps_normal.mkv
ffmpeg -hide_banner -loglevel error -i bbb_sunflower_1080p_60fps_normal.mp4    3693.74s user 30.40s system 1243% cpu 4:59.54 total
```

That sped things up quite a lot; average encoding speed is 2.1. While it only has 7 % higher clock frequency and twice
as many cores it encoded the video a whole 3.7 times faster than my laptop.

### Hardware
The laptop has an ace up its sleeve though: the aforementioned hardware acceleration. This comes in the form of
[Intel Quick Sync Video](https://en.wikipedia.org/wiki/Intel_Quick_Sync_Video) and requires us to pass a few additional
flags to ffmpeg telling it to use hardware acceleration:

```shell
$ time ffmpeg -hide_banner -loglevel error -hwaccel vaapi -hwaccel_device /dev/dri/renderD128 -hwaccel_output_format vaapi -i bbb_sunflower_1080p_60fps_normal.mp4 -c:v h264_vaapi bbb_sunflower_1080p_60fps_normal.mkv
ffmpeg -hide_banner -loglevel error -hwaccel vaapi -hwaccel_device   vaapi -i  60.82s user 7.50s system 42% cpu 2:40.20 total
```

That finished in less than half the time the cloud server took, ending up at an average coding speed of 3.9, or 1.875
times as fast as the cloud server - and that's with almost no load on the CPU.

Let's summarise the results in a table:

| Encoder             | Elapsed Time | Encoding speed | Avg. CPU Load |
|---------------------|-------------:|---------------:|--------------:|
| x264 (Laptop)       |        18:50 |           0.56 |         654 % |
| x264 (Cloud Server) |         5:00 |            2.1 |       1 243 % |
| QSV (Laptop)        |         2:40 |            3.9 |          44 % |

It's clear that hardware acceleration is the winner here: not only is it significantly faster, but it also leaves the
processor free to do other things.

# Recording With Hardware Acceleration
So, how do we utilize hardware acceleration while recording?

## Jibri
One way would be to run Jibri locally on my laptop and make it use hardware acceleration when encoding. This is however
not that easy since the flags that Jibri sends to ffmpeg isn't easily modified. It also doesn't give us the ability
to choose between streaming and recording since Jitsi needs to be restarted to toggle between the two modes.

## OBS
[OBS](https://obsproject.com/), or Open Broadcaster Software, is open source software for video recording and
live-streaming. If you've ever watched someone stream on [Twitch](https://twitch.tv) or maybe the
[GamesDoneQuick](https://gamesdonequick.com/) charity speedrun marathons you've seen the results of OBS in action.

Besides being a very capable tool, it's also fairly easy to use and I've already used it to record dress-rehearsals for
my conference presentations. This meant that I already had it set up for hardware accelerated video encoding and only
had to create a new profile for our Jitsi meeting and start recording.

### Recording with OBS
Recording the video went well. We streamed it to SolidTango in a private event that my colleagues could watch as well as
recorded it to a local file on my laptop. We had to restart twice because I messed up: first because I forgot to record
myself, the second time because I had the stream open in another tab and got distracted when it came online and I heard
myself through it. Fortunately Daniel only got as far as introducing himself both times so hopefully he isn't too cross
with me over that.

# Conclusion
I think recording with OBS is a superior alternative to using Jibri. In addition to giving us the ability to both
record and stream at the same time (something Jibri doesn't) it also enables us to use the full capabilities of OBS
for producing the stream, should we want to.

The only thing I'm not that happy with is that Jitsi Meet doesn't show _me_ in the meeting while I'm talking, so the
video is only ever Daniel Melin - even when I'm talking. This is a small issue and could be solved by anonymously
joining the meeting in a private browsing window. I do think it's a non issue though, because in the future we should
have someone dedicated to manging OBS instead of having the host do both the hosting and the recording.

You can watch the recorded webinar [here](/todo) (TODO: Actual link).

