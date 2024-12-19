-- First clear all related data in the correct order
do $$
begin
  -- Delete all orders
  delete from public.orders;

  -- Delete all pageviews
  delete from public.pageviews;

  -- Delete all search appearances
  delete from public.seller_search_appearances;

  -- Delete all address searches
  delete from public.address_searches;

  -- Delete all connected accounts
  delete from public.connected_accounts;

  -- Delete all seller updates
  delete from public.seller_updates;

  -- Delete all sellers
  delete from public.sellers;

  -- Delete all storage objects
  delete from storage.objects where bucket_id = 'profile-images';

  -- Reset settings to default
  update public.settings
  set dev_mode = false
  where true;

  -- Delete all auth data
  delete from auth.identities;
  delete from auth.sessions;
  delete from auth.refresh_tokens;
  delete from auth.mfa_factors;
  delete from auth.mfa_challenges;
  delete from auth.mfa_amr_claims;
  delete from auth.users;

  -- Log success
  raise notice 'Successfully cleared all seller and order data';
end;
$$ language plpgsql;