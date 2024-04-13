import { resolve } from 'path';

export default {
  root: 'src',
  mode: 'development',
  // publicDir: '', // relative to root
  build: {
    outDir: '../dist',
    // assetsDir: '', // not needed because there's no html file with assets
    emptyOutDir: false,
    rollupOptions: {
      input: {
        foreground: resolve(__dirname, 'src/content_scripts/foreground.js')
      },
      output: {
        // Rename foreground-CQniOKOU.js to foreground.js
        entryFileNames: 'content_scripts/[name].js',
        // chunkFileNames: 'content_scripts/[name].js',
        // assetFileNames: 'content_scripts/[name].js'
      }
    }
  }
};
