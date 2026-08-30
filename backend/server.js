const app = require('./src/app');
const env = require('./src/config/env');
const { connectDatabase } = require('./src/config/db');

async function start() {
  try {
    await connectDatabase();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[database] Failed to connect. Check DATABASE_URL in .env');
    // eslint-disable-next-line no-console
    console.error(err.message);
    // Server still starts so the frontend can render helpful error states
    // instead of failing to boot entirely during setup.
  }

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Eklavya Solutions API running on http://localhost:${env.port}`);
  });
}

start();
