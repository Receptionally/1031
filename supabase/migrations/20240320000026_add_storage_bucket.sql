-- Create storage bucket for seller profile images
insert into storage.buckets (id, name, public)
values ('sellers', 'sellers', true);

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