-- Drop existing views
drop view if exists seller_analytics_summary cascade;

-- Create comprehensive analytics view
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

-- Create indexes for better performance
create index if not exists idx_pageviews_seller_date 
    on pageviews(seller_id, created_at desc);
create index if not exists idx_search_appearances_seller_date 
    on seller_search_appearances(seller_id, created_at desc);

-- Grant permissions
grant select on seller_analytics_summary to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';