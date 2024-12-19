-- Drop existing view if it exists
drop view if exists sellers_with_stripe cascade;

-- Create view for sellers with Stripe accounts and subscription info
create or replace view sellers_with_stripe as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    coalesce(s.debt_amount, 0) as debt_amount,
    case
        when coalesce(s.debt_amount, 0) > 0 then false
        when s.subscription_status = 'active' then true
        when s.total_orders < 3 then true
        else false
    end as can_accept_orders
from sellers s
left join connected_accounts ca on s.id = ca.seller_id;

-- Grant permissions
grant select on sellers_with_stripe to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';