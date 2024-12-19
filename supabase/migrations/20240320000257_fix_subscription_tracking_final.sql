create or replace function charge_seller_subscription()
returns trigger as $$
declare
    seller_record sellers%rowtype; -- Use table type for better safety
    order_count integer;
begin
    -- Fetch seller record
    select * 
    into seller_record
    from sellers
    where id = new.seller_id;

    if not found then
        raise exception 'Seller with ID % not found.', new.seller_id;
    end if;

    -- Count the seller's orders
    select count(*) 
    into order_count
    from orders
    where seller_id = new.seller_id;

    -- Check if this is the 4th or higher order and the subscription is inactive
    if order_count >= 3 and seller_record.subscription_status != 'active' then
        raise exception 'Subscription required after 3 orders for seller ID %. Please subscribe to continue accepting orders.', new.seller_id;
    end if;

    -- Update seller's total orders
    update sellers
    set total_orders = order_count + 1
    where id = new.seller_id;

    -- If subscription is active and this is beyond the 3rd order, create a payment intent
    if order_count >= 3 and seller_record.subscription_status = 'active' then
        insert into payment_intents (
            seller_id,
            order_id,
            stripe_payment_intent_id,
            amount,
            status,
            type
        ) values (
            new.seller_id,
            new.id,
            concat('pending_', new.id), -- Safely generate the intent ID
            1000, -- Amount in cents ($10.00)
            'pending',
            'subscription_charge'
        );
    end if;

    return new;
end;
$$ language plpgsql;

-- Create trigger to charge seller after order
drop trigger if exists charge_seller_subscription_trigger on orders;
create trigger charge_seller_subscription_trigger
    after insert on orders
    for each row
    execute function charge_seller_subscription();

-- Force schema cache refresh
notify pgrst, 'reload schema';
