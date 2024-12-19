-- Create address_searches table
create table public.address_searches (
    id uuid primary key default uuid_generate_v4(),
    address text not null,
    latitude numeric(10,7),
    longitude numeric(10,7),
    search_type text not null,
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_address_searches_created_at on public.address_searches(created_at desc);

-- Enable RLS
alter table public.address_searches enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.address_searches for select
    using (true);

create policy "Enable insert access for everyone"
    on public.address_searches for insert
    with check (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.address_searches to anon, authenticated;