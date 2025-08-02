import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  outDir: resolve(dirname(fileURLToPath(import.meta.url)), 'src/webview-ui/dist'),
  plugins: [react()],
})