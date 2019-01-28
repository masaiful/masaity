// Polyfills
import 'details-element-polyfill';

// Analytics
import * as analytics from './analytics/analytics';

// General
import * as FixLinks from './fix-in-page-links';

// Components
import * as MakeCpInteractive from './MakeCpInteractive';
import * as FocusablePreTags from './FocusablePreTags';
// import * as debug from './debug';

/* The main entry point of the application */
const init = () => {
  analytics.init();
  FixLinks.init();
  MakeCpInteractive.init();
  FocusablePreTags.init();

  // Uncomment as needed
  // debug.focus();
};

// Start the application
init();
