-- Drop existing storage bucket if it exists
drop policy if exists "Allow authenticated users to upload files" on storage.objects;
drop policy if exists "Allow public to read files" on storage.objects;
drop policy if exists "Allow users to delete their own files" on storage.objects;

-- Create storage bucket for seller profile images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('sellers', 'sellers', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload files
create policy "Allow authenticated users to upload files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sellers' and
    (storage.foldername(name))[1] = 'profile-images'
  );

-- Allow public access to read files
create policy "Allow public to read files"
  on storage.objects for select
  to public
  using (bucket_id = 'sellers');

-- Allow users to delete their own files
create policy "Allow users to delete their own files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'sellers' and
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- Grant necessary permissions
grant all on bucket sellers to authenticated;
grant select on bucket sellers to public;