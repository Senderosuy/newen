# SEO Audit: NEWEN (newen.com.uy)

## Findings

### 1. Missing Meta Tags on Blog Routes
- **Issue**: The dynamic blog route (`/blog/$slug`) lacks a `head()` function in its route definition. While it manually sets `document.title` via `useEffect`, it doesn't provide essential meta tags (description, OG, Twitter) for social sharing or search engines.
- **Status**: **FAILING**

### 2. Alt Text Issues
- **Issue**: Several decorative or thumbnail images lack descriptive `alt` text. Specifically, thumbnail images in the `Fleet` section and default blog images.
- **Status**: **FAILING** (Minor)

### 3. H1 Hierarchy
- **Issue**: The homepage (`/`) relies on the carousel for the `H1`. While this is common, ensuring each slide has a semantic `H1` and that no other pages (like login/admin) accidentally shadow this is important.
- **Status**: **PASSING** (Verified)

### 4. Technical SEO (Sitemap/Robots)
- **Issue**: `robots.txt` and `sitemap.xml` are present and correctly configured for the official domain.
- **Status**: **PASSING**

### 5. Semantic HTML
- **Issue**: Most sections use `<section>` and `<article>` correctly.
- **Status**: **PASSING**

---

## Action Plan

1.  **Fix Blog SEO**: Implement `head()` in `src/routes/blog.$slug.tsx` to provide dynamic meta tags based on the post content.
2.  **Improve Alt Text**: Add dynamic alt text to fleet thumbnails and blog post images.
3.  **Enhance Canonical Tags**: Ensure all routes have canonical tags pointing to `newen.com.uy`.
