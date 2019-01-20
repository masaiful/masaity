import * as polyfills from './polyfills';
import * as MakeCpInteractive from './MakeCpInteractive';

/* The main entry point of the application */

const init = () => {
  polyfills.init();
  MakeCpInteractive.init();
};

// Start the application
init();
