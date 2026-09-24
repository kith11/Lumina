import { config } from 'dotenv';
import { getDb, getSqlClient } from '../server/db/client.js';
import { ensureSchema } from '../server/db/migrations.js';
import { users } from '../server/db/schema.js';

config({ path: '.env' });
config({ path: '.env.local', override: true });
config({ path: 'lumina-credentials.env', override: true });

const demoUsers = [
  { id: 'demo-gaming', name: 'Alex Morgan', email: 'alex@demo.com', role: 'user' },
  { id: 'demo-fitness', name: 'Jordan Lee', email: 'jordan@demo.com', role: 'user' },
  { id: 'admin', name: 'Lumina Admin', email: 'admin@lumina.com', role: 'admin' }
].map((user) => ({ ...user, phone: null, address: null, city: null, postalCode: null, marketing: 1, createdAt: new Date().toISOString().replace('T', ' ').replace('Z', '') }));

const sql = getSqlClient();
await ensureSchema(sql);
const db = getDb();
for (const user of demoUsers) {
  await db.insert(users).values(user).onConflictDoUpdate({
    target: users.id,
    set: { name: user.name, email: user.email, role: user.role, marketing: user.marketing }
  });
}
await sql.end();

console.log(`Seeded ${demoUsers.length} Lumina demo users into Layerbase.`);
process.exit(0);
