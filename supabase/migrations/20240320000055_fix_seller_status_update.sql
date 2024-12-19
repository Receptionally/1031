-- Drop existing policies for sellers
drop policy if exists "Enable read for all users" on public.sellers;
drop policy if exists "Enable insert for authenticated users" on public.sellers;
drop policy if exists "Enable update for authenticated users" on public.sellers;

-- Create more permissive policies for sellers
create policy "Enable read access for everyone"
    on public.sellers for select
    using (true);

create policy "Enable insert access for authenticated users"
    on public.sellers for insert
    to authenticated
    with check (auth.uid() = id);

create policy "Enable update access for everyone"
    on public.sellers for update
    using (true)
    with check (true);

-- Create view for seller management
create or replace view seller_management as
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
grant select on seller_management to anon, authenticated;