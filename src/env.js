import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    appUrl: z.string().optional().default("http://localhost:3000"),
    nodeEnv: z.enum(["development", "test", "production"]).default("development"),
    vercelURL: z.string().optional(),
    supabaseServiceRoleKey: z.string().optional(),
    supabaseJWTSecret: z.string().optional()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().optional(),
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_PLUGNMEET_API_KEY: z.string().optional(),
    NEXT_PUBLIC_PLUGNMEET_API_SECRET: z.string().optional(),
    NEXT_PUBLIC_LK_TOKEN_ENDPOINT: z.string().optional(),
    NEXT_PUBLIC_PLUG_N_MEET_SERVER_URL: z.string().optional(),
    NEXT_PUBLIC_PACS_URL: z.string().optional()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    appUrl: process.env.APP_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelURL: process.env.VERCEL_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseJWTSecret: process.env.SUPABASE_JWT_SECRET,
    NEXT_PUBLIC_PLUGNMEET_API_KEY: process.env.NEXT_PUBLIC_PLUGNMEET_API_KEY,
    NEXT_PUBLIC_PLUGNMEET_API_SECRET: process.env.NEXT_PUBLIC_PLUGNMEET_API_SECRET,
    NEXT_PUBLIC_LK_TOKEN_ENDPOINT: process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT,
    NEXT_PUBLIC_PLUG_N_MEET_SERVER_URL: process.env.NEXT_PUBLIC_PLUG_N_MEET_SERVER_URL,
    NEXT_PUBLIC_PACS_URL: process.env.NEXT_PUBLIC_PACS_URL
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true
});
