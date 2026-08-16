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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const admin = checkAdminRole(req);
  if (!admin) {
    return res.status(403).json({ success: false, error: 'Forbidden: Admin role required' });
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

    if (req.method === 'PATCH') {
      const { claimId, status } = req.body || {};
      const { data, error } = await supabase
        .from('damage_claims')
        .update({ status })
        .eq('id', claimId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin disputes API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
