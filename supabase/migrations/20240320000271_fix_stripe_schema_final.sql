-- Drop existing views
drop view if exists seller_subscription_status cascade;
drop view if exists sellers_with_stripe cascade;

-- Add missing Stripe-related columns to sellers table
alter table public.sellers
  add column if not exists stripe_customer_id text,
  add column if not exists default_payment_method text,
  add column if not exists card_last4 text,
  add column if not exists card_brand text,
  add column if not exists setup_intent_id text,
  add column if not exists setup_intent_status text check (setup_intent_status in ('requires_payment_method', 'requires_confirmation', 'succeeded', 'canceled')),
  add column if not exists setup_intent_client_secret text,
  add column if not exists subscription_status text check (subscription_status in ('none', 'active', 'past_due', 'canceled')) default 'none',
  add column if not exists subscription_start_date timestamp with time zone,
  add column if not exists subscription_end_date timestamp with time zone,
  add column if not exists debt_amount decimal(10,2) default 0,
  add column if not exists last_failed_charge timestamp with time zone,
  add column if not exists failed_charge_amount decimal(10,2);

-- Create view for seller subscription status
create view seller_subscription_status as
select distinct
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

-- Create view for sellers with Stripe info
create view sellers_with_stripe as
select distinct
    s.id,
    s.name,
    s.business_name,
    s.business_address,
    s.email,
    s.phone,
    s.firewood_unit,
    s.price_per_unit,
    s.max_delivery_distance,
    s.min_delivery_fee,
    s.price_per_mile,
    s.payment_timing,
    s.provides_stacking,
    s.stacking_fee_per_unit,
    s.max_stacking_distance,
    s.provides_kiln_dried,
    s.kiln_dried_fee_per_unit,
    s.profile_image,
    s.bio,
    s.status,
    s.created_at,
    s.total_orders,
    s.subscription_status,
    s.stripe_customer_id,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    case
        when s.subscription_status = 'active' then true
        when s.total_orders < 3 then true
        else false
    end as can_accept_orders
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
where s.status = 'approved';

-- Create indexes for better performance
create index if not exists idx_sellers_stripe_customer 
    on sellers(stripe_customer_id);
create index if not exists idx_sellers_subscription 
    on sellers(subscription_status, total_orders);
create index if not exists idx_sellers_setup_intent 
    on sellers(setup_intent_id);

-- Grant permissions
grant select on seller_subscription_status to authenticated;
grant select on sellers_with_stripe to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';