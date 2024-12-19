-- Drop the existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create the updated function
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
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'businessName',
      new.raw_user_meta_data->>'businessAddress',
      new.email,
      new.raw_user_meta_data->>'phone',
      new.raw_user_meta_data->>'firewoodUnit',
      (new.raw_user_meta_data->>'pricePerUnit')::decimal,
      (new.raw_user_meta_data->>'maxDeliveryDistance')::integer,
      (new.raw_user_meta_data->>'minDeliveryFee')::decimal,
      (new.raw_user_meta_data->>'pricePerMile')::decimal,
      new.raw_user_meta_data->>'paymentTiming',
      (new.raw_user_meta_data->>'acceptsCashOnDelivery')::boolean,
      (new.raw_user_meta_data->>'providesStacking')::boolean,
      (new.raw_user_meta_data->>'stackingFeePerUnit')::decimal,
      'pending'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();