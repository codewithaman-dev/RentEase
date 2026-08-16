import supabase from './db-client.js';

function checkAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded && decoded.exp > Math.floor(Date.now() / 1000)) return decoded;
  } catch {}
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const user = checkAuth(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Recalculate totals server-side
      let totalMonthlyRent = 0;
      let totalDeposit = 0;

      const itemsWithProduct = await Promise.all(
        (data || []).map(async (item) => {
          const { data: product } = await supabase
            .from('products_v2')
            .select('*')
            .eq('id', item.product_id)
            .single();

          const rate = item.tenure_months === 3
            ? (product?.monthly_rate_3m || product?.monthly_rent * 1.3)
            : item.tenure_months === 6
            ? (product?.monthly_rate_6m || product?.monthly_rent * 1.15)
            : (product?.monthly_rate_12m || product?.monthly_rent);

          const deposit = product?.deposit_amount || product?.security_deposit || 1000;

          totalMonthlyRent += Number(rate) * item.quantity;
          totalDeposit += Number(deposit) * item.quantity;

          return {
            ...item,
            product,
            calculatedRate: rate,
            calculatedDeposit: deposit,
          };
        })
      );

      return res.status(200).json({
        success: true,
        data: {
          items: itemsWithProduct,
          totalMonthlyRent,
          totalDeposit,
          itemCount: itemsWithProduct.reduce((sum, i) => sum + i.quantity, 0),
        },
      });
    }

    if (req.method === 'POST') {
      const { productId, tenureMonths = 6, quantity = 1 } = req.body || {};

      if (!productId) {
        return res.status(400).json({ success: false, error: 'Product ID required' });
      }

      const id = 'ci_' + Date.now().toString(36);
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          id,
          user_id: user.id,
          product_id: productId,
          tenure_months: Number(tenureMonths),
          quantity: Number(quantity),
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ success: true, data });
    }

    if (req.method === 'PATCH') {
      const { cartItemId, quantity, tenureMonths } = req.body || {};
      const updates = {};
      if (quantity !== undefined) updates.quantity = Number(quantity);
      if (tenureMonths !== undefined) updates.tenure_months = Number(tenureMonths);

      const { data, error } = await supabase
        .from('cart_items')
        .update(updates)
        .eq('id', cartItemId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'DELETE') {
      const { cartItemId } = req.body || {};
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;

      return res.status(200).json({ success: true, message: 'Item removed from cart' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('API cart error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
