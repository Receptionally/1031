-- Add is_hidden column to orders table
alter table public.orders
  add column if not exists is_hidden boolean default false;

-- Add created_before_paywall column to track legacy orders
alter table public.orders
  add column if not exists created_before_paywall boolean 
  default true; -- Default true for existing orders

-- Update existing orders to not be hidden
update public.orders
set 
  is_hidden = false,
  created_before_paywall = true;

-- Create function to handle order visibility
create or replace function set_order_visibility()
returns trigger as $$
declare
  order_count integer;
begin
  -- Mark as new order
  new.created_before_paywall = false;
  
  -- Get count of previous orders
  select count(*) into order_count
  from orders
  where seller_id = new.seller_id
  and created_before_paywall = false;

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

-- Force schema cache refresh
notify pgrst, 'reload schema';