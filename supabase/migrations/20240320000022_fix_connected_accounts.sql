-- Drop and recreate the connected_accounts table with proper constraints
drop table if exists public.connected_accounts cascade;

create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) not null,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);

-- Enable RLS
alter table public.connected_accounts enable row level security;

-- Drop existing policies
drop policy if exists "Enable read for account owners" on public.connected_accounts;
drop policy if exists "Enable insert for authenticated users" on public.connected_accounts;

-- Create new policies
create policy "Enable read for account owners"
    on public.connected_accounts for select
    to authenticated
    using (seller_id = auth.uid());

create policy "Enable insert for account owners"
    on public.connected_accounts for insert
    to authenticated
    with check (seller_id = auth.uid());

create policy "Enable update for account owners"
    on public.connected_accounts for update
    to authenticated
    using (seller_id = auth.uid());

create policy "Enable delete for account owners"
    on public.connected_accounts for delete
    to authenticated
    using (seller_id = auth.uid());

-- Create indexes
create index idx_connected_accounts_seller_id on public.connected_accounts(seller_id);
create index idx_connected_accounts_stripe_account_id on public.connected_accounts(stripe_account_id);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;