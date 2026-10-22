import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decisionReasons,
  getCategoryByLabel,
  getProductCategory,
  getSampleOffers,
  isEligible,
  isSatisfied,
  type Request,
} from '../src/lib/purchasing.ts';
import { PRODUCT_CATEGORIES } from '../src/lib/catalog.ts';

function requestFor(
  productRequest: string,
  budget: number,
  requiredFeatures: string[] = [],
): Request {
  return {
    productRequest,
    categoryId: getProductCategory(productRequest)?.id ?? null,
    budget,
    currency: 'NEAR',
    requiredFeatures,
  };
}

test('headphones, earbuds, and earphones resolve to the audio category', () => {
  for (const product of [
    'wireless over-ear headphones',
    'wireless earphones',
    'Bluetooth earbuds',
  ]) {
    const category = getProductCategory(product);
    assert.equal(category?.id, 'audio');
    assert.equal(category?.offers.length, 3);
    assert.ok(category?.offers.every((offer) => offer.categoryId === 'audio'));
  }
});

test('smart watch spelling variations resolve to wearables', () => {
  assert.equal(getProductCategory('smartwatch')?.id, 'wearables');
  assert.equal(getProductCategory('smart watch')?.id, 'wearables');
  assert.equal(getProductCategory('fitness band')?.id, 'wearables');
});

test('smartphones and tablets use the phones-and-tablets category', () => {
  assert.equal(getProductCategory('Android smartphone')?.id, 'phones-tablets');
  assert.equal(getProductCategory('Android tablet')?.id, 'phones-tablets');
  assert.equal(
    getSampleOffers(getProductCategory('Android smartphone')?.id ?? null).length,
    3,
  );
});

test('laptop and desktop requests use computer offers', () => {
  assert.equal(getProductCategory('lightweight laptop')?.id, 'computers');
  assert.equal(getProductCategory('desktop PC')?.id, 'computers');
  assert.equal(getSampleOffers(getProductCategory('laptop')?.id ?? null).length, 3);
});

test('charger and power-bank requests use charger category offers', () => {
  assert.equal(getProductCategory('USB-C charger')?.id, 'chargers-power');
  assert.equal(getProductCategory('phone charger')?.id, 'chargers-power');
  assert.equal(getProductCategory('power bank')?.id, 'chargers-power');
});

test('gaming controller requests do not receive unrelated audio offers', () => {
  const category = getProductCategory('wireless game controller');
  assert.equal(category?.id, 'gaming');
  assert.equal(category?.offers.length, 3);
  assert.ok(category?.offers.every((offer) => offer.categoryId === 'gaming'));
});

test('specific phrases win over broader category keywords', () => {
  assert.equal(getProductCategory('security camera')?.id, 'smart-home');
  assert.equal(getProductCategory('gaming headset')?.id, 'gaming');
  assert.equal(getProductCategory('USB-C travel hub')?.id, 'computer-accessories');
});

test('unknown products have no category and never receive unrelated offers', () => {
  const request = requestFor('unlisted orbital gadget', 10);
  assert.equal(request.categoryId, null);
  assert.deepEqual(getSampleOffers(request.categoryId), []);
});

test('category selection accepts searchable labels and common category synonyms', () => {
  assert.equal(getCategoryByLabel('Routers and networking equipment')?.id, 'networking');
  assert.equal(getCategoryByLabel('smart watch')?.id, 'wearables');
});

test('every catalog category has three offers and all product suggestions are recognized', () => {
  assert.equal(PRODUCT_CATEGORIES.length, 13);
  for (const category of PRODUCT_CATEGORIES) {
    assert.equal(category.offers.length, 3, `${category.label} should have three offers`);
    for (const suggestion of category.productSuggestions) {
      assert.equal(
        getProductCategory(suggestion)?.id,
        category.id,
        `Suggestion "${suggestion}" should map to ${category.label}`,
      );
    }
  }
});

test('catalog offers have unique IDs and explicit simulated price and product details', () => {
  const allOffers = PRODUCT_CATEGORIES.flatMap((category) => category.offers);
  assert.equal(new Set(allOffers.map((offer) => offer.id)).size, allOffers.length);
  assert.ok(
    allOffers.every(
      (offer) =>
        offer.simulated &&
        offer.currency === 'NEAR' &&
        offer.category &&
        offer.specifications.length > 0 &&
        Array.isArray(offer.compatibility),
    ),
  );
});

test('offers above the active request budget are rejected with an exact reason', () => {
  const offer = getSampleOffers('audio').find((item) => item.id === 'audio-2');
  assert.ok(offer);
  const request = requestFor('Bluetooth earbuds', 18.5, ['Bluetooth 5.3']);

  assert.equal(isEligible(offer, request), false);
  assert.ok(
    decisionReasons(offer, request).some((reason) =>
      reason.includes('2.7 NEAR over your 18.5 NEAR budget'),
    ),
  );
});

test('an offer missing any required feature is rejected', () => {
  const offer = getSampleOffers('audio').find((item) => item.id === 'audio-3');
  assert.ok(offer);
  const request = requestFor('wireless earphones', 30, [
    'Active noise cancellation',
    'Bluetooth 5.3',
  ]);

  assert.equal(isEligible(offer, request), false);
  assert.deepEqual(decisionReasons(offer, request), [
    'Missing required feature: Bluetooth 5.3.',
  ]);
});

test('required specifications are checked deterministically', () => {
  const offer = getSampleOffers('computers').find((item) => item.id === 'computers-1');
  assert.ok(offer);
  assert.equal(isSatisfied(offer, 'Memory: 16GB RAM'), true);
  assert.equal(isSatisfied(offer, '1TB SSD'), false);
});
