# Package VirtualisOne source for download

Create a clean ZIP of the project's code you can drop into your monorepo.

## What's included
- All app code (`src/`), static files (`public/`), backend functions and database migrations (`supabase/`)
- Config files: `package.json`, lockfile, `vite.config.ts`, `tailwind.config.ts`, `tsconfig*.json`, `postcss.config.js`, `eslint.config.js`, `components.json`, `index.html`
- Docs: `README.md`, `DEPLOYMENT.md`, `AGENTS.md` (if present)
- A `.env.example` with the variable names only (no real values)

## What's excluded
- `node_modules/`, build output (`dist/`), Git history
- The real `.env` file (keys stay private)
- Internal Lovable metadata (`.lovable/`)

## Steps
1. Stage the files listed above in a temporary folder.
2. List every staged file and check nothing is missing or leaked.
3. Zip it as `virtualisone-source.zip`, check the contents, and save it to your Files for download.

## Note for your monorepo
The app expects its backend keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) to be set in the new environment. Backend function secrets (Epic, AI keys) live in Lovable Cloud and must be set again wherever you host them.
