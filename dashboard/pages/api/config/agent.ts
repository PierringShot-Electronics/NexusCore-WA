import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  'http://localhost:3000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const response = await fetch(`${API_BASE}/admin/config/agent`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'backend_error',
        details: body
      });
    }

    res.status(200).json(body);
  } catch (error) {
    res.status(502).json({
      error: 'failed_to_update_agent_config',
      message: (error as Error).message
    });
  }
}
