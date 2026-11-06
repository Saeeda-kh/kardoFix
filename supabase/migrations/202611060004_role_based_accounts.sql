create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 80),
  email text not null unique,
  role text not null check (role in ('customer', 'provider')),
  status text not null check (
    (role = 'customer' and status = 'active')
    or (role = 'provider' and status in ('pending_review', 'approved', 'rejected'))
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

drop policy "Visitors can submit new service requests" on public.service_requests;
create policy "Visitors and active customers can submit service requests"
  on public.service_requests for insert to anon, authenticated
  with check (
    status = 'new'
    and customer_latitude is not null
    and customer_longitude is not null
    and customer_latitude between -90 and 90
    and customer_longitude between -180 and 180
    and (
      (select auth.uid()) is null
      or (
        coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin'
        and exists (
          select 1 from public.user_profiles profile
          where profile.id = (select auth.uid())
            and profile.role = 'customer'
            and profile.status = 'active'
        )
      )
    )
    and (
      provider_id is null
      or exists (
        select 1 from public.provider_services provider_service
        where provider_service.provider_id = service_requests.provider_id
          and provider_service.offering_id = service_requests.offering_id
      )
    )
  );

create policy "Users can read their own profile"
  on public.user_profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "Admins can read all user profiles"
  on public.user_profiles for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Users can update their own display name"
  on public.user_profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
create policy "Admins can update provider approval status"
  on public.user_profiles for update to authenticated
  using (
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and role = 'provider'
  )
  with check (
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and role = 'provider'
  );

grant select on public.user_profiles to authenticated;
grant update (display_name) on public.user_profiles to authenticated;
grant update (status) on public.user_profiles to authenticated;

create or replace function public.create_user_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'account_type';
  profile_name text := btrim(coalesce(new.raw_user_meta_data ->> 'display_name', ''));
begin
  if requested_role is null or requested_role not in ('customer', 'provider') then
    raise exception 'Choose a supported account type.';
  end if;

  if char_length(profile_name) < 2 or char_length(profile_name) > 80 then
    raise exception 'Enter a name between 2 and 80 characters.';
  end if;

  insert into public.user_profiles (id, display_name, email, role, status)
  values (
    new.id,
    profile_name,
    new.email,
    requested_role,
    case when requested_role = 'provider' then 'pending_review' else 'active' end
  );

  return new;
end;
$$;

create trigger auth_user_created_profile
  after insert on auth.users
  for each row execute function public.create_user_profile_for_auth_user();
revoke all on function public.create_user_profile_for_auth_user() from public, anon, authenticated;

create trigger user_profiles_set_updated_at before update on public.user_profiles
  for each row execute function public.set_updated_at();

create or replace function public.prevent_user_profile_role_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (
    new.id is distinct from old.id
    or new.email is distinct from old.email
    or new.role is distinct from old.role
    or new.status is distinct from old.status
  ) and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Only KardoFix staff can change account role or approval status.';
  end if;
  return new;
end;
$$;

create trigger user_profiles_protect_account_role
  before update on public.user_profiles
  for each row execute function public.prevent_user_profile_role_changes();
revoke all on function public.prevent_user_profile_role_changes() from public, anon, authenticated;
