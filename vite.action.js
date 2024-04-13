import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default {
  root: 'src',
  mode: 'development',
  // publicDir: '', // relative to root
  build: {
    outDir: '../dist',
    assetsDir: 'action/assets', // place builded files in outDir/assetsDir -> dist/action
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        act: resolve(__dirname, 'src/action/popup.html')
      }
    }
  },
  plugins: [vue()]
};
