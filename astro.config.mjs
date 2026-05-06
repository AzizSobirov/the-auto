import { defineConfig } from 'astro/config'
import viteConfig from './vite.config.js'
import icon from 'astro-icon'

const isProduction = import.meta.env.VITE_MODE == 'production'

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
  output: 'static',
  compressHTML: false,
  build: {
    format: isProduction ? 'file' : 'directory',
    assets: 'assets',
  },
  vite: viteConfig,
})
