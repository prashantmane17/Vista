// Import styling entry point so Vite compiles and bundles the SCSS/CSS
import '../scss/theme.scss';

// Import ES Modules
import { CoreBase } from './core/base';

// Initialize the theme on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const core = new CoreBase();
  core.init();
  
  // Future component and section imports can be registered here.
  // Code splitting and dynamic imports are supported:
  // import('./components/lazy-component.js').then((module) => { ... });
});
