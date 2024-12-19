-- Remove cash payment options and simplify schema
alter table public.sellers
  drop column if exists accepts_cash_on_delivery,
  alter column payment_timing set default 'delivery';

-- Update orders table to only allow card payments
alter table public.orders
  drop column if exists payment_method,
  add column if not exists stripe_payment_status text check (stripe_payment_status in ('pending', 'succeeded', 'failed')),
  add column if not exists stripe_payment_intent text;

-- Create view for admin Stripe accounts
create or replace view admin_stripe_accounts_view as
select 
    s.id as seller_id,
    s.business_name,
    s.email,
    s.phone,
    s.business_address,
    s.status as seller_status,
    s.profile_image,
    ca.stripe_account_id,
    ca.connected_at,
    (
        select count(*)::integer 
        from orders o 
        where o.seller_id = s.id
        and o.stripe_account_id = ca.stripe_account_id
    ) as total_orders,
    (
        select coalesce(sum(total_amount), 0)::decimal(10,2)
        from orders o 
        where o.seller_id = s.id
        and o.stripe_account_id = ca.stripe_account_id
        and o.stripe_payment_status = 'succeeded'
    ) as total_processed
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
order by ca.connected_at desc nulls last;

-- Create indexes for better performance
create index if not exists idx_orders_stripe_status 
    on orders(stripe_account_id, stripe_payment_status);
create index if not exists idx_orders_seller_stripe 
    on orders(seller_id, stripe_account_id);

-- Grant permissions
grant select on admin_stripe_accounts_view to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';