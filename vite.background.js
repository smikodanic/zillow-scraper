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
        service_worker: resolve(__dirname, 'src/background/service_worker.js')
      },
      output: {
        // Rename service-worker-CQniOKOU.js to service-worker.js
        entryFileNames: 'background/[name].js',
        // chunkFileNames: 'background/[name].js',
        // assetFileNames: 'background/[name].js'
      }
    }
  }
};
