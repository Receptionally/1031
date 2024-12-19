-- Add seller_id to orders table
alter table public.orders
  add column if not exists seller_id uuid references public.sellers(id);

-- Update RLS policies for orders
drop policy if exists "Enable read for all users" on public.orders;
drop policy if exists "Enable write for all users" on public.orders;
drop policy if exists "Enable update for all users" on public.orders;

-- Create new policies
create policy "Enable read for authenticated sellers"
  on public.orders for select
  to authenticated
  using (
    auth.uid() = seller_id or 
    exists (
      select 1 from public.sellers 
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Enable insert for authenticated users"
  on public.orders for insert
  to authenticated
  with check (true);

create policy "Enable update for order owners"
  on public.orders for update
  to authenticated
  using (
    auth.uid() = seller_id or 
    exists (
      select 1 from public.sellers 
      where id = auth.uid() and status = 'approved'
    )
  );