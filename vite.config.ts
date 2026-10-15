import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          blog: path.resolve(__dirname, 'blog.html'),
          faq: path.resolve(__dirname, 'faq.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          services: path.resolve(__dirname, 'services.html'),
          countries: path.resolve(__dirname, 'countries.html'),
          universities: path.resolve(__dirname, 'universities.html'),
          courses: path.resolve(__dirname, 'courses.html'),
          events: path.resolve(__dirname, 'events.html'),
          news: path.resolve(__dirname, 'news.html'),
          'about-us': path.resolve(__dirname, 'about-us.html'),
          'flight-ticketing': path.resolve(__dirname, 'flight-ticketing.html'),
          'study-in-malaysia': path.resolve(__dirname, 'study-in-malaysia.html'),
          'study-in-united-kingdom': path.resolve(__dirname, 'study-in-united-kingdom.html'),
          'study-in-australia': path.resolve(__dirname, 'study-in-australia.html'),
          'study-in-new-zealand': path.resolve(__dirname, 'study-in-new-zealand.html'),
          'study-in-cyprus': path.resolve(__dirname, 'study-in-cyprus.html'),
          'study-in-belgium': path.resolve(__dirname, 'study-in-belgium.html'),
          'study-in-finland': path.resolve(__dirname, 'study-in-finland.html'),
          'study-in-greece': path.resolve(__dirname, 'study-in-greece.html'),
          'study-in-mauritius': path.resolve(__dirname, 'study-in-mauritius.html'),
          'study-in-netherlands': path.resolve(__dirname, 'study-in-netherlands.html'),
          'study-in-india': path.resolve(__dirname, 'study-in-india.html'),
        },
      },
    },
  };
});
