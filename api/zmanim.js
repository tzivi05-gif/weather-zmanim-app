export default async function handler(req, res) {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // 1️⃣ Get coordinates from OpenStreetMap (free, no key)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
    );
    const geo = await geoRes.json();

    if (!geo.length) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon, display_name } = geo[0];

    // 2️⃣ Get zmanim using coordinates
    const zmanimRes = await fetch(
      `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lon}`
    );
    const zmanim = await zmanimRes.json();

    res.status(200).json({
      location: { title: display_name },
      times: zmanim.times,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch zmanim' });
  }
}