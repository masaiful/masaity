const path = require('path');
const prettyBytes = require('pretty-bytes');
const workboxBuild = require('workbox-build');

const SW_SRC = 'src/sw.js';
const SITE_DIR = '_site';

// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild
    .injectManifest({
      swSrc: SW_SRC,
      swDest: path.join(SITE_DIR, 'sw.js'),
      globDirectory: SITE_DIR,
      globPatterns: [
        // Main CSS file
        // (we could make this more general if we removed unhashed css)
        'css/index.*.css',
        // Index/Main JS
        'js/index.*.js',
        // CodePen embeds
        'js/codepen/ei.js',
        // We would only need to cache woff2, because browsers that support service workers also support woff2
        'fonts/**/*.woff2',
        // Also cache the subset fonts (a bit wasteful, I admit)
        'subfont/**/*.woff2',
        // Subfont outputs a fallback css, also hashed
        'subfont/**/*.css',
        // Offline page
        'offline.html',
        // 404 page
        '404.html',
      ],
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(
        `${count} files will be precached, totaling ${prettyBytes(size)}.`
      );
    })
    .catch(err => {
      console.log(`Error encountered while injecting SW: ${err}`);
    });
};

buildSW();
