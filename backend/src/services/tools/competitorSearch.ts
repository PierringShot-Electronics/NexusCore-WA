import axios from 'axios';
import * as cheerio from 'cheerio';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface CompetitorOffer {
  title: string;
  price: number;
  currency: string;
  url: string;
}

export interface CompetitorLookupResult {
  offers: CompetitorOffer[];
  source: string;
  notes?: string;
}

function parsePrice(raw: string): { price: number; currency: string } | null {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/([\d.,]+)\s*([₼AZN$€])/i);
  if (!match || !match[1] || !match[2]) {
    return null;
  }
  const value = Number(match[1].replace(/[^\d.]/g, ''));
  const currency = match[2].toUpperCase().replace('₼', 'AZN');
  if (Number.isNaN(value)) {
    return null;
  }
  return { price: value, currency };
}

export async function searchCompetitors(query: string): Promise<CompetitorLookupResult> {
  if (!query.trim()) {
    return { offers: [], source: 'tap.az', notes: 'Sorğu boş idi' };
  }

  try {
    const response = await axios.get(env.TOOL_TAPAZ_BASE_URL, {
      params: { words: query },
      timeout: 8000
    });

    const $ = cheerio.load(response.data as string);
    const offers: CompetitorOffer[] = [];

    $('.products-i').slice(0, 5).each((_, element) => {
      const title = $('.products-name', element).text().trim();
      const priceText = $('.products-price', element).text().trim();
      const hrefRaw = $('.products-link', element).attr('href') ?? '';
      const parsed = parsePrice(priceText);

      if (title && parsed && hrefRaw) {
        const href = hrefRaw.startsWith('http') ? hrefRaw : `https://tap.az${hrefRaw}`;
        offers.push({
          title,
          price: parsed.price,
          currency: parsed.currency,
          url: href
        });
      }
    });

    return {
      offers,
      source: env.TOOL_TAPAZ_BASE_URL,
      notes: offers.length === 0 ? 'Uyğun nəticə tapılmadı' : undefined
    };
  } catch (error) {
    logger.warn({ err: error }, 'Tap.az scraping failed');
    return {
      offers: [],
      source: env.TOOL_TAPAZ_BASE_URL,
      notes: 'Rəqib məlumatı alınmadı'
    };
  }
}
