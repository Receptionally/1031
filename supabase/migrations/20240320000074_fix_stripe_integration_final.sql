-- Create a view for sellers with their Stripe accounts
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

-- Create function to check if seller has Stripe account
create or replace function seller_has_stripe_account(seller_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 
        from connected_accounts 
        where seller_id = $1
        and stripe_account_id is not null
    );
end;
$$ language plpgsql;

-- Create indexes for better performance
create index if not exists idx_connected_accounts_seller 
    on connected_accounts(seller_id, stripe_account_id);

-- Grant permissions
grant select on sellers_with_stripe to authenticated;
grant execute on function seller_has_stripe_account to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';