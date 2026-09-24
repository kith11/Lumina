import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });
config({ path: '.env.local', override: true });
config({ path: 'lumina-credentials.env', override: true });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Add it to .env, .env.local, or lumina-credentials.env.');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.js',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL }
});
