-- Drop existing view
drop view if exists seller_subscription_status cascade;

-- Create view for seller subscription status with correct columns
create view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
  s.setup_intent_id,
  s.setup_intent_status,
  s.subscription_start_date,
  s.subscription_end_date,
  case
    when s.total_orders >= 3 then true
    else false
  end as requires_subscription,
  case
    when s.subscription_status = 'active' then true
    when s.total_orders < 3 then true
    else false
  end as can_accept_orders,
  greatest(0, 3 - s.total_orders) as orders_until_subscription
from sellers s;

-- Grant permissions
grant select on seller_subscription_status to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';