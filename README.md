# Modora Frontend (Next.js)

Next.js (App Router) storefront. Fetches data from the Modora backend API
(server-side, so pages are SEO-friendly and fast).

## Pages
- `/`                  home (featured products)
- `/category/[slug]`   category listing (e.g. /category/abayas)
- `/products/[slug]`   product detail (size select + add to cart)
- `/cart`              cart
- `/blog`              journal (posts from Blogger)
- `/blog/[id]`         single post

## Setup
```bash
npm install
cp .env.example .env.local     # set NEXT_PUBLIC_API_URL to your backend
npm run dev                    # http://localhost:3000
```
Run the backend first (port 5000) so the frontend has data.

## Deploy (Cloudflare Pages — free, commercial use OK)
- Connect this repo
- Framework preset: Next.js
- Set NEXT_PUBLIC_API_URL to your live backend URL
- (Avoid Vercel free Hobby plan — it bans commercial use)
