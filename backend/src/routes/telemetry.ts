import { Router } from 'express';
import { getCostTotals } from '../services/telemetry/costTracker';

export function createTelemetryRouter(): Router {
  const router = Router();

  router.get('/cost/summary', async (_request, response) => {
    const totals = await getCostTotals();
    response.json({ totals });
  });

  return router;
}
