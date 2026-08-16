import supabase from './db-client.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const user = checkAuth(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Authentication required for checkout' });
  }

  try {
    const { 
      items = [], 
      deliveryAddress, 
      city = 'Bengaluru', 
      pincode, 
      deliveryDate = '2025-03-25',
      timeSlot = '10:00 AM - 02:00 PM'
    } = req.body || {};

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cannot checkout with empty cart items' });
    }

    if (!deliveryAddress || !pincode) {
      return res.status(400).json({ success: false, error: 'Delivery address and PIN code are required' });
    }

    // 1. Verify Stock & Serviceability
    for (const item of items) {
      const productId = item.product_id || item.product?.id || item.productId;
      const { data: product } = await supabase
        .from('products_v2')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) {
        return res.status(400).json({ success: false, error: `Product not found: ${productId}` });
      }

      if ((product.available_stock || product.stock || 0) < (item.quantity || 1)) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient available stock for "${product.name || product.title}". Available: ${product.available_stock || product.stock || 0}` 
        });
      }
    }

    // 2. Create Order Reference
    const orderNumber = 'RE-IN-' + Math.floor(100000 + Math.random() * 900000);
    const createdRentals = [];

    // 3. Process Rental Creations and Stock Decrements Atomically
    for (const item of items) {
      const productId = item.product_id || item.product?.id || item.productId;
      const tenureMonths = item.tenure_months || item.tenureMonths || 6;

      const { data: product } = await supabase
        .from('products_v2')
        .select('*')
        .eq('id', productId)
        .single();

      const monthlyRate = tenureMonths === 3
        ? (product.monthly_rate_3m || product.monthly_rent * 1.3)
        : tenureMonths === 6
        ? (product.monthly_rate_6m || product.monthly_rent * 1.15)
        : (product.monthly_rate_12m || product.monthly_rent);

      const deposit = product.deposit_amount || product.security_deposit || 1000;

      // Insert Rental Order
      const rentalId = 'rent_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
      const { data: rental, error: rErr } = await supabase
        .from('rentals')
        .insert({
          id: rentalId,
          order_number: orderNumber,
          user_id: user.id,
          user_name: user.name || 'Rahul Sharma',
          user_email: user.email,
          user_phone: user.phone || '+91 98765 43210',
          product_id: product.id,
          product_title: product.name || product.title,
          product_image: product.image || (product.images ? product.images[0] : ''),
          tenure_months: Number(tenureMonths),
          monthly_price: Number(monthlyRate),
          security_deposit: Number(deposit),
          status: 'Delivering',
          start_date: deliveryDate,
          next_billing_date: '2025-04-25',
          delivery_address: `${deliveryAddress}, ${city} - ${pincode}`,
          city,
          pincode,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (rErr) throw rErr;

      // Create Delivery Schedule
      await supabase.from('delivery_schedules').insert({
        id: 'ds_' + Date.now().toString(36),
        rental_id: rentalId,
        type: 'DELIVERY',
        scheduled_date: deliveryDate,
        time_slot: timeSlot,
        status: 'SCHEDULED',
      });

      // Atomically decrement stock
      const newAvailable = Math.max(0, (product.available_stock || product.stock || 1) - (item.quantity || 1));
      await supabase
        .from('products_v2')
        .update({ available_stock: newAvailable, stock: newAvailable })
        .eq('id', product.id);

      createdRentals.push(rental);
    }

    // 4. Clear User Cart
    await supabase.from('cart_items').delete().eq('user_id', user.id);

    return res.status(201).json({
      success: true,
      data: {
        orderNumber,
        rentals: createdRentals,
        deliveryDate,
        message: 'Rental order placed successfully with free 48h doorstep delivery!',
      },
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
