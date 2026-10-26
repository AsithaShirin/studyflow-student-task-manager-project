import 'dotenv/config';
import { z } from 'zod';
const parsed = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().min(1), JWT_SECRET: z.string().min(32),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  RENDER_EXTERNAL_URL: z.string().url().optional(),
}).safeParse(process.env);
if (!parsed.success) {
  console.error('Check server/.env. Required values:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
