import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

/** resolve a page relative to this config file (no __dirname in ESM) */
const page = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  /* relative URLs so the built site works from any sub-folder */
  base: './',
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      /* every page is an entry, so `npm run build` emits a complete site */
      input: {
        main: page('index.html'),
        about: page('pages/about.html'),
        courses: page('pages/courses.html'),
        contact: page('pages/contact.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})
