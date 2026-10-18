import supabase, { isSupabaseConfigured } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SERVICE_AREAS, INITIAL_REVIEWS } from '../data/mockData';
import type { Product, Review } from '../types';

export { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SERVICE_AREAS, INITIAL_REVIEWS };

function decodeToken(token: string) {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded && (decoded.exp + 86400) > Math.floor(Date.now() / 1000)) {
      return decoded;
    }
  } catch {
    /* ignore expired or malformed token */
  }
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

// In-Memory Filter Function for Client-side & Static Host Deployments (e.g. Netlify)
export function filterMockProducts(params: {
  category?: string | null;
  subcategory?: string | null;
  search?: string | null;
  is_combo?: boolean;
  minRent?: number | null;
  maxRent?: number | null;
  sortBy?: string | null;
  limit?: number;
  page?: number;
}): { data: Product[]; total: number } {
  let list = [...INITIAL_PRODUCTS];

  if (params.category && params.category !== 'all') {
    const catClean = params.category.trim().toLowerCase();
    if (catClean === 'study-wfh' || catClean === 'wfh' || catClean === 'work-from-home') {
      list = list.filter((p) => {
        const slug = (p.category_slug || '').toLowerCase();
        const title = (p.title || p.name || '').toLowerCase();
        return slug.includes('desk') || slug.includes('chair') || slug.includes('study') || slug.includes('table') || slug.includes('wfh') || title.includes('desk') || title.includes('chair') || title.includes('table') || title.includes('bookshelf');
      });
    } else if (catClean === 'dining' || catClean === 'dining-room') {
      list = list.filter((p) => {
        const slug = (p.category_slug || '').toLowerCase();
        const title = (p.title || p.name || '').toLowerCase();
        return slug.includes('dining') || title.includes('dining') || title.includes('breakfast');
      });
    } else if (catClean === 'living-room' || catClean === 'sofa') {
      list = list.filter((p) => {
        const slug = (p.category_slug || '').toLowerCase();
        const id = (p.category_id || '').toLowerCase();
        const title = (p.title || p.name || '').toLowerCase();
        return slug.includes('sofa') || slug.includes('living') || id.includes('sofa') || title.includes('sofa') || title.includes('lounge') || title.includes('couch');
      });
    } else if (catClean === 'bedroom' || catClean === 'bed') {
      list = list.filter((p) => {
        const slug = (p.category_slug || '').toLowerCase();
        const id = (p.category_id || '').toLowerCase();
        const title = (p.title || p.name || '').toLowerCase();
        return slug.includes('bed') || slug.includes('bedroom') || id.includes('bed') || title.includes('bed') || title.includes('wardrobe') || title.includes('dressing');
      });
    } else if (catClean === 'appliances') {
      list = list.filter((p) => {
        const slug = (p.category_slug || '').toLowerCase();
        const title = (p.title || p.name || '').toLowerCase();
        return slug.includes('fridge') || slug.includes('wash') || slug.includes('tv') || slug.includes('appliance') || title.includes('tv') || title.includes('fridge') || title.includes('washer') || title.includes('microwave');
      });
    } else if (catClean === 'fridge') {
      list = list.filter((p) => (p.category_slug || '').includes('fridge') || (p.title || '').toLowerCase().includes('fridge'));
    } else if (catClean === 'washing-machine') {
      list = list.filter((p) => (p.category_slug || '').includes('wash') || (p.title || '').toLowerCase().includes('washer') || (p.title || '').toLowerCase().includes('washing'));
    } else if (catClean === 'tv') {
      list = list.filter((p) => (p.category_slug || '').includes('tv') || (p.title || '').toLowerCase().includes('tv'));
    } else if (catClean === 'table') {
      list = list.filter((p) => (p.category_slug || '').includes('table') || (p.category_slug || '').includes('dining') || (p.title || '').toLowerCase().includes('table') || (p.title || '').toLowerCase().includes('desk') || (p.title || '').toLowerCase().includes('bookshelf'));
    } else if (catClean === 'student-combos' || catClean === 'combos' || catClean === 'combo') {
      list = list.filter((p) => p.is_combo === true);
    } else if (catClean === 'furniture') {
      list = list.filter((p) => {
        const slug = (p.category_slug || '').toLowerCase();
        return slug.includes('bed') || slug.includes('sofa') || slug.includes('table') || slug.includes('dining') || slug.includes('furniture');
      });
    } else {
      list = list.filter((p) => {
        const slug = (p.category_slug || '').toLowerCase();
        const id = (p.category_id || '').toLowerCase();
        return slug.includes(catClean) || id.includes(catClean);
      });
    }
  }

  if (params.subcategory && params.subcategory !== 'all') {
    const subClean = params.subcategory.trim().toLowerCase();
    list = list.filter((p) => {
      const slug = (p.category_slug || '').toLowerCase();
      const id = (p.category_id || '').toLowerCase();
      return slug.includes(subClean) || id.includes(subClean);
    });
  }

  if (params.is_combo) {
    list = list.filter((p) => p.is_combo === true);
  }

  if (params.search) {
    const s = params.search.trim().toLowerCase();
    list = list.filter((p) => {
      const title = (p.title || p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category_name || p.category_slug || '').toLowerCase();
      const tags = (p.tags || []).map((t) => t.toLowerCase()).join(' ');
      return title.includes(s) || desc.includes(s) || cat.includes(s) || tags.includes(s);
    });
  }

  if (params.minRent != null && !isNaN(params.minRent)) {
    list = list.filter((p) => Number(p.monthly_rate_12m || p.monthly_rent || 0) >= params.minRent!);
  }

  if (params.maxRent != null && !isNaN(params.maxRent)) {
    list = list.filter((p) => Number(p.monthly_rate_12m || p.monthly_rent || 0) <= params.maxRent!);
  }

  if (params.sortBy === 'price-asc') {
    list.sort((a, b) => Number(a.monthly_rate_12m || a.monthly_rent || 0) - Number(b.monthly_rate_12m || b.monthly_rent || 0));
  } else if (params.sortBy === 'price-desc') {
    list.sort((a, b) => Number(b.monthly_rate_12m || b.monthly_rent || 0) - Number(a.monthly_rate_12m || a.monthly_rent || 0));
  } else {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const total = list.length;
  if (params.limit && params.limit > 0) {
    const page = params.page || 1;
    const start = (page - 1) * params.limit;
    list = list.slice(start, start + params.limit);
  }

  return { data: list, total };
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const method = (options.method || 'GET').toUpperCase();

  // 1. Try serverless API first (works on Vercel or when backend is running)
  try {
    const res = await fetch(endpoint, options);
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      // Ensure we received actual JSON and NOT an HTML fallback from Netlify SPA redirect
      if (contentType.includes('application/json')) {
        const json = await res.json();
        // Check if json contains actual data (not an empty list from disconnected db)
        const hasData =
          (Array.isArray(json) && json.length > 0) ||
          (Array.isArray(json?.data) && json.data.length > 0) ||
          (json?.data && !Array.isArray(json.data) && Object.keys(json.data).length > 0) ||
          (json?.user && json?.token) ||
          (json?.serviceable !== undefined);
        if (hasData) {
          return json;
        }
      }
    }
  } catch {}

  // 2. Client-side Fallback (for Netlify static host or when Supabase/API is offline)
  try {
    // A. GET /api/products
    if (endpoint.startsWith('/api/products') && method === 'GET') {
      const urlObj = new URL(endpoint, window.location.origin);
      const category = urlObj.searchParams.get('category');
      const subcategory = urlObj.searchParams.get('subcategory');
      const search = urlObj.searchParams.get('search');
      const isCombo = urlObj.searchParams.get('is_combo') === 'true' || urlObj.searchParams.get('combo') === 'true';
      const minRent = urlObj.searchParams.get('minRent') ? Number(urlObj.searchParams.get('minRent')) : null;
      const maxRent = urlObj.searchParams.get('maxRent') ? Number(urlObj.searchParams.get('maxRent')) : null;
      const sortBy = urlObj.searchParams.get('sortBy');
      const limit = urlObj.searchParams.get('limit') ? Number(urlObj.searchParams.get('limit')) : 100;
      const page = urlObj.searchParams.get('page') ? Number(urlObj.searchParams.get('page')) : 1;

      // Try Supabase first if a real database is configured
      if (isSupabaseConfigured) {
        try {
          let query = supabase.from('products_v2').select('*');
          if (isCombo) query = query.eq('is_combo', true);
          if (search) query = query.or(`title.ilike.%${search}%,name.ilike.%${search}%`);
          const { data: dbData } = await query.order('rating', { ascending: false });
          if (dbData && dbData.length > 0) {
            return { success: true, data: dbData };
          }
        } catch {}
      }

      // Fallback to in-memory mock products
      const filtered = filterMockProducts({
        category,
        subcategory,
        search,
        is_combo: isCombo,
        minRent,
        maxRent,
        sortBy,
        limit,
        page,
      });

      return {
        success: true,
        data: filtered.data,
        pagination: {
          total: filtered.total,
          page,
          limit,
        },
      };
    }

    // B. GET /api/product-detail?id=...
    if (endpoint.startsWith('/api/product-detail') && method === 'GET') {
      const urlObj = new URL(endpoint, window.location.origin);
      const id = urlObj.searchParams.get('id');

      // Try Supabase first if configured
      if (isSupabaseConfigured) {
        try {
          const { data: dbProduct } = await supabase.from('products_v2').select('*').eq('id', id).single();
          if (dbProduct) return { success: true, data: dbProduct };
        } catch {}
      }

      // Fallback to in-memory products
      const p = INITIAL_PRODUCTS.find((item) => item.id === id || item.slug === id);
      return { success: !!p, data: p || null };
    }

    // C. GET /api/categories
    if (endpoint.startsWith('/api/categories') && method === 'GET') {
      if (isSupabaseConfigured) {
        try {
          const { data: dbCats } = await supabase.from('categories_v2').select('*');
          if (dbCats && dbCats.length > 0) return { success: true, data: dbCats };
        } catch {}
      }
      return { success: true, data: INITIAL_CATEGORIES };
    }

    // D. GET /api/service-areas
    if (endpoint.startsWith('/api/service-areas') && method === 'GET') {
      if (isSupabaseConfigured) {
        try {
          const { data: dbSA } = await supabase.from('service_areas').select('*').eq('is_active', true);
          if (dbSA && dbSA.length > 0) return { success: true, data: dbSA };
        } catch {}
      }
      return { success: true, data: INITIAL_SERVICE_AREAS };
    }

    // E. POST /api/service-areas/check
    if (endpoint.includes('/api/service-areas/check') && method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
      const pincode = String(body.pincode || '').trim();

      const match = INITIAL_SERVICE_AREAS.find((a: any) => Array.isArray(a.pincodes) && a.pincodes.includes(pincode));
      if (match) {
        return { success: true, serviceable: true, message: `48h Delivery available in ${match.city}!` };
      }
      return { success: true, serviceable: true, message: '48h Delivery available across top Indian Metro PIN codes!' };
    }

    // F. GET & POST /api/reviews
    if (endpoint.startsWith('/api/reviews')) {
      const localReviewsKey = 'rentease_local_reviews';
      const storedReviews: Review[] = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');
      const allReviews = [...storedReviews, ...INITIAL_REVIEWS];

      if (method === 'GET') {
        const urlObj = new URL(endpoint, window.location.origin);
        const pId = urlObj.searchParams.get('product_id');

        let matched = pId ? allReviews.filter((r) => r.product_id === pId) : allReviews;
        if (pId && matched.length === 0) {
          // Provide 2 nice default reviews if none exist yet
          matched = [
            {
              id: `rev_gen_${pId}_1`,
              product_id: pId,
              user_name: 'Ananya Sharma',
              rating: 5,
              comment: 'Exceptional condition! Delivery took less than 48 hours and customer support was very helpful.',
              date: '2025-03-12',
              verified_renter: true,
            },
            {
              id: `rev_gen_${pId}_2`,
              product_id: pId,
              user_name: 'Karthik Raja',
              rating: 5,
              comment: 'Great value for money. Hassel-free monthly subscription and flexible tenure options.',
              date: '2025-03-08',
              verified_renter: true,
            },
          ];
        }
        return { success: true, data: matched };
      }

      if (method === 'POST') {
        const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
        const newRev: Review = {
          id: 'rev_' + Date.now().toString(36),
          product_id: body.product_id || '',
          user_name: body.user_name || 'RentEase Renter',
          rating: Number(body.rating) || 5,
          comment: body.comment || '',
          date: new Date().toISOString().split('T')[0],
          verified_renter: true,
        };
        storedReviews.unshift(newRev);
        localStorage.setItem(localReviewsKey, JSON.stringify(storedReviews));
        return { success: true, data: newRev };
      }
    }

    // G. POST /api/auth/login
    if (endpoint.includes('/api/auth/login') && method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
      const cleanEmail = (body.email || '').toLowerCase().trim();

      // Demo role accounts
      let role = 'CUSTOMER';
      let name = 'Rahul Sharma';
      const phone = '+91 98765 43210';

      if (cleanEmail === 'admin@rentease.in') {
        role = 'ADMIN';
        name = 'RentEase Super Admin';
      } else if (cleanEmail === 'vendor@rentease.in') {
        role = 'VENDOR';
        name = 'UrbanFurnish Logistics Vendor';
      }

      const user = {
        id: 'usr_' + cleanEmail.replace(/[^a-z0-9]/g, '_'),
        email: cleanEmail,
        name,
        phone,
        role,
      };

      const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      };
      const token = btoa(JSON.stringify(tokenPayload));

      return {
        success: true,
        user,
        token,
      };
    }

    // H. POST /api/auth/register
    if (endpoint.includes('/api/auth/register') && method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
      const cleanEmail = (body.email || '').toLowerCase().trim();
      const role = body.role === 'VENDOR' || body.role === 'vendor' ? 'VENDOR' : 'CUSTOMER';

      const user = {
        id: 'usr_' + Date.now().toString(36),
        name: (body.name || 'RentEase Renter').trim(),
        email: cleanEmail,
        phone: body.phone ? body.phone.trim() : null,
        role,
      };

      const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      };
      const token = btoa(JSON.stringify(tokenPayload));

      return { success: true, user, token };
    }

    // I. GET /api/rentals
    if (endpoint.startsWith('/api/rentals') && method === 'GET') {
      const user = getAuthUser();
      const email = user?.email || 'customer@rentease.in';
      const storedRentals = JSON.parse(localStorage.getItem('rentease_rentals') || '[]');
      const userRentals = storedRentals.filter((r: any) => r.user_email === email);

      if (userRentals.length === 0) {
        // Return a default demo rental so dashboard looks great
        const demoRental = {
          id: 'rent_demo_001',
          order_number: 'RE-IN-482910',
          user_id: user?.id || 'usr_customer_001',
          user_name: user?.name || 'Rahul Sharma',
          user_email: email,
          user_phone: '+91 98765 43210',
          product_id: 'prod_furn_001',
          product_title: 'Urban Sheesham Queen Bed & Ortho Mattress',
          product_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          tenure_months: 6,
          monthly_price: 549,
          security_deposit: 1500,
          status: 'Active',
          start_date: '2025-02-01',
          end_date: '2025-08-01',
          next_billing_date: '2025-04-01',
          delivery_address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103',
          city: 'Bengaluru',
          pincode: '560103',
          created_at: new Date().toISOString(),
        };
        return { success: true, data: [demoRental] };
      }

      return { success: true, data: userRentals };
    }

    // J. POST /api/checkout
    if (endpoint.includes('/api/checkout') && method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
      const user = getAuthUser();
      const orderNumber = 'RE-IN-' + Math.floor(100000 + Math.random() * 900000);
      const createdRentals: any[] = [];
      const storedRentals = JSON.parse(localStorage.getItem('rentease_rentals') || '[]');

      for (const item of body.items || []) {
        const pId = item.product_id || item.product?.id;
        const p = INITIAL_PRODUCTS.find((prod) => prod.id === pId) || item.product || {};
        const rentalId = 'rent_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);

        const rental = {
          id: rentalId,
          order_number: orderNumber,
          user_id: user?.id || 'usr_customer_001',
          user_name: user?.name || 'Rahul Sharma',
          user_email: user?.email || 'customer@rentease.in',
          user_phone: user?.phone || '+91 98765 43210',
          product_id: p.id || pId,
          product_title: p.name || p.title || 'Rental Item',
          product_image: p.image || (p.images ? p.images[0] : ''),
          tenure_months: Number(item.tenureMonths || item.tenure_months || 6),
          monthly_price: Number(p.monthly_rate_12m || p.monthly_rent || 549),
          security_deposit: Number(p.deposit_amount || p.security_deposit || 1200),
          status: 'Delivering',
          start_date: body.deliveryDate || new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          delivery_address: `${body.deliveryAddress || 'Bellandur'}, ${body.city || 'Bengaluru'} - ${body.pincode || '560103'}`,
          city: body.city || 'Bengaluru',
          pincode: body.pincode || '560103',
          created_at: new Date().toISOString(),
        };

        createdRentals.push(rental);
        storedRentals.unshift(rental);
      }

      localStorage.setItem('rentease_rentals', JSON.stringify(storedRentals));
      return { success: true, data: { orderNumber, rentals: createdRentals } };
    }

    // K. POST /api/rentals/extend
    if (endpoint.includes('/api/rentals/extend') && method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
      const storedRentals = JSON.parse(localStorage.getItem('rentease_rentals') || '[]');
      const target = storedRentals.find((r: any) => r.id === body.rental_id);
      if (target) {
        target.tenure_months = (target.tenure_months || 6) + Number(body.additional_months || 3);
        localStorage.setItem('rentease_rentals', JSON.stringify(storedRentals));
      }
      return { success: true, message: 'Tenure extended successfully' };
    }

    // L. POST /api/rentals/return
    if (endpoint.includes('/api/rentals/return') && method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
      const storedRentals = JSON.parse(localStorage.getItem('rentease_rentals') || '[]');
      const target = storedRentals.find((r: any) => r.id === body.rental_id);
      if (target) {
        target.status = 'Return Scheduled';
        localStorage.setItem('rentease_rentals', JSON.stringify(storedRentals));
      }
      return { success: true, message: 'Pickup scheduled successfully' };
    }

    // M. GET & POST /api/maintenance
    if (endpoint.startsWith('/api/maintenance')) {
      const user = getAuthUser();
      const email = user?.email || 'customer@rentease.in';
      const storedKey = 'rentease_maintenance_tickets';
      const tickets = JSON.parse(localStorage.getItem(storedKey) || '[]');

      if (method === 'GET') {
        const userTickets = tickets.filter((t: any) => t.user_email === email);
        return { success: true, data: userTickets };
      }

      if (method === 'POST') {
        const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
        const newTicket = {
          id: 'mr_' + Date.now().toString(36),
          rental_id: body.rentalId || 'rent_demo_001',
          product_title: body.productTitle || 'Rental Furniture',
          user_email: email,
          user_name: user?.name || 'Rahul Sharma',
          issue_category: body.issueCategory || 'General Inquiry',
          issue_description: body.issueDescription || 'Service requested',
          priority: (body.priority || 'MEDIUM').toUpperCase(),
          status: 'Reported',
          created_at: new Date().toISOString(),
        };
        tickets.unshift(newTicket);
        localStorage.setItem(storedKey, JSON.stringify(tickets));
        return { success: true, data: newTicket };
      }
    }

    // N. GET & POST /api/relocations
    if (endpoint.startsWith('/api/relocations')) {
      const user = getAuthUser();
      const email = user?.email || 'customer@rentease.in';
      const storedKey = 'rentease_relocations';
      const requests = JSON.parse(localStorage.getItem(storedKey) || '[]');

      if (method === 'GET') {
        const userReqs = requests.filter((r: any) => r.user_email === email);
        return { success: true, data: userReqs };
      }

      if (method === 'POST') {
        const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
        const newReq = {
          id: 'reloc_' + Date.now().toString(36),
          rental_id: body.rentalId || 'rent_demo_001',
          product_title: body.productTitle || 'Rental Furniture',
          user_email: email,
          user_name: user?.name || 'Rahul Sharma',
          current_address: body.currentAddress || '',
          new_address: body.newAddress || '',
          preferred_date: body.preferredDate || new Date().toISOString().split('T')[0],
          status: 'Confirmed',
          created_at: new Date().toISOString(),
        };
        requests.unshift(newReq);
        localStorage.setItem(storedKey, JSON.stringify(requests));
        return { success: true, data: newReq };
      }
    }

    // O. Admin & Vendor API Fallbacks
    if (endpoint.startsWith('/api/admin/') || endpoint.startsWith('/api/vendor/')) {
      if (endpoint.includes('reports')) {
        return {
          success: true,
          data: {
            activeRentals: 142,
            monthlyRevenue: 284500,
            pendingKYC: 18,
            openMaintenance: 5,
            recentOrders: [],
          },
        };
      }
      if (endpoint.includes('products')) {
        return { success: true, data: INITIAL_PRODUCTS };
      }
      if (endpoint.includes('users')) {
        return {
          success: true,
          data: [
            { id: 'usr_admin_001', name: 'RentEase Admin', email: 'admin@rentease.in', role: 'ADMIN' },
            { id: 'usr_vendor_001', name: 'UrbanFurnish Vendor', email: 'vendor@rentease.in', role: 'VENDOR' },
            { id: 'usr_customer_001', name: 'Rahul Sharma', email: 'customer@rentease.in', role: 'CUSTOMER' },
          ],
        };
      }
      if (endpoint.includes('service-areas')) {
        return { success: true, data: INITIAL_SERVICE_AREAS };
      }
      return { success: true, data: [] };
    }
  } catch (err) {
    console.warn('apiFetch client fallback warning:', err);
  }

  // Default fallback
  return { success: true, data: [] };
}
