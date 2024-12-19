-- Drop existing policies
drop policy if exists "Enable insert access for authenticated users" on public.sellers;
drop policy if exists "Enable update access for authenticated users" on public.sellers;

-- Create more permissive policies for sellers
create policy "Enable insert access for everyone"
    on public.sellers for insert
    with check (true);

create policy "Enable update access for everyone"
    on public.sellers for update
    using (true)
    with check (true);

-- Create function to create test seller
create or replace function create_test_seller()
returns uuid as $$
declare
    seller_id uuid;
begin
    -- Insert test seller
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
        '00000000-0000-0000-0000-000000000001',
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
        'Serving the Hawaiian islands with premium ohia and kiawe firewood since 1995. Our wood is locally sourced and properly seasoned to ensure the best burning experience. We take pride in our sustainable harvesting practices and excellent customer service.',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'approved'
    )
    on conflict (id) do update set
        status = 'approved'
    returning id into seller_id;

    return seller_id;
end;
$$ language plpgsql;

-- Grant execute permission on the function
grant execute on function create_test_seller to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';