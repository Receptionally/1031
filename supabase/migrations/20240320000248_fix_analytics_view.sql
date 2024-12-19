-- Drop existing views
drop view if exists seller_analytics_summary cascade;

-- Create analytics view with proper grouping
create or replace view seller_analytics_summary as
select 
    s.id as seller_id,
    s.business_name,
    s.total_orders,
    s.subscription_status,
    coalesce(pv.total_views, 0) as total_views,
    coalesce(pv.views_last_7_days, 0) as views_last_7_days,
    coalesce(ss.total_appearances, 0) as total_appearances,
    coalesce(ss.appearances_last_7_days, 0) as appearances_last_7_days
from sellers s
left join (
    select 
        seller_id,
        count(*) as total_views,
        count(case when created_at >= now() - interval '7 days' then 1 end) as views_last_7_days
    from pageviews
    group by seller_id
) pv on s.id = pv.seller_id
left join (
    select 
        seller_id,
        count(*) as total_appearances,
        count(case when created_at >= now() - interval '7 days' then 1 end) as appearances_last_7_days
    from seller_search_appearances
    group by seller_id
) ss on s.id = ss.seller_id;

-- Create indexes for better performance
create index if not exists idx_pageviews_seller_date 
    on pageviews(seller_id, created_at);
create index if not exists idx_search_appearances_seller_date 
    on seller_search_appearances(seller_id, created_at);

-- Grant permissions
grant select on seller_analytics_summary to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';