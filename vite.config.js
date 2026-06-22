import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    // Set base path to allow relative asset URLs
    base: '',
    
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    
    build: {
      // Output compiled assets directly to Shopify's assets folder
      outDir: resolve(__dirname, 'assets'),
      
      // CRITICAL: Do not empty the assets directory before building.
      // Doing so would delete existing Shopify theme assets (e.g. critical.css, icons, svgs).
      emptyOutDir: false,
      
      // Minify in production, disable in development for speed and readability
      minify: isDev ? false : 'esbuild',
      
      // Generate inline sourcemaps for development to avoid extra file syncs, disable for production
      sourcemap: isDev ? 'inline' : false,
      
      // Ensure CSS/JS are not inlined as Base64 data URLs
      assetsInlineLimit: 0,
      
      rollupOptions: {
        input: {
          // Entry point for Javascript and SCSS
          base: resolve(__dirname, 'src/js/base.js'),
          swiper: resolve(__dirname, 'src/js/general/swiper.js')
        },
        output: {
          // Keep filenames clean without hash values to match Shopify theme requirements
          entryFileNames: '[name].js',
          chunkFileNames: 'chunk-[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'base.css';
            }
            return '[name].[ext]';
          }
        }
      }
    }
  };
});
