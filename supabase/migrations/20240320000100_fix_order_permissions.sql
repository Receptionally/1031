-- Drop existing policies
drop policy if exists "Enable read access for order owners" on public.orders;
drop policy if exists "Enable insert access for authenticated users" on public.orders;
drop policy if exists "Enable update access for order owners" on public.orders;

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

-- Create policy for anonymous order creation
create policy "Enable anonymous order creation"
    on public.orders for insert
    to anon
    with check (true);

-- Grant permissions to anonymous users
grant usage on schema public to anon;
grant all on public.orders to anon;
grant all on public.orders_id_seq to anon;

-- Force schema cache refresh
notify pgrst, 'reload schema';