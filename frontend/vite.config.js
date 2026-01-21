import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable file system watching which can cause issues in iCloud
    watch: null,
    // Use esbuild for faster builds
    minify: 'esbuild',
  }
})
