/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest'

const isTest = process.env.NODE_ENV === 'test'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    !isTest && crx({ manifest }),
  ].filter(Boolean) as unknown as Plugin[],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    exclude: ['e2e/**/*', 'node_modules/**/*']
  }
})
