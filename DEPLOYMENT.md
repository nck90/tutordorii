# Vercel Deployment Guide

## 1. Prerequisites
- GitHub Repository (Push your code to a repo).
- Vercel Account.

## 2. Deployment Steps

### Step 1: Push Code to GitHub
Ensure all your latest changes are committed and pushed to your repository.
```bash
git add .
git commit -m "feat: complete MVP frontend features"
git push origin main
```

### Step 2: Import Project in Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the repository `studydol` (or whatever you named it).

### Step 3: Configure Project
- **Framework Preset:** Next.js (Auto-detected)
- **Root Directory:** `./` (Default)
- **Build Command:** `next build` (Default)
- **Output Directory:** `.next` (Default)
- **Install Command:** `npm install` (Default)

### Step 4: Environment Variables (Optional)
Since this is currently a frontend-only build with mocked data, no critical environment variables are needed for the UI to render.
- If you add a real database later, add `DATABASE_URL` here.

### Step 5: Deploy
- Click **"Deploy"**.
- Wait for the build to complete (approx. 1-2 mins).

## 3. Verification
- Once deployed, Vercel will provide a URL (e.g., `studydol.vercel.app`).
- Visit the URL on your mobile phone to experience the "App-like" feel.
- **Note:** The "Add to Home Screen" (PWA) feature will work best if we add a web manifest later, but for now, it's a responsive web app.

## 4. Troubleshooting
- If build fails, check the "Building" logs in Vercel.
- Common issue: `Lint` errors. We have fixed known lint errors, but if any remain, you can temporarily disable linting during build in `next.config.ts`:
  ```typescript
  eslint: {
    ignoreDuringBuilds: true,
  },
  ```
  *(Only do this if absolutely necessary to get a preview up)*.
