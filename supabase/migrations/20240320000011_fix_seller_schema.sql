-- Drop existing tables if they exist
drop table if exists public.sellers cascade;

-- Create sellers table
create table public.sellers (
    id uuid primary key,
    name text not null,
    business_name text not null,
    business_address text not null,
    email text not null unique,
    phone text not null,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint sellers_status_check check (status in ('pending', 'approved', 'rejected'))
);

-- Enable RLS
alter table public.sellers enable row level security;

-- RLS policies for sellers
create policy "Enable read for all users"
    on public.sellers for select
    using (true);

create policy "Enable insert for authenticated users"
    on public.sellers for insert
    to authenticated
    with check (auth.uid() = id);

create policy "Enable update for authenticated users"
    on public.sellers for update
    to authenticated
    using (auth.uid() = id);

-- Create auth trigger function
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
      coalesce(new.raw_user_meta_data->>'name', ''),
      coalesce(new.raw_user_meta_data->>'business_name', ''),
      coalesce(new.raw_user_meta_data->>'business_address', ''),
      new.email,
      coalesce(new.raw_user_meta_data->>'phone', ''),
      'pending'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;