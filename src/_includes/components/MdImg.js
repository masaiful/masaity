/** An image meant to be used in markdown, that preserves aspect ratio */
module.exports = function(content, { src, alt, aspectRatio } = {}) {
  // TODO: Consider .fit-cover
  return `
<div class="md-img aspect-ratio aspect-ratio--${aspectRatio} bg-light-gray">
  <img src="${src}" alt="${alt}" class="aspect-ratio--object" />
</div>`;
};
