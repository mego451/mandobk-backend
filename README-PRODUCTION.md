# Mandobk Production Package

## Deployment
1. Upload the **contents** of `mandobk-web-foundation` into the website document root (`htdocs`).
2. Overwrite the existing `assets`, `config`, `sql`, `index.html`, `sw.js`, and manifest files.
3. Run `sql/PRODUCTION-RUN-ONCE.sql` **once** in Supabase SQL Editor against the existing database.
4. Hard refresh the browser (Ctrl+F5). If an old service worker remains, unregister it once from browser DevTools > Application > Service Workers and reload.

## Important
- The browser must contain only the Supabase Publishable key. Never place `service_role` or SMTP secrets in this package.
- This package is designed for the current Mandobk schema and existing Supabase project. It is not a destructive fresh-install migration.
- Authentication email limits are controlled by Supabase Auth/SMTP and are separate from the web package.

## V6 production scope
- Customer authentication and account profile.
- Google/Facebook OAuth (Apple intentionally removed).
- Customer order creation and order history.
- Captain approval, online state, available orders, acceptance and lifecycle.
- Merchant products.
- Moderator/staff operations.
- Super Admin account/role/activation controls.
- Join-request approval/rejection.
- Pricing management.
- Expanded system settings.
- Audit log viewer with explicit actor lookup (no ambiguous PostgREST embeds).
- Notifications.
- RLS-oriented staff authorization helpers.
- Arabic RTL UI and service-worker caching.

## Production boundary
The package does not claim that third-party infrastructure (SMTP, OAuth provider configuration, backups, DNS/SSL, Supabase PITR, monitoring, or payment gateways) is configured by FTP upload alone. Those are infrastructure settings and must be verified in their respective dashboards.


## Database migration notes
- `PRODUCTION-RUN-ONCE.sql` is additive and includes the merchant approval compatibility fix. It never invents a merchant owner; `owner_id` always comes from `account_requests.user_id`.
- `VERIFY-PRODUCTION.sql` is read-only and can be run after the migration.
- Do not run a fresh-install schema over the existing production database.


## V3 production notes
- Merchant onboarding now requires business type: `restaurant` or `shop`.
- `account_requests.business_type` is added without guessing legacy values.
- Account request creation is RPC-only through `request_account_upgrade`.
- Merchant approval writes the real `account_requests.user_id` into `merchants.owner_id`.
- Legacy duplicate account-request and audit RLS policies are removed by the migration.
- Audit log reads are Super Admin only.


### V6 live operations
- Realtime subscriptions for orders, notifications, captains, account requests and products.
- In-app live toast + sound and optional browser notifications.
- Customer marketplace with merchant products and cash checkout.
- Server-side order creation, pricing calculation, merchant item validation and stock deduction.
- Auto-dispatch to an online/approved captain when a fresh captain location is available.
- Captain live location updates while online.
- Delivery OTP terminal confirmation.
- Merchant stock controls and live order/product refresh.
- Server-generated order/account-request notifications.

Run `sql/PRODUCTION-RUN-ONCE.sql` once after replacing the package. The migration is additive and includes the V6 transaction. Then run `sql/VERIFY-PRODUCTION.sql`.


## V7 MAPS / LIVE TRACKING
- Separate interactive pickup and delivery maps using OpenStreetMap + Leaflet.
- Customer order tracking shows pickup, delivery and captain live location when available.
- Captain dashboard shows live current-location map while online.
- Staff captain management shows an online captains live map.
- Fixed the production SQL JSON extraction bug by casting system_settings.value to jsonb before `#>>`.


## V8 Maps / Live UX
- One marker per map; selecting a new point moves the existing marker instead of creating duplicates.
- Reverse geocoding fills pickup/delivery address automatically using OpenStreetMap Nominatim.
- Captain location is pushed every second while online, with Geolocation watch as a secondary source.
- Customer tracking polls captain position every second and also uses Supabase Realtime.
- Admin captain map refreshes live.
- Captain must open order details before accepting.
- Notifications with an order id open the order directly; account-request notifications open requests for staff.
- Marketplace shows product images, restaurant/shop filters, cart, quantities and map-based checkout.

### Database migration
Run `sql/PRODUCTION-RUN-ONCE.sql` once against the existing Supabase project. The V8 block is additive and adds order-linked notifications, customer live-location access, captain online/accept/status RPCs, and live notification routing.
