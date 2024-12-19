-- First delete all related auth data in the correct order
delete from auth.identities;
delete from auth.sessions;
delete from auth.refresh_tokens;
delete from auth.mfa_factors;
delete from auth.mfa_challenges;
delete from auth.mfa_amr_claims;

-- Finally delete all users
delete from auth.users;

-- Log success
do $$
begin
  raise notice 'Successfully removed all auth users and related data';
end $$;