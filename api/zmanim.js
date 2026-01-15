export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await fetch(
      `https://www.hebcal.com/zmanim?cfg=json&city=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!data.times) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch zmanim' });
  }
}