import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devApiTarget = env.VITE_DEV_API_PROXY_TARGET
  const server = {}

  if (devApiTarget) {
    server.proxy = {
      '/backend': {
        target: devApiTarget,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    }
  }

  return {
    plugins: [react()],
    server,
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
  }
})
