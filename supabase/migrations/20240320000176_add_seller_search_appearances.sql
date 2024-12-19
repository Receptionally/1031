-- Create seller_search_appearances table
create table public.seller_search_appearances (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    address_search_id uuid references public.address_searches(id) on delete cascade,
    distance numeric(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint unique_seller_search unique (seller_id, address_search_id)
);

-- Create indexes
create index idx_seller_appearances_seller on public.seller_search_appearances(seller_id);
create index idx_seller_appearances_created_at on public.seller_search_appearances(created_at desc);

-- Enable RLS
alter table public.seller_search_appearances enable row level security;

-- Create policies
create policy "Enable full access for everyone"
    on public.seller_search_appearances
    using (true)
    with check (true);

-- Create view for seller search stats
create or replace view seller_search_stats as
select 
    s.id as seller_id,
    s.business_name,
    count(ssa.*) as total_appearances,
    count(distinct ssa.address_search_id) as unique_searches,
    avg(ssa.distance) as avg_distance,
    max(ssa.created_at) as last_appearance
from sellers s
left join seller_search_appearances ssa on s.id = ssa.seller_id
group by s.id, s.business_name;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all privileges on public.seller_search_appearances to anon, authenticated;
grant select on seller_search_stats to anon, authenticated;