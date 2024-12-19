-- Drop existing views and tables in correct order
drop view if exists sellers_with_stripe cascade;
drop view if exists admin_stripe_accounts_view cascade;
drop view if exists seller_details cascade;
drop table if exists public.connected_accounts cascade;
drop table if exists public.sellers cascade;