// Visual button states
const BUTTON_INACTIVE_CLS = 'o-50';
const BUTTON_ACTIVE_UNPRESSED_CLS = 'bg-accent-lighter';
const BUTTON_ACTIVE_PRESSED_CLS = 'bg-accent-2';

// Config key
const CONFIG_KEY = 'site-animations';

/**
 * Button pseudo-component that will attach an onClick to a button,
 * and the `.animate-me` class to the specified targets.
 *
 * See the .logo-animation class for ways to use this.
 */
export function init(element, targets, animateMeCls) {
  // Nothing to do without an element
  if (!element || !element instanceof HTMLElement) {
    return;
  }

  // Event listener
  const handleOnClick = () => {
    // Communicate the toggled state to assisstive technologies
    // Check to see if the button is pressed
    const isPressed = element.getAttribute('aria-pressed') === 'true';
    const nextStateOn = !isPressed;

    // Set the animation state for the eleement
    setAnimationState(nextStateOn);

    // Store the config
    localStorage.setItem(CONFIG_KEY, nextStateOn);
  };

  const setAnimationState = nextStateOn => {
    // Change aria-pressed to the opposite state
    element.setAttribute('aria-pressed', nextStateOn);

    // Communicate the toggled state visually
    element.classList.toggle(BUTTON_ACTIVE_UNPRESSED_CLS);
    element.classList.toggle(BUTTON_ACTIVE_PRESSED_CLS);

    // Change visual state to the opposite state
    const stateLabel = element.getElementsByClassName(
      'animate-me-button-state'
    )[0];
    if (stateLabel) {
      stateLabel.textContent = nextStateOn ? 'On!' : 'Off';
    }

    // Set the animateMe class to each animatable element
    targets.forEach(target => {
      // Use explicit version to prevent invalid toggle/untoggle
      // state where something is already animating
      if (nextStateOn) {
        target.classList.add(animateMeCls);
      } else {
        target.classList.remove(animateMeCls);
      }
    });
  };

  // Check for setting in localstorage
  const animationConfig = localStorage.getItem(CONFIG_KEY);
  if (animationConfig && animationConfig === 'true') {
    setAnimationState(animationConfig);
  }

  // Add event listener
  element.addEventListener('click', handleOnClick);

  // Enable the button now that we are set up
  element.toggleAttribute('disabled');
  element.classList.toggle(BUTTON_INACTIVE_CLS);
}
