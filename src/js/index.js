// Polyfills
import 'details-element-polyfill';

// General
import * as FixLinks from './fix-in-page-links';

// Components
import * as MakeCpInteractive from './MakeCpInteractive';
import * as FocusablePreTags from './FocusablePreTags';
import * as YoutubeVideo from './YoutubeVideo';
// import * as debug from './debug';

/* The main entry point of the application */
const init = () => {
  FixLinks.init();
  MakeCpInteractive.init();
  FocusablePreTags.init();
  YoutubeVideo.init();

  // Uncomment as needed
  // debug.focus();
};

// Start the application
init();
