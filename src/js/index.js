import * as MakeCpInteractive from './MakeCpInteractive';
import * as FixLinks from './fix-in-page-links';
import * as FocusablePreTags from './FocusablePreTags';
import 'details-element-polyfill';
// import * as debug from './debug';

/* The main entry point of the application */
const init = () => {
  MakeCpInteractive.init();
  FixLinks.init();
  FocusablePreTags.init();

  // Uncomment as needed
  // debug.focus();
};

// Start the application
init();
