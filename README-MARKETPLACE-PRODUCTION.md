# Mandobk Marketplace — Production Layer

## What changed

The customer store was upgraded to a Talabat-style marketplace UX:

- Marketplace home with search, categories, store cards, ratings, delivery time, delivery fee and offers.
- Dedicated merchant storefront with cover/logo, categories, in-store search, featured products and discounts.
- One-store cart enforcement.
- Standalone cart with subtotal, delivery fee, minimum-order validation and total.
- Checkout with current location, reverse-geocoded delivery address and merchant branch pickup coordinates.
- Merchant workflow: New → Preparing → Ready for pickup → Captain dispatch.
- Merchant dashboard with live order counters and action buttons.
- Merchant store settings: open/closed, logo, cover, description, promo, delivery fee, minimum order, delivery time and category.
- Product management: category, compare price, featured flag, stock and availability.
- Captain dispatch is gated so merchant orders are visible only after the merchant marks them ready.
- Non-recursive order RLS policies.
- Avatar storage setup.

## SQL order

Run this single file once in Supabase SQL Editor:

`sql/MANDOBK-MARKETPLACE-FULL.sql`

It includes:

1. Marketplace schema/columns and indexes.
2. Merchant workflow RPCs.
3. Product v2 RPC.
4. Customer merchant-order RPC.
5. Marketplace RLS.
6. No-recursion Orders RLS.
7. Order-items visibility policy.
8. Notifications policy.
9. Avatar bucket and policies.
10. Existing `order_type` check normalization.

Do **not** run the old recursive Orders RLS patch after this file.

## Important

- The website never contains `service_role`.
- Customer order creation uses the protected `customer_create_order()` RPC.
- Merchant actions use protected SECURITY DEFINER RPCs.
- Captain acceptance remains atomic with row locking.
- Cash remains the only enabled payment method in this build.
