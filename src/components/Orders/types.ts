import type { Order as BaseOrder } from '../../types/order';

export interface OrderDetailsProps {
  order: BaseOrder;
  showSellerInfo?: boolean;
}

export interface OrderRowProps {
  order: BaseOrder;
  showSellerInfo?: boolean;
}

export interface OrderActionsProps {
  order: BaseOrder;
}

export interface OrderHeaderProps {
  order: BaseOrder;
  isExpanded: boolean;
  onToggle: () => void;
  showSellerInfo?: boolean;
}