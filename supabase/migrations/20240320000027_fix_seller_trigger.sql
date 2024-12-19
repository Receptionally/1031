-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create updated function that only creates basic seller record
create or replace function public.handle_new_user()
returns trigger as $$
begin
  if new.raw_user_meta_data->>'role' = 'seller' then
    insert into public.sellers (
      id,
      name,
      business_name,
      business_address,
      email,
      phone,
      status
    ) values (
      new.id,
      '', -- Empty name until onboarding
      '', -- Empty business name until onboarding
      '', -- Empty address until onboarding
      new.email,
      '', -- Empty phone until onboarding
      'pending'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();