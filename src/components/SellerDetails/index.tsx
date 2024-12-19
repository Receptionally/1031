@@ .. @@
 import { Building2 } from 'lucide-react';
 import type { SellerWithAccount } from '../types/seller';
 import type { DeliveryCost } from '../utils/delivery';
+import { OrderNotices } from './OrderNotices';
 import { StackingSelector } from './StackingSelector';
 import { PriceCalculator } from './PriceCalculator';
 import { DeliveryInfo } from './DeliveryInfo';
@@ .. @@
       <PriceCalculator
         quantity={quantity}
         onQuantityChange={setQuantity}
         basePrice={seller.price_per_unit}
         stackingFee={includeStacking ? seller.stacking_fee_per_unit : 0}
         deliveryCost={deliveryCost}
       />
+      
+      <OrderNotices paymentTiming={seller.payment_timing} />
     </div>
   );
 }