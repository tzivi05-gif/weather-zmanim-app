export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // 1️⃣ City → Lat / Lon (OpenStreetMap)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`,
      {
        headers: {
          'User-Agent': 'zmanim-app',
        },
      }
    );
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon, display_name } = geoData[0];

    // 2️⃣ Lat/Lon → Timezone (TimeZoneDB)
    const tzRes = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?format=json&by=position&lat=${lat}&lng=${lon}&key=${process.env.TIMEZONEDB_KEY}`
    );
    const tzData = await tzRes.json();

    if (!tzData.zoneName) {
      return res.status(500).json({ error: 'Timezone lookup failed' });
    }

    // 3️⃣ Hebcal zmanim (WITH tzid)
    const zmanimRes = await fetch(
      `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lon}&tzid=${tzData.zoneName}`
    );
    const zmanimData = await zmanimRes.json();

    // 4️⃣ Calculate Nightfall (Sunset + 40 min)
    let tzeit = null;
    if (zmanimData.times?.sunset) {
      const sunset = new Date(zmanimData.times.sunset);
      tzeit = new Date(sunset.getTime() + 40 * 60 * 1000).toISOString();
    }

    res.status(200).json({
      location: {
        title: display_name,
        timezone: tzData.zoneName,
      },
      times: {
        ...zmanimData.times,
        tzeit, // ✅ ALWAYS exists
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch zmanim' });
  }
}