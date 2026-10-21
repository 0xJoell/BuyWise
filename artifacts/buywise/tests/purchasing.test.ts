import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decisionReasons,
  getProductCategory,
  getSampleOffers,
  isEligible,
  type Request,
} from '../src/lib/purchasing.ts';

test('headphone requests get headphone sample offers', () => {
  const offers = getSampleOffers('Wireless over-ear headphones');

  assert.equal(getProductCategory('Wireless over-ear headphones'), 'headphones');
  assert.equal(offers.length, 3);
  assert.ok(offers.every((offer) => offer.id.startsWith('headphones-')));
});

test('laptop requests get laptop sample offers, not headphone offers', () => {
  const offers = getSampleOffers('Lightweight laptop');

  assert.equal(getProductCategory('Lightweight laptop'), 'laptops');
  assert.equal(offers.length, 3);
  assert.ok(offers.every((offer) => /laptop/i.test(`${offer.name} ${offer.description}`)));
  assert.ok(offers.every((offer) => !offer.id.startsWith('headphones-')));
});

test('smartphone requests get smartphone-specific sample offers', () => {
  const offers = getSampleOffers('Android smartphone');

  assert.equal(getProductCategory('Android smartphone'), 'smartphones');
  assert.equal(offers.length, 3);
  assert.ok(offers.every((offer) => offer.features.includes('5G')));
});

test('a phone accessory does not receive smartphone offers', () => {
  assert.deepEqual(getSampleOffers('Protective phone case'), []);
});

test('unsupported product categories return no unrelated offers', () => {
  assert.equal(getProductCategory('USB-C travel hub'), null);
  assert.deepEqual(getSampleOffers('USB-C travel hub'), []);
});

test('over-budget offers are rejected with a budget reason', () => {
  const offer = getSampleOffers('headphones').find(
    (item) => item.id === 'headphones-b',
  );
  assert.ok(offer);
  const request: Request = {
    productRequest: 'headphones',
    budgetNear: 18.5,
    requiredFeatures: ['Bluetooth 5.3'],
  };

  assert.equal(isEligible(offer, request), false);
  assert.ok(
    decisionReasons(offer, request).some((reason) =>
      reason.includes('over your 18.5 NEAR budget'),
    ),
  );
});

test('offers missing any required feature are rejected', () => {
  const offer = getSampleOffers('headphones').find(
    (item) => item.id === 'headphones-c',
  );
  assert.ok(offer);
  const request: Request = {
    productRequest: 'headphones',
    budgetNear: 18.5,
    requiredFeatures: ['Active noise cancellation', 'Bluetooth 5.3'],
  };

  assert.equal(isEligible(offer, request), false);
  assert.deepEqual(decisionReasons(offer, request), [
    'Missing required feature: Bluetooth 5.3.',
  ]);
});
