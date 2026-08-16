import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { slug, id } = req.query;

    if (!slug && !id) {
      return res.status(400).json({ success: false, error: 'Slug or product ID is required' });
    }

    let query = supabase.from('products_v2').select('*');
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', slug);
    }

    const { data: product, error } = await query.single();
    if (error || !product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Fetch tenure plans for this product
    const { data: tenurePlans } = await supabase
      .from('tenure_plans')
      .select('*')
      .eq('product_id', product.id)
      .order('months', { ascending: true });

    return res.status(200).json({
      success: true,
      data: {
        ...product,
        tenurePlans: tenurePlans || [
          { months: 3, monthlyRent: product.monthly_rate_3m || product.monthly_rent * 1.3 },
          { months: 6, monthlyRent: product.monthly_rate_6m || product.monthly_rent * 1.15 },
          { months: 9, monthlyRent: Math.round(product.monthly_rate_12m * 1.08) },
          { months: 12, monthlyRent: product.monthly_rate_12m || product.monthly_rent },
        ],
      },
    });
  } catch (err) {
    console.error('API product detail error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
