-- Drop existing views
drop view if exists admin_seller_view cascade;
drop view if exists seller_subscription_status cascade;

-- Create comprehensive admin view for sellers
create view admin_seller_view as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    coalesce(s.total_orders, 0) as total_orders,
    coalesce(
        (select sum(total_amount)::decimal(10,2) 
         from orders o 
         where o.seller_id = s.id 
         and o.stripe_payment_status = 'succeeded'),
        0
    ) as total_revenue,
    (
        select json_agg(json_build_object(
            'id', su.id,
            'updates', su.updates,
            'status', su.status,
            'created_at', su.created_at
        ))
        from seller_updates su
        where su.seller_id = s.id
        and su.status = 'pending'
    ) as pending_updates,
    case
        when s.total_orders >= 3 then true
        else false
    end as requires_subscription,
    case
        when coalesce(s.debt_amount, 0) > 0 then false
        when s.subscription_status = 'active' then true
        when s.total_orders < 3 then true
        else false
    end as can_accept_orders,
    greatest(0, 3 - coalesce(s.total_orders, 0)) as orders_until_subscription
from sellers s
left join connected_accounts ca on s.id = ca.seller_id;

-- Create view for seller subscription status
create view seller_subscription_status as
select
  s.id,
  s.business_name,
  s.total_orders,
  s.subscription_status,
  s.setup_intent_id,
  s.setup_intent_status,
  s.subscription_start_date,
  s.subscription_end_date,
  coalesce(s.debt_amount, 0) as debt_amount,
  s.last_failed_charge,
  s.failed_charge_amount,
  case
    when s.total_orders >= 3 then true
    else false
  end as requires_subscription,
  case
    when coalesce(s.debt_amount, 0) > 0 then false
    when s.subscription_status = 'active' then true
    when s.total_orders < 3 then true
    else false
  end as can_accept_orders,
  greatest(0, 3 - coalesce(s.total_orders, 0)) as orders_until_subscription
from sellers s;

-- Update get_or_create_seller function to properly initialize fields
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
      debt_amount,
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
      0,
      'pending'
    )
    returning * into seller_record;
  end if;
  
  return next seller_record;
end;
$$ language plpgsql security definer;

-- Grant permissions
grant select on admin_seller_view to authenticated;
grant select on seller_subscription_status to authenticated;
grant execute on function get_or_create_seller to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';