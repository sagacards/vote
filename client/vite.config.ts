import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
// TODO: Default Vite TS project fucks up source maps completely. I only get 404s in the chrome debugger.
defineConfig({
    plugins: [
        tsconfigPaths(),
        react(),
    ],
})
