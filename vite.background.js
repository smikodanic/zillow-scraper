import { resolve } from 'path';

export default {
  root: 'src',
  mode: 'development',
  publicDir: 'background', // relative to root
  build: {
    outDir: '../dist',
    assetsDir: 'background', // place files in outDir/assetsDir -> dist/background
    emptyOutDir: false,
    rollupOptions: {
      input: {
        service_worker: resolve(__dirname, 'src/background/service_worker.js')
      },
      output: {
        // Rename cnt-CQniOKOU.js to cnt.js
        entryFileNames: 'background/[name].js',
        chunkFileNames: 'background/[name].js',
        // assetFileNames: 'background/[name].js'
      }
    }
  }
};
