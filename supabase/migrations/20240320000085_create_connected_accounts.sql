-- Drop existing connected_accounts table if it exists
drop table if exists public.connected_accounts cascade;

-- Create connected_accounts table
create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid not null references public.sellers(id) on delete cascade,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);

-- Create indexes for better performance
create index idx_connected_accounts_seller_id on public.connected_accounts(seller_id);
create index idx_connected_accounts_stripe_account on public.connected_accounts(stripe_account_id);

-- Enable RLS
alter table public.connected_accounts enable row level security;

-- Create RLS policies
create policy "Enable read access for authenticated users"
    on public.connected_accounts for select
    to authenticated
    using (true);

create policy "Enable write access for account owners"
    on public.connected_accounts for all
    to authenticated
    with check (seller_id = auth.uid());

-- Create view for sellers with Stripe accounts
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

-- Create admin view for Stripe accounts
create or replace view admin_stripe_accounts_view as
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

-- Grant permissions
grant select on sellers_with_stripe to authenticated;
grant select on admin_stripe_accounts_view to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';