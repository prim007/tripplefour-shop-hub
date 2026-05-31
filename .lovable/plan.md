## Goal
Add a wholesale ordering flow on `/partners/lef-labs` that uses PayFast as the only payment gateway, fully isolated from the existing Tripplefour cart/checkout.

## Architecture

```text
PartnerLefLabs page
   └─ Product cards (Add to Cart)
        └─ LefLabsCartContext (localStorage: 'leflabs-cart')
              └─ LefLabsCartDrawer (View Cart → Checkout)
                    └─ /partners/lef-labs/checkout
                          └─ Form: business name, contact, email, phone, delivery address
                                └─ POST → Edge Function: create-leflabs-order
                                      ├─ Validate items vs server-side price list
                                      ├─ Insert into orders table (order_ref: LEF-XXXX, payment_method: 'payfast')
                                      └─ Sign PayFast payload (MD5) → return redirect URL
                                └─ window.location → PayFast hosted checkout
                                      └─ User pays → PayFast ITN webhook → payfast-leflabs-itn
                                            └─ Verify signature + amount → update order payment_status
                                      └─ Browser return → /partners/lef-labs/order-complete?ref=LEF-XXXX
```

## What gets built

### Backend (Edge Functions)
1. **`create-leflabs-order`** — new function
   - Server-side price list for Lëf Labs SKUs (single source of truth)
   - Validates input (name, email, phone, address, items)
   - Calculates subtotal + delivery fee (flat wholesale rate)
   - Inserts row into `orders` with `order_ref` prefix `LEF-`, `payment_method: 'payfast'`
   - Builds PayFast payload, signs with `PAYFAST_MERCHANT_ID` + `PAYFAST_MERCHANT_KEY` + `PAYFAST_PASSPHRASE` (already in secrets)
   - Returns `{ redirect_url }` pointing to PayFast hosted page
2. **`payfast-leflabs-itn`** — new function
   - Receives PayFast ITN POST
   - Verifies signature, verifies amount matches order total
   - Verifies source IP / postback to PayFast validate endpoint
   - Updates `orders.payment_status` to `paid` / `failed` based on `payment_status` field

### Frontend
3. **`src/data/leflabsProducts.ts`** — product catalogue (display only; prices duplicated in Edge Function as the source of truth, per existing memory rule)
4. **`src/context/LefLabsCartContext.tsx`** — separate cart context with its own localStorage key `leflabs-cart`. Does NOT touch the existing `CartContext`.
5. **`src/components/leflabs/LefLabsCartDrawer.tsx`** — slide-out drawer with cart items + checkout button
6. **`src/pages/PartnerLefLabs.tsx`** — replace placeholder grid with real product cards (image, name, price, Add to Cart). Add cart-icon button in hero.
7. **`src/pages/LefLabsCheckout.tsx`** — checkout form, calls `create-leflabs-order`, redirects browser to PayFast.
8. **`src/pages/LefLabsOrderComplete.tsx`** — return page showing order status (polls `get-order-status` or just displays ref + "we'll confirm by email").
9. **`src/App.tsx`** — wrap `<LefLabsCartProvider>` and register new routes:
   - `/partners/lef-labs/checkout`
   - `/partners/lef-labs/order-complete`

## What does NOT change
- Existing Tripplefour cart, checkout, EFT, and PayFast usage (if any) — untouched.
- Existing `orders` table reused (with `LEF-` prefix tagging — admin dashboard already reads it).
- Existing PayFast merchant credentials reused (one PayFast account, funds land in one place).
- Age verification flow — not required for B2B wholesale; checkout is gated by business contact info instead.

## Technical notes
- **PayFast sandbox vs live**: The first deploy points to `https://sandbox.payfast.co.za/eng/process` so you can test with PayFast's sandbox card without real money. Flip a constant to `https://www.payfast.co.za/eng/process` when ready.
- **Signature**: MD5 of URL-encoded key=value pairs in field order, with passphrase appended.
- **Amount validation in ITN**: Critical — never trust amount from PayFast post; always compare against `orders.total`.
- **ITN URL** (you'll paste this into PayFast dashboard): `https://yytjfmadcreajcrkjsrk.supabase.co/functions/v1/payfast-leflabs-itn`

## Open question (answer before I build, or I'll default)
- **Delivery fee model for Lëf Labs**: flat R0 (wholesale, customer arranges), flat R250, or per-zone using existing `delivery_zones` table? I'll default to **flat R0** (wholesale-typical) unless you say otherwise.
