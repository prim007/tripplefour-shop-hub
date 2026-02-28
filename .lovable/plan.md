

# Tripplefour - Cannabis Health Products E-Commerce Store

## Overview
Build a complete e-commerce storefront for **Tripplefour** ("Dispensery we deliver allover") with a natural/earthy design theme, shopping cart, FNB payment options (EFT + FNB Pay), and email order notifications.

## Product Catalog (extracted from screenshots)

**Greenhouse Dust** (6 items): 50G R945, 20G R595, 10G R445, 5G R325, 2G R255

**Greenhouse Strains** (3 items): 50G R1,085, 20G R735, 2G R260

**Indoor Dust** (3 items): 10G R500, 2G R315, 1G R255

**Pre-rolls** (5 items): 10 Prerolls Greenhouse R535, 5 Prerolls Greenhouse R385, Indoor Preroll 1 each R95, 1 Preroll Greenhouse R75, Outdoor Pre-rolls each R55

**Edibles** (4 items): Lolly Pop 5x R500, Oreo Caramel Treat 3x R215, Lolly Pop 1X R185, Sodaze Flavored Cannabis Soda R60

**Vapes** (2 items): Vape Pen 1ml 91% THC R550, Disposable Juice 10ml R320

**Other**: Moon Sticks R125, Premium Gold Box (Coming Soon)

## Pages and Features

### 1. Home / Landing Page
- Hero banner with Tripplefour branding and tagline "Dispensery we deliver allover"
- Natural/earthy color scheme (greens, browns, warm tones)
- Category quick-links grid
- Featured products section

### 2. Product Catalog Page (`/shop`)
- Filter by category (Greenhouse Dust, Greenhouse Strains, Indoor Dust, Pre-rolls, Edibles, Vapes, Other)
- Product cards with placeholder images, name, description, price in Rands (R)
- Add-to-cart button on each card
- Responsive grid layout

### 3. Product Detail Page (`/product/:id`)
- Large product image area
- Name, description, price
- Quantity selector + Add to Cart button
- Related products section

### 4. Shopping Cart (`/cart`)
- List items with quantity controls
- Running total in Rands
- Remove item functionality
- Proceed to checkout button

### 5. Checkout Page (`/checkout`)
- Customer details form (name, email, phone, delivery address)
- Payment method selection:
  - **Manual EFT**: Display FNB banking details for the customer to pay via bank transfer
  - **FNB Pay**: Link/instructions for FNB online payment
- Order summary sidebar
- Place Order button

### 6. Order Confirmation Page
- Order number and summary
- Payment instructions (if EFT selected)
- Email confirmation message

## Technical Implementation

### Data Layer
- `src/data/products.ts` - All products with categories, prices, descriptions as typed constants
- `src/context/CartContext.tsx` - React context for cart state management (add, remove, update quantity, clear)

### Components
- `src/components/Navbar.tsx` - Top navigation with logo, shop link, cart icon with badge
- `src/components/ProductCard.tsx` - Reusable product card
- `src/components/CategoryFilter.tsx` - Category filter buttons
- `src/components/CartItem.tsx` - Cart line item with quantity controls
- `src/components/CheckoutForm.tsx` - Customer details + payment selection form
- `src/components/Footer.tsx` - Footer with WhatsApp link and store info

### Pages
- `src/pages/Index.tsx` - Landing page
- `src/pages/Shop.tsx` - Product catalog with filtering
- `src/pages/ProductDetail.tsx` - Individual product page
- `src/pages/Cart.tsx` - Shopping cart
- `src/pages/Checkout.tsx` - Checkout flow
- `src/pages/OrderConfirmation.tsx` - Post-order page

### Routing
Add routes in `App.tsx` for `/`, `/shop`, `/product/:id`, `/cart`, `/checkout`, `/order-confirmation`

### Design
- Earthy green/brown color palette updated in `src/index.css`
- Placeholder product images (since actual images can't be scraped from WhatsApp)
- Mobile-first responsive design
- Uses existing shadcn/ui components (Button, Card, Badge, Input, Select, Separator, Toast)

### Email Notifications
- Order details will be compiled and shown on confirmation page
- A `mailto:` link or integration note for email notifications (full email sending requires a backend service which can be added later with Supabase)

### Payment Flow
- For **Manual EFT**: Show FNB account details on checkout confirmation with reference number
- For **FNB Pay**: Provide payment link/instructions
- Orders are stored in local state initially; can be persisted to Supabase later

## What's NOT included (can be added later)
- Admin dashboard for managing orders
- Real product images (placeholders used; you can replace them)
- Supabase backend for order persistence and email sending
- User accounts / order history
- Stock management

