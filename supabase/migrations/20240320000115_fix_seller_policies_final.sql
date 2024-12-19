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

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';