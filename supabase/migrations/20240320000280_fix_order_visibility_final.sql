-- Drop existing trigger and function
drop trigger if exists set_order_visibility_trigger on orders;
drop function if exists set_order_visibility cascade;

-- Add is_hidden column to orders table if it doesn't exist
alter table public.orders
  add column if not exists is_hidden boolean default true;

-- Remove created_before_paywall column since we want all orders to be treated the same
alter table public.orders
  drop column if exists created_before_paywall;

-- Update all orders to be hidden by default
update public.orders
set is_hidden = true;

-- Create function to handle order visibility
create or replace function set_order_visibility()
returns trigger as $$
declare
  order_count integer;
begin
  -- Get count of previous orders
  select count(*) into order_count
  from orders
  where seller_id = new.seller_id;

  -- First 3 orders are free
  new.is_hidden = order_count >= 3;

  return new;
end;
$$ language plpgsql;

-- Create trigger for new orders
create trigger set_order_visibility_trigger
  before insert on orders
  for each row
  execute function set_order_visibility();

-- Create index for better performance
create index if not exists idx_orders_visibility
  on orders(seller_id, is_hidden);

-- Force schema cache refresh
notify pgrst, 'reload schema';