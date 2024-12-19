-- Drop existing function
drop function if exists update_seller_setup_intent cascade;

-- Create updated function with payment method handling
create or replace function update_seller_setup_intent(
  p_seller_id uuid,
  p_setup_intent_id text,
  p_status text,
  p_client_secret text,
  p_card_last4 text default null,
  p_card_brand text default null,
  p_payment_method text default null
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

-- Grant execute permission
grant execute on function update_seller_setup_intent to authenticated;