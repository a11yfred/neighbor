import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const fixUbeCssPlugin = {
  name: 'fix-ube-css',
  resolveId(source, importer) {
    if (source === './ui.css' && importer && importer.replace(/\\/g, '/').includes('@ulam/ube/react')) {
      return this.resolve('../ui.css', importer)
    }
    return null
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), fixUbeCssPlugin],
})

