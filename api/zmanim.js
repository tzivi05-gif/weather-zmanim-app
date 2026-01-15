export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // 1️⃣ City → Latitude / Longitude
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`,
      {
        headers: {
          'User-Agent': 'weather-zmanim-app',
          'Accept': 'application/json',
        },
      }
    );

    if (!geoRes.ok) throw new Error('Geocoding failed');

    const geoData = await geoRes.json();
    if (!geoData || geoData.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon, display_name } = geoData[0];

    // 2️⃣ Lat/Lon → Timezone
    const tzRes = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone` +
        `?format=json&by=position&lat=${lat}&lng=${lon}` +
        `&key=${process.env.TIMEZONEDB_KEY}`
    );

    if (!tzRes.ok) throw new Error('Timezone lookup failed');

    const tzData = await tzRes.json();
    if (!tzData.zoneName) {
      return res.status(500).json({ error: 'Timezone not found' });
    }

    // 3️⃣ Hebcal Zmanim (correct timezone!)
    const zmanimRes = await fetch(
      `https://www.hebcal.com/zmanim` +
        `?cfg=json` +
        `&latitude=${lat}` +
        `&longitude=${lon}` +
        `&tzid=${tzData.zoneName}` +
        `&maj=on&min=on&mod=on&nx=on&mf=on&ss=on`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!zmanimRes.ok) throw new Error('Hebcal failed');

    const zmanimData = await zmanimRes.json();
    if (!zmanimData.times) {
      return res.status(500).json({ error: 'Invalid zmanim data' });
    }

    res.status(200).json({
      city: display_name,
      timezone: tzData.zoneName,
      times: zmanimData.times,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch zmanim' });
  }
}