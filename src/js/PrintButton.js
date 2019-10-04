/**
 * A custom print button implementation.
 * Using this allows us to eagerly load any lazy-loaded images and wait for them to load, before printing.
 * Works around https://bugs.chromium.org/p/chromium/issues/detail?id=875403
 */
export function init() {
  const printButtons = document.getElementsByClassName('print-button');

  // TODO: Set print styles to show "image loaded lazily, please use..."
  // TODO: Similarly, onbeforeprint, set a no-print warning box explaining about the images, if the browser supports loading=lazy
  // TODO: Add checkbox for images
  // TODO: Show alt text in print for loading=lazy
  if (printButtons !== []) {
    for (const printButton of printButtons) {
      printButton.addEventListener('click', () => {
        loadAllLazyImages().then(results => {
          // If any of the images fail to load, then proceed but warn the user
          const hasFailedImages = results.some(
            result => result.status === 'rejected'
          );
          if (hasFailedImages) {
            const warning = document.createElement('div');
            warning.className = 'lh-copy pa3 bg-washed-red br2';
            warning.innerText =
              'Some images failed to load when printing. You can reload the page and try again.';
            printButton.insertAdjacentElement('afterend', warning);
          }
          window.print();
        });
      });
    }
  }
}

/**
 * Collect all the loading=lazy images, and add their loading into a promise
 */
function loadAllLazyImages() {
  const loadingPromises = [];

  const images = document.querySelectorAll('[loading=lazy]');

  images.forEach(img => {
    // Add to the list
    loadingPromises.push(getImageLoadingPromise(img));
    // Tweak loading to 'auto' (remove it)
    img.setAttribute('loading', 'eager');
  });

  return Promise.allSettled(loadingPromises);
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
