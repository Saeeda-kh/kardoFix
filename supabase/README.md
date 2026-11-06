# Supabase setup

1. In the Supabase SQL Editor, run `migrations/202611060001_initial_marketplace.sql`.
2. Run `migrations/202611060002_provider_business_coordinates.sql` to add nullable latitude and longitude fields to service providers.
3. Run `migrations/202611060003_map_selected_locations.sql` to save customer request coordinates and enable admin-only provider coordinate editing.
4. Run `migrations/202611060004_role_based_accounts.sql` to create customer/provider profiles, protect account roles, and enforce provider approval.
5. Run `migrations/202611060005_private_provider_identity.sql` to create private provider identity records and a non-public photo bucket with owner/staff read policies.
6. Copy `.env.example` to `.env.local` and add your project URL, anon/publishable key, and service-role key. Keep `.env.local` private; never commit it or expose the service-role key to browser code. You can find the URL and public anon/publishable key in your Supabase project's API settings. The service-role key is used by the server-only provider registration route and local catalog seeding.
7. In Supabase Authentication URL settings, add your local and production `/auth/callback` URLs to the allowed redirect URLs for email confirmation.
8. Run `npm run db:seed` once to import the current preview catalog. It flags imported categories, offerings, providers, and guides as sample data. The seed script is idempotent and preserves provider coordinates already saved in Supabase.
9. Restart the Next.js server after changing environment variables.

## Customer and provider accounts

The registration page offers separate customer and service-provider account choices at `/register`. Each account has a fixed role: the role is created by a database trigger from the signup selection, is not editable by the account owner, and is verified against the database for protected routes. Customers see the customer navigation; providers see the provider account dashboard. Public service/provider listings remain visible to customers. Providers cannot submit customer service requests while signed in.

Provider registrations require a NIC card number and a clear photo of the applicant. The NIC and photo are stored separately from public provider listings; the photo is in a private Storage bucket. RLS allows only the submitting provider and authorized staff to read these details. The registration API uses `SUPABASE_SERVICE_ROLE_KEY` server-side to save the application and private upload; never expose this key to browser code or commit it.

Provider registrations are created with `pending_review` status. Authorized staff can review the application and its private identity details at `/admin/accounts`, then approve or reject it. To create a staff account, register it through the app first (customer or provider), then assign the trusted `app_metadata.role = "admin"` claim using the SQL in the map-based locations section below. Sign the account out and back in after changing its app metadata. Never use `user_metadata` as an authorization source.

Approval authorizes the provider account but does not publish a provider listing. The existing provider catalog is still managed separately; staff must verify and create a public service profile and business location before the provider appears in customer search. Customer service requests also are not yet associated with a customer account, so the customer dashboard does not show request history.

## Map-based locations

Customers choose their service location by placing a pin on the map or using their device's current location. The selected coordinates are saved with the service request; the customer cannot type an address. The database generates the legacy `area` label from the coordinates and does not allow public clients to submit that field.

KardoFix staff can set provider business pins at `/admin/providers`. Create staff accounts in Supabase Authentication, then assign the trusted `app_metadata.role = "admin"` claim to each authorized staff user. For example, after replacing the email with the staff account's email, run this in the Supabase SQL Editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'staff@example.com';
```

The provider editor only has permission to update business coordinates; its write access is enforced by Supabase row-level security as well as the staff interface. Provider coordinates can also remain empty until verified locations are selected. The public OpenStreetMap tile service is used for map display and requires the visible attribution shown on the map.

The app's server-side reads and public request insert use the anon key. Row-level security exposes active catalog rows but prevents visitors from reading or changing request records. Only authenticated users with `app_metadata.role = "admin"` may read or manage requests. The browser never receives a service-role key.

Provider ratings, reviews, prices, and experience in the existing catalog are preview values. Verify and replace them before launch. Anonymous request submission also needs production abuse controls (for example CAPTCHA and edge rate limiting) before public launch.
