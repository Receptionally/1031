-- Drop existing trigger and function
drop trigger if exists charge_seller_subscription_trigger on orders;
drop function if exists charge_seller_subscription cascade;

-- Create function to handle subscription charges
create or replace function charge_seller_subscription()
returns trigger as $$
declare
    seller_record sellers%rowtype;
    order_count integer;
    existing_charge payment_intents%rowtype;
begin
    -- Get seller record
    select * into seller_record
    from sellers
    where id = new.seller_id;

    if not found then
        raise exception 'Seller not found';
    end if;

    -- Get current order count
    select count(*) into order_count
    from orders
    where seller_id = new.seller_id;

    -- Only charge if this is beyond the 3rd order and subscription is active
    if order_count > 3 and seller_record.subscription_status = 'active' then
        -- Check if we already have a charge for this order
        select * into existing_charge
        from payment_intents
        where order_id = new.id
        and type = 'subscription_charge';

        -- Only create charge if one doesn't exist
        if not found then
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
                'pending_' || new.id,
                1000, -- $10.00 in cents
                'pending',
                'subscription_charge'
            );
        end if;
    end if;

    return new;
end;
$$ language plpgsql;

-- Create trigger to charge seller after order
create trigger charge_seller_subscription_trigger
    after insert on orders
    for each row
    execute function charge_seller_subscription();

-- Force schema cache refresh
notify pgrst, 'reload schema';