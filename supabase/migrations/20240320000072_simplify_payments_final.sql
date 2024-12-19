-- Remove cash payment options and simplify schema
alter table public.sellers
  drop column if exists accepts_cash_on_delivery,
  alter column payment_timing set default 'delivery';

-- Update orders table to only allow card payments
alter table public.orders
  drop column if exists payment_method,
  add column if not exists stripe_payment_status text check (stripe_payment_status in ('pending', 'succeeded', 'failed')),
  add column if not exists stripe_payment_intent text;

-- Update existing orders
update public.orders
set stripe_payment_status = 'pending'
where stripe_payment_status is null;

-- Create indexes for better performance
create index if not exists idx_orders_stripe_status 
    on orders(stripe_account_id, stripe_payment_status);
create index if not exists idx_orders_seller_stripe 
    on orders(seller_id, stripe_account_id);

-- Force schema cache refresh
notify pgrst, 'reload schema';