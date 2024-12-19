-- Drop existing views
drop view if exists seller_analytics_summary cascade;
drop view if exists seller_subscription_status cascade;
drop view if exists seller_pageview_stats cascade;
drop view if exists seller_search_stats cascade;

-- Add analytics fields to sellers table
alter table public.sellers
  add column if not exists total_orders integer default 0,
  add column if not exists subscription_status text check (subscription_status in ('none', 'active', 'past_due', 'canceled')) default 'none',
  add column if not exists subscription_start_date timestamp with time zone,
  add column if not exists subscription_end_date timestamp with time zone,
  add column if not exists setup_intent_id text,
  add column if not exists setup_intent_status text check (setup_intent_status in ('requires_payment_method', 'requires_confirmation', 'succeeded', 'canceled')),
  add column if not exists setup_intent_client_secret text,
  add column if not exists card_last4 text,
  add column if not exists card_brand text,
  add column if not exists stripe_customer_id text,
  add column if not exists debt_amount decimal(10,2) default 0,
  add column if not exists last_failed_charge timestamp with time zone,
  add column if not exists failed_charge_amount decimal(10,2);

-- Create analytics tables
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

-- Create payment_intents table for subscription charges
create table if not exists public.payment_intents (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    order_id uuid references public.orders(id) on delete cascade,
    stripe_payment_intent_id text not null,
    amount integer not null,
    status text not null check (status in ('succeeded', 'failed')),
    type text not null check (type in ('subscription_charge')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create analytics views
create view seller_pageview_stats as
select 
    s.id as seller_id,
    s.business_name,
    count(p.*) as total_views,
    count(case when p.created_at >= current_timestamp - interval '7 days' then 1 end) as views_last_7_days
from sellers s
left join pageviews p on s.id = p.seller_id
group by s.id, s.business_name;

create view seller_search_stats as
select 
    s.id as seller_id,
    s.business_name,
    count(ssa.*) as total_appearances,
    count(case when ssa.created_at >= current_timestamp - interval '7 days' then 1 end) as appearances_last_7_days
from sellers s
left join seller_search_appearances ssa on s.id = ssa.seller_id
group by s.id, s.business_name;

create view seller_analytics_summary as
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
left join seller_pageview_stats pv on s.id = pv.seller_id
left join seller_search_stats ss on s.id = ss.seller_id;

-- Create subscription status view
create view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
  s.setup_intent_id,
  s.setup_intent_status,
  s.setup_intent_client_secret,
  s.subscription_start_date,
  s.subscription_end_date,
  s.card_last4,
  s.card_brand,
  s.stripe_customer_id,
  coalesce(s.debt_amount, 0) as debt_amount,
  s.last_failed_charge,
  s.failed_charge_amount,
  case
    when s.total_orders >= 3 then true
    else false
  end as requires_subscription,
  case
    when coalesce(s.debt_amount, 0) > 0 then false
    when s.subscription_status = 'active' then true
    when s.total_orders < 3 then true
    else false
  end as can_accept_orders,
  greatest(0, 3 - s.total_orders) as orders_until_subscription
from sellers s;

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

-- Create subscription management functions
create or replace function update_seller_setup_intent(
  p_seller_id uuid,
  p_setup_intent_id text,
  p_status text,
  p_client_secret text,
  p_card_last4 text default null,
  p_card_brand text default null
) returns void as $$
begin
  update sellers
  set 
    setup_intent_id = p_setup_intent_id,
    setup_intent_status = p_status,
    setup_intent_client_secret = p_client_secret,
    card_last4 = coalesce(p_card_last4, card_last4),
    card_brand = coalesce(p_card_brand, card_brand),
    subscription_status = case
      when p_status = 'succeeded' then 'active'
      else subscription_status
    end,
    subscription_start_date = case
      when p_status = 'succeeded' then current_timestamp
      else subscription_start_date
    end
  where id = p_seller_id;
end;
$$ language plpgsql security definer;

create or replace function record_failed_charge(
  p_seller_id uuid,
  p_amount decimal
) returns void as $$
begin
  update sellers
  set 
    debt_amount = coalesce(debt_amount, 0) + p_amount,
    last_failed_charge = current_timestamp,
    failed_charge_amount = p_amount,
    subscription_status = 'past_due'
  where id = p_seller_id;
end;
$$ language plpgsql security definer;

create or replace function clear_seller_debt(
  p_seller_id uuid
) returns void as $$
begin
  update sellers
  set 
    debt_amount = 0,
    last_failed_charge = null,
    failed_charge_amount = null,
    subscription_status = 'active'
  where id = p_seller_id;
end;
$$ language plpgsql security definer;

-- Create regular indexes (no function predicates)
create index idx_pageviews_seller_date 
    on pageviews(seller_id, created_at);
create index idx_search_appearances_seller_date 
    on seller_search_appearances(seller_id, created_at);
create index idx_sellers_subscription 
    on sellers(id, subscription_status, total_orders);
create index idx_payment_intents_seller 
    on payment_intents(seller_id);

-- Enable RLS
alter table public.pageviews enable row level security;
alter table public.seller_search_appearances enable row level security;
alter table public.payment_intents enable row level security;

-- Create RLS policies
create policy "Enable full access for everyone"
    on public.pageviews
    using (true)
    with check (true);

create policy "Enable full access for everyone"
    on public.seller_search_appearances
    using (true)
    with check (true);

create policy "Enable full access for everyone"
    on public.payment_intents
    using (true)
    with check (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all privileges on public.pageviews to anon, authenticated;
grant all privileges on public.seller_search_appearances to anon, authenticated;
grant all privileges on public.payment_intents to anon, authenticated;
grant select on seller_pageview_stats to authenticated;
grant select on seller_search_stats to authenticated;
grant select on seller_analytics_summary to authenticated;
grant select on seller_subscription_status to authenticated;
grant execute on function track_seller_pageview to authenticated;
grant execute on function track_seller_search_appearance to authenticated;
grant execute on function update_seller_setup_intent to authenticated;
grant execute on function record_failed_charge to authenticated;
grant execute on function clear_seller_debt to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';