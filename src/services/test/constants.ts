export const TEST_USER_CONFIG = {
  email: 'test.seller@example.com',
  password: 'test123',
  metadata: {
    role: 'seller',
    name: 'Test Seller',
    businessName: 'Test Firewood Co.',
    businessAddress: '123 Wood St, Portland, OR 97201',
    phone: '(555) 123-4567'
  }
} as const;

export const TEST_SELLER_CONFIG = {
  name: 'Test Seller',
  business_name: 'Test Firewood Co.',
  business_address: '123 Wood St, Portland, OR 97201',
  email: 'test.seller@example.com',
  phone: '(555) 123-4567',
  firewood_unit: 'cords',
  price_per_unit: 299.99,
  max_delivery_distance: 50,
  min_delivery_fee: 25,
  price_per_mile: 2,
  payment_timing: 'delivery',
  provides_stacking: true,
  stacking_fee_per_unit: 25,
  bio: 'Test seller providing quality firewood',
  status: 'approved'
} as const;

export const TEST_STRIPE_CONFIG = {
  stripe_account_id: 'acct_test123',
  access_token: 'sk_test_123',
} as const;