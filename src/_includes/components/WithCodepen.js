const { html } = require('common-tags');

module.exports = function(content, props = {}) {
  const {
    id,
    lazy = true,
    height = '400',
    defaultTab = 'html, result',
  } = props;

  if (lazy && !id) {
    throw 'id is required for lazy-initialised pens in WithCodepen';
  }

  const embedIdentifier = `codepen-later-${id}`;

  // THIS IS IMPORTANT, stuff breaks with extra <pre> being inserted
  // due to extra white-space :))))
  // prettier-ignore
  const htmlContent = html`${content}`;

  return html`
    <div>
      <div
        class="${lazy ? embedIdentifier : 'codepen'}"
        data-prefill
        data-height="${height}"
        data-default-tab="${defaultTab}"
      >
        ${htmlContent}
      </div>
      ${lazy
        ? html`
            <div>
              <button data-for="${embedIdentifier}" class="makeCpInteractive">
                Make interactive
              </button>
            </div>
          `
        : ''}
    </div>
  `;
};
