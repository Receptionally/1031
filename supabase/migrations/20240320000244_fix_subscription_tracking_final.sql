-- Create function to increment order count and check subscription
create or replace function check_seller_subscription()
returns trigger as $$
declare
  seller_record record;
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

  -- Check if this would be the 4th order
  if order_count >= 3 and seller_record.subscription_status != 'active' then
    raise exception 'Subscription required after 3 orders. Please subscribe to continue accepting orders.';
  end if;

  -- Increment total orders
  update sellers
  set total_orders = order_count + 1
  where id = new.seller_id;

  return new;
end;
$$ language plpgsql;

-- Create trigger to check subscription before order
drop trigger if exists check_seller_subscription_trigger on orders;
create trigger check_seller_subscription_trigger
  before insert on orders
  for each row
  execute function check_seller_subscription();

-- Create view for seller subscription status
create or replace view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
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

-- Grant permissions
grant select on seller_subscription_status to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';