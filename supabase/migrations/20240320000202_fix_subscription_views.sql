-- Drop existing views
drop view if exists seller_subscription_status cascade;
drop view if exists seller_analytics_summary cascade;

-- Create view for seller subscription status
create view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
  s.setup_intent_id,
  s.setup_intent_status,
  s.subscription_start_date,
  s.subscription_end_date,
  case
    when s.total_orders >= 3 then true
    else false
  end as requires_subscription,
  case
    when s.setup_intent_status = 'succeeded' then true
    when s.total_orders < 3 then true
    else false
  end as can_accept_orders,
  greatest(0, 3 - s.total_orders) as orders_until_subscription
from sellers s;

-- Create comprehensive analytics summary view
create view seller_analytics_summary as
select 
    s.id as seller_id,
    s.business_name,
    s.total_orders,
    s.subscription_status,
    s.setup_intent_status,
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

-- Create function to create setup intent
create or replace function create_seller_setup_intent(seller_id uuid)
returns text as $$
declare
  setup_intent_id text;
begin
  -- Here you would integrate with Stripe API to create setup intent
  -- For now, we'll simulate it
  setup_intent_id := 'seti_' || substr(md5(random()::text), 1, 24);
  
  update sellers
  set 
    setup_intent_id = setup_intent_id,
    setup_intent_status = 'requires_payment_method'
  where id = seller_id;
  
  return setup_intent_id;
end;
$$ language plpgsql security definer;

-- Grant permissions
grant select on seller_subscription_status to authenticated;
grant select on seller_analytics_summary to authenticated;
grant execute on function create_seller_setup_intent to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';