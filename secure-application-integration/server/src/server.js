import 'dotenv/config';
import { env } from './config/env.js';
import app from './app.js';

const server = app.listen(env.port, () => {
  console.log(`Secure integration API listening on http://localhost:${env.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; closing HTTP server.`);
  server.close((error) => {
    if (error) {
      console.error('Error while closing HTTP server:', error);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
