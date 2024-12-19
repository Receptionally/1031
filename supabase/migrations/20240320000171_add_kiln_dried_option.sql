-- Add kiln dried related columns to sellers table
alter table public.sellers
  add column if not exists provides_kiln_dried boolean not null default false,
  add column if not exists kiln_dried_fee_per_unit decimal(10,2) not null default 0;

-- Update existing functions to include kiln dried options
create or replace function get_or_create_seller(user_id uuid)
returns setof sellers as $$
declare
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
  seller_record sellers%rowtype;
begin
  -- First try to get existing seller
  select * into seller_record
  from sellers s
  where s.id = user_id;
  
  -- If no record exists, create one
  if not found then
    insert into sellers (
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
      status
    )
    values (
      user_id,
      (select email from auth.users where id = user_id),
      '',
      '',
      '',
      '',
      default_bio,
      'cords',
      'delivery',
      false,
      0,
      20,
      false,
      0,
      'pending'
    )
    returning * into seller_record;
  end if;
  
  return next seller_record;
end;
$$ language plpgsql security definer;

-- Update handle_new_user function
create or replace function handle_new_user()
returns trigger as $$
declare
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
begin
  if new.raw_user_meta_data->>'role' = 'seller' then
    begin
      insert into sellers (
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
        'pending'
      )
      on conflict (id) do nothing;
      
      raise notice 'Created seller record for user %', new.id;
    exception when others then
      raise warning 'Failed to create seller record for user %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Update approve_seller_update function
create or replace function approve_seller_update(update_id uuid)
returns void as $$
declare
    seller_update record;
begin
    select * into seller_update
    from seller_updates
    where id = update_id and status = 'pending';
    
    if not found then
        raise exception 'Update not found or already processed';
    end if;
    
    update sellers
    set
        name = coalesce((seller_update.updates->>'name')::text, name),
        business_name = coalesce((seller_update.updates->>'business_name')::text, business_name),
        business_address = coalesce((seller_update.updates->>'business_address')::text, business_address),
        phone = coalesce((seller_update.updates->>'phone')::text, phone),
        firewood_unit = coalesce((seller_update.updates->>'firewood_unit')::text, firewood_unit),
        price_per_unit = coalesce((seller_update.updates->>'price_per_unit')::decimal, price_per_unit),
        max_delivery_distance = coalesce((seller_update.updates->>'max_delivery_distance')::integer, max_delivery_distance),
        min_delivery_fee = coalesce((seller_update.updates->>'min_delivery_fee')::decimal, min_delivery_fee),
        price_per_mile = coalesce((seller_update.updates->>'price_per_mile')::decimal, price_per_mile),
        provides_stacking = coalesce((seller_update.updates->>'provides_stacking')::boolean, provides_stacking),
        stacking_fee_per_unit = coalesce((seller_update.updates->>'stacking_fee_per_unit')::decimal, stacking_fee_per_unit),
        max_stacking_distance = coalesce((seller_update.updates->>'max_stacking_distance')::integer, max_stacking_distance),
        provides_kiln_dried = coalesce((seller_update.updates->>'provides_kiln_dried')::boolean, provides_kiln_dried),
        kiln_dried_fee_per_unit = coalesce((seller_update.updates->>'kiln_dried_fee_per_unit')::decimal, kiln_dried_fee_per_unit),
        bio = coalesce((seller_update.updates->>'bio')::text, bio)
    where id = seller_update.seller_id;
    
    update seller_updates
    set status = 'approved',
        updated_at = now()
    where id = update_id;
end;
$$ language plpgsql security definer;