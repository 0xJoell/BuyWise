import {
  PRODUCT_CATEGORIES,
  type Currency,
  type Offer,
  type ProductCategory,
  type ProductCategoryId,
} from './catalog.ts';

export type {
  Currency,
  Offer,
  ProductCategory,
  ProductCategoryId,
  Specification,
} from './catalog.ts';

export type Request = {
  productRequest: string;
  categoryId: ProductCategoryId | null;
  budget: number;
  currency: Currency;
  requiredFeatures: string[];
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function getCategoryById(
  categoryId: ProductCategoryId | null,
): ProductCategory | null {
  return PRODUCT_CATEGORIES.find((category) => category.id === categoryId) ?? null;
}

export function getCategoryByLabel(value: string): ProductCategory | null {
  const normalized = normalize(value);
  if (!normalized) return null;
  return (
    PRODUCT_CATEGORIES.find(
      (category) =>
        normalize(category.label) === normalized ||
        category.keywords.some((keyword) => normalize(keyword) === normalized),
    ) ?? null
  );
}

export function getProductCategory(productRequest: string): ProductCategory | null {
  const normalizedRequest = ` ${normalize(productRequest)} `;
  let bestMatch: { category: ProductCategory; score: number } | null = null;

  for (const category of PRODUCT_CATEGORIES) {
    for (const keyword of category.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword) continue;
      if (!normalizedRequest.includes(` ${normalizedKeyword} `)) continue;

      const score = normalizedKeyword.length;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { category, score };
      }
    }
  }

  return bestMatch?.category ?? null;
}

export function getProductCategoryLabel(
  categoryId: ProductCategoryId | null,
): string | null {
  return getCategoryById(categoryId)?.label ?? null;
}

export function getSampleOffers(
  categoryId: ProductCategoryId | null,
): Offer[] {
  return getCategoryById(categoryId)?.offers ?? [];
}

export function getFeatureOptions(
  categoryId: ProductCategoryId | null,
): string[] {
  const offers = getSampleOffers(categoryId);
  const values = offers.flatMap((offer) => [
    ...offer.features,
    ...offer.specifications.flatMap((specification) => [
      specification.value,
      `${specification.label}: ${specification.value}`,
    ]),
    ...offer.compatibility,
  ]);
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = normalize(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getProductSuggestions(): string[] {
  return PRODUCT_CATEGORIES.flatMap((category) => category.productSuggestions);
}

export function formatPrice(value: number): string {
  return Number.isInteger(value)
    ? value.toFixed(0)
    : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function offerAttributes(offer: Offer): string[] {
  return [
    ...offer.features,
    ...offer.specifications.flatMap((specification) => [
      specification.value,
      `${specification.label}: ${specification.value}`,
    ]),
    ...offer.compatibility,
  ];
}

export function isSatisfied(offer: Offer, requirement: string): boolean {
  const normalizedRequirement = normalize(requirement);
  return offerAttributes(offer).some(
    (attribute) => normalize(attribute) === normalizedRequirement,
  );
}

export function decisionReasons(offer: Offer, request: Request): string[] {
  const reasons: string[] = [];
  if (offer.currency !== request.currency) {
    reasons.push(
      `Offer currency ${offer.currency} does not match the ${request.currency} request budget.`,
    );
  }
  if (offer.price > request.budget) {
    reasons.push(
      `Price is ${formatPrice(offer.price - request.budget)} ${offer.currency} over your ${formatPrice(request.budget)} ${request.currency} budget.`,
    );
  }
  request.requiredFeatures
    .filter((feature) => !isSatisfied(offer, feature))
    .forEach((feature) => reasons.push(`Missing required feature: ${feature}.`));
  return reasons;
}

export function isEligible(offer: Offer, request: Request): boolean {
  return decisionReasons(offer, request).length === 0;
}
