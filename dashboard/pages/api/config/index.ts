import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  'http://localhost:3000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const response = await fetch(`${API_BASE}/admin/config`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: 'backend_error',
        details: body
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(502).json({
      error: 'failed_to_fetch_config',
      message: (error as Error).message
    });
  }
}
