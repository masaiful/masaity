module.exports = function(
  content,
  { href, isExternal = false, className = '' } = {}
) {
  const externalAttrs = isExternal
    ? `rel="noopener noreferrer" target="_blank"`
    : '';

  return `
    <a href="${href}" class="fg-accent-lighter hover-fg-accent-2 transition-fg focus-tdn enhanced-outline ${className}" ${externalAttrs}>
        ${content}
    </a>`;
};
