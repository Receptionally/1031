-- Clear test data from all tables in a safe order
do $$
begin
  -- First delete all orders
  delete from public.orders;

  -- Delete connected accounts
  delete from public.connected_accounts;

  -- Delete seller updates
  delete from public.seller_updates;

  -- Delete city pages
  delete from public.city_pages;

  -- Delete sellers
  delete from public.sellers;

  -- Delete storage objects
  delete from storage.objects where bucket_id = 'profile-images';

  -- Reset settings to default
  update public.settings
  set dev_mode = false
  where true;

  -- Log success
  raise notice 'Successfully cleared all test data';
end;
$$ language plpgsql;