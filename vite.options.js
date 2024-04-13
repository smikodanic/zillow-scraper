import { resolve } from 'path';

export default {
  root: 'src',
  mode: 'development',
  publicDir: 'public', // relative to root
  build: {
    outDir: '../dist',
    assetsDir: 'options/assets', // place files in outDir/assetsDir -> dist/options
    emptyOutDir: true,
    rollupOptions: {
      input: {
        opt: resolve(__dirname, 'src/options/opt.html')
      }
    }
  }
};
