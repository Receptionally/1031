-- Drop existing tables if they exist
drop table if exists public.orders cascade;
drop table if exists public.connected_accounts cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create connected_accounts table
create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    stripe_account_id text not null,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_stripe_account_id_key unique (stripe_account_id)
);

-- Create orders table
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    customer_name text not null,
    customer_email text not null,
    product_id text not null,
    product_name text not null,
    quantity integer not null default 1,
    total_amount decimal(10,2) not null default 0,
    status text not null default 'pending',
    stripe_customer_id text,
    stripe_payment_id text,
    stripe_account_id text not null references connected_accounts(stripe_account_id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint orders_status_check check (status in ('pending', 'processing', 'completed', 'cancelled'))
);

-- Create indexes for better performance
create index idx_connected_accounts_connected_at on public.connected_accounts(connected_at desc);
create index idx_orders_stripe_account on public.orders(stripe_account_id);
create index idx_orders_created_at on public.orders(created_at desc);

-- Enable RLS
alter table public.connected_accounts enable row level security;
alter table public.orders enable row level security;

-- RLS policies for connected_accounts
create policy "Enable read for all users"
    on public.connected_accounts for select
    using (true);

create policy "Enable write for all users"
    on public.connected_accounts for insert
    with check (true);

create policy "Enable delete for all users"
    on public.connected_accounts for delete
    using (true);

-- RLS policies for orders
create policy "Enable read for all users"
    on public.orders for select
    using (true);

create policy "Enable write for all users"
    on public.orders for insert
    with check (true);

create policy "Enable update for all users"
    on public.orders for update
    using (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;