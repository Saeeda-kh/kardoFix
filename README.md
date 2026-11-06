# KardoFix

KardoFix is a Next.js marketplace for discovering home services and providers and submitting service requests.

## Local setup

1. Install dependencies with `npm install`.
2. Follow [Supabase setup](./supabase/README.md) to apply the database migration and seed the preview catalog.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL, anon/publishable key, and service-role key. Keep `.env.local` private and never expose the service-role key to browser code.
4. Start the app with `npm run dev`. Use `npm run lint` and `npm run build` to validate changes.

## Database-backed marketplace

Service categories, service offerings, provider profiles, service guides, and customer testimonials are read from Supabase. Service requests are validated in a Next.js Route Handler and saved to the database. Public visitors can read active catalog records and submit new requests, but cannot read or change request records. Request details are only readable by authenticated Supabase users with the `app_metadata.role` claim set to `admin`.

The current sample catalog is imported with `is_sample = true`. Provider ratings, reviews, prices, profile details, and testimonials must be verified and replaced with authorized real business data before launch. A saved request is not a confirmed booking.

Customers select their service location on a map. Separate customer and service-provider accounts sign in to role-specific experiences; new provider accounts require a NIC card number and photo for private staff review before approval. Staff can review provider applications at `/admin/accounts` and manage provider business pins at `/admin/providers`. Apply all Supabase migrations and configure authentication as described in [Supabase setup](./supabase/README.md). Customer service-request history and public provider-listing creation for newly approved accounts are not included yet. Anonymous request submission still needs production abuse controls, such as CAPTCHA and edge rate limiting, before public launch.
