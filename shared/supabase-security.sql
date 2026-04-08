-- Recommended Supabase policies for muhammad_bio
-- Run these in Supabase SQL editor after confirming your exact table schemas.

alter table if exists public.projects enable row level security;
alter table if exists public.messages enable row level security;
alter table if exists public.clients enable row level security;

drop policy if exists "Public can read active projects" on public.projects;
create policy "Public can read active projects"
on public.projects
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "Authenticated admins manage projects" on public.projects;
create policy "Authenticated admins manage projects"
on public.projects
for all
to authenticated
using (auth.jwt() ->> 'email' = any (string_to_array(coalesce(current_setting('request.jwt.claims', true)::json ->> 'app_metadata' ->> 'admin_emails', ''), ',')))
with check (auth.jwt() ->> 'email' = any (string_to_array(coalesce(current_setting('request.jwt.claims', true)::json ->> 'app_metadata' ->> 'admin_emails', ''), ',')));

drop policy if exists "No direct public message inserts" on public.messages;
create policy "No direct public message inserts"
on public.messages
for insert
to anon, authenticated
with check (false);

drop policy if exists "Authenticated admins read messages" on public.messages;
create policy "Authenticated admins read messages"
on public.messages
for select
to authenticated
using (auth.jwt() ->> 'email' = any (string_to_array(coalesce(current_setting('request.jwt.claims', true)::json ->> 'app_metadata' ->> 'admin_emails', ''), ',')));

drop policy if exists "Authenticated admins manage clients" on public.clients;
create policy "Authenticated admins manage clients"
on public.clients
for all
to authenticated
using (auth.jwt() ->> 'email' = any (string_to_array(coalesce(current_setting('request.jwt.claims', true)::json ->> 'app_metadata' ->> 'admin_emails', ''), ',')))
with check (auth.jwt() ->> 'email' = any (string_to_array(coalesce(current_setting('request.jwt.claims', true)::json ->> 'app_metadata' ->> 'admin_emails', ''), ',')));
