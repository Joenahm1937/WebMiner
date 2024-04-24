// vite.config.js for content script and service worker
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                serviceWorker: 'src/background/serviceWorker.ts',
                contentScript: 'src/content/contentScript.ts',
            },
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
        },
        outDir: 'dist',
    },
});
