-- Update sellers table to set proper default for subscription_status
alter table public.sellers
  alter column subscription_status set default 'none';

-- Update handle_new_user function to set subscription_status
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
begin
  if new.raw_user_meta_data->>'role' = 'seller' then
    begin
      insert into public.sellers (
        id,
        email,
        name,
        business_name,
        business_address,
        phone,
        bio,
        firewood_unit,
        payment_timing,
        provides_stacking,
        stacking_fee_per_unit,
        max_stacking_distance,
        provides_kiln_dried,
        kiln_dried_fee_per_unit,
        subscription_status,
        total_orders,
        status
      ) values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'businessName', ''),
        coalesce(new.raw_user_meta_data->>'businessAddress', ''),
        coalesce(new.raw_user_meta_data->>'phone', ''),
        default_bio,
        'cords',
        'delivery',
        false,
        0,
        20,
        false,
        0,
        'none',
        0,
        'pending'
      );
      
      raise notice 'Created seller record for user %', new.id;
    exception when others then
      raise warning 'Failed to create seller record for user %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end;
$$ language plpgsql security definer;