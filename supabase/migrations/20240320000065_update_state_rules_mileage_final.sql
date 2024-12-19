-- Drop and recreate state_rules table with all required fields
drop table if exists public.state_rules cascade;

create table public.state_rules (
    id uuid primary key default uuid_generate_v4(),
    state_code text not null unique,
    state_name text not null,
    allows_import boolean not null default true,
    allows_export boolean not null default true,
    allowed_import_states text[] default array[]::text[],
    allowed_export_states text[] default array[]::text[],
    requires_certification boolean not null default false,
    certification_details text,
    additional_requirements text,
    max_transport_miles integer,
    requires_certification_beyond_miles boolean default false,
    certification_miles_threshold integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Add constraint for certification miles
    constraint check_certification_miles check (
        certification_miles_threshold is null or 
        max_transport_miles is null or 
        certification_miles_threshold <= max_transport_miles
    )
);

-- Create updated_at trigger function
create or replace function update_state_rules_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_state_rules_timestamp
    before update on public.state_rules
    for each row
    execute function update_state_rules_updated_at();

-- Create indexes for better performance
create index idx_state_rules_state_code on public.state_rules(state_code);
create index idx_state_rules_max_transport_miles on public.state_rules(max_transport_miles);
create index idx_state_rules_updated_at on public.state_rules(updated_at desc);

-- Enable RLS
alter table public.state_rules enable row level security;

-- Create policies
create policy "Enable read access for everyone"
    on public.state_rules for select
    using (true);

create policy "Enable write access for authenticated users"
    on public.state_rules for all
    to authenticated
    using (true)
    with check (true);

-- Insert default state rules
insert into public.state_rules (state_code, state_name, allows_import, allows_export)
values
    ('AL', 'Alabama', true, true),
    ('AK', 'Alaska', true, true),
    ('AZ', 'Arizona', true, true),
    ('AR', 'Arkansas', true, true),
    ('CA', 'California', true, true),
    ('CO', 'Colorado', true, true),
    ('CT', 'Connecticut', true, true),
    ('DE', 'Delaware', true, true),
    ('FL', 'Florida', true, true),
    ('GA', 'Georgia', true, true),
    ('HI', 'Hawaii', true, true),
    ('ID', 'Idaho', true, true),
    ('IL', 'Illinois', true, true),
    ('IN', 'Indiana', true, true),
    ('IA', 'Iowa', true, true),
    ('KS', 'Kansas', true, true),
    ('KY', 'Kentucky', true, true),
    ('LA', 'Louisiana', true, true),
    ('ME', 'Maine', true, true),
    ('MD', 'Maryland', true, true),
    ('MA', 'Massachusetts', true, true),
    ('MI', 'Michigan', true, true),
    ('MN', 'Minnesota', true, true),
    ('MS', 'Mississippi', true, true),
    ('MO', 'Missouri', true, true),
    ('MT', 'Montana', true, true),
    ('NE', 'Nebraska', true, true),
    ('NV', 'Nevada', true, true),
    ('NH', 'New Hampshire', true, true),
    ('NJ', 'New Jersey', true, true),
    ('NM', 'New Mexico', true, true),
    ('NY', 'New York', true, true),
    ('NC', 'North Carolina', true, true),
    ('ND', 'North Dakota', true, true),
    ('OH', 'Ohio', true, true),
    ('OK', 'Oklahoma', true, true),
    ('OR', 'Oregon', true, true),
    ('PA', 'Pennsylvania', true, true),
    ('RI', 'Rhode Island', true, true),
    ('SC', 'South Carolina', true, true),
    ('SD', 'South Dakota', true, true),
    ('TN', 'Tennessee', true, true),
    ('TX', 'Texas', true, true),
    ('UT', 'Utah', true, true),
    ('VT', 'Vermont', true, true),
    ('VA', 'Virginia', true, true),
    ('WA', 'Washington', true, true),
    ('WV', 'West Virginia', true, true),
    ('WI', 'Wisconsin', true, true),
    ('WY', 'Wyoming', true, true);

-- Force schema cache refresh
notify pgrst, 'reload schema';

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;