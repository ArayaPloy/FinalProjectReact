import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // หรือใช้ '0.0.0.0' เพื่อเปิดให้เข้าถึงจาก local network
    port: 5173, // port เดิม (ถ้าต้องการเปลี่ยนก็ได้)
  }
})
