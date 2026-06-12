import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          telegram: ['@twa-dev/sdk'],
        },
      },
    },
  },
  define: {
    // Expose env variables to the app
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
