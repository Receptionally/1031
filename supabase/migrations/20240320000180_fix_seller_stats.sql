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

-- Create view for seller pageview stats with time periods
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

-- Grant permissions
grant select on seller_search_stats to authenticated;
grant select on seller_pageview_stats to authenticated;