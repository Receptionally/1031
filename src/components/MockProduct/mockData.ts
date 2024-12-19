export const MOCK_SELLER = {
  id: 'dev-seller-123',
  name: 'John Smith',
  business_name: "Smith's Premium Firewood",
  business_address: '123 Wood Street, Portland, OR 97201',
  email: 'john@smithfirewood.com',
  phone: '(555) 123-4567',
  firewood_unit: 'cords',
  price_per_unit: 299.99,
  max_delivery_distance: 50,
  min_delivery_fee: 25,
  price_per_mile: 2,
  payment_timing: 'delivery',
  status: 'approved',
  created_at: new Date().toISOString(),
  profile_image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  bio: 'With over 20 years of experience in the firewood industry, I take pride in delivering premium, well-seasoned hardwood to homes across Portland.',
  provides_stacking: true,
  provides_kiln_dried: true,
  stacking_fee_per_unit: 25,
  kiln_dried_fee_per_unit: 50,
  max_stacking_distance: 50,
  connected_accounts: [{
    stripe_account_id: 'acct_dev123',
    access_token: 'sk_test_dev123',
    connected_at: new Date().toISOString()
  }],
  has_stripe_account: true,
  stripe_account_id: 'acct_dev123',
  stripe_connected_at: new Date().toISOString()
};

export const MOCK_DELIVERY = {
  distance: 15,
  baseFee: 25,
  mileageFee: 30,
  totalFee: 55,
};