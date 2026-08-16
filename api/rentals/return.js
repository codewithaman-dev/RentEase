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
    const { rentalId, pickupDate = '2025-04-15', timeSlot = '10:00 AM - 02:00 PM' } = req.body || {};

    if (!rentalId) {
      return res.status(400).json({ success: false, error: 'Rental ID required' });
    }

    // 1. Update Rental Status
    const { data: rental, error: uErr } = await supabase
      .from('rentals')
      .update({ status: 'RETURN_SCHEDULED' })
      .eq('id', rentalId)
      .select()
      .single();

    if (uErr) throw uErr;

    // 2. Create PICKUP DeliverySchedule
    await supabase.from('delivery_schedules').insert({
      id: 'ds_p_' + Date.now().toString(36),
      rental_id: rentalId,
      type: 'PICKUP',
      scheduled_date: pickupDate,
      time_slot: timeSlot,
      status: 'SCHEDULED',
    });

    return res.status(200).json({
      success: true,
      message: `Item return scheduled for pickup on ${pickupDate}. Refundable deposit will be processed within 48h!`,
      data: rental,
    });
  } catch (err) {
    console.error('Return schedule error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
