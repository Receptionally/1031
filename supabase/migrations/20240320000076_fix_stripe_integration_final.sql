-- Drop existing views
drop view if exists sellers_with_stripe cascade;
drop view if exists admin_stripe_accounts_view cascade;

-- Create comprehensive view for sellers with Stripe accounts
create or replace view sellers_with_stripe as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    case
        when ca.stripe_account_id is not null then 'card'
        else null
    end as payment_method
from sellers s
left join connected_accounts ca on s.id = ca.seller_id;

-- Create admin view for Stripe accounts
create or replace view admin_stripe_accounts_view as
select 
    s.id as seller_id,
    s.business_name,
    s.email,
    s.phone,
    s.business_address,
    s.status as seller_status,
    s.profile_image,
    s.payment_timing,
    ca.stripe_account_id,
    ca.connected_at,
    (
        select count(*)::integer 
        from orders o 
        where o.seller_id = s.id
        and o.stripe_account_id = ca.stripe_account_id
    ) as total_orders,
    (
        select coalesce(sum(total_amount), 0)::decimal(10,2)
        from orders o 
        where o.seller_id = s.id
        and o.stripe_account_id = ca.stripe_account_id
        and o.stripe_payment_status = 'succeeded'
    ) as total_processed,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
order by ca.connected_at desc nulls last;

-- Create indexes for better performance
create index if not exists idx_connected_accounts_seller 
    on connected_accounts(seller_id, stripe_account_id);
create index if not exists idx_orders_stripe_status 
    on orders(stripe_account_id, stripe_payment_status);
create index if not exists idx_orders_seller_stripe 
    on orders(seller_id, stripe_account_id);

-- Grant permissions
grant select on sellers_with_stripe to authenticated;
grant select on admin_stripe_accounts_view to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';