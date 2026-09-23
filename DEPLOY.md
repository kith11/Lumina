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
npx vercel login
npm run deploy:vercel -- -ProjectName lumina-commerce
```

Vercel project names must be lowercase. The deployment script normalizes the name automatically, so `Lumina` becomes `lumina`.

Alternatively, import the GitHub repository in Vercel. `vercel.json` already configures the Vite build and SPA fallback, so routes such as `/shop`, `/account`, and `/product/p1` work on refresh.

## Demo accounts

- `alex@demo.com` / `demo` — gaming recommendations
- `jordan@demo.com` / `demo` — fitness recommendations
- `admin@lumina.com` / `admin` — admin dashboard
