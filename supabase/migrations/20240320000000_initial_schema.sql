-- Drop existing tables if they exist
drop table if exists public.orders cascade;
drop table if exists public.connected_accounts cascade;
drop table if exists public.sellers cascade;
drop table if exists public.settings cascade;
drop table if exists public.state_rules cascade;

-- Create sellers table
create table public.sellers (
    id uuid primary key,
    name text not null,
    business_name text not null,
    business_address text not null,
    email text not null unique,
    phone text not null,
    firewood_unit text,
    price_per_unit decimal(10,2),
    max_delivery_distance integer,
    min_delivery_fee decimal(10,2),
    price_per_mile decimal(10,2),
    payment_timing text default 'delivery',
    profile_image text,
    bio text,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint sellers_status_check check (status in ('pending', 'approved', 'rejected')),
    constraint sellers_firewood_unit_check check (firewood_unit in ('cords', 'facecords', 'ricks')),
    constraint sellers_payment_timing_check check (payment_timing in ('scheduling', 'delivery'))
);

-- Create connected_accounts table
create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) not null,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);

-- Create orders table
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id),
    customer_name text not null,
    customer_email text not null,
    product_id text not null,
    product_name text not null,
    quantity integer not null default 1,
    total_amount decimal(10,2) not null,
    status text not null default 'pending',
    stripe_customer_id text,
    stripe_payment_id text,
    stripe_account_id text not null,
    stripe_payment_status text check (stripe_payment_status in ('pending', 'succeeded', 'failed')),
    stripe_payment_intent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint orders_status_check check (status in ('pending', 'processing', 'completed', 'cancelled'))
);

-- Create settings table
create table public.settings (
    id uuid primary key default uuid_generate_v4(),
    dev_mode boolean not null default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into public.settings (dev_mode) values (false);

-- Enable RLS
alter table public.sellers enable row level security;
alter table public.connected_accounts enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- Create policies
create policy "Enable read for all users"
    on public.sellers for select
    using (true);

create policy "Enable insert for authenticated users"
    on public.sellers for insert
    to authenticated
    with check (auth.uid() = id);

create policy "Enable update for authenticated users"
    on public.sellers for update
    to authenticated
    using (auth.uid() = id);

-- Create policies for connected accounts
create policy "Enable read access for everyone"
    on public.connected_accounts for select
    using (true);

create policy "Enable write access for authenticated users"
    on public.connected_accounts for all
    to authenticated
    using (true)
    with check (true);

-- Create policies for orders
create policy "Enable read for order owners"
    on public.orders for select
    to authenticated
    using (seller_id = auth.uid());

create policy "Enable insert for authenticated users"
    on public.orders for insert
    to authenticated
    with check (true);

create policy "Enable update for order owners"
    on public.orders for update
    to authenticated
    using (seller_id = auth.uid());

-- Create policies for settings
create policy "Enable read for everyone"
    on public.settings for select
    using (true);

create policy "Enable update for everyone"
    on public.settings for update
    using (true)
    with check (true);

-- Create seller view with Stripe info
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
create index idx_sellers_status on public.sellers(status);
create index idx_connected_accounts_seller_id on public.connected_accounts(seller_id);
create index idx_connected_accounts_stripe_account_id on public.connected_accounts(stripe_account_id);
create index idx_orders_seller_id on public.orders(seller_id);
create index idx_orders_stripe_account_id on public.orders(stripe_account_id);
create index idx_orders_stripe_status on public.orders(stripe_payment_status);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on sellers_with_stripe to anon, authenticated;