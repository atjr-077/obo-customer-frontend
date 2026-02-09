# Clerk Authentication Troubleshooting Guide

## Issue Fixed: Registration Not Working

### Problem
Clerk components were not properly registering users due to routing conflicts.

### Root Cause
The original implementation used `routing="path"` with `path="/login"` while simultaneously toggling between `<SignIn />` and `<SignUp />` components using React state. This created conflicts in Clerk's internal routing.

### Solution Applied
Refactored the Login component to:
1. ✅ Removed `routing="path"` configuration
2. ✅ Use URL query parameters (`?mode=signup`) to switch between sign-in and sign-up
3. ✅ Properly configured `redirectUrl` and `afterSignUpUrl`/`afterSignInUrl`
4. ✅ Removed conflicting state-based component toggling

---

## How to Use

### Sign In
- Navigate to: `http://localhost:5174/login`
- You'll see the Sign In form

### Sign Up
- Navigate to: `http://localhost:5174/login?mode=signup`
- Or click the "Sign up" link on the sign-in page

---

## Testing Steps

1. **Test Sign Up Flow:**
   ```
   1. Go to http://localhost:5174/login?mode=signup
   2. Enter your email address
   3. Create a password (minimum 8 characters)
   4. Click "Continue"
   5. Check your email for verification code
   6. Enter the verification code
   7. You should be redirected to /account
   ```

2. **Test Sign In Flow:**
   ```
   1. Go to http://localhost:5174/login
   2. Enter your registered email
   3. Enter your password
   4. Click "Continue"
   5. You should be redirected to /account
   ```

---

## If Registration Still Doesn't Work

### Check Clerk Dashboard Settings

1. **Go to your Clerk Dashboard:** https://dashboard.clerk.com
2. **Navigate to:** User & Authentication → Email, Phone, Username
3. **Ensure the following are enabled:**
   - ✅ Email address (should be toggled ON)
   - ✅ Password (should be toggled ON)

4. **Check Sign-up settings:**
   - Go to: User & Authentication → Restrictions
   - Ensure "Sign-ups" is enabled (not restricted)

### Verify Environment Variable

Check that `.env.local` has the correct publishable key:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_d2VsY29tZS1maXNoLTMuY2xlcmsuYWNjb3VudHMuZGV2JA
```

**Important:** After changing `.env.local`, you MUST restart the dev server:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for any Clerk-related errors
4. Common errors and fixes:

| Error | Solution |
|-------|----------|
| "Invalid publishable key" | Check .env.local file and restart server |
| "Clerk: Missing publishableKey" | Ensure VITE_CLERK_PUBLISHABLE_KEY is set |
| Network errors | Check internet connection |
| CORS errors | Check Clerk dashboard allowed origins |

---

## Advanced Troubleshooting

### Enable Detailed Logging

Add to `main.tsx`:
```typescript
if (import.meta.env.DEV) {
  console.log('Clerk Key:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
}
```

### Test Clerk Connection

Run this in browser console on `/login` page:
```javascript
console.log('Clerk loaded:', window.Clerk);
```

If it returns `undefined`, Clerk isn't loading properly.

---

## Common Issues & Solutions

### Issue 1: "Password must be at least 8 characters"
**Solution:** Password requirements are set in Clerk dashboard. Use a strong password.

### Issue 2: Email verification code not received
**Solutions:**
- Check spam folder
- Verify email in Clerk dashboard
- In development, you can disable email verification:
  - Dashboard → Email, Phone, Username → Email address
  - Toggle off "Verify at sign-up"

### Issue 3: Redirect not working after sign-up
**Solution:** The code now properly sets `afterSignUpUrl="/account"` and `redirectUrl="/account"`

### Issue 4: SignUp component not appearing
**Solution:** Make sure you're navigating to `/login?mode=signup` (note the query parameter)

---

## Key Changes Made to Login.tsx

### Before (Broken):
```typescript
// ❌ Conflicting routing configuration
<SignIn routing="path" path="/login" signUpUrl="/login" />
// State toggle causing issues
{isLogin ? <SignIn /> : <SignUp />}
```

### After (Fixed):
```typescript
// ✅ Hash-based routing with URL params
const isSignUp = searchParams.get("mode") === "signup";
{isSignUp ? <SignUp redirectUrl="/account" /> : <SignIn redirectUrl="/account" />}
```

---

## Support

If you continue experiencing issues:
1. Check the Clerk documentation: https://clerk.com/docs
2. Verify your Clerk application settings in the dashboard
3. Ensure you're using a valid email address for testing
4. Try incognito/private browsing mode to rule out cache issues

---

**Last Updated:** 2026-01-30  
**Fixed By:** Removing routing conflicts and properly configuring Clerk components
