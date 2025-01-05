import { useServerTranslation } from "@/i18n/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { idValidator, searchModel, searchValidator } from "../validators";
import { AppointmentRole } from "@/types/enums";
import { TRPCError } from "@trpc/server";

const dataModel = {
  content: z.string(),
  appointmentId: z.string()
};
const { t } = await useServerTranslation("consultation");

export const conclusionRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({ ...searchModel, id: z.string() })).query(async ({ ctx, input }) => {
    const userRole = ctx.session.user_role;
    const {
      data: { user },
      error: userError
    } = await ctx.user;
    if (userError) throw userError;
    const { id, search, pageIndex, pageSize } = input;
    let countQuery = ctx.supabase
      .from("Conclusion")
      .select("*", { count: "exact", head: true })
      .eq("appointmentId", id);
    const dataQuery = ctx.supabase.from("Conclusion").select("*,profiles (id,name)").eq("appointmentId", id);
    if (userRole === AppointmentRole.Participant) {
      dataQuery.eq("createdBy", user?.id!);
    }
    const { count } = await countQuery;
    const { data, error } = await dataQuery.range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);
    return { data, count, error };
  }),
  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = (await ctx.supabase.from("Conclusion").select("*").eq("id", input).single()).data;
    return data;
  }),

  create: protectedProcedure.input(z.object(dataModel)).mutation(async ({ ctx, input }) => {
    //check role
    const user_role = ctx.session.user_role;
    if (!user_role || user_role !== AppointmentRole.Admin || user_role !== AppointmentRole.Moderator) {
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    }

    const {
      data: { user },
      error: userError
    } = await ctx.user;
    if (userError) throw userError;
    const { data, error } = await ctx.supabase.from("Conclusion").insert({
      content: input.content,
      appointmentId: input.appointmentId,
      createdBy: user?.id
    });
    if (error) throw error;

    return data;
  }),
  update: protectedProcedure.input(z.object({ id: z.string(), ...dataModel })).mutation(async ({ ctx, input }) => {
    //check role
    const user_role = ctx.session.user_role;
    if (!user_role || user_role !== AppointmentRole.Admin || user_role !== AppointmentRole.Moderator) {
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    }
    const { data, error } = await ctx.supabase
      .from("Conclusion")
      .update({
        content: input.content,
        updatedAt: new Date().getTime()
      })
      .eq("id", input.id);
    if (error) throw error;
    return data;
  }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    //check role
    const user_role = ctx.session.user_role;
    if (!user_role || user_role !== AppointmentRole.Admin || user_role !== AppointmentRole.Moderator) {
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    }
    const { error } = await ctx.supabase.from("Conclusion").delete().eq("id", input.id);
    if (error) throw error;
    return error;
  })
});
