const { html } = require('common-tags');

module.exports = function(content, { level = 2, className = '' } = {}) {
  const hx = 'h' + Math.min(level, 6);
  return html`
    <${hx} class="mv0 f2 f1-ns f2-p fw7 lh-title ${className}">
        ${content}
    </${hx}>`;
};
