-- Create a comprehensive view for Stripe accounts with seller details
create or replace view admin_stripe_accounts_view as
select 
    s.id as seller_id,
    s.business_name,
    s.email,
    s.phone,
    s.business_address,
    s.status as seller_status,
    s.profile_image,
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
        and o.payment_method = 'card'
        and o.payment_status = 'paid'
    ) as total_processed
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
order by ca.connected_at desc nulls last;

-- Create indexes for better performance
create index if not exists idx_orders_seller_stripe 
    on orders(seller_id, stripe_account_id, payment_method, payment_status);

-- Grant access to the view
grant select on admin_stripe_accounts_view to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';