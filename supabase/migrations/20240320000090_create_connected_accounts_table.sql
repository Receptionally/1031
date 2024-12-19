-- Create connected_accounts table
create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid not null references public.sellers(id) on delete cascade,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);