FROM node:20-bookworm-slim

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile --prod=false \
  && pnpm --filter @repo/trpc build \
  && pnpm --filter api build

ENV NODE_ENV=production

EXPOSE 10000

CMD ["sh", "-c", "pnpm --filter api db:migrate && pnpm --filter api exec node dist/main.js"]
