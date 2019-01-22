---
title: Resilent Code Examples with Codepen
date: 2019-01-22
tags:
  - post
  - resilence
layout: layouts/post.njk
description: 'Making code examples in blog posts performant, accessible, and fun.'
hasCodepen: true
---

At some point through writing [my first post on this blog](/posts/linking-to-headings), I realised that I wanted to have code exaples.

I had taken a "write first, add the infrastructure later" approach, because I wanted to finish writing instead of going down some rabbit holes.

So I finished the writeup, and reached part where I touch up the code examples.

There were two main things I wanted to have:
- Syntax highlighting
- An easy way to write interactive demos

I also value accessibility and performance, so I had a few more requirements:
- Code samples should be available in the server-rendered markup
- The page should not load heavy scripts without user action

My "usual" approach would be to duplicate the samples on the markup and Codepen. Then, depending on how critical I find the demo, I either embed the `iframe` or link to the pen. That is, until I found Prefill Embeds...

## Prefill Embeds

A few days prior to writing my post, [Codepen announced their "Prefill Embeds" feature](https://blog.codepen.io/2019/01/17/introducing-prefill-embeds/).

In short, you write markup on your site, and "enhance" it to a full-fledged pen at runtime. I affectionately refer to those as "anonymous pens".

To give you an idea, here is what a simple setup looks like:

{% highlight "html" %}
<div 
  class="codepen" 
  data-prefill 
  data-height="400" 
  data-default-tab="html,result" 
>
  <pre data-lang="html">
    <div class="container">
      <h1>Prefill Embeds are cool</h1>
      <a href="https://fotis.xyz/posts/resilient-code-examples">
        Read about how you can use them
      </a>
    </div>
  </pre>
</div>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endhighlight %}


## Benefits

I must admit, I had no idea how much I wanted this feature, until I tried it out. 

In no particular order, here are things I the possibilities I like:
- No need to keep things in sync (an activity that distracts me, or I always forget)
- Friendly to Reader mode, Pocket
- Friendly to RSS feeds, [this site has an RSS feed](/feed/feed.xml) too, btw ;)
- Arguably more accessible than an iframe-by-default; can let the user decide
- No heavy scripts loaded

## Fun with templates
On th blog, I also have syntax highlighting, rendered once on the server, using [Prism](https://prismjs.com/). I use the [syntax highlight shortcode from Eleventy](https://github.com/11ty/11ty-plugin-syntaxhighlight) to add it to the page.

I had to make one change to the highlighting short code, to add `data-lang` to the `pre` tag that it renders. This is for CodePen to pick it up. I could have wrapped it in another `pre` tag, and that also seemed to work. But it also seemed like undefined behaviour, so I went with the more "correct-feeling" route.

Paired with the modified shortcode, here is the initial setup that I had:

{% highlight "html" %}
{% raw %}
<div 
  class="codepen" 
  data-prefill 
  data-height="400" 
  data-default-tab="html,result" 
>
  {% highlight "html" %}
  <div class="container">
    <h1>Prefill Embeds are cool</h1>
    <a href="https://fotis.xyz/posts/resilient-code-examples">
      Read about how you can use them
    </a>
  </div>
  {% endhighlight %}
</div>
{% endraw %}
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
{% endhighlight %}

(Aside: you should see the template for putting *this* post on the page. Fun times.)

I am generally a fan of copy-pasting, and I would not be averse to leaving it at that. But, I still wanted to load the iframe on demand, so I decided that I had to go deeper.

## Loading on-demand

To their credit, the [documentation for Prefill Embeds](https://blog.codepen.io/documentation/prefill-embeds/) have an outline dedicated to loading the pen on demand.

Given my earlier goals of making `iframe`s optional, and giving readers the choice, it made sense to implement that functionality.

The sketch for the shortcode/pseudo-component would look like this:
- On the server, be able to define the language for each block
- On the server, render a button that is associated with some id on the codepen
- On the client, call `window.__CPEmbed(.codepen-later-${id})`, to activate that frame.

### Templating shortcode

I dubbed the shortcode `WithCodepen`. I also added some conveniences about different properties of the embed. Here is what the templating composition looks like:

{% highlight "html" %}
{% raw %}

{% WithCodepen id="my-demo", height="400" %}
{% highlight "html" %}
  <div class="container">
    <h1>Prefill Embeds are cool</h1>
    <a href="https://fotis.xyz/posts/resilient-codepen-embeds">
      Read about how you can use them
    </a>
  </div>
{% endhighlight %}
{% endWithCodepen %}

{% endraw %}
{% endhighlight %}

There are different ways to implement this. I went with a nunjucks helper that forks out to Javascript template literals. It went well, but the extra spacing from formatters and substitutions was a pain to debug!

{% highlight "js" %}
const { html } = require('common-tags');

module.exports = function(content, props = {}) {
  const { id, lazy = true, height = '400', defaultTab = 'html,result' } = props;

  if (lazy && !id) {
    throw 'id is required for lazy-initialised pens in WithCodepen';
  }

  const embedIdentifier = `codepen-later-${id}`;

  // THIS IS IMPORTANT, stuff breaks with extra <pre> being inserted
  // due to extra white-space :))))
  // prettier-ignore
  const htmlContent = html`${content}`;

  return html`
    <div class="md-replaced vs2">
      <div
        class="${lazy ? embedIdentifier : 'codepen'}"
        data-prefill
        data-height="${height}"
        data-default-tab="${defaultTab}"
      >
        ${htmlContent}
      </div>
      ${lazy
        ? html`
            <button
              data-for="${embedIdentifier}"
              class="makeCpInteractive"
            >
              Make demo interactive
            </button>
          `
        : ''}
    </div>
  `;
};
{% endhighlight %}

You can [find the source for WithCodepen on Github](https://github.com/fpapado/fotis.xyz/src/includes/WithCodepen.js).

### Client-side interaction

The `id` for the associated pen is available under `data-for` in the button. I wrote some Javascript to handle the click events and call the embed function. It is a bit crude, and I'd circle back to it, but it works:

{% highlight "js" %}
// This is a helper for focusing things with tabindex="-1"
import { focusOnElement } from './fix-in-page-links.js';

const BUTTON_SELECTOR = '.makeCpInteractive';

/**
 * Button, that when clicked, makes the related code an interactive codepen.
 * Works by being associated via data-for
 *
 * @see src/includes/WithCodepen.js
 * @see https://blog.codepen.io/documentation/prefill-embeds/
 */
export function init() {
  let buttons = document.querySelectorAll(BUTTON_SELECTOR);

  buttons.forEach(button =>
    button.addEventListener('click', e => {
      const embedIdentifier = button.getAttribute('data-for');
      if (!embedIdentifier) {
        console.error('No embedIdentifier found as data-for');
      }

      // The API for looking for and creating embeds
      window.__CPEmbed(`.${embedIdentifier}`);

      // Focus the iframe and remove the button
      const newEmbed = button.previousElementSibling;

      // Remove the button after the focus moves to the iframe
      button.addEventListener('blur', ev => {
        button.remove();
      });

      focusOnElement(newEmbed);
    })
  );
}
{% endhighlight %}

There is a bit of an open question, on how we'd manage/move focus when clicking on the button. At the moment, I move focus to the embed, and remove the button. I think that moving the focus makes sense to signify what happened, but I'm always a bit wary of that.

A coworker also suggested adding the functionality to revert the embed. We could do this by saving the initial content, and restoring it later. I have to think more about this.

You can [find the source for MakeCpInteractive on Github](https://github.com/fpapado/fotis.xyz/src/js/MakeCpInteractive.js).

### Loading the script

The embed script seems quite small, at about 5kB gzipped.
There is a coarse-grained `hasCodePen` frontmatter option in the templates, that adds that script to the page.
Loading it on button click seems not worth the effort of latency, but you might prioritise differently if you want.

## In practice

An entire post, and no interactive examples. That doesn't seem fair.
Here is the example from above, rendered with the full shortcode, and the button to make it interactive. 

As a bonus, did I mention you can have multiple "files" in a single pen? Add more `<pre>` tags with a `data-lang` and they will be added in the respective tab.

{% WithCodepen id="resilient-code-examples", height="400" %}
{% highlight "html" %}
  <div class="container">
    <h1>Prefill Embeds are cool</h1>
    <a href="https://fotis.xyz/posts/resilient-code-examples">
      Read about how you can use them
    </a>
  </div>
{% endhighlight %}
{% highlight "css" %}
  .container {
    background-color: beige;
  }
{% endhighlight %}
{% endWithCodepen %}

## Wrapping up

This functionality really struck a note with me. From static markup, to readers, RSS feeds, and interactive demos; the content is there, the functionality is layered, the experience adapts. It reminded me why I love the web so much, with a diversity and richness of experience. The word [resilience](https://resilientwebdesign.com/) rings in my mind as I write these words down.

I recently wrote about [taking a break from coding](/posts/new-year-new-blog), seeking inspiration, and trying to write more of my thougths down. This functionality makes me feel super excited about what I can share. I hope you are too.

P.S. I might have stumbled somewhere, or forgotten something, please go easy on me and let me know :)