import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // относительный base — чтобы сборка работала в подпапке GitHub Pages /vine-krym/
  base: './',
  plugins: [react()],
})
