This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase production data

Run migrations in order before deploying production:

```bash
supabase db push
```

If you use the Supabase SQL editor instead of the CLI, run:

```text
supabase/migrations/001_schema.sql
supabase/migrations/002_seed_data.sql
supabase/migrations/003_admin_policies.sql
supabase/migrations/004_admin_audit_logs.sql
supabase/migrations/005_production_seed_data.sql
```

The final seed file inserts/upserts the real task catalog, career levels,
achievements, pets, season data and promotion challenges.

## Code execution service

The public Piston endpoint can be restricted, so production deployments should
use a private Piston instance.

Set this environment variable on Vercel:

```env
PISTON_API_URL=https://your-private-piston.example.com/api/v2
```

For the public legacy endpoint the base URL used to be
`https://emkc.org/api/v2/piston`, but it can return whitelist errors and should
not be relied on for production.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
