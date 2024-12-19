-- Drop existing payment_intents table and related objects
drop table if exists public.payment_intents cascade;

-- Create payment_intents table with proper schema
create table public.payment_intents (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    order_id uuid references public.orders(id) on delete cascade,
    stripe_payment_intent_id text not null,
    amount integer not null,
    status text not null check (status in ('pending', 'succeeded', 'failed')),
    type text not null check (type in ('subscription_charge')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_payment_intents_seller on public.payment_intents(seller_id);
create index idx_payment_intents_order on public.payment_intents(order_id);
create index idx_payment_intents_status on public.payment_intents(status);

-- Create function to update payment intent status
create or replace function update_payment_intent_status(
  p_payment_intent_id text,
  p_status text
) returns void as $$
begin
  update payment_intents
  set 
    status = p_status,
    updated_at = now()
  where stripe_payment_intent_id = p_payment_intent_id;

  -- If payment succeeded, clear any debt
  if p_status = 'succeeded' then
    update sellers s
    set 
      debt_amount = 0,
      last_failed_charge = null,
      failed_charge_amount = null,
      subscription_status = 'active'
    from payment_intents pi
    where pi.stripe_payment_intent_id = p_payment_intent_id
    and pi.seller_id = s.id;
  end if;

  -- If payment failed, record the debt
  if p_status = 'failed' then
    update sellers s
    set 
      debt_amount = coalesce(debt_amount, 0) + (pi.amount::decimal / 100),
      last_failed_charge = now(),
      failed_charge_amount = pi.amount::decimal / 100,
      subscription_status = 'past_due'
    from payment_intents pi
    where pi.stripe_payment_intent_id = p_payment_intent_id
    and pi.seller_id = s.id;
  end if;
end;
$$ language plpgsql security definer;

-- Create function to record new payment intent
create or replace function record_payment_intent(
  p_seller_id uuid,
  p_order_id uuid,
  p_payment_intent_id text,
  p_amount integer,
  p_type text
) returns void as $$
begin
  insert into payment_intents (
    seller_id,
    order_id, 
    stripe_payment_intent_id,
    amount,
    status,
    type
  ) values (
    p_seller_id,
    p_order_id,
    p_payment_intent_id,
    p_amount,
    'pending',
    p_type
  );
end;
$$ language plpgsql security definer;

-- Enable RLS
alter table public.payment_intents enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.payment_intents for select
    using (true);

create policy "Enable insert access for everyone"
    on public.payment_intents for insert
    with check (true);

-- Grant permissions
grant all privileges on public.payment_intents to authenticated;
grant execute on function update_payment_intent_status to authenticated;
grant execute on function record_payment_intent to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';