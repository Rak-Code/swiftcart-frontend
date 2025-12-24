# Vercel Environment Variables Setup

## Critical: Set Environment Variables in Vercel Dashboard

Your `.env` file is NOT deployed to Vercel. You must configure environment variables in Vercel's dashboard.

### Steps:

1. Go to your Vercel project: https://vercel.com/your-username/paribito20
2. Click **Settings** → **Environment Variables**
3. Add the following variable:

```
Name: VITE_API_URL
Value: https://paribito-backend-production.up.railway.app
Environment: Production, Preview, Development (check all)
```

4. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

### Verify It's Working:

After redeployment, open browser console on your Vercel site and check:
- No more `localhost:8080` errors
- All API calls should go to `paribito-backend-production.up.railway.app`

### Backend CORS Update (if needed):

If you still see CORS errors, add your Vercel URL to backend's allowed origins:

```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "https://paribito20.vercel.app",
    "https://*.vercel.app"  // Allow all preview deployments
));
```

## Fixed Issues:

✅ Removed hardcoded `localhost:8080` from:
- `src/pages/admin/CategoriesManagement.tsx`
- `src/pages/admin/AdminDashboard.tsx`
- `src/components/admin/CategoryFormModal.tsx`

✅ All API calls now use `import.meta.env.VITE_API_URL`

## Next Steps:

1. Commit and push these changes
2. Set `VITE_API_URL` in Vercel dashboard
3. Redeploy on Vercel
4. Test the live site
