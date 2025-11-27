export interface PricingInput {
  internalCost: number | null;
  competitorPrice: number | null;
  minimumMargin?: number;
  discountPercentage?: number;
}

export interface PricingResult {
  offerPrice: number | null;
  rationale: string;
}

export function calculateOffer({
  internalCost,
  competitorPrice,
  minimumMargin = 15,
  discountPercentage = 5
}: PricingInput): PricingResult {
  if (competitorPrice == null) {
    return {
      offerPrice: internalCost,
      rationale: 'Rəqib qiyməti tapılmadı, daxili maya dəyərinə əsaslanın.'
    };
  }

  const discount = (competitorPrice * discountPercentage) / 100;
  const suggested = competitorPrice - discount;

  if (internalCost != null && suggested <= internalCost + minimumMargin) {
    const safePrice = Math.max(internalCost + minimumMargin, internalCost * 1.15);
    return {
      offerPrice: Number(safePrice.toFixed(2)),
      rationale:
        'Rəqibdən aşağı qiymət mümkün olmadı; minimum marja qorunaraq təklif hazırlandı.'
    };
  }

  return {
    offerPrice: Number(suggested.toFixed(2)),
    rationale: `Rəqib qiyməti ${competitorPrice} əsasında ${discountPercentage}% endirim tətbiq olundu.`
  };
}
