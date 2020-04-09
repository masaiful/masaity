const { html } = require('common-tags');

/** An image meant to be used in markdown, that preserves aspect ratio, and makes loading lazy */
module.exports = function(content, props = {}) {
  const {
    src,
    alt,
    aspectRatio,
    position,
    className,
    borderRadius,
    width,
    height,
    containerClassName,
  } = props;

  if (alt === null || alt === undefined) {
    throw Error(`Image ${src} must have alt text.`);
  }

  const positionCls = position ? `o-pos-${position}` : '';
  const brCls = borderRadius ? `br-${borderRadius}` : '';

  return html`
    <div
      class="md-img aspect-ratio aspect-ratio--${aspectRatio} bg-light-gray ${brCls} ${cleanCls(
        containerClassName
      )}"
    >
      <img
        src="${src}"
        alt="${alt}"
        ${width !== undefined ? `width="${width}"` : ""}
        ${height !== undefined ? `width="${height}"` : ""}
        loading="lazy"
        class="aspect-ratio--object fit-cover ${positionCls} ${brCls} ${cleanCls(
          className
        )}"
      />
    </div>
  `;
};

function cleanCls(cls) {
  return cls ? cls : '';
}
