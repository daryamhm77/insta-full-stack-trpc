# Deploy Insta: Vercel (UI) + Render (API + Postgres) + S3 (photos)

The live app is three pieces:

```
Browser  →  Vercel (Next.js UI)
                │
                ├── /api/auth, /api/trpc  ──rewrite──►  Render (NestJS)
                └── photo upload POST     ──────────►  Render ──► S3
```

Deploy **S3 first**, then **Render**, then **Vercel**. You need the Render URL before the Vercel build.

---

## 0. Prerequisites

- GitHub repo with this project pushed
- Accounts: [Vercel](https://vercel.com), [Render](https://render.com), and either [AWS](https://aws.amazon.com) or [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible, has a free tier)
- A secret for auth:

```bash
openssl rand -base64 32
```

Save that value. You will paste it as `BETTER_AUTH_SECRET` on Render.

---

## 1. Photo storage (S3)

The API uploads files with the AWS S3 SDK. That works with **AWS S3** and **Cloudflare R2**. R2 is cheaper for a hobby project.

### Option A — AWS S3

1. Open [S3](https://s3.console.aws.amazon.com/s3/home) → **Create bucket**.
2. Name it (example: `insta-photos-yourname`). Pick a region (example: `us-east-1`).
3. Uncheck **Block all public access** (photos must be readable in `<img>` tags). Confirm the warning.
4. Create the bucket.
5. Open the bucket → **Permissions** → **Bucket policy** → paste this (replace `BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadImages",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/images/*"
    }
  ]
}
```

6. IAM: create a user with programmatic access and this policy (replace `BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::BUCKET_NAME/images/*"
    }
  ]
}
```

7. Save `Access key ID` and `Secret access key`.

Render env for AWS:

| Key | Value |
|-----|--------|
| `STORAGE_TYPE` | `s3` |
| `S3_BUCKET` | your bucket name |
| `S3_REGION` | e.g. `us-east-1` |
| `S3_ACCESS_KEY_ID` | IAM access key |
| `S3_SECRET_ACCESS_KEY` | IAM secret |
| `S3_PUBLIC_URL` | leave empty (defaults to `https://BUCKET.s3.REGION.amazonaws.com`) |
| `S3_ENDPOINT` | leave empty |
| `S3_FORCE_PATH_STYLE` | leave empty |

### Option B — Cloudflare R2 (recommended on a budget)

1. Cloudflare dashboard → **R2** → **Create bucket**.
2. Open the bucket → **Settings** → **Public development URL** → enable. Copy the URL (`https://pub-xxxxx.r2.dev`).
3. **Manage R2 API Tokens** → create a token with **Object Read & Write** on that bucket. Copy Access Key ID, Secret Access Key, and the S3 API endpoint (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`).

Render env for R2:

| Key | Value |
|-----|--------|
| `STORAGE_TYPE` | `s3` |
| `S3_BUCKET` | your R2 bucket name |
| `S3_REGION` | `auto` |
| `S3_ACCESS_KEY_ID` | R2 access key |
| `S3_SECRET_ACCESS_KEY` | R2 secret |
| `S3_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `S3_PUBLIC_URL` | `https://pub-xxxxx.r2.dev` |
| `S3_FORCE_PATH_STYLE` | `true` |

---

## 2. Render — Postgres + NestJS

Do this **before** Vercel. You can use the dashboard (below) or the `render.yaml` blueprint at the repo root.

### 2.1 Postgres

1. [Render Dashboard](https://dashboard.render.com) → **New** → **PostgreSQL**.
2. Name: `insta-postgres`. Region: pick one and remember it (use the same region for the API).
3. Plan: **Free** (expires after 30 days) or **Starter** if you want it to last.
4. Create. Wait until status is **Available**.
5. Open the database → **Connections** → copy the **External Database URL** (`postgresql://...`).

### 2.2 NestJS web service

1. **New** → **Web Service** → connect the GitHub repo.
2. Settings:

| Field | Value |
|--------|--------|
| Name | `insta-api` |
| Region | same as Postgres |
| Root Directory | leave empty (repo root) |
| Runtime | Node |
| Build Command | `corepack enable && pnpm install --frozen-lockfile --prod=false && pnpm --filter @repo/trpc build && pnpm --filter api build` |
| Pre-Deploy Command | `pnpm --filter api db:migrate` |
| Start Command | `pnpm --filter api start:prod` |
| Instance type | Free |

3. **Health Check Path**: `/health`
4. Environment variables:

| Key | Value |
|-----|--------|
| `NODE_VERSION` | `20` |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | External URL from the Postgres service |
| `DATABASE_SSL` | `true` |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | `false` |
| `WEB_URL` | `https://your-app.vercel.app` (placeholder until Vercel exists; update later) |
| `BETTER_AUTH_URL` | **same as `WEB_URL`** (the browser origin, not the Render URL) |
| `BETTER_AUTH_SECRET` | the `openssl` secret |
| plus all `S3_*` keys from step 1 | |

`BETTER_AUTH_URL` must be the **Vercel site**, because the browser calls `/api/auth` on Vercel and Next.js proxies it to Render. If you set it to the Render URL, login cookies will break.

5. Deploy. When it is live, copy the service URL, e.g. `https://insta-api.onrender.com`.
6. Open `https://insta-api.onrender.com/health` — you should see `{ "status": "ok" }`.

Free web services **sleep after ~15 minutes**. The first request after sleep can take 30–60 seconds.

### 2.3 Blueprint instead of the dashboard

If you prefer GitOps, connect the repo as a [Blueprint](https://render.com/docs/infrastructure-as-code) using `render.yaml`. Set the `sync: false` variables in the dashboard (Vercel URL + S3 keys) before the first deploy succeeds.

---

## 3. Vercel — Next.js UI

1. [vercel.com/new](https://vercel.com/new) → import the same GitHub repo.
2. **Root Directory**: `apps/web` (click **Edit**, then select `apps/web`).
3. Framework: Next.js (should autodetect).
4. Environment variables:

| Key | Value |
|-----|--------|
| `API_URL` | `https://insta-api.onrender.com` (no trailing slash) |
| `NEXT_PUBLIC_API_URL` | **same** Render URL |

`API_URL` is baked in at **build** time (rewrites in `next.config.js`). If you change the Render URL later, redeploy Vercel.

5. Deploy.
6. Copy the production URL, e.g. `https://insta-xxxx.vercel.app`.
7. Go back to **Render** → `insta-api` → Environment:
   - Set `WEB_URL` to the Vercel URL
   - Set `BETTER_AUTH_URL` to the Vercel URL
   - **Save** and **Manual Deploy** → **Deploy latest commit**
8. On Vercel, **Redeploy** once so auth and CORS match.

### Custom domain (optional)

If you add `https://insta.yourdomain.com` on Vercel, update Render `WEB_URL` and `BETTER_AUTH_URL` to that domain (comma-separated if you keep both):

```
WEB_URL=https://insta.yourdomain.com,https://insta-xxxx.vercel.app
BETTER_AUTH_URL=https://insta.yourdomain.com
```

Then redeploy Render and Vercel.

---

## 4. Verify

1. Open the Vercel URL. You should see login/signup.
2. Sign up, then create a post with a photo.
3. The image should load from S3/R2 (URL starts with `https://...amazonaws.com` or `https://pub-...r2.dev`).
4. Refresh — the photo should still be there (not stored on Render’s disk).
5. If login fails: confirm `BETTER_AUTH_URL` equals the Vercel origin, and you redeployed both sides.

---

## 5. Local development (unchanged)

`apps/api/.env`:

```
STORAGE_TYPE=local
DATABASE_SSL=false
BETTER_AUTH_URL=http://localhost:3001
WEB_URL=http://localhost:3000
```

`apps/web/.env.local`:

```
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
pnpm --filter api db:migrate
pnpm dev
```

---

## 6. Common failures

| Symptom | Fix |
|---------|-----|
| Vercel build cannot reach API / auth 404 | `API_URL` missing or wrong; must be set **before** the Vercel build; no trailing slash |
| Login does not stick | `BETTER_AUTH_URL` is the Render URL instead of Vercel; or `WEB_URL` does not include the Vercel origin |
| CORS error on upload | `WEB_URL` on Render does not match the Vercel origin exactly (`https://...` , no trailing slash) |
| Photos 403 | Bucket is not public, or R2 public URL / `S3_PUBLIC_URL` is wrong |
| Photos disappear | `STORAGE_TYPE` is still `local` |
| Render migrate fails | Pre-deploy command needs `pnpm install --prod=false` so `drizzle-kit` is available |
| `SSL` / certificate error to Postgres | `DATABASE_SSL=true` and `DATABASE_SSL_REJECT_UNAUTHORIZED=false` |
| First API request times out | Free Render is waking from sleep; wait and retry |
| Upload works locally, fails on Vercel | Uploads go **directly** to Render (`NEXT_PUBLIC_API_URL`), not through Vercel’s 4.5 MB body limit |

---

## 7. Free-plan limits (honest)

- **Vercel Hobby**: fine for the UI (personal use).
- **Render Free API**: sleeps; slow cold start.
- **Render Free Postgres**: deleted ~30 days after creation unless you upgrade.
- **S3/R2**: photos persist independently of Render sleep.
