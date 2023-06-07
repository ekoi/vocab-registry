import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/browse': 'http://127.0.0.1:5000',
            '/vocab': 'http://127.0.0.1:5000',
            '/facet': 'http://127.0.0.1:5000'
        }
    }
});
