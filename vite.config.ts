import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'vendor-react'
          }

          if (id.includes('/react-router/') || id.includes('/react-router-dom/')) {
            return 'vendor-router'
          }

          if (id.includes('@tanstack/')) {
            return 'vendor-tanstack'
          }

          if (id.includes('@radix-ui/')) {
            return 'vendor-radix'
          }

          if (id.includes('/lucide-react/')) {
            return 'vendor-icons'
          }

          if (id.includes('/axios/')) {
            return 'vendor-axios'
          }

          if (
            id.includes('/zod/') ||
            id.includes('/react-hook-form/') ||
            id.includes('/@hookform/')
          ) {
            return 'vendor-forms'
          }

          return undefined
        },
      },
    },
  },
})
