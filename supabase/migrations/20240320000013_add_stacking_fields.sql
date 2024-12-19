-- Add stacking-related fields to sellers table
alter table public.sellers 
  add column if not exists provides_stacking boolean default false,
  add column if not exists stacking_fee_per_unit decimal(10,2) default 0;

-- Update handle_new_user function to include stacking fields
create or replace function public.handle_new_user()
returns trigger as $$
begin
  if new.raw_user_meta_data->>'role' = 'seller' then
    insert into public.sellers (
      id,
      name,
      business_name,
      business_address,
      email,
      phone,
      firewood_unit,
      price_per_unit,
      max_delivery_distance,
      min_delivery_fee,
      price_per_mile,
      payment_timing,
      accepts_cash_on_delivery,
      provides_stacking,
      stacking_fee_per_unit,
      status
    ) values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', ''),
      coalesce(new.raw_user_meta_data->>'businessName', ''),
      coalesce(new.raw_user_meta_data->>'businessAddress', ''),
      new.email,
      coalesce(new.raw_user_meta_data->>'phone', ''),
      coalesce(new.raw_user_meta_data->>'firewoodUnit', 'cords'),
      coalesce((new.raw_user_meta_data->>'pricePerUnit')::decimal, 0),
      coalesce((new.raw_user_meta_data->>'maxDeliveryDistance')::integer, 0),
      coalesce((new.raw_user_meta_data->>'minDeliveryFee')::decimal, 0),
      coalesce((new.raw_user_meta_data->>'pricePerMile')::decimal, 0),
      coalesce(new.raw_user_meta_data->>'paymentTiming', 'scheduling'),
      coalesce((new.raw_user_meta_data->>'acceptsCashOnDelivery')::boolean, false),
      coalesce((new.raw_user_meta_data->>'providesStacking')::boolean, false),
      coalesce((new.raw_user_meta_data->>'stackingFeePerUnit')::decimal, 0),
      'pending'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;