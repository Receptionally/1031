-- Drop existing policies
drop policy if exists "Enable read access for everyone" on public.orders;
drop policy if exists "Enable insert access for everyone" on public.orders;
drop policy if exists "Enable update access for everyone" on public.orders;

-- Create more permissive policies for orders
create policy "Enable read access for everyone"
    on public.orders for select
    using (true);

create policy "Enable insert access for everyone"
    on public.orders for insert
    with check (true);

create policy "Enable update access for everyone"
    on public.orders for update
    using (true);

-- Grant basic permissions
grant usage on schema public to anon, authenticated;
grant all on public.orders to anon, authenticated;

-- Create view for order management
create or replace view order_management as
select 
    o.*,
    s.business_name as seller_business_name,
    s.email as seller_email
from orders o
left join sellers s on o.seller_id = s.id;

-- Grant view access
grant select on order_management to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';