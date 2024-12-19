-- Drop existing settings table and related objects
drop table if exists public.settings cascade;

-- Create settings table with proper schema
create table public.settings (
    id uuid primary key default uuid_generate_v4(),
    dev_mode boolean not null default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create updated_at trigger function
create or replace function update_settings_timestamp()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_settings_timestamp
    before update on public.settings
    for each row
    execute function update_settings_timestamp();

-- Insert default settings if not exists
insert into public.settings (dev_mode)
select false
where not exists (select 1 from public.settings);

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

create policy "Enable insert access for everyone"
    on public.settings for insert
    with check (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.settings to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';