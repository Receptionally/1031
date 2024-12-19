-- Drop existing triggers and functions
drop trigger if exists charge_seller_subscription_trigger on orders;
drop function if exists charge_seller_subscription cascade;

-- Create function to record subscription charge
create or replace function record_subscription_charge(
  p_seller_id uuid,
  p_order_id uuid,
  p_payment_intent_id text,
  p_amount integer
) returns void as $$
declare
  existing_charge payment_intents%rowtype;
begin
  -- Check for existing charge
  select * into existing_charge
  from payment_intents
  where order_id = p_order_id
  and type = 'subscription_charge';

  -- Only create if no existing charge
  if not found then
    insert into payment_intents (
      seller_id,
      order_id,
      stripe_payment_intent_id,
      amount,
      status,
      type
    ) values (
      p_seller_id,
      p_order_id,
      p_payment_intent_id,
      p_amount,
      'pending',
      'subscription_charge'
    );
  end if;
end;
$$ language plpgsql security definer;

-- Create function to update charge status
create or replace function update_charge_status(
  p_payment_intent_id text,
  p_status text
) returns void as $$
begin
  update payment_intents
  set 
    status = p_status,
    updated_at = now()
  where stripe_payment_intent_id = p_payment_intent_id;

  -- Update seller status based on charge result
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

-- Create function to check if charge needed
create or replace function should_charge_seller(
  p_seller_id uuid,
  p_order_id uuid
) returns boolean as $$
declare
  seller_record sellers%rowtype;
  order_count integer;
begin
  -- Get seller record
  select * into seller_record
  from sellers
  where id = p_seller_id;

  if not found then
    return false;
  end if;

  -- Get order count excluding current order
  select count(*) into order_count
  from orders
  where seller_id = p_seller_id
  and id != p_order_id;

  -- Return true if beyond 3rd order and subscription active
  return order_count > 3 and seller_record.subscription_status = 'active';
end;
$$ language plpgsql security definer;

-- Grant permissions
grant execute on function record_subscription_charge to authenticated;
grant execute on function update_charge_status to authenticated;
grant execute on function should_charge_seller to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';