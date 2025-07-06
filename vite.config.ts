import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
   port: 5173,
   strictPort: true,
  },
  server: {
   port: 5173,
   host: true,
   proxy: {
     '/trainer': {
       target: 'https://app.gfproto.xyz',
       changeOrigin: true,
       secure: true,
     },
     '/ping-data-server': {
       target: 'https://app.gfproto.xyz',
       changeOrigin: true,
       secure: true,
     }
   }
  },
})
