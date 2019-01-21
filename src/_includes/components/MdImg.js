/** An image meant to be used in markdown, that preserves aspect ratio */
module.exports = function(content, props = {}) {
  const { src, alt, aspectRatio, position } = props;

  const positionCls = position ? `o-pos-${position}` : '';

  return `
<div class="md-img aspect-ratio aspect-ratio--${aspectRatio} bg-light-gray">
  <img src="${src}" alt="${alt}" class="aspect-ratio--object fit-cover ${positionCls}" />
</div>`;
};
