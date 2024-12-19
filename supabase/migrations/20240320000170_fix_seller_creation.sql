-- Drop existing functions
drop function if exists get_or_create_seller;
drop function if exists handle_new_user cascade;

-- Create improved get_or_create_seller function
create or replace function get_or_create_seller(user_id uuid)
returns setof sellers as $$
declare
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
  seller_record sellers%rowtype;
begin
  -- First try to get existing seller
  select * into seller_record
  from sellers s
  where s.id = user_id;
  
  -- If no record exists, create one
  if not found then
    insert into sellers (
      id,
      email,
      name,
      business_name,
      business_address,
      phone,
      bio,
      firewood_unit,
      payment_timing,
      provides_stacking,
      stacking_fee_per_unit,
      max_stacking_distance,
      status
    )
    values (
      user_id,
      (select email from auth.users where id = user_id),
      '',
      '',
      '',
      '',
      default_bio,
      'cords',
      'delivery',
      false,
      0,
      20,
      'pending'
    )
    returning * into seller_record;
  end if;
  
  return next seller_record;
end;
$$ language plpgsql security definer;

-- Create improved handle_new_user function
create or replace function handle_new_user()
returns trigger as $$
declare
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
begin
  if new.raw_user_meta_data->>'role' = 'seller' then
    begin
      -- Use upsert to avoid duplicate key errors
      insert into sellers (
        id,
        email,
        name,
        business_name,
        business_address,
        phone,
        bio,
        firewood_unit,
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
        'cords',
        'delivery',
        false,
        0,
        20,
        'pending'
      )
      on conflict (id) do nothing;
      
      raise notice 'Created seller record for user %', new.id;
    exception when others then
      raise warning 'Failed to create seller record for user %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Grant necessary permissions
grant execute on function get_or_create_seller to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';