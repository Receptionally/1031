-- Add setup intent fields to sellers table
alter table public.sellers
  add column if not exists setup_intent_id text,
  add column if not exists setup_intent_status text check (setup_intent_status in ('requires_payment_method', 'requires_confirmation', 'succeeded', 'canceled')) default 'requires_payment_method';

-- Create function to update setup intent status
create or replace function update_seller_setup_intent(
  seller_id uuid,
  setup_intent_id text,
  status text
) returns void as $$
begin
  update sellers
  set 
    setup_intent_id = setup_intent_id,
    setup_intent_status = status,
    subscription_status = case
      when status = 'succeeded' then 'active'
      else subscription_status
    end
  where id = seller_id;
end;
$$ language plpgsql security definer;

-- Update seller subscription status view
create or replace view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
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
grant execute on function update_seller_setup_intent to authenticated;