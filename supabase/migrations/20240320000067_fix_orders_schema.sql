-- Add payment-related fields to orders table
alter table public.orders
  add column if not exists payment_method text check (payment_method in ('card', 'cash')),
  add column if not exists payment_timing text check (payment_timing in ('scheduling', 'delivery')),
  add column if not exists payment_status text check (payment_status in ('pending', 'paid', 'failed')),
  add column if not exists payment_date timestamp with time zone;

-- Add indexes for better performance
create index if not exists idx_orders_seller_payment 
  on public.orders(seller_id, payment_method, payment_status);
create index if not exists idx_orders_customer 
  on public.orders(customer_email, customer_name);

-- Update existing orders
update public.orders
set
  payment_method = 'card',
  payment_timing = 'delivery',
  payment_status = 'pending'
where payment_method is null;

-- Force schema cache refresh
notify pgrst, 'reload schema';