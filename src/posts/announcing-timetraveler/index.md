---
title: "Announcing Timetraveler"
description: "Ever needed to convert between Chrono and Time? I've got you covered"
date: 2025-10-07
thumb: "ronan-furuta-AHZQYFY1-5M-unsplash.jpg"
thumbCaption: "Credit: Ronan Furuta via Unsplash"
thumbHref: "https://unsplash.com/photos/red-and-black-motorcycle-with-brown-and-white-round-analog-clock-AHZQYFY1-5M"
tags:
  - development
  - oss
  - library
  - rust
---

One of my current projects at work is to gather data from several different platforms and combine them together to form a holistic view.

Since I am a lazy developer I tend to use available client projects whenever I can.
This time this means that I'm using both the [Azure DevOps Rust API](https://crates.io/crates/azure_devops_rust_api) and the [Octocrab](https://crates.io/crates/octocrab)
crates to communicate with Azure DevOps and GitHub respectively.

Using client libraries that someone else has already written is very convenient, however they usually make their own technology choices.
As an example, _Azure DevOps Rust API_ is built with [TypeSpec](https://typespec.io/), which uses [Reqwest](https://crates.io/crates/reqwest) for HTTP calls,
while _Octocrab_ uses [Hyper](https://hyper.rs).

Apart from increasing the number of dependencies of the project and having to compile both _Reqwest_ and _Hyper_, this doesn't actually mean that much to me.

What means something though, is their respective choices of date and time handling.

_TypeSpec_ has chosen [Time](https://time-rs.github.io/) for representing dates and times in the response structs,
whereas _Octocrab_ has chosen [Chrono](https://crates.io/crates/chrono/0.4.42).

_Azure DevOps_ was the first service I integrated with,
so since that client uses _Time_,
I went with that for the internal model as well.

This means that I can't use the _Chrono_ values from _Octocrab_ directly, but have to convert them to _Time_ first.

## Chrono vs Time

I'm not going to go into that much details here;
if you're here because you can't choose between the libraries,
have a look at their respective API documentations and pick the one you like the best&mdash;they both cover more or less the same functionality,
are actively maintained,
and you probably can't go wrong with either.

That said, here are some differences that I find significant:

* _Time_ has a macro for quickly creating <i>OffsetDateTime</i>s. This is a godsend when writing tests. However, I don't like that it doesn't accept "full" ISO8601-formatted strings (e.g. _2025-10-07T07:24:35.325+02:00_)
* _Chrono_ has support for actual time zones whereas _Time_ only supports fixed offsets (i.e. no automatic adjustment of daylight savings time).
* _Chrono_ uses strftime-compatible/inspired parsing and formatting syntax. _Time_ uses its own custom format&mdash;which is arguably nicer, but also less familiar.

## Conversion

Anyways,
I was stuck with using both of them and found myself needing to convert between _Chrono_'s _DateTime&lt;Utc&gt;_ and _Time_'s _OffsetDateTime_.
And I need to do this in both directions since I need to pass arguments to the client where the source data is <i>OffsetDateTime</i>s and then convert _DateTime&lt;Utc&gt;_ in the response to _OffsetDateTime_ so I can store it in the internal model.

After searching around a bit and determining that neither crate has support for the other (which I didn't expect them to have), I concluded that I had to write my own conversion functions.

Seeing as I'm probably not alone in having this issue, I decided to do it properly as a utility crate and publish it for others to use.

And this brings us here.

## Announcing Timetraveler

[Timetraveler](https://crates.io/crates/timetraveler) is a crate for converting between the different equivalent structs in _Chrono_ and _Time_ while retaining as much information as possible.

Here's a quick example:

```rust
use timetraveler::{chrono::AsDateTime, time::AsOffsetDateTime};
use time::{macros::datetime, OffsetDateTime};
use chrono::{DateTime, Utc, FixedOffset};
use chrono_tz::{Tz, Europe::Stockholm};
use rxpect::{expect, expectations::EqualityExpectations};
 
// A time::OffsetDateTime
let dt = datetime!(2024-01-01 12:00:00 +02:00);

// Convert to chrono::DateTime<Stockholm>
let utc: DateTime<Utc> = dt.as_date_time_utc();
expect(utc.to_rfc3339().as_ref()).to_equal("2024-01-01T10:00:00+00:00");

// Convert to chrono::DateTime<FixedOffset>
let offset: DateTime<FixedOffset> = dt.as_date_time_offset();
expect(offset.to_rfc3339().as_ref()).to_equal("2024-01-01T12:00:00+02:00");

// Convert to chrono::DateTime<Tz> - i.e. a specific timezone
let stockholm: DateTime<Tz> = dt.as_date_time(Stockholm);
expect(stockholm.to_rfc3339().as_ref()).to_equal("2024-01-01T11:00:00+01:00");

// Convert back to time::OffsetDateTime
let roundtrip: OffsetDateTime = stockholm.as_offset_date_time();
expect(roundtrip).to_equal(dt);
```

This starts out with an _OffsetDateTime_ from _Time_ and then converts it to <i>Chrono</i>'s _DateTime_ with three different time zones: _UTC_, fixed offset (e.g. east 2 hours), and the actual time zone _Europe/Stockholm_.
Finally it is converted from _DateTime&lt;Tz&gt;_ back into an _OffsetDateTime_.

Note that since we convert to the _Europe/Stockholm_ time zone, the final _OffsetDateTime_ will have a different offset than the one we started with&mdash;1 hour east instead of 2 hours east&mdash;the time it represents will still be the same though.
If we would have converted the _DateTime&lt;FixedOffset&gt;_ instead,
the offset would remain intact.

There are conversions for "naive" dates, times and date times as well (i.e. without time zones and offsets).

At the moment _Timetraveler_ only supports conversion between _Chrono_ and _Time_, but in the future more crates can definitely be added.

The crate itself only has two dependencies: _Chrono_ and _Time_,
so if you're already using both of them,
adding _Timetraveler_ should not bloat your project noticeably.

```shell
$ cargo add timetraveler
```

Enjoy!


