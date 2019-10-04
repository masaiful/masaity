/**
 * A custom print button implementation.
 * Using this allows us to eagerly load any lazy-loaded images and wait for them to load, before printing.
 * Works around https://bugs.chromium.org/p/chromium/issues/detail?id=875403
 */
export function init() {
  const printButtons = document.getElementsByClassName('print-button');

  // TODO: Set print styles to show "image loaded lazily, please use..."
  // TODO: Similarly, onbeforeprint, set a no-print warning box explaining about the images
  // TODO: Set button styles to hidden in print
  if (printButtons !== []) {
    for (const printButton of printButtons) {
      printButton.addEventListener('click', () => {
        loadAllLazyImages().then(() => {
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

  // TODO: Consider .allSettled instead of .all
  return Promise.all(loadingPromises);
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
