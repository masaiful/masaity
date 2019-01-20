module.exports = function(content, { className = '' } = {}) {
  return `
    <div class="article f4 nested-copy-line-height nested-headline-line-height nested-copy-separator nested-img measure-prose ${className}">
        ${content}
    </div>`;
};
