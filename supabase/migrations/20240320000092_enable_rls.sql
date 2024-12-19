-- Drop existing policies if they exist
drop policy if exists "Enable read access for everyone" on public.sellers;
drop policy if exists "Enable insert access for authenticated users" on public.sellers;
drop policy if exists "Enable update access for authenticated users" on public.sellers;
drop policy if exists "Enable read access for authenticated users" on public.connected_accounts;
drop policy if exists "Enable write access for account owners" on public.connected_accounts;

-- Enable RLS
alter table public.sellers enable row level security;
alter table public.connected_accounts enable row level security;

-- Create RLS policies for sellers
create policy "Enable read access for everyone"
    on public.sellers for select
    using (true);

create policy "Enable insert access for authenticated users"
    on public.sellers for insert
    to authenticated
    with check (auth.uid() = id);

create policy "Enable update access for authenticated users"
    on public.sellers for update
    to authenticated
    using (auth.uid() = id);

-- Create RLS policies for connected accounts
create policy "Enable read access for authenticated users"
    on public.connected_accounts for select
    to authenticated
    using (true);

create policy "Enable write access for account owners"
    on public.connected_accounts for all
    to authenticated
    with check (seller_id = auth.uid());