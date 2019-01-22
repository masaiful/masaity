/**
 * Make `pre` tags accessible in the tab order,
 * if they overflow, so that users can scroll.
 *
 * Only measures once, on load, but this should be fine given
 * that users do not resize as much, and performance
 * would be iffy otherwise
 *
 * Based on:
 * https://github.com/ThePacielloGroup/cupper/blob/a0f8aa23bae666325d0dfdc209b3b5c49417c43e/docs/js/dom-scripts.js#L84
 */
export function init() {
  const preEls = document.querySelectorAll('pre');
  if (!!preEls) {
    preEls.forEach(el => {
      const hasCode = el.querySelector('code');

      if (hasCode) {
        // pre tags typically have the region and aria-label
        // from our rendered markup. But let's be resilient
        // and add them if they do not exist.
        if (!el.hasAttribute('role')) {
          el.setAttribute('role', 'region');
          el.setAttribute('aria-label', 'code sample');
        }

        // Put into tab order if overflowing
        if (el.scrollWidth > el.clientWidth) {
          el.setAttribute('tabindex', 0);
          el.classList.add('enhanced-outline-fit');
        }
      }
    });
  }
}
