-- Create a view for connected Stripe accounts with seller details
create or replace view stripe_accounts_view as
select 
    ca.stripe_account_id,
    ca.connected_at,
    s.id as seller_id,
    s.business_name,
    s.email,
    s.status as seller_status,
    s.profile_image,
    (
        select count(*)::integer 
        from orders o 
        where o.stripe_account_id = ca.stripe_account_id
    ) as total_orders,
    (
        select coalesce(sum(total_amount), 0)::decimal(10,2)
        from orders o 
        where o.stripe_account_id = ca.stripe_account_id
        and o.payment_method = 'card'
        and o.payment_status = 'paid'
    ) as total_processed
from connected_accounts ca
inner join sellers s on s.id = ca.seller_id
order by ca.connected_at desc;

-- Create indexes for better performance
create index if not exists idx_orders_stripe_metrics 
    on orders(stripe_account_id, payment_method, payment_status);

-- Grant access to the view
grant select on stripe_accounts_view to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';