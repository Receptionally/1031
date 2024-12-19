-- Drop existing function if it exists
drop function if exists get_or_create_seller;

-- Create function to safely get or create seller record
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
      provides_kiln_dried,
      kiln_dried_fee_per_unit,
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
      false,
      0,
      'pending'
    )
    returning * into seller_record;
  end if;
  
  return next seller_record;
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function get_or_create_seller to authenticated;

-- Create RPC function to ensure seller exists
create or replace function ensure_seller_exists(user_id uuid)
returns void as $$
begin
  perform get_or_create_seller(user_id);
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function ensure_seller_exists to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';