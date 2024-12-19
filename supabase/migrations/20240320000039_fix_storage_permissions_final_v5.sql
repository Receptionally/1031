-- Drop all existing storage policies
drop policy if exists "Enable upload for authenticated users" on storage.objects;
drop policy if exists "Enable update for authenticated users" on storage.objects;
drop policy if exists "Enable delete for authenticated users" on storage.objects;
drop policy if exists "Enable public read access" on storage.objects;

-- Recreate the bucket with proper settings
delete from storage.buckets where id = 'sellers';
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sellers',
  'sellers',
  true,
  5242880, -- 5MB in bytes
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
);

-- Create a policy for authenticated users to upload files
create policy "Enable upload for authenticated users"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'sellers' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create a policy for authenticated users to update their files
create policy "Enable update for authenticated users"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'sellers' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create a policy for authenticated users to delete their files
create policy "Enable delete for authenticated users"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'sellers' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create a policy for public read access
create policy "Enable public read access"
  on storage.objects
  for select
  to public
  using (bucket_id = 'sellers');

-- Grant necessary permissions using correct syntax
grant all privileges on storage.objects to authenticated;
grant all privileges on storage.buckets to authenticated;
grant select on storage.objects to public;
grant select on storage.buckets to public;