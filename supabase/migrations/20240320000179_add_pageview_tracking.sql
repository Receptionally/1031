-- Create pageviews table
create table public.pageviews (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    visitor_id text not null,
    page_path text not null,
    referrer text,
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_pageviews_seller on public.pageviews(seller_id);
create index idx_pageviews_created_at on public.pageviews(created_at desc);
create index idx_pageviews_visitor on public.pageviews(visitor_id);

-- Enable RLS
alter table public.pageviews enable row level security;

-- Create policies
create policy "Enable full access for everyone"
    on public.pageviews
    using (true)
    with check (true);

-- Create view for seller pageview stats
create or replace view seller_pageview_stats as
select 
    s.id as seller_id,
    s.business_name,
    count(p.*) as total_views,
    count(distinct p.visitor_id) as unique_visitors,
    max(p.created_at) as last_view
from sellers s
left join pageviews p on s.id = p.seller_id
group by s.id, s.business_name;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all privileges on public.pageviews to anon, authenticated;
grant select on seller_pageview_stats to anon, authenticated;