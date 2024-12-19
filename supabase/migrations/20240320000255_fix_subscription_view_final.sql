-- Drop existing view
drop view if exists seller_subscription_status cascade;

-- Create subscription status view with all fields
create view seller_subscription_status as
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
    when s.total_orders >= 3 then true
    else false
  end as requires_subscription,
  case
    when coalesce(s.debt_amount, 0) > 0 then false
    when s.subscription_status = 'active' then true
    when s.total_orders < 3 then true
    else false
  end as can_accept_orders,
  greatest(0, 3 - s.total_orders) as orders_until_subscription
from sellers s;

-- Create index for better performance
create index if not exists idx_sellers_subscription_status
    on sellers(id, subscription_status, total_orders);

-- Grant permissions
grant select on seller_subscription_status to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';