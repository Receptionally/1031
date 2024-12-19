-- Drop all existing subscription charge related functions and triggers
drop trigger if exists charge_seller_subscription_trigger on orders;
drop function if exists charge_seller_subscription cascade;
drop function if exists record_subscription_charge cascade;
drop function if exists update_charge_status cascade;
drop function if exists should_charge_seller cascade;

-- Add charge tracking fields to sellers
alter table public.sellers
  add column if not exists last_subscription_charge timestamp with time zone,
  add column if not exists next_charge_date timestamp with time zone;

-- Create function to check if seller needs charging
create or replace function should_charge_seller(
  p_seller_id uuid
) returns boolean as $$
declare
  seller_record sellers%rowtype;
begin
  -- Get seller record
  select * into seller_record
  from sellers
  where id = p_seller_id;

  if not found then
    return false;
  end if;

  -- Don't charge if:
  -- 1. Subscription not active
  -- 2. Under 3 orders
  -- 3. Already charged in last 24 hours
  -- 4. Has pending/unresolved charge
  return 
    seller_record.subscription_status = 'active' and
    seller_record.total_orders > 3 and
    (seller_record.last_subscription_charge is null or 
     seller_record.last_subscription_charge < now() - interval '24 hours') and
    not exists (
      select 1 
      from payment_intents 
      where seller_id = p_seller_id 
      and type = 'subscription_charge'
      and status = 'pending'
    );
end;
$$ language plpgsql security definer;

-- Create function to record subscription charge
create or replace function record_subscription_charge(
  p_seller_id uuid,
  p_payment_intent_id text,
  p_amount integer
) returns void as $$
begin
  -- Only proceed if seller should be charged
  if should_charge_seller(p_seller_id) then
    -- Record the charge
    insert into payment_intents (
      seller_id,
      stripe_payment_intent_id,
      amount,
      status,
      type
    ) values (
      p_seller_id,
      p_payment_intent_id,
      p_amount,
      'pending',
      'subscription_charge'
    );

    -- Update seller's charge tracking
    update sellers
    set 
      last_subscription_charge = now(),
      next_charge_date = now() + interval '24 hours'
    where id = p_seller_id;
  end if;
end;
$$ language plpgsql security definer;

-- Create function to update charge status
create or replace function update_charge_status(
  p_payment_intent_id text,
  p_status text
) returns void as $$
begin
  -- Update payment intent status
  update payment_intents
  set 
    status = p_status,
    updated_at = now()
  where stripe_payment_intent_id = p_payment_intent_id;

  -- Update seller status based on result
  if p_status = 'succeeded' then
    update sellers s
    set 
      debt_amount = 0,
      last_failed_charge = null,
      failed_charge_amount = null,
      subscription_status = 'active'
    from payment_intents pi
    where pi.stripe_payment_intent_id = p_payment_intent_id
    and pi.seller_id = s.id;
  elsif p_status = 'failed' then
    update sellers s
    set 
      debt_amount = coalesce(debt_amount, 0) + (pi.amount::decimal / 100),
      last_failed_charge = now(),
      failed_charge_amount = pi.amount::decimal / 100,
      subscription_status = 'past_due'
    from payment_intents pi
    where pi.stripe_payment_intent_id = p_payment_intent_id
    and pi.seller_id = s.id;
  end if;
end;
$$ language plpgsql security definer;

-- Create indexes for better performance
create index if not exists idx_payment_intents_seller_date 
    on payment_intents(seller_id, created_at desc);
create index if not exists idx_payment_intents_status_type 
    on payment_intents(status, type);
create index if not exists idx_sellers_subscription_charge
    on sellers(id, subscription_status, total_orders, last_subscription_charge);

-- Grant permissions
grant execute on function should_charge_seller to authenticated;
grant execute on function record_subscription_charge to authenticated;
grant execute on function update_charge_status to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';