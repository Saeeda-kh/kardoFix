alter table public.service_providers
  add column business_latitude numeric(9, 6),
  add column business_longitude numeric(9, 6),
  add constraint service_providers_business_coordinates_check check (
    (business_latitude is null and business_longitude is null)
    or (
      business_latitude is not null
      and business_longitude is not null
      and
      business_latitude between -90 and 90
      and business_longitude between -180 and 180
    )
  );
