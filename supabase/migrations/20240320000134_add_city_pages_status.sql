-- Add status field to city_pages table
alter table public.city_pages 
  add column if not exists status text not null default 'pending'
  check (status in ('pending', 'approved', 'rejected'));

-- Set default published value based on status
alter table public.city_pages 
  alter column published set default false,
  add constraint city_pages_published_check 
  check (
    (status = 'approved' and published = true) or
    (status != 'approved' and published = false)
  );

-- Create function to handle city page approval
create or replace function approve_city_page(page_id uuid)
returns void as $$
begin
  update public.city_pages
  set 
    status = 'approved',
    published = true,
    updated_at = now()
  where id = page_id;
end;
$$ language plpgsql;

-- Create view for city page management with status
create or replace view city_page_management as
select 
    cp.*,
    (
        select count(*)::integer 
        from orders o 
        where o.delivery_address like cp.city || '%' 
        and o.delivery_address like '%' || cp.state || '%'
    ) as total_orders,
    case 
        when status = 'approved' then true
        else false
    end as generated
from city_pages cp;

-- Grant execute permission on the function
grant execute on function approve_city_page to authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';