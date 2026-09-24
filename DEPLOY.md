# Lumina deployment

## Publish to GitHub

Create an empty repository on GitHub, then run from this folder:

```powershell
npm run publish:github -- -RemoteUrl https://github.com/YOUR_USER/lumina-commerce.git
```

The script initializes Git if needed, creates a commit, configures `origin`, and pushes `main`. GitHub authentication is handled by your Git credential manager; no token is stored in the project.

## Deploy to Vercel

For a direct deploy, authenticate once with the Vercel CLI, then run:

```powershell
npx --yes vercel@59.1.4 login
npm run deploy:vercel -- -ProjectName lumina-commerce
```

Vercel project names must be lowercase. The deployment script normalizes the name automatically, so `Lumina` becomes `lumina`.

Alternatively, import the GitHub repository in Vercel. `vercel.json` already configures the Vite build and SPA fallback, so routes such as `/shop`, `/account`, and `/product/p1` work on refresh.

## Layerbase database

The app uses Drizzle ORM on the server side with Layerbase's pooled `DATABASE_URL`. The browser never receives this credential. For a new database, run:

```powershell
npm run db:push
npm run db:seed
```

`db:push` creates the Layerbase-compatible SQLite tables and `db:seed` adds the three demo accounts. The deployed Vercel project also needs `DATABASE_URL` configured under its Environment Variables for Production and Preview. Account updates, browsing events, wishlist changes, cart changes, and test orders are sent to `/api/lumina`; localStorage remains available as the offline testing fallback.

## Demo accounts

- `alex@demo.com` / `demo` — gaming recommendations
- `jordan@demo.com` / `demo` — fitness recommendations
- `admin@lumina.com` / `admin` — admin dashboard
