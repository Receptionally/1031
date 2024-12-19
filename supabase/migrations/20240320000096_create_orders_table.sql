-- Create orders table
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid not null references public.sellers(id) on delete cascade,
    customer_name text not null,
    customer_email text not null,
    product_name text not null,
    quantity integer not null default 1,
    total_amount decimal(10,2) not null,
    status text not null default 'pending',
    stripe_customer_id text,
    stripe_payment_intent text,
    stripe_payment_status text check (stripe_payment_status in ('pending', 'succeeded', 'failed')),
    stripe_account_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint orders_status_check check (status in ('pending', 'processing', 'completed', 'cancelled'))
);

-- Create indexes
create index idx_orders_seller_id on public.orders(seller_id);
create index idx_orders_stripe_account on public.orders(stripe_account_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_created_at on public.orders(created_at desc);

-- Enable RLS
alter table public.orders enable row level security;

-- Create RLS policies
create policy "Enable read access for order owners"
    on public.orders for select
    to authenticated
    using (seller_id = auth.uid());

create policy "Enable insert access for authenticated users"
    on public.orders for insert
    to authenticated
    with check (true);

create policy "Enable update access for order owners"
    on public.orders for update
    to authenticated
    using (seller_id = auth.uid());

-- Create view for order statistics
create view order_statistics as
select 
    seller_id,
    count(*) as total_orders,
    sum(case when status = 'completed' then 1 else 0 end) as completed_orders,
    sum(case when stripe_payment_status = 'succeeded' then total_amount else 0 end) as total_revenue
from orders
group by seller_id;

-- Grant permissions
grant select on order_statistics to authenticated;