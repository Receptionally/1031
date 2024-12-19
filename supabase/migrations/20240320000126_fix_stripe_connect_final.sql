-- Drop existing policies
drop policy if exists "Enable read access for everyone" on public.connected_accounts;
drop policy if exists "Enable insert access for everyone" on public.connected_accounts;
drop policy if exists "Enable update access for everyone" on public.connected_accounts;
drop policy if exists "Enable delete access for everyone" on public.connected_accounts;

-- Create more permissive policies for connected_accounts
create policy "Enable read access for everyone"
    on public.connected_accounts for select
    using (true);

create policy "Enable insert access for everyone"
    on public.connected_accounts for insert
    with check (true);

create policy "Enable update access for everyone"
    on public.connected_accounts for update
    using (true);

create policy "Enable delete access for everyone"
    on public.connected_accounts for delete
    using (true);

-- Create view for connected accounts with seller info
create or replace view connected_accounts_view as
select 
    ca.*,
    s.business_name,
    s.email,
    s.status as seller_status,
    s.profile_image,
    (
        select count(*)::integer 
        from orders o 
        where o.stripe_account_id = ca.stripe_account_id
    ) as total_orders,
    (
        select coalesce(sum(total_amount), 0)::decimal(10,2)
        from orders o 
        where o.stripe_account_id = ca.stripe_account_id
        and o.stripe_payment_status = 'succeeded'
    ) as total_processed
from connected_accounts ca
join sellers s on ca.seller_id = s.id;

-- Create indexes for better performance
create index if not exists idx_connected_accounts_seller_id 
    on connected_accounts(seller_id);
create index if not exists idx_connected_accounts_stripe_id 
    on connected_accounts(stripe_account_id);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on connected_accounts_view to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';