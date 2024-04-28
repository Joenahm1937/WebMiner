import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const OUT_DIR = 'dist/content';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                contentScript: 'src/content/contentScript.tsx',
            },
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
                format: 'iife',
            },
        },
        outDir: OUT_DIR,
    },
});
