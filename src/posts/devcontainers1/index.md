---
title: "Isolated Development With Containers: Part 1"
description: "Preventing different projects from jamming each other"
date: 2022-08-11
thumb: "1280px-fresh-squeezed.webp"
thumbCaption: "Credit: Caitlin Regan, CC BY 2.0, Via Flickr"
thumbCaptionHref: "https://www.flickr.com/photos/caitlinator/"
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
This is in contrast to something like Ubuntu or Fedora which releases a set of packages and then typically only release
security- and bugfixes until the next OS release which will contain major version upgrades.

Because most packages in Arch are updated shortly after a new version has been released upstream it may sometimes be
difficult (or even impossible) to install an older version of something.

Let's take Java as an example. At the time of writing this you can install:

* Java 8
* Java 11
* Java 17
* Java 18

Working on a project that is still on Java 7? Tough luck.

Now, you could always download [OpenJDK](https://openjdk.java.net/) yourself and install it to /opt, but do that often
enough and eventually /opt starts to become rather cluttered and you may not remember which project depends on which
version. Not to mention the hassle of switching between different versions of Java for different projects.

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

The rest of this post assumes that you've set up LXD to run unprivileged containers (which is the recommended way).

One thing worth noting here is that ran into issues with the network for my containers. This turned out to be because
LXD and [Firewalld](https://firewalld.org/) didn't really get along. There is a section on
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
$ lxc config device add archlinux Documents disk source=/home/raniz/Documents path=/home/raniz/Documents
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

Still no luck. The "problem" here is that our container is unprivileged. If we execute a command that stalls for a while
(i.e. `sleep 10s`) and then check the active processes from another terminal we can see which user the command is
running as. Here's the output of `$ ps -ef | grep "sleep 10s"` while running `$ lxc exec archlinux sleep 10s` in another
terminal:

```
raniz    3878475   20661  0 07:36 pts/2    00:00:00 lxc exec archlinux sleep 10s
root     3878484   22304  0 07:36 ?        00:00:00 /usr/bin/lxd forkexec archlinux /var/lib/lxd/containers /var/log/lxd/archlinux/lxc.conf  0 0 0 -- env HOME=/root USER=root LANG=C.UTF-8 TERM=tmux-256color PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -- cmd sleep 10s
100000   3878491 3878484  0 07:36 pts/1    00:00:00 sleep 10s
```

The first row contains my invocation of `lxc exec archlinux sleep 10s`. The second row is the command that the LXD
daemon is executing to actually run the command in the container. And the third row is the actual command running inside
the container.

Note that my command shows up as my user (_raniz_), the lxd command is running as _root_, but the command in the
container is running as UID 100000, which is a user that doesn't exist on the host. If we run `id` inside the container
it will tell us that our UID is 0 (_root_), but outside the container it is actually 100000. This explains why not even
the root user of the container is allowed to create files in my _Documents_ directory - because it's actually not root
but rather user 100000, which has no permissions to my _Documents_ directory. The same goes for the _raniz_ user, but
with effective UID 101000 instead.

To allow our user inside the container access files on devices originating outside the container we have two options:

1. Create a group on the host with a GID that exists inside the container
2. Map the user on the host to the user inside the container

## Creating a Group on the Host
This is pretty straightforward: we create a new group on the host with a GID that exists inside the container and grant
this group the permissions we want.

In our Arch Linux container, the _users_ group has GID 984, this means that it's effective GID on the host will be
100984. If we create that group and allow it to write to the _Documents_ directory we should be fine.

```shell
$ sudo groupadd -g 100984 lxdusers
$ sudo usermod -a -G lxdusers raniz
```

You can then either change group ownership of the directory to _lxdusers_, or you can use
[ACLs](https://wiki.archlinux.org/title/Access_Control_Lists):


Changing ownership:
```shell
$ chown :lxdusers Documents
```
(if the above command doesn't work it's probably because your groups haven't updated. Either log out and in again or 
prefix the command with `sudo -u $USER ` to run it in a new shell).

Using ACLs:
```shell
$ setfacl -m "g:lxdusers:rwx" Documents
```

We can now create files in _Documents_ from our container:

```shell
$ lxc exec archlinux -- sudo -u raniz touch ~/Documents/test
```

## Mapping the User or Group Inside the Container
The previous approach works, but produces somewhat messy results because files created inside the container will be
owned by the effective UID and GID, so if we look at the permissions of the newly created file we get this:

```shell
$ stat -c "%A %U (%u), %G (%g)" ~/Documents/test
-rw-r--r-- UNKNOWN (101000), lxdusers (100984)
```

This now means that our host user doesn't really have ownership of files created inside the container. For me, that is a
problem and the solution to that is to make the user inside the container have the effective UID be the same as that
of the host user.

To do this we need to do two things:

1. Allow LXD to map users from the host to the container
2. Tell LXD how to map users from the host to the container

### Granting LXD Permissions to Map Users and Groups
The files _/etc/subuid_ and _/etc/subgid_ which you probably touched when setting up LXD tells the kernel who is allowed
to map which UIDs. The information we put in here controls which effective UIDs and GIDs LXD are allowed to use.

To allow LXD to map our UID and our GID to the container we need to add them to this file:

```shell
$ echo "root:$(id -u):1" | sudo tee -a /etc/subuid
$ echo "root:$(id -g):1" | sudo tee -a /etc/subgid
```

This allows LXD to map our UID and GID (1000 and 984 in my case) in our containers. The next step is to tell LXD how to
do this

### Telling LXD to Map Users and Groups
We can tell LXD to map an UID on the host to an UID inside the container and vice versa with the
[raw.idmap](https://linuxcontainers.org/lxd/docs/master/userns-idmap/) configuration key. It works like this:

```
uid <host UID> <container UID>
gid <host GID> <container GID>
```

For my Arch Linux container running on my Arch Linux host, they are the same both inside and outside the container
(1000 and 984), but to generalize we can call `id` both inside and outside the container to get the correct values.

```shell
$ h_uid=$(id -u)
$ c_uid=$(lxc exec archlinux -- id -u raniz)
$ h_gid=$(id -g)
$ c_gid=$(lxc exec archlinux -- id -g raniz)
$ echo "uid ${h_uid} ${c_uid}\ngid ${h_gid} ${c_gid}" | lxc config set archlinux raw.idmap -
$ lxc restart archlinux
```

If we now create a new file in our _Documents_ directory and inspect it, we'll get:

```shell
$ lxc exec archlinux -- sudo -u raniz touch ~/Documents/test2
$ stat -c "%A %U (%u), %G (%g)" ~/Documents/test2
-rw-r--r-- raniz (1000), users (984)
```

And this means that our user inside the container now has the same effective UID as our user on the host.

Now, this means that our container is a little bit less secure since the user inside the container has the exact same
privileges as the user outside the container. With ACLs and a group on the host you get more fine-grained control over
what the user inside the container can access. 

This isn't a problem for me because I don't use containers for permission control but rather to sandbox project tooling
and as a way to run specific Linux distributions if I need to. It's also a good way to quickly clean up once I'm
finished with a project because then I can just delete the entire container and not worry about any leftover packages
installed on my system.

# Next Steps
Now that we're up and running and can manipulate the host filesystem the next step is to make the container a bit more
useable.

That is too much for this post though, so in the next one I will show how to enable graphical applications, sound,
SSH access, DNS and make setting up new containers a bit more ergonomic using LXD profiles.
