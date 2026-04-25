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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!process.env.REDIS_URL) {
    return res.status(200).json({
      total: 0, today: 0, week: 0,
      referrers: {},
      daily: [],
      note: 'Redis not configured — aggiungi REDIS_URL nelle Environment Variables di Vercel'
    });
  }

  var today = new Date().toISOString().split('T')[0];

  var days = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  try {
    var r = getRedis();
    var pipe = r.pipeline();
    pipe.get('visits:total');
    pipe.get('visits:' + today);
    days.forEach(function(d) { pipe.get('visits:' + d); });
    var sources = ['direct', 'instagram', 'google', 'facebook', 'linkedin', 'tiktok', 'other'];
    sources.forEach(function(s) { pipe.get('ref:' + s); });

    var results = await pipe.exec();
    var idx = 0;

    var total = parseInt(results[idx++][1]) || 0;
    var todayVisits = parseInt(results[idx++][1]) || 0;

    var daily = days.map(function(d) {
      return { date: d, visits: parseInt(results[idx++][1]) || 0 };
    }).reverse();

    var weekTotal = daily.reduce(function(sum, d) { return sum + d.visits; }, 0);

    var referrers = {};
    sources.forEach(function(s) {
      var val = parseInt(results[idx++][1]) || 0;
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
