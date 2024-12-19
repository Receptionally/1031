-- Create payment_intents table to track charges
create table public.payment_intents (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    order_id uuid references public.orders(id) on delete cascade,
    stripe_payment_intent_id text not null,
    amount integer not null,
    status text not null check (status in ('succeeded', 'failed')),
    type text not null check (type in ('subscription_charge')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_payment_intents_seller on public.payment_intents(seller_id);
create index idx_payment_intents_order on public.payment_intents(order_id);
create index idx_payment_intents_created_at on public.payment_intents(created_at desc);

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
grant usage on schema public to anon, authenticated;
grant all privileges on public.payment_intents to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';