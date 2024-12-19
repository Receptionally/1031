-- Add after the existing schema but before the permissions...

-- Create view for sellers with their Stripe accounts
create or replace view sellers_with_stripe as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account
from sellers s
left join connected_accounts ca on s.id = ca.seller_id;

-- Grant access to the view
grant select on sellers_with_stripe to anon, authenticated;