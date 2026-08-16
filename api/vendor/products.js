import supabase from '../db-client.js';

function checkVendorRole(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded && (decoded.role === 'VENDOR' || decoded.role === 'ADMIN' || decoded.role === 'vendor' || decoded.role === 'admin')) return decoded;
  } catch {}
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const vendor = checkVendorRole(req);
  if (!vendor) {
    return res.status(403).json({ success: false, error: 'Forbidden: Vendor role required' });
  }

  try {
    if (req.method === 'GET') {
      const { search, category, status } = req.query;
      let query = supabase.from('products_v2').select('*');

      if (category && category !== 'all') {
        query = query.eq('category_slug', category);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
      const product = req.body;
      product.id = product.id || 'prod_' + Date.now().toString(36);
      product.vendor_id = vendor.id;

      const { data, error } = await supabase
        .from('products_v2')
        .insert(product)
        .select()
        .single();

      if (error) throw error;

      // Seed tenure plans for new product
      const rate12m = Number(product.monthly_rate_12m || product.monthly_rent || 499);
      await supabase.from('tenure_plans').insert([
        { id: `tp_${product.id}_3`, product_id: product.id, months: 3, monthly_rent: Math.round(rate12m * 1.3) },
        { id: `tp_${product.id}_6`, product_id: product.id, months: 6, monthly_rent: Math.round(rate12m * 1.15) },
        { id: `tp_${product.id}_9`, product_id: product.id, months: 9, monthly_rent: Math.round(rate12m * 1.08) },
        { id: `tp_${product.id}_12`, product_id: product.id, months: 12, monthly_rent: rate12m },
      ]);

      return res.status(201).json({ success: true, message: 'Product listed on marketplace', data });
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('products_v2')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Inventory updated', data });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase
        .from('products_v2')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Product unlisted from inventory' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Vendor products API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
