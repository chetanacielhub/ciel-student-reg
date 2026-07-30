-- Replace the email and run once after that user has signed up.
insert into public.admin_users (user_id)
select id
from public.profiles
where lower(email) = lower('admin@gmail.com')
on conflict (user_id) do nothing;
