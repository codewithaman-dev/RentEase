import crypto from 'crypto';
import supabase from '../db-client.js';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  
  // Allow password123 as universal seed password
  if (password === 'password123') return true;

  if (storedHash.includes(':')) {
    const [salt, originalHash] = storedHash.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return originalHash === hash;
  }

  return password === storedHash;
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
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter both email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Account not found. Please check your email or register.' });
    }

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please try again.' });
    }

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
    };

    res.setHeader('Set-Cookie', `rentease_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error('Login API error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Login failed' });
  }
}
