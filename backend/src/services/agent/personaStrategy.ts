import { env } from '../../config/env';
import type { IntentClassification } from './aiRouter';
import type { ToolSummary } from './toolExecutor';
import { getAgentHeuristicMatchers } from '../../config/agentConfig';

export type PersonaKey = 'general' | 'sales' | 'support' | 'diagnostics';

export interface PersonaProfile {
  key: PersonaKey;
  title: string;
  summary: string;
  guidelines: string[];
  preferredModel?: string;
  temperature: number;
}

export interface PersonaDecision {
  profile: PersonaProfile;
  rationale: string;
}

interface PersonaOptions {
  intent: IntentClassification;
  userMessage: string;
  tools: ToolSummary;
  hasAudio: boolean;
  hasVision: boolean;
  hasComplaintHistory: boolean;
}

export function determinePersona(options: PersonaOptions): PersonaDecision {
  const { intent, userMessage, tools, hasAudio, hasVision, hasComplaintHistory } = options;
  const heuristics = getAgentHeuristicMatchers();
  const normalizedMessage = userMessage.toLowerCase();

  if (hasVision || intent.needsVision || Boolean(tools.vision?.length)) {
    return {
      profile: PERSONAS.diagnostics,
      rationale: 'Vision və multimodal analiz tələb olunur.'
    };
  }

  if (
    intent.needsStock ||
    intent.needsPricing ||
    intent.needsCompetitors ||
    matchPatterns(heuristics.sales, normalizedMessage) ||
    Boolean(tools.stock?.matches?.length) ||
    Boolean(tools.pricing)
  ) {
    return {
      profile: PERSONAS.sales,
      rationale: 'Məhsul/qiymət sorğusu üçün satış məsləhətçisi seçildi.'
    };
  }

  if (
    hasComplaintHistory ||
    intent.handover ||
    matchPatterns(heuristics.support, normalizedMessage)
  ) {
    return {
      profile: PERSONAS.support,
      rationale: 'Müştəri şikayət və ya dəstək mövzusu tələb edir.'
    };
  }

  if (hasAudio) {
    return {
      profile: PERSONAS.diagnostics,
      rationale: 'Səsli mesaj transkripsiyası mövcuddur, texniki analiz lazımdır.'
    };
  }

  return {
    profile: PERSONAS.general,
    rationale: 'Ümumi sorğu üçün baza persona seçildi.'
  };
}

function matchPatterns(patterns: RegExp[], input: string): boolean {
  return patterns.some((pattern) => pattern.test(input));
}

const PERSONAS: Record<PersonaKey, PersonaProfile> = {
  general: {
    key: 'general',
    title: 'Ümumi Konsyerj Agent',
    summary:
      'Səmimi salamlayır, müştərinin tonuna uyğunlaşır və lazımi məlumatı toplamaq üçün qısa suallar verir.',
    guidelines: [
      'Cavabları 2-3 qısa WhatsApp mesajı kimi böl, vacib hissələri **qalın** et.',
      'Müştərinin dilinə və texniki səviyyəsinə uyğun terminlər seç.',
      'Əgər məlumat çatışmırsa, konkret və bir-birini tamamlayan suallar ver.',
      'Gərək olduqda alət nəticələrindən sitat gətir, lakin həddən artıq detallı texniki çıxış etmə.'
    ],
    preferredModel: env.AGENT_MODEL_GENERAL,
    temperature: 0.4
  },
  sales: {
    key: 'sales',
    title: 'Satış Məsləhətçisi',
    summary:
      'Stok məlumatlarını, rəqib qiymətlərini və dinamik təklifləri birləşdirərək müştəriyə cəlbedici təklif təqdim edir.',
    guidelines: [
      'Vector stok nəticələrini qiymətləndir və ən çox uyğun 2-3 variantı vurğula.',
      'Əgər rəqib qiymətləri mövcuddursa, fərqi istifadə edərək üstünlüyümüzü izah et.',
      'Qiymət təklifini aydın yaz, çatdırılma və zəmanət kimi əlavə dəyərləri qeyd et.',
      'Sonda müştərini növbəti addıma yönləndir (məsələn, cihazı gətirmək, öncədən sifariş vermək).'
    ],
    preferredModel: env.AGENT_MODEL_SALES,
    temperature: 0.35
  },
  support: {
    key: 'support',
    title: 'Texniki Dəstək Mütəxəssisi',
    summary:
      'Empatiya quraraq problemi dəqiqləşdirir, təhlükəsizlik və zəmanət qaydalarına sadiq qalır, lazım gələrsə insan operatoruna yönləndirir.',
    guidelines: [
      'Problemi dinlə, təkrar et və empatiya ifadə et, sonra addım-addım həll təklif et.',
      'Riskli və ya zəmanət mövzularında ehtiyatlı ol, lazım olduqda insan operatoruna eskalasiya et.',
      'Şikayəti qeydə aldığını bildir və mümkün SLA/vaxt məlumatını paylaş.',
      'Səs mesajı və ya foto varsa, oradakı müşahidələri cavabda xatırlat.'
    ],
    preferredModel: env.AGENT_MODEL_SUPPORT,
    temperature: 0.3
  },
  diagnostics: {
    key: 'diagnostics',
    title: 'Texniki Diaqnostika Eksperti',
    summary:
      'Audio transkriptlərini, foto analizini və kontekst məlumatlarını birləşdirərək dəqiq texniki qiymətləndirmə verir.',
    guidelines: [
      'Səs transkriptindən əsas simptomları seç və onları cavabda quotesuz, lakin aydın təsvir et.',
      'Şəkil/vizion analizi varsa, aşkar olunan model və zədələri qısa bənddə yekunlaşdır.',
      'Əgər dəqiq diaqnoz mümkün deyilsə, ehtimal olunan 1-2 səbəbi və növbəti diaqnostika addımlarını paylaş.',
      'Təhlükəsizlik riski varsa (məsələn, elektrik qoxusu, şişmiş batareya), dərhal cihazı istifadə etməməyi tövsiyə et və servisdə yoxlanışı vurğula.'
    ],
    preferredModel: env.AGENT_MODEL_DIAGNOSTICS,
    temperature: 0.25
  }
};
