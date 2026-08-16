import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { user_email, rental_id } = req.query;
      let query = supabase.from('maintenance_tickets').select('*');

      if (user_email) {
        query = query.eq('user_email', user_email);
      }
      if (rental_id) {
        query = query.eq('rental_id', rental_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const ticket = req.body;
      const { data, error } = await supabase
        .from('maintenance_tickets')
        .insert(ticket)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status, technician_notes, resolved_at } = req.body;
      const updates = {};
      if (status) updates.status = status;
      if (technician_notes) updates.technician_notes = technician_notes;
      if (resolved_at) updates.resolved_at = resolved_at;

      const { data, error } = await supabase
        .from('maintenance_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API tickets error:', err);
    return res.status(500).json({ error: err.message });
  }
}
