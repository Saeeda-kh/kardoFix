alter table public.service_requests
  add column customer_latitude numeric(9, 6),
  add column customer_longitude numeric(9, 6),
  add constraint service_requests_customer_coordinates_check check (
    (customer_latitude is null and customer_longitude is null)
    or (
      customer_latitude is not null
      and customer_longitude is not null
      and customer_latitude between -90 and 90
      and customer_longitude between -180 and 180
    )
  ) not valid;

drop policy "Visitors can submit new service requests" on public.service_requests;
create policy "Visitors can submit new service requests"
  on public.service_requests for insert to anon, authenticated
  with check (
    status = 'new'
    and customer_latitude is not null
    and customer_longitude is not null
    and customer_latitude between -90 and 90
    and customer_longitude between -180 and 180
    and (
      provider_id is null
      or exists (
        select 1 from public.provider_services provider_service
        where provider_service.provider_id = service_requests.provider_id
          and provider_service.offering_id = service_requests.offering_id
      )
    )
  );

grant insert (customer_latitude, customer_longitude) on public.service_requests to anon, authenticated;
revoke insert (area) on public.service_requests from anon, authenticated;

create or replace function public.set_service_request_coordinate_label()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.area := new.customer_latitude::text || ', ' || new.customer_longitude::text;
  return new;
end;
$$;

create trigger service_requests_set_coordinate_label
  before insert or update of customer_latitude, customer_longitude on public.service_requests
  for each row execute function public.set_service_request_coordinate_label();

create policy "Admins can read all service providers"
  on public.service_providers for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can update provider business coordinates"
  on public.service_providers for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant update (business_latitude, business_longitude) on public.service_providers to authenticated;
