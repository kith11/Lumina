import { index, integer, pgTable, primaryKey, real, text, uniqueIndex } from 'drizzle-orm/pg-core';

// Layerbase's hosted SQLite database speaks the PostgreSQL wire protocol, so the
// PostgreSQL Drizzle dialect works with the same pooled DATABASE_URL.
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('user'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  postalCode: text('postal_code'),
  marketing: integer('marketing').notNull().default(1),
  createdAt: text('created_at').notNull()
}, (table) => ({
  emailUnique: uniqueIndex('users_email_unique').on(table.email)
}));

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  brand: text('brand').notNull(),
  priceCents: integer('price_cents').notNull(),
  rating: real('rating').notNull(),
  stock: integer('stock').notNull(),
  image: text('image').notNull(),
  tags: text('tags').notNull(),
  createdAt: text('created_at').notNull()
}, (table) => ({
  categoryIndex: index('products_category_idx').on(table.category)
}));

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  sessionId: text('session_id'),
  productId: text('product_id'),
  eventType: text('event_type').notNull(),
  timestamp: text('timestamp').notNull()
}, (table) => ({
  userIndex: index('events_user_idx').on(table.userId),
  sessionIndex: index('events_session_idx').on(table.sessionId)
}));

export const wishlistItems = pgTable('wishlist_items', {
  userId: text('user_id').notNull(),
  productId: text('product_id').notNull(),
  createdAt: text('created_at').notNull()
}, (table) => ({
  primary: primaryKey({ columns: [table.userId, table.productId] })
}));

export const cartItems = pgTable('cart_items', {
  ownerKey: text('owner_key').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  updatedAt: text('updated_at').notNull()
}, (table) => ({
  primary: primaryKey({ columns: [table.ownerKey, table.productId] })
}));

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  totalCents: integer('total_cents').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull()
}, (table) => ({
  userIndex: index('orders_user_idx').on(table.userId)
}));

export const orderItems = pgTable('order_items', {
  orderId: text('order_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  priceCents: integer('price_cents').notNull()
}, (table) => ({
  primary: primaryKey({ columns: [table.orderId, table.productId] })
}));
