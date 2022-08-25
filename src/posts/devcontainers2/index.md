---
title: "Isolated Development With Containers: Part 2"
description: "Preventing different projects from jamming each other"
date: 2022-08-12
thumb: "1280px-nescafe-jars-production.jpg"
thumbCaption: "Credit: Nestlé, CC BY-NC-ND 2.0, Via Flickr"
thumbCaptionHref: "https://www.flickr.com/photos/nestle/"
draft: true
tags: 
    - lxd
    - containers
    - development
    - linux
---
In the [last post](/2022-08-12_devcontainers1/) I showed how to set up LXD so that we can use containers for isolated
project development.

In this post I will elaborate on this and make it a bit more useful by enabling:

* Easier setup using LXD profiles
* Container hostnames resolvable via DNS
* Graphical applications
* Sound

# Easier Setup with LXD Profiles
An LXD profile is a named, reusable configuration snippet. These can be anything you can set in the container
configuration.

To show LXD profiles, let's convert our UID and GID mappings into a profile and apply it to a new container.

First, create a new LXD profile, let's call it `devcontainer`:

```shell
$ lxc profile create devcontainer
$ lxc profile edit devcontainer
```

This will open up an editor where you can edit the configuration for your profile as YAML. Set its contents to:

```
config:
  raw.idmap: |
    uid 1000 1000
    gid 984 984
```

Replacing the UID and GID with the values you used in the last post if they're different to mine.

## Applying Profiles
Now that we've created a profile we can add it to a container, so let's create a new container and assign the profile to
it.

```shell
$ lxc launch images:archlinux archlinux2
$ lxc exec archlinux2 -- useradd -g users -m raniz
$ lxc profile add archlinux2 devcontainer
$ lxc restart archlinux2
```

To verify that it's working we can list the UID maps inside the container:

```shell
$ lxc exec archlinux2 cat /proc/self/uid_map
         0     100000       1000
      1000       1000          1
      1001     101001      64535
```

And we can see that UID 1000 is indeed mapped to itself.

## Defining Mounts in Profiles
Another thing that we probably want to do with profiles is defining common directories that we want to mount inside our
containers. Personally I have my _.vim_, _.ssh_, and _.gnupg_ directories mounted inside most of my containers.

Let's take my SSH profile as an example:
```shell
$ lxc profile show ssh
config: {}
description: SSH LXD Profile
devices:
  ssh:
    path: /home/raniz/.ssh
    source: /home/raniz/.ssh
    type: disk
name: ssh
used_by:
  - /1.0/instances/projectA
  - /1.0/instances/projectB
  - /1.0/instances/projectC
```

Now, getting access to your SSH keys inside a container is as easy as adding the profile to that container and
restarting it.

# Resolving Containers via DNS
I access my containers over SSH because that's the easiest way for me. My setup of
[Antigen](https://github.com/zsh-users/antigen) also gives me a nice prompt telling me which container I'm inside when
I go over SSH. Something I don't get if I use `lxc exec`.

This, and accessing any services I develop over the network requires me to know the IP address of the container. You
can get that by listing all the containers:

```shell
$ lxc list
```

```
+------------+---------+------------------------------+-----------------------------------------------+-----------+-----------+
|    NAME    |  STATE  |             IPV4             |                     IPV6                      |   TYPE    | SNAPSHOTS |
+------------+---------+------------------------------+-----------------------------------------------+-----------+-----------+
| archlinux  | RUNNING | 10.130.72.86 (eth0)          | fd42:5390:2724:be87:216:3eff:fe59:4582 (eth0) | CONTAINER | 0         |
+------------+---------+------------------------------+-----------------------------------------------+-----------+-----------+
```

However, entering and remembering IP addresses is not very ergonomic, so I'd prefer if I could use a DNS name of sorts
to access it.

Luckily, that's rather easy if you're using [systemd-resolved](https://wiki.archlinux.org/title/Systemd-resolved),
which you are using right? Because it's pretty
[awesome](https://fedoramagazine.org/systemd-resolved-introduction-to-split-dns/).

Anyways, here's a one-liner that turns on DNS resolution for LXD containers:

```shell
$ systemd-resolve --interface lxdbr0 --set-domain '~lxd' --set-dns $(lxc network get lxdbr0 ipv4.address | cut -d / -f 1)
```

It assumes that you're using `lxdbr0` - which is the default bridge interface for LXD. If you're using another network
setup you'll have to enter some variation on the above command.

# Graphical Applications
When it comes to graphical applications we have two ways of enabling applications inside the container to display
graphical interfaces on the host.

Note that I'm still using Xorg so this applies to X. I have not yet switched to Wayland so if you're on Wayland you'll
have to figure this out for yourself. That said, I think the solution for Wayland will be very similar.

## X-Forwarding over SSH
The first attempt I made was to use SSH X-forwarding. I've used this occasionally in the past for firing up graphical
applications. Most often VisualVM for debugging purposes. It rarely works very well, but I figured that since this
is an SSH session over the local network there wouldn't be any issues.

Alas, it wasn't so. Applications started using SSH X-forwarding were noticeably more sluggish than applications started
on the host, so I needed something else.

## Granting Access to the X Server
To make applications run as smoothly as possible we can give them direct access to the X-server by mounting the X socket
into the container at the expected place. We also need to add a gpu to the container.

I've done this with a profile called X11 that looks like this:

```
config:
  environment.DISPLAY: :0
description: X11 LXD profile
devices:
  X0:
    path: /tmp/.X11-unix
    source: /tmp/.X11-unix
    type: disk
  mygpu:
    type: gpu
name: x11
used_by:
- /1.0/instances/archlinux
```

Add this to the container (`lxc profile add archlinux x11`) and you should now be able to run graphical applications.

```shell
$ ssh archlinux.lxd 'export DISPLAY=:0; xterm'
Authorization required, but no authorization protocol specified

xterm: Xt error: Can't open display: :0
```

Whoops. The X server is blocking the request because they're not from localhost. This is easily fixed by executing

```shell
$ xhost +local:
```

on the host to tell the X server that local connection should always be allowed - I suggest you put that command
somewhere that is executed whenever you login to your graphical environment.

You also need to configure the `DISPLAY` variable in your environment if you're using SSH to access your container since
the environment variable in the profile only applies to `lxc exec`.

# Sound
Getting sound working is essentially the same as for graphical applications, but instead of mounting a directory we
mount a proxy socket. The profile for PulseAudio looks like this:

```
config:
  environment.PULSE_SERVER: unix:/tmp/.pulse-native
description: PulseAudio LXD profile
devices:
  PASocket1:
    bind: container
    connect: unix:/run/user/1000/pulse/native
    gid: "984"
    listen: unix:/tmp/.pulse-native
    mode: "0777"
    security.gid: "984"
    security.uid: "1000"
    type: proxy
    uid: "1000"
name: pulse-audio
used_by:
- /1.0/instances/archlinux
```

Adjust the UID and GID if needed. Note that you'll need to configure PULSE_SERVER in your environment if using SSH.

# Working with Containers
So, how do I work with my containers?

I have one base container that I've set up. It could be the _archlinux_ container we set up in these posts. And when I
start on a new project I clone that container using:

```shell
$ lxc copy archlinux projectName
```

This gives me a working container with everything set up in less than a second. I can then modify this container as I
see fit by adding or removing profiles, mounting host directories and installing the tools that I need.

If I need a distribution other than Arch Linux I can fairly quickly set up a new container using the same profiles,
though I would need to set up the base system from scratch, including the user account and group.