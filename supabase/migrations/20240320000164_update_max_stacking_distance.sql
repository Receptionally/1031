-- Update existing records to have a default value of 20 feet if they provide stacking
update public.sellers
set max_stacking_distance = 20
where provides_stacking = true 
and (max_stacking_distance is null or max_stacking_distance <= 0);

-- Update handle_new_user function with new default
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
        profile_image,
        firewood_unit,
        price_per_unit,
        max_delivery_distance,
        min_delivery_fee,
        price_per_mile,
        payment_timing,
        provides_stacking,
        stacking_fee_per_unit,
        max_stacking_distance,
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
        20, -- Default to 20 feet
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

-- Update seller_updates function to handle max_stacking_distance
create or replace function approve_seller_update(update_id uuid)
returns void as $$
declare
    seller_update record;
begin
    -- Get the update
    select * into seller_update
    from seller_updates
    where id = update_id and status = 'pending';
    
    if not found then
        raise exception 'Update not found or already processed';
    end if;
    
    -- Apply the updates to the seller
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
        max_stacking_distance = case
            when (seller_update.updates->>'provides_stacking')::boolean = true then
                coalesce((seller_update.updates->>'max_stacking_distance')::integer, 20) -- Default to 20 feet
            else null
        end,
        bio = coalesce((seller_update.updates->>'bio')::text, bio)
    where id = seller_update.seller_id;
    
    -- Mark update as approved
    update seller_updates
    set status = 'approved',
        updated_at = now()
    where id = update_id;
end;
$$ language plpgsql security definer;

-- Force schema cache refresh
notify pgrst, 'reload schema';