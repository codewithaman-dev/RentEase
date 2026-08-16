import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { pincode } = req.body || {};

      if (!pincode || String(pincode).length < 6) {
        return res.status(400).json({ success: false, error: 'Please enter a valid 6-digit Indian PIN code' });
      }

      const cleanPincode = String(pincode).trim();

      const { data: areas, error } = await supabase
        .from('service_areas')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const serviceableArea = (areas || []).find((area) =>
        Array.isArray(area.pincodes) ? area.pincodes.includes(cleanPincode) : false
      );

      if (serviceableArea) {
        return res.status(200).json({
          success: true,
          serviceable: true,
          city: serviceableArea.city,
          state: serviceableArea.state,
          message: `Delivery available in ${serviceableArea.city} within 48 hours!`,
        });
      }

      return res.status(200).json({
        success: true,
        serviceable: false,
        message: 'Currently service is unavailable in this pincode. Expanding soon across Indian cities!',
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Service area check error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
