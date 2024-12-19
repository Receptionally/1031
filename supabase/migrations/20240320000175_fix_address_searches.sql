-- Drop existing table if it exists
drop table if exists public.address_searches cascade;

-- Create address_searches table with proper schema
create table public.address_searches (
    id uuid primary key default uuid_generate_v4(),
    address text not null,
    latitude numeric(10,7),
    longitude numeric(10,7),
    search_type text not null check (search_type in ('manual', 'autocomplete')),
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index idx_address_searches_created_at on public.address_searches(created_at desc);
create index idx_address_searches_type on public.address_searches(search_type);

-- Enable RLS
alter table public.address_searches enable row level security;

-- Create maximally permissive policies
create policy "Enable full access for everyone"
    on public.address_searches
    using (true)
    with check (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all privileges on public.address_searches to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';