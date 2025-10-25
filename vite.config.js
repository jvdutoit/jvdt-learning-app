import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.NODE_ENV === 'production' ? '/jvdt-learning-app/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.ts',
    css: true
  }
})
