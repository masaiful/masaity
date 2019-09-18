const { html } = require('common-tags');

/** An image meant to be used in markdown, that preserves aspect ratio */
module.exports = function(content, props = {}) {
  const { title, headingLevel } = props;

  if (!headingLevel || !title) {
    throw new Error('You must provide a headingLevel and title for asides.');
  }

  if (headingLevel < 2 || headingLevel > 6) {
    throw new Error('headingLevel must be between 2 and 6');
  }

  return html`
    <aside class="aside">
      <div class="aside-wrapper">
        <h${headingLevel} class="aside__title">${title}</h${headingLevel}>
        <div class="aside__content">${content}</div>
      </div>
    </aside>
  `;
};
