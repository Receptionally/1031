-- Add default values for payment fields
alter table public.sellers
  alter column accepts_cash_on_delivery set default true,
  alter column payment_timing set default 'delivery';

-- Update existing sellers to have default payment options
update public.sellers
set 
  accepts_cash_on_delivery = true,
  payment_timing = 'delivery'
where 
  accepts_cash_on_delivery is null 
  or payment_timing is null;

-- Update the handle_new_user function to set default payment options
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

-- Force schema cache refresh
notify pgrst, 'reload schema';