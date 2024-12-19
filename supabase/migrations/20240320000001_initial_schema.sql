-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist
drop table if exists public.sellers cascade;
drop table if exists public.orders cascade;
drop table if exists public.connected_accounts cascade;
drop table if exists public.settings cascade;

-- Create sellers table
create table public.sellers (
    id uuid primary key,
    name text not null,
    business_name text not null,
    business_address text not null,
    email text not null unique,
    phone text not null,
    firewood_unit text,
    price_per_unit decimal(10,2),
    max_delivery_distance integer,
    min_delivery_fee decimal(10,2),
    price_per_mile decimal(10,2),
    payment_timing text,
    accepts_cash_on_delivery boolean default false,
    provides_stacking boolean default false,
    stacking_fee_per_unit decimal(10,2) default 0,
    profile_image text,
    bio text,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint sellers_status_check check (status in ('pending', 'approved', 'rejected')),
    constraint sellers_firewood_unit_check check (firewood_unit in ('cords', 'facecords', 'ricks')),
    constraint sellers_payment_timing_check check (payment_timing in ('scheduling', 'delivery'))
);

-- Create connected_accounts table
create table public.connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) not null,
    stripe_account_id text not null unique,
    access_token text not null,
    connected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint connected_accounts_seller_id_unique unique (seller_id)
);

-- Create orders table
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id),
    customer_name text not null,
    customer_email text not null,
    product_id text not null,
    product_name text not null,
    quantity integer not null default 1,
    total_amount decimal(10,2) not null,
    status text not null default 'pending',
    stripe_customer_id text,
    stripe_payment_id text,
    stripe_account_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint orders_status_check check (status in ('pending', 'processing', 'completed', 'cancelled'))
);

-- Create settings table
create table public.settings (
    id uuid primary key default uuid_generate_v4(),
    dev_mode boolean not null default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into public.settings (dev_mode) values (false);

-- Enable RLS
alter table public.sellers enable row level security;
alter table public.connected_accounts enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- Create policies for sellers
create policy "Enable read for all users"
    on public.sellers for select
    using (true);

create policy "Enable insert for authenticated users"
    on public.sellers for insert
    to authenticated
    with check (auth.uid() = id);

create policy "Enable update for authenticated users"
    on public.sellers for update
    to authenticated
    using (auth.uid() = id);

-- Create policies for connected accounts
create policy "Enable read for account owners"
    on public.connected_accounts for select
    to authenticated
    using (seller_id = auth.uid());

create policy "Enable insert for account owners"
    on public.connected_accounts for insert
    to authenticated
    with check (seller_id = auth.uid());

create policy "Enable update for account owners"
    on public.connected_accounts for update
    to authenticated
    using (seller_id = auth.uid());

create policy "Enable delete for account owners"
    on public.connected_accounts for delete
    to authenticated
    using (seller_id = auth.uid());

-- Create policies for orders
create policy "Enable read for order owners"
    on public.orders for select
    to authenticated
    using (seller_id = auth.uid());

create policy "Enable insert for authenticated users"
    on public.orders for insert
    to authenticated
    with check (true);

create policy "Enable update for order owners"
    on public.orders for update
    to authenticated
    using (seller_id = auth.uid());

-- Create policies for settings
create policy "Enable read for everyone"
    on public.settings for select
    using (true);

create policy "Enable update for everyone"
    on public.settings for update
    using (true)
    with check (true);

-- Create auth trigger function
create or replace function public.handle_new_user()
returns trigger as $$
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
        status
      ) values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'businessName', ''),
        coalesce(new.raw_user_meta_data->>'businessAddress', ''),
        coalesce(new.raw_user_meta_data->>'phone', ''),
        coalesce(new.raw_user_meta_data->>'bio', ''),
        coalesce(new.raw_user_meta_data->>'profileImage', ''),
        'pending'
      );
    exception when others then
      raise warning 'Failed to create seller record: %', sqlerrm;
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

-- Create storage bucket for seller profile images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sellers',
  'sellers',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
) on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ];

-- Create storage policies
create policy "Enable storage for authenticated users"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'sellers')
  with check (bucket_id = 'sellers');

create policy "Enable public read access"
  on storage.objects for select
  to public
  using (bucket_id = 'sellers');

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant usage on schema storage to authenticated, public;
grant all on all tables in schema storage to authenticated;
grant select on all tables in schema storage to public;