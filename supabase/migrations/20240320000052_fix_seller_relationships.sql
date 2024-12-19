-- Drop and recreate the connected_accounts table with proper relationships
drop table if exists public.connected_accounts cascade;

create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) not null,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);

-- Create indexes
create index if not exists idx_connected_accounts_seller_id on public.connected_accounts(seller_id);
create index if not exists idx_connected_accounts_stripe_account_id on public.connected_accounts(stripe_account_id);

-- Enable RLS
alter table public.connected_accounts enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.connected_accounts for select
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

-- Add foreign key index to sellers table
create index if not exists idx_sellers_id on public.sellers(id);

-- Refresh the schema cache
notify pgrst, 'reload schema';