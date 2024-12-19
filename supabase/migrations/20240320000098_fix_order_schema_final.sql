-- Drop existing objects to ensure clean slate
drop view if exists sellers_with_stripe cascade;
drop view if exists admin_stripe_accounts_view cascade;
drop view if exists order_statistics cascade;
drop table if exists public.orders cascade;
drop table if exists public.connected_accounts cascade;
drop table if exists public.sellers cascade;

-- Create sellers table
create table public.sellers (
    id uuid primary key,
    name text not null default '',
    business_name text not null default '',
    business_address text not null default '',
    email text not null unique,
    phone text not null default '',
    firewood_unit text,
    price_per_unit decimal(10,2),
    max_delivery_distance integer,
    min_delivery_fee decimal(10,2),
    price_per_mile decimal(10,2),
    payment_timing text not null default 'delivery',
    provides_stacking boolean not null default false,
    stacking_fee_per_unit decimal(10,2) not null default 0,
    profile_image text,
    bio text,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint sellers_status_check check (status in ('pending', 'approved', 'rejected')),
    constraint sellers_firewood_unit_check check (firewood_unit in ('cords', 'facecords', 'ricks')),
    constraint sellers_payment_timing_check check (payment_timing in ('scheduling', 'delivery')),
    constraint price_per_unit_check check (price_per_unit is null or price_per_unit > 0),
    constraint max_delivery_distance_check check (max_delivery_distance is null or max_delivery_distance > 0),
    constraint min_delivery_fee_check check (min_delivery_fee is null or min_delivery_fee >= 0),
    constraint price_per_mile_check check (price_per_mile is null or price_per_mile >= 0),
    constraint stacking_fee_check check (stacking_fee_per_unit >= 0)
);

-- Create connected_accounts table
create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid not null references public.sellers(id) on delete cascade,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);

-- Create orders table with all required fields
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
create index idx_sellers_status_email on public.sellers(status, email);
create index idx_connected_accounts_seller_id on public.connected_accounts(seller_id);
create index idx_connected_accounts_stripe_account on public.connected_accounts(stripe_account_id);
create index idx_orders_seller_id on public.orders(seller_id);
create index idx_orders_stripe_account on public.orders(stripe_account_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_created_at on public.orders(created_at desc);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
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
    execute function update_updated_at_column();

-- Enable RLS
alter table public.sellers enable row level security;
alter table public.connected_accounts enable row level security;
alter table public.orders enable row level security;

-- Create RLS policies for sellers
create policy "Enable read access for everyone"
    on public.sellers for select
    using (true);

create policy "Enable insert access for authenticated users"
    on public.sellers for insert
    to authenticated
    with check (auth.uid() = id);

create policy "Enable update access for authenticated users"
    on public.sellers for update
    to authenticated
    using (auth.uid() = id);

-- Create RLS policies for connected accounts
create policy "Enable read access for authenticated users"
    on public.connected_accounts for select
    to authenticated
    using (true);

create policy "Enable write access for account owners"
    on public.connected_accounts for all
    to authenticated
    with check (seller_id = auth.uid());

-- Create RLS policies for orders
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

-- Create views
create view sellers_with_stripe as
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

create view admin_stripe_accounts_view as
select 
    s.id as seller_id,
    s.business_name,
    s.email,
    s.phone,
    s.business_address,
    s.status as seller_status,
    s.profile_image,
    s.payment_timing,
    ca.stripe_account_id,
    ca.connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
order by ca.connected_at desc nulls last;

create view order_statistics as
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
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on sellers_with_stripe to authenticated;
grant select on admin_stripe_accounts_view to authenticated;
grant select on order_statistics to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';