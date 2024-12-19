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

-- Create more permissive policies for connected_accounts
create policy "Enable read access for everyone"
    on public.connected_accounts for select
    using (true);

create policy "Enable insert access for authenticated users"
    on public.connected_accounts for insert
    to authenticated
    with check (true);

create policy "Enable update access for authenticated users"
    on public.connected_accounts for update
    to authenticated
    using (true);

create policy "Enable delete access for authenticated users"
    on public.connected_accounts for delete
    to authenticated
    using (true);

-- Update sellers table
alter table public.sellers
  add column if not exists accepts_cash_on_delivery boolean not null default false,
  add column if not exists payment_timing text check (payment_timing in ('scheduling', 'delivery'));

-- Create view for sellers with payment info
create or replace view seller_payment_info as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account
from public.sellers s
left join public.connected_accounts ca on s.id = ca.seller_id;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on seller_payment_info to anon, authenticated;