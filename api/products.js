import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category, subcategory, minRent, maxRent, search, is_combo, sortBy, page = 1, limit = 100 } = req.query;

      let query = supabase.from('products_v2').select('*', { count: 'exact' });

      // Smart Category Mapping for Footer & Navbar Links
      if (category && category !== 'all') {
        const catClean = category.trim().toLowerCase();

        if (catClean === 'study-wfh' || catClean === 'wfh' || catClean === 'work-from-home') {
          query = query.or('category_slug.ilike.%desk%,category_slug.ilike.%chair%,category_slug.ilike.%study%,category_slug.ilike.%table%,category_slug.ilike.%bookshelf%,category_slug.ilike.%wfh%');
        } else if (catClean === 'dining' || catClean === 'dining-room') {
          query = query.or('category_slug.ilike.%dining%');
        } else if (catClean === 'living-room' || catClean === 'sofa') {
          query = query.or('category_slug.ilike.%sofa%,category_slug.ilike.%living%,category_id.ilike.%sofa%');
        } else if (catClean === 'bedroom' || catClean === 'bed') {
          query = query.or('category_slug.ilike.%bed%,category_slug.ilike.%bedroom%,category_id.ilike.%bed%');
        } else if (catClean === 'appliances' || catClean === 'fridge' || catClean === 'washing-machine' || catClean === 'tv') {
          query = query.or('category_slug.ilike.%fridge%,category_slug.ilike.%wash%,category_slug.ilike.%tv%,category_slug.ilike.%appliance%');
        } else if (catClean === 'student-combos' || catClean === 'combos') {
          query = query.eq('is_combo', true);
        } else if (catClean === 'furniture') {
          query = query.or('category_slug.ilike.%bed%,category_slug.ilike.%sofa%,category_slug.ilike.%table%,category_slug.ilike.%dining%,category_slug.ilike.%furniture%');
        } else {
          query = query.or(`category_slug.ilike.%${catClean}%,category_id.ilike.%${catClean}%`);
        }
      }

      if (subcategory && subcategory !== 'all') {
        const subClean = subcategory.trim().toLowerCase();
        query = query.or(`category_slug.ilike.%${subClean}%,category_id.ilike.%${subClean}%`);
      }

      if (is_combo === 'true') {
        query = query.eq('is_combo', true);
      }

      if (minRent) {
        query = query.gte('monthly_rate_12m', Number(minRent));
      }

      if (maxRent) {
        query = query.lte('monthly_rate_12m', Number(maxRent));
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (sortBy === 'price-asc') {
        query = query.order('monthly_rate_12m', { ascending: true });
      } else if (sortBy === 'price-desc') {
        query = query.order('monthly_rate_12m', { ascending: false });
      } else {
        query = query.order('rating', { ascending: false });
      }

      const from = (Number(page) - 1) * Number(limit);
      const to = from + Number(limit) - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: data || [],
        pagination: {
          total: count || (data ? data.length : 0),
          page: Number(page),
          limit: Number(limit),
        },
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('API products error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
