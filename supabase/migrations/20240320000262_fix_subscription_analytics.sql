-- Update seller subscription status view
create or replace view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
  s.setup_intent_id,
  s.setup_intent_status,
  s.setup_intent_client_secret,
  s.subscription_start_date,
  s.subscription_end_date,
  s.card_last4,
  s.card_brand,
  s.stripe_customer_id,
  coalesce(s.debt_amount, 0) as debt_amount,
  s.last_failed_charge,
  s.failed_charge_amount,
  case
    when s.total_orders > 3 then true
    else false
  end as requires_subscription,
  case
    when coalesce(s.debt_amount, 0) > 0 then false
    when s.subscription_status = 'active' then true
    when s.total_orders <= 3 then true
    else false
  end as can_accept_orders,
  greatest(0, 4 - s.total_orders) as orders_until_subscription
from sellers s;

-- Update check_seller_subscription function
create or replace function check_seller_subscription()
returns trigger as $$
declare
    seller_record sellers%rowtype;
    order_count integer;
begin
    -- Get seller record with current order count
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

    -- Check if this would be beyond the 3rd order
    if order_count > 3 and seller_record.subscription_status != 'active' then
        raise exception 'Subscription required after 3 orders. Please subscribe to continue accepting orders.';
    end if;

    -- Increment total orders
    update sellers
    set total_orders = order_count + 1
    where id = new.seller_id;

    return new;
end;
$$ language plpgsql;

-- Force schema cache refresh
notify pgrst, 'reload schema';