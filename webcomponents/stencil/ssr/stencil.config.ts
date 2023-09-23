import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ssr',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};
