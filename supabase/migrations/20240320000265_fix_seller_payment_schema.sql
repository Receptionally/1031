-- First drop the existing view
drop view if exists seller_subscription_status cascade;

-- Add payment method fields to sellers table
alter table public.sellers
  add column if not exists default_payment_method text,
  add column if not exists stripe_customer_id text,
  add column if not exists card_last4 text,
  add column if not exists card_brand text;

-- Create view for seller subscription status
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
  s.default_payment_method,
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