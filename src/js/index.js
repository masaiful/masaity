import * as MakeCpInteractive from './MakeCpInteractive';
import * as SkipLinkFix from './SkipLinkFix';
// import * as debug from './debug';

/* The main entry point of the application */
const init = () => {
  MakeCpInteractive.init();
  SkipLinkFix.init();

  // Uncomment as needed
  // debug.focus();
};

// Start the application
init();
