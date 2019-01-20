# TODO

- Clean up CSS source

  - Only use required Tachyons modules
  - Add fallback for browsers without CSS custom properties

- Handle Youtube thumbnailerorrs

- Document build pipeline:

  - Assets: JS, Rollup
  - Assets: CSS, PostCSS
  - Heavy lifting / first pass: Eleventy for data manipulation, and templating
  - Post processing / optimisations / second pass: html -> html: metalsmith pipeline
    - Critical CSS inlining

- Document environment variables

- Add test pipeline for accessibility
- Add prettier and pre-commit hooks
- Add predefined header/subheader, text and spacer components
- Consider 11ty transforms instead of the metalsmith one https://www.11ty.io/docs/config/#transforms

- For the YoutubeVideo component, show some progress when the button is pressed

  - Similarly, try out how to best communicate that to AT

- SW navigationPreload

- The logo SVG is large at 7kB gzipped. Perhaps we can save more there? The old one was 3kB or so.
