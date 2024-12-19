-- Add debt tracking fields to sellers table
alter table public.sellers
  add column if not exists debt_amount decimal(10,2) default 0,
  add column if not exists last_failed_charge timestamp with time zone,
  add column if not exists failed_charge_amount decimal(10,2);

-- Create view for seller payment status
create or replace view seller_payment_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
  s.debt_amount,
  s.last_failed_charge,
  s.failed_charge_amount,
  case
    when s.debt_amount > 0 then false
    when s.subscription_status = 'active' then true
    when s.total_orders < 3 then true
    else false
  end as can_accept_orders,
  case
    when s.total_orders >= 3 then true
    else false
  end as requires_subscription
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

-- Grant permissions
grant select on seller_payment_status to authenticated;
grant execute on function record_failed_charge to authenticated;
grant execute on function clear_seller_debt to authenticated;