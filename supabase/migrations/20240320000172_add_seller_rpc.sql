-- Create RPC function to safely get or create seller
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

-- Grant execute permission
grant execute on function get_or_create_seller to authenticated;