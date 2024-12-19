-- Drop existing policies
drop policy if exists "Enable read for all users" on public.settings;
drop policy if exists "Enable update for authenticated users" on public.settings;

-- Recreate settings table with proper RLS
drop table if exists public.settings cascade;
create table public.settings (
    id uuid primary key default uuid_generate_v4(),
    dev_mode boolean not null default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into public.settings (dev_mode) values (false);

-- Enable RLS
alter table public.settings enable row level security;

-- Create more permissive policies
create policy "Enable read access for everyone"
    on public.settings for select
    using (true);

create policy "Enable update access for everyone"
    on public.settings for update
    using (true)
    with check (true);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.settings to anon, authenticated;