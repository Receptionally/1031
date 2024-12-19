-- Add mileage-related columns to state_rules table
alter table public.state_rules
  add column if not exists max_transport_miles integer,
  add column if not exists requires_certification_beyond_miles boolean default false,
  add column if not exists certification_miles_threshold integer;

-- Add check constraint to ensure certification_miles_threshold is less than max_transport_miles
alter table public.state_rules
  add constraint check_certification_miles 
  check (
    certification_miles_threshold is null or 
    max_transport_miles is null or 
    certification_miles_threshold <= max_transport_miles
  );

-- Create index for better performance
create index if not exists idx_state_rules_max_transport_miles 
  on public.state_rules(max_transport_miles);