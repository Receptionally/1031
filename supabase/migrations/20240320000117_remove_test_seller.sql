-- Drop test seller function if it exists
drop function if exists create_test_seller();

-- Drop any test seller data
delete from public.sellers where email = 'kai@alohafirewood.com';

-- Force schema cache refresh
notify pgrst, 'reload schema';