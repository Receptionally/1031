-- Drop existing policies
drop policy if exists "Enable read access for everyone" on public.connected_accounts;
drop policy if exists "Enable insert access for authenticated users" on public.connected_accounts;
drop policy if exists "Enable update access for authenticated users" on public.connected_accounts;
drop policy if exists "Enable delete access for authenticated users" on public.connected_accounts;

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

-- Create view for connected accounts
create or replace view connected_accounts_view as
select 
    ca.*,
    s.business_name,
    s.email,
    s.status as seller_status
from connected_accounts ca
join sellers s on ca.seller_id = s.id;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on connected_accounts_view to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';