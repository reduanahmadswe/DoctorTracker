import type { Server } from 'node:http';
import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'] as const;

const closeServer = (server: Server): Promise<void> =>
  new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

const start = async (): Promise<void> => {
  await connectDatabase();
  const server = app.listen(env.PORT, () => {
    process.stdout.write(`Server listening on port ${env.PORT}\n`);
  });

  const shutdown = async (): Promise<void> => {
    await closeServer(server);
    await disconnectDatabase();
    process.exit(0);
  };

  for (const signal of SHUTDOWN_SIGNALS) {
    process.once(signal, () => {
      shutdown().catch(() => process.exit(1));
    });
  }
};

start().catch((error: unknown) => {
  process.stderr.write(`Failed to start server: ${String(error)}\n`);
  process.exit(1);
});
