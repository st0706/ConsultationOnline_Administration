import { useServerTranslation } from "@/i18n/server";
import { buildTreeData } from "@/lib/buildTreeData";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { idValidator } from "../validators";
import { v4 as uuidv4 } from "uuid";

const { t } = await useServerTranslation("common");

const buildIdentifier = (identifierInput) => {
  return identifierInput?.map((identifier) => {
    return {
      ...identifier,
      period: {
        start: new Date(identifier.period.start).getTime(),
        end: new Date(identifier.period.end).getTime()
      }
    };
  });
};

const buildContact = (contactInput) => {
  return contactInput?.map((contact) => {
    let telecoms = contact?.telecom?.map((telecom) => {
      return {
        ...telecom,
        period: {
          start: new Date(telecom.period.start).getTime(),
          end: new Date(telecom.period.end).getTime()
        }
      };
    });
    let address = {
      ...contact?.address,
      period: {
        start: new Date(contact?.address?.period.start).getTime(),
        end: new Date(contact?.address?.period.end).getTime()
      }
    };
    let period = {
      ...contact?.period,
      start: new Date(contact?.period.start).getTime(),
      end: new Date(contact?.period.end).getTime()
    };
    return {
      ...contact,
      telecom: telecoms,
      address,
      period
    };
  });
};

const dataModel = {
  identifier: z.array(z.unknown()).nullish(),
  active: z.boolean().nullish(),
  type: z.array(z.unknown()).nullish(),
  name: z.string().nullish(),
  alias: z.array(z.string()).nullish(),
  description: z.string().nullish(),
  contact: z.array(z.unknown()).nullish(),
  partOfId: z.string().nullish(),
  endpoint: z.array(z.unknown()).nullish(),
  qualification: z.array(z.unknown()).nullish(),
  logo: z.string().nullish(),
  website: z.string().nullish()
};

const toEntity = (input) => ({
  ...input,
  identifier: buildIdentifier(input.identifier as any[]),
  type: input.type,
  alias: input.alias || [],
  contact: buildContact(input.contact as any[]),
  endpoint: input.endpoint,
  qualification: input.qualification
});

export const organizationRouter = createTRPCRouter({
  getTreeData: protectedProcedure.query(async ({ ctx }) => {
    const { data: organizations, error } = await ctx.supabase.from("Organization").select("*");
    if (error) throw error;
    return buildTreeData(organizations || []);
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { data: organizations, error } = await ctx.supabase.from("Organization").select("*");
    if (error) throw error;
    return organizations;
  }),
  getSelectList: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase.from("Organization").select("id, name");
    if (error) throw error;
    return data.map((val) => {
      return {
        value: val.id,
        label: val.name || ""
      };
    });
  }),
  get: protectedProcedure.input(z.object({ id: z.string().nullish() })).query(async ({ ctx, input }) => {
    const { data } = await ctx.supabase
      .from("Organization")
      .select("*")
      .eq("id", input.id ?? "")
      .single();
    return data || null;
  }),

  create: protectedProcedure
    .input(z.object({ id: z.string().uuid().default(uuidv4), unitId: z.string().uuid().default(uuidv4), ...dataModel }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("Organization")
        .insert([toEntity(input)])
        .select("*")
        .limit(1)
        .single();
      if (error) {
        if (error.code === "23505") {
          const uniqueErrorMessage = t("notify.unique", {
            field: t(`resource.identifier`)
          });
          throw new Error(uniqueErrorMessage);
        }
        throw error;
      }
      return data;
    }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    async function deleteOrganization(organizationId) {
      const { data: organizationDb, error } = await ctx.supabase
        .from("Organization")
        .select("id")
        .eq("id", organizationId)
        .single();
      if (!organizationDb || error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: t("notify.errorSave", { action: t("action.delete") })
        });
      }
      const { data: childOrganizations } = await ctx.supabase
        .from("Organization")
        .select("*")
        .eq("partOfId", organizationId);

      if (childOrganizations) {
        for (const child of childOrganizations) {
          await deleteOrganization(child.id);
        }
      }
      await ctx.supabase.from("Organization").delete().eq("id", organizationId);
    }
    return await deleteOrganization(input.id);
  }),

  update: protectedProcedure.input(z.object({ id: z.string(), ...dataModel })).mutation(async ({ ctx, input }) => {
    let { data: organizationDb, error } = await ctx.supabase
      .from("Organization")
      .select("*")
      .eq("id", input.id)
      .single();

    if (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: t("notify.errorSave", { action: t("save") })
      });
    }

    if (organizationDb) {
      const { error: updateError } = await ctx.supabase.from("Organization").update(toEntity(input)).eq("id", input.id);
      if (updateError) {
        if (updateError.code === "23505") {
          const match = updateError.message.match(/:\s*\(`(.*)`\)/);
          if (match) {
            updateError.message = t("notify.unique", {
              field: t(`resource.identifier`)
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateError.message
        });
      }
    } else {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: t("notify.errorSave", { action: t("save") })
      });
    }
  })
});
