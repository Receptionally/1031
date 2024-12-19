-- Create or replace subscription status view
create or replace view seller_subscription_status as
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

-- Create function to update setup intent status
create or replace function update_seller_setup_intent(
  p_seller_id uuid,
  p_setup_intent_id text,
  p_status text,
  p_client_secret text,
  p_card_last4 text default null,
  p_card_brand text default null
) returns void as $$
begin
  update sellers
  set 
    setup_intent_id = p_setup_intent_id,
    setup_intent_status = p_status,
    setup_intent_client_secret = p_client_secret,
    card_last4 = coalesce(p_card_last4, card_last4),
    card_brand = coalesce(p_card_brand, card_brand),
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
grant execute on function update_seller_setup_intent to authenticated;