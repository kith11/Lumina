import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';

let client;
let database;

export function getSqlClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured for the Layerbase database.');
  }

  if (!client) {
    // Layerbase's pooled URL is intended for serverless workloads. Disabling
    // prepared statements keeps this compatible with transaction poolers.
    client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
  }

  return client;
}

export function getDb() {
  if (!database) {
    database = drizzle(getSqlClient(), { schema });
  }
  return database;
}
