import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { user_email } = req.query;
      let query = supabase.from('relocation_requests').select('*');

      if (user_email) {
        query = query.eq('user_email', user_email);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const requestData = req.body;
      const { data, error } = await supabase
        .from('relocation_requests')
        .insert(requestData)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status, scheduled_time, notes } = req.body;
      const updates = {};
      if (status) updates.status = status;
      if (scheduled_time) updates.scheduled_time = scheduled_time;
      if (notes) updates.notes = notes;

      const { data, error } = await supabase
        .from('relocation_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API relocations error:', err);
    return res.status(500).json({ error: err.message });
  }
}
