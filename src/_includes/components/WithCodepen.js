const { html, safeHtml } = require('common-tags');

module.exports = function(content, props = {}) {
  const {
    id,
    lazy = true,
    lang = 'html',
    height = '400',
    defaultTab = 'html, result',
  } = props;

  if (lazy && !id) {
    throw 'id is required for lazy-initialised pens in WithCodepen';
  }

  const embedIdentifier = `codepen-later-${id}`;

  return html`
    <div>
      <div
        class="${lazy ? embedIdentifier : 'codepen'}"
        data-prefill
        data-height="${height}"
        data-default-tab="${defaultTab}"
      >
        <pre data-lang="${lang}">${content}</pre>
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
