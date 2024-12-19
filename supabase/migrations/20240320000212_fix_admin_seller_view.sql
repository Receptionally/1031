-- Drop existing views
drop view if exists admin_seller_view cascade;

-- Create comprehensive admin view for sellers
create or replace view admin_seller_view as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    coalesce(
        (select count(*)::integer from orders o where o.seller_id = s.id),
        0
    ) as total_orders,
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

-- Grant permissions
grant select on admin_seller_view to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';