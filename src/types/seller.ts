export interface Seller {
  id: string;
  name: string;
  business_name: string;
  business_address: string;
  email: string;
  phone: string;
  firewood_unit: 'cords' | 'facecords' | 'ricks';
  price_per_unit: number;
  max_delivery_distance: number;
  min_delivery_fee: number;
  price_per_mile: number;
  payment_timing: 'scheduling' | 'delivery';
  provides_stacking: boolean;
  stacking_fee_per_unit: number;
  provides_kiln_dried: boolean;
  kiln_dried_fee_per_unit: number;
  max_stacking_distance: number | null;
  total_orders: number;
  subscription_status: 'none' | 'active' | 'past_due' | 'canceled';
  subscription_id?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  setup_intent_id?: string;
  setup_intent_status?: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profile_image?: string;
  bio?: string;
}

export interface SubscriptionStatus {
  total_orders: number;
  subscription_status: 'none' | 'active' | 'past_due' | 'canceled';
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  debt_amount: number;
  last_failed_charge?: string;
  failed_charge_amount?: number;
  setup_intent_status?: string;
  requires_subscription: boolean;
  can_accept_orders: boolean;
  orders_until_subscription: number;
}

export interface ConnectedAccount {
  stripe_account_id: string;
  access_token: string;
  connected_at: string;
}

export interface SellerWithAccount extends Seller {
  connected_accounts: ConnectedAccount[];
}

export interface SellerFormState {
  name: string;
  businessName: string;
  businessAddress: string;
  email: string;
  phone: string;
  password: string;
  firewoodUnit: 'cords' | 'facecords' | 'ricks' | '';
  pricePerUnit: string;
  maxDeliveryDistance: string;
  minDeliveryFee: string;
  pricePerMile: string;
  paymentTiming: 'scheduling' | 'delivery' | '';
  providesStacking: boolean;
  stackingFeePerUnit: string;
  providesKilnDried: boolean;
  kilnDriedFeePerUnit: string;
  maxStackingDistance: string;
  profileImage?: string;
  bio?: string;
}

export interface AdminSeller extends Seller {
  has_stripe_account: boolean;
  stripe_account_id?: string;
  stripe_connected_at?: string;
  total_orders: number;
  total_revenue: number;
  pending_updates?: Array<{
    id: string;
    updates: Record<string, any>;
    status: string;
    created_at: string;
  }>;
}