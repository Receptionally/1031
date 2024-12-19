-- Drop existing policies
drop policy if exists "Enable read for account owners" on public.connected_accounts;
drop policy if exists "Enable insert for account owners" on public.connected_accounts;
drop policy if exists "Enable update for account owners" on public.connected_accounts;
drop policy if exists "Enable delete for account owners" on public.connected_accounts;

-- Create more permissive policies for connected_accounts
create policy "Enable read access for authenticated users"
  on public.connected_accounts
  for select
  to authenticated
  using (true);

create policy "Enable insert access for authenticated users"
  on public.connected_accounts
  for insert
  to authenticated
  with check (auth.uid() = seller_id);

create policy "Enable update access for authenticated users"
  on public.connected_accounts
  for update
  to authenticated
  using (auth.uid() = seller_id);

create policy "Enable delete access for authenticated users"
  on public.connected_accounts
  for delete
  to authenticated
  using (auth.uid() = seller_id);

-- Add indexes for better performance
create index if not exists idx_connected_accounts_seller_id 
  on public.connected_accounts(seller_id);

create index if not exists idx_connected_accounts_stripe_account_id 
  on public.connected_accounts(stripe_account_id);