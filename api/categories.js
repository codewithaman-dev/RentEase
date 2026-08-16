import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('categories_v2')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      // Group parent and subcategories
      const parents = data.filter((c) => !c.parent_id);
      const categoriesWithSub = parents.map((parent) => ({
        ...parent,
        subcategories: data.filter((c) => c.parent_id === parent.id),
      }));

      return res.status(200).json({
        success: true,
        data: categoriesWithSub.length > 0 ? categoriesWithSub : data,
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('API categories error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
