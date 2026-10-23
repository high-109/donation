import path from 'path';
import { defineConfig, Plugin } from 'vite';

function rsvpApiPlugin(): Plugin {
  return {
    name: 'rsvp-mock-api',
    configureServer(server) {
      server.middlewares.use('/api/rsvp', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'RSVP received with warmth' }));
          });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'ok', service: 'RSVP API' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [rsvpApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
