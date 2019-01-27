/**
 * Like link, but for links that handle identification,
 * such as Github and Twitter.
 * Sets rel="me"
 */
module.exports = function(content, { href = false, className = '' } = {}) {
  return `
    <a href="${href}" class="fg-accent-lighter hover-fg-accent-2 transition-fg focus-tdn enhanced-outline ${className}" rel="me">
        ${content}
    </a>`;
};
