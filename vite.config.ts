import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

const timestamp = new Date().getTime();

// vite 配置
export default ({ command, mode }) => {
  // 获取环境变量
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 4096,
      // rollupOptions: {
      //   output: {
      //     chunkFileNames: (chunk) => {
      //       return 'assets/' + chunk.name + '.[hash]' + '.' + timestamp + '.js';
      //     },
      //     assetFileNames: (asset) => {
      //       const name = asset.name;
      //       if (name && (name.endsWith('.css') || name.endsWith('.js'))) {
      //         const names = name.split('.');
      //         const extname = names.splice(names.length - 1, 1)[0];
      //         return `assets/${names.join('.')}.[hash].${timestamp}.${extname}`;
      //       }
      //       return 'assets/' + asset.name;
      //     },
      //   },
      // },
    },
    plugins: [
      vue({
        template: {
          transformAssetUrls: {
            img: ['src'],
            'a-avatar': ['src'],
            'stepin-view': ['logo-src'],
            'a-card': ['cover'],
          },
        },
      }),
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: 'less' })],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'root-entry-name': 'variable',
          },
          javascriptEnabled: true,
        },
      },
    },
    base: env.VITE_BASE_URL,
  });
};
