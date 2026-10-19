import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function apiTrackVisaPlugin() {
  return {
    name: 'api-track-visa-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/track-visa', async (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const passport = (data.passportNumber || '').trim().toUpperCase();
              const nationality = (data.nationalityCode || '').trim().toUpperCase();

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: false,
                errorCode: 'DIRECT_VERIFICATION_REQUIRED',
                error: 'Official EMGS live status lookup requires direct Malaysian government portal verification. Please verify directly on the official tracker.',
                officialTrackerUrl: 'https://visa.educationmalaysia.gov.my/emgs/application/searchForm/',
                suggestOfficialPortal: true,
                normalizedPassport: passport,
                nationalityCode: nationality
              }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiTrackVisaPlugin()],
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
          'track-visa': path.resolve(__dirname, 'track-visa.html'),
        },
      },
    },
  };
});
