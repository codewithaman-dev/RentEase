import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return res.status(200).json({ success: false, error: 'Unauthenticated' });
    }

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const nowInSecs = Math.floor(Date.now() / 1000);

    // 24-hour clock skew grace buffer (86400s)
    if (!decoded || (decoded.exp + 86400) < nowInSecs) {
      return res.status(200).json({ success: false, error: 'Session expired' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, created_at')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(200).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(200).json({ success: false, error: 'Invalid session token' });
  }
}
