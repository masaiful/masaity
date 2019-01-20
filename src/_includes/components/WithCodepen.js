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
    <div class="md-replaced vs2">
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
            <button
              data-for="${embedIdentifier}"
              class="makeCpInteractive button-reset ph3 pv2 fw7 fg-secondary bg-primary focus-outline-accent-lighter hover-bg-accent transition-bg br2"
            >
              Make demo interactive
            </button>
          `
        : ''}
    </div>
  `;
};
