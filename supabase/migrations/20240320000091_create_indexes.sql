-- Create indexes for better performance
create index idx_sellers_status_email on public.sellers(status, email);
create index idx_connected_accounts_seller_id on public.connected_accounts(seller_id);
create index idx_connected_accounts_stripe_account on public.connected_accounts(stripe_account_id);