-- First, safely remove existing objects and policies
do $$
begin
  -- Delete existing objects
  delete from storage.objects where bucket_id = 'sellers';
  
  -- Drop existing policies
  drop policy if exists "Enable upload for authenticated users" on storage.objects;
  drop policy if exists "Enable update for authenticated users" on storage.objects;
  drop policy if exists "Enable delete for authenticated users" on storage.objects;
  drop policy if exists "Enable public read access" on storage.objects;
  
  -- Drop existing bucket if it exists
  delete from storage.buckets where id = 'sellers';
end $$;

-- Create the bucket with proper settings
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

-- Create storage policies
create policy "Enable read access for everyone"
  on storage.objects for select
  using (bucket_id = 'sellers');

create policy "Enable insert access for authenticated users"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sellers' and
    auth.role() = 'authenticated'
  );

create policy "Enable update access for authenticated users"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'sellers' and
    auth.role() = 'authenticated'
  );

create policy "Enable delete access for authenticated users"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'sellers' and
    auth.role() = 'authenticated'
  );

-- Grant necessary permissions
grant usage on schema storage to authenticated;
grant usage on schema storage to public;

-- Grant bucket permissions
grant all on bucket sellers to authenticated;
grant select on bucket sellers to public;

-- Grant object permissions
grant all on storage.objects to authenticated;
grant select on storage.objects to public;