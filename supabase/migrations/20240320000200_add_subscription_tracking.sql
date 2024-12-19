-- Add subscription tracking fields to sellers table
alter table public.sellers
  add column if not exists subscription_status text check (subscription_status in ('none', 'active', 'past_due', 'canceled')) default 'none',
  add column if not exists subscription_id text,
  add column if not exists subscription_start_date timestamp with time zone,
  add column if not exists subscription_end_date timestamp with time zone,
  add column if not exists total_orders integer default 0,
  add column if not exists requires_subscription boolean generated always as (total_orders >= 3) stored;

-- Create function to update subscription status
create or replace function update_seller_subscription(
  seller_id uuid,
  new_status text,
  subscription_id text default null,
  start_date timestamp with time zone default null,
  end_date timestamp with time zone default null
) returns void as $$
begin
  update sellers
  set 
    subscription_status = new_status,
    subscription_id = coalesce(subscription_id, sellers.subscription_id),
    subscription_start_date = coalesce(start_date, sellers.subscription_start_date),
    subscription_end_date = coalesce(end_date, sellers.subscription_end_date)
  where id = seller_id;
end;
$$ language plpgsql security definer;

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
  end as can_accept_orders,
  greatest(0, 3 - s.total_orders) as orders_until_subscription
from sellers s;

-- Grant permissions
grant select on seller_subscription_status to authenticated;
grant execute on function update_seller_subscription to authenticated;