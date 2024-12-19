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
    ) as total_processed
from sellers s
left join connected_accounts ca on s.id = ca.seller_id
order by ca.connected_at desc nulls last;

-- Create indexes for better performance
create index if not exists idx_orders_stripe_status 
    on orders(stripe_account_id, stripe_payment_status);
create index if not exists idx_orders_seller_stripe 
    on orders(seller_id, stripe_account_id);

-- Create function to check if seller has Stripe account
create or replace function seller_has_stripe_account(seller_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 
        from connected_accounts 
        where seller_id = $1
    );
end;
$$ language plpgsql;

-- Grant permissions
grant select on admin_stripe_accounts_view to authenticated;
grant execute on function seller_has_stripe_account to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';