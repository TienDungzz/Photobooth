import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(
    { 
        plugins: [react()],
        build: { target: 'es2022' },
        server: {
            host: true,
            allowedHosts: [
            '165e-2405-4802-8035-3100-1db2-4878-dbda-dda.ngrok-free.app'
            ]
        }
    }
);
