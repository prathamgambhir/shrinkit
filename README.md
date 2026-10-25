This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Link storage and cache

Copy `.env.example` to `.env.local` and set `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` from your Upstash Redis database. Redis caches
short-link lookups for 24 hours; when Redis is unavailable or not configured,
link creation and redirects continue using PostgreSQL and log the cache issue.
`NEXT_APP_URL` must be set to the deployed site URL so generated short
links and QR codes point to the correct host.

Run the Prisma migration after updating the database schema:

```bash
pnpm exec prisma migrate deploy
```

Each destination URL is stored once per account (and once for anonymous
requests). Reusing a URL returns its existing short link; a QR request adds its
QR image to that record rather than creating a duplicate. Custom short URLs
remain unique, and attempting to reuse one returns `Custom URL already taken.`

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
