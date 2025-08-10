import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/CreatingWithAI/', // IMPORTANT: match your repo name for GitHub Pages
})
