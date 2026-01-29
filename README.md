# SF Flower Delivery - Local SEO Flower Delivery Site

A production-lean MVP for a local SEO flower delivery site serving San Francisco, built with Next.js (static export) and Cloudflare Pages Functions.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Hosting**: Cloudflare Pages (static export)
- **API**: Cloudflare Pages Functions (Workers runtime)
- **Flower Data**: Florist One API integration
- **Validation**: Zod-compatible validators

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                          │
├─────────────────────────────────────────────────────────────┤
│  Static Assets (/out)          │  Pages Functions (/functions)│
│  ├── /ca/san-francisco/        │  ├── /api/.../delivery-dates │
│  ├── /ca/san-francisco/flowers │  ├── /api/.../cart/*         │
│  ├── /ca/san-francisco/product │  └── /api/.../checkout/*     │
│  └── ...                       │                              │
├─────────────────────────────────────────────────────────────┤
│                    Florist One API                           │
│            (delivery dates, cart, orders)                    │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
sf-flower-delivery/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [state]/[city]/     # City-scoped pages
│   │   │   ├── page.tsx        # City home
│   │   │   ├── flowers/[occasion]/
│   │   │   ├── product/[sku]/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── (utility pages)
│   │   └── layout.tsx
│   ├── components/             # React components
│   ├── data/
│   │   ├── cities/             # City configurations
│   │   │   └── ca/san-francisco.ts
│   │   └── products/           # Product data
│   └── types/                  # TypeScript types
├── functions/                  # Cloudflare Pages Functions
│   ├── api/[state]/[city]/     # API routes
│   │   ├── delivery-dates.ts
│   │   ├── cart/
│   │   └── checkout/
│   └── lib/                    # Shared utilities
│       ├── floristOne.ts       # Florist One API client
│       ├── validation.ts       # Input validation
│       ├── cache.ts            # Workers cache helpers
│       └── cookies.ts          # Cart cookie management
├── public/
│   ├── _redirects              # Cloudflare Pages redirects
│   ├── robots.txt
│   └── sitemap.xml
└── wrangler.jsonc              # Cloudflare configuration
```

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd sf-flower-delivery
   npm install
   ```

2. Copy environment files:
   ```bash
   cp .env.example .env.local
   cp .dev.vars.example .dev.vars
   ```

3. Configure environment variables:

   **`.env.local`** (for Next.js build):
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:8788
   ```

   **`.dev.vars`** (for Cloudflare Pages Functions):
   ```
   FLORISTONE_AFFILIATE_ID=your_affiliate_id
   FLORISTONE_API_TOKEN=your_api_token
   ```

### Running Locally

Build the static site first, then run the preview server:

```bash
# Build the static site
npm run build:pages

# Preview with Cloudflare Pages dev server (serves static + functions)
npm run preview:pages
```

The site will be available at `http://localhost:8788`.

> **Note**: The dev server needs the built `/out` directory. Always run `build:pages` before `preview:pages`.

### Development Without Florist One Credentials

The site works without Florist One credentials by returning mock data:
- Delivery dates: Shows 14 days of sample dates
- Cart: Creates mock cart IDs (prefixed with `mock_cart_`)
- Orders: Returns mock confirmation numbers

A yellow banner indicates mock/demo mode in the UI.

## Cloudflare Pages Deployment

### Dashboard Configuration

1. Connect your repository to Cloudflare Pages

2. Configure build settings:
   - **Build command**: `npm run build:pages`
   - **Build output directory**: `out`
   - **Root directory**: `/` (or your project root)

3. Add environment variables in Settings > Environment variables:

   **Production**:
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., `https://sfflowers.com`)
   - `FLORISTONE_AFFILIATE_ID`: Your Florist One affiliate ID
   - `FLORISTONE_API_TOKEN`: Your Florist One API token

   **Preview** (optional):
   - Same variables with preview/test credentials

4. Configure Pages Functions runtime:
   - Go to Settings > Functions
   - Add compatibility flag: `nodejs_compat`
   - Set compatibility date: `2024-01-15` or later

### Manual Deployment

```bash
# Build
npm run build:pages

# Deploy (requires wrangler login)
npx wrangler pages deploy ./out --project-name=sf-flower-delivery
```

## Adding a New City

1. Create city configuration:
   ```typescript
   // src/data/cities/ca/oakland.ts
   import { CityConfig } from '@/types/city';

   export const oaklandConfig: CityConfig = {
     stateSlug: 'ca',
     citySlug: 'oakland',
     cityName: 'Oakland',
     // ... rest of config
   };
   ```

2. Register in cities index:
   ```typescript
   // src/data/cities/index.ts
   import { oaklandConfig } from './ca/oakland';

   export const cities: Record<string, CityConfig> = {
     'ca/san-francisco': sanFranciscoConfig,
     'ca/oakland': oaklandConfig,  // Add here
   };
   ```

3. Update sitemap (regenerate or add manually):
   ```bash
   npx ts-node scripts/generate-sitemap.ts
   ```

4. Rebuild and deploy.

## Florist One API Integration

The integration is in `/functions/lib/floristOne.ts`. Key endpoints:

| Function | API Endpoint | Description |
|----------|-------------|-------------|
| `getDeliveryDates(zip)` | `/deliverydates` | Available delivery dates for ZIP |
| `createCart()` | `/cart/create` | Create new cart |
| `getCart(cartId)` | `/cart` | Get cart contents |
| `addToCart(...)` | `/cart/add` | Add item to cart |
| `removeFromCart(...)` | `/cart/remove` | Remove item from cart |
| `destroyCart(cartId)` | `/cart/destroy` | Delete cart |
| `placeOrder(...)` | `/order/place` | Place order |

### Caching

- **Delivery dates**: Cached 20 minutes per ZIP
- **Products**: Cached 8 hours per SKU

Caching uses the Cloudflare Workers Cache API (`caches.default`).

### Payment Integration

**TODO**: Payment token integration is stubbed. In production:

1. Integrate a payment processor (Stripe, Square, etc.)
2. Tokenize payment on client side
3. Pass token to `/checkout/place-order` endpoint
4. Forward to Florist One API

See `functions/api/[state]/[city]/checkout/place-order.ts` for implementation notes.

## SEO Features

- Per-page meta titles and descriptions
- Canonical URLs
- OpenGraph tags
- JSON-LD structured data:
  - `LocalBusiness` (Florist) on city home
  - `Product` schema on product pages
- Static `robots.txt` and `sitemap.xml`
- City/occasion-specific content

## URL Structure

All pages are under `/{state}/{city}/`:

| Path | Description |
|------|-------------|
| `/ca/san-francisco/` | City home page |
| `/ca/san-francisco/flowers/birthday/` | Occasion page |
| `/ca/san-francisco/product/FTD-MIX001/` | Product detail |
| `/ca/san-francisco/cart/` | Shopping cart |
| `/ca/san-francisco/checkout/` | Checkout flow |
| `/ca/san-francisco/delivery/` | Delivery info |
| `/ca/san-francisco/faq/` | FAQ |
| `/ca/san-francisco/contact/` | Contact |
| `/ca/san-francisco/privacy/` | Privacy policy |
| `/ca/san-francisco/terms/` | Terms of service |

Root `/` redirects to `/ca/san-francisco/` via `_redirects`.

## API Routes

All API routes follow the pattern `/api/{state}/{city}/...`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/ca/san-francisco/delivery-dates?zip=94110` | Get delivery dates |
| POST | `/api/ca/san-francisco/cart/create` | Create cart |
| GET | `/api/ca/san-francisco/cart` | Get cart |
| POST | `/api/ca/san-francisco/cart/add` | Add to cart |
| POST | `/api/ca/san-francisco/cart/remove` | Remove from cart |
| POST | `/api/ca/san-francisco/cart/destroy` | Clear cart |
| POST | `/api/ca/san-francisco/checkout/place-order` | Place order |

## Cart Management

Cart ID is stored in an httpOnly cookie:
- Cookie name: `flo_cart_id`
- Path: `/{state}/{city}` (scoped per city)
- Max age: 7 days
- SameSite: Lax
- Secure: true in production

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (no Functions) |
| `npm run build` | Build Next.js app |
| `npm run build:pages` | Build for Cloudflare Pages |
| `npm run preview:pages` | Preview with Functions |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

## License

MIT
