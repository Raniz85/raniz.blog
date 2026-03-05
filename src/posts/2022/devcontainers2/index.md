---
title: "Isolated Development With Containers: Part 2"
description: "Making LXD containers usable for daily work"
date: 2022-09-13
thumb: "1280px-bentobox.webp"
thumbCaption: "Credit: Lorenia Regan, CC BY-NC-ND 2.0, Via Flickr"
thumbCaptionHref: "https://www.flickr.com/photos/lorenia/"
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

To show how profiles work, let's convert our UID and GID mappings into a profile and apply it to a new container.

First, create a new LXD profile, let's call it `devcontainer`:

```shell
$ lxc profile create devcontainer
$ lxc profile edit devcontainer
```

This will open up an editor where you can edit the configuration for your profile as YAML. Set its contents to:

```
config:
    uid 1000 1000
    gid 984  984
```

Replacing the UID and GID with the values you used in the last post if they're different to mine and remembering that
the first number is the ID on the host and the second the ID in the container that should map to that host-ID.

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

And on the second row we can see that uid 1000 inside the container is mapped to uid 1000 outside the container (if
you're intersted in the full format of the file, you can find it under
[the man page for user_namespaces](https://man7.org/linux/man-pages/man7/user_namespaces.7.html))

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

Anyways, here's two commands that together turn on DNS resolution for LXD containers:

```shell
$ resolvectl domain lxdbr0 '~lxd'
$ resolvectl dns lxdbr0 $(lxc network get lxdbr0 ipv4.address | cut -d / -f 1)
```

It assumes that you're using `lxdbr0` - which is the default bridge interface for LXD. If you're using another network
setup you'll have to enter some variation on the above command.

What we do here is tell systemd resolved that all lookups for domains ending in _.lxd_ should happen via _lxdbr0_ and
go to LXD's DNS server (which is listening on the IP address assigned to _lxdbr0_, which the last part of the command
extracts).

To see that it's working, we can now ping the container using the name we gave it:

```shell
$ ping -c 1 archlinux.lxd
PING archlinux.lxd(archlinux.lxd (fd42:5390:2724:be87:216:3eff:fe59:4582)) 56 data bytes
64 bytes from archlinux.lxd (fd42:5390:2724:be87:216:3eff:fe59:4582): icmp_seq=1 ttl=64 time=0.063 ms

--- archlinux.lxd ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.063/0.063/0.063/0.000 ms
```

This only works until the _lxdbr0_ interface is brought down, which happens when LXD stops. Then we need to run
those two commands again to make it work. To see this we can restart LXD which will recreate _lxdbr0_ and thus
remove the rules.

```shell
$ sudo systemctl restart lxd.service
$ ping -c 1 archlinux.lxd
ping: archlinux.lxd: Name or service not known
```

## Persisting It

As per [the official documentation](https://linuxcontainers.org/lxd/docs/stable-4.0/networks/), we can make it
persistent by creating a Systemd service file that makes sure that these commands are executed when _lxdbr0_ comes
up.

To do this, we create a new systemd service called _lxd-dns-lxdbr0.service_:

```shell
$ cat | sudo tee /etc/systemd/system/lxd-dns-lxdbr0.service <<EOF
[Unit]
Description=LXD per-link DNS configuration for lxdbr0
BindsTo=sys-subsystem-net-devices-lxdbr0.device
After=sys-subsystem-net-devices-lxdbr0.device

[Service]
Type=oneshot
ExecStart=/usr/bin/resolvectl dns lxdbr0 $(lxc network get lxdbr0 ipv4.address | cut -d / -f 1)
ExecStart=/usr/bin/resolvectl domain lxdbr0 '~lxd'

[Install]
WantedBy=sys-subsystem-net-devices-lxdbr0.device
EOF
```

Note that this will hardcode the IP address of the LXD DNS server into the file, so if you ever change it, you'll have
to update this file to reflect the changes.

We can now enable and start this service and we should have DNS resolution again:

```shell
$ sudo systemctl enable --now lxd-dns-lxdbr0.service
$ ping -c 1 archlinux.lxd
PING archlinux.lxd(archlinux.lxd (fd42:5390:2724:be87:216:3eff:fe59:4582)) 56 data bytes
64 bytes from archlinux.lxd (fd42:5390:2724:be87:216:3eff:fe59:4582): icmp_seq=1 ttl=64 time=0.034 ms

--- archlinux.lxd ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.034/0.034/0.034/0.000 ms
```

We can also restart LXD to see that it's still working after a restart:

```shell
$ sudo systemctl restart lxd.service
$ ping archlinux.lxd -c 1
PING archlinux.lxd(archlinux.lxd (fd42:5390:2724:be87:216:3eff:fe59:4582)) 56 data bytes
64 bytes from archlinux.lxd (fd42:5390:2724:be87:216:3eff:fe59:4582): icmp_seq=1 ttl=64 time=0.043 ms

--- archlinux.lxd ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.043/0.043/0.043/0.000 ms
```

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
  X11:
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
Enabling sound is essentially the same as graphical applications, but instead of mounting a directory we mount a proxy
socket. The profile for PulseAudio looks like this:

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

## Throwing it Away
Once I'm done with a project and certain that I don't need the tooling anymore I can just throw the container away and 
reclaim any disk space it took up.

```shell
$ lxc delete projectName
```

I'm still looking for a good way to pack up a container into some sort of archive and upload that to a cloud service
so that I can easily restore it if I should ever need it again. That might become part 3 of this series if I ever figure
it out.