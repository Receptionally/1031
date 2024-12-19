-- Create view for seller onboarding status
create or replace view seller_onboarding_status as
select 
  s.id,
  s.email,
  s.status,
  case
    when s.bio is null or s.bio = '' then false
    when s.firewood_unit is null then false
    when s.price_per_unit is null then false
    when s.max_delivery_distance is null then false
    when s.min_delivery_fee is null then false
    when s.price_per_mile is null then false
    else true
  end as onboarding_complete,
  s.created_at,
  s.profile_image is not null as has_profile_image
from public.sellers s;

-- Create view for seller details
create or replace view seller_details as
select 
  s.*,
  ca.stripe_account_id,
  ca.connected_at as stripe_connected_at,
  case when ca.stripe_account_id is not null then true else false end as has_stripe_account
from sellers s
left join connected_accounts ca on s.id = ca.seller_id;

-- Grant permissions
grant select on seller_onboarding_status to authenticated;
grant select on seller_details to authenticated;