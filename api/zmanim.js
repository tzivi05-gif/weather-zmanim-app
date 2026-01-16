export default async function handler(req, res) {
  try {
    const city = req.query.city || 'New York';

    // Map city → geonameid (you can add more later)
    const cityMap = {
      'brooklyn': '5128581',
      'new york': '5128581',
      'nyc': '5128581',
      'jerusalem': '281184',
      'lakewood': '5100280'
    };

    const key = city.toLowerCase().trim();
    const geonameid = cityMap[key] || '5128581'; // default NYC

    const url = `https://www.hebcal.com/zmanim?cfg=json&geonameid=${geonameid}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'zmanim-app',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Hebcal status:', response.status);
      return res.status(500).json({ error: 'Hebcal request failed' });
    }

    const data = await response.json();

    if (!data.times) {
      console.error('Hebcal returned no times:', data);
      return res.status(404).json({ error: 'No zmanim returned' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Zmanim API error:', err);
    res.status(500).json({ error: 'Failed to fetch zmanim' });
  }
}