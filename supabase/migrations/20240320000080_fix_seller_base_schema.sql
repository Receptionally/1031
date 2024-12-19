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
    constraint sellers_payment_timing_check check (payment_timing in ('scheduling', 'delivery'))
);

-- Enable RLS
alter table public.sellers enable row level security;

-- Create basic indexes
create index idx_sellers_status_email on public.sellers(status, email);