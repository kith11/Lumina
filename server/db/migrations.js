const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    marketing INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email)`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    rating REAL NOT NULL,
    stock INTEGER NOT NULL,
    image TEXT NOT NULL,
    tags TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS products_category_idx ON products (category)`,
  `CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    session_id TEXT,
    product_id TEXT,
    event_type TEXT NOT NULL,
    timestamp TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS events_user_idx ON events (user_id)`,
  `CREATE INDEX IF NOT EXISTS events_session_idx ON events (session_id)`,
  `CREATE TABLE IF NOT EXISTS wishlist_items (
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, product_id)
  )`,
  `CREATE TABLE IF NOT EXISTS cart_items (
    owner_key TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (owner_key, product_id)
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    total_cents INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id)`,
  `CREATE TABLE IF NOT EXISTS order_items (
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_cents INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id)
  )`
];

export async function ensureSchema(sql) {
  for (const statement of statements) {
    try {
      await sql.unsafe(statement);
    } catch (error) {
      // Layerbase's SQLite compatibility proxy may strip IF NOT EXISTS before
      // executing DDL. Treat its duplicate-object response as idempotent.
      if (!/already exists/i.test(error.message || '')) throw error;
    }
  }
}
