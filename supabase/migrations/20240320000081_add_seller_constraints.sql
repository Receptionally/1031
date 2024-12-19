-- Add check constraints for numeric fields
alter table public.sellers
  add constraint price_per_unit_check check (price_per_unit is null or price_per_unit > 0),
  add constraint max_delivery_distance_check check (max_delivery_distance is null or max_delivery_distance > 0),
  add constraint min_delivery_fee_check check (min_delivery_fee is null or min_delivery_fee >= 0),
  add constraint price_per_mile_check check (price_per_mile is null or price_per_mile >= 0),
  add constraint stacking_fee_check check (stacking_fee_per_unit >= 0);