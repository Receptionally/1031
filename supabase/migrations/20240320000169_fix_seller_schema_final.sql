-- Drop existing functions
drop function if exists get_or_create_seller;
drop function if exists handle_new_user cascade;

-- Add max_stacking_distance to sellers if it doesn't exist
alter table public.sellers
  add column if not exists max_stacking_distance integer;

-- Update existing records
update public.sellers
set max_stacking_distance = 20
where provides_stacking = true and (max_stacking_distance is null or max_stacking_distance <= 0);

-- Create improved get_or_create_seller function
create or replace function get_or_create_seller(user_id uuid)
returns json as $$
declare
  seller_record record;
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
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
  
  -- Return seller with connected accounts
  return (
    select json_build_object(
      'id', s.id,
      'email', s.email,
      'name', s.name,
      'business_name', s.business_name,
      'business_address', s.business_address,
      'phone', s.phone,
      'bio', s.bio,
      'firewood_unit', s.firewood_unit,
      'price_per_unit', s.price_per_unit,
      'max_delivery_distance', s.max_delivery_distance,
      'min_delivery_fee', s.min_delivery_fee,
      'price_per_mile', s.price_per_mile,
      'payment_timing', s.payment_timing,
      'provides_stacking', s.provides_stacking,
      'stacking_fee_per_unit', s.stacking_fee_per_unit,
      'max_stacking_distance', s.max_stacking_distance,
      'profile_image', s.profile_image,
      'status', s.status,
      'created_at', s.created_at,
      'connected_accounts', (
        select coalesce(json_agg(row_to_json(ca.*)), '[]'::json)
        from connected_accounts ca
        where ca.seller_id = s.id
      )
    )
    from sellers s
    where s.id = seller_record.id
  );
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
      );
      
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