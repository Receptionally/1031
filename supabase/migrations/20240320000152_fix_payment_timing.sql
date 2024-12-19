-- Update approve_seller_update function to include payment_timing
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
        payment_timing = coalesce((seller_update.updates->>'payment_timing')::text, payment_timing),
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