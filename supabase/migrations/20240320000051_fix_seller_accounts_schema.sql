-- Drop existing connected_accounts table if it exists
drop table if exists public.connected_accounts cascade;

-- Create connected_accounts table with proper relationships
create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) not null,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);

-- Create indexes for better performance
create index if not exists idx_connected_accounts_seller_id on public.connected_accounts(seller_id);
create index if not exists idx_connected_accounts_stripe_account_id on public.connected_accounts(stripe_account_id);

-- Enable RLS
alter table public.connected_accounts enable row level security;

-- Create policies for connected_accounts
create policy "Enable read access for authenticated users"
    on public.connected_accounts for select
    to authenticated
    using (true);

create policy "Enable insert access for authenticated users"
    on public.connected_accounts for insert
    to authenticated
    with check (auth.uid() = seller_id);

create policy "Enable update access for authenticated users"
    on public.connected_accounts for update
    to authenticated
    using (auth.uid() = seller_id);

create policy "Enable delete access for authenticated users"
    on public.connected_accounts for delete
    to authenticated
    using (auth.uid() = seller_id);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;