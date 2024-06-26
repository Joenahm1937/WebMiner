import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const OUT_DIR = 'dist';

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'move-html',
            writeBundle(_, bundle) {
                for (const [key] of Object.entries(bundle)) {
                    if (key.endsWith('.html')) {
                        const oldPath = path.join(OUT_DIR, key);
                        const newPath = path.join(OUT_DIR, path.basename(key));

                        try {
                            fs.renameSync(oldPath, newPath);
                            console.log(`${oldPath} moved to ${newPath}`);
                        } catch (err) {
                            console.error('Error moving HTML file:', err);
                        }

                        fs.rmSync(path.resolve(OUT_DIR, 'src'), {
                            recursive: true,
                            force: true,
                        });
                    }
                }
            },
        },
    ],
    build: {
        rollupOptions: {
            input: {
                serviceWorker: 'src/background/serviceWorker.ts',
                popup: 'src/popup/index.html',
                signalStatus: 'src/signalStatus.ts',
            },
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
        },
        outDir: OUT_DIR,
    },
});
