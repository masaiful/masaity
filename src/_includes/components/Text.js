module.exports = function(content, { className = '' } = {}) {
  return `
    <p class="mv0 f5 f4-m f3-l lh-copy ${className}">
        ${content}
    </p>`;
};
