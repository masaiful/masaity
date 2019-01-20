# TODO

## Near

- Style code blocks
- Syntax highlighting
- Hyphens and word-break, where supported

## Future

- Clean up CSS source

  - Only use required Tachyons modules
  - Add fallback for browsers without CSS custom properties

- Document build pipeline:

  - Assets: JS, Rollup
  - Assets: CSS, PostCSS
  - Heavy lifting / first pass: Eleventy for data manipulation, and templating
  - Post processing / optimisations / second pass: html -> html: metalsmith pipeline
    - Critical CSS inlining

- Document environment variables

- Add test pipeline for accessibility
- Add prettier and pre-commit hooks
- Add prose checker
- Consider 11ty transforms instead of the metalsmith one https://www.11ty.io/docs/config/#transforms
- Add Lighthouse CI
- Audit SkipLink
