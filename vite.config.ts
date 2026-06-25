import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom/')) return 'vendor';
          if (id.includes('node_modules/react/') && !id.includes('react-dom')) return 'vendor';
          if (id.includes('node_modules/motion/') || id.includes('node_modules/framer-motion/')) return 'motion';
          if (id.includes('node_modules/@supabase/')) return 'supabase';
          if (id.includes('node_modules/lucide-react/')) return 'icons';
        },
      },
    },
  },
});
