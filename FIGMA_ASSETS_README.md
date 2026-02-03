# Figma Assets - Local Development Fix

## Problem

This project was created in **Figma** and uses special `figma:asset/...` imports that only work within the Figma environment. When running locally with Vite, these imports fail with:

```
Failed to resolve import "figma:asset/355e85a53f8fd55bb85f4c9cfe98774e87cb561d.png"
```

## Temporary Solution (For Local Development)

I've commented out the Figma asset imports to allow the app to run locally. The logo image has been temporarily replaced with a text-based logo.

### Changes Made

**File:** `src/app/components/Header.tsx`

1. **Line 5-6:** Commented out the logo import
   ```typescript
   // FIXME: Uncomment this line when deploying to Figma/GitHub (see FIGMA_ASSETS_README.md)
   // import logoImage from 'figma:asset/355e85a53f8fd55bb85f4c9cfe98774e87cb561d.png';
   ```

2. **Lines 43-45:** Replaced the `<img>` tag with text logo
   ```tsx
   {/* FIXME: Uncomment img tag when deploying to Figma/GitHub (see FIGMA_ASSETS_README.md) */}
   {/* <img src={logoImage} alt="OBO HUB" className="h-10 md:h-12" /> */}
   <h1 className="text-2xl font-bold">OBO HUB</h1>
   ```

---

## How to Restore for GitHub/Figma Deployment

When you're ready to deploy to GitHub or run in Figma, follow these steps:

### Step 1: Restore the Import

In `src/app/components/Header.tsx` at **line 5-6**, **remove the comments**:

**Change from:**
```typescript
// FIXME: Uncomment this line when deploying to Figma/GitHub (see FIGMA_ASSETS_README.md)
// import logoImage from 'figma:asset/355e85a53f8fd55bb85f4c9cfe98774e87cb561d.png';
```

**To:**
```typescript
import logoImage from 'figma:asset/355e85a53f8fd55bb85f4c9cfe98774e87cb561d.png';
```

### Step 2: Restore the Logo Image

In `src/app/components/Header.tsx` at **lines 43-47**, **uncomment the img tag and remove the text logo**:

**Change from:**
```tsx
{/* Logo */}
<Link to="/" className="flex items-center">
   {/* FIXME: Uncomment img tag when deploying to Figma/GitHub (see FIGMA_ASSETS_README.md) */}
   {/* <img src={logoImage} alt="OBO HUB" className="h-10 md:h-12" /> */}
   <h1 className="text-2xl font-bold">OBO HUB</h1>
</Link>
```

**To:**
```tsx
{/* Logo */}
<Link to="/" className="flex items-center">
   <img src={logoImage} alt="OBO HUB" className="h-10 md:h-12" />
</Link>
```

### Step 3: Test

After uncommenting, the logo image should work properly in the Figma environment or when deployed.

---

## Alternative: Use a Regular Image

If you want to use a regular image file instead of Figma assets for local development:

1. Place your logo file in `src/assets/` (e.g., `src/assets/logo.png`)
2. Update the import:
   ```typescript
   import logoImage from '@/assets/logo.png';
   ```
3. The `<img>` tag will work as-is

---

## Quick Reference

| Environment | Logo Display | Figma Import Status |
|-------------|--------------|---------------------|
| **Local Dev (Current)** | Text: "OBO HUB" | ❌ Commented Out |
| **Figma/GitHub** | Image Logo | ✅ Uncommented |

---

## Need Help?

- All lines needing changes are marked with `FIXME:` comments
- Search for "FIXME" in `Header.tsx` to find what needs to be restored
- This file can be deleted once you've restored the Figma assets

---

**Created:** 2026-01-30  
**Reason:** Allow local development without Figma environment
