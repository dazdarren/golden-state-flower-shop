# Outstanding Items

## Required for Production

### Payment Integration
- [ ] Integrate Stripe or Square for payment tokenization
- [ ] Update `functions/api/[state]/[city]/checkout/place-order.ts` to accept and forward payment token
- [ ] Add client-side payment form component with card input
- [ ] Handle payment errors gracefully

### Florist One API
- [ ] Test with real Florist One credentials
- [ ] Verify all API endpoints work correctly
- [ ] Confirm product SKUs match Florist One catalog
- [ ] Update `featuredSkus` in city config with real SKUs

### Configuration
- [ ] Update `NEXT_PUBLIC_SITE_URL` with production domain
- [ ] Replace `https://example.com` in `public/sitemap.xml` with real domain
- [ ] Replace `https://example.com` in `public/robots.txt` with real domain
- [ ] Set production environment variables in Cloudflare dashboard

## Optional Enhancements

### Build-time Data
- [ ] Fetch real product data from Florist One at build time
- [ ] Cache product images locally or use CDN
- [ ] Generate sitemap dynamically with real product SKUs

### Product Images
- [ ] Replace placeholder SVG with real product images
- [ ] Add image optimization/lazy loading
- [ ] Consider using Cloudflare Images for CDN delivery

### Additional Features
- [ ] Email confirmation integration
- [ ] Order tracking page
- [ ] Customer account/order history (would need KV/D1)
- [ ] Promo code support
- [ ] Multiple delivery addresses

### SEO Improvements
- [ ] Add more neighborhoods as landing pages
- [ ] Hospital-specific delivery pages
- [ ] Seasonal/holiday landing pages
- [ ] Blog/content section

### Analytics
- [ ] Add Google Analytics or Cloudflare Web Analytics
- [ ] Conversion tracking for orders
- [ ] A/B testing for product pages
