# Mc-Kelly Pepple | AI Portfolio

Personal portfolio for an AI / ML engineer and full stack developer, built with Next.js (App Router), React and Tailwind CSS v4.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit the content

- Projects: `data/projects.ts` (title, description, tags, link, card accent colour and button label)
- Page sections and copy: `app/page.tsx`
- Styling and theme (automatic light/dark): `app/globals.css`
- SEO metadata: `app/layout.tsx`

## Deploy

Push to GitHub and import the repository in Vercel, or run `npm run build` and `npm start`.

## Habit Tracker page

The `/habit-tracker` page is a static case study. Its links (web app, Android build, source repo, API health URL) are all set in `data/habitTracker.ts`.
