"use client";
import { useAuthStore } from "@/components/auth/AuthContext";
import { PageHeader } from "@/components/layout";
import { TableRowActions, TableToolbar } from "@/components/table";
import genDocx from "@/hooks/genDocx";
import { useCustomTable } from "@/hooks/useCustomTable";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { isValidRole } from "@/lib/common";
import { localeDateTime } from "@/lib/datetime";
import { api } from "@/trpc/react";
import { Appointment } from "@/types";
import { AppointmentRole } from "@/types/enums";
import { Paper, Stack } from "@mantine/core";
import { MantineReactTable, MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useRouter } from "next/navigation";
import React from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function page() {
  const utils = api.useUtils();
  const { generateConsultation } = genDocx();
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();
  const [globalFilter, setGlobalFilter] = useState("");
  const { t, i18n } = useTranslation("consultation");
  const APPOINTMENT = t("appointment.name");
  const router = useRouter();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const userRole = useAuthStore()((state) => state.authUser?.session?.access_token?.user_role);
  const { data, isLoading, isFetching, isError } = api.appointment.get.useQuery({
    search: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  const { mutateAsync: deleteAppointment, isLoading: isDeleting } = api.appointment.delete.useMutation({
    onSuccess: async () => {
      await utils.appointment.invalidate();
      notifyResult(Action.Delete, APPOINTMENT, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, APPOINTMENT, false, e.message);
    }
  });

  const handleDelete = async (appointment: Appointment) => {
    if (!appointment) return;
    await deleteAppointment({ id: appointment.id });
  };

  const columns = useMemo<MRT_ColumnDef<Appointment>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("appointment.nameLabel")
      },
      {
        accessorKey: "start",
        header: t("appointment.start"),
        Cell: ({ cell }) => localeDateTime(cell.getValue<bigint>(), i18n.language)
      },
      {
        accessorKey: "status",
        header: t("appointment.status.name"),
        Cell: ({ cell }) => t(`appointment.status.${cell.getValue()}`)
      }
    ],
    [i18n.language]
  );

  const table = useCustomTable<Appointment>(
    {
      columns,
      data: data?.data ?? [],
      rowCount: data?.count || 0,
      state: {
        isLoading,
        isSaving: isDeleting,
        globalFilter,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching
      },
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: setPagination,
      getRowId: (row) => row.id,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onUpdate={
            isValidRole(userRole, [AppointmentRole.Admin, AppointmentRole.Moderator])
              ? () => router.push(`appointment/${row.id}/update`)
              : undefined
          }
          onDelete={
            isValidRole(userRole, [AppointmentRole.Admin, AppointmentRole.Moderator])
              ? () => confirmDelete(APPOINTMENT, () => handleDelete(row.original), "")
              : undefined
          }
          onView={() => router.push(`appointment/${row.id}/detail`)}
          onExport={() => generateConsultation(row.original)}
        />
      ),
      renderTopToolbar: () => <TableToolbar table={table} onCreate={() => router.push(`appointment/create`)} />
    },
    i18n.language
  );

  return (
    <Stack>
      <PageHeader title={t("appointment.name")} breadcrumbs={[APPOINTMENT]} />

      <Paper>
        <MantineReactTable table={table} />
      </Paper>
    </Stack>
  );
}

export default page;
