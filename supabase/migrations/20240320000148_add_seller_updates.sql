-- Create seller_updates table
create table public.seller_updates (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) not null,
    updates jsonb not null,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint seller_updates_status_check check (status in ('pending', 'approved', 'rejected'))
);

-- Create indexes
create index idx_seller_updates_seller_id on public.seller_updates(seller_id);
create index idx_seller_updates_status on public.seller_updates(status);
create index idx_seller_updates_created_at on public.seller_updates(created_at desc);

-- Enable RLS
alter table public.seller_updates enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.seller_updates for select
    using (true);

create policy "Enable insert access for sellers"
    on public.seller_updates for insert
    to authenticated
    with check (auth.uid() = seller_id);

-- Create function to approve seller updates
create or replace function approve_seller_update(update_id uuid)
returns void as $$
declare
    seller_update record;
begin
    -- Get the update
    select * into seller_update
    from seller_updates
    where id = update_id and status = 'pending';
    
    if not found then
        raise exception 'Update not found or already processed';
    end if;
    
    -- Apply the updates to the seller
    update sellers
    set
        name = coalesce((seller_update.updates->>'name')::text, name),
        business_name = coalesce((seller_update.updates->>'business_name')::text, business_name),
        business_address = coalesce((seller_update.updates->>'business_address')::text, business_address),
        phone = coalesce((seller_update.updates->>'phone')::text, phone),
        firewood_unit = coalesce((seller_update.updates->>'firewood_unit')::text, firewood_unit),
        price_per_unit = coalesce((seller_update.updates->>'price_per_unit')::decimal, price_per_unit),
        max_delivery_distance = coalesce((seller_update.updates->>'max_delivery_distance')::integer, max_delivery_distance),
        min_delivery_fee = coalesce((seller_update.updates->>'min_delivery_fee')::decimal, min_delivery_fee),
        price_per_mile = coalesce((seller_update.updates->>'price_per_mile')::decimal, price_per_mile),
        provides_stacking = coalesce((seller_update.updates->>'provides_stacking')::boolean, provides_stacking),
        stacking_fee_per_unit = coalesce((seller_update.updates->>'stacking_fee_per_unit')::decimal, stacking_fee_per_unit),
        bio = coalesce((seller_update.updates->>'bio')::text, bio)
    where id = seller_update.seller_id;
    
    -- Mark update as approved
    update seller_updates
    set status = 'approved',
        updated_at = now()
    where id = update_id;
end;
$$ language plpgsql security definer;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.seller_updates to authenticated;
grant execute on function approve_seller_update to authenticated;