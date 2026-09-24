import { config } from 'dotenv';
import { getSqlClient } from '../server/db/client.js';
import { ensureSchema } from '../server/db/migrations.js';

config({ path: '.env' });
config({ path: '.env.local', override: true });
config({ path: 'lumina-credentials.env', override: true });

const sql = getSqlClient();
await ensureSchema(sql);
await sql.end();
console.log('Layerbase schema is ready.');
