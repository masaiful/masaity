// Fix focus for in-page navigation by assigning and unassigning
// tabindex="-1" before/after focus.
// @see https://github.com/selfthinker/dokuwiki_template_writr/blob/master/js/skip-link-focus-fix.js
// @see https://axesslab.com/skip-links/
export function init() {
  document.addEventListener('DOMContentLoaded', ev => {
    // Detect anchor '#id' links
    if (document.location.hash) {
      let focusId = window.location.hash.replace(/^#/, '');
      const focusEl = document.getElementById(focusId);
      // console.log('Found location hash, will focus', { focusId, focusEl });
      focusOnElement(focusEl);
    }

    // On hash link changes
    window.addEventListener('hashchange', ev => {
      let focusId = window.location.hash.replace(/^#/, '');
      const focusEl = document.getElementById(focusId);
      // console.log('hashchange', { focusId, focusEl });
      focusOnElement(focusEl);
    });
  });
}

/**
 * Return true if the element is focusable
 * @param {HTMLElement} el
 */
function isFocusable(el) {
  return el.matches('a[href], area[href], object, [tabindex]');
}

/**
 * Focus the element if it is focusable
 * @param {HTMLElement} el
 */
export function focusOnElement(el) {
  if (!el) {
    return;
  }
  // If the element is not focusable by default, add tabindex="-1", then remove it
  if (!isFocusable(el)) {
    el.setAttribute('tabindex', '-1');
    // TODO: Consider 'focusout' as well
    el.addEventListener('blur', ev => {
      el.removeAttribute('tabindex');
    });
  }
  el.focus();
}
