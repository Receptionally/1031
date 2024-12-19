import type { Seller } from '../../types/seller';

export interface MatchedSeller {
  seller: Seller;
  distance: number;
  transportRequirements?: string[];
}

export interface SellerMatchCriteria {
  maxDistance?: number;
  requiresSubscription?: boolean;
  stateCode?: string;
}