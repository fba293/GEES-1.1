import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';
const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints for Cloud Run (supports GET and HEAD)
app.all(['/health', '/_health', '/api/health'], (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.post('/api/track-visa', (req: Request, res: Response) => {
  try {
    const { passportNumber = '', nationalityCode = '' } = req.body || {};
    const passport = String(passportNumber).trim().toUpperCase();
    const nationality = String(nationalityCode).trim().toUpperCase();

    res.status(200).json({
      success: false,
      errorCode: 'DIRECT_VERIFICATION_REQUIRED',
      error: 'Official EMGS live status lookup requires direct Malaysian government portal verification. Please verify directly on the official tracker.',
      officialTrackerUrl: 'https://visa.educationmalaysia.gov.my/emgs/application/searchForm/',
      suggestOfficialPortal: true,
      normalizedPassport: passport,
      nationalityCode: nationality,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid request body' });
  }
});

async function setupServer() {
  const distDir = path.resolve(__dirname, 'dist');

  if (isProduction && fs.existsSync(distDir)) {
    console.log(`[GEES Server] Serving production static files from ${distDir}`);
    // Static assets
    app.use(express.static(distDir, {
      maxAge: '1d',
      index: 'index.html',
    }));

    // Multi-page clean routing and SPA fallback (supports both GET and HEAD)
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        return next();
      }

      const reqPath = req.path.replace(/^\//, '');

      // 0. Root path '/'
      if (!reqPath) {
        const indexHtmlPath = path.join(distDir, 'index.html');
        if (fs.existsSync(indexHtmlPath)) {
          return res.sendFile(indexHtmlPath);
        }
      }

      // 1. Direct file match in dist (e.g. style.css, favicon.svg)
      const directFilePath = path.join(distDir, reqPath);
      if (reqPath && fs.existsSync(directFilePath) && fs.statSync(directFilePath).isFile()) {
        return res.sendFile(directFilePath);
      }

      // 2. HTML file match (e.g. /services -> /services.html, /blog -> /blog.html)
      const htmlPath = path.join(distDir, `${reqPath}.html`);
      if (reqPath && fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
        return res.sendFile(htmlPath);
      }

      // 3. Fallback to index.html for client-side routing
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtmlPath)) {
        return res.sendFile(indexHtmlPath);
      }

      next();
    });
  } else {
    // Development mode with Vite middleware
    console.log('[GEES Server] Running in development mode with Vite middleware');
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`[GEES Server] Running on http://${HOST}:${PORT}`);
  });

  const shutdown = () => {
    console.log('[GEES Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[GEES Server] Closed all connections. Exiting.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

setupServer().catch((err) => {
  console.error('[GEES Server] Startup error:', err);
  process.exit(1);
});
