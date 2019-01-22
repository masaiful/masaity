# TODO

## Near
- Audit SkipLink
- `--intrinsicsize` placeholder
    - and a fallback :)

## Future
- Add test pipeline/CI for accessibility
- Add test pipeline/CI for performance

- Clean up CSS source:
  - Only use required Tachyons modules
  - Add fallback for browsers without CSS custom properties

- Fetch the codepen script dynamically

- Document build pipeline:
  - Assets: JS, Rollup
  - Assets: CSS, PostCSS
  - Heavy lifting / first pass: Eleventy for data manipulation, and templating
  - Post processing / optimisations / second pass: html -> html: metalsmith pipeline
    - Critical CSS inlining

- Document environment variables
- Add prettier and pre-commit hooks
- Add prose checker
- Consider 11ty transforms instead of the metalsmith one https://www.11ty.io/docs/config/#transforms
