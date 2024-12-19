-- Drop existing table if it exists
drop table if exists public.city_pages cascade;

-- Create city_pages table with proper schema
create table public.city_pages (
    id uuid primary key default uuid_generate_v4(),
    city text not null,
    state text not null,
    slug text not null unique,
    title text not null,
    meta_description text,
    content text,
    published boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint city_pages_state_check check (length(state) = 2)
);

-- Create updated_at trigger function
create or replace function update_city_pages_timestamp()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_city_pages_timestamp
    before update on public.city_pages
    for each row
    execute function update_city_pages_timestamp();

-- Create indexes
create index idx_city_pages_slug on public.city_pages(slug);
create index idx_city_pages_location on public.city_pages(city, state);
create index idx_city_pages_published on public.city_pages(published);

-- Enable RLS
alter table public.city_pages enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.city_pages for select
    using (true);

create policy "Enable write access for authenticated users"
    on public.city_pages for all
    to authenticated
    using (true)
    with check (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.city_pages to authenticated;
grant select on public.city_pages to anon;

-- Force schema cache refresh
notify pgrst, 'reload schema';