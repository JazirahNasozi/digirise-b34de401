-- Delete all auth users by using admin function
-- First clean up public tables (cascade should handle this but let's be explicit)
DELETE FROM public.websites;
DELETE FROM public.user_roles;
DELETE FROM public.profiles;

-- Delete auth users
DELETE FROM auth.users;