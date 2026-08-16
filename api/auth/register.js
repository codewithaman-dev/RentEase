import crypto from 'crypto';
import supabase from '../db-client.js';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, city, pincode, password, role = 'CUSTOMER' } = req.body || {};

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters long' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long' });
    }

    const validRole = (role === 'VENDOR' || role === 'vendor') ? 'VENDOR' : 'CUSTOMER';
    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .single();

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists' });
    }

    const passwordHash = hashPassword(password);
    const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    const newUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : null,
      password_hash: passwordHash,
      role: validRole,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select('id, name, email, phone, role, created_at')
      .single();

    if (error) throw error;

    // Create address entry if city/pincode provided
    if (city || pincode) {
      await supabase.from('addresses').insert({
        id: 'addr_' + Date.now().toString(36),
        user_id: data.id,
        line1: 'Primary Address',
        city: city || 'Bengaluru',
        state: 'Karnataka',
        pincode: pincode || '560103',
        is_default: true,
      });
    }

    // Create session token
    const tokenPayload = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    res.setHeader('Set-Cookie', `rentease_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      user: data,
      token,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Registration failed' });
  }
}
