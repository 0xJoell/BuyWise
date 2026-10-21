export type Request = {
  productRequest: string;
  budgetNear: number;
  requiredFeatures: string[];
};

export type Offer = {
  id: string;
  name: string;
  priceNear: number;
  features: string[];
  description: string;
};

export type ProductCategory =
  | 'headphones'
  | 'laptops'
  | 'smartphones'
  | 'monitors';

const categoryLabels: Record<ProductCategory, string> = {
  headphones: 'headphones',
  laptops: 'laptops',
  smartphones: 'smartphones',
  monitors: 'monitors',
};

const categoryMatchers: Array<[ProductCategory, RegExp]> = [
  ['headphones', /\b(headphones?|earbuds?|earphones?|headsets?)\b/i],
  ['laptops', /\b(laptops?|notebooks?|chromebooks?|macbooks?)\b/i],
  [
    'smartphones',
    /\b(smart[\s-]*phones?|iphones?|android phones?|mobile phones?|cell phones?)\b/i,
  ],
  ['monitors', /\b(monitors?|computer displays?|external displays?)\b/i],
];

const sampleOffers: Record<ProductCategory, Offer[]> = {
  headphones: [
    {
      id: 'headphones-a',
      name: 'Sonora QuietComfort 45',
      priceNear: 16.8,
      description:
        'A balanced everyday pair with a comfortable fit and dependable all-day sound.',
      features: [
        'Active noise cancellation',
        'Bluetooth 5.3',
        '30-hour battery',
        'Multipoint pairing',
        'USB-C charging',
      ],
    },
    {
      id: 'headphones-b',
      name: 'Auralis Studio Max',
      priceNear: 21.2,
      description:
        'Premium studio tuning and plush materials, priced beyond this request’s ceiling.',
      features: [
        'Active noise cancellation',
        'Bluetooth 5.3',
        '40-hour battery',
        'Spatial audio',
        'USB-C charging',
      ],
    },
    {
      id: 'headphones-c',
      name: 'Northline Travel One',
      priceNear: 14.4,
      description:
        'Lightweight travel headphones with long playback and fold-flat storage.',
      features: [
        'Active noise cancellation',
        'Bluetooth 5.2',
        '32-hour battery',
        'Fold-flat design',
        'USB-C charging',
      ],
    },
  ],
  laptops: [
    {
      id: 'laptop-a',
      name: 'Aster Air 14',
      priceNear: 38,
      description:
        'A lightweight everyday laptop with a sharp display and practical ports.',
      features: [
        '16GB RAM',
        '512GB SSD',
        '14-inch display',
        'Wi-Fi 6E',
        'USB-C charging',
      ],
    },
    {
      id: 'laptop-b',
      name: 'Meridian Pro 15',
      priceNear: 64,
      description:
        'A higher-capacity laptop sample with room for demanding projects.',
      features: [
        '32GB RAM',
        '1TB SSD',
        '15-inch display',
        'Wi-Fi 7',
        'Backlit keyboard',
      ],
    },
    {
      id: 'laptop-c',
      name: 'Fieldbook Flex 13',
      priceNear: 34,
      description:
        'A compact convertible laptop sample with a touch display and flexible setup.',
      features: [
        '16GB RAM',
        '256GB SSD',
        '13-inch display',
        'Touchscreen',
        'Wi-Fi 6E',
      ],
    },
  ],
  smartphones: [
    {
      id: 'smartphone-a',
      name: 'Luma Nova 5G',
      priceNear: 22,
      description:
        'A balanced 5G phone sample with a vivid screen and all-day battery.',
      features: [
        '128GB storage',
        '5G',
        'OLED display',
        'Dual SIM',
        '24-hour battery',
      ],
    },
    {
      id: 'smartphone-b',
      name: 'Orion Pixel 9',
      priceNear: 32,
      description:
        'A premium phone sample with expanded storage and wireless charging.',
      features: [
        '256GB storage',
        '5G',
        'OLED display',
        'Wireless charging',
        'IP68 water resistance',
      ],
    },
    {
      id: 'smartphone-c',
      name: 'Terra One SE',
      priceNear: 18,
      description:
        'A budget-conscious phone sample with modern connectivity and NFC.',
      features: [
        '128GB storage',
        '5G',
        'IPS display',
        'NFC',
        '20-hour battery',
      ],
    },
  ],
  monitors: [
    {
      id: 'monitor-a',
      name: 'Frameview 27 QHD',
      priceNear: 23.5,
      description:
        'A 27-inch IPS sample with a crisp QHD picture and smooth refresh.',
      features: [
        '27-inch display',
        '1440p resolution',
        'IPS panel',
        '100Hz refresh rate',
        'USB-C',
      ],
    },
    {
      id: 'monitor-b',
      name: 'Clarity 27 4K',
      priceNear: 34.9,
      description:
        'A 27-inch 4K sample suited to detailed work and color-rich media.',
      features: [
        '27-inch display',
        '4K resolution',
        'IPS panel',
        '60Hz refresh rate',
        'USB-C',
      ],
    },
    {
      id: 'monitor-c',
      name: 'Apex 24 Gaming',
      priceNear: 19.2,
      description:
        'A compact gaming monitor sample with a fast refresh and HDMI input.',
      features: [
        '24-inch display',
        '1080p resolution',
        'VA panel',
        '165Hz refresh rate',
        'HDMI 2.1',
      ],
    },
  ],
};

export function getProductCategory(productRequest: string): ProductCategory | null {
  if (/\b(phone case|phone charger|phone stand|screen protector)\b/i.test(productRequest)) {
    return null;
  }
  const categoryMatch = categoryMatchers.find(([, matcher]) =>
    matcher.test(productRequest),
  );
  return categoryMatch?.[0] ?? null;
}

export function getProductCategoryLabel(productRequest: string): string | null {
  const category = getProductCategory(productRequest);
  return category ? categoryLabels[category] : null;
}

export function getSampleOffers(productRequest: string): Offer[] {
  const category = getProductCategory(productRequest);
  return category ? sampleOffers[category] : [];
}

export function getFeatureOptions(productRequest: string): string[] {
  return [
    ...new Set(
      getSampleOffers(productRequest).flatMap((offer) => offer.features),
    ),
  ];
}

export function formatNear(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

export function isSatisfied(offer: Offer, feature: string): boolean {
  return offer.features.some(
    (item) => item.toLowerCase() === feature.toLowerCase(),
  );
}

export function decisionReasons(offer: Offer, request: Request): string[] {
  const reasons: string[] = [];
  if (offer.priceNear > request.budgetNear) {
    reasons.push(
      `Price is ${formatNear(offer.priceNear - request.budgetNear)} NEAR over your ${formatNear(request.budgetNear)} NEAR budget.`,
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
