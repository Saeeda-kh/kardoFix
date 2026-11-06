# KardoFix

KardoFix is a Next.js marketplace prototype for discovering home services and providers.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run lint` and `npm run build` to validate changes.

## Marketplace flow

- Browse service categories at `/services` and provider profiles at `/service-providers`.
- Start a prefilled service request from a service guide or provider profile.
- Requests are currently saved in the browser's local storage on the current device. They are not sent to KardoFix unless the user chooses **Email KardoFix** and sends the prepared email.

This project does not yet have a booking API, database, authentication, provider availability, or booking confirmation. Provider profiles, ratings, reviews, and prices are sample data and should be verified before launch. Do not treat a locally saved request as a confirmed booking.
