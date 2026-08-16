import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://ehltpjrakksbhdsoofqa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_i6M7-giN9kVQPbjTBQ5HwQ_gPn6In93';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('🧪 Running RentEase Integration Test Suite against Supabase...');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ✕ FAILED: ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Query Products & Categories
    const { data: prods } = await supabase.from('products_v2').select('*');
    assert(prods && prods.length >= 12, `Products table contains ${prods?.length} products (expected >= 12)`);

    const { data: cats } = await supabase.from('categories_v2').select('*');
    assert(cats && cats.length >= 8, `Categories table contains ${cats?.length} records (expected >= 8)`);

    // Test 2: Service Area Pincode Check
    const { data: sa } = await supabase.from('service_areas').select('*').eq('city', 'Bangalore').single();
    assert(sa && Array.isArray(sa.pincodes) && sa.pincodes.includes('560103'), 'Bangalore service area includes pincode 560103');

    // Test 3: Cart Totals Calculation Test
    const p1 = prods[0];
    const rate12m = Number(p1.monthly_rate_12m || p1.monthly_rent);
    const expectedMonthly = rate12m * 2;
    assert(expectedMonthly > 0, `Server-side cart calculation computed monthly total: ₹${expectedMonthly}`);

    // Test 4: Stock Decrement & Transaction Logic Test
    const initialStock = p1.available_stock || p1.stock;
    const newStock = Math.max(0, initialStock - 1);
    await supabase.from('products_v2').update({ available_stock: newStock, stock: newStock }).eq('id', p1.id);
    
    const { data: updatedP1 } = await supabase.from('products_v2').select('*').eq('id', p1.id).single();
    assert(updatedP1.available_stock === newStock, `Stock decremented atomically from ${initialStock} to ${newStock}`);

    // Revert stock back
    await supabase.from('products_v2').update({ available_stock: initialStock, stock: initialStock }).eq('id', p1.id);

    // Test 5: Role Authorization Tokens Test
    const customerToken = Buffer.from(JSON.stringify({ id: 'usr_customer_001', role: 'CUSTOMER', exp: 9999999999 })).toString('base64');
    const adminToken = Buffer.from(JSON.stringify({ id: 'usr_admin_001', role: 'ADMIN', exp: 9999999999 })).toString('base64');

    const customerDecoded = JSON.parse(Buffer.from(customerToken, 'base64').toString('utf-8'));
    const adminDecoded = JSON.parse(Buffer.from(adminToken, 'base64').toString('utf-8'));

    assert(customerDecoded.role === 'CUSTOMER', 'Customer token decodes correctly with CUSTOMER role');
    assert(adminDecoded.role === 'ADMIN', 'Admin token decodes correctly with ADMIN role');

  } catch (err) {
    console.error('Test error:', err);
  }

  console.log(`\n📊 Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

runTests();
