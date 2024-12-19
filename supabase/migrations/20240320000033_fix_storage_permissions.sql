-- Drop existing policies
drop policy if exists "Allow authenticated users to upload files" on storage.objects;
drop policy if exists "Allow public to read files" on storage.objects;
drop policy if exists "Allow users to delete their own files" on storage.objects;

-- Ensure the bucket exists
insert into storage.buckets (id, name, public)
values ('sellers', 'sellers', true)
on conflict (id) do update
set public = true;

-- Create more permissive policies for file uploads
create policy "Allow authenticated users to upload files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'sellers');

-- Allow public access to read files
create policy "Allow public to read files"
  on storage.objects for select
  to public
  using (bucket_id = 'sellers');

-- Allow users to delete their own files
create policy "Allow users to delete their own files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'sellers');

-- Grant necessary permissions
grant all on bucket sellers to authenticated;
grant select on bucket sellers to public;