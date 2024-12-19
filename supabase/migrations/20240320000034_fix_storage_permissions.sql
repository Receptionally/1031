-- Drop existing policies
drop policy if exists "Allow authenticated users to upload files" on storage.objects;
drop policy if exists "Allow public to read files" on storage.objects;
drop policy if exists "Allow users to delete their own files" on storage.objects;

-- Ensure the bucket exists and is public
insert into storage.buckets (id, name, public)
values ('sellers', 'sellers', true)
on conflict (id) do update
set public = true;

-- Create simplified storage policies
create policy "Enable storage for authenticated users"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'sellers')
  with check (bucket_id = 'sellers');

create policy "Enable public read access"
  on storage.objects for select
  to public
  using (bucket_id = 'sellers');

-- Grant full permissions
grant all on bucket sellers to authenticated;
grant select on bucket sellers to public;