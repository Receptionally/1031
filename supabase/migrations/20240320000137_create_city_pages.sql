-- Create city_pages table
create table public.city_pages (
    id uuid primary key default uuid_generate_v4(),
    city text not null,
    state text not null,
    slug text not null unique,
    title text not null,
    meta_description text,
    content text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint city_pages_state_check check (length(state) = 2),
    constraint city_pages_slug_format check (slug ~ '^[a-z0-9-]+$')
);

-- Create indexes
create index idx_city_pages_slug on public.city_pages(slug);
create index idx_city_pages_status on public.city_pages(status);
create index idx_city_pages_location on public.city_pages(city, state);

-- Enable RLS
alter table public.city_pages enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.city_pages for select
    using (status = 'approved');

create policy "Enable write access for authenticated users"
    on public.city_pages for all
    to authenticated
    using (true)
    with check (true);

-- Create function to approve city pages
create or replace function approve_city_page(page_id uuid)
returns void as $$
begin
  update public.city_pages
  set 
    status = 'approved',
    updated_at = now()
  where id = page_id;
end;
$$ language plpgsql;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.city_pages to authenticated;
grant select on public.city_pages to anon;
grant execute on function approve_city_page to authenticated;