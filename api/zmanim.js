export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const url = `https://www.hebcal.com/zmanim?cfg=json&city=${encodeURIComponent(city)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Hebcal request failed');
    }

    const data = await response.json();

    if (!data.times) {
      throw new Error('No zmanim returned');
    }

    res.status(200).json({
      city: data.location.title,
      timezone: data.location.tzid,
      times: data.times,
    });
  } catch (err) {
    console.error('Zmanim API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch zmanim' });
  }
}