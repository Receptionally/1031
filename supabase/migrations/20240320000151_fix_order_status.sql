-- Update orders table to only have pending/completed status
alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check check (status in ('pending', 'completed'));

-- Update any existing orders to use new status values
update public.orders
set status = case
  when status in ('processing', 'cancelled') then 'pending'
  else status
end;

-- Force schema cache refresh
notify pgrst, 'reload schema';