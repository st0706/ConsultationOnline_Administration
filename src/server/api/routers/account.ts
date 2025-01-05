import { useServerTranslation } from "@/i18n/server";
import { getOfficialName } from "@/lib/common";
import { AppointmentRole } from "@/types/enums";
import { TRPCError } from "@trpc/server";
import { HumanName } from "fhir/r5";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { idValidator, searchValidator } from "../validators";
import { toPractitioner } from "./practitioner";
import { createClient } from "@/utils/supabase/server";

interface UpdateUserPayload {
  email: string;
  user_metadata: {
    name: string;
    email: string;
  };
  password?: string;
}

const dataModel = {
  name: z.any(),
  email: z.string(),
  password: z.string().optional(),
  role: z.string()
};

const dataUserModel = {
  name: z.any(),
  email: z.string(),
  password: z.string().optional(),
  image: z.string().nullish()
};

const { t } = await useServerTranslation("consultation");

export const accountRouter = createTRPCRouter({
  get: protectedProcedure.input(searchValidator).query(async ({ ctx, input }) => {
    const { search, pageIndex, pageSize } = input;

    // Fetch all profiles data
    const { data: profiles, error: errorProfiles } = await ctx.adminSupabase
      .from("profiles")
      .select("id,name,email,user_roles(role),Practitioner(name)");
    if (errorProfiles) {
      throw errorProfiles;
    }

    // Format the data to include role
    let formattedData = profiles?.map((row) => {
      const { user_roles, ...otherData } = row;
      return { ...otherData, role: user_roles.at(0)?.role };
    });

    // Filter by search keyword if provided
    if (search) {
      formattedData = formattedData?.filter((row) => row.email?.includes(search));
    }

    // Calculate total count after filtering
    const count = formattedData?.length || 0;

    // Apply pagination
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = formattedData?.slice(startIndex, endIndex);

    return { data: paginatedData, count, error: null };
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const dataQuery = ctx.adminSupabase.from("profiles").select("id,name,email,user_roles(role)");
    const { data, error } = await dataQuery.then((res) => {
      const formatData = res.data?.map((row) => {
        const { user_roles, ...otherData } = row;
        return { ...otherData, role: user_roles.at(0)?.role };
      });
      return { ...res, data: formatData };
    });
    if (error) throw error;
    return data;
  }),
  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = (await ctx.adminSupabase.from("profiles").select("*").eq("id", input).single()).data;
    return data;
  }),

  create: protectedProcedure.input(z.object(dataModel)).mutation(async ({ ctx, input }) => {
    //check role
    const user_role = ctx.session.user_role;
    if (!user_role || user_role !== AppointmentRole.Admin) {
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    }
    //insert auth user supabase
    const { data, error } = await ctx.adminSupabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        name: getOfficialName(input.name as HumanName[]),
        email: input.email
      }
    });
    if (error) throw error;
    //insert table profiles
    const { error: errorProfiles } = await ctx.adminSupabase
      .from("profiles")
      .insert({ id: data.user.id, name: input.name, email: input.email });
    if (errorProfiles) throw errorProfiles;
    //insert table user_roles
    const { data: role, error: errorRole } = await ctx.adminSupabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: input.role as any })
      .select("*")
      .single();
    if (errorRole) throw errorRole;
    //create Practitioner
    if (!(input.name[0].family === "" || input.name[0].given.length === 0 || input.name[0].given?.at(0) === "")) {
      const id = uuidv4();
      const { error: errPractitioner } = await ctx.adminSupabase
        .from("Practitioner")
        .insert([{ id, ...toPractitioner({ name: input.name, accountId: data.user.id }) }])
        .select();
      if (errPractitioner) throw errPractitioner;
    }
    return {
      ...data.user,
      role: role?.role
    };
  }),

  update: protectedProcedure.input(z.object({ id: z.string(), ...dataModel })).mutation(async ({ ctx, input }) => {
    const user_role = ctx.session.user_role;
    if (!user_role || user_role !== AppointmentRole.Admin) {
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    }
    const updatePayload: UpdateUserPayload = {
      email: input.email,
      user_metadata: {
        name: getOfficialName(input.name as HumanName[]),
        email: input.email
      }
    };
    if (input.password) {
      updatePayload.password = input.password;
    }
    const { data: currentUser } = await ctx.supabase.from("profiles").select("email").eq("id", input.id).single();

    if (!currentUser) {
      throw new Error("User not found");
    }
    if (currentUser.email !== input.email) {
      const { data: listUsers } = await ctx.supabase.from("profiles").select("email");

      if (listUsers?.some((obj) => obj.email === input.email))
        throw new Error("A user with this email address has already been registered");
    }
    //update auth user supabase
    const { data, error } = await ctx.adminSupabase.auth.admin.updateUserById(input.id, updatePayload);
    if (error) throw error;
    //update table user_roles
    const { data: role, error: errorRole } = await ctx.adminSupabase
      .from("user_roles")
      .update({ role: input.role as any })
      .eq("user_id", input.id)
      .select("*")
      .single();
    if (errorRole) throw errorRole;
    //update table profiles
    const { error: errorUpdateProfiles } = await ctx.adminSupabase
      .from("profiles")
      .update({ name: input.name, email: input.email })
      .eq("id", input.id);
    if (errorUpdateProfiles) throw errorUpdateProfiles;
    //update table Practitioner
    if (!(input.name[0].family === "" || input.name[0].given.length === 0 || input.name[0].given?.at(0) === "")) {
      const { data: recordExisted } = await ctx.supabase
        .from("Practitioner")
        .select("id")
        .eq("accountId", input.id)
        .single();
      if (recordExisted) {
        const { error: errorUpdatePractitioner } = await ctx.adminSupabase
          .from("Practitioner")
          .update({ name: input.name })
          .eq("accountId", input.id);
        if (errorUpdatePractitioner) throw errorUpdatePractitioner;
      } else {
        const id = uuidv4();
        const { error: errPractitioner } = await ctx.adminSupabase
          .from("Practitioner")
          .insert([{ id, ...toPractitioner({ name: input.name, accountId: data.user.id }) }])
          .select();
        if (errPractitioner) throw errPractitioner;
      }
    }
    return {
      ...data.user,
      role: role?.role
    };
  }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    const user_role = ctx.session.user_role;
    if (!user_role || user_role !== AppointmentRole.Admin) {
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    }
    const { data, error } = await ctx.adminSupabase.auth.admin.deleteUser(input.id);
    if (error) throw error;
    return data;
  }),

  updateAccountProfile: protectedProcedure
    .input(z.object({ id: z.string(), ...dataUserModel }))
    .mutation(async ({ ctx, input }) => {
      const updatePayload: UpdateUserPayload = {
        email: input.email,
        user_metadata: {
          name: getOfficialName(input.name as HumanName[]),
          email: input.email
        }
      };
      if (input.password) {
        updatePayload.password = input.password;
      }

      const { data: currentUser } = await ctx.supabase.from("profiles").select("email").eq("id", input.id).single();

      if (!currentUser) {
        throw new Error("User not found");
      }
      if (currentUser.email !== input.email) {
        const { data: listUsers } = await ctx.supabase.from("profiles").select("email");

        if (listUsers?.some((obj) => obj.email === input.email))
          throw new Error("A user with this email address has already been registered");
      }
      //update auth user supabase
      const { data, error } = await ctx.adminSupabase.auth.admin.updateUserById(input.id, updatePayload);
      if (error) throw error;
      //update table profiles
      const { error: errorUpdateProfiles } = await ctx.adminSupabase
        .from("profiles")
        .update({ name: input.name, email: input.email })
        .eq("id", input.id);
      if (errorUpdateProfiles) throw errorUpdateProfiles;
      //update table Practitioner
      if (!(input.name[0].family === "" || input.name[0].given.length === 0 || input.name[0].given?.at(0) === "")) {
        const { data: recordExisted } = await ctx.supabase
          .from("Practitioner")
          .select("id")
          .eq("accountId", input.id)
          .single();
        if (recordExisted) {
          const { error: errorUpdatePractitioner } = await ctx.adminSupabase
            .from("Practitioner")
            .update({ name: input.name })
            .eq("accountId", input.id);
          if (errorUpdatePractitioner) throw errorUpdatePractitioner;
        } else {
          const id = uuidv4();
          const { error: errPractitioner } = await ctx.adminSupabase
            .from("Practitioner")
            .insert([{ id, ...toPractitioner({ name: input.name, accountId: data.user.id }) }])
            .select();
          if (errPractitioner) throw errPractitioner;
        }
      }
      return {
        ...data.user
      };
    }),

  register: publicProcedure.input(z.object(dataModel)).mutation(async ({ ctx, input }) => {
    const supabase = createClient();
    //insert auth user supabase
    const { data, error } = await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        name: getOfficialName(input.name as HumanName[]),
        email: input.email
      }
    });
    if (error) throw error;
    //insert table profiles
    const { error: errorProfiles } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, name: input.name, email: input.email });
    if (errorProfiles) throw errorProfiles;
    //insert table user_roles
    const { data: role, error: errorRole } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: input.role as any })
      .select("*")
      .single();
    if (errorRole) throw errorRole;
    //create Practitioner
    if (!(input.name[0].family === "" || input.name[0].given.length === 0 || input.name[0].given?.at(0) === "")) {
      const id = uuidv4();
      const { error: errPractitioner } = await ctx.adminSupabase
        .from("Practitioner")
        .insert([{ id, ...toPractitioner({ name: input.name, accountId: data.user.id }) }])
        .select();
      if (errPractitioner) throw errPractitioner;
    }
    return {
      ...data.user,
      role: role?.role
    };
  })
});
