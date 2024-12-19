-- Drop and recreate the sellers table with all required fields
drop table if exists public.sellers cascade;

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

-- Enable RLS
alter table public.sellers enable row level security;

-- Create policies
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

-- Create settings table
create table if not exists public.settings (
    id uuid primary key default uuid_generate_v4(),
    dev_mode boolean not null default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings if not exists
insert into public.settings (dev_mode)
select false
where not exists (select 1 from public.settings);

-- Enable RLS for settings
alter table public.settings enable row level security;

-- Create policies for settings
create policy "Enable read for everyone"
    on public.settings for select
    using (true);

create policy "Enable update for everyone"
    on public.settings for update
    using (true)
    with check (true);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;