-- Create payment_intents table if it doesn't exist
create table if not exists public.payment_intents (
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
create index if not exists idx_payment_intents_seller 
    on payment_intents(seller_id);
create index if not exists idx_payment_intents_order 
    on payment_intents(order_id);

-- Create function to charge seller after order
create or replace function charge_seller_subscription()
returns trigger as $$
declare
    seller_record record;
begin
    -- Get seller record
    select * into seller_record
    from sellers
    where id = new.seller_id;

    -- Only proceed if this is beyond the 3rd order
    if seller_record.total_orders >= 3 then
        -- Call Netlify function to charge seller
        perform http_post(
            'https://' || current_setting('custom.app_url') || '/.netlify/functions/charge-seller',
            json_build_object(
                'sellerId', new.seller_id,
                'orderId', new.id
            )::text,
            'application/json'
        );
    end if;

    return new;
end;
$$ language plpgsql;

-- Create trigger to charge seller after order
create trigger charge_seller_subscription_trigger
    after insert on orders
    for each row
    execute function charge_seller_subscription();

-- Grant permissions
grant all on public.payment_intents to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';