-- Drop existing view
drop view if exists order_management cascade;

-- Create comprehensive order management view
create view order_management as
select 
    o.*,
    s.business_name as seller_name,
    s.email as seller_email,
    s.phone as seller_phone,
    s.business_address as seller_address
from orders o
left join sellers s on o.seller_id = s.id;

-- Create RLS policies for orders
drop policy if exists "Enable read access for everyone" on public.orders;
drop policy if exists "Enable insert access for everyone" on public.orders;
drop policy if exists "Enable update access for everyone" on public.orders;

create policy "Enable read access for everyone"
    on public.orders for select
    using (true);

create policy "Enable insert access for everyone"
    on public.orders for insert
    with check (true);

create policy "Enable update access for everyone"
    on public.orders for update
    using (true);

-- Grant permissions
grant select on order_management to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';