const { html } = require('common-tags');

module.exports = function(content, { className = '' } = {}) {
  return html`
    <p class="mv0 f4 f3-m lh-copy ${className}">
      ${content}
    </p>
  `;
};
