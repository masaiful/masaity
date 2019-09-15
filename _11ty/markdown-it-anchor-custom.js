const slugify = s =>
  encodeURIComponent(
    String(s)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
  );

const position = {
  false: 'push',
  true: 'unshift',
};

const hasProp = Object.prototype.hasOwnProperty;

const permalinkHref = slug => `#${slug}`;

// const renderPermalink = (slug, opts, state, idx) => {
//   const space = () =>
//     Object.assign(new state.Token('text', '', 0), { content: ' ' });

//   const linkTokens = [
//     Object.assign(new state.Token('link_open', 'a', 1), {
//       attrs: [
//         ['class', opts.permalinkClass],
//         ['href', opts.permalinkHref(slug, state)],
//         ['aria-hidden', 'true'],
//       ],
//     }),
//     Object.assign(new state.Token('html_block', '', 0), {
//       content: opts.permalinkSymbol,
//     }),
//     new state.Token('link_close', 'a', -1),
//   ];

//   // `push` or `unshift` according to position option.
//   // Space is at the opposite side.
//   if (opts.permalinkSpace) {
//     linkTokens[position[!opts.permalinkBefore]](space());
//   }
//   state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens);
// };

const renderPermalink = (slug, opts, state, index) => {
  // Get the text content of the heading
  const textContent = state.tokens[index + 1].children
    .filter(token => token.type === 'text' || token.type === 'code_inline')
    .reduce((acc, t) => acc + t.content, '');

  const linkTokens = [
    {
      ...new state.Token('link_open', 'a', 1),
      attrs: [
        ['class', opts.permalinkClass],
        ['href', opts.permalinkHref(slug, state)],
        // NOTE: We expose the content of the title as the accessible label
        ['aria-label', `Link to ${textContent}`],
      ],
    },
    {
      ...new state.Token('html_block', '', 0),
      content: opts.permalinkSymbol,
    },
    new state.Token('link_close', 'a', -1),
  ];

  /**
   * Structure transform:
   *  <h2>Stuff</h2>
   * To:
   *  <div class="...">
   *    <h2>Stuff</h2>
   *    <a></a>
   *  </div>
   */
  const newTokens = [
    // Tokens until the start of the heading
    ...state.tokens.slice(0, index),
    // New wrapper div open
    {
      ...new state.Token('div_open', 'div', 1),
      attrs: [['class', 'heading-with-anchor']],
    },
    // The original heading (start, content, end)
    ...state.tokens.slice(index, index + 3),
    // The link tokens
    ...linkTokens,
    // Div close
    new state.Token('div_close', 'div', -1),
    // The orginal tokens after the heading
    ...state.tokens.slice(index + 3, state.tokens.length),
  ];

  // Assign the new tokens
  state.tokens = newTokens;
};

const uniqueSlug = (slug, slugs) => {
  let uniq = slug;
  let i = 2;
  while (hasProp.call(slugs, uniq)) uniq = `${slug}-${i++}`;
  slugs[uniq] = true;
  return uniq;
};

const isLevelSelectedNumber = selection => level => level >= selection;
const isLevelSelectedArray = selection => level => selection.includes(level);

const anchor = (md, opts) => {
  opts = Object.assign({}, anchor.defaults, opts);

  md.core.ruler.push('anchor', state => {
    const slugs = {};
    const tokens = state.tokens;

    const isLevelSelected = Array.isArray(opts.level)
      ? isLevelSelectedArray(opts.level)
      : isLevelSelectedNumber(opts.level);

    // The renders mutate the state tokens, so we must shift the index forward!
    // This is because the local "tokens" is a snapshot of the positions in time.
    // NOTE: This is a bit silly. A better version would be to create the
    // new tokens in one step, and replace in another (like a mark and sweep)
    const TOKENS_PER_INVOCATION = 5;
    let invocationCount = 0;

    tokens
      .filter(token => token.type === 'heading_open')
      .filter(token => isLevelSelected(Number(token.tag.substr(1))))
      .forEach(token => {
        // Aggregate the next token children text.
        const title = tokens[tokens.indexOf(token) + 1].children
          .filter(
            token => token.type === 'text' || token.type === 'code_inline'
          )
          .reduce((acc, t) => acc + t.content, '');

        let slug = token.attrGet('id');

        if (slug == null) {
          slug = uniqueSlug(opts.slugify(title), slugs);
          token.attrPush(['id', slug]);
        }

        if (opts.permalink) {
          opts.renderPermalink(
            slug,
            opts,
            state,
            // The index adjusted by the invocation count
            tokens.indexOf(token) + TOKENS_PER_INVOCATION * invocationCount
          );
          invocationCount++;
        }

        if (opts.callback) {
          opts.callback(token, { slug, title });
        }
      });
  });
};

anchor.defaults = {
  level: 1,
  slugify,
  permalink: false,
  renderPermalink,
  permalinkClass: 'header-anchor',
  permalinkSpace: true,
  permalinkSymbol: '¶',
  permalinkBefore: false,
  permalinkHref,
};

module.exports = anchor;
