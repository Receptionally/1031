-- Drop existing view if it exists
drop view if exists sellers_with_stripe cascade;

-- Create view for sellers with Stripe accounts and subscription info
create view sellers_with_stripe as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    case
        when s.subscription_status = 'active' then true
        when s.total_orders < 3 then true
        else false
    end as can_accept_orders
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
where s.status = 'approved'
and (
    s.subscription_status = 'active' 
    or s.total_orders < 3
);

-- Create index for better performance
create index if not exists idx_sellers_subscription_status 
    on sellers(subscription_status, total_orders);

-- Grant permissions
grant select on sellers_with_stripe to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';