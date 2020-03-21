/*
 * This file is responsible for postprocessing the html + assets output after Eleventy.
 * Metalsmith is used because it can carry files through a pipeline, and it normalises the directory/file search.
 *
 * Here's what we do at the moment:
 *  - Read all the files from _site
 *  - Postprocess *.html and the linked index.css such that the css selectors and rules used are inlined. This helps the first page load significantly. Then, ake the css script async via link rel="preload" and use LoadCSS as a fallback.
 *
 * In the future, we might:
 *  - Hash and rewrite references to css and js files, for long-term caching
 *  - Minify HTML
 */

const fs = require('fs');
const path = require('path');
const subfont = require('subfont');
const metalsmith = require('metalsmith');
const { default: criticalCss } = require('metalsmith-inline-critical-css');

// TODO: Could take this from CLI args
const INPUT_DIR = '_site/';
const OUTPUT_DIR = '_site/';

// CSS filename as it is referenced before hashing
const UNHASHED_CSS_FILENAME = '/css/index.css';
const HASH_MANIFEST_PATH = '_intermediate/hash-manifest.json';

async function main() {
  // "Subfont" fonts used by the site
  // In other words, only keep the glyphs that are used from the font
  // across the site, create new files for them, and include them
  // in @font-face declarations. Falls back to the full font file, via
  // how the `font-family` CSS property works
  // We use the `subfont` package for this
  await subfont(
    {
      inputFiles: [path.resolve(INPUT_DIR, 'index.html')],
      root: INPUT_DIR,
      // Rewrite files as they are on disk
      inPlace: true,
      // Inline the CSS for the @font-face declarations
      inlineCss: true,
      // Subset for all the files, crawling from the inputs
      // In the past, we had an issue with links for link[rel="feed alternate"] and href="/potss/",
      // where Assetgraph would throw, unable to find the page. I am not sure why that happened,
      // but if you come here debugging, that might be it!
      // (More info about that bug; might be redundant)
      // Turns out it could not resolve href="/posts/" for the link rel.
      // I am not sure why. My theory is that it has different heuristics
      // for directories (directory/index.html) in link[rel] as opposed to
      // [href] relations. It was thus looking for _site/posts/ and could
      // not find it! I fixed it by making the path absolute, which seems
      // like a better approach anyway.
      recursive: true,
    },
    console
  );

  // Read the hash manifest to resolve CSS and JS file names
  const hashManifest = JSON.parse(
    fs.readFileSync(path.resolve(HASH_MANIFEST_PATH))
  );

  const hashedCssFilename = hashManifest[UNHASHED_CSS_FILENAME];
  if (!hashedCssFilename) {
    console.log(
      'Could not resolve hashed CSS name. Are you running in production? Did the build run out of order?'
    );
  }

  // Run metalsmith pipeline to inline critical CSS
  metalsmith(process.cwd())
    .source(INPUT_DIR) // source directory
    .destination(OUTPUT_DIR) // destination directory
    .clean(false) // clean destination before
    .use(
      criticalCss({
        pattern: '**/*.html',
        // The CSS file whose selectors will be matched against the html
        cssFile: path.join(INPUT_DIR, hashedCssFilename),
        // The path under which the css is included in the template
        cssPublicPath: hashedCssFilename,
      })
    )
    .build(function(err) {
      if (err) {
        console.log('Error running the postprocessing pipeline: ' + err);
        throw err;
      }
      console.log('Done!');
    });
}

main();
