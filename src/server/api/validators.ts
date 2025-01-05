import { z } from "zod";

export const idValidator = z.object({
  id: z.string()
});

export const nameValidator = z.object({
  name: z.string()
});

export const searchModel = {
  search: z.string().optional(),
  pageIndex: z.number(),
  pageSize: z.number()
};

export const searchValidator = z.object(searchModel);
