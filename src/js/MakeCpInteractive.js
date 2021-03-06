import { focusOnElement } from './fix-in-page-links.js';

const BUTTON_SELECTOR = '.makeCpInteractive';

/**
 * Button, that when clicked, makes the related code an interactive codepen.
 * Works by being associated via data-for
 *
 * @see src/includes/WithCodepen.js
 * @see https://blog.codepen.io/documentation/prefill-embeds/
 */
export function init() {
  let buttons = document.querySelectorAll(BUTTON_SELECTOR);

  buttons.forEach(button =>
    button.addEventListener('click', e => {
      const embedIdentifier = button.getAttribute('data-for');
      if (!embedIdentifier) {
        console.error('No embedIdentifier found as data-for');
      }
      // console.log({ embedIdentifier });

      // The API for looking for and creating embeds
      window.__CPEmbed(`.${embedIdentifier}`);

      // Focus the iframe and remove the button
      // TODO: Really should test this. Does it make sense?
      const newEmbed = button.previousElementSibling;

      // Remove the button after the focus moves
      button.addEventListener('blur', ev => {
        button.remove();
      });

      focusOnElement(newEmbed);
    })
  );
}
