-- Create settings table
create table public.settings (
    id uuid primary key default uuid_generate_v4(),
    dev_mode boolean not null default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into public.settings (dev_mode) values (false);

-- Enable RLS
alter table public.settings enable row level security;

-- Create policies
create policy "Enable read for all users"
    on public.settings for select
    using (true);

create policy "Enable update for authenticated users"
    on public.settings for update
    to authenticated
    using (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;