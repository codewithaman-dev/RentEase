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
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'PUT') {
      const { requestId, status, technicianNotes, priority } = req.body || {};
      const updates = {};
      if (status) updates.status = status.toUpperCase();
      if (technicianNotes) updates.technician_notes = technicianNotes;
      if (priority) updates.priority = priority.toUpperCase();
      if (status === 'RESOLVED') updates.resolved_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'DELETE') {
      const { requestId } = req.body || {};
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Maintenance ticket deleted' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin maintenance API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
