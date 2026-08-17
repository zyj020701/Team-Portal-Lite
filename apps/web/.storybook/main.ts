import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
    '../**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig) => {
    return {
      ...viteConfig,
      resolve: {
        ...viteConfig.resolve,
        alias: {
          ...viteConfig.resolve?.alias,
          '@team-portal-lite/lib': resolve(
            __dirname,
            '../../../packages/lib/src',
          ),
          '@team-portal-lite/ui': resolve(
            __dirname,
            '../../../packages/ui/src',
          ),
          '@team-portal-lite/store': resolve(
            __dirname,
            '../../../packages/store/src',
          ),
          '@team-portal-lite/features': resolve(
            __dirname,
            '../../../packages/features/src',
          ),
        },
      },
      css: {
        postcss: {
          plugins: [
            tailwindcss({
              content: [
                resolve(__dirname, '../app/**/*.{ts,tsx}'),
                resolve(__dirname, '../components/**/*.{ts,tsx}'),
                resolve(__dirname, '../../../packages/ui/src/**/*.{ts,tsx}'),
                resolve(
                  __dirname,
                  '../../../packages/features/src/**/*.{ts,tsx}',
                ),
              ],
            }),
            autoprefixer(),
          ],
        },
      },
    };
  },
};

export default config;