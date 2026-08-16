import supabase from '../db-client.js';

function checkVendorRole(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded && (decoded.role === 'VENDOR' || decoded.role === 'ADMIN' || decoded.role === 'vendor')) return decoded;
  } catch {}
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const vendor = checkVendorRole(req);
  if (!vendor) {
    return res.status(403).json({ success: false, error: 'Forbidden: Vendor role required' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('damage_claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
      const { rentalId, productId, productTitle, description, claimAmount } = req.body || {};

      const id = 'dc_' + Date.now().toString(36);
      const { data, error } = await supabase
        .from('damage_claims')
        .insert({
          id,
          rental_id: rentalId,
          product_id: productId,
          product_title: productTitle,
          description,
          claim_amount: Number(claimAmount || 0),
          status: 'OPEN',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Vendor returns API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
