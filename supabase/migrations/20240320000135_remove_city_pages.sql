-- Drop city pages related objects
drop view if exists city_page_management cascade;
drop function if exists approve_city_page cascade;
drop function if exists update_city_pages_timestamp cascade;
drop table if exists public.city_pages cascade;

-- Force schema cache refresh
notify pgrst, 'reload schema';