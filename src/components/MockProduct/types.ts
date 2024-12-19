export interface MockSeller {
  id: string;
  name: string;
  business_name: string;
  business_address: string;
  email: string;
  phone: string;
  firewood_unit: string;
  price_per_unit: number;
  max_delivery_distance: number;
  min_delivery_fee: number;
  price_per_mile: number;
  payment_timing: string;
  status: string;
  profile_image: string;
  bio: string;
  provides_stacking: boolean;
  stacking_fee_per_unit: number;
}

export interface MockDelivery {
  distance: number;
  baseFee: number;
  mileageFee: number;
  totalFee: number;
}