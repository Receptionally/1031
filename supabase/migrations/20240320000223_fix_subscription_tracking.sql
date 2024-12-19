-- Drop existing views
drop view if exists seller_subscription_status cascade;

-- Create view for seller subscription status with proper order tracking
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

-- Create function to increment order count
create or replace function increment_seller_orders(
  p_seller_id uuid
) returns void as $$
begin
  update sellers
  set total_orders = total_orders + 1
  where id = p_seller_id;
end;
$$ language plpgsql security definer;

-- Grant permissions
grant select on seller_subscription_status to authenticated;
grant execute on function increment_seller_orders to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';