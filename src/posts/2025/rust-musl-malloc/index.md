---
title: "Performance of static Rust with MUSL"
description: "Static builds are great right? Sure, just make sure you know what you're doing"
date: 2025-02-06
thumb: "patti-black-2LO0CkTMFCg-unsplash.jpg"
thumbCaption: "Photo by Patti Black via Unsplash"
thumbHref: "https://unsplash.com/photos/brown-and-black-turtle-on-ground-2LO0CkTMFCg"
---

# Performance of static Rust binaries

_This post focuses on static builds of Rust programs for Linux,
some of the information here can be applied to Windows and MacOS as well,
but I make no guarantee of the correctness or applicability on anything other than Linux._

I like Rust.
If you've spoken about programming with me for more than a few sentences you're probably aware of that.

One of the many features I like is that it produces mostly static binaries.
This means that all libraries that you depend on are compiled into the binary,
and you can just ship a single binary to your users.

Now, this isn't true for _all_ libraries that rust use.
Most significantly,
the C runtime is _not_ compiled into the binary but dynamically loaded when the program starts.

Usually, this isn't much of an issue since most Linux distributions use compatible versions of the [GNU C Library](https://www.gnu.org/software/libc/).
If you're running a Rust program compiled on a newer distribution on an older distribution or vice versa it can definitely cause issues.

So to ensure portability, we really should compile the C runtime statically as well.

The most common way of doing this is to use the _x86_64-unknown-linux-musl_ target and Rust will compile against [musl](https://musl.libc.org/),
which is an alternate implementation of the C runtime with a focus on being lightweight, which makes it quite suitable for static compilation.

With a completely static binary, we have the option of baking it into a _scratch_ container image if we're distributing our program as a container.
Of course, since it's a static single executable, you can just send your users that and skip the Docker image.
However, some platforms require a container to run - platforms like Kubernetes, AWS Lambda, Azure Functions/Container Apps/Web Apps - so distributing the binary won't always work.

Scratch container images are enticing because they contain nothing other than the program they run. No Linux distributions, no utilities, no Bash;
only what you put inside them.

In case of a static Rust program, that probably means a single executable.

```Dockerfile
FROM scratch

COPY target/86_64-unknown-linux-musl/release/program /
ENTRYPOINT ["/program"]
```

It doesn't really get any lighter than that.

So, all good, right?

Well, mostly.

The installed size of _glibc_ on Arch Linux is [48.2 MiB](https://archlinux.org/packages/core/x86_64/glibc/) whereas _musl_ only takes up [3.7 MiB](https://archlinux.org/packages/extra/x86_64/musl/).
With a size difference that large there are bound to be tradeoffs - and there are.
There's a [list of differences on the musl site](https://wiki.musl-libc.org/functional-differences-from-glibc.html) but the functional differences isn't everything that differ.

I stumbled upon one such difference last week when we were playing around with [The One Billiow Row Challenge](https://github.com/gunnarmorling/1brc).
To showcase the issue, here's a fairly simple Rust program that generates about one million passwords by reading from _/dev/random_ with as many threads as you have processor cores and then outputs the time that took.
It's a silly thing to do, but it serves as a good example for the sake of this blog post.

## The example

```rust
const ITERATIONS: usize = 1_000_000;
const PASSWORD_LENGTH: usize = 32;
const PASSWORD_BYTES: usize = (PASSWORD_LENGTH as f64 * 9f64 / 11f64) as usize;

fn generate_passwords(amount: usize) -> Vec<String> {
    let mut random = File::open("/dev/urandom").expect("Failed to open /dev/urandom");
    let mut passwords = Vec::new();
    let mut buf = [0u8; PASSWORD_BYTES];
    for _ in 0..amount {
        random.read_exact(&mut buf).expect("Could not read data from /dev/urandom");
        let password = BASE64_STANDARD.encode(&buf);
        passwords.push(password);
    }
    passwords
}

fn main() {
    let start = Instant::now();
    let mut passwords = Vec::new();
    let concurrency = available_parallelism().expect("Could not read available parallelism").get();
    let thread_iterations = ITERATIONS / concurrency;
    let remainder = ITERATIONS % concurrency;
    let handles = (0..concurrency)
        .into_iter()
        .map(|index| {
            thread::spawn(move || {
                generate_passwords(if index < concurrency - 1 {
                    thread_iterations
                } else {
                    thread_iterations + remainder
                })
            })
        })
        .collect::<Vec<_>>();
    for handle in handles {
        passwords.extend(handle.join().expect("Failed to fetch passwords from worker thread"));
    }
    println!(
        "Generating {} passwords with {} threads took {} ms",
        passwords.len(),
        concurrency,
        start.elapsed().as_millis()
    );
}
```

If we run this, we quickly see a considerable difference in run times:

```shell-session
$ ./target/release/passwords
Generating 1000000 passwords with 22 threads took 56 ms
```

```shell-session
$ ./target/x86_64-unknown-linux-musl/release/passwords
Generating 1000000 passwords with 22 threads took 513 ms
```

That's about 10 times slower with the static build.

I'll spare you the full journey I went on in finding out why the performance differ this much between dynamic and static rust binaries and instead fast-forward to the cause,
which I found in [this issue on RipGrep's GitHub repository](https://github.com/BurntSushi/ripgrep/issues/1268#issuecomment-486432534).

It turns out the memory allocator in musl is a fair bit slower than the one in Glibc,
especially for multithreaded workloads where it encounters a lot of lock contention.

## What is a memory allocator, anyways?

In the simplest sense, a memory allocator is a function that reserves a slice of memory for you so that you can put whatever you want in there.
Guaranteeing that no one else is using that chunk of memory at the same time.

The most common way of allocating memory is to call the method _malloc_. 
_malloc_ is defined in the ISO C standard and since history has caused essentially all operating system to have a C standard library implementation,
_malloc_ is always available.
Using it in other languages avoids reimplementing a bunch of low-level memory management.

While you probably won't make calls to _malloc_ in languages other than C,
most of them use _malloc_ somewhere under the hood.

And it is the implementation of this allocator that is the issue with musl - it's not as performant as the one in Glibc.

## Solution

To solve this, there are several avenues we can go down.
I'll start with the most straightforward one, which is also the most generic and the one you should probably go for,
and then we'll explore other solutions in further blog posts.

The allocator in Rust is used via the [_GlobalAlloc_ trait](https://doc.rust-lang.org/std/alloc/trait.GlobalAlloc.html).
By providing an alternate implementation and annotating it with `#[global_allocator]` we can tell Rust to use another implementation.

For our use-case there exists two suitable alternatives:

* jemalloc
* mimalloc

[jemalloc](https://github.com/jemalloc/jemalloc) is the malloc implementation used in FreeBSD and NetBSD but is also available as a standalone library that can be used anywhere it can be compiled.
It was originally written by Jason Evans to replace the old alloc implementation that was suffering from poor multi-threaded performance because of lock-contention -
that sounds like a familiar issue.

[mimalloc](https://microsoft.github.io/mimalloc/) is a compact general-purpose from Microsoft originally developed for the runtimes of the Koka and Lean languages.
As jemalloc it is available as a standalone library and can be used as a drop-in replacement for malloc.

To use either of these we need implementations of _GlobalAlloc_ that calls into these C libraries.
Luckily, someone else has already done that for us in the [tikv-jemallocator](https://crates.io/crates/tikv-jemallocator) and [mimalloc](https://crates.io/crates/mimalloc) crates.

So all we need to do is to depend on either of these crates when targeting MUSL,
specify them as the global allocator and we should be fine.

Using target-specific dependencies we can depend on _tikv-jemallocator_ only when targeting MUSL

_Cargo.toml_:
```
[target.'cfg(target_env = "musl")'.dependencies]
tikv-jemallocator = "0.6"
```

_main.rs_
```rust
#[cfg(target_env = "musl")]
use tikv_jemallocator::Jemalloc;

#[cfg(target_env = "musl")]
#[global_allocator]
static GLOBAL: Jemalloc = Jemalloc;
```

With this, Cargo will pull in the _tikv_jemallocator_ crate if we're building against a MUSL target and skip it otherwise,
the same goes for the use and allocator definitions.

Compiling and running this results in a time that is only slightly slower than when using Glibc.

```shell-session
$ ./target/x86_64-unknown-linux-musl/release/passwords
Generating 1000000 passwords with 22 threads took 67 ms
```

If we switch to _mimalloc_ the performance is on par with Glibc:

```shell-session
$ ./target/x86_64-unknown-linux-musl/release/passwords
Generating 1000000 passwords with 22 threads took 57 ms
```

There are tradeoffs between these. I have not done a deep-dive into these (yet?) but there are [some evidence](https://github.com/rust-lang/rust-analyzer/issues/1441)
that mimalloc uses more memory than both Glibc and jemalloc, which is something to keep in mind.

So, should you always use a different allocator when targeting MUSL?

I think so,
and I'll make sure to remember to use jemalloc as the global allocator whenever I write a Rust application that will be targeting MUSL -
just like [RipGrep does](https://github.com/BurntSushi/ripgrep/blob/e2362d4d5185d02fa857bf381e7bd52e66fafc73/crates/core/main.rs#L40).