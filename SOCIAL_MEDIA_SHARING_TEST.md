# Social Media Sharing Test Guide

## WhatsApp Preview Testing

### 1. Test Product Page Sharing
1. Navigate to any product page on your site
2. Copy the URL (e.g., `https://rikhh.com/product/123`)
3. Open WhatsApp and paste the URL in a chat
4. You should see a preview with:
   - Product image
   - Product title
   - Product description
   - Website name (Rikhh)

### 2. Test with WhatsApp Web Debugger
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your product URL
3. Click "Debug"
4. Check that all Open Graph tags are present:
   - `og:title`
   - `og:description`
   - `og:image`
   - `og:url`
   - `og:type`
   - `og:site_name`

### 3. Test with Twitter Card Validator
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your product URL
3. Check that Twitter Card tags are working

### 4. Test with LinkedIn Post Inspector
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter your product URL
3. Check the preview

## Meta Tags Implemented

### Open Graph Tags
- `og:title` - Product title
- `og:description` - Product description
- `og:image` - Product image (absolute URL)
- `og:url` - Product page URL
- `og:type` - "website"
- `og:site_name` - "Rikhh"
- `og:locale` - "en_US"

### Twitter Card Tags
- `twitter:card` - "summary_large_image"
- `twitter:title` - Product title
- `twitter:description` - Product description
- `twitter:image` - Product image
- `twitter:creator` - "@rikhh"
- `twitter:site` - "@rikhh"

### Additional Tags
- `product:price:amount` - Product price
- `product:price:currency` - "INR"
- `product:availability` - Stock status
- `product:condition` - "new"

## Debugging

### Console Debugger
The `MetaTagDebugger` component has been temporarily added to product pages. It will log all meta tags to the browser console when you visit a product page.

To view the debug info:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Visit any product page
4. Look for "=== Meta Tags Debug Info ===" in the console

### Common Issues

1. **No Preview Shows**: Check that image URLs are absolute (start with http/https)
2. **Wrong Image**: Ensure the image is accessible and not blocked by CORS
3. **Wrong Title/Description**: Verify the meta tags are being generated correctly
4. **Cached Preview**: Social media platforms cache previews. Use their debug tools to refresh

## Testing Checklist

- [ ] Product page loads correctly
- [ ] Meta tags are present in page source
- [ ] Image URLs are absolute
- [ ] WhatsApp shows preview
- [ ] Facebook shows preview
- [ ] Twitter shows preview
- [ ] LinkedIn shows preview
- [ ] Console debugger shows all tags

## Removing Debug Component

After testing is complete, remove the `MetaTagDebugger` component from the product page:

```tsx
// Remove this line from src/app/product/[id]/page.tsx
<MetaTagDebugger product={product} />
```

## Environment Variables

Make sure `NEXT_PUBLIC_SITE_URL` is set correctly in your environment:

```env
NEXT_PUBLIC_SITE_URL=https://rikhh.com
```

This ensures all URLs are absolute and work correctly for social media sharing. 