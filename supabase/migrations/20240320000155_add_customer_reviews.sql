-- Create customer_reviews table
create table public.customer_reviews (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.sellers(id) on delete cascade,
    customer_name text not null,
    review_text text not null,
    rating integer not null check (rating between 1 and 5),
    profile_image text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint customer_reviews_text_length check (length(review_text) between 10 and 500)
);

-- Create indexes
create index idx_customer_reviews_seller on public.customer_reviews(seller_id);
create index idx_customer_reviews_rating on public.customer_reviews(rating);

-- Enable RLS
alter table public.customer_reviews enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.customer_reviews for select
    using (true);

create policy "Enable write access for seller"
    on public.customer_reviews for all
    to authenticated
    using (seller_id = auth.uid())
    with check (seller_id = auth.uid());

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.customer_reviews to authenticated;
grant select on public.customer_reviews to anon;