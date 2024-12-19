-- Drop existing views
drop view if exists seller_subscription_status cascade;
drop view if exists seller_payment_status cascade;

-- Add missing subscription fields to sellers table
alter table public.sellers
  add column if not exists total_orders integer default 0,
  add column if not exists subscription_status text check (subscription_status in ('none', 'active', 'past_due', 'canceled')) default 'none',
  add column if not exists subscription_id text,
  add column if not exists subscription_start_date timestamp with time zone,
  add column if not exists subscription_end_date timestamp with time zone,
  add column if not exists setup_intent_id text,
  add column if not exists setup_intent_status text check (setup_intent_status in ('requires_payment_method', 'requires_confirmation', 'succeeded', 'canceled')),
  add column if not exists debt_amount decimal(10,2) default 0,
  add column if not exists last_failed_charge timestamp with time zone,
  add column if not exists failed_charge_amount decimal(10,2);

-- Create view for seller subscription status
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

-- Create function to update setup intent status
create or replace function update_seller_setup_intent(
  p_seller_id uuid,
  p_setup_intent_id text,
  p_status text
) returns void as $$
begin
  update sellers
  set 
    setup_intent_id = p_setup_intent_id,
    setup_intent_status = p_status,
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

-- Grant permissions
grant select on seller_subscription_status to authenticated;
grant execute on function record_failed_charge to authenticated;
grant execute on function clear_seller_debt to authenticated;
grant execute on function update_seller_setup_intent to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';