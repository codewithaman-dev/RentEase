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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const admin = checkAdminRole(req);
  if (!admin) {
    return res.status(403).json({ success: false, error: 'Forbidden: Admin role required' });
  }

  try {
    if (req.method === 'GET') {
      const { role, search } = req.query;
      let query = supabase.from('users').select('id, name, email, phone, role, created_at');

      if (role && role !== 'all') {
        query = query.eq('role', role.toUpperCase());
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'PUT') {
      const { userId, name, email, phone, role } = req.body || {};

      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID required' });
      }

      const updates = {};
      if (name) updates.name = name.trim();
      if (email) updates.email = email.toLowerCase().trim();
      if (phone) updates.phone = phone.trim();
      if (role) updates.role = role.toUpperCase();

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select('id, name, email, phone, role, created_at')
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'User updated successfully', data });
    }

    if (req.method === 'DELETE') {
      const { userId } = req.body || {};

      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID required' });
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'User account deleted permanently' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin users API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
