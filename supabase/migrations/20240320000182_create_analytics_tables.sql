-- Create pageviews table if it doesn't exist
create table if not exists public.pageviews (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    visitor_id text not null,
    page_path text not null,
    referrer text,
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create seller_search_appearances table if it doesn't exist
create table if not exists public.seller_search_appearances (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    address_search_id uuid references public.address_searches(id) on delete cascade,
    distance numeric(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint unique_seller_search unique (seller_id, address_search_id)
);

-- Create indexes
create index if not exists idx_pageviews_seller on public.pageviews(seller_id);
create index if not exists idx_pageviews_created_at on public.pageviews(created_at desc);
create index if not exists idx_pageviews_visitor on public.pageviews(visitor_id);
create index if not exists idx_seller_appearances_seller on public.seller_search_appearances(seller_id);
create index if not exists idx_seller_appearances_created_at on public.seller_search_appearances(created_at desc);

-- Create view for seller pageview stats
create or replace view seller_pageview_stats as
select 
    s.id as seller_id,
    s.business_name,
    count(p.*) as total_views,
    count(distinct p.visitor_id) as unique_visitors,
    max(p.created_at) as last_view,
    count(case when p.created_at >= now() - interval '7 days' then 1 end) as views_last_7_days,
    count(case when p.created_at >= now() - interval '30 days' then 1 end) as views_last_30_days
from sellers s
left join pageviews p on s.id = p.seller_id
group by s.id, s.business_name;

-- Create view for seller search stats
create or replace view seller_search_stats as
select 
    s.id as seller_id,
    s.business_name,
    count(ssa.*) as total_appearances,
    count(distinct ssa.address_search_id) as unique_searches,
    avg(ssa.distance) as avg_distance,
    max(ssa.created_at) as last_appearance,
    count(case when ssa.created_at >= now() - interval '7 days' then 1 end) as appearances_last_7_days,
    count(case when ssa.created_at >= now() - interval '30 days' then 1 end) as appearances_last_30_days
from sellers s
left join seller_search_appearances ssa on s.id = ssa.seller_id
group by s.id, s.business_name;

-- Create comprehensive analytics summary view
create or replace view seller_analytics_summary as
select 
    s.id as seller_id,
    s.business_name,
    coalesce(pv.total_views, 0) as total_views,
    coalesce(pv.unique_visitors, 0) as unique_visitors,
    coalesce(pv.views_last_7_days, 0) as views_last_7_days,
    coalesce(pv.views_last_30_days, 0) as views_last_30_days,
    pv.last_view,
    coalesce(ss.total_appearances, 0) as total_appearances,
    coalesce(ss.unique_searches, 0) as unique_searches,
    coalesce(ss.appearances_last_7_days, 0) as appearances_last_7_days,
    coalesce(ss.appearances_last_30_days, 0) as appearances_last_30_days,
    ss.avg_distance,
    ss.last_appearance
from sellers s
left join seller_pageview_stats pv on s.id = pv.seller_id
left join seller_search_stats ss on s.id = ss.seller_id;

-- Enable RLS
alter table public.pageviews enable row level security;
alter table public.seller_search_appearances enable row level security;

-- Create maximally permissive policies
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
grant select on seller_pageview_stats to anon, authenticated;
grant select on seller_search_stats to anon, authenticated;
grant select on seller_analytics_summary to anon, authenticated;