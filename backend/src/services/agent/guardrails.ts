import { logger } from '../../utils/logger';

const DISALLOWED_PATTERNS = [
  /(?:prompt|system) təlimatını göster/i,
  /forget (?:everything|instructions)/i,
  /api key/i,
  /hack/i,
  /spam/i
];

export interface GuardrailResult {
  blocked: boolean;
  reason?: string;
}

export function evaluateGuardrails(text: string): GuardrailResult {
  for (const pattern of DISALLOWED_PATTERNS) {
    if (pattern.test(text)) {
      logger.warn({ pattern: pattern.source }, 'Guardrail blocked outgoing message');
      return {
        blocked: true,
        reason:
          'Bu mövzuda məlumat paylaşmaq üçün səlahiyyətim yoxdur. Sizə insan əməkdaşımız kömək edəcək.'
      };
    }
  }

  return { blocked: false };
}
