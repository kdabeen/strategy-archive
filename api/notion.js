export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'NOTION_TOKEN not configured' });
  }

  const { path, body } = req.body;
  if (!path) {
    return res.status(400).json({ error: 'Missing path' });
  }

  try {
    const notionRes = await fetch(`https://api.notion.com${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await notionRes.json();
    res.status(notionRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
