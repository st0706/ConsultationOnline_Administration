import { useServerTranslation } from "@/i18n/server";
import { buildPeriod, getOfficialName, slugify } from "@/lib/common";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Gender } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { idValidator, searchValidator } from "../validators";
import { HumanName } from "fhir/r5";
const { t: tH } = await useServerTranslation("hrm");
const { t } = await useServerTranslation("common");

const dataModel = {
  accountId: z.string().nullish(),
  active: z.boolean().nullish(),
  address: z.array(z.unknown()).nullish(),
  birthDate: z.coerce.date(),
  education: z.string().nullish(),
  gender: z.nativeEnum(Gender),
  identifier: z.array(z.unknown()).nullish(),
  name: z.any(),
  nationality: z.string().nullish(),
  photo: z.array(z.unknown()).nullish(),
  organizationIds: z.array(z.string()),
  telecom: z.array(z.unknown()).nullish(),
  speciality: z.string().nullish(),
  religion: z.string().nullish(),
  staffId: z.string().nullish()
};

export const toPractitioner = (input) => {
  let telecom = input.telecom as any[];
  telecom = telecom?.map((tele) => {
    return {
      ...tele,
      period: {
        start: new Date(tele.period.start).getTime(),
        end: new Date(tele.period.end).getTime()
      }
    };
  });

  return {
    accountId: input.accountId,
    active: input.active,
    address: buildPeriod(input.address),
    birthDate: new Date(input.birthDate).getTime(),
    education: input.education,
    gender: input.gender,
    identifier: buildPeriod(input.identifier),
    name: input.name,
    nationality: input.nationality,
    photo: input.photo,
    organizationIds: input.organizationIds,
    telecom,
    staffId: input.staffId,
    religion: input.religion,
    speciality: input.speciality
  };
};

export const practitionerRouter = createTRPCRouter({
  get: protectedProcedure.input(searchValidator).query(async ({ ctx, input }) => {
    const { search, pageIndex, pageSize } = input;

    // Fetch the organization list
    const { data: organizationList, error: errorOrg } = await ctx.supabase.from("Organization").select("name,id");
    if (errorOrg) {
      throw errorOrg;
    }

    // Fetch all practitioners
    const { data: practitioners, error: errorPractitioners } = await ctx.supabase.from("Practitioner").select("*");
    if (errorPractitioners) {
      throw errorPractitioners;
    }

    // Map organizationIds to organization names
    let dataCustom = practitioners?.map((row) => {
      const organizationsId = row.organizationIds;
      return {
        ...row,
        organizationIds: organizationsId
          ? organizationsId
              .map((id) => {
                const obj = organizationList.find((org) => org.id === id);
                return obj ? { id: obj.id, name: obj.name } : null;
              })
              .filter((item) => item !== null)
          : null
      };
    });

    // Filter by search keyword if provided
    if (search) {
      dataCustom = dataCustom?.filter((row) =>
        slugify(getOfficialName(row?.name as HumanName[])).includes(slugify(search))
      );
    }

    // Calculate total count after filtering
    const count = dataCustom?.length || 0;

    // Apply pagination
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = dataCustom?.slice(startIndex, endIndex);

    return { count, data: paginatedData };
  }),

  getByStaffId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data: staffData, error } = await ctx.supabase.from("Practitioner").select("*").eq("id", input).single();
    if (error) throw error;
    return staffData;
  }),
  getSelectList: protectedProcedure.query(async ({ ctx }) => {
    let { data: staffData, error } = await ctx.supabase.from("Practitioner").select("id,name");
    return { staffData, error };
  }),
  create: protectedProcedure.input(z.object({ ...dataModel })).mutation(async ({ ctx, input }) => {
    const id = uuidv4();
    const { data: listsData } = await ctx.supabase.from("Practitioner").select("staffId, accountId");
    if (listsData?.some((data) => data.staffId === input.staffId)) {
      if (input.staffId) {
        const uniqueStaffIdError = t("notify.unique", {
          field: tH("staff.staffId")
        });
        throw new Error(uniqueStaffIdError);
      }
    } else if (listsData?.some((data) => data.accountId === input.accountId)) {
      if (input.accountId) {
        const uniqueAccountIdError = t("notify.unique", {
          field: tH("staff.accountId")
        });
        throw new Error(uniqueAccountIdError);
      }
    }
    const { error: errPractitioner } = await ctx.supabase
      .from("Practitioner")
      .insert([{ id, ...toPractitioner(input) }])
      .select();
    if (errPractitioner) {
      throw errPractitioner;
    }
  }),

  update: protectedProcedure.input(z.object({ id: z.string(), ...dataModel })).mutation(async ({ ctx, input }) => {
    //update auth user supabase
    if (input.accountId) {
      const { error: errorUpdateAuthUser } = await ctx.adminSupabase.auth.admin.updateUserById(input.accountId, {
        user_metadata: {
          name: getOfficialName(input.name as HumanName[])
        }
      });
      if (errorUpdateAuthUser) throw errorUpdateAuthUser;
      //update table profiles
      const { error: errorUpdateProfiles } = await ctx.adminSupabase
        .from("profiles")
        .update({ name: input.name })
        .eq("id", input.accountId);
      if (errorUpdateProfiles) throw errorUpdateProfiles;
    }
    const { error: errorUpdatePractitioner } = await ctx.supabase
      .from("Practitioner")
      .update(toPractitioner(input))
      .eq("id", input.id);
    if (errorUpdatePractitioner) throw errorUpdatePractitioner;
  }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("Practitioner").delete().eq("id", input.id);
    if (error) {
      throw error;
    } else data;
  })
});
