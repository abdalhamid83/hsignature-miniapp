# HSignature Mini App V1

Telegram Mini App for the HSignature Human Presence Protocol.

---

## Quick Start

```bash
git clone <repo>
cd hsignature-miniapp
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL and VITE_BOT_USERNAME
npm install
npm run dev
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend URL (no trailing slash) | `https://api.hsignature.com` |
| `VITE_BOT_USERNAME` | Telegram bot username without @ | `HSignatureBot` |

---

## Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: HSignature Mini App V1"
git remote add origin https://github.com/yourorg/hsignature-miniapp
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Vite**
4. Add environment variables:
   - `VITE_API_BASE_URL` = `https://your-backend.com`
   - `VITE_BOT_USERNAME` = `HSignatureBot`
5. Deploy

### Step 3 — Set CORS on Backend

Add your Vercel domain to the backend:

```bash
# In backend docker-compose.yml or .env:
CORS_ORIGIN=https://your-app.vercel.app
```

Then restart the backend:

```bash
docker compose up -d
```

---

## Telegram Bot Integration

### Step 1 — Create or configure your bot

```
/start @BotFather
/mybots → select @HSignatureBot
```

### Step 2 — Enable Mini App

```
Bot Settings → Menu Button → Configure menu button
URL: https://your-app.vercel.app
Text: Open HSignature
```

Or via BotFather:

```
/newapp
Select bot: @HSignatureBot
App name: HSignature
Description: Human Presence Protocol
Photo: (upload 640x360 image)
Web App URL: https://your-app.vercel.app
```

### Step 3 — Test

1. Open Telegram
2. Find @HSignatureBot
3. Tap the menu button
4. Mini App opens

---

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview production build locally
```

---

## Architecture

- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** — mobile-first dark UI
- **Axios** — with JWT interceptors + auto-refresh
- **React Router v6** — client-side routing
- **@twa-dev/sdk** — Telegram WebApp SDK

Authentication flow:
1. Telegram injects `initData` into the WebApp
2. App sends `initData` to `POST /api/v1/auth/telegram`
3. Backend validates HMAC-SHA256 signature
4. JWT tokens returned and stored in `sessionStorage`
5. All API calls include `Authorization: Bearer <token>`
6. On 401, tokens refresh automatically
7. On second 401, session cleared and app reloads

---

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/` | Signal, HHD, HH status, notification count |
| HH | `/hh` | Active event, respond button, history |
| Notifications | `/notifications` | List, mark read, mark all read |
| Profile | `/profile` | Human ID, Telegram info, account details |
| Invite | `/invite` | Generate and share referral link |
