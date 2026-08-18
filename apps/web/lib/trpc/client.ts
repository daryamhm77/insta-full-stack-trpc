"use client";

import type { AppRouter } from "@repo/trpc/router";
import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCReact,
  type CreateTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";

export const trpc: CreateTRPCReact<AppRouter, object> = createTRPCReact<
  AppRouter,
  object
>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
