---
title: "Isolated Development With Containers"
description: "Preventing different projects from jamming each other"
date: 2021-11-01
thumb: "1024px-jam.jpg"
thumbCaption: "Credit: Sally, CC BY 2.0 via Wikimedia Commons"
thumbCaptionHref: "https://commons.wikimedia.org/wiki/File:Jam.jpg"
draft: true
tags: 
    - lxd
    - containers
    - development
    - linux
---
I'm a software consultant. That means I get to see lots of different projects, most with their own unique technology
stack and required toolset. That also means that all those tools required to develop and run a project needs to be
installed somewhere.

Some customers require me to use a computer provided by them in which case this isn't an issue - once I'm done with the
project I hand back the computer and forget all about which tools were installed. Some customers however either doesn't
provide a computer or allow me to bring my own (something I prefer since I've set up my computer _just_ the way I want
it). In this case, said tools may eventually clutter up my computer or even cause conflicts with each other.

I run [Arch Linux](https://archlinux.org/). I do this because I like the control it gives me. Arch Linux is a _rolling
release_ distribution, this means that updates happen often and most package versions follow upstream release cadence.
This is in contrast to something like Ubuntu or Fedora which releases a set of packages and then usually don't make too
many changes until the next OS release.

Because most packages in Arch are updated shortly after a new version has been released upstream it may sometimes be
difficult (or even impossible) to install older version of something.

Let's take Java as an example. At the time of writing this you can install:

* Java 7
* Java 8
* Java 11
* Java 17

Working on a project that is still on Java 15? Tough luck.

Now, you could always download [OpenJDK](https://openjdk.java.net/) yourself and install it to /opt, but do that often
enough and eventually /opt starts to become rather cluttered and you may not remember which project depends on which
version.

# Running Projects in Isolation
So, to the point of this post. I decided I wanted to split up my computer into separate, isolated parts - one for me and
my own stuff and one for each customer or project.

To do this I'm going to use _containers_. Most of you probably think of Docker when you hear the word container and
while Docker has its uses it's built for running a single application and I want a complete environment - possibly to
run Docker containers in - so I'm not going to use that.

Now, I could go with a full-blown VM via [KVM](https://linux-kvm.org) or [Xen](https://xenproject.org), install Arch
Linux there and have a completely isolated operating system. This does feel a bit like overkill though so being Swedish
I'm going to go the _lagom_ route.

## LXC
Docker was initially (pre version 0.9) built on [LXC](http://linuxcontainers.org/), which is what I'm going to use
(well, sort of). LXC is a container system that can run multiple isolated Linux systems on the same host - much like
Docker. Unlike Docker however these are complete Linux systems with an init system and their own services. You can
essentially treat them as lightweight VMs. Another important difference between Docker and LXC is that LXC containers
can be run _unprivileged_. This means that they are run with fake user and group IDs - i.e. _root_ in a container is not
_root_ on the host system.

LXC is not the most straightforward system to administer though, so instead of using LXC directly I'm going to use
[LXD](https://linuxcontainers.org/lxd/introduction/), which is built on top of LXC and essentially acts as a frontend.

## LXD
LXD consists of two parts: The LXD daemon - called `lxd`, and the LXD client - confusingly called `lxc`. You start `lxd`
via your init system and then use `lxc` to administer your containers.

# Setting Up
I'm not going to go through all steps of setting up LXD here, there are better places for that which are hopefully kept
up to date as well. Here's the installation instructions for [Arch Linux](https://wiki.archlinux.org/title/LXD) which I
followed. If you run something else, refer to the [official documentation](
https://linuxcontainers.org/lxd/getting-started-cli/).

One thing worth noting here is that ran into issues with the network for my containers. This turned out to be because
LXD and [firewalld](https://linuxcontainers.org/lxd/getting-started-cli/) didn't really get along. There is a section on
this in the [official guide](https://linuxcontainers.org/lxd/docs/master/networks). I did not get that to work however 
so instead I created a new zone for LXD and put `lxdbr0` in that.

```shell
$ firewall-cmd --permanent --new-zone=lxd
$ firewall-cmd --permanent --zone=lxd --add-forward
$ firewall-cmd --permanent --zone=lxd --set-target ACCEPT
$ firewall-cmd --permanent --zone=lxd --change-interface=lxdbr0 --permanent
```

If you're not using Firewalld this will probably not be an issue.

# Creating Containers
Now, with LXD installed we can create our first container. 

```shell
$ lxc launch images:archlinux archlinux
```

This will download the Arch Linux image and create a new container named _archlinux_. You can enter the new container
using

```shell
$ lxc exec archlinux /bin/bash
```

This gives you a root shell that you can use to set up the VM, create a regular user and install whatever packages you
need.

# Accessing Host Files
Now that you have your container, you probably want to access some files from the host in the container. With _LXD_ you
do this by creating _devices_ that mount a host directory inside the container.

Here's how you mount a host directory inside the container so that you can access your ssh key and configuration, let's
mount the _Documents_ directory inside the container:
```shell
$ lxc config device add archlinux ssh disk source=/home/raniz/Documents path=/home/raniz/Documents
```

Now, let's try to create a file in the _Documents_ directory.
```shell
$ lxc exec archlinux -- sudo -u raniz touch ~/Documents/test
touch: cannot touch '/home/raniz/Documents/test': Permission denied
```

That didn't work. Let's try doing it as root instead:

```shell
$ lxc exec archlinux -- touch /home/raniz/Documents/test
touch: cannot touch '/home/raniz/Documents/test': Permission denied
```

Still no luck.

