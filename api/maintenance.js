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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const user = checkAuth(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
      const { rentalId, productTitle, issueDescription, priority = 'MEDIUM' } = req.body || {};

      if (!issueDescription) {
        return res.status(400).json({ success: false, error: 'Issue description required' });
      }

      const id = 'mr_' + Date.now().toString(36);
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({
          id,
          user_id: user.id,
          rental_id: rentalId || 'rent_001',
          product_title: productTitle || 'Item Service Support',
          user_email: user.email,
          user_name: user.name || 'Rahul Sharma',
          issue_description: issueDescription,
          priority: priority.toUpperCase(),
          status: 'OPEN',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Maintenance ticket created! On-site technician visit assigned within 24 hours.',
        data,
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('API maintenance error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
