-- Drop all subscription and payment related objects
drop view if exists seller_subscription_status cascade;
drop function if exists should_charge_seller cascade;
drop function if exists record_subscription_charge cascade;
drop function if exists update_charge_status cascade;
drop function if exists charge_seller_subscription cascade;
drop table if exists payment_intents cascade;

-- Remove subscription fields from sellers table
alter table public.sellers
  drop column if exists subscription_status,
  drop column if exists subscription_id,
  drop column if exists subscription_start_date,
  drop column if exists subscription_end_date,
  drop column if exists setup_intent_id,
  drop column if exists setup_intent_status,
  drop column if exists setup_intent_client_secret,
  drop column if exists card_last4,
  drop column if exists card_brand,
  drop column if exists stripe_customer_id,
  drop column if exists default_payment_method,
  drop column if exists debt_amount,
  drop column if exists last_failed_charge,
  drop column if exists failed_charge_amount,
  drop column if exists last_subscription_charge,
  drop column if exists next_charge_date,
  drop column if exists orders_since_last_charge;

-- Update seller search view to remove subscription checks
create or replace view sellers_with_stripe as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    true as can_accept_orders -- Always allow orders
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
where s.status = 'approved';

-- Force schema cache refresh
notify pgrst, 'reload schema';