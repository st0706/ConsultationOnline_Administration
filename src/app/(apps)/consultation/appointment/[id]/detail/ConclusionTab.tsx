"use client";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { localeDate } from "@/lib/datetime";
import { api } from "@/trpc/react";
import { Paper, Stack } from "@mantine/core";
import { MRT_ColumnDef, MRT_PaginationState, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import ConclusionForm from "./ConclusionForm";

const ConclusionTab = () => {
  const { t, i18n } = useTranslation("consultation");
  const CONCLUSION = t("appointment.conclusion.name");
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const { id } = useParams();
  const { data, isLoading, isFetching, isError } = api.conclusion.get.useQuery({
    id: id as string,
    search: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  const { notifyResult } = useNotify();
  const { confirmDelete, actionForm } = useModal();
  const trpcContext = api.useUtils();

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.conclusion.delete.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Delete, CONCLUSION, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, CONCLUSION, false, e.message);
    }
  });

  const handleDelete = (row: any) =>
    confirmDelete(
      CONCLUSION,
      async () => {
        await deleteOne({ id: row.id });
      },
      row.code
    );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "profiles.name",
        header: t("appointment.conclusion.createdBy")
      },
      {
        accessorKey: "createdAt",
        header: t("appointment.conclusion.createdAt"),
        Cell: ({ cell }) => localeDate(cell.getValue<number>())
      },
      {
        accessorKey: "updatedAt",
        header: t("appointment.conclusion.updatedAt"),
        Cell: ({ cell }) => localeDate(cell.getValue<number>())
      }
    ],
    [i18n.language]
  );

  const table = useCustomTable<any>(
    {
      columns,
      data: data?.data || [],
      rowCount: data?.count || 0,
      state: {
        isLoading,
        isSaving: isDeleting,
        globalFilter,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching
      },
      manualFiltering: true,
      onGlobalFilterChange: setGlobalFilter,
      manualPagination: true,
      onPaginationChange: setPagination,
      getRowId: (row) => row.id,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onUpdate={() =>
            actionForm("update-conclusion", CONCLUSION, ConclusionForm, false, async (values) => {}, row.original)
          }
          onDelete={() => handleDelete(row.original)}
        />
      ),
      renderTopToolbar: () => (
        <TableToolbar
          table={table}
          onCreate={() => actionForm("create-conclusion", CONCLUSION, ConclusionForm, false, async (values) => {})}
        />
      )
    },
    i18n.language
  );

  return (
    <Stack>
      <Paper>
        <MantineReactTable table={table} />
      </Paper>
    </Stack>
  );
};

export default ConclusionTab;
