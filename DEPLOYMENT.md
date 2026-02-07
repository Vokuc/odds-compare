# Vercel Deployment

Steps to deploy this project to Vercel and required environment variables.

1. Connect this GitHub repository to Vercel.
2. In the Vercel project settings, add the following Environment Variables (do NOT commit secrets to git):

- `ODDS_API_KEY` — your the-odds-api key
- `ODDS_API_BASE_URL` — https://api.the-odds-api.com/v4
- `DATABASE_URL` — production Postgres connection string (if used)
- `NEXTAUTH_URL` — your deployment URL (e.g., https://your-site.vercel.app)
- `ADMIN_SECRET` — admin secret used by the app

3. Set the Build Command to `npm run build` and the Output Directory is handled by Next.js.

4. Deploy. Check the Vercel build logs — if the build fails, inspect for TypeScript errors or missing env vars.

Notes:
- For security, set env vars in Vercel dashboard under Settings → Environment Variables.
- I removed local debug logs from the provider; production logging uses `console.error`/`console.warn` only.
