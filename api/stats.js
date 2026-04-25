module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  var KV_URL = process.env.KV_REST_API_URL;
  var KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({
      total: 0, today: 0, week: 0,
      referrers: {},
      daily: [],
      note: 'KV not configured — segui le istruzioni per attivare Vercel KV'
    });
  }

  function kvCmd(args) {
    return fetch(KV_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + KV_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args)
    }).then(function (r) { return r.json(); }).then(function (d) { return d.result; });
  }

  var today = new Date().toISOString().split('T')[0];

  // Get last 7 days keys
  var days = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  try {
    // Fetch total + today + daily counts
    var totalP = kvCmd(['GET', 'visits:total']);
    var todayP = kvCmd(['GET', 'visits:' + today]);

    // Fetch daily visits for last 7 days
    var dailyKeys = days.map(function (d) { return 'visits:' + d; });
    var dailyP = kvCmd(['MGET'].concat(dailyKeys));

    // Fetch referrer totals
    var sources = ['direct', 'instagram', 'google', 'facebook', 'linkedin', 'tiktok', 'other'];
    var refKeys = sources.map(function (s) { return 'ref:' + s; });
    var refP = kvCmd(['MGET'].concat(refKeys));

    var results = await Promise.all([totalP, todayP, dailyP, refP]);

    var total = parseInt(results[0]) || 0;
    var todayVisits = parseInt(results[1]) || 0;

    var dailyData = results[2] || [];
    var daily = days.map(function (d, i) {
      return { date: d, visits: parseInt(dailyData[i]) || 0 };
    }).reverse();

    var weekTotal = daily.reduce(function (sum, d) { return sum + d.visits; }, 0);

    var refData = results[3] || [];
    var referrers = {};
    sources.forEach(function (s, i) {
      var val = parseInt(refData[i]) || 0;
      if (val > 0) referrers[s] = val;
    });

    res.status(200).json({
      total: total,
      today: todayVisits,
      week: weekTotal,
      referrers: referrers,
      daily: daily
    });
  } catch (e) {
    res.status(500).json({ error: 'Errore lettura dati', detail: e.message });
  }
};
