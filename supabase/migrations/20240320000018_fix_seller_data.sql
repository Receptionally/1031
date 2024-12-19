-- Update the handle_new_user function to properly handle the data
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
      coalesce((new.raw_user_meta_data->>'acceptsCashOnDelivery')::boolean, false),
      coalesce((new.raw_user_meta_data->>'providesStacking')::boolean, false),
      coalesce((new.raw_user_meta_data->>'stackingFeePerUnit')::decimal, 0),
      'pending'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();