import { resolve } from 'node:path';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImportTypes from 'auto-import-types';
import PiniaAutoRefs from 'pinia-auto-refs';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';

import env from './src/config/env';

// const b = 'last 2 versions, > 0.3%, Firefox ESR';
const b = 'ios 9';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    AutoImportTypes(),
    PiniaAutoRefs(),
    AutoImport({
      dts: 'src/auto-imports.d.ts',
      imports: [
        'vue',
        'uni-app',
        'pinia',
        {
          '@/frame/app': ['$nid', '$mock', '$getStore'],
          '@/helper/pinia-auto-refs': ['useStore'],
          '@/frame/serviceMan': ['HttpService'],
        }
      ],
      exclude: ['createApp'],
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      extensions: ['vue'],
      dts: 'src/components.d.ts'
    }),
    babel({
      extensions: ['.js'],
      include: ['src/**/*'],
      // exclude: [/node_modules/, /uni_modules/],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              chrome: '58',
              ie: '11'
            },
            useBuiltIns: 'entry',
            corejs: '3.31.0'
          }
        ]
      ],
      plugins: [
        // ['@babel/plugin-transform-arrow-functions', { spec: true }]
        ['@babel/plugin-proposal-decorators', { version: '2023-05' }]
      ]
    }),
    uni({
      viteLegacyOptions: {
        // targets: 'last 2 versions, > 0.3%, Firefox ESR'
        targets: b
      }
    }),

    Unocss()
  ],
  server: {
    open: true, // 自动打开
    base: './ ', // 生产环境路径
    port: 3300,
    proxy: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      // 正则表达式写法
      '^/api': {
        target: env.apiBaseUrl, // 后端服务实际地址
        changeOrigin: true, // 开启代理
        rewrite: (path) => {
          // console.log( env.apiBaseUrl, path.replace(/^\/api/, ''));
          return path.replace(/^\/api/, '');
        }
      }
    }
  }
});
