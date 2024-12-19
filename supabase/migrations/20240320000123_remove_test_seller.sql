-- Drop existing test seller data
delete from public.sellers where email = 'kai@alohafirewood.com';

-- Drop test seller related views
drop view if exists seller_search_view cascade;

-- Drop test seller related indexes
drop index if exists idx_sellers_email;
drop index if exists idx_sellers_location;

-- Create standard indexes for better performance
create index if not exists idx_sellers_status on public.sellers(status);
create index if not exists idx_sellers_created_at on public.sellers(created_at);

-- Force schema cache refresh
notify pgrst, 'reload schema';