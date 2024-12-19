-- Drop existing views
drop view if exists sellers_with_stripe cascade;
drop view if exists admin_stripe_accounts_view cascade;
drop view if exists seller_details cascade;

-- Drop and recreate sellers table with proper schema
drop table if exists public.sellers cascade;

create table public.sellers (
    id uuid primary key,
    name text not null default '',
    business_name text not null default '',
    business_address text not null default '',
    email text not null unique,
    phone text not null default '',
    firewood_unit text,
    price_per_unit decimal(10,2),
    max_delivery_distance integer,
    min_delivery_fee decimal(10,2),
    price_per_mile decimal(10,2),
    payment_timing text not null default 'delivery',
    provides_stacking boolean not null default false,
    stacking_fee_per_unit decimal(10,2) not null default 0,
    profile_image text,
    bio text,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint sellers_status_check check (status in ('pending', 'approved', 'rejected')),
    constraint sellers_firewood_unit_check check (firewood_unit in ('cords', 'facecords', 'ricks')),
    constraint sellers_payment_timing_check check (payment_timing in ('scheduling', 'delivery')),
    constraint price_per_unit_check check (price_per_unit is null or price_per_unit > 0),
    constraint max_delivery_distance_check check (max_delivery_distance is null or max_delivery_distance > 0),
    constraint min_delivery_fee_check check (min_delivery_fee is null or min_delivery_fee >= 0),
    constraint price_per_mile_check check (price_per_mile is null or price_per_mile >= 0),
    constraint stacking_fee_check check (stacking_fee_per_unit >= 0)
);

-- Create connected_accounts table
create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid not null references public.sellers(id) on delete cascade,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);

-- Create indexes
create index idx_sellers_status_email on public.sellers(status, email);
create index idx_connected_accounts_seller_id on public.connected_accounts(seller_id);
create index idx_connected_accounts_stripe_account on public.connected_accounts(stripe_account_id);

-- Enable RLS
alter table public.sellers enable row level security;
alter table public.connected_accounts enable row level security;

-- Create RLS policies for sellers
create policy "Enable read access for everyone"
    on public.sellers for select
    using (true);

create policy "Enable insert access for authenticated users"
    on public.sellers for insert
    to authenticated
    with check (auth.uid() = id);

create policy "Enable update access for authenticated users"
    on public.sellers for update
    to authenticated
    using (auth.uid() = id);

-- Create RLS policies for connected accounts
create policy "Enable read access for authenticated users"
    on public.connected_accounts for select
    to authenticated
    using (true);

create policy "Enable write access for account owners"
    on public.connected_accounts for all
    to authenticated
    with check (seller_id = auth.uid());

-- Create seller trigger function
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_bio text := 'Local firewood supplier committed to quality service.';
begin
  if new.raw_user_meta_data->>'role' = 'seller' then
    begin
      insert into public.sellers (
        id,
        email,
        name,
        business_name,
        business_address,
        phone,
        bio,
        profile_image,
        firewood_unit,
        price_per_unit,
        max_delivery_distance,
        min_delivery_fee,
        price_per_mile,
        payment_timing,
        provides_stacking,
        stacking_fee_per_unit,
        status
      ) values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'businessName', ''),
        coalesce(new.raw_user_meta_data->>'businessAddress', ''),
        coalesce(new.raw_user_meta_data->>'phone', ''),
        default_bio,
        null,
        'cords',
        null,
        null,
        null,
        null,
        'delivery',
        false,
        0,
        'pending'
      );
      
      raise notice 'Created seller record for user %', new.id;
    exception when others then
      raise warning 'Failed to create seller record for user %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create views
create view sellers_with_stripe as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account
from sellers s
left join connected_accounts ca on s.id = ca.seller_id;

create view admin_stripe_accounts_view as
select 
    s.id as seller_id,
    s.business_name,
    s.email,
    s.phone,
    s.business_address,
    s.status as seller_status,
    s.profile_image,
    s.payment_timing,
    ca.stripe_account_id,
    ca.connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
order by ca.connected_at desc nulls last;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant select on sellers_with_stripe to authenticated;
grant select on admin_stripe_accounts_view to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';