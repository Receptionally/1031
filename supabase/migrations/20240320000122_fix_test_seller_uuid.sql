-- Drop existing policies
drop policy if exists "Enable insert access for everyone" on public.sellers;
drop policy if exists "Enable update access for everyone" on public.sellers;
drop policy if exists "Enable read access for everyone" on public.sellers;

-- Create new policies for sellers
create policy "Enable read access for everyone"
    on public.sellers for select
    using (true);

create policy "Enable insert access for everyone"
    on public.sellers for insert
    with check (true);

create policy "Enable update access for everyone"
    on public.sellers for update
    using (true)
    with check (true);

-- Insert test seller with generated UUID
insert into public.sellers (
    id,
    name,
    business_name,
    business_address,
    email,
    phone,
    firewood_unit,
    price_per_unit,
    max_delivery_distance,
    min_delivery_fee,
    price_per_mile,
    payment_timing,
    provides_stacking,
    stacking_fee_per_unit,
    bio,
    profile_image,
    status
) values (
    uuid_generate_v4(), -- Generate a new UUID
    'Kai Kalani',
    'Aloha Firewood Co.',
    '123 Ala Moana Blvd, Honolulu, HI 96815',
    'kai@alohafirewood.com',
    '(808) 555-0123',
    'cords',
    399.99,
    100,
    50,
    2.50,
    'delivery',
    true,
    50,
    'Serving the Hawaiian islands with premium ohia and kiawe firewood since 1995. Our wood is locally sourced and properly seasoned to ensure the best burning experience.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'approved'
)
on conflict (email) do update set
    status = 'approved',
    max_delivery_distance = 100,
    business_address = '123 Ala Moana Blvd, Honolulu, HI 96815';

-- Create indexes for better performance
create index if not exists idx_sellers_email on public.sellers(email);
create index if not exists idx_sellers_location on public.sellers(business_address);
create index if not exists idx_sellers_status on public.sellers(status);

-- Create view for seller search
create or replace view seller_search_view as
select 
    s.*,
    substring(s.business_address from '.*, ([A-Z]{2}) \d{5}.*') as state_code
from sellers s
where s.status = 'approved';

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on seller_search_view to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';