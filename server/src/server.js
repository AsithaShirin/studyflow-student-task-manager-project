import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
try {
  await connectDatabase();
  app.listen(env.PORT, () => console.log(`API listening at http://localhost:${env.PORT}`));
} catch (error) {
  console.error('The server could not start. Check MongoDB and your .env settings.');
  console.error(error.message);
  process.exit(1);
}
