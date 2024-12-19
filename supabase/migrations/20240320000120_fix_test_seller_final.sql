-- Drop existing policies
drop policy if exists "Enable insert access for everyone" on public.sellers;
drop policy if exists "Enable update access for everyone" on public.sellers;
drop policy if exists "Enable read access for everyone" on public.sellers;

-- Create new policies for sellers
create policy "Enable read access for everyone"
    on public.sellers for select
    using (true);

create policy "Enable insert access for everyone"
    on public.sellers for insert
    with check (true);

create policy "Enable update access for everyone"
    on public.sellers for update
    using (true)
    with check (true);

-- Create indexes for better performance
create index if not exists idx_sellers_email on public.sellers(email);
create index if not exists idx_sellers_location on public.sellers(business_address);
create index if not exists idx_sellers_status on public.sellers(status);

-- Create view for seller search
create or replace view seller_search_view as
select 
    s.*,
    substring(s.business_address from '.*, ([A-Z]{2}) \d{5}.*') as state_code
from sellers s
where s.status = 'approved';

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on seller_search_view to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';