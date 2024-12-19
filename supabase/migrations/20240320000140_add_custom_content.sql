-- Add custom content field to city_pages table
alter table public.city_pages
  add column if not exists custom_content text;

-- Update existing pages to have default content
update public.city_pages
set custom_content = 
  'About ' || city || ' Firewood Delivery
Finding reliable firewood delivery in ' || city || ', ' || state || ' has never been easier. Our local sellers provide premium, seasoned firewood delivered right to your door. Whether you need wood for your fireplace, wood stove, or outdoor fire pit, we connect you with trusted local suppliers who understand the specific needs of ' || city || ' residents.

Our sellers offer various wood types common to the ' || state || ' region, ensuring you get the best burning experience possible. With options for convenient delivery and professional stacking services, we make it simple to keep your home warm and cozy throughout the season.'
where custom_content is null;

-- Force schema cache refresh
notify pgrst, 'reload schema';