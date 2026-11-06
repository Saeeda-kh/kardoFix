create table public.service_categories (
  slug text primary key,
  label text not null unique,
  href text not null unique,
  catalog_description text not null default '',
  catalog_count integer not null default 0 check (catalog_count >= 0),
  icon_key text not null default 'other',
  home_title text,
  home_price integer check (home_price is null or home_price >= 0),
  show_on_home boolean not null default false,
  display_order integer not null unique,
  is_active boolean not null default true,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_offerings (
  id text primary key,
  category_slug text not null references public.service_categories(slug) on update cascade on delete restrict,
  name text not null,
  description text not null default '',
  starting_price integer check (starting_price is null or starting_price >= 0),
  display_order integer not null default 0,
  is_active boolean not null default true,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_slug, name),
  unique (category_slug, id)
);

create table public.service_guides (
  slug text primary key,
  category_slug text not null unique references public.service_categories(slug) on update cascade on delete restrict,
  headline text not null,
  intro text not null,
  starting_price integer not null check (starting_price >= 0),
  benefits jsonb not null default '[]'::jsonb check (jsonb_typeof(benefits) = 'array'),
  steps jsonb not null default '[]'::jsonb check (jsonb_typeof(steps) = 'array'),
  faqs jsonb not null default '[]'::jsonb check (jsonb_typeof(faqs) = 'array'),
  is_active boolean not null default true,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_providers (
  id text primary key,
  name text not null,
  category_slug text not null references public.service_categories(slug) on update cascade on delete restrict,
  location text not null,
  description text not null,
  rating numeric(2, 1) not null check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  experience_years integer not null default 0 check (experience_years >= 0),
  starting_price integer check (starting_price is null or starting_price >= 0),
  featured_review text not null default '',
  tutor_levels text[] not null default '{}',
  subjects text[] not null default '{}',
  online_classes boolean,
  display_order integer not null default 0,
  is_active boolean not null default true,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_guide_offerings (
  guide_slug text not null references public.service_guides(slug) on update cascade on delete cascade,
  offering_id text not null references public.service_offerings(id) on update cascade on delete restrict,
  display_order integer not null default 0,
  primary key (guide_slug, offering_id)
);

create table public.provider_services (
  provider_id text not null references public.service_providers(id) on update cascade on delete cascade,
  offering_id text not null references public.service_offerings(id) on update cascade on delete restrict,
  primary key (provider_id, offering_id)
);

create table public.customer_testimonials (
  id text primary key,
  customer_name text not null,
  location text not null,
  quote text not null,
  display_order integer not null unique,
  is_active boolean not null default true,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_offerings_category_idx on public.service_offerings(category_slug, display_order);
create index service_providers_category_idx on public.service_providers(category_slug, is_active);
create index provider_services_offering_idx on public.provider_services(offering_id);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null references public.service_categories(slug) on update cascade on delete restrict,
  offering_id text not null references public.service_offerings(id) on update cascade on delete restrict,
  provider_id text references public.service_providers(id) on update cascade on delete set null,
  preferred_date date not null check (preferred_date >= current_date),
  preferred_time text not null check (preferred_time in ('Morning · 8 am–12 pm', 'Afternoon · 12–4 pm', 'Evening · 4–8 pm')),
  area text not null check (char_length(btrim(area)) between 2 and 100),
  customer_name text not null check (char_length(btrim(customer_name)) between 2 and 80),
  phone text not null check (
    char_length(phone) between 7 and 18
    and phone ~ '^[+0-9() .-]+$'
    and char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 13
  ),
  details text not null default '' check (char_length(details) <= 500),
  status text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint service_request_offering_category_fk
    foreign key (category_slug, offering_id)
    references public.service_offerings(category_slug, id)
    on update cascade on delete restrict
);

create index service_requests_status_created_idx on public.service_requests(status, created_at desc);
create index service_requests_provider_idx on public.service_requests(provider_id);

alter table public.service_categories enable row level security;
alter table public.service_offerings enable row level security;
alter table public.service_guides enable row level security;
alter table public.service_providers enable row level security;
alter table public.service_guide_offerings enable row level security;
alter table public.provider_services enable row level security;
alter table public.service_requests enable row level security;
alter table public.customer_testimonials enable row level security;

create policy "Public can read active service categories"
  on public.service_categories for select to anon, authenticated using (is_active);
create policy "Public can read active service offerings"
  on public.service_offerings for select to anon, authenticated using (is_active);
create policy "Public can read active service guides"
  on public.service_guides for select to anon, authenticated using (is_active);
create policy "Public can read active service providers"
  on public.service_providers for select to anon, authenticated using (is_active);
create policy "Public can read offerings in active service guides"
  on public.service_guide_offerings for select to anon, authenticated
  using (exists (
    select 1 from public.service_guides guide
    where guide.slug = guide_slug and guide.is_active
  ));
create policy "Public can read services of active providers"
  on public.provider_services for select to anon, authenticated
  using (exists (
    select 1 from public.service_providers provider
    where provider.id = provider_id and provider.is_active
  ));
create policy "Public can read active customer testimonials"
  on public.customer_testimonials for select to anon, authenticated using (is_active);

create policy "Visitors can submit new service requests"
  on public.service_requests for insert to anon, authenticated
  with check (
    status = 'new'
    and (
      provider_id is null
      or exists (
        select 1 from public.provider_services provider_service
        where provider_service.provider_id = service_requests.provider_id
          and provider_service.offering_id = service_requests.offering_id
      )
    )
  );
create policy "Only admins can read service requests"
  on public.service_requests for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Only admins can update service requests"
  on public.service_requests for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Only admins can delete service requests"
  on public.service_requests for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant select on public.service_categories, public.service_offerings, public.service_guides,
  public.service_providers, public.provider_services, public.service_guide_offerings,
  public.customer_testimonials to anon, authenticated;
revoke all on public.service_requests from public;
revoke all on public.service_requests from anon, authenticated;
grant insert (id, category_slug, offering_id, provider_id, preferred_date, preferred_time, area,
  customer_name, phone, details) on public.service_requests to anon, authenticated;
grant select, update, delete on public.service_requests to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger service_categories_set_updated_at before update on public.service_categories
  for each row execute function public.set_updated_at();
create trigger service_offerings_set_updated_at before update on public.service_offerings
  for each row execute function public.set_updated_at();
create trigger service_guides_set_updated_at before update on public.service_guides
  for each row execute function public.set_updated_at();
create trigger service_providers_set_updated_at before update on public.service_providers
  for each row execute function public.set_updated_at();
create trigger customer_testimonials_set_updated_at before update on public.customer_testimonials
  for each row execute function public.set_updated_at();
