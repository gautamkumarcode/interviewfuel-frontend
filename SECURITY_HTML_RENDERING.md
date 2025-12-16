# Safe HTML Rendering - Security Implementation

## Overview

This project has been updated to eliminate unsafe uses of `dangerouslySetInnerHTML` across the codebase. All HTML content is now sanitized using DOMPurify to prevent XSS (Cross-Site Scripting) vulnerabilities.

## Components

### SafeHtml Component

**Location:** `components/ui/safe-html.tsx`

A reusable component that safely renders HTML content by sanitizing it with DOMPurify before rendering.

**Features:**

- Automatic HTML sanitization using isomorphic-dompurify
- Configurable allowed tags and attributes
- Prevents XSS attacks by removing malicious scripts
- Works both client-side and server-side (isomorphic)

**Usage:**

```tsx
import { SafeHtml } from "@/components/ui/safe-html";

<SafeHtml html={userGeneratedContent} className="prose dark:prose-invert" />;
```

**Default Security Settings:**

- Allowed tags: Common formatting and structural HTML tags (p, div, span, h1-h6, etc.)
- Allowed attributes: Safe attributes like href, class, style, src, alt
- Blocks: JavaScript execution, event handlers, data attributes

### JsonLd Component

**Location:** `components/ui/json-ld.tsx`

A dedicated component for rendering JSON-LD structured data for SEO purposes.

**Features:**

- Type-safe JSON-LD rendering
- Automatic JSON serialization
- Proper escaping via JSON.stringify
- Clean API for schema.org data

**Usage:**

```tsx
import { JsonLd } from "@/components/ui/json-ld";

<JsonLd
	data={{
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "InterviewFuel",
	}}
/>;
```

## Migration Summary

### Files Updated

1. **components/ui/html-content.tsx**

   - Replaced dangerouslySetInnerHTML with SafeHtml component
   - Maintains all existing functionality (HTML detection, decoding)

2. **components/screens/admin-review/QuestionReviewDetail.tsx**

   - Replaced 2 instances of dangerouslySetInnerHTML
   - Now uses SafeHtml for question content and answers

3. **app/(dashboard)/questions/page.tsx**

   - Replaced JSON-LD script tag with JsonLd component
   - Cleaner, more maintainable code

4. **app/page.tsx**
   - Replaced 4 JSON-LD script tags with JsonLd component
   - Improved SEO schema implementation

### Dependencies Added

- **isomorphic-dompurify**: HTML sanitization library (works in Node.js and browser)
- **@types/dompurify**: TypeScript type definitions

## Security Benefits

1. **XSS Prevention**: All user-generated HTML content is sanitized before rendering
2. **Centralized Security**: Security logic is centralized in reusable components
3. **Maintainability**: Easy to update security policies in one place
4. **Type Safety**: Full TypeScript support with proper type definitions

## Current State

✅ All unsafe uses of `dangerouslySetInnerHTML` have been replaced
✅ Only controlled uses remain within secure wrapper components
✅ TypeScript type checking passes
✅ No build errors

## Best Practices Going Forward

1. **Always use SafeHtml** when rendering HTML content from external sources
2. **Use JsonLd** for all structured data/SEO schemas
3. **Never use dangerouslySetInnerHTML directly** in application code
4. **Review and update** SafeHtml's allowed tags/attributes as needed

## Customization

To adjust what HTML tags/attributes are allowed:

```tsx
<SafeHtml
	html={content}
	sanitizeOptions={{
		ALLOWED_TAGS: ["p", "strong", "em"], // Custom tag whitelist
		ALLOWED_ATTR: ["class", "style"], // Custom attribute whitelist
	}}
/>
```

## Verification

Run the following to verify no unsafe uses remain:

```bash
# Search for dangerouslySetInnerHTML outside of safe components
grep -r "dangerouslySetInnerHTML" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules .
```

Expected results: Only matches in `safe-html.tsx` and `json-ld.tsx`
