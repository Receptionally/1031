-- Drop existing policies
drop policy if exists "Enable read access for authenticated users" on public.connected_accounts;
drop policy if exists "Enable write access for account owners" on public.connected_accounts;
drop policy if exists "Enable read access for everyone" on public.connected_accounts;

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

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on sellers_with_stripe to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';