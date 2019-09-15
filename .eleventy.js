const path = require('path');
const fs = require('fs');
const { DateTime } = require('luxon');
const { groupBy, flatten, drop } = require('lodash');
const sanitizeHTML = require('sanitize-html');

// Plugins
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginInclusiveLanguage = require('@11ty/eleventy-plugin-inclusive-language');
const pluginSyntaxHighlight = require('@fpapado/eleventy-plugin-syntaxhighlight');

// For transforms
const htmlmin = require('html-minifier');

// Custom tags etc.
const WithCodepen = require('./src/_includes/components/WithCodepen');
const MdImg = require('./src/_includes/components/MdImg');
const Text = require('./src/_includes/components/Text');
const Headline = require('./src/_includes/components/Headline');
const Heading = require('./src/_includes/components/Heading');
const Subheading = require('./src/_includes/components/Subheading');
const Link = require('./src/_includes/components/Link');
const IdentityLink = require('./src/_includes/components/IdentityLink');
const MarkdownBlock = require('./src/_includes/components/MarkdownBlock');

// Globals
const INPUT_DIR = 'src';
const OUTPUT_DIR = '_site';
const HASH_MANIFEST_FILENAME = '_intermediate/hash-manifest.json';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = function(eleventyConfig) {
  //
  // PLUGINS
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    templateFormats: ['njk', 'md'],
  });
  eleventyConfig.setDataDeepMerge(true),
    eleventyConfig.addPlugin(pluginInclusiveLanguage);

  //
  // LAYOUTS
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  //
  // FILTERS

  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLLL yyyy'
    );
  });

  eleventyConfig.addFilter('dateFromTimestamp', timestamp => {
    return DateTime.fromISO(timestamp, { zone: 'utc' }).toJSDate();
  });

  eleventyConfig.addFilter('dateToIso', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISO();
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Get the nth element of a collection.
  eleventyConfig.addFilter('at', (array, n) => {
    return array[n];
  });

  // Skip/drop n elements from a list and return the rest.
  eleventyConfig.addFilter('drop', (array, n) => {
    return drop(array, n);
  });

  // Flatten a list one level.
  eleventyConfig.addFilter('flatten', array => {
    return flatten(array);
  });

  // Log the argument and return unchanged.
  eleventyConfig.addFilter('log', value => {
    console.log(value);
    return value;
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat('yyyy-LL-dd');
  });

  // Filter that resolves a hash from a known table
  // @see join-manifests for more information on how the manifest is formed
  eleventyConfig.addFilter('resolveHash', function(filename) {
    // Presumably, dev has no hashes, so do not attempt to resolve
    if (!isProduction) {
      return filename;
    }

    // A file at a known location that maps filenames to hashed filenames
    const hashManifest = JSON.parse(
      fs.readFileSync(path.resolve(HASH_MANIFEST_FILENAME))
    );

    const hashedFilename = hashManifest[filename];
    if (!hashedFilename) {
      throw Error(
        `File with basename: ${basename} not found in hash manifest. Perhaps one of the tools built out of order? Check the manifests under the intermediate/ folder.`
      );
    }

    return hashedFilename;
  });

  // Filter that gets webmentions for a url
  // Note that the data is fetched upfront from `_data/webmentions.js`
  // This is filtering and sanitizing things for display
  eleventyConfig.addFilter('webmentionsForUrl', (webmentions, url) => {
    // TODO: Write the enum of the possible types
    const allowedTypes = ['mention-of', 'in-reply-to'];
    const allowedHTML = {
      allowedTags: ['b', 'i', 'em', 'strong', 'a'],
      allowedAttributes: {
        a: ['href'],
      },
    };

    const clean = entry => {
      const { content } = entry;
      if (content && content['html']) {
        content.value = sanitizeHTML(content.html, allowedHTML);
      } else if (content && content['text']) {
        content.value = content.text;
      }
      return entry;
    };

    return webmentions
      .filter(entry => entry['wm-target'] === url)
      .filter(entry => allowedTypes.includes(entry['wm-property']))
      .filter(entry => !!entry.content)
      .map(clean);
  });

  eleventyConfig.addFilter('webmentionCountByType', function(
    webmentions,
    url,
    ...types
  ) {
    // mention-of, in-reply-to, like-of, share-of, repost-of
    const countString = String(
      webmentions
        .filter(entry => entry['wm-target'] === url)
        .filter(entry => types.includes(entry['wm-property'])).length
    );
    return countString;
  });

  //
  // COLLECTIONS

  // eleventyConfig.addCollection('my-collection', function(collection) {
  //   return collection;
  // });

  // Group posts by date
  // NOTE: You have to inspect the date in the children atm;
  // returning an object {[date]: items} does not work yet.
  eleventyConfig.addCollection('postsByDate', function(collection) {
    const postsGlob = path.join(INPUT_DIR, 'posts/*');
    const sorted = collection.getFilteredByGlob(postsGlob).sort(function(a, b) {
      return a.date - b.date;
    });
    const grouped = groupBy(sorted, item =>
      DateTime.fromJSDate(item.date).startOf('day')
    );
    console.log({ grouped });

    return Object.values(grouped);
  });

  eleventyConfig.addCollection('tagList', require('./_11ty/getTagList'));

  // Copy these directories and files directly
  eleventyConfig.addPassthroughCopy('src/img');
  eleventyConfig.addPassthroughCopy('src/js/workbox');
  eleventyConfig.addPassthroughCopy('src/js/codepen');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/manifest.json');

  /* Markdown Plugins */
  let markdownIt = require('markdown-it');
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  //let markdownItAnchor = require('markdown-it-anchor');
  /* let anchorOpts = {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#',
  };
  */

  eleventyConfig.setLibrary('md', markdownIt(options));

  //
  // SHORTCODES
  eleventyConfig.addPairedShortcode('WithCodepen', WithCodepen);
  eleventyConfig.addPairedShortcode('MdImg', MdImg);
  eleventyConfig.addPairedShortcode('Text', Text);
  eleventyConfig.addPairedShortcode('Headline', Headline);
  eleventyConfig.addPairedShortcode('Heading', Heading);
  eleventyConfig.addPairedShortcode('Subheading', Subheading);
  eleventyConfig.addPairedShortcode('MarkdownBlock', MarkdownBlock);
  eleventyConfig.addPairedShortcode('Link', Link);
  eleventyConfig.addPairedShortcode('IdentityLink', IdentityLink);

  //
  // TRANSFORMS

  // Minify HTML output
  // Good for normalising whitespace from templates
  // The effect on output size is minimal
  // @seehttps://www.11ty.io/docs/config/#transforms-example%3A-minify-html-output
  eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
    if (isProduction && outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  return {
    templateFormats: ['md', 'njk', 'html', 'liquid'],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: '/',

    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true,
    dir: {
      input: INPUT_DIR,
      output: OUTPUT_DIR,
      // NOTE: These two paths are relative to dir.input
      // @see https://github.com/11ty/eleventy/issues/232
      includes: '_includes',
      data: '_data',
    },
  };
};
