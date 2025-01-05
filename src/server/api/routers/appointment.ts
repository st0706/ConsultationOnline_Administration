import { useServerTranslation } from "@/i18n/server";
import { isValidRole, slugify } from "@/lib/common";
import { sendInviteAppointmentEmail } from "@/lib/email/sendInviteAppointmentEmail";
import { DocumentAppointment } from "@/types";
import { AppointmentRole } from "@/types/enums";
import { TRPCError } from "@trpc/server";
import archiver from "archiver";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { idValidator, searchValidator } from "../validators";

const dataModel = {
  appointmentType: z.any().nullish(),
  cancellationDate: z.coerce.date().nullish(),
  created: z.coerce.date().nullish(),
  description: z.string().nullish(),
  end: z.coerce.date().nullish(),
  name: z.string(),
  note: z.any().nullish(),
  participant: z.any().nullish(),
  priority: z.any().nullish(),
  reason: z.any().nullish(),
  specialty: z.any().nullish(),
  start: z.coerce.date().nullish(),
  status: z.string(),
  subject: z.any().nullish()
};
const { t } = await useServerTranslation("consultation");
const toEntity = (input) => ({
  ...input,
  start: input.start ? new Date(input.start).getTime() : null,
  end: input.end ? new Date(input.end).getTime() : null,
  created: new Date().getTime(),
  subject: {
    ...input.subject,
    birthDate: input.subject?.birthDate ? new Date(input.subject.birthDate).getTime() : null,
    admissionTime: input.subject?.admissionTime ? new Date(input.subject.admissionTime).getTime() : null
  },
  participant: input.participant.map((value) => {
    return {
      id: value.id,
      accountId: value.accountId,
      type: value.type,
      status: value.status
    };
  })
});

const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const appointmentRouter = createTRPCRouter({
  get: protectedProcedure.input(searchValidator).query(async ({ ctx, input }) => {
    const { search, pageIndex, pageSize } = input;
    const userRole = ctx.session.user_role;
    const user = (await ctx.user).data.user;

    // Fetch all appointments
    let dataQuery = ctx.supabase.from("Appointment").select("*");

    // Filter by participant if the user role is Participant
    if (userRole === AppointmentRole.Participant) {
      const userId = `"` + user?.id + `"`; // Wrap user ID in quotes
      dataQuery = dataQuery.contains("participant", `[{ "accountId": ${userId} }]`);
    }

    // Fetch all appointments data
    const { data: appointments, error } = await dataQuery;
    if (error) {
      throw error;
    }

    // Filter by search (if provided)
    let filteredData = appointments;
    if (search) {
      filteredData = appointments.filter((row) => row.name?.toLowerCase().includes(search.toLowerCase()));
    }

    // Calculate total count after filtering
    const count = filteredData.length;

    // Apply pagination
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return { data: paginatedData, count, error: null };
  }),

  getCalendar: protectedProcedure.query(async ({ ctx }) => {
    const userRole = ctx.session.user_role;
    const user = (await ctx.user).data.user;

    // Fetch all appointments
    let dataQuery = ctx.supabase.from("Appointment").select("id,name,start,end,description");

    // Filter by participant if the user role is Participant
    if (userRole === AppointmentRole.Participant) {
      const userId = `"` + user?.id + `"`; // Wrap user ID in quotes
      dataQuery = dataQuery.contains("participant", `[{ "accountId": ${userId} }]`);
    }

    // Fetch all appointments data
    const { data: calendarEvents, error } = await dataQuery;
    if (error) {
      throw error;
    }
    return calendarEvents;
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const data = (await ctx.supabase.from("Appointment").select("*")).data;
    return data;
  }),
  cancelAppointment: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const appointment = (await ctx.supabase.from("Appointment").select("*").eq("id", input).single()).data;
    const user_id = (await ctx.user).data.user?.id;
    const user_role = ctx.session.user_role;
    const updateAppointmentStatus = async (status) => {
      const { data: updateData, error } = await ctx.supabase
        .from("Appointment")
        .update({
          status,
          approval:
            (appointment?.approval as any[])?.length > 0
              ? [
                  ...(appointment?.approval as any),
                  {
                    user: user_id,
                    approveAt: new Date().getTime(),
                    from: appointment?.status,
                    to: status
                  }
                ]
              : [
                  {
                    user: user_id,
                    approveAt: new Date().getTime(),
                    from: appointment?.status,
                    to: status
                  }
                ]
        })
        .eq("id", input)
        .select("*")
        .single();
      if (error) throw error;
      return updateData;
    };

    if (appointment?.status === "proposed" || appointment?.status === "approvedLevel1") {
      if (
        isValidRole(user_role, [
          AppointmentRole.ApproveLevel1,
          AppointmentRole.ApproveLevel2,
          AppointmentRole.Moderator,
          AppointmentRole.Admin
        ])
      ) {
        return await updateAppointmentStatus("cancelled");
      }

      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    } else if (appointment?.status === "approvedLevel2") {
      if (isValidRole(user_role, [AppointmentRole.ApproveLevel2, AppointmentRole.Moderator, AppointmentRole.Admin])) {
        return await updateAppointmentStatus("cancelled");
      }
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    } else {
      throw new TRPCError({
        message: t("BAD_REQUEST"),
        code: "BAD_REQUEST"
      });
    }
  }),
  revokeApprove: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const appointment = (await ctx.supabase.from("Appointment").select("*").eq("id", input).single()).data;
    const user_id = (await ctx.user).data.user?.id;
    const user_role = ctx.session.user_role;
    const updateAppointmentStatus = async (status) => {
      const { data: updateData, error } = await ctx.supabase
        .from("Appointment")
        .update({
          status,
          approval:
            (appointment?.approval as any[])?.length > 0
              ? [
                  ...(appointment?.approval as any),
                  {
                    user: user_id,
                    approveAt: new Date().getTime(),
                    from: appointment?.status,
                    to: status
                  }
                ]
              : [
                  {
                    user: user_id,
                    approveAt: new Date().getTime(),
                    from: appointment?.status,
                    to: status
                  }
                ]
        })
        .eq("id", input)
        .select("*")
        .single();
      if (error) throw error;
      return updateData;
    };

    if (appointment?.status === "approvedLevel1") {
      if (
        isValidRole(user_role, [
          AppointmentRole.ApproveLevel1,
          AppointmentRole.ApproveLevel2,
          AppointmentRole.Moderator,
          AppointmentRole.Admin
        ])
      ) {
        return await updateAppointmentStatus("proposed");
      }
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    } else if (appointment?.status === "approvedLevel2") {
      if (isValidRole(user_role, [AppointmentRole.ApproveLevel2, AppointmentRole.Moderator, AppointmentRole.Admin])) {
        return await updateAppointmentStatus("approvedLevel1");
      }
    } else {
      throw new TRPCError({
        message: t("BAD_REQUEST"),
        code: "BAD_REQUEST"
      });
    }
  }),
  endConsultation: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const { data: appointment, error: appointmentError } = await ctx.supabase
      .from("Appointment")
      .select("*")
      .eq("id", input)
      .single();
    if (appointmentError) throw appointmentError;
    const user_id = (await ctx.user).data.user?.id;
    const user_role = ctx.session.user_role;
    const members = appointment?.participant as any[];
    if (appointment?.status === "inProgress") {
      if (
        members.some(
          (mem) => mem.accountId === user_id && mem.type?.at(0).text === "ADMIN" && mem.status === "Accepted"
        ) ||
        isValidRole(user_role, [AppointmentRole.Admin, AppointmentRole.Moderator])
      ) {
        const { data: updatedAppointment, error: updateError } = await ctx.supabase
          .from("Appointment")
          .update({
            status: "fulfilled"
          })
          .eq("id", input);
        if (updateError) throw updateError;
        return updatedAppointment;
      } else {
        throw new TRPCError({
          message: t("FORBIDDEN"),
          code: "FORBIDDEN"
        });
      }
    } else {
      throw new TRPCError({
        message: t("BAD_REQUEST"),
        code: "BAD_REQUEST"
      });
    }
  }),
  approveAppointment: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const appointment = (await ctx.supabase.from("Appointment").select("*").eq("id", input).single()).data;
    const user_id = (await ctx.user).data.user?.id;
    const user_role = ctx.session.user_role;

    const updateAppointmentStatus = async (status) => {
      const { data: updateData, error } = await ctx.supabase
        .from("Appointment")
        .update({
          status: status,
          approval:
            (appointment?.approval as any[])?.length > 0
              ? [
                  ...(appointment?.approval as any),
                  {
                    user: user_id,
                    approveAt: new Date().getTime(),
                    from: appointment?.status,
                    to: status
                  }
                ]
              : [
                  {
                    user: user_id,
                    approveAt: new Date().getTime(),
                    from: appointment?.status,
                    to: status
                  }
                ]
        })
        .eq("id", input)
        .select("*")
        .single();
      if (error) throw error;
      return updateData;
    };

    if (appointment?.status === "proposed") {
      if (
        isValidRole(user_role, [
          AppointmentRole.ApproveLevel1,
          AppointmentRole.ApproveLevel2,
          AppointmentRole.Moderator,
          AppointmentRole.Admin
        ])
      ) {
        return await updateAppointmentStatus("approvedLevel1");
      }

      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    } else if (appointment?.status === "approvedLevel1") {
      if (isValidRole(user_role, [AppointmentRole.ApproveLevel2, AppointmentRole.Moderator, AppointmentRole.Admin])) {
        return await updateAppointmentStatus("approvedLevel2");
      }
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    } else if (appointment?.status === "cancelled") {
      if (isValidRole(user_role, [AppointmentRole.Moderator, AppointmentRole.Admin])) {
        return await updateAppointmentStatus("proposed");
      }
      throw new TRPCError({
        message: t("FORBIDDEN"),
        code: "FORBIDDEN"
      });
    } else {
      throw new TRPCError({
        message: t("BAD_REQUEST"),
        code: "BAD_REQUEST"
      });
    }
  }),
  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data: dataAppointment, error: errorAppointment } = await ctx.supabase
      .from("Appointment")
      .select("*")
      .eq("id", input)
      .single();
    if (errorAppointment) throw errorAppointment;
    const participantIDs = (dataAppointment?.participant as any[]).map((value) => value.id);
    const { data: participantData, error: errorParticipant } = await ctx.supabase
      .from("Practitioner")
      .select("*")
      .in("id", participantIDs);
    if (errorParticipant) throw errorParticipant;

    //custom field participant in AppointmentData
    let ID_dict: { [key: string]: any } = {};
    participantData?.forEach((item) => {
      ID_dict[item.id] = item;
    });
    const returnData = {
      ...dataAppointment,
      participant: (dataAppointment?.participant as any[]).map((item) => {
        let participant = ID_dict[item.id];
        if (participant) return { ...participant, ...item };
        else return item;
      })
    };

    return returnData;
  }),

  create: protectedProcedure
    .input(z.object({ id: z.string().uuid().default(uuidv4), ...dataModel }))
    .mutation(async ({ ctx, input }) => {
      const { data: dataCreated, error } = await ctx.supabase
        .from("Appointment")
        .insert(toEntity(input))
        .select()
        .single();
      if (error) {
        throw error;
      }

      //createDocumentAppointment
      const { error: errorCreateDocument } = await ctx.supabase.from("DocumentAppointment").insert([
        {
          name: dataCreated.name,
          path: `${slugify(dataCreated.name!)}-${dataCreated.created}/.emptyFolderPlaceholder`,
          appointmentId: dataCreated.id
        }
      ]);
      if (errorCreateDocument) {
        throw errorCreateDocument;
      }

      //create a bucket to store documents
      const file = new Blob([""]);
      const { error: errorFolder } = await ctx.supabase.storage
        .from("consultation")
        .upload(`${slugify(dataCreated.name!)}-${dataCreated.created}/.emptyFolderPlaceholder`, file, {
          cacheControl: "3600",
          upsert: false
        });
      if (errorFolder) throw errorFolder;

      //send gmail
      try {
        await Promise.all(
          input.participant.map(async (participant) => {
            const accountId = participant.accountId;
            if (accountId) {
              const { data: dataEmail, error: errorEmail } = await ctx.supabase
                .from("profiles")
                .select("email")
                .eq("id", accountId)
                .single();

              if (errorEmail) throw errorEmail;
              else if (dataEmail?.email) {
                await sendInviteAppointmentEmail({
                  email: dataEmail.email,
                  appointmentId: input.id
                });
              }
            }
          })
        );
      } catch (error) {
        console.error("Error during email sending:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while sending invite emails.",
          cause: error
        });
      }
    }),

  createFolder: protectedProcedure
    .input(z.object({ appointmentId: z.string(), path: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      //storage
      const folder = new Blob([""]);
      const { data: dataStorage, error: errorStorage } = await ctx.supabase.storage
        .from("consultation")
        .upload(input.path, folder, {
          cacheControl: "3600",
          upsert: false
        });
      if (errorStorage) throw errorStorage;

      //table
      const { error: errorTable } = await ctx.supabase.from("DocumentAppointment").insert([input]).select().single();
      if (errorTable) {
        throw errorTable;
      }

      return dataStorage;
    }),

  uploadFile: protectedProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        path: z.string(),
        name: z.string(),
        url: z.string(),
        documentTime: z.coerce.date().nullish(),
        fileNameOriginal: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      //table
      const { data: dataTable, error: errorTable } = await ctx.supabase
        .from("DocumentAppointment")
        .insert([{ ...input, documentTime: input.documentTime ? new Date(input.documentTime).getTime() : null }])
        .select()
        .single();
      if (errorTable) throw errorTable;
      return dataTable;
    }),

  rename: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string(), documentTime: z.coerce.date().nullish() }))
    .mutation(async ({ ctx, input }) => {
      //table
      const { data, error: errorTable } = await ctx.supabase
        .from("DocumentAppointment")
        .update({ name: input.name, documentTime: input.documentTime ? new Date(input.documentTime).getTime() : null })
        .eq("id", input.id)
        .select()
        .single();
      if (errorTable) throw errorTable;
      return data;
    }),

  update: protectedProcedure.input(z.object({ id: z.string(), ...dataModel })).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;
    const newParticipantData = updateData.participant.map((data) => data.id);
    const oldData = (await ctx.supabase.from("Appointment").select("participant").eq("id", id).single()).data;
    const oldParticipantData = (oldData?.participant as any).map((data) => data.id);
    const invitedParticipantsId = newParticipantData.filter((id) => !oldParticipantData.includes(id));

    const { error } = await ctx.supabase.from("Appointment").update(toEntity(updateData)).eq("id", input.id).single();
    if (error) {
      throw error;
    }

    //send gmail
    invitedParticipantsId.forEach(async (participantId: string) => {
      const { data: dataAccountId, error: errorGetAccount } = await ctx.supabase
        .from("Practitioner")
        .select("accountId")
        .eq("id", participantId)
        .single();
      if (errorGetAccount) throw errorGetAccount;
      const accountId = dataAccountId.accountId;
      if (accountId) {
        let { data: dataEmail, error: errorEmail } = await ctx.supabase
          .from("profiles")
          .select("email")
          .eq("id", accountId)
          .single();
        if (errorEmail) throw errorEmail;
        else {
          if (dataEmail?.email) sendInviteAppointmentEmail({ email: dataEmail?.email, appointmentId: id });
        }
      }
    });
  }),

  delete: protectedProcedure.input(idValidator).mutation(async ({ ctx, input }) => {
    const { error } = await ctx.supabase.from("Appointment").delete().eq("id", input.id);
    return error;
  }),

  deleteDocument: protectedProcedure.input(z.object({ path: z.string() })).mutation(async ({ ctx, input }) => {
    // table
    const { error: errorDeleteDocument } = await ctx.supabase
      .from("DocumentAppointment")
      .delete()
      .ilike("path", `${input.path}%`);
    if (errorDeleteDocument) throw errorDeleteDocument;

    //storage
    const getFilesInFolder = async (path) => {
      const { data: files, error } = await ctx.supabase.storage.from("consultation").list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      });
      if (error) throw error;
      return files;
    };

    const getAllDataFlatedInPath = async (path) => {
      // Get the files and folders in the current path
      const files = await getFilesInFolder(path);

      const treeData = await Promise.all(
        files.map(async (file) => {
          //it's a file
          if (file.id !== null) {
            return {
              name: `${path}/${file.name}`
            };
          }
          //it's a folder
          else {
            return await getAllDataFlatedInPath(`${path}/${file.name}`);
          }
        })
      );
      return treeData.flat(Infinity);
    };

    //Exc
    const dataFlated = await getAllDataFlatedInPath(input.path);
    const dataDeleted = dataFlated.map((data) => {
      return data.name;
    });
    if (dataDeleted.length > 0) {
      const { error: errorDeleteInStorage } = await ctx.supabase.storage.from("consultation").remove(dataDeleted);
      if (errorDeleteInStorage) throw errorDeleteInStorage;
    } else await ctx.supabase.storage.from("consultation").remove([input.path]);
  }),

  downloadFolder: protectedProcedure
    .input(
      z.array(
        z.object({
          path: z.string(),
          url: z.string()
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const zipBuffer: Uint8Array[] = [];
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.on("data", (data: Buffer) => {
        zipBuffer.push(new Uint8Array(data));
      });

      try {
        for (const file of input) {
          // Tải file từ Supabase
          const { data, error } = await ctx.supabase.storage.from("consultation").download(file.url);

          if (error) {
            throw new Error(`Error downloading file ${file.url}: ${error.message}`);
          }

          const buffer = await blobToBuffer(data!);

          // Append file vào zip với cấu trúc cây thư mục
          archive.append(buffer, { name: file.path });
        }

        // Đóng gói file zip
        await archive.finalize();

        // Tạo buffer cuối cùng
        const finalBuffer = new Uint8Array(zipBuffer.reduce((acc, curr) => acc + curr.length, 0));
        let offset = 0;
        for (const chunk of zipBuffer) {
          finalBuffer.set(chunk, offset);
          offset += chunk.length;
        }

        return {
          zipBuffer: finalBuffer
        };
      } catch (error: any) {
        throw new Error(`Failed to create zip: ${error.message}`);
      }
    }),

  getBucket: protectedProcedure
    .input(z.object({ name: z.string(), created: z.number().nullish() }))
    .query(async ({ ctx, input }) => {
      const initialPath = input.name && `${slugify(input.name)}-${input.created}`;
      const getFilesInFolder = async (path) => {
        const { data: files, error } = await ctx.supabase.storage.from("consultation").list(`${path}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" }
        });
        if (error) throw error;
        return files;
      };

      const buildTreeData = async (path = "") => {
        // Get the files and folders in the current path
        const files = await getFilesInFolder(path);

        const treeData = await Promise.all(
          files.map(async (file) => {
            //it's a file
            if (file.id !== null) {
              const { data: dataUrl } = await ctx.supabase.storage
                .from("consultation")
                .getPublicUrl(`${path}/${file.name}`);
              return {
                ...file,
                label: file.name,
                value: `${path}/${file.name}`,
                url: dataUrl.publicUrl
              };
            }
            //it's a folder
            else {
              const children = await buildTreeData(`${path}/${file.name}`);
              return {
                ...file,
                label: file.name,
                value: `${path}/${file.name}`,
                children
              };
            }
          })
        );
        return treeData;
      };

      //Exc
      return { treeData: await buildTreeData(initialPath), initialPath };
    }),

  getDocumentTree: protectedProcedure.input(z.object({ appointmentId: z.string() })).query(async ({ ctx, input }) => {
    let { data: dataDocumentTree, error } = await ctx.supabase
      .from("DocumentAppointment")
      .select("*")
      .eq("appointmentId", input.appointmentId);

    if (error) throw error;
    function buildData(nodes: DocumentAppointment[]) {
      const buildTree = (parentPath: string) => {
        const children: any = [];
        nodes
          .filter((node) => {
            const cleanedPath = node.path!.replace("/.emptyFolderPlaceholder", "");
            const relativePath = cleanedPath.slice(parentPath.length);
            const isDirectChild = relativePath.indexOf("/") === -1; // Xác định node con trực tiếp
            return cleanedPath.startsWith(parentPath) && isDirectChild;
          })
          .forEach((node) => {
            const newChild = {
              ...node,
              label: node.name,
              value: node.path,
              children: buildTree(node.path!.replace("/.emptyFolderPlaceholder", "") + "/")
            };
            if (newChild.children && newChild.children.length === 0) {
              delete newChild.children;
            }
            children.push(newChild);
          });

        return children;
      };

      return buildTree("");
    }

    return buildData(dataDocumentTree!);
  })
});
