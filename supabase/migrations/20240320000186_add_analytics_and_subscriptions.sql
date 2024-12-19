-- Create analytics tables
create table if not exists public.pageviews (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    visitor_id text not null,
    page_path text not null,
    referrer text null,
    user_agent text null,
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

-- Add subscription fields to sellers
alter table public.sellers
  add column if not exists subscription_status text check (subscription_status in ('none', 'active', 'past_due', 'canceled')) default 'none',
  add column if not exists subscription_id text,
  add column if not exists subscription_start_date timestamp with time zone,
  add column if not exists subscription_end_date timestamp with time zone,
  add column if not exists total_orders integer default 0,
  add column if not exists requires_subscription boolean generated always as (total_orders >= 3) stored;

-- Create analytics views
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

-- Create subscription status view
create or replace view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
  s.subscription_start_date,
  s.subscription_end_date,
  s.requires_subscription,
  case
    when s.subscription_status = 'active' then true
    when s.total_orders < 3 then true
    else false
  end as can_accept_orders
from sellers s;

-- Create function to increment order count and check subscription
create or replace function check_seller_subscription()
returns trigger as $$
declare
  seller_record record;
begin
  -- Get seller record
  select * into seller_record
  from sellers
  where id = new.seller_id;

  -- Increment total orders
  update sellers
  set total_orders = total_orders + 1
  where id = new.seller_id;

  -- Check if subscription required
  if seller_record.total_orders >= 2 and seller_record.subscription_status = 'none' then
    raise exception 'Subscription required after 3 orders. Please subscribe to continue accepting orders.';
  end if;

  return new;
end;
$$ language plpgsql;

-- Create trigger to check subscription before order
create trigger check_seller_subscription_trigger
  before insert on orders
  for each row
  execute function check_seller_subscription();

-- Create indexes
create index if not exists idx_pageviews_seller on public.pageviews(seller_id);
create index if not exists idx_pageviews_created_at on public.pageviews(created_at desc);
create index if not exists idx_pageviews_visitor on public.pageviews(visitor_id);
create index if not exists idx_seller_appearances_seller on public.seller_search_appearances(seller_id);
create index if not exists idx_seller_appearances_created_at on public.seller_search_appearances(created_at desc);

-- Enable RLS
alter table public.pageviews enable row level security;
alter table public.seller_search_appearances enable row level security;

-- Create policies
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
grant select on seller_pageview_stats to authenticated;
grant select on seller_search_stats to authenticated;
grant select on seller_subscription_status to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';