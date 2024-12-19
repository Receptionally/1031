-- First delete all related data
delete from auth.identities;
delete from auth.sessions;
delete from auth.refresh_tokens;
delete from auth.mfa_factors;
delete from auth.mfa_challenges;
delete from auth.mfa_amr_claims;

-- Finally delete all users
delete from auth.users;