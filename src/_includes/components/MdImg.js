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
    containerClassName,
  } = props;

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
