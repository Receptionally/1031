-- First clear all test data
do $$
begin
  -- Delete all orders
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

  -- Delete all auth data
  delete from auth.identities;
  delete from auth.sessions;
  delete from auth.refresh_tokens;
  delete from auth.mfa_factors;
  delete from auth.mfa_challenges;
  delete from auth.mfa_amr_claims;
  delete from auth.users;

  -- Update seller trigger with new default bio
  create or replace function public.handle_new_user()
  returns trigger as $$
  declare
    default_bio text := 'I enjoy delivering firewood to my customers. It''s very hard work but it is also rewarding too as I get to be outside.';
  begin
    if new.raw_user_meta_data->>'role' = 'seller' then
      begin
        insert into public.sellers (
          id,
          email,
          name,
          business_name,
          business_address,
          phone,
          bio,
          profile_image,
          firewood_unit,
          price_per_unit,
          max_delivery_distance,
          min_delivery_fee,
          price_per_mile,
          payment_timing,
          provides_stacking,
          stacking_fee_per_unit,
          status
        ) values (
          new.id,
          new.email,
          coalesce(new.raw_user_meta_data->>'name', ''),
          coalesce(new.raw_user_meta_data->>'businessName', ''),
          coalesce(new.raw_user_meta_data->>'businessAddress', ''),
          coalesce(new.raw_user_meta_data->>'phone', ''),
          default_bio,
          null,
          'cords',
          null,
          null,
          null,
          null,
          'delivery',
          false,
          0,
          'pending'
        );
        
        raise notice 'Created seller record for user %', new.id;
      exception when others then
        raise warning 'Failed to create seller record for user %: %', new.id, sqlerrm;
      end;
    end if;
    return new;
  end;
  $$ language plpgsql security definer;

  -- Recreate trigger
  drop trigger if exists on_auth_user_created on auth.users;
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

  -- Log success
  raise notice 'Successfully cleaned up data and updated seller bio';
end;
$$ language plpgsql;