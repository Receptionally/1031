-- Drop existing policies
drop policy if exists "Enable storage for authenticated users" on storage.objects;
drop policy if exists "Enable public read access" on storage.objects;

-- Ensure the bucket exists and is public
insert into storage.buckets (id, name, public)
values ('sellers', 'sellers', true)
on conflict (id) do update
set public = true;

-- Create a single policy for authenticated users that handles all operations
create policy "Enable full access for authenticated users"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'sellers')
  with check (bucket_id = 'sellers');

-- Create a separate policy for public read access
create policy "Enable public read access"
  on storage.objects for select
  to public
  using (bucket_id = 'sellers');

-- Grant full permissions to the bucket
grant all on bucket sellers to authenticated;
grant select on bucket sellers to public;

-- Grant additional required permissions
grant usage on schema storage to authenticated;
grant usage on schema storage to public;
grant all on all sequences in schema storage to authenticated;