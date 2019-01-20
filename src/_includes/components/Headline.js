/** A mega- heading */
module.exports = function(content, { level = 2, className = '' } = {}) {
  const hx = 'h' + Math.min(level, 6);
  return `
    <${hx} class="mv5 mv6-ns f-headline-ns fg-primary fw9 lh-title ${className}">
        ${content}
    </${hx}>`;
};
