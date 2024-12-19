-- Add subscription fields to sellers table
alter table public.sellers
  add column subscription_status text check (subscription_status in ('none', 'active', 'past_due', 'canceled')) default 'none',
  add column subscription_id text,
  add column subscription_start_date timestamp with time zone,
  add column subscription_end_date timestamp with time zone,
  add column total_orders integer default 0,
  add column requires_subscription boolean generated always as (total_orders >= 3) stored;

-- Create function to increment order count and check subscription
create or replace function check_seller_subscription()
returns trigger as $$
declare
  seller_record record;
begin
  -- Get seller record
  select * into seller_record
  from sellers
  where id = new.seller_id;

  -- Increment total orders
  update sellers
  set total_orders = total_orders + 1
  where id = new.seller_id;

  -- Check if subscription required
  if seller_record.total_orders >= 2 and seller_record.subscription_status = 'none' then
    raise exception 'Subscription required after 3 orders. Please subscribe to continue accepting orders.';
  end if;

  return new;
end;
$$ language plpgsql;

-- Create trigger to check subscription before order
create trigger check_seller_subscription_trigger
  before insert on orders
  for each row
  execute function check_seller_subscription();

-- Create view for subscription status
create or replace view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
  s.subscription_start_date,
  s.subscription_end_date,
  s.requires_subscription,
  case
    when s.subscription_status = 'active' then true
    when s.total_orders < 3 then true
    else false
  end as can_accept_orders
from sellers s;