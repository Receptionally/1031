-- Drop existing trigger and function
drop trigger if exists check_seller_subscription_trigger on orders;
drop function if exists check_seller_subscription;

-- Create improved subscription check function
create or replace function check_seller_subscription()
returns trigger as $$
declare
  seller_record record;
begin
  -- Get seller record with current order count
  select * into seller_record
  from sellers
  where id = new.seller_id;

  if not found then
    raise exception 'Seller not found';
  end if;

  -- Check if seller can accept orders
  if seller_record.total_orders >= 3 and seller_record.subscription_status != 'active' then
    raise exception 'Subscription required after 3 orders. Please subscribe to continue accepting orders.';
  end if;

  -- Increment total orders
  update sellers
  set total_orders = total_orders + 1
  where id = new.seller_id;

  return new;
end;
$$ language plpgsql;

-- Create trigger to check subscription before order
create trigger check_seller_subscription_trigger
  before insert on orders
  for each row
  execute function check_seller_subscription();

-- Update seller search view to exclude sellers requiring subscription
create or replace view seller_search_view as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    substring(s.business_address from '.*, ([A-Z]{2}) \d{5}.*') as state_code
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
where s.status = 'approved'
and (s.total_orders < 3 or s.subscription_status = 'active');

-- Create view for seller subscription status
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
  case
    when s.total_orders >= 3 then true
    else false
  end as requires_subscription
from sellers s;