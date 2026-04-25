module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var KV_URL = process.env.KV_REST_API_URL;
  var KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({ ok: true, note: 'KV not configured' });
  }

  function kvCmd(args) {
    return fetch(KV_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + KV_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args)
    }).then(function (r) { return r.json(); });
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
    await Promise.all([
      kvCmd(['INCR', 'visits:total']),
      kvCmd(['INCR', 'visits:' + today]),
      kvCmd(['INCR', 'ref:' + source]),
      kvCmd(['INCR', 'ref:' + source + ':' + today])
    ]);
  } catch (e) {}

  res.status(200).json({ ok: true });
};
