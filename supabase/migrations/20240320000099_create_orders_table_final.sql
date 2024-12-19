-- Drop existing orders table if it exists
drop table if exists public.orders cascade;

-- Create orders table with proper schema
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
    stacking_included boolean not null default false,
    stacking_fee decimal(10,2) not null default 0,
    delivery_fee decimal(10,2) not null default 0,
    delivery_address text not null,
    delivery_distance decimal(10,2),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint orders_status_check check (status in ('pending', 'processing', 'completed', 'cancelled')),
    constraint orders_quantity_check check (quantity > 0),
    constraint orders_total_amount_check check (total_amount >= 0),
    constraint orders_stacking_fee_check check (stacking_fee >= 0),
    constraint orders_delivery_fee_check check (delivery_fee >= 0)
);

-- Create indexes for better performance
create index idx_orders_seller_id on public.orders(seller_id);
create index idx_orders_stripe_account on public.orders(stripe_account_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_created_at on public.orders(created_at desc);

-- Create updated_at trigger function
create or replace function update_orders_timestamp()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_orders_timestamp
    before update on public.orders
    for each row
    execute function update_orders_timestamp();

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
create or replace view order_statistics as
select 
    seller_id,
    count(*) as total_orders,
    sum(case when status = 'completed' then 1 else 0 end) as completed_orders,
    sum(case when stripe_payment_status = 'succeeded' then total_amount else 0 end) as total_revenue,
    sum(case when stacking_included then stacking_fee else 0 end) as total_stacking_fees,
    sum(delivery_fee) as total_delivery_fees
from orders
group by seller_id;

-- Grant permissions
grant select on order_statistics to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';