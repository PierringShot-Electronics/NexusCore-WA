import type { NextApiRequest, NextApiResponse } from 'next';

type ServiceStatus = {
  name: string;
  status: 'ok' | 'warning' | 'error';
  updatedAt: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<{ services: ServiceStatus[] }>
) {
  // Placeholder data; real implementation will fetch health from backend service.
  res.status(200).json({
    services: [
      { name: 'Backend', status: 'warning', updatedAt: new Date().toISOString() },
      { name: 'WAHA Bridge', status: 'warning', updatedAt: new Date().toISOString() },
      { name: 'PostgreSQL', status: 'warning', updatedAt: new Date().toISOString() },
      { name: 'Redis', status: 'warning', updatedAt: new Date().toISOString() }
    ]
  });
}
