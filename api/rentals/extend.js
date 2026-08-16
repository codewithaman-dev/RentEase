import supabase from '../db-client.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const user = checkAuth(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    const { rentalId, extendMonths = 6 } = req.body || {};

    if (!rentalId) {
      return res.status(400).json({ success: false, error: 'Rental ID required' });
    }

    const { data: rental, error: fetchErr } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', rentalId)
      .single();

    if (fetchErr || !rental) {
      return res.status(404).json({ success: false, error: 'Rental order not found' });
    }

    const newTenure = Number(rental.tenure_months || 6) + Number(extendMonths);
    const { data: updated, error: updateErr } = await supabase
      .from('rentals')
      .update({
        tenure_months: newTenure,
        next_billing_date: '2025-05-25',
      })
      .eq('id', rentalId)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return res.status(200).json({
      success: true,
      message: `Rental tenure extended by ${extendMonths} months!`,
      data: updated,
    });
  } catch (err) {
    console.error('Rental extend error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
