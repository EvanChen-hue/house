import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://requests.taiyang.chat/', // 后端接口地址
        changeOrigin: true, // 开启跨域模拟
        rewrite: (path) => path.replace(/^\/api/, '') // 路径重写
      }
    }
  },
});

