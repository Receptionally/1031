-- Drop existing views
drop view if exists seller_subscription_status cascade;

-- Add payment method fields to sellers table if they don't exist
alter table public.sellers
  add column if not exists default_payment_method text,
  add column if not exists stripe_customer_id text,
  add column if not exists card_last4 text,
  add column if not exists card_brand text;

-- Create view for seller subscription status with payment info
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

-- Update setup intent function to handle payment method
create or replace function update_seller_setup_intent(
  p_seller_id uuid,
  p_setup_intent_id text,
  p_status text,
  p_client_secret text,
  p_card_last4 text default null,
  p_card_brand text default null,
  p_payment_method text default null,
  p_customer_id text default null
) returns void as $$
begin
  update sellers
  set 
    setup_intent_id = p_setup_intent_id,
    setup_intent_status = p_status,
    setup_intent_client_secret = p_client_secret,
    card_last4 = coalesce(p_card_last4, card_last4),
    card_brand = coalesce(p_card_brand, card_brand),
    default_payment_method = coalesce(p_payment_method, default_payment_method),
    stripe_customer_id = coalesce(p_customer_id, stripe_customer_id),
    subscription_status = case
      when p_status = 'succeeded' then 'active'
      else subscription_status
    end,
    subscription_start_date = case
      when p_status = 'succeeded' then now()
      else subscription_start_date
    end
  where id = p_seller_id;
end;
$$ language plpgsql security definer;

-- Create function to record failed charge
create or replace function record_failed_charge(
  p_seller_id uuid,
  p_amount decimal
) returns void as $$
begin
  update sellers
  set 
    debt_amount = coalesce(debt_amount, 0) + p_amount,
    last_failed_charge = now(),
    failed_charge_amount = p_amount,
    subscription_status = 'past_due'
  where id = p_seller_id;
end;
$$ language plpgsql security definer;

-- Create function to clear seller debt
create or replace function clear_seller_debt(
  p_seller_id uuid
) returns void as $$
begin
  update sellers
  set 
    debt_amount = 0,
    last_failed_charge = null,
    failed_charge_amount = null,
    subscription_status = 'active'
  where id = p_seller_id;
end;
$$ language plpgsql security definer;

-- Create indexes for better performance
create index if not exists idx_sellers_payment_method 
    on sellers(id, stripe_customer_id, default_payment_method);
create index if not exists idx_sellers_subscription_status 
    on sellers(id, subscription_status, total_orders);

-- Grant permissions
grant select on seller_subscription_status to authenticated;
grant execute on function update_seller_setup_intent to authenticated;
grant execute on function record_failed_charge to authenticated;
grant execute on function clear_seller_debt to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';