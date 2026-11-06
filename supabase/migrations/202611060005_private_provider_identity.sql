create table public.provider_private_applications (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  nic_number text not null check (char_length(btrim(nic_number)) between 1 and 80),
  photo_object_path text not null unique,
  created_at timestamptz not null default now()
);

alter table public.provider_private_applications enable row level security;

create policy "Providers can read their own private application"
  on public.provider_private_applications for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Admins can read private provider applications"
  on public.provider_private_applications for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant select on public.provider_private_applications to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'provider-private-documents',
  'provider-private-documents',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Providers can read their own private identity photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'provider-private-documents'
    and split_part(name, '/', 1) = (select auth.uid())::text
  );
create policy "Admins can read private provider identity photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'provider-private-documents'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
