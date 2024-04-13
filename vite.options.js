import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default {
  root: 'src',
  mode: 'development',
  publicDir: 'public', // relative to root
  build: {
    outDir: '../dist',
    assetsDir: 'options/assets', // place files in outDir/assetsDir -> dist/options
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        opt: resolve(__dirname, 'src/options/opt.html')
      }
    }
  },
  plugins: [vue()]
};
