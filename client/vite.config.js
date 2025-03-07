import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
})
