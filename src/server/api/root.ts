import { createTRPCRouter } from "@/server/api/trpc";
import { adDivisionRouter } from "./routers/adDivision";
import { organizationRouter } from "./routers/organization";
import { practitionerRouter } from "./routers/practitioner";
import { appointmentRouter } from "./routers/appointment";
import { accountRouter } from "./routers/account";
import { conclusionRouter } from "./routers/conclusion";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  adDivision: adDivisionRouter,
  practitioner: practitionerRouter,
  appointment: appointmentRouter,
  account: accountRouter,
  conclusion: conclusionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
