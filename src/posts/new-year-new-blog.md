---
title: New Year, New Blog
date: 2019-01-20
tags:
  - post
layout: layouts/post.njk
description: 'Recharging, gathering inspiration, and writing on.'
---

## The road so far

A few months back, I spent a good amount of time working at the website for Futurice's Tech Weeklies.

Tech Weeklies is our, well, weekly gathering, where we share thoughts about tech and everything related. We have a great mix of people at the office, and I love seeing what everyone is passionate about! It's one of my favourite parts of working here.

Given that background, and having recently come back from the [performance.now()](https://perfnow.nl) conference, I was super motivated to work on the site. Taking on that task was a good opportunity to showcase what an accessible, performant site looked like in my mind.

And so we made it! You can find the [Tech Weeklies site here](https://techweeklies.futurice.com). We launched to a warm reception, achieved most of our goals, and content is being added every week. I was happy.

Also, I was exhausted. Between that burst of energy, travels, talk preparations and the darkness of Finnish November, it is fair to say that my batteries were empty.

I made a point to stash my laptop away on the weekends, and get away from coding a bit.

## Now

This was the tenth weekend without coding. I have recharged, and learned a thing or two about balancing my time.

I have been thinking about what it means to share my thoughts. ([I have written about that subject in the domain of photography before](https://fotis.photos/collection/2017/08/13/signal.html)). There are some hundred notes spread around my notebooks and chats with co-workers about programming, the people we build things for, and generally our existence in this machine. (Can you tell, the Finnish winter still has a hold on me).

I have been wanting a home for my tech writing for a while. I tried last year, and I didn't add much. Then, I thought back to what made the weeklies site so enjoyable for me:
- Optimise for adding content
- Use a stack you understand
- Start with the content, and build the rest around it

## The prompt

Many of the topics I have in mind tend to snowball into large, never-ending posts.

On Saturday, my colleague Juhis asked me a question about accessibility, markup and UX. I wrote a reply on Twitter.

On Sunday, I was still thinking that I want to explore and document the topic. So, I wrote down ["Linking to Headings"](/posts/linking-to-headings).

Then, I took that vision of a blog setup that I loved so much from Tech Weeklies, and plucked it into reality.

## What's in the blog?

Here is a quick summary of what we have, and what I like here.

I am always amazed by how many hours of human effort go into building the chains of tools and programs that we build. Consider this also an attempt to give credit to some of these people.

### Eleventy: Data Pipeline and Rendering

[Eleventy](https://11ty.io) is a simple static-site generator, by [Zach Leatherman](https://twitter.com/zachleat/).

The thing I like about Eleventy is how it recognises that data is the key. So much, in fact, that it supports a ton of templating languages: nunjucks (the one I use), handlebars, liquid, JS templates, markdown, plain text, JSON, HTML. It has "universal" helpers that augment each of these.

I had never touched Nunjucks before, but Eleventy made the transition so simple, that it wasn't daunting at all! Mixing and matching Markdown and Nunjucks makes for a great authoring experience. I can write prose, and fork out to more structured templating when I need more power. For example, I have "pseudo-components" that enable [images with fixed aspect ratios](https://github.com/fpapado/fotis.xyz/blob/master/src/_includes/components/MdImg.js) and [structured and accessible headings](https://github.com/fpapado/fotis.xyz/blob/master/src/_includes/components/Heading.js).

Another good thing about Eleventy is that it uses Javascript. I use JS every day, and even when I dislike it, I feel confident plugging things together with it. For example, I have to merge a manifest from PostCSS and another one from Rollup. I have a script that merges them and a custom `resolveHash` filter that reads the file and translates, say, `index.js` to `index.abc123.js`. I've had to write similar things in Ruby for Jekyll and my photo blog, and I'm still not sure.

### CSS: Tachyons + minimal atomic classes
I love [Tachyons](https://tachyons.io), by [Adam Morse](https://twitter.com/mrmrs_).

At a time when I thought I was utter shit at this frontend thing, it taught me that CSS is fun, and that I, too, could do it. It taught me CSS rules at a granular level and illustrated the inheritance and the cascade (at different points).

Tachyons also taught me a great deal about design. Scales and palettes are things I can't imagine starting a site without, these days. Mobile-first design and thinking about different devices is something close at hand when you use the atomic classes.

There's more things, that have shaped what I care about: colour contrast, and semantic markup. The Tachyons examples, with the HTML, CSS and demo side-by-side, acknowledging that people *will* copy your examples, and so they better be accessible.

I could write pages on this topic. Some other time, perhaps. I like the atomic classes approach, and I still use it a lot to glue things together. For more editorial content (such as markdown blocks), I use qualified/scoped selectors, such as `.article`. Fret not, I still use the scales and palettes!

I use [PostCSS](https://github.com/postcss/postcss) with [Autoprefixer](https://github.com/postcss/autoprefixer) to handle vendor prefixes in the compiled CSS.

### JS: A minimal amount, bundled with Rollup
I didn't add much client-side JS here. That is by design, to keep things lean. It uses very simple selectors and modules. I might need components if I start handling more complex loading states (that lazy Youtube embed...), but for now it's great.

[Rolllup](https://rollupjs.org/) hit v1 recently, and I am impressed by their advanced optimisations. What I really love though, is their vision of ES modules natively, and ways of pushing the standards forward. I don't use  much of that functionality, but I'm glad to have the option.

### Syntax highlighting
Syntax highlighting is handled by [Prism](https://prismjs.com/), by [Lea Verou](https://twitter.com/leaverou). Feels damn bulletproof, and having it on the server works wonders for keeping the site fast.

The syntax theme is [prism-a11y-dark](https://github.com/ericwbailey/a11y-syntax-highlighting) by [Eric Bailey](https://twitter.com/ericwbailey/).

### Fonts
The text is set in [Phantom Sans](https://www.futurefonts.xyz/phantom-foundry/phantom-sans), by Phantom Foundry.

It's "Work In Progress", much like this site, and I like how it looks. Furthermore, it is a Variable Font, with the weight axis being variable. This means that we only need one font file to load, and need only one extra layout for the page.

Implementing font loading strategies takes some work. It also adds complexity to maintain. I thought to try something different. I like how minimal the variable font + `<link rel="preload">` + `font-display: swap` can be. One important note: the font file must be small, and Phantom Sans definitely delivers, at 26kB!

### Colours
For Tech Weeklies, we got some stickers that had this beautiful pink/purple palette on them. I tuned the colours to have better contrast, and here we are! I had tried to do the same on my old website, but the palette was too busy.

(Aside: I would love to have light pink and gold on this page, but contrast on white is bad at best. But perhaps for the dark theme?)

### Other goodies
As I was writing the post on "Linking to Headings", I wanted to embed a Codepen.
I realised I could use their new [Prefill Embeds](https://blog.codepen.io/documentation/prefill-embeds/) feature. After a couple of hours of fighting nested templates, I got it working! I think it strikes a great balance of choice, demo, authoring experience, and accessibility. I'll write more about this soon!

I am also using [Workbox](https://developers.google.com/web/tools/workbox/) for some quick precaching. I want to explore offline article storage at some point, but for now it's good to have the hashing infrastructure set up.

## Wrapping up

This post is literally more than I have ever written on my blog, phew. It's been a long couple of months.

In terms of what's next, first I want to move some of my notes that people have found valuable. After that, I want to set up a talks page.

Let me know if there's anything you'd like to read about :)
