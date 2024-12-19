-- Drop existing objects if they exist
drop table if exists public.city_pages cascade;
drop function if exists approve_city_page cascade;

-- Create city_pages table with proper schema
create table public.city_pages (
    id uuid primary key default uuid_generate_v4(),
    city text not null,
    state text not null,
    slug text not null unique,
    title text not null,
    meta_description text,
    content text,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Add constraints
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
end;
$$ language plpgsql security definer;

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

-- Create indexes for better performance
create index idx_city_pages_slug on public.city_pages(slug);
create index idx_city_pages_status on public.city_pages(status);
create index idx_city_pages_location on public.city_pages(city, state);
create index idx_city_pages_updated_at on public.city_pages(updated_at desc);

-- Enable RLS
alter table public.city_pages enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.city_pages for select
    using (status = 'approved' or auth.role() = 'authenticated');

create policy "Enable write access for authenticated users"
    on public.city_pages for all
    to authenticated
    using (true)
    with check (true);

-- Create view for city page management
create view city_page_management as
select 
    cp.*,
    (
        select count(*)::integer 
        from orders o 
        where o.delivery_address like cp.city || '%' 
        and o.delivery_address like '%' || cp.state || '%'
    ) as total_orders
from city_pages cp;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.city_pages to authenticated;
grant select on public.city_pages to anon;
grant select on city_page_management to authenticated;
grant execute on function approve_city_page to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';