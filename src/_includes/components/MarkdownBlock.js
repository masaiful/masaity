module.exports = function(content, { className = '' } = {}) {
  return `
    <div class="article nested-img ${className}">
        ${content}
    </div>`;
};
