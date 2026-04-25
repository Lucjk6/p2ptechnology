const Redis = require('ioredis');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, connectTimeout: 5000 });
  }
  return redis;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.REDIS_URL) {
    return res.status(200).json({ ok: true, note: 'Redis not configured' });
  }

  var referrer = '';
  try { referrer = req.body && req.body.referrer ? req.body.referrer : ''; } catch (e) {}

  var source = 'direct';
  if (referrer) {
    var r = referrer.toLowerCase();
    if (r.indexOf('instagram') !== -1 || r.indexOf('l.instagram') !== -1) source = 'instagram';
    else if (r.indexOf('google') !== -1) source = 'google';
    else if (r.indexOf('facebook') !== -1 || r.indexOf('fb.') !== -1) source = 'facebook';
    else if (r.indexOf('tiktok') !== -1) source = 'tiktok';
    else if (r.indexOf('linkedin') !== -1) source = 'linkedin';
    else source = 'other';
  }

  var today = new Date().toISOString().split('T')[0];

  try {
    var r = getRedis();
    var pipe = r.pipeline();
    pipe.incr('visits:total');
    pipe.incr('visits:' + today);
    pipe.incr('ref:' + source);
    pipe.incr('ref:' + source + ':' + today);
    await pipe.exec();
  } catch (e) {}

  res.status(200).json({ ok: true });
};
