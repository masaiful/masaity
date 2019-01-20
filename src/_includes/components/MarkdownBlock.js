module.exports = function(content, { className = '' } = {}) {
  return `
    <div class="article nested-img measure-prose ${className}">
        ${content}
    </div>`;
};
