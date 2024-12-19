-- Drop existing view
drop view if exists order_management;

-- Create view with correct column names
create view order_management as
select 
    o.*,
    s.business_name as seller_business_name,
    s.email as seller_email,
    s.phone as seller_phone,
    s.business_address as seller_address
from orders o
left join sellers s on o.seller_id = s.id;

-- Grant permissions
grant select on order_management to anon, authenticated;

-- Force schema cache refresh
notify pgrst, 'reload schema';