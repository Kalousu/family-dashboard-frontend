import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@family-dashboard/widget-core':        resolve(__dirname, '../../packages/widget-core/src'),
      '@family-dashboard/widget-stundenplan': resolve(__dirname, '../../packages/widget-stundenplan/src'),
      '@family-dashboard/widget-kalender':    resolve(__dirname, '../../packages/widget-kalender/src'),
      '@family-dashboard/widget-todo':        resolve(__dirname, '../../packages/widget-todo/src'),
      '@family-dashboard/ui':                 resolve(__dirname, '../../packages/ui/src'),
      '@family-dashboard/auth':               resolve(__dirname, '../../packages/auth/src'),
    }
  },
  server: {
    port: 3000
  }
})