import serverless from 'serverless-http';
import { app } from '../../server.ts';

// Serverless handler for Netlify Functions forwarding all /api/* requests to Express
export const handler = serverless(app, {
  binary: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/octet-stream',
    'multipart/form-data',
  ],
});
