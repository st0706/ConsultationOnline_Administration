import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { searchValidator } from "../validators";

export const adDivisionRouter = createTRPCRouter({
  getAdDivisions: protectedProcedure.input(searchValidator).query(async ({ ctx, input }) => {
    const { pageIndex, pageSize } = input;
    const search = input.search || "";
    let countQuery = ctx.supabase.from("Wards").select("*", { count: "exact", head: true });
    let dataQuery = ctx.supabase.from("Wards").select("*");

    if (search) {
      const searchQuery = `wardName.ilike.%${search}%,wardCode.ilike.%${search}%,cityName.ilike.%${search}%,districtName.ilike.%${search}%,cityId.ilike.%${search}%,districtId.ilike.%${search}%`;
      countQuery = countQuery.or(searchQuery);
      dataQuery = dataQuery.or(searchQuery);
    }
    const { count } = await countQuery;
    const { data, error } = await dataQuery
      .select("*,city:cityId(cityCode,cityName), district:districtId(districtCode,districtName,cityId)")
      .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);
    return {
      count,
      data: data ? data : [],
      error
    };
  }),

  create: protectedProcedure
    .input(
      z.object({
        wardCode: z.string(),
        wardName: z.string(),
        districtId: z.string(),
        districtName: z.string(),
        cityId: z.string(),
        cityName: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { wardCode, wardName, districtId, districtName, cityId, cityName } = input;
      await ctx.supabase.from("Cities").insert({ cityCode: cityId, cityName: cityName }).select();
      await ctx.supabase
        .from("Districts")
        .insert({
          districtCode: districtId,
          districtName: districtName,
          cityId: cityId,
          cityName: cityName
        })
        .select();
      return await ctx.supabase
        .from("Wards")
        .insert({
          wardCode: wardCode,
          wardName: wardName,
          cityId: cityId,
          cityName: cityName,
          districtId: districtId,
          districtName: districtName
        })
        .select();
    }),

  update: protectedProcedure
    .input(
      z.object({
        wardCode: z.string(),
        wardName: z.string(),
        districtId: z.string(),
        districtName: z.string(),
        cityId: z.string(),
        cityName: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { wardCode, wardName, districtId, districtName, cityId, cityName } = input;
      await ctx.supabase
        .from("Cities")
        .update({ cityCode: cityId, cityName: cityName })
        .eq("cityCode", cityId)
        .select();
      await ctx.supabase
        .from("Districts")
        .update({ districtCode: districtId, districtName: districtName, cityId: cityId, cityName: cityName })
        .eq("districtCode", districtId)
        .select();
      return await ctx.supabase
        .from("Wards")
        .update({
          wardCode: wardCode,
          wardName: wardName,
          districtId: districtId,
          districtName: districtName,
          cityId: cityId,
          cityName: cityName
        })
        .eq("wardCode", wardCode)
        .select();
    }),

  import: protectedProcedure
    .input(
      z.object({
        dataUpload: z.array(
          z.object({
            wardCode: z.string(),
            wardName: z.string(),
            districtId: z.string(),
            districtName: z.string(),
            cityId: z.string(),
            cityName: z.string()
          })
        ),
        importMethod: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { dataUpload, importMethod } = input;
      const dataUploadCities = dataUpload.map(({ cityId, cityName }) => ({ cityCode: cityId, cityName }));
      const dataUploadDistricts = dataUpload.map(({ districtId, districtName, cityId, cityName }) => ({
        districtCode: districtId,
        districtName,
        cityId,
        cityName
      }));
      const dataUploadWards = dataUpload.map(({ wardCode, wardName, districtId, districtName, cityId, cityName }) => ({
        wardCode,
        wardName,
        districtId,
        districtName,
        cityId,
        cityName
      }));
      let result: { data: any; error: any } | null = null;
      switch (importMethod) {
        case "RESET":
          const { count } = await ctx.supabase.from("Cities").select("*", { count: "exact", head: true });
          if (count && count > 0) await ctx.supabase.from("Cities").delete();
          await ctx.supabase.from("Cities").insert(dataUploadCities);
          await ctx.supabase.from("Districts").insert(dataUploadDistricts);
          result = await ctx.supabase.from("Wards").insert(dataUploadWards).select();

        case "UPDATE":
          await ctx.supabase.from("Cities").upsert(dataUploadCities, {
            onConflict: "cityCode",
            ignoreDuplicates: false
          });
          await ctx.supabase.from("Districts").upsert(dataUploadDistricts, {
            onConflict: "districtCode",
            ignoreDuplicates: false
          });
          result = await ctx.supabase
            .from("Wards")
            .upsert(dataUploadWards, {
              onConflict: "wardCode",
              ignoreDuplicates: false
            })
            .select();

        case "ADD_NEW_ONLY":
          await ctx.supabase.from("Cities").upsert(dataUploadCities, {
            onConflict: "cityCode",
            ignoreDuplicates: true
          });
          await ctx.supabase.from("Districts").upsert(dataUploadDistricts, {
            onConflict: "districtCode",
            ignoreDuplicates: true
          });
          result = await ctx.supabase
            .from("Wards")
            .upsert(dataUploadWards, {
              onConflict: "wardCode",
              ignoreDuplicates: true
            })
            .select();
      }
      return result;
    }),

  getAllCities: protectedProcedure.query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("Cities").select("cityName");
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error("No data returned from Supabase.");
    }
    return data.map((item) => item.cityName);
  }),

  getAllDistricts: protectedProcedure
    .input(
      z.object({
        cityName: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("Districts")
        .select("districtName")
        .eq("cityName", input.cityName);
      if (error) {
        throw new Error(error.message);
      }
      if (!data) {
        throw new Error("No data returned from Supabase.");
      }
      return data.map((item) => item.districtName);
    }),

  getAllWards: protectedProcedure
    .input(
      z.object({
        cityName: z.string(),
        districtName: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("Wards")
        .select("wardName")
        .eq("cityName", input.cityName)
        .eq("districtName", input.districtName);
      if (error) {
        throw new Error(error.message);
      }
      if (!data) {
        throw new Error("No data returned from Supabase.");
      }
      return data.map((item) => item.wardName);
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    const { error } = await ctx.supabase.from("Cities").delete().not("cityCode", "is", null);
    return error;
  }),

  delete: protectedProcedure
    .input(
      z.object({
        idCity: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("Cities").delete().eq("cityCode", input.idCity);
      return error;
    })
});
