// Uncomment this for debugging
export function focus() {
  function focusHandler(event) {
    var target = event.target;
    console.log('Focus target', target);
  }
  document.body.addEventListener('focus', focusHandler, true);
}
