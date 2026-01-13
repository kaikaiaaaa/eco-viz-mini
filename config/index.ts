import type { UserConfigExport } from '@tarojs/cli';
import path from 'path';
import * as dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

const config: UserConfigExport = {
  projectName: 'eco-viz-mini',
  date: '2025-10-28',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react', '@tarojs/plugin-platform-weapp'],
  defineConstants: {
    WECHAT_APP_ID: JSON.stringify(process.env.WECHAT_APP_ID || ''),
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: 'webpack5',
  alias: {
    '@': path.resolve(__dirname, '..', 'src')
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: false,
        config: {}
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui'],
    postcss: {
      autoprefixer: {
        enable: true
      },
      cssModules: {
        enable: false,
        config: {}
      }
    }
  }
};

export default config;


