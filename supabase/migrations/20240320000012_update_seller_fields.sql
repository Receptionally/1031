-- Add missing fields to sellers table
alter table public.sellers add column if not exists firewood_unit text;
alter table public.sellers add column if not exists price_per_unit decimal(10,2);
alter table public.sellers add column if not exists max_delivery_distance integer;
alter table public.sellers add column if not exists min_delivery_fee decimal(10,2);
alter table public.sellers add column if not exists price_per_mile decimal(10,2);
alter table public.sellers add column if not exists payment_timing text;
alter table public.sellers add column if not exists accepts_cash_on_delivery boolean default false;

-- Add constraints
alter table public.sellers add constraint sellers_firewood_unit_check 
    check (firewood_unit in ('cords', 'facecords', 'ricks'));
alter table public.sellers add constraint sellers_payment_timing_check 
    check (payment_timing in ('scheduling', 'delivery'));

-- Update handle_new_user function to include all fields
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
      'pending'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;