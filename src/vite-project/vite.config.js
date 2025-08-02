import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// 辅助函数：解析路径
const __dirname = new URL('.', import.meta.url).pathname
// https://vite.dev/config/
export default defineConfig({
  // outDir: resolve(dirname(fileURLToPath(import.meta.url)), 'src/webview-ui/dist'),
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // 定义多个入口页面
        projectDep: resolve(__dirname, 'index.html'),
        // about: resolve(__dirname, 'about.html'),
        // contact: resolve(__dirname, 'contact.html')
        // 更多页面...
        // dashboard: resolve(__dirname, 'dashboard/index.html')
      }
    }
  }
})