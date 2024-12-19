-- Drop and recreate state_rules table with proper schema
drop table if exists public.state_rules cascade;

create table public.state_rules (
    id uuid primary key default uuid_generate_v4(),
    state_code text not null unique,
    state_name text not null,
    allows_import boolean not null default true,
    allows_export boolean not null default true,
    allowed_import_states text[] default array[]::text[],
    allowed_export_states text[] default array[]::text[],
    requires_certification boolean not null default false,
    certification_details text,
    additional_requirements text,
    max_transport_miles integer,
    requires_certification_beyond_miles boolean default false,
    certification_miles_threshold integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Add constraint for certification miles
    constraint check_certification_miles check (
        certification_miles_threshold is null or 
        max_transport_miles is null or 
        certification_miles_threshold <= max_transport_miles
    )
);

-- Create indexes for better performance
create index idx_state_rules_state_code on public.state_rules(state_code);
create index idx_state_rules_max_transport_miles on public.state_rules(max_transport_miles);
create index idx_state_rules_updated_at on public.state_rules(updated_at desc);

-- Enable RLS
alter table public.state_rules enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.state_rules for select
    using (true);

create policy "Enable write access for authenticated users"
    on public.state_rules for all
    to authenticated
    using (true)
    with check (true);

-- Insert default state rules with mileage limits
insert into public.state_rules (
    state_code, 
    state_name, 
    allows_import, 
    allows_export,
    max_transport_miles,
    requires_certification_beyond_miles,
    certification_miles_threshold
) values
    ('AL', 'Alabama', true, true, 100, true, 50),
    ('AK', 'Alaska', true, true, 100, true, 50),
    ('AZ', 'Arizona', true, true, 100, true, 50),
    -- Add remaining states with same default values
    ('WY', 'Wyoming', true, true, 100, true, 50);

-- Update sellers table with payment fields
alter table public.sellers
    alter column accepts_cash_on_delivery set default true,
    alter column payment_timing set default 'delivery';

-- Update orders table with payment fields
alter table public.orders
    add column if not exists payment_method text check (payment_method in ('card', 'cash')),
    add column if not exists payment_timing text check (payment_timing in ('scheduling', 'delivery')),
    add column if not exists payment_status text check (payment_status in ('pending', 'paid', 'failed')),
    add column if not exists payment_date timestamp with time zone;

-- Create function to update state rules timestamp
create or replace function update_state_rules_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_state_rules_timestamp
    before update on public.state_rules
    for each row
    execute function update_state_rules_updated_at();

-- Update seller trigger to set default payment options
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
        accepts_cash_on_delivery,
        payment_timing,
        status
      ) values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'businessName', ''),
        coalesce(new.raw_user_meta_data->>'businessAddress', ''),
        coalesce(new.raw_user_meta_data->>'phone', ''),
        true, -- Default to accepting cash
        'delivery', -- Default to payment at delivery
        'pending'
      );
    exception when others then
      raise warning 'Failed to create seller record: %', sqlerrm;
    end;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update existing sellers to have default payment options
update public.sellers
set 
    accepts_cash_on_delivery = true,
    payment_timing = 'delivery'
where 
    accepts_cash_on_delivery is null 
    or payment_timing is null;

-- Update existing orders with payment info
update public.orders
set
    payment_method = 'card',
    payment_timing = 'delivery',
    payment_status = 'pending'
where payment_method is null;

-- Create indexes for better performance
create index if not exists idx_orders_seller_payment 
    on public.orders(seller_id, payment_method, payment_status);
create index if not exists idx_orders_customer 
    on public.orders(customer_email, customer_name);

-- Force schema cache refresh
notify pgrst, 'reload schema';

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;