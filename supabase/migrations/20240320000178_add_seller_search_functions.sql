-- Create function to find nearby sellers
create or replace function find_nearby_sellers(
  search_lat double precision,
  search_lng double precision,
  max_distance integer default 100
)
returns table (
  id uuid,
  business_name text,
  distance double precision
) as $$
begin
  return query
  select 
    s.id,
    s.business_name,
    (
      point(search_lng, search_lat) <@> 
      point(
        (regexp_match(s.business_address, '.*\s([0-9.-]+),\s*([0-9.-]+).*'))[1]::float8,
        (regexp_match(s.business_address, '.*\s([0-9.-]+),\s*([0-9.-]+).*'))[2]::float8
      )
    )::double precision as distance
  from sellers s
  where s.status = 'approved'
  and (
    point(search_lng, search_lat) <@> 
    point(
      (regexp_match(s.business_address, '.*\s([0-9.-]+),\s*([0-9.-]+).*'))[1]::float8,
      (regexp_match(s.business_address, '.*\s([0-9.-]+),\s*([0-9.-]+).*'))[2]::float8
    )
  ) <= max_distance
  order by distance;
end;
$$ language plpgsql security definer;