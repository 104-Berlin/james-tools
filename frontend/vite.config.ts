import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl({
    name: 'localhost',
    domains: ['*.localhost'],
    certDir: '../backend/',
  })],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://localhost:42069',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://localhost:42069',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
