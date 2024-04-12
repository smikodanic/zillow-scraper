import { resolve } from 'path';

export default {
  root: 'src',
  mode: 'development',
  publicDir: 'content_scripts/libs', // relative to root
  build: {
    outDir: '../dist',
    assetsDir: 'content_scripts/libs', // place files in outDir/assetsDir -> dist/content_scripts
    emptyOutDir: false,
    rollupOptions: {
      input: {
        foreground: resolve(__dirname, 'src/content_scripts/foreground.js')
      },
      output: {
        // Rename cnt-CQniOKOU.js to cnt.js
        entryFileNames: 'content_scripts/[name].js',
        chunkFileNames: 'content_scripts/[name].js',
        // assetFileNames: 'content_scripts/[name].js'
      }
    }
  }
};
