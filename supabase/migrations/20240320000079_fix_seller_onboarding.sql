-- Drop and recreate the handle_new_user function to properly initialize seller records
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_bio text := 'Local firewood supplier committed to quality service.';
begin
  if new.raw_user_meta_data->>'role' = 'seller' then
    begin
      -- Create initial seller record with required fields
      insert into public.sellers (
        id,
        email,
        name,
        business_name,
        business_address,
        phone,
        bio,
        profile_image,
        firewood_unit,
        price_per_unit,
        max_delivery_distance,
        min_delivery_fee,
        price_per_mile,
        payment_timing,
        provides_stacking,
        stacking_fee_per_unit,
        status
      ) values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'businessName', ''),
        coalesce(new.raw_user_meta_data->>'businessAddress', ''),
        coalesce(new.raw_user_meta_data->>'phone', ''),
        default_bio,
        null,
        'cords',
        null,
        null,
        null,
        null,
        'delivery',
        false,
        0,
        'pending'
      );
      
      -- Log successful creation
      raise notice 'Created seller record for user %', new.id;
    exception when others then
      -- Log detailed error but don't prevent user creation
      raise warning 'Failed to create seller record for user %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Add NOT NULL constraints for required fields
alter table public.sellers
  alter column name set not null,
  alter column business_name set not null,
  alter column business_address set not null,
  alter column phone set not null,
  alter column payment_timing set not null,
  alter column provides_stacking set not null,
  alter column stacking_fee_per_unit set not null default 0;

-- Add check constraints for numeric fields
alter table public.sellers
  add constraint price_per_unit_positive check (price_per_unit > 0),
  add constraint max_delivery_distance_positive check (max_delivery_distance > 0),
  add constraint min_delivery_fee_positive check (min_delivery_fee >= 0),
  add constraint price_per_mile_positive check (price_per_mile >= 0),
  add constraint stacking_fee_positive check (stacking_fee_per_unit >= 0);

-- Create index for better query performance
create index if not exists idx_sellers_status_email 
  on public.sellers(status, email);

-- Create view for seller onboarding status
create or replace view seller_onboarding_status as
select 
  s.id,
  s.email,
  s.status,
  case
    when s.bio is null or s.bio = '' then false
    when s.firewood_unit is null then false
    when s.price_per_unit is null then false
    when s.max_delivery_distance is null then false
    when s.min_delivery_fee is null then false
    when s.price_per_mile is null then false
    else true
  end as onboarding_complete,
  s.created_at,
  s.profile_image is not null as has_profile_image
from public.sellers s;

-- Grant access to the view
grant select on seller_onboarding_status to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';