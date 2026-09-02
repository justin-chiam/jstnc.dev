// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://jstnc.dev',
  redirects: {
    '/github': 'https://github.com/justin-chiam',
    '/linkedin': 'https://www.linkedin.com/in/justin-chiam',
  },
});
