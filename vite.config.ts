import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(dirname(fileURLToPath(import.meta.url)), './src'),
      },
      {
        find: '@stores',
        replacement: resolve(dirname(fileURLToPath(import.meta.url)), './src/stores'),
      },
      {
        find: '@modules',
        replacement: resolve(dirname(fileURLToPath(import.meta.url)), './src/stores/modules'),
      },
      {
        find: '@services',
        replacement: resolve(dirname(fileURLToPath(import.meta.url)), './src/services'),
      },
      {
        find: '@components',
        replacement: resolve(dirname(fileURLToPath(import.meta.url)), './src/components'),
      },
      {
        find: '@pages',
        replacement: resolve(dirname(fileURLToPath(import.meta.url)), './src/pages'),
      },
    ],
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
})
