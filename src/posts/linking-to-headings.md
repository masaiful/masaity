---
title: Linking to Headings
date: 2019-01-20
tags:
  - html
  - a11y
description: 'Exploring the pattern of linking to headings in a document.'
hasCodepen: true
---

Recently, a co-worker, [Juhis](https://twitter.com/hamatti), asked me about the pattern of linking to specific headings in a document:

{% MdImg
  aspectRatio="6x4",
  position="top",
  src="/img/posts/linking_headings_1.jpg",
  alt="#Accessibility and #semantics question for #HTML: if I use an anchor name='foo', should I also add href attribute to it to make it link to itself?"
%}{% endMdImg %}

This is a pattern I see often in documentation sites, where the headings are linked from a Table of Contents. Users might want to refer back or save a link to a section for posterity. Exposing that link next to the heading can help that goal.

## Markup

The `name` attribute has been deprecated in HTML5. You can use the `id` attribute to achieve the same goal. I really like the `id`, because it is shared with form `label`, `aria-labelledby` and other cases of referencing content.

So, suppose we have a list of links that point to sections. A first attempt at linking things would look like this:

{% WithCodepen id="linking-headings-1", height="400" %}
{% highlight "html" %}
<h1>README</h1>

<h2>Table of contents</h2>
<ol>
  <li>
    <a href="#installation">Installation</a>
  </li>
  <li>
    <a href="#development">Development</a>
  </li>
  <li>
    <a href="#credits">Credits</a>
  </li>
</ol>

<h2 id="installation">Installation</h2>
<p>You can install the library from npm.</p>

<h2 id="development">Development</h2>
<p>You will need node version 10 installed.</p>

<h2 id="credits">Credits</h2>
<p>Here is an article about past work on this problem.</p>
{% endhighlight %}
{% endWithCodepen %}

We give each section heading an `id`, and associate the `href` to it.

What if we want to make the link available for copying?

## Affordances and announcements

I see two things to answer here:

- Visually representing the link
- Deciding whether to announce it to screen readers

### Visual representation

On the visual side, I think that it is a good idea to always have the link available. Having it appear or disappear based on hover (and focus!) states can be confusing. I also think that hiding it would make the behaviour less discoverable. Nothing bad really happens if someone clicks on the link; they are taken to where they were, and then they know what it does.

If I had to pick, I would go for a standalone hash symbol, '#'. You could probably add an icon as well. In general, I am curious to read any research/user testing on this pattern!

### Screen reader announcement (or not)

Now, what do we do about screen reader announcements? Having duplicate announcements can be bad, because there is no context for what each link does. On the other hand, I think that any user might want to save or send the link. In that case, removing the announcement might remove useful functionality.

Having said that, I would probably opt to not announce the link. The extra announcements do not make sense if you list links. Moreover, in cases where I have a table of contents (e.g. in a docs site), there are already explicit links, with context, available! The extra '#' would be very much an enhancement in that case, and the [comparable experience](https://inclusivedesignprinciples.org/#provide-comparable-experience) seems there.

## In the wild

Here are a few uses of this pattern that I spotted in the wild:

[Github README rendering](https://github.com/fpapado/fotis.xyz) shows a link only on hover, and hides the announcement with `aria-hidden="true"`. I am not a huge fan of that. Especially since READMEs are typically documentation and reference, I would think that making the link always visible would be more intuitive.

{% MdImg
  aspectRatio="6x4",
  src="/img/posts/linking-headings-github.jpg",
  alt=""
%}{% endMdImg %}

[CSS Tricks](https://css-tricks.com/2019-css-wishlist/) has the links always visible as '#' and always announced. They are placed at the beginning of headings, which keeps the alignment flush on the start.

{% MdImg
  aspectRatio="16x9",
  position="left",
  src="/img/posts/linking-headings-css-tricks.jpg",
  alt=""
%}{% endMdImg %}

The [Inclusive Design Principles](https://inclusivedesignprinciples.org) website offers an explicit link for sections. For example, the "Provide Comparable Experience" section has a link "Link to Provide comparable experience" at the end. I like how direct it is, and the placement at the section seems distinct enough. I would definitely consider this for a site!

{% MdImg
  aspectRatio="6x4",
  src="/img/posts/linking-headings-inclusive-design-principles.jpg",
  alt=""
%}{% endMdImg %}

## Final words

Given everything above, here is how I would do it:

{% WithCodepen id="linking-headings-2", height="400" %}
{% highlight "html" %}
<h1>README</h1>

<h2>Table of contents</h2>
<ol>
  <li>
    <a href="#installation">Installation</a>
  </li>
  <li>
    <a href="#development">Development</a>
  </li>
  <li>
    <a href="#credits">Credits</a>
  </li>
</ol>

<h2 id="installation">Installation <a href="#installation" aria-hidden="true">#</a></h2>
<p>You can install the library from npm.</p>

<h2 id="development">Development <a href="#development" aria-hidden="true">#</a></h2>
<p>You will need node version 10 installed.</p>

<h2 id="credits">Credits <a href="#credits" aria-hidden="true">#</a></h2>
<p>Here is an article about past work on this problem.</p>
{% endhighlight %}
{% endWithCodepen %}

Would you pick some other combination or priorities? Do you have user insights or more cases to consider? Get in touch, I'd love to know!
