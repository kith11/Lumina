const weights = { category: 0.35, similarity: 0.25, popularity: 0.2, purchase: 0.1, recency: 0.1 };

export function rankProducts({ products, events = [], orders = [], excludeIds = [], category, limit = 8 }) {
  const excluded = new Set(excludeIds);
  const now = Date.now();
  const categoryScores = {};
  const productScores = {};
  const popularity = {};
  const purchasedCategories = {};

  events.forEach((event) => {
    const ageDays = Math.max(0, (now - new Date(event.timestamp).getTime()) / 86400000);
    const recency = Math.max(0.25, 1 - ageDays / 30);
    const value = ({ product_view: 1, search: 0.4, category_view: 0.6, add_to_cart: 2.5, wishlist_add: 2, purchase: 4 }[event.eventType] || 0.2) * recency;
    const product = products.find((item) => item.id === event.productId);
    if (!product) return;
    categoryScores[product.category] = (categoryScores[product.category] || 0) + value;
    productScores[product.id] = (productScores[product.id] || 0) + value;
    popularity[product.id] = (popularity[product.id] || 0) + value;
  });
  orders.forEach((order) => order.items?.forEach((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (product) purchasedCategories[product.category] = (purchasedCategories[product.category] || 0) + 1;
  }));

  const maxCategory = Math.max(1, ...Object.values(categoryScores));
  const maxPopularity = Math.max(1, ...Object.values(popularity));
  const sourceProduct = category ? products.find((item) => item.id === category) : null;
  return products
    .filter((product) => !excluded.has(product.id) && product.stock > 0)
    .map((product) => {
      const sameCategory = sourceProduct && product.category === sourceProduct.category ? 1 : 0;
      const sameBrand = sourceProduct && product.brand === sourceProduct.brand ? 0.35 : 0;
      const tagOverlap = sourceProduct ? product.tags.filter((tag) => sourceProduct.tags.includes(tag)).length / Math.max(1, sourceProduct.tags.length) : 0;
      const similarity = Math.min(1, sameCategory * 0.6 + sameBrand + tagOverlap * 0.4);
      const score = (categoryScores[product.category] || 0) / maxCategory * weights.category +
        similarity * weights.similarity + (popularity[product.id] || 0) / maxPopularity * weights.popularity +
        (purchasedCategories[product.category] || 0) * 0.1 * weights.purchase + (product.rating / 5) * weights.recency;
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);
}

export function getCategoryInterest(products, events) {
  const tally = {};
  events.forEach((event) => {
    const product = products.find((item) => item.id === event.productId);
    if (product) tally[product.category] = (tally[product.category] || 0) + 1;
  });
  return Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([category]) => category);
}
