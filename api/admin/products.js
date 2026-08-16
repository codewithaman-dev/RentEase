import supabase from '../db-client.js';

function checkAdminRole(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded && (decoded.role === 'ADMIN' || decoded.role === 'admin')) return decoded;
  } catch {}
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const admin = checkAdminRole(req);
  if (!admin) {
    return res.status(403).json({ success: false, error: 'Forbidden: Admin role required' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('products_v2')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
      const product = req.body;
      product.id = product.id || 'prod_' + Date.now().toString(36);

      const { data, error } = await supabase
        .from('products_v2')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Product created by Admin', data });
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body || {};
      const { data, error } = await supabase
        .from('products_v2')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Product updated by Admin', data });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      const { error } = await supabase
        .from('products_v2')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Product deleted permanently by Admin' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin products API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
