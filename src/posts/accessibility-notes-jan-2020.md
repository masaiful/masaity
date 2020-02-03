---
title: Accessibility Notes, January 2020
date: 2020-01-31
tags:
  - accessibility
  - a11y
description: 'A collection of notes on accessibility topics at work, from January 2020.'
hasCodepen: true
---

At work, I spend much of my time consulting with co-workers about accessibility. This is the second in a series of posts about common topics that come up, or other things I want to share. Let's dive right in!

## Expandable Menus

A common topic is menus that expand and collapse, toggling a set of items (typically navigation links below) them.

When people run into this, and want to make it more accessible, their search brings them to the ARIA `menu` and `menubutton` roles. While it seems reasonable ("it says menu on the tin" and "semantics are good, right?"), I usually advise against it.

The `menu` role is meant for a type of "application", which in ARIA (and screen reader implementations) implies a specific set of interactions. Screen readers might go into a specific application mode upon encountering a `menu`.

As an example, you would probably use the `menu` role if you were implementing Google Docs' top-bar menu (the one that says `Files`, `Edit` etc.), rather than a hamburger menu, or a menu of sharing options.

Another reason not to use `menu`, in my experience, is that its implementation has a number of moving parts that can go out of sync as a project goes along. As the ARIA Authoring Practices document says, ["a role is a promise"](https://www.w3.org/TR/wai-aria-practices-1.1/#no_aria_better_bad_aria). A `menu` widget must act like a `menu`, and it turns out there are a few things involved to do that. [You can read the interactions and markup on the ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton) guide.

There are keyboard interactions involved, and a set order of nesting the markup for `menu` and `menuitems`. Most often, I see `menuitems` go on nested child nodes instead of immediate ones. At that point, the implementation is wrong, but it certainly might look right to someone! Even worse, it might look daunting. If a piece of code looks daunting, then people avoid touching it and it only accumulates cruft. That can be dangerous for the accessibility of a project long-term.

I love this article by [Sarah Higley on Roles and Relationships](https://sarahmhigley.com/writing/roles-and-relationships/) and the various moving part of compound widgets. I think she outlines much of the same concerns, better than I could!

Other people have covered this as well, such as [Heydon Pickering on Collapsible Sections](https://inclusive-components.design/collapsible-sections/) and [Menus & Menu Buttons](https://inclusive-components.design/menus-menu-buttons/), which you could read as a more in-depth guide.

### A concrete alternative

Given the above, I usually recommend that people simplify, and use `aria-expanded`, with the menu that gets expanded immediately following the button in the markup. A button with `aria-expanded` will be announced as "button, menu, collapsed" and "button, menu, expanded", depending on the state.

You need to use JavaScript to toggle `aria-expanded` from `true` to `false`, and `display: none` or equivalent on the menu. (Again, a role is a promise, so having `aria-expanded`, means that it will change on press).

{% WithCodepen id="linking-headings-1", height="400" %}
{% highlight "html" %}
<button aria-expanded="false">
  Menu
</button>
<ul class="collapsed">
  <li>
    <a href="/articles">
      Articles
    </a>
  </li>
  <li>
    <a href="/about">
      About
    </a>
  </li>
</ul>
{% endhighlight %}

{% highlight "css" %}
.collapsed {
  display: none;
}
{% endhighlight %}

{% highlight "js" %}
// Of course, these could be more complex in your site
// using a specific class, a wrapper, React events or whatever you want!
const button = document.querySelector('[aria-expanded]');
const menuList = document.querySelector('ul');

if (button) {
  button.addEventListener('click', ev => {
    const expanded = button.getAttribute('aria-expanded');
    const nextState = expanded === 'true' ? 'false' : 'true';

    button.setAttribute('aria-expanded', nextState);

    if (menuList) {
      menuList.classList.toggle('collapsed');
    }
  });
}
{% endhighlight %}
{% endWithCodepen %}

If you wanted to simplify even further, you might ditch that hamburger menu altogether, and go for something horizontally scrollable. That would work even when JavaScript fails / has not loaded.

## Where to draw the line with OS, browser, screen reader software and versions supported

This was [asked by @JKallunki on Twitter](https://twitter.com/isfotis/status/1217376579896139776), when I elicited questions in the beginning of the month. I've been thinking about it since!

Part of the question hinges on what we define as support, so I'll break it down a bit.

By saying support, I mean having as a policy that:
- We test with these browser and screen reader combinations;
- We commit to fixing bugs that come up in them.

This is especially important when considering custom widgets, such as those in the [ARIA Authoring Practices, which you should be testing](https://www.w3.org/TR/wai-aria-practices-1.1/#browser_and_AT_support). It is also a kind of policy that you could have if you maintain a pattern library / design system / project guideline.

For that, the [survey on browsers and screen readers from WebAIM](https://webaim.org/projects/screenreadersurvey8/) can be a starting point.

I think part of this exercise would go hand-in-hand with [writing an accessibility statement](https://www.nomensa.com/blog/2009/writing-an-accessibility-statement/). An outline of the level of WCAG compliance you are aiming for, how people can contact you and your plans for addressing known issues, are just as important as the specific combinations of OS & screen reader that you elect to support.

### Coding to standards

I should point out something else too. A big part of accessibility is about coding to standards (aside: I cannot recall where I first heard this, let me know if you have an attribution!). For example, HTML markup, implementing and testing ARIA widgets can take you a long way.

Working around specific software bugs can have an adverse effect if in the future those bugs change. That also accumulates code, which makes it less likely to change, and so on as above :)

In other words, for OS & screen reader combinations outside of your defined list, you can be open to receiving bug reports, but might not work around specific bugs. You never know, a report might surface a bug in your implementation, which can improve the experience for other combinations too!

## Accessibility Jam

I helped start a kind of accessibility help desk at work! We called it "Accessibility Jam". The idea is to have an ad-hoc communal help desk about accessibility, where people can drop in and out as they want.

For your bookmarking needs, we have a site at [https://accessibility-jam.club](https://accessibility-jam.club).

{% MdImg
  aspectRatio="16x9",
  position="left",
  src="/img/posts/accessibility-notes-jan-2020-jam.png",
  alt="The Accessibility Jam website, complete with an illustration of a jar of jam."
%}{% endMdImg %}

I hope this gives us a regular space for people to ask questions and find out more about the topic. It also gives me a supply of things to write about!

## Wrapping Up

I hope you found this collection of notes useful!

If you have thoughts on this post, [you can reach out on Twitter](https://twitter.com/isfotis). I realise that Twitter is not the best place for nuance, so you can use [my other contact info](/about/#contact), if those offer a better medium.
