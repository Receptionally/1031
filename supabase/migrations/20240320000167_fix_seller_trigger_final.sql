-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create improved seller trigger function
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
begin
  -- Only create seller record if role is seller
  if new.raw_user_meta_data->>'role' = 'seller' then
    begin
      -- Insert with all required fields
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
        max_stacking_distance,
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
        20,
        'pending'
      );
      
      -- Log success
      raise notice 'Created seller record for user %', new.id;
    exception when others then
      -- Log error but don't prevent user creation
      raise warning 'Failed to create seller record for user %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to ensure seller record exists
create or replace function ensure_seller_record(user_id uuid)
returns void as $$
declare
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
begin
  -- Check if seller record exists
  if not exists (select 1 from public.sellers where id = user_id) then
    -- Create seller record if it doesn't exist
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
      max_stacking_distance,
      status
    )
    select
      auth.uid() as id,
      auth.email() as email,
      '',
      '',
      '',
      '',
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
      20,
      'pending'
    where auth.uid() = user_id;
  end if;
end;
$$ language plpgsql security definer;

-- Grant execute permission on the function
grant execute on function ensure_seller_record to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';