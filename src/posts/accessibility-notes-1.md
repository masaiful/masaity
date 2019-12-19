---
title: Accessibility Notes, Part 1
date: 2019-12-19
tags:
  - accessibility
  - a11y
description: 'A collection of notes on accessibility topics at work.'
---

At work, I spend much of my time consulting about accessibility. This is done largely internally, taking the form of threads on Slack, direct messages, in-person over tea, or long PR descriptions. Calling those pieces of writing ad-hoc blog posts might be more apt.

Some of that writing ends up being shared around. However, I find that I end up writing a lot of the same things, with little point of reference, which makes it easy to miss things!

From a personal perspective, I often end up feeling drained and tired, with little to show for my effort. Given long develoment cycles and diverse projects, this has worn me down over the past year!

So, as I start my holidays, I have decided to start writing my notes down on this blog. They might be incomplete or missing specific cases, and the same topic might come up in different note collections. I hope that will give me a better overview of topics that come up. I hope they help you build an intuition for accessibility issues, and give you references to dive in!

## Automated Checking Tools

I really like [Accessibility Insights, by Microsoft](https://accessibilityinsights.io/). They have an automatic mode, that scans a page and outlines common issues.

Perhaps more interesting, they also have a manual mode, that gives you a checklist to go through. It can also visualise things like Heading Order and so on.I think the manual mode is a great way to build an intuition about accessibility!

## On Testing with Screen Readers

Testing with a screen reader can be good in a few cases.

Two common ones for me:

- Building an intuition about the interfaces work
- Testing custom widgets and interactions, particularly whether a widget upholds its role / promise to the user.

I personally do not recommend using a Screen Reader as a primary means of evaluating a website. It is usually better to get Screen Reader / Assistive Technology users to do that instead. I believe that to be a better use of your time, and brings up scenarios you might easily miss!

### How a Screen Reader User Accesses the Web

I love this [presentation by Léonie Watson, on how she browses the web](https://www.smashingmagazine.com/2019/02/accessibility-webinar/).

Before we go imagining how people might use our interface, we should know how they concretely do so at the moment!

### Using a Screen Reader Yourself

Macs have the VoiceOver Screen Reader shipped by default. [WebAim has a guide about using VoiceOver to evaluate accessibility](https://webaim.org/articles/voiceover/). They have a lot of good references there! I believe other platforms are more popular for users, such as [NVDA on Windows](https://webaim.org/articles/nvda/)

## Alt text

### Editorial

It might be worth including a guide to alt text in editorial inputs.Here are two I like:

- https://axesslab.com/alt-texts/
- https://webaim.org/techniques/alttext/

Alt text is not for SEO! Do not include random keywords there. Also, you do not need to write "image of...". Assistive Technologies know to announce them as images already :)

### Note on alt for developers

An image that has a description is marked up as `<img alt="Description of things here" src="..."/>`. If an image does not have a description, it should have `alt=""`, such as `<img alt="" src="..." />`.This is different from not having an `alt` at all! Not having an `alt` at all will announce the full filename, and is very confusing for users.

## Custom Widgets

Browser built-in widgets tend to work well with Assistive Technologies.
Examples include `form`, `input` with `label`, `select`, and of course `button`.In cases where a custom widget is required (and "required" is often a point of contention!), the [ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices/) has documentation on implementing one. Note that the Authoring Practices is _not_ a specification, and developers should still test and make sure their solutions work.

### On Modal / Dialog Elements

Scott O'Hara, an accessibility expert, has written a bunch about modals:

- [The current state of Modal Dialog Accessibility](https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/)
- [Having an open dialog](https://www.scottohara.me/blog/2019/03/05/open-dialog.html)[The ARIA Authoring Practices on Modals](https://www.w3.org/TR/wai-aria-practices/#dialog_modal)

The usual motto of "you might not need this" applies here :)

### On Custom Select Inputs

Custom Selects are used often for styling purposes.

I should note that the default `select` is styleable, and there are documented ways of doing it. [Styling a Select Like it's 2019, by Scott Jehl](https://www.filamentgroup.com/lab/select-css.html) is a very in-depth article about that. I realise that it might be a lot of CSS, but is it really much compared to a custom JavaScript implementation?

Anyway, for custom widgets, selects are often classified as a listbox, or a combobox. I defer fully to [Sarah Higley](https://twitter.com/codingchaos)'s fantastic series on selects:

- [`<select>` your poison](https://www.24a11y.com/2019/select-your-poison/)
- [`<select>` your poison part 2: test all the things](https://www.24a11y.com/2019/select-your-poison-part-2/)

## On Datepickers

Datepickers are tricky in a few ways:

- Working with different input modes (keyboard, dictation, mouse, touch)
- Working across screens
- One size does not fit all websites! A flight booking might be different from a birthday, might be different from a hotel stay etc.
- Ensuring things stay accessible in the future. That last part is where I see a lot of trouble.

Perhaps the most resilient way to have a Datepicker, is to always have a text field that can be used instead. This fits the [Robustness principle of Accessibility](https://webaim.org/articles/pour/robust) very well, and ensures people can at least get through the flow, even if they later encounter an error.

In terms of references for Datepickers, I have a few links:

- [Making a Better Calendar](https://www.24a11y.com/2018/a-new-day-making-a-better-calendar/)
- [Maybe You Don’t Need a Date Picker](https://adrianroselli.com/2019/07/maybe-you-dont-need-a-date-picker.html)
- [Gov.uk Discussion on Date picker](https://github.com/alphagov/govuk-design-system-backlog/issues/17)

## Wrapping Up

I hope you found this collection of notes useful!

If you have thoughts on this post, [you can reach out on Twitter](https://twitter.com/isfotis). I realise that Twitter is not the best place for nuance, so you can use [my other contact info](/about/#contact), if those offer a better medium.
