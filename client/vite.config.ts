import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
        chunkSizeWarningLimit: 1000
    },
    // Base URL para producción (si se despliega en subruta)
    base: '/',
})