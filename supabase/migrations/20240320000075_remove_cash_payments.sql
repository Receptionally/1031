-- Remove cash payment options and simplify schema
alter table public.sellers
  drop column if exists accepts_cash_on_delivery,
  alter column payment_timing set default 'delivery';

-- Update orders table to only allow card payments
alter table public.orders
  drop column if exists payment_method,
  add column if not exists stripe_payment_status text check (stripe_payment_status in ('pending', 'succeeded', 'failed')),
  add column if not exists stripe_payment_intent text;

-- Create view for sellers with their Stripe accounts
create or replace view sellers_with_stripe as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account
from sellers s
left join connected_accounts ca on s.id = ca.seller_id;

-- Create indexes for better performance
create index if not exists idx_orders_stripe_status 
    on orders(stripe_account_id, stripe_payment_status);
create index if not exists idx_orders_seller_stripe 
    on orders(seller_id, stripe_account_id);

-- Grant permissions
grant select on sellers_with_stripe to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';