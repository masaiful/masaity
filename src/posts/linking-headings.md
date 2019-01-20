---
title: Linking Headings
date: 2019-01-20
tags:
  - post
  - html
  - a11y
layout: layouts/post.njk
description: 'Exploring the pattern of linking to headings in a document.'
---

Recently, a co-worker asked me about the pattern of linking to headings as a fragment:

{% MdImg
  aspectRatio="6x4",
  src="/img/posts/linking_headings_1.jpg",
  alt="#Accessibility and #semantics question for #HTML: if I use an anchor name='foo', should I also add href attribute to it to make it link to itself?"
%}{% endMdImg %}

This is a pattern I see often in documentation sites, where the headings are linked from a Table of Contents. This seems like a good idea in that case. Typically, users will want to refer back or save a link for posterity, and exposing it helps with that goal.
