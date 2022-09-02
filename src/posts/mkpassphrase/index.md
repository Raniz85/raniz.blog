---
title: "Gist: mkpassphrase"
description: "Need a new password that you can actually remember? Look no further!"
date: 2022-09-02
thumb: "password_strength.png"
thumbCaption: "Credit: xkcd.com"
thumbCaptionHref: "https://xkcd.com/936"
tags:
- python
- password
- passphrase
---
I've always liked passphrases because they're easy to remember and in cases when I don't need to remember them, they're
a lot easier to type in manually when I look them up in my [password manager of choice](https://bitwarden.com/).

One problem with them though is that a lot of the world has created password requirements around weak passwords and as
such require me to put capitals, numbers and special characters in a lot of my passwords - a long password consisting of
only lowercase characters doesn't pass these checks regardless of how long it is.

There is a passphrase generator in Bitwarden, but it's based on the Diceware EFF long wordlist, which at 7776 words isn't
terribly long. It also can't include special characters so we need to manually select one if our passphrase is going to
pass any password requirements, and since humans are terrible at choosing things at random I prefer my computer to do
that for me.

Luckily, I know how to make my computer do my bidding, so I wrote a short Python script that generates a passphrase from
an [Aspell](http://aspell.net/) dictionary, capitalizes one word and separates the words with random numbers and special
characters. The default language is Swedish, and to only use words that are between 4 and 10 characters in length. You
can change these via options - or you can just change the defaults in the code.

Here's an example (don't use this as your password):
```shell
$ mkpassphrase
kryssad#Bekymret1lekstugor
```

{% github_gist "Raniz85/1209eb09fa8e5cedc0106787aa0888cd" %}