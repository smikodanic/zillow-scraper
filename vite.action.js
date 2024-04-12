import { resolve } from 'path';

export default {
  root: 'src',
  mode: 'development',
  // publicDir: 'public', // relative to root
  build: {
    outDir: '../dist',
    assetsDir: 'action', // place files in outDir/assetsDir -> dist/action
    emptyOutDir: false,
    rollupOptions: {
      input: {
        act: resolve(__dirname, 'src/action/index.html')
      }
    }
  }
};
