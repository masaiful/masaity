---
title: Linking to Headings
date: 2019-01-20
tags:
  - post
  - html
  - a11y
layout: layouts/post.njk
description: 'Exploring the pattern of linking to headings in a document.'
hasCodepen: true
---

Recently, a co-worker asked me about the pattern of linking to specific headings in a document:

{% MdImg
  aspectRatio="6x4",
  src="/img/posts/linking_headings_1.jpg",
  alt="#Accessibility and #semantics question for #HTML: if I use an anchor name='foo', should I also add href attribute to it to make it link to itself?"
%}{% endMdImg %}

This is a pattern I see often in documentation sites, where the headings are linked from a Table of Contents. This seems like a good idea in that case. Typically, users will want to refer back or save a link for posterity, and exposing the links can help with that goal.

## Markup

The `name` attribute has been deprecated in HTML5. You can use the `id` attribute to achieve the same goal. I really like the `id`, because it is shared with form labels, aria-labelledby and other ways of referencing content.

So, a first attempt at linking things would look like this:

{% WithCodepen id="linking-headings-1" %}
{% highlight "html" %}
<h1>README</h1>
<a href="#introduction">Introduction</a>
<h2 id="introduction">Introduction</h2>
{% endhighlight %}
{% endWithCodepen %}

We associate the href with the id, and we're done.
But what if we want to make link available for copying?

## Affordances and announcements

I see two things to answer here:

- Visually representing the link
- Deciding whether to announce it to screen readers

### Visual representation

On the visual side, I think that it is a good idea to always have the link available. Having it appear or disappear based on hover (and focus!) states can be confusing. I also think that hiding it would make the behaviour less discoverable. Nothing bad really happens if someone clicks on the link; they are taken to where they were, and then they know what it does.

If I had to pick, I would go for a standalone hash symbol, '#'. You could probably add an icon as well. In general, I am curious to read any research/user testing on this pattern!

### Screen reader announcement (or not)

Now, what do we do about screen reader announcements? Having a repeated '#' announcements can be bad, because there is no context for what the link does. On this page, for instance, you would have five nonsensical '#' links. On the other hand, I think that any user might want to save or send the link. In that case, removing the announcement might remove useful functionality.

I would probably opt to not announce the link. The extra announcements do not make sense if you list links. Moreover, in cases where I have a table of contents (e.g. in a docs site), there are explicit links, with context, available! The extra '#' would be very much an enhancement in that case, and something comparable is there.

## In the wild

(This section is a Work In Progress)

Here are a few uses of this pattern that I spotted in the wild:

- Github README rendering (shows only on hover, hides with aria-hidden)
- CSS Tricks (always visible, always announced)
- This blog (via markdown automation; always visible, aria-hidden)

## Final words

Given everything above, here is how I would do it:

{% WithCodepen id="linking-headings-2" %}
{% highlight "html" %}
<h1>README</h1>
<a href="#introduction">Introduction</a>
<h2 id="introduction">
  Introduction <a href="#introduction" aria-hidden="true">#</a>
</h2>
{% endhighlight %}
{% endWithCodepen %}

Would you pick some other combination? Do you have user insigths ore more cases to consider? Get in touch, I'd love to know!
