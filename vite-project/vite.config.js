import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// 辅助函数：解析路径
const __dirname = new URL('.', import.meta.url).pathname
// https://vite.dev/config/
export default defineConfig({
  // 输出目录为根目录的dist
  outDir: resolve(__dirname, "../dist"),
  emptyOutDir: true, // 构建前清空该目录（可选）
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // 定义多个入口页面
        projectDep: resolve(__dirname, "index.html"),
        codeAiByQwen: resolve(__dirname, "code-ai-by-qwen.html"),
        // contact: resolve(__dirname, 'contact.html')
        // 更多页面...
        // dashboard: resolve(__dirname, 'dashboard/index.html')
      },
    },
  },
});
