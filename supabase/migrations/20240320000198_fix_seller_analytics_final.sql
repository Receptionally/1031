-- Drop existing views
drop view if exists seller_analytics_summary cascade;
drop view if exists seller_pageview_stats cascade;
drop view if exists seller_search_stats cascade;
drop view if exists seller_subscription_status cascade;

-- Create view for seller pageview stats
create or replace view seller_pageview_stats as
select 
    s.id as seller_id,
    s.business_name,
    s.total_orders,
    count(p.*) as total_views,
    count(distinct p.visitor_id) as unique_visitors,
    max(p.created_at) as last_view,
    count(case when p.created_at >= now() - interval '7 days' then 1 end) as views_last_7_days,
    count(case when p.created_at >= now() - interval '30 days' then 1 end) as views_last_30_days
from sellers s
left join pageviews p on s.id = p.seller_id
group by s.id, s.business_name, s.total_orders;

-- Create view for seller search stats
create or replace view seller_search_stats as
select 
    s.id as seller_id,
    s.business_name,
    s.total_orders,
    count(ssa.*) as total_appearances,
    count(distinct ssa.address_search_id) as unique_searches,
    avg(ssa.distance) as avg_distance,
    max(ssa.created_at) as last_appearance,
    count(case when ssa.created_at >= now() - interval '7 days' then 1 end) as appearances_last_7_days,
    count(case when ssa.created_at >= now() - interval '30 days' then 1 end) as appearances_last_30_days
from sellers s
left join seller_search_appearances ssa on s.id = ssa.seller_id
group by s.id, s.business_name, s.total_orders;

-- Create comprehensive analytics summary view
create or replace view seller_analytics_summary as
select 
    s.id as seller_id,
    s.business_name,
    s.total_orders,
    s.subscription_status,
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
    ss.last_appearance,
    case
        when s.total_orders >= 3 then true
        else false
    end as requires_subscription,
    case
        when s.subscription_status = 'active' then true
        when s.total_orders < 3 then true
        else false
    end as can_accept_orders,
    greatest(0, 3 - s.total_orders) as orders_until_subscription
from sellers s
left join seller_pageview_stats pv on s.id = pv.seller_id
left join seller_search_stats ss on s.id = ss.seller_id;

-- Create function to track pageview
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

-- Create function to track search appearance
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

-- Create function to increment order count and check subscription
create or replace function check_seller_subscription()
returns trigger as $$
declare
  seller_record record;
  order_count integer;
begin
  -- Get seller record with current order count
  select * into seller_record
  from sellers
  where id = new.seller_id;

  if not found then
    raise exception 'Seller not found';
  end if;

  -- Get current order count
  select count(*) into order_count
  from orders
  where seller_id = new.seller_id;

  -- Check if this would be the 4th order
  if order_count >= 3 and seller_record.subscription_status != 'active' then
    raise exception 'Subscription required after 3 orders. Please subscribe to continue accepting orders.';
  end if;

  -- Increment total orders
  update sellers
  set total_orders = order_count + 1
  where id = new.seller_id;

  return new;
end;
$$ language plpgsql;

-- Create trigger to check subscription before order
drop trigger if exists check_seller_subscription_trigger on orders;
create trigger check_seller_subscription_trigger
  before insert on orders
  for each row
  execute function check_seller_subscription();

-- Grant permissions
grant select on seller_pageview_stats to authenticated;
grant select on seller_search_stats to authenticated;
grant select on seller_analytics_summary to authenticated;
grant execute on function track_seller_pageview to authenticated;
grant execute on function track_seller_search_appearance to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';