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
    ) as pending_updates
from sellers s
left join connected_accounts ca on s.id = ca.seller_id;

-- Create view for seller subscription status
create view seller_subscription_status as
select distinct
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
  greatest(0, 3 - s.total_orders) as orders_until_subscription
from sellers s;

-- Grant permissions
grant select on admin_seller_view to authenticated;
grant select on seller_subscription_status to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';