import allSettled from '@ungap/promise-all-settled';

/**
 * A custom print button implementation.
 * Using this allows us to eagerly load any lazy-loaded images and wait for them to load, before printing.
 * Works around https://bugs.chromium.org/p/chromium/issues/detail?id=875403
 */
export function init() {
  const SUPPORTS_LAZY_IMAGES = 'loading' in HTMLImageElement.prototype;

  // Add a feature detect styling hook
  if (SUPPORTS_LAZY_IMAGES) {
    document.documentElement.classList.add('supports-lazy-loading');
  }

  const printButton = document.getElementsByClassName('print-button')[0];

  // We use this to know when to warn the user or not
  let userPressedCustomPrint = false;

  // TODO: Add checkbox for images
  if (printButton !== undefined) {
    // Add a guard-rail onbeforeprint, to warn the user about not-loaded images
    window.addEventListener('beforeprint', () => {
      if ('loading' in HTMLImageElement.prototype) {
        if (!userPressedCustomPrint) {
          // Create a warning for the user
          const warning = createWarningBox({
            uniqueId: 'beforeprint-warning-missing-images',
            focusAfter: printButton,
            content:
              "Some images might not show up in the print due to lazy loading. You can use the button above instead of the browser's print, to include them.",
          });
          if (warning) {
            printButton.insertAdjacentElement('afterend', warning);
          }
        }
      }
    });

    // After print (ok or dismiss), reset the "user pressed custom print" state
    window.addEventListener('afterprint', () => {
      userPressedCustomPrint = false;
    });

    // Handle clicks on the button
    printButton.addEventListener('click', () => {
      userPressedCustomPrint = true;
      loadAllLazyImages().then(results => {
        // If any of the images fail to load, then proceed but warn the user
        const hasFailedImages = results.some(
          result => result.status === 'rejected'
        );
        if (hasFailedImages) {
          const warning = createWarningBox({
            uniqueId: 'print-warning-failed-images',
            focusAfter: printButton,
            content:
              'Some images failed to load when printing. You can reload the page and try again.',
          });
          if (warning) {
            printButton.insertAdjacentElement('afterend', warning);
          }
        }
        window.print();
      });
    });
  }
}

function createWarningBox({ focusAfter, content, uniqueId }) {
  // Warning box
  if (document.getElementById(uniqueId)) {
    return null;
  }

  const warning = document.createElement('div');
  warning.id = uniqueId;
  warning.className =
    'pa3 flex justify-around items-start lh-copy bg-washed-red br2';
  warning.innerText = content;

  // Add a dismiss buttton
  const dismissButton = document.createElement('button');
  dismissButton.innerText = 'Dismiss';
  dismissButton.addEventListener('click', () => {
    focusAfter.focus();
    warning.remove();
  });

  // Add to DOM
  warning.insertAdjacentElement('beforeend', dismissButton);
  return warning;
}

/**
 * Collect all the loading=lazy images, and add their loading into a promise
 */
function loadAllLazyImages() {
  const loadingPromises = [];

  const images = document.querySelectorAll('img[loading=lazy]');

  images.forEach(img => {
    // Add to the list
    loadingPromises.push(
      // Add styling hooks, in case we want to do something further,
      // such as showing an "image skipped" warning
      getImageLoadingPromise(img)
        .then(() => {
          img.classList.add('lazy-loading-ok');
        })
        .catch(() => {
          img.classList.add('lazy-loading-error');
        })
    );
    // Tweak loading to 'auto' (remove it)
    img.setAttribute('loading', 'eager');
  });

  return allSettled(loadingPromises);
}

/**
 * Take an img and lift its load/error into a Promise
 * @param {HTMLImageElement} img
 */
function getImageLoadingPromise(img) {
  return new Promise((resolve, reject) => {
    img.addEventListener('load', resolve);
    img.addEventListener('error', reject);
  });
}
