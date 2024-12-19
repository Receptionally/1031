-- Drop existing function
drop function if exists get_or_create_seller;

-- Create improved function to get or create seller
create or replace function get_or_create_seller(user_id uuid)
returns setof sellers as $$
declare
  default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
  user_email text;
  seller_record sellers%rowtype;
begin
  -- Get user's email
  select email into user_email
  from auth.users
  where id = user_id;

  if not found then
    raise exception 'User not found';
  end if;

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
      subscription_status,
      total_orders,
      status
    )
    values (
      user_id,
      user_email,
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
      'none',
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