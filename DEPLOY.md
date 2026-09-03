# Deploy Insta: Vercel (UI) + Render (API + Postgres) + Cloudinary (photos)

The live app is three pieces:

```
Browser  →  Vercel (Next.js UI)
                │
                ├── /api/auth, /api/trpc  ──rewrite──►  Render (NestJS)
                └── photo upload POST     ──────────►  Render ──► Cloudinary
```

Deploy **Cloudinary first**, then **Render**, then **Vercel**. You need the Render URL before the Vercel build.

You do **not** need a credit card for Vercel Hobby, Render Free, or Cloudinary Free. AWS S3 and Cloudflare R2 both require a card — skip them.

---

## 0. Prerequisites

- GitHub repo with this project pushed
- Accounts: [Vercel](https://vercel.com), [Render](https://render.com), [Cloudinary](https://cloudinary.com) (email only)
- A secret for auth:

```bash
openssl rand -base64 32
```

Save that value. You will paste it as `BETTER_AUTH_SECRET` on Render.

---

## 1. Photo storage — Cloudinary (no credit card)

AWS and Cloudflare R2 ask for a card even on the “free” tier. **Cloudinary Free does not.** Official docs: no credit card to sign up, 25 credits/month (enough for a hobby feed), no expiry.

### 1.1 Create a free account

1. Open [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free).
2. Sign up with email (or GitHub/Google). Confirm the email if asked.
3. You land on the dashboard. Skip product tours if they appear.

### 1.2 Copy the API credentials

On the dashboard (or **Settings** → **API Keys**), copy these three values:

| Dashboard label | Env var |
|-----------------|---------|
| Cloud name | `CLOUDINARY_CLOUD_NAME` |
| API Key | `CLOUDINARY_API_KEY` |
| API Secret | `CLOUDINARY_API_SECRET` |

The secret is shown once or behind a reveal button. Do not commit it to Git.

Optional: **Settings** → **Security** — leave **Unsigned uploading** off. This app uploads from the Nest server with the API secret, which is the safer path.

### 1.3 Env vars for Render (and local)

| Key | Value |
|-----|--------|
| `STORAGE_TYPE` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | from the dashboard |
| `CLOUDINARY_API_KEY` | from the dashboard |
| `CLOUDINARY_API_SECRET` | from the dashboard |

On Render: add these to **insta-api** → **Environment** → Save → **Manual Deploy**.

To try it on your laptop, put the same three keys in `apps/api/.env` with `STORAGE_TYPE=cloudinary`, restart `pnpm dev`, upload a post, and confirm the image URL starts with `https://res.cloudinary.com/`.

### 1.4 Check that it worked

1. Upload a photo in the app.
2. Cloudinary dashboard → **Assets** (or **Media Library**) → folder `images/` — the file should be there.
3. The post image URL should look like `https://res.cloudinary.com/<cloud_name>/image/upload/images/...`.
4. Redeploy or sleep Render: the photo must still appear.

| Problem | Likely cause |
|---------|----------------|
| API crash mentioning Cloudinary env | `STORAGE_TYPE=cloudinary` but one of the three keys is missing |
| Upload 401 / Invalid Signature | Wrong API secret, or extra space when pasting |
| Upload 400 / file | File is not an image, or larger than 5 MB (app limit) |
| Credits exceeded | Free plan monthly quota; wait for the rolling window or delete unused assets |

AWS S3 and Cloudflare R2 steps are below only if you later have a card. You can ignore them.

### Option A — AWS S3 (requires a card)

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

### Option B — Cloudflare R2 (requires a card)

Photos are uploaded by the Nest API with the S3 SDK. The browser then loads them from the **public R2 URL**, not from Render.

Do not use the S3 API endpoint (`….r2.cloudflarestorage.com`) as `S3_PUBLIC_URL`. That URL is for the API only and will not show images in `<img>` tags.

#### B1. Create a bucket

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) and sign in (free plan is enough).
2. Left sidebar → **R2 Object Storage**. If prompted, click **Purchase R2** — the free tier is billed at $0 as long as you stay under the limits (~10 GB storage, 1M writes/month, 10M reads/month).
3. **Create bucket**.
4. Name: something unique, e.g. `insta-photos-darya`. Leave location as automatic.
5. Create.

#### B2. Make objects publicly readable

The app stores keys like `images/cat-….jpg`, so the public URL must serve that path.

1. Open the bucket → **Settings**.
2. **Public access** → **Allow Access** (or **Public development URL** → **Enable**).
3. Copy the `r2.dev` URL. It looks like:

```
https://pub-0123456789abcdef.r2.dev
```

No trailing slash. This value is `S3_PUBLIC_URL`.

Optional later: attach a custom domain (`photos.yourdomain.com`) and use that as `S3_PUBLIC_URL` instead.

#### B3. Create an R2 API token

The API needs permission to **write** objects. The public URL is only for **reading**.

1. R2 overview page (the list of buckets, not inside one bucket).
2. Copy **Account ID** (right sidebar). You need it for `S3_ENDPOINT`.
3. **Manage R2 API Tokens** → **Create API token**.
4. Token name: `insta-api`.
5. Permissions: **Object Read & Write**.
6. Specify bucket: apply to the bucket you just created (not all buckets, if you can choose).
7. Create. **Copy immediately** — Cloudflare shows the secret only once:
   - Access Key ID → `S3_ACCESS_KEY_ID`
   - Secret Access Key → `S3_SECRET_ACCESS_KEY`

`S3_ENDPOINT` is:

```
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

Replace `<ACCOUNT_ID>` with the Account ID from step 2. Do not put the bucket name in this URL.

#### B4. Env vars (Render, and optionally local)

| Key | Example |
|-----|---------|
| `STORAGE_TYPE` | `s3` |
| `S3_BUCKET` | `insta-photos-darya` |
| `S3_REGION` | `auto` |
| `S3_ACCESS_KEY_ID` | from the token |
| `S3_SECRET_ACCESS_KEY` | from the token |
| `S3_ENDPOINT` | `https://abc123.r2.cloudflarestorage.com` |
| `S3_PUBLIC_URL` | `https://pub-0123456789abcdef.r2.dev` |
| `S3_FORCE_PATH_STYLE` | `true` |

On Render: add these to the **insta-api** service → **Environment** → **Save** → **Manual Deploy**.

To try R2 on your laptop, put the same keys in `apps/api/.env` (keep `WEB_URL` / `BETTER_AUTH_URL` as localhost). Restart `pnpm dev`, upload a post, and confirm the image URL starts with `https://pub-`.

#### B5. Check that it worked

1. Upload a photo in the app.
2. In Cloudflare: bucket → **Objects** → folder `images/` → the file should be there.
3. Open `https://pub-….r2.dev/images/<filename>` in a new tab — the picture should load.
4. Redeploy or sleep Render: the photo must still appear (it is not on Render’s disk).

| Problem | Likely cause |
|---------|----------------|
| API crash: `S3_PUBLIC_URL is required` | `S3_ENDPOINT` is set but `S3_PUBLIC_URL` is missing |
| Upload 500 / Access Denied | Wrong token, or token is read-only, or `S3_BUCKET` name mismatch |
| Upload succeeds, image broken | `S3_PUBLIC_URL` is the `cloudflarestorage.com` endpoint, or public access is off |
| 404 on the image | Public URL has a trailing slash, or you added `/images` yourself (`S3_PUBLIC_URL` must be the origin only) |

---

## 2. Render — Postgres + NestJS

Do this **before** Vercel. You can use the dashboard (below) or the `render.yaml` blueprint at the repo root.

### 2.1 Postgres

1. [Render Dashboard](https://dashboard.render.com) → **New** → **PostgreSQL**.
2. Name: `insta-postgres`. Region: pick one and remember it (use the same region for the API).
3. Plan: **Free** (expires after 30 days) or **Starter** if you want it to last.
4. Create. Wait until status is **Available**.
5. Open the database → **Connections** → copy the **External Database URL** (`postgresql://...`).

### 2.2 NestJS web service (Docker)

The free Node runtime is too small to compile Nest at boot, and it also drops the `dist/` folder after the build step. Use **Docker** so compile happens in the image.

1. Push the repo (it includes a root `Dockerfile`).
2. Open your existing web service → **Settings**.
3. **Build & Deploy** (or **Environment**):
   - Language / Runtime: **Docker**
   - Dockerfile path: `Dockerfile`
   - Docker build context directory: `.` (repo root)
4. Remove the old **Build Command** and **Start Command** (Docker uses the Dockerfile instead).
5. Keep **Health Check Path**: `/health`
6. Keep the same env vars as below.
7. **Save** → **Manual Deploy**.

If you cannot switch the existing service to Docker: **New** → **Web Service** → same repo → **Docker**, then delete the old Node service.

| Field | Value |
|--------|--------|
| Name | `insta-api` |
| Region | same as Postgres |
| Runtime | Docker |
| Dockerfile path | `Dockerfile` |
| Instance type | Free |

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
| `STORAGE_TYPE` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |

`BETTER_AUTH_URL` must be the **Vercel site**, because the browser calls `/api/auth` on Vercel and Next.js proxies it to Render. If you set it to the Render URL, login cookies will break.

5. Deploy. When it is live, copy the service URL, e.g. `https://insta-api.onrender.com`.
6. Open `https://insta-api.onrender.com/health` — you should see `{ "status": "ok" }`.

Free web services **sleep after ~15 minutes**. The first request after sleep can take 30–60 seconds.

### 2.3 Blueprint instead of the dashboard

If you prefer GitOps, connect the repo as a [Blueprint](https://render.com/docs/infrastructure-as-code): Render Dashboard → **New** → **Blueprint** → pick this repo → branch `main`. Render reads `render.yaml` at the repo root and creates both `insta-postgres` and `insta-api`.

Render prompts for every `sync: false` key at apply time (`CLOUDINARY_CLOUD_NAME` is hard-coded in `render.yaml` — it is not a secret). Have these ready:

| Key | Where it comes from | Example |
|-----|--------------------|---------|
| `CLOUDINARY_API_KEY` | Cloudinary dashboard | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard | `abcDEF...` |
| `WEB_URL` | Vercel production origin, no trailing slash (comma-separated if several) | `https://insta.vercel.app` |
| `BETTER_AUTH_URL` | **same as `WEB_URL`** (browser origin, not the Render URL) | `https://insta.vercel.app` |

Vercel does not exist yet on the first apply — enter `https://localhost` as a placeholder for the two URLs, then set the real values after step 3 and **Manual Deploy**.

Everything else is fixed in `render.yaml`: `NODE_ENV=production`, `PORT=10000`, `STORAGE_TYPE=cloudinary`, `DATABASE_SSL=true`, `DATABASE_SSL_REJECT_UNAUTHORIZED=false`, `DATABASE_URL` wired from the Postgres instance, and `BETTER_AUTH_SECRET` generated by Render (`generateValue: true`) — no `openssl` needed on this path. Note that a generated secret is regenerated only if the env var is deleted; changing it logs everyone out.

S3 / R2 keys are intentionally not in the blueprint. To use object storage instead of Cloudinary, add `STORAGE_TYPE=s3` plus the `S3_*` keys from section 1 in the dashboard.

If the API fails to connect to Postgres with a TLS error, set `DATABASE_SSL=false` — the blueprint uses the internal connection string, which stays inside Render's private network.

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
3. The image should load from Cloudinary (URL starts with `https://res.cloudinary.com/`).
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
| `Cannot find module .../dist/main` or heap out of memory | Use the **Docker** runtime (see section 2.2). Do not run `nest build` in the Start Command on a free instance. |
| Upload works locally, fails on Vercel | Uploads go **directly** to Render (`NEXT_PUBLIC_API_URL`), not through Vercel’s 4.5 MB body limit |

---

## 7. Free-plan limits (honest)

- **Vercel Hobby**: fine for the UI (personal use).
- **Render Free API**: sleeps; slow cold start.
- **Render Free Postgres**: deleted ~30 days after creation unless you upgrade.
- **Cloudinary Free**: photos persist independently of Render sleep. No credit card.
