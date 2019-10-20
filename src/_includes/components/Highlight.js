const Prism = require('prismjs');
const PrismLoader = require('prismjs/components/index.js');

module.exports = function(content, language, highlightNumbers) {
  let highlightedContent;
  if (language === 'text') {
    highlightedContent = content.trim();
  } else {
    if (!Prism.languages[language]) {
      PrismLoader([language]);
    }

    highlightedContent = Prism.highlight(
      content.trim(),
      Prism.languages[language]
    );
  }

  let group = new HighlightLinesGroup(highlightNumbers);

  let lines = highlightedContent.split('\n').map(function(line, j) {
    return group.getLineMarkup(j, line);
  });

  return (
    `<pre class="language-${language}"><code class="language-${language}">` +
    lines.join('<br>') +
    '</code></pre>'
  );
};

class HighlightLinesGroup {
  constructor(str, delimiter) {
    this.init(str, delimiter);
  }

  init(str = '', delimiter = ' ') {
    this.str = str;
    this.delimiter = delimiter;

    let split = str.split(this.delimiter);
    this.highlights = new HighlightLines(split.length === 1 ? split[0] : '');
    this.highlightsAdd = new HighlightLines(split.length === 2 ? split[0] : '');
    this.highlightsRemove = new HighlightLines(
      split.length === 2 ? split[1] : ''
    );
  }

  isHighlighted(lineNumber) {
    return this.highlights.isHighlighted(lineNumber);
  }

  isHighlightedAdd(lineNumber) {
    return this.highlightsAdd.isHighlighted(lineNumber);
  }

  isHighlightedRemove(lineNumber) {
    return this.highlightsRemove.isHighlighted(lineNumber);
  }

  splitLineMarkup(line, before, after) {
    let startCount = line.split('<span').length;
    let endCount = line.split('</span').length;

    // skip line highlighting if there is an uneven number of <span> or </span> on the line.
    // for example, we can’t wrap <span> with <span><span></span>
    if (startCount > endCount) {
      return line;
    } else if (endCount > startCount) {
      return line;
    }

    return before + line + after;
  }

  getLineMarkup(lineNumber, line, extraClasses = []) {
    let extraClassesStr = extraClasses.length
      ? ' ' + extraClasses.join(' ')
      : '';

    if (this.isHighlighted(lineNumber)) {
      return this.splitLineMarkup(
        line,
        `<mark class="highlight-line highlight-line-active${extraClassesStr}">`,
        `</mark>`
      );
    }
    if (this.isHighlightedAdd(lineNumber)) {
      return this.splitLineMarkup(
        line,
        `<ins class="highlight-line highlight-line-add${extraClassesStr}">`,
        `</ins>`
      );
    }
    if (this.isHighlightedRemove(lineNumber)) {
      return this.splitLineMarkup(
        line,
        `<del class="highlight-line highlight-line-remove${extraClassesStr}">`,
        `</del>`
      );
    }

    return this.splitLineMarkup(
      line,
      `<span class="highlight-line${extraClassesStr}">`,
      `</span>`
    );
  }
}

class HighlightLines {
  constructor(rangeStr) {
    this.highlights = this.convertRangeToHash(rangeStr);
  }

  convertRangeToHash(rangeStr) {
    let hash = {};
    if (!rangeStr) {
      return hash;
    }

    let ranges = rangeStr.split(',').map(function(range) {
      return range.trim();
    });

    for (let range of ranges) {
      let startFinish = range.split('-');
      let start = parseInt(startFinish[0], 10);
      let end = parseInt(startFinish[1] || start, 10);

      for (let j = start, k = end; j <= k; j++) {
        hash[j] = true;
      }
    }
    return hash;
  }

  isHighlighted(lineNumber) {
    return !!this.highlights[lineNumber];
  }
}
