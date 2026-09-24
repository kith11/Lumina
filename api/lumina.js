import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '../server/db/client.js';
import { cartItems, events, orderItems, orders, users, wishlistItems } from '../server/db/schema.js';

const json = (res, status, body) => res.status(status).json(body);
const now = (value = Date.now()) => new Date(value).toISOString().replace('T', ' ').replace('Z', '');

function userValues(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
    phone: user.phone || null,
    address: user.address || null,
    city: user.city || null,
    postalCode: user.postalCode || null,
    marketing: user.marketing === false ? 0 : 1,
    createdAt: now(user.createdAt || Date.now())
  };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST'].includes(req.method)) return json(res, 405, { error: 'Method not allowed' });

  try {
    const db = getDb();

    if (req.method === 'GET') {
      const resource = req.query?.resource || 'health';
      if (resource !== 'health') return json(res, 400, { error: 'Unknown resource' });
      const result = await db.select({ users: sql`count(*)` }).from(users);
      return json(res, 200, { ok: true, database: 'layerbase', users: Number(result[0]?.users || 0) });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const action = body.action;

    if (action === 'sync_user' || action === 'update_account') {
      const values = userValues(body.user);
      await db.insert(users).values(values).onConflictDoUpdate({
        target: users.id,
        set: {
          email: values.email,
          name: values.name,
          role: values.role,
          phone: values.phone,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          marketing: values.marketing
        }
      });
      return json(res, 200, { ok: true });
    }

    if (action === 'event') {
      const event = body.event;
      await db.insert(events).values({
        id: event.id,
        userId: event.userId || null,
        sessionId: event.sessionId || null,
        productId: event.productId || null,
        eventType: event.eventType,
        timestamp: now(event.timestamp || Date.now())
      }).onConflictDoNothing();
      return json(res, 201, { ok: true });
    }

    if (action === 'wishlist') {
      const { userId, productId, saved } = body;
      if (saved) {
        await db.insert(wishlistItems).values({ userId, productId, createdAt: now() }).onConflictDoNothing();
      } else {
        await db.delete(wishlistItems).where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
      }
      return json(res, 200, { ok: true });
    }

    if (action === 'cart') {
      const { ownerKey, lines = [] } = body;
      await db.delete(cartItems).where(eq(cartItems.ownerKey, ownerKey));
      if (lines.length) {
        await db.insert(cartItems).values(lines.map((line) => ({
          ownerKey,
          productId: line.productId,
          quantity: line.quantity,
          updatedAt: now()
        })));
      }
      return json(res, 200, { ok: true });
    }

    if (action === 'order') {
      const order = body.order;
      await db.insert(orders).values({
        id: order.id,
        userId: order.userId,
        totalCents: Math.round(Number(order.total) * 100),
        status: order.status || 'Processing',
        createdAt: now(order.createdAt || Date.now())
      }).onConflictDoNothing();
      if (order.items?.length) {
        await db.insert(orderItems).values(order.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceCents: Math.round(Number(item.price) * 100)
        }))).onConflictDoNothing();
      }
      return json(res, 201, { ok: true });
    }

    return json(res, 400, { error: 'Unknown action' });
  } catch (error) {
    console.error('Layerbase API error:', error.message);
    return json(res, 503, { error: 'Layerbase database unavailable. Run npm run db:push first.' });
  }
}
