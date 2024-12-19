-- Create analytics tables if they don't exist
create table if not exists public.pageviews (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    visitor_id text not null,
    page_path text not null,
    referrer text,
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.seller_search_appearances (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    address_search_id uuid references public.address_searches(id) on delete cascade,
    distance numeric(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint unique_seller_search unique (seller_id, address_search_id)
);

-- Create indexes for better performance
create index if not exists idx_pageviews_seller_date 
    on pageviews(seller_id, created_at desc);
create index if not exists idx_search_appearances_seller_date 
    on seller_search_appearances(seller_id, created_at desc);

-- Create analytics views
create or replace view seller_analytics_summary as
select 
    s.id as seller_id,
    s.business_name,
    s.total_orders,
    s.subscription_status,
    count(p.*) as total_views,
    count(case when p.created_at >= now() - interval '7 days' then 1 end) as views_last_7_days,
    count(ssa.*) as total_appearances,
    count(case when ssa.created_at >= now() - interval '7 days' then 1 end) as appearances_last_7_days
from sellers s
left join pageviews p on s.id = p.seller_id
left join seller_search_appearances ssa on s.id = ssa.seller_id
group by s.id, s.business_name, s.total_orders, s.subscription_status;

-- Create tracking functions
create or replace function track_seller_pageview(
  p_seller_id uuid,
  p_visitor_id text,
  p_page_path text,
  p_referrer text default null,
  p_user_agent text default null
) returns void as $$
begin
  insert into pageviews (
    seller_id,
    visitor_id,
    page_path,
    referrer,
    user_agent
  ) values (
    p_seller_id,
    p_visitor_id,
    p_page_path,
    p_referrer,
    p_user_agent
  );
end;
$$ language plpgsql security definer;

create or replace function track_seller_search_appearance(
  p_seller_id uuid,
  p_address_search_id uuid,
  p_distance numeric
) returns void as $$
begin
  insert into seller_search_appearances (
    seller_id,
    address_search_id,
    distance
  ) values (
    p_seller_id,
    p_address_search_id,
    p_distance
  )
  on conflict (seller_id, address_search_id) do nothing;
end;
$$ language plpgsql security definer;

-- Enable RLS
alter table public.pageviews enable row level security;
alter table public.seller_search_appearances enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Enable full access for everyone" on public.pageviews;
drop policy if exists "Enable full access for everyone" on public.seller_search_appearances;

-- Create RLS policies
create policy "Enable full access for everyone"
    on public.pageviews
    using (true)
    with check (true);

create policy "Enable full access for everyone"
    on public.seller_search_appearances
    using (true)
    with check (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all privileges on public.pageviews to anon, authenticated;
grant all privileges on public.seller_search_appearances to anon, authenticated;
grant select on seller_analytics_summary to authenticated;
grant execute on function track_seller_pageview to authenticated;
grant execute on function track_seller_search_appearance to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';