import supabase from './supabase';

function decodeToken(token: string) {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded && (decoded.exp + 86400) > Math.floor(Date.now() / 1000)) {
      return decoded;
    }
  } catch {}
  return null;
}

function getAuthUser() {
  const token = localStorage.getItem('rentease_token');
  if (token) {
    const decoded = decodeToken(token);
    if (decoded) return decoded;
  }
  return null;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const method = (options.method || 'GET').toUpperCase();

  // Try serverless API first
  try {
    const res = await fetch(endpoint, options);
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json && json.success !== undefined) {
          return json;
        }
      }
    }
  } catch {}

  
  // 1. GET /api/products
  if (endpoint.startsWith('/api/products') && method === 'GET') {
    const urlObj = new URL(endpoint, window.location.origin);
    const category = urlObj.searchParams.get('category');
    const search = urlObj.searchParams.get('search');
    const isCombo = urlObj.searchParams.get('is_combo') === 'true';

    let query = supabase.from('products_v2').select('*');

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

    if (isCombo) query = query.eq('is_combo', true);
    if (search) query = query.or(`title.ilike.%${search}%,name.ilike.%${search}%`);

    const { data } = await query.order('rating', { ascending: false });
    return { success: true, data: data || [] };
  }

  // 2. GET /api/product-detail?id=...
  if (endpoint.startsWith('/api/product-detail') && method === 'GET') {
    const urlObj = new URL(endpoint, window.location.origin);
    const id = urlObj.searchParams.get('id');
    const { data } = await supabase.from('products_v2').select('*').eq('id', id).single();
    return { success: true, data };
  }

  // 3. GET /api/categories
  if (endpoint.startsWith('/api/categories') && method === 'GET') {
    const { data } = await supabase.from('categories_v2').select('*');
    return { success: true, data: data || [] };
  }

  // 4. GET /api/service-areas
  if (endpoint.startsWith('/api/service-areas') && method === 'GET') {
    const { data } = await supabase.from('service_areas').select('*').eq('is_active', true);
    return { success: true, data: data || [] };
  }

  // 5. POST /api/service-areas/check
  if (endpoint.includes('/api/service-areas/check') && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
    const pincode = String(body.pincode || '').trim();
    const { data: areas } = await supabase.from('service_areas').select('*').eq('is_active', true);
    const match = (areas || []).find((a) => Array.isArray(a.pincodes) && a.pincodes.includes(pincode));
    if (match) {
      return { success: true, serviceable: true, message: `48h Delivery available in ${match.city}!` };
    }
    return { success: true, serviceable: true, message: '48h Delivery available across top Indian Metro PIN codes!' };
  }

  // 6. POST /api/auth/login
  if (endpoint.includes('/api/auth/login') && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
    const cleanEmail = (body.email || '').toLowerCase().trim();
    const { data: user } = await supabase.from('users').select('*').eq('email', cleanEmail).single();

    if (!user) {
      return { success: false, error: 'Account not found. Please check your email or register.' };
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
    };
    const token = btoa(JSON.stringify(tokenPayload));

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    };
  }

  // 7. POST /api/auth/register
  if (endpoint.includes('/api/auth/register') && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
    const cleanEmail = (body.email || '').toLowerCase().trim();

    // Check existing
    const { data: existing } = await supabase.from('users').select('id').eq('email', cleanEmail).single();
    if (existing) {
      return { success: false, error: 'An account with this email address already exists' };
    }

    const userId = 'usr_' + Date.now().toString(36);
    const role = (body.role === 'VENDOR' || body.role === 'vendor') ? 'VENDOR' : 'CUSTOMER';

    const newUser = {
      id: userId,
      name: (body.name || 'RentEase Renter').trim(),
      email: cleanEmail,
      phone: body.phone ? body.phone.trim() : null,
      password_hash: 'hashed_' + (body.password || 'password123'),
      role,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('users').insert(newUser).select().single();
    if (error) {
      return { success: false, error: error.message };
    }

    const tokenPayload = { id: data.id, email: data.email, name: data.name, role: data.role, exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) };
    const token = btoa(JSON.stringify(tokenPayload));

    return { success: true, user: data, token };
  }

  // 8. GET /api/rentals
  if (endpoint.startsWith('/api/rentals') && method === 'GET') {
    const user = getAuthUser();
    const email = user?.email || 'customer@rentease.in';
    const { data } = await supabase.from('rentals').select('*').eq('user_email', email).order('created_at', { ascending: false });
    return { success: true, data: data || [] };
  }

  // 9. POST /api/checkout
  if (endpoint.includes('/api/checkout') && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
    const user = getAuthUser();
    const orderNumber = 'RE-IN-' + Math.floor(100000 + Math.random() * 900000);
    const createdRentals: any[] = [];

    for (const item of (body.items || [])) {
      const pId = item.product_id || item.product?.id;
      const { data: p } = await supabase.from('products_v2').select('*').eq('id', pId).single();
      const rentalId = 'rent_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);

      const { data: rental } = await supabase.from('rentals').insert({
        id: rentalId,
        order_number: orderNumber,
        user_id: user?.id || 'usr_customer_001',
        user_name: user?.name || 'Rahul Sharma',
        user_email: user?.email || 'customer@rentease.in',
        user_phone: user?.phone || '+91 98765 43210',
        product_id: p.id,
        product_title: p.name || p.title,
        product_image: p.image || (p.images ? p.images[0] : ''),
        tenure_months: Number(item.tenureMonths || item.tenure_months || 6),
        monthly_price: Number(p.monthly_rate_12m || p.monthly_rent || 549),
        security_deposit: Number(p.deposit_amount || p.security_deposit || 1200),
        status: 'Delivering',
        start_date: body.deliveryDate || '2025-03-25',
        next_billing_date: '2025-04-25',
        delivery_address: `${body.deliveryAddress || 'Bellandur'}, ${body.city || 'Bengaluru'} - ${body.pincode || '560103'}`,
        city: body.city || 'Bengaluru',
        pincode: body.pincode || '560103',
        created_at: new Date().toISOString(),
      }).select().single();

      createdRentals.push(rental);

      // Decrement stock
      const newStock = Math.max(0, (p.available_stock || p.stock || 1) - 1);
      await supabase.from('products_v2').update({ available_stock: newStock, stock: newStock }).eq('id', p.id);
    }

    return { success: true, data: { orderNumber, rentals: createdRentals } };
  }

  // 10. GET/POST /api/maintenance
  if (endpoint.startsWith('/api/maintenance')) {
    const user = getAuthUser();
    const email = user?.email || 'customer@rentease.in';

    if (method === 'GET') {
      const { data } = await supabase.from('maintenance_requests').select('*').eq('user_email', email);
      return { success: true, data: data || [] };
    }

    if (method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
      const { data } = await supabase.from('maintenance_requests').insert({
        id: 'mr_' + Date.now().toString(36),
        user_id: user?.id || 'usr_customer_001',
        rental_id: body.rentalId || 'rent_001',
        product_title: body.productTitle || 'Rental Furniture',
        user_email: email,
        user_name: user?.name || 'Rahul Sharma',
        issue_description: body.issueDescription || 'Service requested',
        priority: (body.priority || 'MEDIUM').toUpperCase(),
        status: 'OPEN',
        created_at: new Date().toISOString(),
      }).select().single();

      return { success: true, data };
    }
  }

  // Default fallback empty object
  return { success: true, data: [] };
}
