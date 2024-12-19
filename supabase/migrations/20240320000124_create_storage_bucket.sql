-- Drop existing storage bucket if it exists
drop policy if exists "Enable storage for authenticated users" on storage.objects;
drop policy if exists "Enable public read access" on storage.objects;

-- Create storage bucket for profile images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB limit
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
) on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ];

-- Create storage policies
create policy "Enable storage for authenticated users"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'profile-images')
  with check (bucket_id = 'profile-images');

create policy "Enable public read access"
  on storage.objects for select
  to public
  using (bucket_id = 'profile-images');

-- Grant necessary permissions
grant usage on schema storage to authenticated, public;
grant all on bucket profile-images to authenticated;
grant select on bucket profile-images to public;

-- Force schema cache refresh
notify pgrst, 'reload schema';