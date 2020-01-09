module.exports = function(content, { level = 2, className = '' } = {}) {
  const hx = 'h' + Math.min(level, 6);
  return `
    <${hx} class="mv0 f3 fw7 lh-title ${className}">
        ${content}
    </${hx}>`;
};
