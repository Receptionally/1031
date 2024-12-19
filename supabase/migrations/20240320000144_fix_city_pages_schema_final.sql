-- Drop existing objects
drop table if exists public.city_pages cascade;
drop function if exists approve_city_page cascade;
drop function if exists update_city_pages_timestamp cascade;

-- Create city_pages table with proper schema
create table public.city_pages (
    id uuid primary key default uuid_generate_v4(),
    city text not null,
    state text not null,
    slug text not null unique,
    title text not null,
    meta_description text,
    content text,
    custom_content text,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint city_pages_state_check check (length(state) = 2),
    constraint city_pages_slug_format check (slug ~ '^[a-z0-9-]+$'),
    constraint city_pages_status_check check (status in ('pending', 'approved', 'rejected'))
);

-- Create function to approve city pages
create or replace function approve_city_page(page_id uuid)
returns void as $$
begin
  update public.city_pages
  set 
    status = 'approved',
    updated_at = now()
  where id = page_id;
  -- Return success message
  raise notice 'City page % approved successfully', page_id;
end;
$$ language plpgsql;

-- Create function to update timestamp
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
create index idx_city_pages_status on public.city_pages(status);
create index idx_city_pages_location on public.city_pages(city, state);

-- Enable RLS
alter table public.city_pages enable row level security;

-- Create maximally permissive policies
create policy "Enable full access for everyone"
    on public.city_pages
    using (true)
    with check (true);

-- Grant all permissions
grant usage on schema public to anon, authenticated;
grant all privileges on public.city_pages to anon, authenticated;
grant execute on function approve_city_page to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';